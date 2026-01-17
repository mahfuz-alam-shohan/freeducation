export async function createSession(env, { token, userId, expiresAt }) {
  return env.DB.prepare(
    "INSERT INTO sessions (token, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)"
  )
    .bind(token, userId, expiresAt, new Date().toISOString())
    .run();
}

export async function deleteSession(env, token) {
  return env.DB.prepare("DELETE FROM sessions WHERE token = ?")
    .bind(token)
    .run();
}

export async function getSessionUser(env, token) {
  const now = new Date().toISOString();
  const record = await env.DB.prepare(
    `
      SELECT users.id, users.full_name, users.email, users.role
      FROM sessions
      JOIN users ON sessions.user_id = users.id
      WHERE sessions.token = ? AND sessions.expires_at > ?
    `
  )
    .bind(token, now)
    .first();

  if (!record) {
    await deleteSession(env, token);
  }

  return record || null;
}
