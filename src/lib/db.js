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

  await db.prepare(
    `CREATE TABLE IF NOT EXISTS site_settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      theme_id TEXT NOT NULL DEFAULT 'sunrise',
      site_name TEXT NOT NULL DEFAULT 'Freeducation',
      site_name_font TEXT NOT NULL DEFAULT 'Playfair Display',
      logo_source TEXT NOT NULL DEFAULT 'text',
      logo_text TEXT NOT NULL DEFAULT 'Freeducation',
      logo_style TEXT NOT NULL DEFAULT 'badge',
      logo_url TEXT NOT NULL DEFAULT ''
    );`
  ).run();

  await db.prepare("INSERT OR IGNORE INTO site_settings (id) VALUES (1);").run();

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

async function insertUser(db, { email, passwordHash, salt, name, role }) {
  const now = new Date().toISOString();
  await db
    .prepare(
      "INSERT INTO users (email, password_hash, password_salt, display_name, role, created_at) VALUES (?, ?, ?, ?, ?, ?)"
    )
    .bind(email, passwordHash, salt, name, role, now)
    .run();
}

async function findUserByEmail(db, email) {
  return db
    .prepare("SELECT id, email, password_hash, password_salt, display_name, role FROM users WHERE email = ?")
    .bind(email)
    .first();
}

async function findUserById(db, id) {
  return db
    .prepare("SELECT id, display_name, email, role FROM users WHERE id = ?")
    .bind(id)
    .first();
}

async function listUsers(db, { role, search }) {
  const clauses = [];
  const params = [];
  if (role && role !== "all") {
    clauses.push("role = ?");
    params.push(role);
  }
  if (search) {
    const needle = `%${search.toLowerCase()}%`;
    clauses.push("(LOWER(display_name) LIKE ? OR LOWER(email) LIKE ?)");
    params.push(needle, needle);
  }
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  return db
    .prepare(`SELECT id, display_name, email, role, created_at FROM users ${where} ORDER BY id DESC`)
    .bind(...params)
    .all();
}

async function findUserIdByEmail(db, email) {
  return db.prepare("SELECT id FROM users WHERE email = ?").bind(email).first();
}

async function getSiteSettings(db) {
  return db
    .prepare(
      `SELECT theme_id, site_name, site_name_font, logo_source, logo_text, logo_style, logo_url
       FROM site_settings WHERE id = 1`
    )
    .first();
}

async function updateSiteTheme(db, themeId) {
  await db.prepare("UPDATE site_settings SET theme_id = ? WHERE id = 1").bind(themeId).run();
}

async function updateSiteIdentity(
  db,
  { siteName, siteNameFont, logoSource, logoText, logoStyle, logoUrl }
) {
  await db
    .prepare(
      `UPDATE site_settings
       SET site_name = ?, site_name_font = ?, logo_source = ?, logo_text = ?, logo_style = ?, logo_url = ?
       WHERE id = 1`
    )
    .bind(siteName, siteNameFont, logoSource, logoText, logoStyle, logoUrl)
    .run();
}

export {
  ensureSchema,
  findUserByEmail,
  findUserById,
  findUserIdByEmail,
  getSiteSettings,
  hasAdmin,
  insertUser,
  listUsers,
  updateSiteIdentity,
  updateSiteTheme,
};
