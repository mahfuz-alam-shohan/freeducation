import type { Env } from "../types";

export function ensureDatabase(env: Env): { ok: true } | { ok: false; message: string } {
  if (!env || !env.DB) {
    return {
      ok: false,
      message: "Missing D1 binding: add a [vars] or [[d1_databases]] section in wrangler.toml.",
    };
  }

  const maybePrepare = (env.DB as D1Database).prepare;
  if (typeof maybePrepare !== "function") {
    return {
      ok: false,
      message: "D1 binding is present but invalid. Please re-bind the database.",
    };
  }

  return { ok: true };
}

export async function ensureSchema(env: Env): Promise<{ ok: true } | { ok: false; message: string }> {
  let foreignKeysDisabled = false;
  try {
    const tableSchemas = [
      {
        name: "admins",
        columns: [
          "id INTEGER PRIMARY KEY AUTOINCREMENT",
          "name TEXT NOT NULL",
          "email TEXT NOT NULL UNIQUE",
          "password_hash TEXT NOT NULL",
          "created_at TEXT NOT NULL",
        ],
      },
      {
        name: "admin_sessions",
        columns: [
          "id INTEGER PRIMARY KEY AUTOINCREMENT",
          "admin_id INTEGER NOT NULL",
          "token TEXT NOT NULL UNIQUE",
          "created_at TEXT NOT NULL",
          "expires_at TEXT NOT NULL",
          "FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE",
        ],
      },
      {
        name: "classes",
        columns: [
          "id INTEGER PRIMARY KEY AUTOINCREMENT",
          "name TEXT NOT NULL",
          "has_groups INTEGER NOT NULL DEFAULT 0",
          "created_at TEXT NOT NULL",
        ],
      },
      {
        name: "class_links",
        columns: ["id INTEGER PRIMARY KEY AUTOINCREMENT", "name TEXT NOT NULL", "created_at TEXT NOT NULL"],
      },
      {
        name: "class_link_members",
        columns: [
          "link_id INTEGER NOT NULL",
          "class_id INTEGER NOT NULL",
          "PRIMARY KEY (link_id, class_id)",
          "FOREIGN KEY (link_id) REFERENCES class_links(id) ON DELETE CASCADE",
          "FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE",
        ],
      },
      {
        name: "class_groups",
        columns: [
          "id INTEGER PRIMARY KEY AUTOINCREMENT",
          "name TEXT NOT NULL",
          "class_id INTEGER",
          "link_id INTEGER",
          "created_at TEXT NOT NULL",
          "FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE",
          "FOREIGN KEY (link_id) REFERENCES class_links(id) ON DELETE CASCADE",
        ],
      },
    ];

    const expectedTables = new Set(tableSchemas.map((schema) => schema.name));

    const tableExists = async (tableName: string): Promise<boolean> => {
      const result = await env.DB.prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name = ?"
      )
        .bind(tableName)
        .first<{ name: string }>();
      return Boolean(result?.name);
    };

    const getTableColumns = async (tableName: string): Promise<string[]> => {
      const result = await env.DB.prepare(`PRAGMA table_info(${tableName})`).all<{ name: string }>();
      return (result.results ?? []).map((row) => row.name);
    };

    const createTable = async (tableName: string, columns: string[]): Promise<void> => {
      const createStatement = `CREATE TABLE ${tableName} (${columns.join(", ")})`;
      const result = await env.DB.prepare(createStatement).run();
      if (!result.success) {
        throw new Error(result.error ? `Schema update failed: ${result.error}` : "Schema update failed.");
      }
    };

    const rebuildTable = async (
      tableName: string,
      expectedColumnNames: string[],
      columns: string[],
      existingColumnNames: string[]
    ): Promise<void> => {
      const tempTableName = `${tableName}__new`;
      await createTable(tempTableName, columns);

      const sharedColumns = expectedColumnNames.filter((column) => existingColumnNames.includes(column));
      if (sharedColumns.length > 0) {
        const columnList = sharedColumns.join(", ");
        const insertStatement = `INSERT INTO ${tempTableName} (${columnList}) SELECT ${columnList} FROM ${tableName}`;
        const insertResult = await env.DB.prepare(insertStatement).run();
        if (!insertResult.success) {
          throw new Error(insertResult.error ? `Schema update failed: ${insertResult.error}` : "Schema update failed.");
        }
      }

      const dropResult = await env.DB.prepare(`DROP TABLE ${tableName}`).run();
      if (!dropResult.success) {
        throw new Error(dropResult.error ? `Schema update failed: ${dropResult.error}` : "Schema update failed.");
      }

      const renameResult = await env.DB.prepare(`ALTER TABLE ${tempTableName} RENAME TO ${tableName}`).run();
      if (!renameResult.success) {
        throw new Error(renameResult.error ? `Schema update failed: ${renameResult.error}` : "Schema update failed.");
      }
    };

    const syncTable = async (tableName: string, columns: string[]): Promise<void> => {
      const expectedColumnNames = columns
        .map((column) => column.trim())
        .filter((column) => !column.toUpperCase().startsWith("FOREIGN KEY") && !column.toUpperCase().startsWith("PRIMARY KEY"))
        .map((column) => column.split(/\s+/)[0]);

      if (!(await tableExists(tableName))) {
        await createTable(tableName, columns);
        return;
      }

      const existingColumnNames = await getTableColumns(tableName);
      const missingColumn = expectedColumnNames.some((column) => !existingColumnNames.includes(column));
      const extraColumn = existingColumnNames.some((column) => !expectedColumnNames.includes(column));

      if (missingColumn || extraColumn) {
        await rebuildTable(tableName, expectedColumnNames, columns, existingColumnNames);
      }
    };

    const dropUnknownTables = async (): Promise<void> => {
      const tablesResult = await env.DB.prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
      ).all<{ name: string }>();
      const tables = (tablesResult.results ?? []).map((row) => row.name);
      for (const table of tables) {
        if (!expectedTables.has(table)) {
          const dropResult = await env.DB.prepare(`DROP TABLE ${table}`).run();
          if (!dropResult.success) {
            throw new Error(dropResult.error ? `Schema update failed: ${dropResult.error}` : "Schema update failed.");
          }
        }
      }
    };

    await env.DB.prepare("PRAGMA foreign_keys = OFF").run();
    foreignKeysDisabled = true;

    for (const schema of tableSchemas) {
      await syncTable(schema.name, schema.columns);
    }

    await dropUnknownTables();

    const indexStatements = [
      "CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(token)",
      "CREATE INDEX IF NOT EXISTS idx_admin_sessions_admin_id ON admin_sessions(admin_id)",
      "CREATE INDEX IF NOT EXISTS idx_class_link_members_class_id ON class_link_members(class_id)",
      "CREATE INDEX IF NOT EXISTS idx_class_groups_class_id ON class_groups(class_id)",
      "CREATE INDEX IF NOT EXISTS idx_class_groups_link_id ON class_groups(link_id)",
    ];

    for (const statement of indexStatements) {
      const result = await env.DB.prepare(statement).run();
      if (!result.success) {
        throw new Error(result.error ? `Schema update failed: ${result.error}` : "Schema update failed.");
      }
    }

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unable to initialize admin tables.",
    };
  } finally {
    if (foreignKeysDisabled) {
      await env.DB.prepare("PRAGMA foreign_keys = ON").run();
    }
  }
}

export async function getAdminCount(env: Env): Promise<number> {
  const result = await env.DB.prepare("SELECT COUNT(*) as count FROM admins").first<{ count: number }>();
  return result?.count ?? 0;
}

export async function getAdminList(env: Env): Promise<
  { id: number; name: string; email: string; created_at: string }[]
> {
  const result = await env.DB.prepare(
    "SELECT id, name, email, created_at FROM admins ORDER BY created_at DESC"
  ).all<{ id: number; name: string; email: string; created_at: string }>();
  return result.results ?? [];
}

export async function resetDatabase(env: Env): Promise<void> {
  const statements = [
    "DROP TABLE IF EXISTS class_groups",
    "DROP TABLE IF EXISTS class_link_members",
    "DROP TABLE IF EXISTS class_links",
    "DROP TABLE IF EXISTS classes",
    "DROP TABLE IF EXISTS admin_sessions",
    "DROP TABLE IF EXISTS admins",
  ];

  for (const statement of statements) {
    const result = await env.DB.prepare(statement).run();
    if (!result.success) {
      throw new Error(result.error ? `Factory reset failed: ${result.error}` : "Factory reset failed.");
    }
  }

  const schemaResult = await ensureSchema(env);
  if (!schemaResult.ok) {
    throw new Error(schemaResult.message);
  }
}
