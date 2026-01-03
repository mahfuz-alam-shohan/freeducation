export async function initDatabase(db: D1Database) {
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password_hash TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      name TEXT,
      email TEXT UNIQUE,
      password_hash TEXT,
      role TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS admin_permissions (
      user_id INTEGER PRIMARY KEY,
      permissions TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS teacher_assignments (
      user_id INTEGER PRIMARY KEY,
      level TEXT NOT NULL,
      subject TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS content_store (
      key TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS classes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS class_groups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      class_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(class_id, name)
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS fonts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      file_key TEXT,
      content_type TEXT,
      original_name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS subject_thumbnails (
      subject_key TEXT PRIMARY KEY,
      file_key TEXT,
      content_type TEXT,
      zoom REAL DEFAULT 1,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS chapter_thumbnails (
      chapter_key TEXT PRIMARY KEY,
      file_key TEXT,
      content_type TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`),
    db.prepare(`INSERT OR IGNORE INTO classes (name) VALUES ('SSC'), ('HSC')`),
    db.prepare(`INSERT OR IGNORE INTO class_groups (class_id, name)
      SELECT classes.id, group_names.name
      FROM classes
      JOIN (SELECT 'Science' AS name UNION ALL SELECT 'Humanities' UNION ALL SELECT 'Business Studies') AS group_names
      WHERE classes.name IN ('SSC', 'HSC')`),
  ]);

  await ensureTableColumns(db);
}

type ColumnDefinition = {
  name: string;
  sql: string;
};

const tableColumns: Record<string, ColumnDefinition[]> = {
  admins: [
    { name: "username", sql: "TEXT UNIQUE" },
    { name: "password_hash", sql: "TEXT" },
    { name: "created_at", sql: "DATETIME DEFAULT CURRENT_TIMESTAMP" },
  ],
  users: [
    { name: "username", sql: "TEXT UNIQUE" },
    { name: "name", sql: "TEXT" },
    { name: "email", sql: "TEXT UNIQUE" },
    { name: "password_hash", sql: "TEXT" },
    { name: "role", sql: "TEXT NOT NULL" },
    { name: "created_at", sql: "DATETIME DEFAULT CURRENT_TIMESTAMP" },
  ],
  admin_permissions: [
    { name: "user_id", sql: "INTEGER PRIMARY KEY" },
    { name: "permissions", sql: "TEXT NOT NULL" },
    { name: "created_at", sql: "DATETIME DEFAULT CURRENT_TIMESTAMP" },
  ],
  teacher_assignments: [
    { name: "user_id", sql: "INTEGER PRIMARY KEY" },
    { name: "level", sql: "TEXT NOT NULL" },
    { name: "subject", sql: "TEXT NOT NULL" },
    { name: "created_at", sql: "DATETIME DEFAULT CURRENT_TIMESTAMP" },
  ],
  content_store: [
    { name: "key", sql: "TEXT PRIMARY KEY" },
    { name: "data", sql: "TEXT NOT NULL" },
    { name: "updated_at", sql: "DATETIME DEFAULT CURRENT_TIMESTAMP" },
  ],
  classes: [
    { name: "name", sql: "TEXT UNIQUE" },
    { name: "created_at", sql: "DATETIME DEFAULT CURRENT_TIMESTAMP" },
  ],
  class_groups: [
    { name: "class_id", sql: "INTEGER NOT NULL" },
    { name: "name", sql: "TEXT NOT NULL" },
    { name: "created_at", sql: "DATETIME DEFAULT CURRENT_TIMESTAMP" },
  ],
  fonts: [
    { name: "name", sql: "TEXT" },
    { name: "file_key", sql: "TEXT" },
    { name: "content_type", sql: "TEXT" },
    { name: "original_name", sql: "TEXT" },
    { name: "created_at", sql: "DATETIME DEFAULT CURRENT_TIMESTAMP" },
  ],
  subject_thumbnails: [
    { name: "file_key", sql: "TEXT" },
    { name: "content_type", sql: "TEXT" },
    { name: "zoom", sql: "REAL DEFAULT 1" },
    { name: "updated_at", sql: "DATETIME DEFAULT CURRENT_TIMESTAMP" },
  ],
  chapter_thumbnails: [
    { name: "file_key", sql: "TEXT" },
    { name: "content_type", sql: "TEXT" },
    { name: "updated_at", sql: "DATETIME DEFAULT CURRENT_TIMESTAMP" },
  ],
};

const ensureTableColumns = async (db: D1Database) => {
  for (const [table, columns] of Object.entries(tableColumns)) {
    const info = await db.prepare(`PRAGMA table_info(${table})`).all();
    const existing = new Set((info.results || []).map((row: any) => String(row.name)));
    for (const column of columns) {
      if (!existing.has(column.name)) {
        await db.prepare(`ALTER TABLE ${table} ADD COLUMN ${column.name} ${column.sql}`).run();
      }
    }
  }
};
