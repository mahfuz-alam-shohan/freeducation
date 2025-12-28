import type { Env } from "./types";

// --- Schema Definition ---
const TABLES = [
  {
    name: "admins",
    definition: [
      "id INTEGER PRIMARY KEY AUTOINCREMENT",
      "name TEXT NOT NULL",
      "email TEXT NOT NULL UNIQUE",
      "password_hash TEXT NOT NULL",
      "created_at TEXT NOT NULL"
    ]
  },
  {
    name: "admin_sessions",
    definition: [
      "id INTEGER PRIMARY KEY AUTOINCREMENT",
      "admin_id INTEGER NOT NULL",
      "token TEXT NOT NULL UNIQUE",
      "created_at TEXT NOT NULL",
      "expires_at TEXT NOT NULL",
      "FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE"
    ]
  },
  {
    name: "classes",
    definition: [
      "id INTEGER PRIMARY KEY AUTOINCREMENT",
      "name TEXT NOT NULL",
      "has_groups INTEGER NOT NULL DEFAULT 0",
      "created_at TEXT NOT NULL"
    ]
  },
  {
    name: "class_links",
    definition: [
      "id INTEGER PRIMARY KEY AUTOINCREMENT",
      "name TEXT NOT NULL",
      "created_at TEXT NOT NULL"
    ]
  },
  {
    name: "class_link_members",
    definition: [
      "link_id INTEGER NOT NULL",
      "class_id INTEGER NOT NULL",
      "PRIMARY KEY (link_id, class_id)",
      "FOREIGN KEY (link_id) REFERENCES class_links(id) ON DELETE CASCADE",
      "FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE"
    ]
  },
  {
    name: "class_groups",
    definition: [
      "id INTEGER PRIMARY KEY AUTOINCREMENT",
      "name TEXT NOT NULL",
      "class_id INTEGER",
      "link_id INTEGER",
      "created_at TEXT NOT NULL",
      "FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE",
      "FOREIGN KEY (link_id) REFERENCES class_links(id) ON DELETE CASCADE"
    ]
  },
  {
    name: "subjects",
    definition: [
      "id INTEGER PRIMARY KEY AUTOINCREMENT",
      "name TEXT NOT NULL",
      "class_id INTEGER",
      "group_id INTEGER",
      "link_id INTEGER",
      "created_at TEXT NOT NULL",
      "FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE",
      "FOREIGN KEY (group_id) REFERENCES class_groups(id) ON DELETE CASCADE",
      "FOREIGN KEY (link_id) REFERENCES class_links(id) ON DELETE CASCADE"
    ]
  }
];

const INDEXES = [
  "CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(token)",
  "CREATE INDEX IF NOT EXISTS idx_admin_sessions_admin_id ON admin_sessions(admin_id)",
  "CREATE INDEX IF NOT EXISTS idx_class_groups_class_id ON class_groups(class_id)",
  "CREATE INDEX IF NOT EXISTS idx_class_groups_link_id ON class_groups(link_id)",
  "CREATE INDEX IF NOT EXISTS idx_subjects_class_id ON subjects(class_id)",
  "CREATE INDEX IF NOT EXISTS idx_subjects_group_id ON subjects(group_id)",
  "CREATE INDEX IF NOT EXISTS idx_subjects_link_id ON subjects(link_id)"
];

export async function ensureDatabase(env: Env): Promise<{ ok: boolean; message?: string }> {
  if (!env.DB) return { ok: false, message: "DB binding missing" };

  try {
    // 1. Create Tables (Safe: IF NOT EXISTS)
    for (const table of TABLES) {
      await env.DB.prepare(`CREATE TABLE IF NOT EXISTS ${table.name} (${table.definition.join(", ")})`).run();
    }

    // 2. Ensure Columns Exist (Safe: ALTER TABLE ADD COLUMN)
    // We try to add every column. If it exists, SQLite throws an error which we catch and ignore.
    // This is the "Add Only" strategy that avoids SQLITE_AUTH errors.
    for (const table of TABLES) {
      // We skip the first definition usually because it's the primary key created with the table
      for (const colDef of table.definition) {
        // Skip constraints like FOREIGN KEY or PRIMARY KEY definitions
        if (colDef.trim().match(/^(FOREIGN|PRIMARY|CONSTRAINT|UNIQUE|CHECK)/i)) continue;
        
        try {
          // Attempt to add the column. 
          await env.DB.prepare(`ALTER TABLE ${table.name} ADD COLUMN ${colDef}`).run();
        } catch (e: any) {
          // If error is "duplicate column name", that's good! It means it exists.
          // If it's another error, we log it but don't crash.
          if (!e.message?.includes("duplicate column name")) {
             console.warn(`Column sync note for ${table.name}:`, e.message);
          }
        }
      }
    }

    // 3. Ensure Indexes
    for (const idx of INDEXES) {
      await env.DB.prepare(idx).run();
    }

    return { ok: true };
  } catch (e: any) {
    // We allow the app to proceed even if schema sync has hiccups, to prevent lockout.
    console.error("Critical Schema Error:", e);
    return { ok: true, message: "Schema sync partial warning" };
  }
}

// Safer Reset: We try to drop known tables.
export async function resetDatabase(env: Env) {
  const tableNames = TABLES.map(t => t.name).reverse(); // Reverse order to drop children before parents
  
  for (const t of tableNames) {
    try {
      await env.DB.prepare(`DROP TABLE IF EXISTS ${t}`).run();
    } catch(e) {
      console.error(`Failed to drop ${t}`, e);
    }
  }
  
  await ensureDatabase(env);
}

