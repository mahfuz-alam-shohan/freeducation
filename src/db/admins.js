export async function getAdminCount(db) {
  const row = await db.prepare("SELECT COUNT(*) AS total FROM freeducation_admins").first();
  return Number(row?.total || 0);
}

export async function findAdminByEmail(db, email) {
  return db.prepare("SELECT * FROM freeducation_admins WHERE email = ?1").bind(email.toLowerCase()).first();
}

export async function findAdminById(db, id) {
  return db.prepare("SELECT id, name, email, created_at FROM freeducation_admins WHERE id = ?1").bind(id).first();
}

export async function createAdmin(db, { name, email, hash, salt }) {
  const now = new Date().toISOString();
  await db.prepare(
    `INSERT INTO freeducation_admins (name, email, password_hash, password_salt, created_at, updated_at)
     VALUES (?1, ?2, ?3, ?4, ?5, ?5)`,
  ).bind(name.trim(), email.toLowerCase(), hash, salt, now).run();
}

export async function listAdmins(db) {
  const result = await db.prepare("SELECT id, name, email, created_at FROM freeducation_admins ORDER BY id DESC").all();
  return result.results;
}

export async function createSession(db, { adminId, tokenHash, expiresAt }) {
  const now = new Date().toISOString();
  await db.prepare(
    `INSERT INTO freeducation_sessions (admin_id, token_hash, created_at, expires_at)
     VALUES (?1, ?2, ?3, ?4)`,
  ).bind(adminId, tokenHash, now, expiresAt).run();
}

export async function findSession(db, tokenHash) {
  return db.prepare(
    `SELECT s.admin_id, s.expires_at, a.name, a.email, a.id
     FROM freeducation_sessions s
     JOIN freeducation_admins a ON a.id = s.admin_id
     WHERE s.token_hash = ?1`,
  ).bind(tokenHash).first();
}

export async function deleteSession(db, tokenHash) {
  await db.prepare("DELETE FROM freeducation_sessions WHERE token_hash = ?1").bind(tokenHash).run();
}

export async function cleanupSessions(db) {
  const now = new Date().toISOString();
  await db.prepare("DELETE FROM freeducation_sessions WHERE expires_at <= ?1").bind(now).run();
}
