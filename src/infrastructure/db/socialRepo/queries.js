import { decodePostImageKeys } from "../../../shared/social/postImages.js";

export async function findSocialPostById(db, postId) {
  return db.prepare("SELECT id, admin_id, body, image_key, created_at, updated_at FROM freeducation_social_posts WHERE id = ?1").bind(postId).first();
}

export async function findSocialCommentById(db, commentId) {
  return db.prepare(
    `SELECT c.id, c.post_id, c.admin_id, c.parent_comment_id, c.body, c.created_at,
            a.name AS author_name
     FROM freeducation_social_comments c
     LEFT JOIN freeducation_admins a ON a.id = c.admin_id
     WHERE c.id = ?1`,
  ).bind(commentId).first();
}

const DEFAULT_FEED_MAX_BYTES = 220_000;
const NOTIFICATION_FETCH_MULTIPLIER = 6;

function clampInt(value, fallback, min, max) {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(min, Math.min(max, parsed));
}

function estimatePayloadBytes(value) {
  try {
    return Math.max(240, JSON.stringify(value).length);
  } catch {
    return 1200;
  }
}

function trimNotificationPreview(value, maxLength = 110) {
  const normalized = String(value || "")
    .replace(/\s+/g, " ")
    .trim();
  if (!normalized) return "";
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength - 1)}…`;
}

function notificationKey(type, ...parts) {
  const normalizedType = String(type || "notification").trim().toLowerCase().replace(/[^a-z0-9_]+/g, "_");
  const normalizedParts = parts
    .map((part) => String(part ?? "").trim())
    .filter((part) => part.length > 0)
    .map((part) => part.replaceAll("|", "_"));
  return [normalizedType, ...normalizedParts].join("|");
}

async function getHydratedCommentsByPost(db, postIds, viewerId = 0) {
  const ids = Array.isArray(postIds)
    ? postIds.map((value) => Number(value)).filter((value) => Number.isInteger(value) && value > 0)
    : [];
  if (!ids.length) return { commentsByPost: new Map(), commentCountByPost: new Map() };

  const placeholders = ids.map((_, index) => `?${index + 1}`).join(",");
  const commentRows = await db.prepare(
    `SELECT c.id, c.post_id, c.parent_comment_id, c.body, c.created_at,
            a.id AS author_id, a.name AS author_name, a.user_type AS author_role, a.avatar_key AS author_avatar_key
     FROM freeducation_social_comments c
     JOIN freeducation_admins a ON a.id = c.admin_id
     WHERE c.post_id IN (${placeholders})
     ORDER BY c.created_at ASC, c.id ASC`,
  ).bind(...ids).all();

  const rows = commentRows.results || [];
  const commentCountByPost = new Map();
  if (!rows.length) {
    for (const postId of ids) commentCountByPost.set(postId, 0);
    return { commentsByPost: new Map(), commentCountByPost };
  }

  const commentIds = rows
    .map((row) => Number(row.id))
    .filter((id) => Number.isInteger(id) && id > 0);

  const reactionPlaceholders = commentIds.map((_, index) => `?${index + 1}`).join(",");
  const commentReactionRows = commentIds.length
    ? await db.prepare(
      `SELECT comment_id, COUNT(*) total
       FROM freeducation_social_comment_reactions
       WHERE comment_id IN (${reactionPlaceholders})
       GROUP BY comment_id`,
    ).bind(...commentIds).all()
    : { results: [] };

  const likedCommentRows = viewerId && commentIds.length
    ? await db.prepare(
      `SELECT comment_id
       FROM freeducation_social_comment_reactions
       WHERE admin_id = ?1 AND comment_id IN (${commentIds.map((_, index) => `?${index + 2}`).join(",")})`,
    ).bind(viewerId, ...commentIds).all()
    : { results: [] };

  const reactionByComment = new Map((commentReactionRows.results || []).map((row) => [Number(row.comment_id), Number(row.total || 0)]));
  const likedCommentSet = new Set((likedCommentRows.results || []).map((row) => Number(row.comment_id)));

  const nodesById = new Map();
  const commentsByPost = new Map();

  for (const row of rows) {
    const commentId = Number(row.id);
    const postId = Number(row.post_id);
    const parentCommentId = Number(row.parent_comment_id || 0);
    if (!Number.isInteger(commentId) || commentId <= 0 || !Number.isInteger(postId) || postId <= 0) continue;

    const nextCount = Number(commentCountByPost.get(postId) || 0) + 1;
    commentCountByPost.set(postId, nextCount);

    const node = {
      id: commentId,
      postId,
      parentCommentId: parentCommentId > 0 ? parentCommentId : 0,
      body: String(row.body || ""),
      createdAt: row.created_at || "",
      reactionCount: reactionByComment.get(commentId) || 0,
      likedByViewer: likedCommentSet.has(commentId),
      replies: [],
      author: {
        id: Number(row.author_id),
        name: row.author_name || "User",
        role: row.author_role || "",
        avatarUrl: row.author_avatar_key ? `/api/social/avatar/${row.author_id}` : "",
      },
    };
    nodesById.set(commentId, node);
  }

  const toClientReply = (node) => ({
    id: node.id,
    body: node.body,
    createdAt: node.createdAt,
    reactionCount: node.reactionCount,
    likedByViewer: Boolean(node.likedByViewer),
    replies: [],
    author: node.author,
  });

  const toClientComment = (node) => ({
    id: node.id,
    body: node.body,
    createdAt: node.createdAt,
    reactionCount: node.reactionCount,
    likedByViewer: Boolean(node.likedByViewer),
    replies: node.replies.map(toClientReply),
    author: node.author,
  });

  for (const row of rows) {
    const commentId = Number(row.id);
    const node = nodesById.get(commentId);
    if (!node) continue;

    const postId = node.postId;
    if (!commentsByPost.has(postId)) commentsByPost.set(postId, []);

    if (node.parentCommentId > 0) {
      const parent = nodesById.get(node.parentCommentId);
      if (parent && parent.postId === postId) {
        if ((parent.parentCommentId || 0) === 0) {
          parent.replies.push(node);
          continue;
        }
        const rootParent = nodesById.get(parent.parentCommentId);
        if (rootParent && rootParent.postId === postId && (rootParent.parentCommentId || 0) === 0 && rootParent.id !== node.id) {
          node.parentCommentId = rootParent.id;
          rootParent.replies.push(node);
          continue;
        }
      }
    }

    commentsByPost.get(postId).push(node);
  }

  for (const postId of ids) {
    if (!commentCountByPost.has(postId)) commentCountByPost.set(postId, 0);
  }

  const normalizedByPost = new Map();
  for (const [postId, list] of commentsByPost.entries()) {
    normalizedByPost.set(postId, list.map(toClientComment));
  }

  return { commentsByPost: normalizedByPost, commentCountByPost };
}

export async function getSocialFeed(db, viewerId = 0, limit = 20, options = {}) {
  const safeLimit = clampInt(limit, 20, 4, 60);
  const safeMaxBytes = clampInt(options?.maxBytes, DEFAULT_FEED_MAX_BYTES, 40_000, 700_000);
  const authorId = Number.parseInt(String(options?.authorId || 0), 10);
  const hasAuthorFilter = Number.isInteger(authorId) && authorId > 0;
  const cursorCreatedAt = String(options?.cursorCreatedAt || "");
  const cursorId = Number.parseInt(String(options?.cursorId || 0), 10);
  const hasCursor = Boolean(cursorCreatedAt) && Number.isInteger(cursorId) && cursorId > 0;

  const fetchLimit = safeLimit + 1;
  const conditions = [];
  const bindings = [fetchLimit];
  let bindIndex = 2;

  if (hasAuthorFilter) {
    conditions.push(`p.admin_id = ?${bindIndex}`);
    bindings.push(authorId);
    bindIndex += 1;
  }

  if (hasCursor) {
    conditions.push(`(p.created_at < ?${bindIndex} OR (p.created_at = ?${bindIndex} AND p.id < ?${bindIndex + 1}))`);
    bindings.push(cursorCreatedAt, cursorId);
    bindIndex += 2;
  }

  const postQuery =
    `SELECT p.id, p.admin_id, p.body, p.image_key, p.created_at, p.updated_at,
            a.name AS author_name, a.user_type AS author_role, a.avatar_key AS author_avatar_key
     FROM freeducation_social_posts p
     JOIN freeducation_admins a ON a.id = p.admin_id
     ${conditions.length ? `WHERE ${conditions.join(" AND ")}` : ""}
     ORDER BY p.created_at DESC, p.id DESC
     LIMIT ?1`;

  const postRows = await db.prepare(postQuery).bind(...bindings).all();
  const queriedPosts = postRows.results || [];
  if (!queriedPosts.length) return { posts: [], hasMore: false, totalBytes: 0 };

  const hasMoreByCount = queriedPosts.length > safeLimit;
  const pagedPosts = hasMoreByCount ? queriedPosts.slice(0, safeLimit) : queriedPosts;
  const postIds = pagedPosts.map((post) => Number(post.id)).filter((id) => Number.isInteger(id) && id > 0);
  if (!postIds.length) return { posts: [], hasMore: false, totalBytes: 0 };
  const placeholders = postIds.map((_, index) => `?${index + 1}`).join(",");

  const reactionRows = await db.prepare(
    `SELECT post_id, COUNT(*) total
     FROM freeducation_social_reactions
     WHERE post_id IN (${placeholders})
     GROUP BY post_id`,
  ).bind(...postIds).all();
  const hydratedComments = await getHydratedCommentsByPost(db, postIds, viewerId);

  const likedRows = viewerId
    ? await db.prepare(
      `SELECT post_id FROM freeducation_social_reactions
       WHERE admin_id = ?1 AND post_id IN (${postIds.map((_, index) => `?${index + 2}`).join(",")})`,
    ).bind(viewerId, ...postIds).all()
    : { results: [] };

  const reactionByPost = new Map((reactionRows.results || []).map((row) => [Number(row.post_id), Number(row.total || 0)]));
  const likedSet = new Set((likedRows.results || []).map((row) => Number(row.post_id)));
  const commentsByPost = hydratedComments.commentsByPost;
  const commentCountByPost = hydratedComments.commentCountByPost;

  const hydratedPosts = pagedPosts.map((row) => {
    const id = Number(row.id);
    const imageKeys = decodePostImageKeys(row.image_key);
    const imageUrls = imageKeys.map((_, index) => `/api/social/posts/${id}/image?i=${index}`);
    return {
      id,
      body: String(row.body || ""),
      imageUrls,
      imageUrl: imageUrls[0] || "",
      createdAt: row.created_at || "",
      updatedAt: row.updated_at || "",
      reactionCount: reactionByPost.get(id) || 0,
      likedByViewer: likedSet.has(id),
      comments: commentsByPost.get(id) || [],
      commentCount: commentCountByPost.get(id) || 0,
      isOwner: Number(row.admin_id) === Number(viewerId || 0),
      canManage: Number(row.admin_id) === Number(viewerId || 0),
      author: {
        id: Number(row.admin_id),
        name: row.author_name || "User",
        role: row.author_role || "",
        avatarUrl: row.author_avatar_key ? `/api/social/avatar/${row.admin_id}` : "",
      },
    };
  });

  let totalBytes = 0;
  const boundedPosts = [];
  for (const post of hydratedPosts) {
    const postBytes = estimatePayloadBytes(post);
    if (boundedPosts.length > 0 && totalBytes + postBytes > safeMaxBytes) break;
    boundedPosts.push(post);
    totalBytes += postBytes;
  }

  if (!boundedPosts.length && hydratedPosts.length) {
    boundedPosts.push(hydratedPosts[0]);
    totalBytes = estimatePayloadBytes(hydratedPosts[0]);
  }

  const trimmedByBudget = boundedPosts.length < hydratedPosts.length;
  return {
    posts: boundedPosts,
    hasMore: hasMoreByCount || trimmedByBudget,
    totalBytes,
  };
}

export async function getSocialPostById(db, viewerId = 0, postId) {
  const id = Number.parseInt(String(postId || 0), 10);
  if (!Number.isInteger(id) || id <= 0) return null;

  const row = await db.prepare(
    `SELECT p.id, p.admin_id, p.body, p.image_key, p.created_at, p.updated_at,
            a.name AS author_name, a.user_type AS author_role, a.avatar_key AS author_avatar_key
     FROM freeducation_social_posts p
     JOIN freeducation_admins a ON a.id = p.admin_id
     WHERE p.id = ?1`,
  ).bind(id).first();
  if (!row) return null;

  const reactionRow = await db.prepare(
    `SELECT COUNT(*) AS total
     FROM freeducation_social_reactions
     WHERE post_id = ?1`,
  ).bind(id).first();
  const hydratedComments = await getHydratedCommentsByPost(db, [id], viewerId);

  const likedRow = viewerId
    ? await db.prepare(
      `SELECT post_id
       FROM freeducation_social_reactions
       WHERE admin_id = ?1 AND post_id = ?2`,
    ).bind(viewerId, id).first()
    : null;

  const comments = hydratedComments.commentsByPost.get(id) || [];
  const commentCount = hydratedComments.commentCountByPost.get(id) || 0;

  const imageKeys = decodePostImageKeys(row.image_key);
  const imageUrls = imageKeys.map((_, index) => `/api/social/posts/${id}/image?i=${index}`);

  return {
    id,
    body: String(row.body || ""),
    imageUrls,
    imageUrl: imageUrls[0] || "",
    createdAt: row.created_at || "",
    updatedAt: row.updated_at || "",
    reactionCount: Number(reactionRow?.total || 0),
    likedByViewer: Boolean(likedRow?.post_id),
    comments,
    commentCount,
    isOwner: Number(row.admin_id) === Number(viewerId || 0),
    canManage: Number(row.admin_id) === Number(viewerId || 0),
    author: {
      id: Number(row.admin_id),
      name: row.author_name || "User",
      role: row.author_role || "",
      avatarUrl: row.author_avatar_key ? `/api/social/avatar/${row.admin_id}` : "",
    },
  };
}

export async function getSocialNotifications(db, viewerId = 0, limit = 32) {
  const safeViewerId = Number.parseInt(String(viewerId || 0), 10);
  if (!Number.isInteger(safeViewerId) || safeViewerId <= 0) {
    return {
      notifications: [],
      count: 0,
      unreadCount: 0,
      hasUnseen: false,
      seenAt: "",
    };
  }

  const safeLimit = clampInt(limit, 32, 1, 80);
  const queryLimit = Math.max(60, safeLimit * NOTIFICATION_FETCH_MULTIPLIER);
  const notifications = [];
  const seenMeta = await db.prepare(
    `SELECT seen_at
     FROM freeducation_social_notification_meta
     WHERE admin_id = ?1`,
  ).bind(safeViewerId).first();
  const seenAt = String(seenMeta?.seen_at || "");

  const postReactionRows = await db.prepare(
    `SELECT r.post_id, r.admin_id AS actor_id, r.created_at,
            a.name AS actor_name, a.avatar_key AS actor_avatar_key,
            p.body AS post_body
     FROM freeducation_social_reactions r
     JOIN freeducation_social_posts p ON p.id = r.post_id
     JOIN freeducation_admins a ON a.id = r.admin_id
     WHERE p.admin_id = ?1 AND r.admin_id <> ?1
     ORDER BY r.created_at DESC, r.id DESC
     LIMIT ?2`,
  ).bind(safeViewerId, queryLimit).all();

  const postReactionByPost = new Map();
  for (const row of postReactionRows.results || []) {
    const postId = Number.parseInt(String(row.post_id || 0), 10);
    const actorId = Number.parseInt(String(row.actor_id || 0), 10);
    if (!Number.isInteger(postId) || postId <= 0 || !Number.isInteger(actorId) || actorId <= 0) continue;
    const createdAt = String(row.created_at || "");
    const current = postReactionByPost.get(postId);
    if (!current) {
      postReactionByPost.set(postId, {
        postId,
        count: 1,
        createdAt,
        actorId,
        actorName: row.actor_name || "User",
        actorAvatarUrl: row.actor_avatar_key ? `/api/social/avatar/${actorId}` : "",
        postBody: row.post_body || "",
      });
      continue;
    }
    current.count += 1;
  }

  for (const bucket of postReactionByPost.values()) {
    const summary = bucket.count > 1
      ? `${bucket.actorName} and ${bucket.count - 1} others reacted to your post`
      : `${bucket.actorName} reacted to your post`;
    notifications.push({
      id: notificationKey("post_reaction", bucket.postId, bucket.createdAt),
      type: "post_reaction",
      createdAt: bucket.createdAt,
      actorCount: bucket.count,
      actor: {
        id: bucket.actorId,
        name: bucket.actorName,
        avatarUrl: bucket.actorAvatarUrl,
      },
      message: summary,
      preview: trimNotificationPreview(bucket.postBody),
      postId: bucket.postId,
      commentId: 0,
      url: `/social/post/${bucket.postId}`,
    });
  }

  const postCommentRows = await db.prepare(
    `SELECT c.id AS comment_id, c.post_id, c.admin_id AS actor_id, c.body, c.created_at,
            a.name AS actor_name, a.avatar_key AS actor_avatar_key
     FROM freeducation_social_comments c
     JOIN freeducation_social_posts p ON p.id = c.post_id
     JOIN freeducation_admins a ON a.id = c.admin_id
     WHERE p.admin_id = ?1
       AND c.admin_id <> ?1
       AND (c.parent_comment_id IS NULL OR c.parent_comment_id = 0)
     ORDER BY c.created_at DESC, c.id DESC
     LIMIT ?2`,
  ).bind(safeViewerId, queryLimit).all();

  const postCommentByActorAndPost = new Map();
  for (const row of postCommentRows.results || []) {
    const postId = Number.parseInt(String(row.post_id || 0), 10);
    const actorId = Number.parseInt(String(row.actor_id || 0), 10);
    const commentId = Number.parseInt(String(row.comment_id || 0), 10);
    if (
      !Number.isInteger(postId)
      || postId <= 0
      || !Number.isInteger(actorId)
      || actorId <= 0
      || !Number.isInteger(commentId)
      || commentId <= 0
    ) continue;
    const key = `${postId}:${actorId}`;
    const createdAt = String(row.created_at || "");
    const current = postCommentByActorAndPost.get(key);
    if (!current) {
      postCommentByActorAndPost.set(key, {
        postId,
        commentId,
        actorId,
        actorName: row.actor_name || "User",
        actorAvatarUrl: row.actor_avatar_key ? `/api/social/avatar/${actorId}` : "",
        createdAt,
        count: 1,
        body: row.body || "",
      });
      continue;
    }
    current.count += 1;
  }

  for (const bucket of postCommentByActorAndPost.values()) {
    const summary = bucket.count > 1
      ? `${bucket.actorName} commented ${bucket.count} times on your post`
      : `${bucket.actorName} commented on your post`;
    notifications.push({
      id: notificationKey("post_comment", bucket.postId, bucket.actorId, bucket.createdAt),
      type: "post_comment",
      createdAt: bucket.createdAt,
      actorCount: bucket.count,
      actor: {
        id: bucket.actorId,
        name: bucket.actorName,
        avatarUrl: bucket.actorAvatarUrl,
      },
      message: summary,
      preview: trimNotificationPreview(bucket.body),
      postId: bucket.postId,
      commentId: bucket.commentId,
      url: `/social/post/${bucket.postId}`,
    });
  }

  const commentReactionRows = await db.prepare(
    `SELECT cr.comment_id, cr.admin_id AS actor_id, cr.created_at,
            a.name AS actor_name, a.avatar_key AS actor_avatar_key,
            c.post_id, c.body AS comment_body
     FROM freeducation_social_comment_reactions cr
     JOIN freeducation_social_comments c ON c.id = cr.comment_id
     JOIN freeducation_admins a ON a.id = cr.admin_id
     WHERE c.admin_id = ?1 AND cr.admin_id <> ?1
     ORDER BY cr.created_at DESC, cr.id DESC
     LIMIT ?2`,
  ).bind(safeViewerId, queryLimit).all();

  const commentReactionByComment = new Map();
  for (const row of commentReactionRows.results || []) {
    const commentId = Number.parseInt(String(row.comment_id || 0), 10);
    const actorId = Number.parseInt(String(row.actor_id || 0), 10);
    const postId = Number.parseInt(String(row.post_id || 0), 10);
    if (
      !Number.isInteger(commentId)
      || commentId <= 0
      || !Number.isInteger(actorId)
      || actorId <= 0
      || !Number.isInteger(postId)
      || postId <= 0
    ) continue;

    const createdAt = String(row.created_at || "");
    const current = commentReactionByComment.get(commentId);
    if (!current) {
      commentReactionByComment.set(commentId, {
        postId,
        commentId,
        createdAt,
        actorId,
        actorName: row.actor_name || "User",
        actorAvatarUrl: row.actor_avatar_key ? `/api/social/avatar/${actorId}` : "",
        count: 1,
        body: row.comment_body || "",
      });
      continue;
    }
    current.count += 1;
  }

  for (const bucket of commentReactionByComment.values()) {
    const summary = bucket.count > 1
      ? `${bucket.actorName} and ${bucket.count - 1} others reacted to your comment`
      : `${bucket.actorName} reacted to your comment`;
    notifications.push({
      id: notificationKey("comment_reaction", bucket.commentId, bucket.createdAt),
      type: "comment_reaction",
      createdAt: bucket.createdAt,
      actorCount: bucket.count,
      actor: {
        id: bucket.actorId,
        name: bucket.actorName,
        avatarUrl: bucket.actorAvatarUrl,
      },
      message: summary,
      preview: trimNotificationPreview(bucket.body),
      postId: bucket.postId,
      commentId: bucket.commentId,
      url: `/social/post/${bucket.postId}`,
    });
  }

  const replyRows = await db.prepare(
    `SELECT c.id AS reply_id, c.post_id, c.parent_comment_id, c.admin_id AS actor_id, c.body, c.created_at,
            a.name AS actor_name, a.avatar_key AS actor_avatar_key
     FROM freeducation_social_comments c
     JOIN freeducation_social_comments parent ON parent.id = c.parent_comment_id
     JOIN freeducation_admins a ON a.id = c.admin_id
     WHERE parent.admin_id = ?1
       AND c.admin_id <> ?1
     ORDER BY c.created_at DESC, c.id DESC
     LIMIT ?2`,
  ).bind(safeViewerId, queryLimit).all();

  const repliesByParentAndActor = new Map();
  for (const row of replyRows.results || []) {
    const postId = Number.parseInt(String(row.post_id || 0), 10);
    const parentCommentId = Number.parseInt(String(row.parent_comment_id || 0), 10);
    const replyId = Number.parseInt(String(row.reply_id || 0), 10);
    const actorId = Number.parseInt(String(row.actor_id || 0), 10);
    if (
      !Number.isInteger(postId)
      || postId <= 0
      || !Number.isInteger(parentCommentId)
      || parentCommentId <= 0
      || !Number.isInteger(replyId)
      || replyId <= 0
      || !Number.isInteger(actorId)
      || actorId <= 0
    ) continue;

    const key = `${parentCommentId}:${actorId}`;
    const createdAt = String(row.created_at || "");
    const current = repliesByParentAndActor.get(key);
    if (!current) {
      repliesByParentAndActor.set(key, {
        postId,
        parentCommentId,
        replyId,
        actorId,
        actorName: row.actor_name || "User",
        actorAvatarUrl: row.actor_avatar_key ? `/api/social/avatar/${actorId}` : "",
        createdAt,
        count: 1,
        body: row.body || "",
      });
      continue;
    }
    current.count += 1;
  }

  for (const bucket of repliesByParentAndActor.values()) {
    const summary = bucket.count > 1
      ? `${bucket.actorName} replied ${bucket.count} times to your comment`
      : `${bucket.actorName} replied to your comment`;
    notifications.push({
      id: notificationKey("comment_reply", bucket.parentCommentId, bucket.actorId, bucket.createdAt),
      type: "comment_reply",
      createdAt: bucket.createdAt,
      actorCount: bucket.count,
      actor: {
        id: bucket.actorId,
        name: bucket.actorName,
        avatarUrl: bucket.actorAvatarUrl,
      },
      message: summary,
      preview: trimNotificationPreview(bucket.body),
      postId: bucket.postId,
      commentId: bucket.parentCommentId,
      replyId: bucket.replyId,
      url: `/social/post/${bucket.postId}`,
    });
  }

  notifications.sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
  const limited = notifications.slice(0, safeLimit);
  const notificationIds = limited
    .map((entry) => String(entry?.id || "").trim())
    .filter((value) => Boolean(value));

  let readSet = new Set();
  if (notificationIds.length) {
    const placeholders = notificationIds.map((_, index) => `?${index + 2}`).join(",");
    const readRows = await db.prepare(
      `SELECT notification_id
       FROM freeducation_social_notification_reads
       WHERE admin_id = ?1 AND notification_id IN (${placeholders})`,
    ).bind(safeViewerId, ...notificationIds).all();
    readSet = new Set((readRows.results || []).map((row) => String(row.notification_id || "")));
  }

  const hydrated = limited.map((entry) => {
    const notificationId = String(entry?.id || "").trim();
    const createdAt = String(entry?.createdAt || "");
    const read = readSet.has(notificationId);
    const seen = seenAt ? createdAt.localeCompare(seenAt) <= 0 : false;
    return {
      ...entry,
      read,
      unread: !read,
      seen,
    };
  });

  const unreadCount = hydrated.reduce((total, entry) => total + (entry.read ? 0 : 1), 0);
  const hasUnseen = seenAt
    ? hydrated.some((entry) => String(entry?.createdAt || "").localeCompare(seenAt) > 0)
    : hydrated.length > 0;

  return {
    notifications: hydrated,
    count: hydrated.length,
    unreadCount,
    hasUnseen,
    seenAt,
  };
}
