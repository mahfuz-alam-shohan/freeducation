export async function getAdminCount(db) {
  const row = await db.prepare("SELECT COUNT(*) AS total FROM freeducation_admins WHERE user_type = 'Administrator'").first();
  return Number(row?.total || 0);
}

export async function findAdminByEmail(db, email) {
  return db.prepare("SELECT * FROM freeducation_admins WHERE email = ?1").bind(email.toLowerCase()).first();
}

export async function findAdminById(db, id) {
  return db.prepare("SELECT id, name, email, user_type, date_of_birth, gender, avatar_key, cover_key, created_at FROM freeducation_admins WHERE id = ?1").bind(id).first();
}

export async function createAdmin(db, { name, email, hash, salt, userType = "Administrator" }) {
  const now = new Date().toISOString();
  await db.prepare(
    `INSERT INTO freeducation_admins (name, email, password_hash, password_salt, user_type, created_at, updated_at)
     VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?6)`,
  ).bind(name.trim(), email.toLowerCase(), hash, salt, userType, now).run();
}

export async function listAdmins(db) {
  const result = await db.prepare("SELECT id, name, email, user_type, created_at FROM freeducation_admins ORDER BY id DESC").all();
  return result.results;
}

export async function updateAdminPassword(db, { adminId, hash, salt }) {
  const now = new Date().toISOString();
  await db.prepare(
    `UPDATE freeducation_admins
     SET password_hash = ?1, password_salt = ?2, updated_at = ?3
     WHERE id = ?4`,
  ).bind(hash, salt, now, adminId).run();
}

export async function updateAdminImageKey(db, { adminId, keyField, keyValue }) {
  const now = new Date().toISOString();
  await db.prepare(`UPDATE freeducation_admins SET ${keyField} = ?1, updated_at = ?2 WHERE id = ?3`).bind(keyValue, now, adminId).run();
}

export async function updateAdminProfileField(db, { adminId, field, value }) {
  const now = new Date().toISOString();
  const allowedFields = {
    name: "name",
    date_of_birth: "date_of_birth",
    gender: "gender",
  };
  const column = allowedFields[field];
  if (!column) throw new Error("Invalid profile field");

  await db.prepare(`UPDATE freeducation_admins SET ${column} = ?1, updated_at = ?2 WHERE id = ?3`).bind(value, now, adminId).run();
}

export async function deleteAdminById(db, id) {
  await db.prepare("DELETE FROM freeducation_admins WHERE id = ?1").bind(id).run();
}

export async function createSession(db, { adminId, tokenHash, expiresAt, deviceLabel = "" }) {
  const now = new Date().toISOString();
  await db.prepare(
    `INSERT INTO freeducation_sessions (admin_id, token_hash, device_label, created_at, expires_at)
     VALUES (?1, ?2, ?3, ?4, ?5)`,
  ).bind(adminId, tokenHash, deviceLabel, now, expiresAt).run();
}

export async function findSession(db, tokenHash) {
  return db.prepare(
    `SELECT s.admin_id, s.expires_at, s.created_at AS session_created_at, s.device_label,
            a.name, a.email, a.id, a.user_type, a.date_of_birth, a.gender, a.avatar_key, a.cover_key
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
