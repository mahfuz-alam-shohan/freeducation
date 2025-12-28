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
  try {
    const statements = [
      `CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at TEXT NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS admin_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        admin_id INTEGER NOT NULL,
        token TEXT NOT NULL UNIQUE,
        created_at TEXT NOT NULL,
        expires_at TEXT NOT NULL,
        FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
      )`,
      `CREATE TABLE IF NOT EXISTS classes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        has_groups INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS class_links (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        created_at TEXT NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS class_link_members (
        link_id INTEGER NOT NULL,
        class_id INTEGER NOT NULL,
        PRIMARY KEY (link_id, class_id),
        FOREIGN KEY (link_id) REFERENCES class_links(id) ON DELETE CASCADE,
        FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
      )`,
      `CREATE TABLE IF NOT EXISTS class_groups (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        class_id INTEGER,
        link_id INTEGER,
        created_at TEXT NOT NULL,
        FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
        FOREIGN KEY (link_id) REFERENCES class_links(id) ON DELETE CASCADE
      )`,
      "CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(token)",
      "CREATE INDEX IF NOT EXISTS idx_admin_sessions_admin_id ON admin_sessions(admin_id)",
      "CREATE INDEX IF NOT EXISTS idx_class_link_members_class_id ON class_link_members(class_id)",
      "CREATE INDEX IF NOT EXISTS idx_class_groups_class_id ON class_groups(class_id)",
      "CREATE INDEX IF NOT EXISTS idx_class_groups_link_id ON class_groups(link_id)",
    ];

    for (const statement of statements) {
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
