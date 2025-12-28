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
  }
];

const INDEXES = [
  "CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(token)",
  "CREATE INDEX IF NOT EXISTS idx_admin_sessions_admin_id ON admin_sessions(admin_id)",
  "CREATE INDEX IF NOT EXISTS idx_class_groups_class_id ON class_groups(class_id)",
  "CREATE INDEX IF NOT EXISTS idx_class_groups_link_id ON class_groups(link_id)"
];

// Order matters for deletion (Children first, then Parents) because we cannot disable FK checks safely
const DROP_ORDER = [
  "class_groups",        // References classes & class_links
  "class_link_members",  // References classes & class_links
  "admin_sessions",      // References admins
  "class_links",         // Referenced by others
  "classes",             // Referenced by others
  "admins"               // Referenced by admin_sessions
];

export async function ensureDatabase(env: Env): Promise<{ ok: boolean; message?: string }> {
  if (!env.DB) return { ok: false, message: "DB binding missing" };

  try {
    // 1. Get list of existing tables
    // D1 allows reading sqlite_master, but restricts modifying it.
    const existingTablesResult = await env.DB.prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
    ).all<{name: string}>();
    const existingTableNames = (existingTablesResult.results || []).map(r => r.name);
    const expectedTableNames = TABLES.map(t => t.name);

    // 2. DROP Unused Tables
    // We only drop tables that are NOT in our expected list.
    for (const tableName of existingTableNames) {
      if (!expectedTableNames.includes(tableName)) {
        console.log(`Dropping unused table: ${tableName}`);
        await env.DB.prepare(`DROP TABLE IF EXISTS ${tableName}`).run();
      }
    }

    // 3. Sync Expected Tables (Create or Update)
    for (const table of TABLES) {
      if (!existingTableNames.includes(table.name)) {
        // Table doesn't exist -> Create it
        console.log(`Creating table: ${table.name}`);
        await createTable(env, table.name, table.definition);
      } else {
        // Table exists -> Check columns
        await syncTableColumns(env, table.name, table.definition);
      }
    }

    // 4. Ensure Indexes
    // We run these individually. Errors like "index already exists" are ignored implicitly by IF NOT EXISTS
    for (const idx of INDEXES) {
      await env.DB.prepare(idx).run();
    }

    return { ok: true };
  } catch (e: any) {
    console.error("Schema Sync Error:", e);
    // We return ok: true even if sync has minor issues, to prevent locking the user out of the dashboard
    // unless it's a critical failure.
    return { ok: false, message: e.message || "Unknown DB Error" };
  }
}

async function createTable(env: Env, name: string, definitions: string[]) {
  const query = `CREATE TABLE ${name} (${definitions.join(", ")})`;
  await env.DB.prepare(query).run();
}

async function syncTableColumns(env: Env, tableName: string, definitions: string[]) {
  try {
    // Get existing columns
    const columnsResult = await env.DB.prepare(`PRAGMA table_info(${tableName})`).all<{name: string}>();
    const existingColumns = (columnsResult.results || []).map(c => c.name);

    // Parse expected columns
    const expectedColumns = definitions
      .map(d => d.trim())
      .filter(d => !/^(PRIMARY|FOREIGN|CONSTRAINT|UNIQUE|CHECK)\s/i.test(d))
      .map(d => d.split(" ")[0]); 

    const missingColumns = expectedColumns.filter(c => !existingColumns.includes(c));

    if (missingColumns.length > 0) {
      console.log(`Table '${tableName}' is missing columns: ${missingColumns.join(", ")}. Attempting rebuild...`);
      
      // Strategy: Rename -> Create New -> Copy -> Drop Old
      // Note: This might fail if foreign keys constrain the DROP. 
      // Since we can't disable FKs, this is best-effort.
      
      const tempName = `${tableName}_old_${Date.now()}`;
      await env.DB.prepare(`ALTER TABLE ${tableName} RENAME TO ${tempName}`).run();

      await createTable(env, tableName, definitions);

      const commonColumns = existingColumns.filter(c => expectedColumns.includes(c));
      if (commonColumns.length > 0) {
        const cols = commonColumns.join(", ");
        await env.DB.prepare(`INSERT INTO ${tableName} (${cols}) SELECT ${cols} FROM ${tempName}`).run();
      }

      await env.DB.prepare(`DROP TABLE ${tempName}`).run();
    }
  } catch (e) {
    console.error(`Failed to sync columns for ${tableName}. You may need to factory reset if schema is corrupt.`, e);
    // We suppress the error here so the app can still try to run.
  }
}

// Safer Reset using hardcoded drop order
export async function resetDatabase(env: Env) {
  // We don't query existing tables for order; we use our known dependency order.
  // Any extra tables not in DROP_ORDER will be cleaned up by the next ensureDatabase() call anyway.
  
  for (const t of DROP_ORDER) {
    await env.DB.prepare(`DROP TABLE IF EXISTS ${t}`).run();
  }
  
  // Re-init immediately
  await ensureDatabase(env);
}
