const TABLES = {
  users: {
    create: `CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      image_key TEXT,
      password_hash TEXT NOT NULL,
      password_salt TEXT NOT NULL,
      password_iterations INTEGER NOT NULL,
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

let schemaInitialized = false;

async function runSql(db, sql) {
  await db.prepare(sql).run();
}

export async function ensureSchema(db, options = {}) {
  if (schemaInitialized) return;

  await runSql(db, 'PRAGMA foreign_keys = ON');

  const existing = await db
    .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")
    .all();
  const existingNames = new Set((existing.results ?? []).map((r) => r.name));

  for (const tableName of Object.keys(TABLES)) {
    await runSql(db, TABLES[tableName].create);
  }

  for (const [tableName, table] of Object.entries(TABLES)) {
    const info = await db.prepare(`PRAGMA table_info(${tableName})`).all();
    const currentColumns = new Set((info.results ?? []).map((row) => row.name));
    for (const [columnName, columnType] of Object.entries(table.columns)) {
      if (!currentColumns.has(columnName)) {
        await runSql(db, `ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnType}`);
      }
    }
  }

  if (options.cleanUnknownTables === true) {
    for (const existingTable of existingNames) {
      if (!(existingTable in TABLES)) {
        await runSql(db, `DROP TABLE IF EXISTS ${existingTable}`);
      }
    }
  }

  await runSql(db, 'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
  await runSql(db, 'CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id)');
  schemaInitialized = true;
}
