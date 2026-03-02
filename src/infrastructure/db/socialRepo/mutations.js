export async function createSocialPost(db, { userId, body, imageKey = "" }) {
  const now = new Date().toISOString();
  const result = await db.prepare(
    `INSERT INTO freeducation_social_posts (admin_id, body, image_key, created_at, updated_at)
     VALUES (?1, ?2, ?3, ?4, ?4)`,
  ).bind(userId, body, imageKey, now).run();
  return Number(result.meta?.last_row_id || 0);
}

export async function deleteSocialPostById(db, { postId }) {
  const safePostId = Number.parseInt(String(postId || 0), 10);
  if (!Number.isInteger(safePostId) || safePostId <= 0) return { ok: false };

  await db.prepare(
    `DELETE FROM freeducation_social_comment_reactions
     WHERE comment_id IN (
       SELECT id FROM freeducation_social_comments WHERE post_id = ?1
     )`,
  ).bind(safePostId).run();

  await db.prepare(
    `DELETE FROM freeducation_social_comments
     WHERE post_id = ?1`,
  ).bind(safePostId).run();

  await db.prepare(
    `DELETE FROM freeducation_social_reactions
     WHERE post_id = ?1`,
  ).bind(safePostId).run();

  const deletedPost = await db.prepare(
    `DELETE FROM freeducation_social_posts
     WHERE id = ?1`,
  ).bind(safePostId).run();

  return {
    ok: Number(deletedPost?.meta?.changes || 0) > 0,
    postId: safePostId,
  };
}

export async function createSocialComment(db, { postId, userId, body, parentCommentId = 0 }) {
  const now = new Date().toISOString();
  await db.prepare(
    `INSERT INTO freeducation_social_comments (post_id, admin_id, parent_comment_id, body, created_at)
     VALUES (?1, ?2, ?3, ?4, ?5)`,
  ).bind(postId, userId, parentCommentId > 0 ? parentCommentId : null, body, now).run();
}

export async function toggleSocialReaction(db, { postId, userId }) {
  const existing = await db.prepare(
    `SELECT id FROM freeducation_social_reactions WHERE post_id = ?1 AND admin_id = ?2`,
  ).bind(postId, userId).first();

  if (existing?.id) {
    await db.prepare("DELETE FROM freeducation_social_reactions WHERE id = ?1").bind(existing.id).run();
    return { liked: false };
  }

  const now = new Date().toISOString();
  await db.prepare(
    `INSERT INTO freeducation_social_reactions (post_id, admin_id, created_at)
     VALUES (?1, ?2, ?3)`,
  ).bind(postId, userId, now).run();
  return { liked: true };
}

export async function toggleSocialCommentReaction(db, { commentId, userId }) {
  const existing = await db.prepare(
    `SELECT id FROM freeducation_social_comment_reactions WHERE comment_id = ?1 AND admin_id = ?2`,
  ).bind(commentId, userId).first();

  if (existing?.id) {
    await db.prepare("DELETE FROM freeducation_social_comment_reactions WHERE id = ?1").bind(existing.id).run();
    return { liked: false };
  }

  const now = new Date().toISOString();
  await db.prepare(
    `INSERT INTO freeducation_social_comment_reactions (comment_id, admin_id, created_at)
     VALUES (?1, ?2, ?3)`,
  ).bind(commentId, userId, now).run();
  return { liked: true };
}

export async function markSocialNotificationsSeen(db, { userId, seenAt = "" }) {
  const safeUserId = Number.parseInt(String(userId || 0), 10);
  if (!Number.isInteger(safeUserId) || safeUserId <= 0) return { ok: false };
  const now = String(seenAt || "").trim() || new Date().toISOString();
  await db.prepare(
    `INSERT INTO freeducation_social_notification_meta (admin_id, seen_at, created_at, updated_at)
     VALUES (?1, ?2, ?3, ?3)
     ON CONFLICT(admin_id) DO UPDATE SET
       seen_at = excluded.seen_at,
       updated_at = excluded.updated_at`,
  ).bind(safeUserId, now, now).run();
  return { ok: true, seenAt: now };
}

export async function markSocialNotificationRead(db, { userId, notificationId, readAt = "" }) {
  const safeUserId = Number.parseInt(String(userId || 0), 10);
  const safeNotificationId = String(notificationId || "").trim().slice(0, 220);
  if (!Number.isInteger(safeUserId) || safeUserId <= 0 || !safeNotificationId) return { ok: false };
  const now = String(readAt || "").trim() || new Date().toISOString();
  await db.prepare(
    `INSERT INTO freeducation_social_notification_reads (admin_id, notification_id, read_at, created_at, updated_at)
     VALUES (?1, ?2, ?3, ?3, ?3)
     ON CONFLICT(admin_id, notification_id) DO UPDATE SET
       read_at = excluded.read_at,
       updated_at = excluded.updated_at`,
  ).bind(safeUserId, safeNotificationId, now).run();
  return { ok: true, readAt: now };
}
