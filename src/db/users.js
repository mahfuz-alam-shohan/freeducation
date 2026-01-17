export async function getAdminCount(env) {
  const result = await env.DB.prepare(
    "SELECT COUNT(*) as count FROM users WHERE role = 'admin'"
  ).first();
  return result?.count ?? 0;
}

export async function getUserByEmail(env, email) {
  return env.DB.prepare(
    "SELECT id, full_name, email, password_hash, password_salt, role FROM users WHERE email = ?"
  )
    .bind(email)
    .first();
}

export async function listAdmins(env) {
  const admins = await env.DB.prepare(
    "SELECT full_name, email, created_at FROM users WHERE role = 'admin' ORDER BY created_at DESC"
  ).all();

  return admins.results || [];
}

export async function createAdmin(env, { fullName, email, hash, salt }) {
  return env.DB.prepare(
    "INSERT INTO users (full_name, email, password_hash, password_salt, role, created_at) VALUES (?, ?, ?, ?, ?, ?)"
  )
    .bind(fullName, email, hash, salt, "admin", new Date().toISOString())
    .run();
}

export async function findUserByEmail(env, email) {
  return env.DB.prepare("SELECT id FROM users WHERE email = ?")
    .bind(email)
    .first();
}
