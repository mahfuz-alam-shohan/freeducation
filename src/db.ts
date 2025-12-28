import type { Env } from "./types";

// --- Schema Definition ---
// This is the "Source of Truth". The DB will be forced to match this.
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

export async function ensureDatabase(env: Env): Promise<{ ok: boolean; message?: string }> {
  if (!env.DB) return { ok: false, message: "DB binding missing" };

  try {
    // 1. Get list of existing tables
    const existingTablesResult = await env.DB.prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
    ).all<{name: string}>();
    const existingTableNames = (existingTablesResult.results || []).map(r => r.name);
    const expectedTableNames = TABLES.map(t => t.name);

    // 2. DROP Unused Tables
    // If a table exists in DB but is NOT in our code, delete it.
    for (const tableName of existingTableNames) {
      if (!expectedTableNames.includes(tableName)) {
        console.log(`Dropping unused table: ${tableName}`);
        await env.DB.prepare(`DROP TABLE IF EXISTS ${tableName}`).run();
      }
    }

    // 3. Sync Expected Tables (Create or Update)
    // We disable Foreign Keys during schema updates to avoid locking issues
    await env.DB.prepare("PRAGMA foreign_keys = OFF").run();

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
    for (const idx of INDEXES) {
      await env.DB.prepare(idx).run();
    }

    // Re-enable Foreign Keys
    await env.DB.prepare("PRAGMA foreign_keys = ON").run();

    return { ok: true };
  } catch (e: any) {
    return { ok: false, message: e.message };
  }
}

async function createTable(env: Env, name: string, definitions: string[]) {
  const query = `CREATE TABLE ${name} (${definitions.join(", ")})`;
  await env.DB.prepare(query).run();
}

async function syncTableColumns(env: Env, tableName: string, definitions: string[]) {
  // Get existing columns
  const columnsResult = await env.DB.prepare(`PRAGMA table_info(${tableName})`).all<{name: string}>();
  const existingColumns = (columnsResult.results || []).map(c => c.name);

  // Parse expected columns from definition strings
  // Note: This is a simple parser. It assumes the first word is the column name.
  // It filters out constraints like "PRIMARY KEY" or "FOREIGN KEY" starting lines.
  const expectedColumns = definitions
    .map(d => d.trim())
    .filter(d => !/^(PRIMARY|FOREIGN|CONSTRAINT|UNIQUE|CHECK)\s/i.test(d))
    .map(d => d.split(" ")[0]); // Get just the name "id", "name", etc.

  // Check if we are missing any columns
  const missingColumns = expectedColumns.filter(c => !existingColumns.includes(c));

  if (missingColumns.length > 0) {
    console.log(`Table '${tableName}' is missing columns: ${missingColumns.join(", ")}. Rebuilding...`);
    // SQLite doesn't support arbitrary ALTER TABLE nicely, so the safest way to ensure
    // strict schema compliance (ordering, types, etc.) is to rebuild the table.
    
    // 1. Rename old table
    const tempName = `${tableName}_old_${Date.now()}`;
    await env.DB.prepare(`ALTER TABLE ${tableName} RENAME TO ${tempName}`).run();

    // 2. Create new table with correct schema
    await createTable(env, tableName, definitions);

    // 3. Copy data back (only for columns that exist in both)
    const commonColumns = existingColumns.filter(c => expectedColumns.includes(c));
    if (commonColumns.length > 0) {
      const cols = commonColumns.join(", ");
      await env.DB.prepare(`INSERT INTO ${tableName} (${cols}) SELECT ${cols} FROM ${tempName}`).run();
    }

    // 4. Drop old table
    await env.DB.prepare(`DROP TABLE ${tempName}`).run();
  }
}

// Safer Reset
export async function resetDatabase(env: Env) {
  // We just drop everything known. The next ensureDatabase() call will rebuild it all.
  const existingTables = await env.DB.prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
  ).all<{name: string}>();
  
  const tables = (existingTables.results || []).map(r => r.name);
  
  await env.DB.prepare("PRAGMA foreign_keys = OFF").run();
  for (const t of tables) {
    await env.DB.prepare(`DROP TABLE IF EXISTS ${t}`).run();
  }
  await env.DB.prepare("PRAGMA foreign_keys = ON").run();
  
  // Re-init immediately
  await ensureDatabase(env);
}


