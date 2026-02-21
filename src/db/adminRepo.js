
function nowIso() {
  return new Date().toISOString();
}

export async function getAdminCount(db) {
  const row = await db.prepare("SELECT COUNT(*) AS count FROM users WHERE role = 'admin'").first();
  return Number(row?.count ?? 0);
}

export async function findUserByEmail(db, email) {
  return db.prepare('SELECT * FROM users WHERE email = ?1').bind(email.toLowerCase()).first();
}

export async function createAdmin(db, user) {
  await db
    .prepare(
      `INSERT INTO users (id, email, name, role, image_key, cover_image_key, date_of_birth, password_hash, password_salt, password_iterations, created_at, updated_at)
       VALUES (?1, ?2, ?3, 'admin', ?4, NULL, NULL, ?5, ?6, ?7, ?8, ?8)`
    )
    .bind(
      user.id,
      user.email.toLowerCase(),
      user.name,
      user.imageKey,
      user.passwordHash,
      user.passwordSalt,
      user.passwordIterations,
      user.createdAt
    )
    .run();
}

export async function createSession(db, session) {
  await db
    .prepare('INSERT INTO sessions (id, user_id, expires_at, created_at) VALUES (?1, ?2, ?3, ?4)')
    .bind(session.id, session.userId, session.expiresAt, session.createdAt)
    .run();
}

export async function findSessionWithUser(db, sessionId) {
  return db
    .prepare(
      `SELECT s.id as session_id, s.expires_at, u.id, u.email, u.name, u.role, u.image_key, u.cover_image_key, u.date_of_birth, u.created_at
       FROM sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.id = ?1`
    )
    .bind(sessionId)
    .first();
}

export async function deleteSession(db, sessionId) {
  await db.prepare('DELETE FROM sessions WHERE id = ?1').bind(sessionId).run();
}

export async function listUsers(db) {
  const rows = await db
    .prepare('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC LIMIT 500')
    .all();
  return rows.results ?? [];
}


export async function findUserById(db, userId) {
  return db.prepare('SELECT * FROM users WHERE id = ?1').bind(userId).first();
}

export async function updateUserName(db, userId, name) {
  await db.prepare('UPDATE users SET name = ?2, updated_at = ?3 WHERE id = ?1').bind(userId, name, nowIso()).run();
}

export async function updateUserImage(db, userId, imageKey) {
  await db.prepare('UPDATE users SET image_key = ?2, updated_at = ?3 WHERE id = ?1').bind(userId, imageKey, nowIso()).run();
}

export async function updateUserCoverImage(db, userId, imageKey) {
  await db.prepare('UPDATE users SET cover_image_key = ?2, updated_at = ?3 WHERE id = ?1').bind(userId, imageKey, nowIso()).run();
}

export async function updateUserPassword(db, userId, passwordHash, passwordSalt, passwordIterations) {
  await db
    .prepare('UPDATE users SET password_hash = ?2, password_salt = ?3, password_iterations = ?4, updated_at = ?5 WHERE id = ?1')
    .bind(userId, passwordHash, passwordSalt, passwordIterations, nowIso())
    .run();
}


export async function updateUserDateOfBirth(db, userId, dateOfBirth) {
  await db.prepare('UPDATE users SET date_of_birth = ?2, updated_at = ?3 WHERE id = ?1').bind(userId, dateOfBirth, nowIso()).run();
}
