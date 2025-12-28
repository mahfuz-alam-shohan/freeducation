import type { Env } from "./types";

// --- Schema Definition ---
// We define the schema here. The sync logic will ensure the DB matches this.
const SCHEMA_VERSION = 1; // Increment this if you change structure to force a re-check if needed

const TABLES = [
  {
    name: "admins",
    definition: `
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    `
  },
  {
    name: "admin_sessions",
    definition: `
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      admin_id INTEGER NOT NULL,
      token TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
    `
  },
  {
    name: "classes",
    definition: `
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      has_groups INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    `
  },
  {
    name: "class_links",
    definition: `
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      created_at TEXT NOT NULL
    `
  },
  {
    name: "class_link_members",
    definition: `
      link_id INTEGER NOT NULL,
      class_id INTEGER NOT NULL,
      PRIMARY KEY (link_id, class_id),
      FOREIGN KEY (link_id) REFERENCES class_links(id) ON DELETE CASCADE,
      FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
    `
  },
  {
    name: "class_groups",
    definition: `
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      class_id INTEGER,
      link_id INTEGER,
      created_at TEXT NOT NULL,
      FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
      FOREIGN KEY (link_id) REFERENCES class_links(id) ON DELETE CASCADE
    `
  }
];

const INDEXES = [
  "CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(token)",
  "CREATE INDEX IF NOT EXISTS idx_admin_sessions_admin_id ON admin_sessions(admin_id)",
  "CREATE INDEX IF NOT EXISTS idx_class_groups_class_id ON class_groups(class_id)",
  "CREATE INDEX IF NOT EXISTS idx_class_groups_link_id ON class_groups(link_id)"
];

export async function ensureDatabase(env: Env): Promise<{ ok: boolean; message?: string }> {
  if (!env.DB) return { ok: false, message: "DB binding missing" };

  try {
    // Check if admins table exists as a quick health check
    const check = await env.DB.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='admins'").first();
    
    // If admins table is missing, we assume we need to run full initialization
    if (!check) {
      await initializeSchema(env);
    }
    return { ok: true };
  } catch (e: any) {
    return { ok: false, message: e.message };
  }
}

async function initializeSchema(env: Env) {
  console.log("Initializing Database Schema...");
  const batch = [];
  
  // 1. Enable foreign keys
  batch.push(env.DB.prepare("PRAGMA foreign_keys = ON"));

  // 2. Create Tables
  for (const table of TABLES) {
    batch.push(env.DB.prepare(`CREATE TABLE IF NOT EXISTS ${table.name} (${table.definition})`));
  }

  // 3. Create Indexes
  for (const idx of INDEXES) {
    batch.push(env.DB.prepare(idx));
  }

  await env.DB.batch(batch);
}

// Safer Reset that doesn't rely on fragile pragmas
export async function resetDatabase(env: Env) {
  const tables = ["class_groups", "class_link_members", "class_links", "classes", "admin_sessions", "admins"];
  const batch = [];
  
  // Disable FKs temporarily for the drop
  // Note: D1 doesn't support PRAGMA foreign_keys inside a batch usually, so we do it carefully
  for (const t of tables) {
    batch.push(env.DB.prepare(`DROP TABLE IF EXISTS ${t}`));
  }
  
  await env.DB.batch(batch);
  await initializeSchema(env);
}
