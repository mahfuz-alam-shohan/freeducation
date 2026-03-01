export async function findUserByEmail(db, email) {
  return db.prepare("SELECT * FROM freeducation_admins WHERE email = ?1").bind(email.toLowerCase()).first();
}

export async function findUserById(db, id) {
  return db.prepare("SELECT id, name, email, user_type, date_of_birth, gender, avatar_key, cover_key, created_at FROM freeducation_admins WHERE id = ?1").bind(id).first();
}

export async function createUser(db, { name, email, hash, salt, userType = "Administrator" }) {
  const now = new Date().toISOString();
  await db.prepare(
    `INSERT INTO freeducation_admins (name, email, password_hash, password_salt, user_type, created_at, updated_at)
     VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?6)`,
  ).bind(name.trim(), email.toLowerCase(), hash, salt, userType, now).run();
}

export async function listUsers(db) {
  const result = await db.prepare("SELECT id, name, email, user_type, created_at FROM freeducation_admins ORDER BY id DESC").all();
  return result.results;
}

export async function searchUsersForSocial(db, { query = "", limit = 12 } = {}) {
  const normalizedLimit = Math.max(1, Math.min(30, Number.parseInt(String(limit || 12), 10) || 12));
  const normalizedQuery = String(query || "").trim().toLowerCase();
  if (!normalizedQuery) {
    const recent = await db.prepare(
      `SELECT id, name, email, user_type, avatar_key, created_at
       FROM freeducation_admins
       ORDER BY datetime(created_at) DESC, id DESC
       LIMIT ?1`,
    ).bind(normalizedLimit).all();
    return recent.results;
  }

  const prefix = `${normalizedQuery}%`;
  const contains = `%${normalizedQuery}%`;
  const result = await db.prepare(
    `SELECT id, name, email, user_type, avatar_key, created_at
     FROM freeducation_admins
     WHERE lower(name) LIKE ?1 OR lower(email) LIKE ?1 OR lower(user_type) LIKE ?1
     ORDER BY
       CASE
         WHEN lower(name) = ?2 THEN 0
         WHEN lower(name) LIKE ?3 THEN 1
         WHEN lower(email) LIKE ?3 THEN 2
         WHEN lower(user_type) LIKE ?3 THEN 3
         ELSE 4
       END,
       datetime(created_at) DESC,
       id DESC
     LIMIT ?4`,
  ).bind(contains, normalizedQuery, prefix, normalizedLimit).all();
  return result.results;
}

export async function updateUserPassword(db, { userId, hash, salt }) {
  const now = new Date().toISOString();
  await db.prepare(
    `UPDATE freeducation_admins
     SET password_hash = ?1, password_salt = ?2, updated_at = ?3
     WHERE id = ?4`,
  ).bind(hash, salt, now, userId).run();
}

export async function updateUserImageKey(db, { userId, keyField, keyValue }) {
  const now = new Date().toISOString();
  await db.prepare(`UPDATE freeducation_admins SET ${keyField} = ?1, updated_at = ?2 WHERE id = ?3`).bind(keyValue, now, userId).run();
}

export async function clearUserImageKeyReferences(db, keyValue) {
  const key = String(keyValue || "").trim();
  if (!key) return;
  const now = new Date().toISOString();
  await db.prepare(
    `UPDATE freeducation_admins
     SET avatar_key = CASE WHEN avatar_key = ?1 THEN '' ELSE avatar_key END,
         cover_key = CASE WHEN cover_key = ?1 THEN '' ELSE cover_key END,
         updated_at = ?2
     WHERE avatar_key = ?1 OR cover_key = ?1`,
  ).bind(key, now).run();
}

export async function updateUserProfileField(db, { userId, field, value }) {
  const now = new Date().toISOString();
  const allowedFields = {
    name: "name",
    date_of_birth: "date_of_birth",
    gender: "gender",
  };
  const column = allowedFields[field];
  if (!column) throw new Error("Invalid profile field");

  await db.prepare(`UPDATE freeducation_admins SET ${column} = ?1, updated_at = ?2 WHERE id = ?3`).bind(value, now, userId).run();
}

export async function deleteUserById(db, id) {
  await db.prepare("DELETE FROM freeducation_admins WHERE id = ?1").bind(id).run();
}
