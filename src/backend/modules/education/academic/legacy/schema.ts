import { registerTableSchema } from "../../../../../shared/db/schema";

registerTableSchema({
  name: "content_store",
  createSql: `CREATE TABLE IF NOT EXISTS content_store (
    key TEXT PRIMARY KEY,
    data TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
  columns: [
    { name: "key", sql: "TEXT PRIMARY KEY" },
    { name: "data", sql: "TEXT NOT NULL" },
    { name: "updated_at", sql: "DATETIME DEFAULT CURRENT_TIMESTAMP" },
  ],
});

registerTableSchema({
  name: "classes",
  createSql: `CREATE TABLE IF NOT EXISTS classes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
  columns: [
    { name: "name", sql: "TEXT UNIQUE" },
    { name: "created_at", sql: "DATETIME DEFAULT CURRENT_TIMESTAMP" },
  ],
  seeds: [
    "INSERT OR IGNORE INTO classes (name) VALUES ('SSC'), ('HSC')",
    `INSERT OR IGNORE INTO class_groups (class_id, name)
      SELECT classes.id, group_names.name
      FROM classes
      JOIN (SELECT 'Science' AS name UNION ALL SELECT 'Humanities' UNION ALL SELECT 'Business Studies') AS group_names
      WHERE classes.name IN ('SSC', 'HSC')`,
  ],
});

registerTableSchema({
  name: "class_groups",
  createSql: `CREATE TABLE IF NOT EXISTS class_groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    class_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(class_id, name)
  )`,
  columns: [
    { name: "class_id", sql: "INTEGER NOT NULL" },
    { name: "name", sql: "TEXT NOT NULL" },
    { name: "created_at", sql: "DATETIME DEFAULT CURRENT_TIMESTAMP" },
  ],
});

registerTableSchema({
  name: "fonts",
  createSql: `CREATE TABLE IF NOT EXISTS fonts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    file_key TEXT,
    content_type TEXT,
    original_name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
  columns: [
    { name: "name", sql: "TEXT" },
    { name: "file_key", sql: "TEXT" },
    { name: "content_type", sql: "TEXT" },
    { name: "original_name", sql: "TEXT" },
    { name: "created_at", sql: "DATETIME DEFAULT CURRENT_TIMESTAMP" },
  ],
});

registerTableSchema({
  name: "subject_thumbnails",
  createSql: `CREATE TABLE IF NOT EXISTS subject_thumbnails (
    subject_key TEXT PRIMARY KEY,
    file_key TEXT,
    content_type TEXT,
    zoom REAL DEFAULT 1,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
  columns: [
    { name: "file_key", sql: "TEXT" },
    { name: "content_type", sql: "TEXT" },
    { name: "zoom", sql: "REAL DEFAULT 1" },
    { name: "updated_at", sql: "DATETIME DEFAULT CURRENT_TIMESTAMP" },
  ],
});

registerTableSchema({
  name: "chapter_thumbnails",
  createSql: `CREATE TABLE IF NOT EXISTS chapter_thumbnails (
    chapter_key TEXT PRIMARY KEY,
    file_key TEXT,
    content_type TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
  columns: [
    { name: "file_key", sql: "TEXT" },
    { name: "content_type", sql: "TEXT" },
    { name: "updated_at", sql: "DATETIME DEFAULT CURRENT_TIMESTAMP" },
  ],
});
