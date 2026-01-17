const REQUIRED_TABLES = {
  users: {
    columns: [
      "id",
      "full_name",
      "email",
      "password_hash",
      "password_salt",
      "role",
      "created_at",
    ],
    createSql: `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        password_salt TEXT NOT NULL,
        role TEXT NOT NULL,
        created_at TEXT NOT NULL
      )
    `,
  },
  sessions: {
    columns: ["token", "user_id", "expires_at", "created_at"],
    createSql: `
      CREATE TABLE IF NOT EXISTS sessions (
        token TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL,
        expires_at TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `,
  },
};

export async function syncSchema(env) {
  const existingTables = await listTables(env);
  const requiredNames = new Set(Object.keys(REQUIRED_TABLES));

  for (const tableName of existingTables) {
    if (!requiredNames.has(tableName)) {
      await env.DB.exec(`DROP TABLE IF EXISTS ${tableName}`);
    }
  }

  for (const [tableName, config] of Object.entries(REQUIRED_TABLES)) {
    const existingColumns = await listColumns(env, tableName);
    const requiredColumns = new Set(config.columns);

    if (existingColumns.length === 0) {
      await env.DB.exec(config.createSql);
      continue;
    }

    const hasUnexpectedColumn = existingColumns.some(
      (column) => !requiredColumns.has(column)
    );
    const isMissingColumn = config.columns.some(
      (column) => !existingColumns.includes(column)
    );

    if (hasUnexpectedColumn || isMissingColumn) {
      await env.DB.exec(`DROP TABLE IF EXISTS ${tableName}`);
      await env.DB.exec(config.createSql);
    }
  }
}

async function listTables(env) {
  const result = await env.DB.prepare(
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'"
  ).all();

  return (result.results || []).map((row) => row.name);
}

async function listColumns(env, tableName) {
  const result = await env.DB.prepare(`PRAGMA table_info(${tableName})`).all();
  return (result.results || []).map((row) => row.name);
}
