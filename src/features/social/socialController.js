import { HttpError } from "../../shared/http/errors.js";
import { readBody } from "../../shared/http/request.js";
import {
  cancelSocialMateRequest,
  createSocialComment,
  createSocialMateRequest,
  createSocialPost,
  deleteSocialPostById,
  findSocialCommentById,
  findSocialPostById,
  getSocialAvatarObject,
  getSocialFeed,
  getSocialMateStatus,
  listSocialMateRequests,
  listSocialMates,
  getSocialNotifications,
  getSocialPostById,
  getSocialPostImageObject,
  markSocialNotificationRead,
  markSocialNotificationsSeen,
  removeSocialMate,
  respondToSocialMateRequest,
  setSocialMateFollowState,
  toggleSocialCommentReaction,
  toggleSocialReaction,
} from "../../infrastructure/db/social.js";
import { objectToResponse } from "./helpers/http.js";
import { parseDataImage, parseDataImages, parsePositiveId, sanitizePostText } from "./helpers/validation.js";
import { decodePostImageKeys, encodePostImageKeys, maxPostImages } from "../../shared/social/postImages.js";
import { findUserById } from "../../infrastructure/db/usersRepository.js";

const FEED_LIMIT_DEFAULT = 12;
const FEED_LIMIT_MIN = 4;
const FEED_LIMIT_MAX = 30;
const FEED_MAX_BYTES_DEFAULT = 220_000;
const FEED_MAX_BYTES_MIN = 40_000;
const FEED_MAX_BYTES_MAX = 700_000;

function mentionTokenFromName(name) {
  const normalized = String(name || "")
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_.]/g, "");
  return normalized ? ("@" + normalized) : "";
}

function clampInt(value, fallback, min, max) {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(min, Math.min(max, parsed));
}

function toBase64Url(input) {
  if (typeof btoa !== "function") throw new HttpError(500, "Encoding is not available");
  const encoded = btoa(input);
  return encoded.replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/g, "");
}

function fromBase64Url(input) {
  const normalized = String(input || "").replaceAll("-", "+").replaceAll("_", "/");
  const padded = normalized + "===".slice((normalized.length + 3) % 4);
  if (typeof atob !== "function") throw new HttpError(500, "Decoding is not available");
  return atob(padded);
}

function decodeFeedCursor(cursor) {
  const raw = String(cursor || "").trim();
  if (!raw) return null;
  try {
    const parsed = JSON.parse(fromBase64Url(raw));
    const createdAt = String(parsed?.createdAt || "");
    const id = Number.parseInt(String(parsed?.id || 0), 10);
    if (!createdAt || !Number.isInteger(id) || id <= 0) return null;
    return { createdAt, id };
  } catch {
    return null;
  }
}

function encodeFeedCursor(post) {
  const id = Number.parseInt(String(post?.id || 0), 10);
  const createdAt = String(post?.createdAt || "");
  if (!createdAt || !Number.isInteger(id) || id <= 0) return "";
  return toBase64Url(JSON.stringify({ createdAt, id }));
}

export async function socialFeed(env, viewer, options = {}) {
  const scope = String(options?.scope || "").toLowerCase() === "mine" ? "mine" : "feed";
  if (scope === "mine" && !viewer) throw new HttpError(401, "Login required to view your posts");
  const requestedUserId = Number.parseInt(String(options?.userId || 0), 10);
  const feedAuthorId = scope === "mine"
    ? Number(viewer?.id || 0)
    : (Number.isInteger(requestedUserId) && requestedUserId > 0 ? requestedUserId : 0);

  const feedLimit = clampInt(options?.limit, FEED_LIMIT_DEFAULT, FEED_LIMIT_MIN, FEED_LIMIT_MAX);
  const feedMaxBytes = clampInt(options?.maxBytes, FEED_MAX_BYTES_DEFAULT, FEED_MAX_BYTES_MIN, FEED_MAX_BYTES_MAX);
  const cursor = decodeFeedCursor(options?.cursor);

  const feedResult = await getSocialFeed(env.DB, viewer?.id || 0, feedLimit, {
    authorId: feedAuthorId,
    cursorCreatedAt: cursor?.createdAt || "",
    cursorId: cursor?.id || 0,
    maxBytes: feedMaxBytes,
  });
  const posts = Array.isArray(feedResult?.posts) ? feedResult.posts : [];
  const hasMore = Boolean(feedResult?.hasMore);
  const nextCursor = hasMore && posts.length ? encodeFeedCursor(posts[posts.length - 1]) : "";

  return {
    viewer: viewer
      ? {
        id: Number(viewer.id),
        name: viewer.name || "",
        avatarUrl: viewer.avatar_key ? `/api/social/avatar/${viewer.id}` : "",
      }
      : null,
    canInteract: Boolean(viewer),
    scope,
    posts,
    hasMore,
    nextCursor,
    loadedBytes: Number(feedResult?.totalBytes || 0),
  };
}

export async function socialPost(env, viewer, postId) {
  const id = parsePositiveId(postId, "post id");
  const post = await getSocialPostById(env.DB, viewer?.id || 0, id);
  if (!post) throw new HttpError(404, "Post not found");
  return {
    canInteract: Boolean(viewer),
    post,
  };
}

export async function createPost(request, env, viewer) {
  if (!viewer) throw new HttpError(401, "Login required to create posts");
  const body = await readBody(request, { maxBodySize: 6_800_000 });
  const postText = sanitizePostText(body?.text);
  const imagesFromList = parseDataImages(body?.imagesData);
  const fallbackSingle = imagesFromList.length ? null : parseDataImage(body?.imageData);
  const images = imagesFromList.length ? imagesFromList : (fallbackSingle ? [fallbackSingle] : []);
  if (images.length > maxPostImages()) {
    throw new HttpError(400, `You can attach up to ${maxPostImages()} images`);
  }

  if (!postText && !images.length) throw new HttpError(400, "Post text or image is required");
  if (postText.length > 1200) throw new HttpError(400, "Post text must be 1200 characters or fewer");

  const imageKeys = [];
  if (images.length) {
    if (!env?.BUCKET || typeof env.BUCKET.put !== "function") {
      throw new HttpError(500, "Image storage is not configured");
    }
    const batchId = Date.now();
    for (let index = 0; index < images.length; index += 1) {
      const image = images[index];
      const imageKey = `social/posts/${viewer.id}/${batchId}-${index}.${image.ext}`;
      await env.BUCKET.put(imageKey, image.binary, {
        httpMetadata: { contentType: image.contentType, cacheControl: "public, max-age=604800" },
      });
      imageKeys.push(imageKey);
    }
  }

  const postId = await createSocialPost(env.DB, {
    userId: viewer.id,
    body: postText,
    imageKey: encodePostImageKeys(imageKeys),
  });

  return { ok: true, postId };
}

async function safeDeleteBucketObject(env, key) {
  const safeKey = String(key || "").trim();
  if (!safeKey || !env?.BUCKET || typeof env.BUCKET.delete !== "function") return;
  try {
    await env.BUCKET.delete(safeKey);
  } catch {
    // Ignore cleanup errors for stale objects.
  }
}

export async function deletePost(env, viewer, postId) {
  if (!viewer) throw new HttpError(401, "Login required to delete posts");
  const id = parsePositiveId(postId, "post id");
  const post = await findSocialPostById(env.DB, id);
  if (!post) throw new HttpError(404, "Post not found");
  if (Number(post.admin_id) !== Number(viewer.id)) {
    throw new HttpError(403, "You can delete only your own post");
  }

  const imageKeys = decodePostImageKeys(post.image_key);
  const result = await deleteSocialPostById(env.DB, { postId: id });
  for (const key of imageKeys) {
    await safeDeleteBucketObject(env, key);
  }

  return {
    ok: Boolean(result?.ok),
    postId: id,
  };
}

export async function createComment(request, env, viewer, postId) {
  if (!viewer) throw new HttpError(401, "Login required to comment");
  const id = parsePositiveId(postId, "post id");

  const post = await findSocialPostById(env.DB, id);
  if (!post) throw new HttpError(404, "Post not found");

  const body = await readBody(request);
  let text = sanitizePostText(body?.text);
  if (!text) throw new HttpError(400, "Comment text is required");
  if (text.length > 600) throw new HttpError(400, "Comment must be 600 characters or fewer");
  const rawParentId = body?.parentCommentId ?? body?.replyToCommentId ?? 0;
  const parsedParentId = Number.parseInt(String(rawParentId || 0), 10);
  const hasParentInput = String(rawParentId ?? "").trim() !== "" && String(rawParentId ?? "") !== "0";
  if (hasParentInput && (!Number.isInteger(parsedParentId) || parsedParentId <= 0)) {
    throw new HttpError(400, "Invalid parent comment id");
  }

  let parentCommentId = 0;
  if (Number.isInteger(parsedParentId) && parsedParentId > 0) {
    const parent = await findSocialCommentById(env.DB, parsedParentId);
    if (!parent) throw new HttpError(404, "Parent comment not found");
    if (Number(parent.post_id) !== id) throw new HttpError(400, "Parent comment does not belong to this post");
    const rootParentId = Number.parseInt(String(parent.parent_comment_id || 0), 10);
    if (Number.isInteger(rootParentId) && rootParentId > 0) {
      parentCommentId = rootParentId;
      const mentionToken = mentionTokenFromName(parent.author_name || "");
      if (mentionToken) {
        const startsWithMention = text.toLowerCase().startsWith(mentionToken.toLowerCase() + " ")
          || text.toLowerCase() === mentionToken.toLowerCase();
        if (!startsWithMention) {
          text = `${mentionToken} ${text}`.trim();
        }
      }
    } else {
      parentCommentId = parsedParentId;
    }
  }

  if (text.length > 600) throw new HttpError(400, "Comment must be 600 characters or fewer");

  await createSocialComment(env.DB, {
    postId: id,
    userId: viewer.id,
    body: text,
    parentCommentId,
  });

  return { ok: true, parentCommentId: parentCommentId || 0 };
}

export async function toggleReaction(env, viewer, postId) {
  if (!viewer) throw new HttpError(401, "Login required to react");
  const id = parsePositiveId(postId, "post id");

  const post = await findSocialPostById(env.DB, id);
  if (!post) throw new HttpError(404, "Post not found");

  return toggleSocialReaction(env.DB, { postId: id, userId: viewer.id });
}

export async function toggleCommentReaction(env, viewer, commentId) {
  if (!viewer) throw new HttpError(401, "Login required to react");
  const id = parsePositiveId(commentId, "comment id");
  const comment = await findSocialCommentById(env.DB, id);
  if (!comment) throw new HttpError(404, "Comment not found");
  return toggleSocialCommentReaction(env.DB, { commentId: id, userId: viewer.id });
}

export async function socialAvatar(env, userId) {
  const id = parsePositiveId(userId, "user id");
  const object = await getSocialAvatarObject(env, id);
  if (!object) throw new HttpError(404, "Avatar not found");
  return objectToResponse(object);
}

export async function socialPostImage(env, postId, options = {}) {
  const id = parsePositiveId(postId, "post id");
  const requestedIndex = Number.parseInt(String(options?.index ?? 0), 10);
  const imageIndex = Number.isInteger(requestedIndex) && requestedIndex >= 0 ? requestedIndex : 0;
  const object = await getSocialPostImageObject(env, id, imageIndex);
  if (!object) throw new HttpError(404, "Image not found");
  return objectToResponse(object);
}

export async function socialNotifications(env, viewer, options = {}) {
  if (!viewer) throw new HttpError(401, "Login required to view notifications");
  const limit = clampInt(options?.limit, 32, 1, 80);
  const response = await getSocialNotifications(env.DB, Number(viewer.id), limit);
  return {
    notifications: Array.isArray(response?.notifications) ? response.notifications : [],
    count: Number(response?.count || 0),
    unreadCount: Number(response?.unreadCount || 0),
    hasUnseen: Boolean(response?.hasUnseen),
    seenAt: String(response?.seenAt || ""),
  };
}

export async function socialNotificationsSeen(env, viewer) {
  if (!viewer) throw new HttpError(401, "Login required to view notifications");
  const result = await markSocialNotificationsSeen(env.DB, {
    userId: Number(viewer.id),
    seenAt: new Date().toISOString(),
  });
  return {
    ok: Boolean(result?.ok),
    seenAt: String(result?.seenAt || ""),
  };
}

export async function socialNotificationRead(request, env, viewer) {
  if (!viewer) throw new HttpError(401, "Login required to view notifications");
  const body = await readBody(request);
  const notificationId = String(body?.id || "").trim();
  if (!notificationId) throw new HttpError(400, "Notification id is required");
  if (notificationId.length > 220) throw new HttpError(400, "Notification id is too long");
  const result = await markSocialNotificationRead(env.DB, {
    userId: Number(viewer.id),
    notificationId,
    readAt: new Date().toISOString(),
  });
  return {
    ok: Boolean(result?.ok),
    readAt: String(result?.readAt || ""),
    id: notificationId,
  };
}

async function ensureMateTargetUser(env, targetUserId) {
  const target = await findUserById(env.DB, targetUserId);
  if (!target) throw new HttpError(404, "User not found");
  return {
    id: Number(target.id || 0),
    name: String(target.name || "User"),
    email: String(target.email || ""),
    role: String(target.user_type || ""),
    avatarUrl: target.avatar_key ? `/api/social/avatar/${target.id}` : "",
    profileUrl: `/profile/${target.id}?from=social`,
  };
}

export async function socialMates(env, viewer, options = {}) {
  if (!viewer) throw new HttpError(401, "Login required to view mates");
  const limit = clampInt(options?.limit, 120, 1, 300);
  const mates = await listSocialMates(env.DB, {
    userId: Number(viewer.id),
    limit,
  });
  return {
    mates: Array.isArray(mates) ? mates : [],
    count: Array.isArray(mates) ? mates.length : 0,
  };
}

export async function socialMateRequests(env, viewer, options = {}) {
  if (!viewer) throw new HttpError(401, "Login required to view mate requests");
  const limit = clampInt(options?.limit, 120, 1, 250);
  const requests = await listSocialMateRequests(env.DB, {
    userId: Number(viewer.id),
    limit,
  });
  const incoming = Array.isArray(requests?.incoming) ? requests.incoming : [];
  const outgoing = Array.isArray(requests?.outgoing) ? requests.outgoing : [];
  return {
    incoming,
    outgoing,
    incomingCount: incoming.length,
    outgoingCount: outgoing.length,
    totalCount: incoming.length + outgoing.length,
  };
}

export async function socialMateStatus(env, viewer, targetUserId) {
  if (!viewer) throw new HttpError(401, "Login required to view mate status");
  const safeTargetId = parsePositiveId(targetUserId, "user id");
  const safeViewerId = Number.parseInt(String(viewer?.id || 0), 10);
  if (!Number.isInteger(safeViewerId) || safeViewerId <= 0) {
    throw new HttpError(401, "Login required to view mate status");
  }
  if (safeTargetId === safeViewerId) {
    return {
      targetUserId: safeTargetId,
      status: "self",
      requestId: 0,
      canRequest: false,
    };
  }

  await ensureMateTargetUser(env, safeTargetId);
  const statusResult = await getSocialMateStatus(env.DB, {
    viewerId: safeViewerId,
    targetUserId: safeTargetId,
  });
  const status = String(statusResult?.status || "none");
  const requestId = Number.parseInt(String(statusResult?.requestId || 0), 10) || 0;
  const relationId = Number.parseInt(String(statusResult?.relationId || requestId || 0), 10) || 0;
  const followingByViewer = Boolean(statusResult?.followingByViewer);
  return {
    targetUserId: safeTargetId,
    status,
    requestId,
    relationId,
    followingByViewer,
    canRequest: status === "none",
  };
}

export async function createMateRequest(request, env, viewer) {
  if (!viewer) throw new HttpError(401, "Login required to send mate request");
  const safeViewerId = Number.parseInt(String(viewer?.id || 0), 10);
  if (!Number.isInteger(safeViewerId) || safeViewerId <= 0) {
    throw new HttpError(401, "Login required to send mate request");
  }

  const body = await readBody(request);
  const safeTargetId = parsePositiveId(body?.targetUserId, "target user id");
  if (safeTargetId === safeViewerId) throw new HttpError(400, "You cannot send mate request to yourself");
  const target = await ensureMateTargetUser(env, safeTargetId);

  const result = await createSocialMateRequest(env.DB, {
    requesterId: safeViewerId,
    receiverId: safeTargetId,
  });
  const status = String(result?.status || "none");
  const requestId = Number.parseInt(String(result?.requestId || 0), 10) || 0;
  const relationId = Number.parseInt(String(result?.relationId || requestId || 0), 10) || 0;
  const followingByViewer = Boolean(result?.followingByViewer);
  return {
    ok: Boolean(result?.ok),
    target,
    status,
    requestId,
    relationId,
    followingByViewer,
    canRequest: status === "none",
  };
}

export async function respondMateRequest(request, env, viewer, requestId) {
  if (!viewer) throw new HttpError(401, "Login required to respond to mate request");
  const safeViewerId = Number.parseInt(String(viewer?.id || 0), 10);
  if (!Number.isInteger(safeViewerId) || safeViewerId <= 0) {
    throw new HttpError(401, "Login required to respond to mate request");
  }
  const safeRequestId = parsePositiveId(requestId, "request id");
  const body = await readBody(request);
  const action = String(body?.action || "").trim().toLowerCase();
  if (!["accept", "decline"].includes(action)) throw new HttpError(400, "Invalid mate request action");

  const result = await respondToSocialMateRequest(env.DB, {
    requestId: safeRequestId,
    receiverId: safeViewerId,
    action,
  });
  if (!result?.ok) {
    if (result?.missing) throw new HttpError(404, "Mate request not found");
    if (result?.forbidden) throw new HttpError(403, "You are not allowed to respond to this mate request");
    throw new HttpError(400, "Unable to respond to mate request");
  }

  return {
    ok: true,
    action,
    status: String(result?.status || "none"),
    requestId: safeRequestId,
    relationId: Number.parseInt(String(result?.relationId || safeRequestId || 0), 10) || safeRequestId,
    requesterId: Number.parseInt(String(result?.requesterId || 0), 10) || 0,
    receiverId: Number.parseInt(String(result?.receiverId || 0), 10) || 0,
    followingByViewer: Boolean(result?.followingByViewer),
    respondedAt: String(result?.respondedAt || ""),
  };
}

export async function cancelMateRequest(env, viewer, requestId) {
  if (!viewer) throw new HttpError(401, "Login required to cancel mate request");
  const safeViewerId = Number.parseInt(String(viewer?.id || 0), 10);
  if (!Number.isInteger(safeViewerId) || safeViewerId <= 0) {
    throw new HttpError(401, "Login required to cancel mate request");
  }
  const safeRequestId = parsePositiveId(requestId, "request id");
  const result = await cancelSocialMateRequest(env.DB, {
    requestId: safeRequestId,
    requesterId: safeViewerId,
  });
  if (!result?.ok) {
    if (result?.missing) throw new HttpError(404, "Mate request not found");
    if (result?.forbidden) throw new HttpError(403, "You are not allowed to cancel this mate request");
    throw new HttpError(400, "Unable to cancel mate request");
  }
  return {
    ok: true,
    status: String(result?.status || "none"),
    requestId: safeRequestId,
    relationId: Number.parseInt(String(result?.relationId || safeRequestId || 0), 10) || safeRequestId,
    respondedAt: String(result?.respondedAt || ""),
  };
}

export async function removeMate(env, viewer, relationId) {
  if (!viewer) throw new HttpError(401, "Login required to remove mate");
  const safeViewerId = Number.parseInt(String(viewer?.id || 0), 10);
  if (!Number.isInteger(safeViewerId) || safeViewerId <= 0) {
    throw new HttpError(401, "Login required to remove mate");
  }
  const safeRelationId = parsePositiveId(relationId, "relation id");
  const result = await removeSocialMate(env.DB, {
    relationId: safeRelationId,
    userId: safeViewerId,
  });
  if (!result?.ok) {
    if (result?.missing) throw new HttpError(404, "Mate relation not found");
    if (result?.forbidden) throw new HttpError(403, "You are not allowed to remove this mate");
    throw new HttpError(400, "Unable to remove mate");
  }
  return {
    ok: true,
    status: String(result?.status || "none"),
    relationId: safeRelationId,
    respondedAt: String(result?.respondedAt || ""),
  };
}

export async function setMateFollowState(request, env, viewer, relationId) {
  if (!viewer) throw new HttpError(401, "Login required to update mate follow");
  const safeViewerId = Number.parseInt(String(viewer?.id || 0), 10);
  if (!Number.isInteger(safeViewerId) || safeViewerId <= 0) {
    throw new HttpError(401, "Login required to update mate follow");
  }
  const safeRelationId = parsePositiveId(relationId, "relation id");
  const body = await readBody(request);
  const follow = Boolean(body?.follow);
  const result = await setSocialMateFollowState(env.DB, {
    relationId: safeRelationId,
    userId: safeViewerId,
    follow,
  });
  if (!result?.ok) {
    if (result?.missing) throw new HttpError(404, "Mate relation not found");
    if (result?.forbidden) throw new HttpError(403, "You are not allowed to update this mate");
    throw new HttpError(400, "Unable to update mate follow");
  }
  return {
    ok: true,
    status: String(result?.status || "none"),
    relationId: safeRelationId,
    followingByViewer: Boolean(result?.followingByViewer),
    updatedAt: String(result?.updatedAt || ""),
  };
}
