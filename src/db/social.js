import { findAdminById } from "./admins.js";

export async function createSocialPost(db, { adminId, body, imageKey = "" }) {
  const now = new Date().toISOString();
  const result = await db.prepare(
    `INSERT INTO freeducation_social_posts (admin_id, body, image_key, created_at, updated_at)
     VALUES (?1, ?2, ?3, ?4, ?4)`,
  ).bind(adminId, body, imageKey, now).run();
  return Number(result.meta?.last_row_id || 0);
}

export async function createSocialComment(db, { postId, adminId, body }) {
  const now = new Date().toISOString();
  await db.prepare(
    `INSERT INTO freeducation_social_comments (post_id, admin_id, body, created_at)
     VALUES (?1, ?2, ?3, ?4)`,
  ).bind(postId, adminId, body, now).run();
}

export async function toggleSocialReaction(db, { postId, adminId }) {
  const existing = await db.prepare(
    `SELECT id FROM freeducation_social_reactions WHERE post_id = ?1 AND admin_id = ?2`,
  ).bind(postId, adminId).first();

  if (existing?.id) {
    await db.prepare("DELETE FROM freeducation_social_reactions WHERE id = ?1").bind(existing.id).run();
    return { liked: false };
  }

  const now = new Date().toISOString();
  await db.prepare(
    `INSERT INTO freeducation_social_reactions (post_id, admin_id, created_at)
     VALUES (?1, ?2, ?3)`,
  ).bind(postId, adminId, now).run();
  return { liked: true };
}

export async function findSocialPostById(db, postId) {
  return db.prepare("SELECT id, admin_id, body, image_key, created_at, updated_at FROM freeducation_social_posts WHERE id = ?1").bind(postId).first();
}

export async function getSocialFeed(db, viewerId = 0, limit = 20) {
  const safeLimit = Math.max(1, Math.min(60, Number.parseInt(String(limit || ""), 10) || 20));
  const postRows = await db.prepare(
    `SELECT p.id, p.admin_id, p.body, p.image_key, p.created_at, p.updated_at,
            a.name AS author_name, a.user_type AS author_role, a.avatar_key AS author_avatar_key
     FROM freeducation_social_posts p
     JOIN freeducation_admins a ON a.id = p.admin_id
     ORDER BY p.created_at DESC
     LIMIT ?1`,
  ).bind(safeLimit).all();

  const posts = postRows.results || [];
  if (!posts.length) return [];

  const postIds = posts.map((post) => Number(post.id)).filter((id) => Number.isInteger(id) && id > 0);
  const placeholders = postIds.map((_, index) => `?${index + 1}`).join(",");

  const reactionRows = await db.prepare(
    `SELECT post_id, COUNT(*) total
     FROM freeducation_social_reactions
     WHERE post_id IN (${placeholders})
     GROUP BY post_id`,
  ).bind(...postIds).all();

  const commentRows = await db.prepare(
    `SELECT c.id, c.post_id, c.body, c.created_at,
            a.id AS author_id, a.name AS author_name, a.user_type AS author_role, a.avatar_key AS author_avatar_key
     FROM freeducation_social_comments c
     JOIN freeducation_admins a ON a.id = c.admin_id
     WHERE c.post_id IN (${placeholders})
     ORDER BY c.created_at ASC`,
  ).bind(...postIds).all();

  const likedRows = viewerId
    ? await db.prepare(
      `SELECT post_id FROM freeducation_social_reactions
       WHERE admin_id = ?1 AND post_id IN (${placeholders})`,
    ).bind(viewerId, ...postIds).all()
    : { results: [] };

  const reactionByPost = new Map((reactionRows.results || []).map((row) => [Number(row.post_id), Number(row.total || 0)]));
  const likedSet = new Set((likedRows.results || []).map((row) => Number(row.post_id)));
  const commentsByPost = new Map();

  for (const row of commentRows.results || []) {
    const pid = Number(row.post_id);
    if (!commentsByPost.has(pid)) commentsByPost.set(pid, []);
    commentsByPost.get(pid).push({
      id: Number(row.id),
      body: String(row.body || ""),
      createdAt: row.created_at || "",
      author: {
        id: Number(row.author_id),
        name: row.author_name || "User",
        role: row.author_role || "",
        avatarUrl: row.author_avatar_key ? `/api/social/avatar/${row.author_id}` : "",
      },
    });
  }

  return posts.map((row) => {
    const id = Number(row.id);
    return {
      id,
      body: String(row.body || ""),
      imageUrl: row.image_key ? `/api/social/posts/${id}/image` : "",
      createdAt: row.created_at || "",
      updatedAt: row.updated_at || "",
      reactionCount: reactionByPost.get(id) || 0,
      likedByViewer: likedSet.has(id),
      comments: commentsByPost.get(id) || [],
      author: {
        id: Number(row.admin_id),
        name: row.author_name || "User",
        role: row.author_role || "",
        avatarUrl: row.author_avatar_key ? `/api/social/avatar/${row.admin_id}` : "",
      },
    };
  });
}

export async function getSocialAvatarObject(env, adminId) {
  const profile = await findAdminById(env.DB, adminId);
  if (!profile?.avatar_key) return null;
  return env.BUCKET.get(profile.avatar_key);
}

export async function getSocialPostImageObject(env, postId) {
  const post = await findSocialPostById(env.DB, postId);
  if (!post?.image_key) return null;
  return env.BUCKET.get(post.image_key);
}
