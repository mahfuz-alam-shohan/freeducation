import { registerTableSchema } from "../../../shared/db/schema";

registerTableSchema({
  name: "email_verifications",
  createSql: `CREATE TABLE IF NOT EXISTS email_verifications (
    email TEXT PRIMARY KEY,
    code TEXT NOT NULL,
    expires_at INTEGER NOT NULL,
    attempts INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
  columns: [
    { name: "email", sql: "TEXT PRIMARY KEY" },
    { name: "code", sql: "TEXT NOT NULL" },
    { name: "expires_at", sql: "INTEGER NOT NULL" },
    { name: "attempts", sql: "INTEGER DEFAULT 0" },
    { name: "created_at", sql: "DATETIME DEFAULT CURRENT_TIMESTAMP" },
  ],
});

registerTableSchema({
  name: "admins",
  createSql: `CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password_hash TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
  columns: [
    { name: "username", sql: "TEXT UNIQUE" },
    { name: "password_hash", sql: "TEXT" },
    { name: "created_at", sql: "DATETIME DEFAULT CURRENT_TIMESTAMP" },
  ],
});

registerTableSchema({
  name: "users",
  createSql: `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    name TEXT,
    email TEXT UNIQUE,
    password_hash TEXT,
    role TEXT NOT NULL,
    class_label TEXT,
    group_label TEXT,
    religion TEXT,
    date_of_birth TEXT,
    batch_year TEXT,
    points INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
  columns: [
    { name: "username", sql: "TEXT UNIQUE" },
    { name: "name", sql: "TEXT" },
    { name: "email", sql: "TEXT UNIQUE" },
    { name: "password_hash", sql: "TEXT" },
    { name: "role", sql: "TEXT NOT NULL" },
    { name: "class_label", sql: "TEXT" },
    { name: "group_label", sql: "TEXT" },
    { name: "religion", sql: "TEXT" },
    { name: "date_of_birth", sql: "TEXT" },
    { name: "batch_year", sql: "TEXT" },
    { name: "points", sql: "INTEGER DEFAULT 0" },
    { name: "created_at", sql: "DATETIME DEFAULT CURRENT_TIMESTAMP" },
  ],
});

registerTableSchema({
  name: "user_profiles",
  createSql: `CREATE TABLE IF NOT EXISTS user_profiles (
    user_id INTEGER PRIMARY KEY,
    avatar_key TEXT,
    avatar_content_type TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
  columns: [
    { name: "user_id", sql: "INTEGER PRIMARY KEY" },
    { name: "avatar_key", sql: "TEXT" },
    { name: "avatar_content_type", sql: "TEXT" },
    { name: "updated_at", sql: "DATETIME DEFAULT CURRENT_TIMESTAMP" },
  ],
});

registerTableSchema({
  name: "admin_permissions",
  createSql: `CREATE TABLE IF NOT EXISTS admin_permissions (
    user_id INTEGER PRIMARY KEY,
    permissions TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
  columns: [
    { name: "user_id", sql: "INTEGER PRIMARY KEY" },
    { name: "permissions", sql: "TEXT NOT NULL" },
    { name: "created_at", sql: "DATETIME DEFAULT CURRENT_TIMESTAMP" },
  ],
});

registerTableSchema({
  name: "teacher_assignments",
  createSql: `CREATE TABLE IF NOT EXISTS teacher_assignments (
    user_id INTEGER PRIMARY KEY,
    level TEXT NOT NULL,
    subject TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
  columns: [
    { name: "user_id", sql: "INTEGER PRIMARY KEY" },
    { name: "level", sql: "TEXT NOT NULL" },
    { name: "subject", sql: "TEXT NOT NULL" },
    { name: "created_at", sql: "DATETIME DEFAULT CURRENT_TIMESTAMP" },
  ],
});

registerTableSchema({
  name: "teacher_permissions",
  createSql: `CREATE TABLE IF NOT EXISTS teacher_permissions (
    user_id INTEGER PRIMARY KEY,
    permissions TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
  columns: [
    { name: "user_id", sql: "INTEGER PRIMARY KEY" },
    { name: "permissions", sql: "TEXT NOT NULL" },
    { name: "created_at", sql: "DATETIME DEFAULT CURRENT_TIMESTAMP" },
  ],
});

registerTableSchema({
  name: "edit_history",
  createSql: `CREATE TABLE IF NOT EXISTS edit_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    action TEXT NOT NULL,
    details TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
  columns: [
    { name: "user_id", sql: "INTEGER NOT NULL" },
    { name: "action", sql: "TEXT NOT NULL" },
    { name: "details", sql: "TEXT" },
    { name: "created_at", sql: "DATETIME DEFAULT CURRENT_TIMESTAMP" },
  ],
});

registerTableSchema({
  name: "user_points_log",
  createSql: `CREATE TABLE IF NOT EXISTS user_points_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    points INTEGER NOT NULL,
    reason TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
  columns: [
    { name: "user_id", sql: "INTEGER NOT NULL" },
    { name: "points", sql: "INTEGER NOT NULL" },
    { name: "reason", sql: "TEXT NOT NULL" },
    { name: "created_at", sql: "DATETIME DEFAULT CURRENT_TIMESTAMP" },
  ],
  seeds: ["CREATE UNIQUE INDEX IF NOT EXISTS user_points_log_unique ON user_points_log (user_id, reason)"],
});
