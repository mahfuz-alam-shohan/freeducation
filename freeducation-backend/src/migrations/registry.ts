import usersSql from './v1.0.0/users.sql';
import adminSessionsSql from './v1.0.0/admin_sessions.sql';
import apiEndpointsSql from './v1.1.0/api_endpoints.sql';
import apiKeysSql from './v1.1.0/api_keys.sql';
import apiAccessRolesSql from './v1.1.0/api_access_roles.sql';
import apiUserOverridesSql from './v1.1.0/api_user_overrides.sql';

interface Migration {
  version: string;
  statements: string[];
}

const MIGRATIONS: Migration[] = [
  {
    version: '1.0.0',
    statements: [usersSql, adminSessionsSql]
  },
  {
    version: '1.1.0',
    statements: [apiEndpointsSql, apiKeysSql, apiAccessRolesSql, apiUserOverridesSql]
  }
];

async function ensureMigrationsTable(db: D1Database): Promise<void> {
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version TEXT PRIMARY KEY,
      applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `).run();
}

async function getAppliedVersions(db: D1Database): Promise<Set<string>> {
  const result = await db.prepare('SELECT version FROM schema_migrations').all();
  const versions = (result.results || []).map((row: any) => String(row.version));
  return new Set(versions);
}

async function applySql(db: D1Database, sql: string): Promise<void> {
  const statements = sql
    .split(';')
    .map((stmt) => stmt.trim())
    .filter((stmt) => stmt.length > 0);

  for (const statement of statements) {
    await db.prepare(statement).run();
  }
}

export async function runMigrations(db: D1Database): Promise<void> {
  await ensureMigrationsTable(db);
  const applied = await getAppliedVersions(db);

  for (const migration of MIGRATIONS) {
    if (applied.has(migration.version)) {
      continue;
    }

    for (const statement of migration.statements) {
      await applySql(db, statement);
    }

    await db.prepare(
      'INSERT INTO schema_migrations (version) VALUES (?)'
    ).bind(migration.version).run();
  }
}
