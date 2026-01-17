async function ensureSchema(db) {
  await db.prepare(
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      password_salt TEXT NOT NULL,
      display_name TEXT NOT NULL,
      role TEXT NOT NULL,
      created_at TEXT NOT NULL
    );`
  ).run();

  await db.prepare(`CREATE UNIQUE INDEX IF NOT EXISTS users_email_idx ON users(email);`).run();

  const columns = await db.prepare("PRAGMA table_info(users);").all();
  const existing = new Set(columns.results.map((col) => col.name));

  const missing = [
    { name: "display_name", sql: "ALTER TABLE users ADD COLUMN display_name TEXT NOT NULL DEFAULT ''" },
    { name: "role", sql: "ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'admin'" },
    { name: "created_at", sql: "ALTER TABLE users ADD COLUMN created_at TEXT NOT NULL DEFAULT ''" },
  ];

  for (const column of missing) {
    if (!existing.has(column.name)) {
      await db.prepare(column.sql).run();
    }
  }
}

async function hasAdmin(db) {
  const row = await db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'admin';").first();
  return row?.count > 0;
}

async function insertAdmin(db, { email, passwordHash, salt, name }) {
  const now = new Date().toISOString();
  await db
    .prepare(
      "INSERT INTO users (email, password_hash, password_salt, display_name, role, created_at) VALUES (?, ?, ?, ?, 'admin', ?)"
    )
    .bind(email, passwordHash, salt, name, now)
    .run();
}

async function findUserByEmail(db, email) {
  return db
    .prepare("SELECT id, email, password_hash, password_salt, display_name, role FROM users WHERE email = ?")
    .bind(email)
    .first();
}

async function listAdmins(db) {
  return db
    .prepare("SELECT id, display_name, email, created_at FROM users WHERE role = 'admin' ORDER BY id DESC")
    .all();
}

async function findUserIdByEmail(db, email) {
  return db.prepare("SELECT id FROM users WHERE email = ?").bind(email).first();
}

export { ensureSchema, findUserByEmail, findUserIdByEmail, hasAdmin, insertAdmin, listAdmins };
