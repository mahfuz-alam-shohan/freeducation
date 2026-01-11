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
    email TEXT UNIQUE,
    password_hash TEXT,
    role TEXT NOT NULL
  )`,
  columns: [
    { name: "email", sql: "TEXT UNIQUE" },
    { name: "password_hash", sql: "TEXT" },
    { name: "role", sql: "TEXT NOT NULL" },
  ],
});

registerTableSchema({
  name: "user_profiles",
  createSql: `CREATE TABLE IF NOT EXISTS user_profiles (
    user_id INTEGER PRIMARY KEY,
    username TEXT UNIQUE,
    name TEXT,
    avatar_key TEXT,
    avatar_content_type TEXT,
    dashboard_view TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
  columns: [
    { name: "user_id", sql: "INTEGER PRIMARY KEY" },
    { name: "username", sql: "TEXT UNIQUE" },
    { name: "name", sql: "TEXT" },
    { name: "avatar_key", sql: "TEXT" },
    { name: "avatar_content_type", sql: "TEXT" },
    { name: "dashboard_view", sql: "TEXT" },
    { name: "created_at", sql: "DATETIME DEFAULT CURRENT_TIMESTAMP" },
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
