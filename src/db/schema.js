const TABLES = {
  users: {
    create: `CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      image_key TEXT,
      password_hash TEXT,
      password_salt TEXT,
      password_iterations INTEGER,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )`,
    columns: {
      id: 'TEXT',
      email: 'TEXT',
      name: 'TEXT',
      role: 'TEXT',
      image_key: 'TEXT',
      password_hash: 'TEXT',
      password_salt: 'TEXT',
      password_iterations: 'INTEGER',
      created_at: 'TEXT',
      updated_at: 'TEXT',
    },
  },
  sessions: {
    create: `CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      expires_at INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,
    columns: {
      id: 'TEXT',
      user_id: 'TEXT',
      expires_at: 'INTEGER',
      created_at: 'TEXT',
    },
  },
};

const SYSTEM_TABLE_PREFIXES = ['sqlite_', 'd1_', '_cf_'];
let schemaInitialized = false;

function isSystemTable(name) {
  return SYSTEM_TABLE_PREFIXES.some((prefix) => name.startsWith(prefix));
}

async function runSql(db, sql) {
  await db.prepare(sql).run();
}

async function addMissingColumns(db, tableName, table) {
  const info = await db.prepare(`PRAGMA table_info(${tableName})`).all();
  const currentColumns = new Set((info.results ?? []).map((row) => row.name));

  for (const [columnName, columnType] of Object.entries(table.columns)) {
    if (!currentColumns.has(columnName)) {
      await runSql(db, `ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnType}`);
    }
  }
}

async function cleanupUnknownTables(db, keep) {
  const tables = await db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();

  for (const row of tables.results ?? []) {
    const tableName = row.name;
    if (isSystemTable(tableName)) continue;
    if (keep.has(tableName)) continue;

    try {
      await runSql(db, `DROP TABLE IF EXISTS ${tableName}`);
    } catch {
      // Ignore drop failures to keep startup resilient.
    }
  }
}

export async function ensureSchema(db) {
  if (schemaInitialized) return;

  await runSql(db, 'PRAGMA foreign_keys = ON');

  for (const tableName of Object.keys(TABLES)) {
    await runSql(db, TABLES[tableName].create);
  }

  for (const [tableName, table] of Object.entries(TABLES)) {
    await addMissingColumns(db, tableName, table);
  }

  await runSql(db, 'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
  await runSql(db, 'CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id)');

  const keep = new Set(Object.keys(TABLES));
  await cleanupUnknownTables(db, keep);

  schemaInitialized = true;
}
