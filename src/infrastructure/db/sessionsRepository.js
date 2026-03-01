export async function createSession(db, { userId, tokenHash, expiresAt, deviceLabel = "" }) {
  const now = new Date().toISOString();
  await db.prepare(
    `INSERT INTO freeducation_sessions (admin_id, token_hash, device_label, created_at, expires_at)
     VALUES (?1, ?2, ?3, ?4, ?5)`,
  ).bind(userId, tokenHash, deviceLabel, now, expiresAt).run();
}

export async function findSessionByTokenHash(db, tokenHash) {
  return db.prepare(
    `SELECT s.admin_id, s.expires_at, s.created_at AS session_created_at, s.device_label,
            a.name, a.email, a.id, a.user_type, a.date_of_birth, a.gender, a.avatar_key, a.cover_key
     FROM freeducation_sessions s
     JOIN freeducation_admins a ON a.id = s.admin_id
     WHERE s.token_hash = ?1`,
  ).bind(tokenHash).first();
}

export async function deleteSessionByTokenHash(db, tokenHash) {
  await db.prepare("DELETE FROM freeducation_sessions WHERE token_hash = ?1").bind(tokenHash).run();
}

export async function cleanupExpiredSessions(db) {
  const now = new Date().toISOString();
  await db.prepare("DELETE FROM freeducation_sessions WHERE expires_at <= ?1").bind(now).run();
}
