import { HttpError } from "../../shared/http/errors.js";
import { readBody } from "../../shared/http/request.js";
import {
  createSocialComment,
  createSocialPost,
  findSocialCommentById,
  findSocialPostById,
  getSocialAvatarObject,
  getSocialFeed,
  getSocialNotifications,
  getSocialPostById,
  getSocialPostImageObject,
  toggleSocialCommentReaction,
  toggleSocialReaction,
} from "../../infrastructure/db/social.js";
import { objectToResponse } from "./helpers/http.js";
import { parseDataImage, parseDataImages, parsePositiveId, sanitizePostText } from "./helpers/validation.js";
import { encodePostImageKeys, maxPostImages } from "../../shared/social/postImages.js";

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
  const notifications = await getSocialNotifications(env.DB, Number(viewer.id), limit);
  return {
    notifications,
    count: notifications.length,
  };
}
