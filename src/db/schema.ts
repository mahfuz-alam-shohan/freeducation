import type { Bindings } from '../types';

const TABLES = {
  schemaMeta: {
    name: 'schema_meta',
    columns: {
      key: 'TEXT PRIMARY KEY',
      value: 'TEXT NOT NULL'
    }
  },
  admins: {
    name: 'admins',
    columns: {
      id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
      name: 'TEXT NOT NULL',
      email: 'TEXT NOT NULL UNIQUE',
      password_hash: 'TEXT NOT NULL',
      password_salt: 'TEXT NOT NULL',
      created_at: 'TEXT NOT NULL'
    }
  },
  sessions: {
    name: 'sessions',
    columns: {
      id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
      admin_id: 'INTEGER NOT NULL',
      token: 'TEXT NOT NULL UNIQUE',
      expires_at: 'TEXT NOT NULL',
      created_at: 'TEXT NOT NULL'
    }
  },
  classes: {
    name: 'classes',
    columns: {
      id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
      name: 'TEXT NOT NULL',
      level: 'TEXT NOT NULL',
      description: 'TEXT',
      created_at: 'TEXT NOT NULL'
    }
  },
  subjects: {
    name: 'subjects',
    columns: {
      id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
      class_id: 'INTEGER NOT NULL',
      name: 'TEXT NOT NULL',
      description: 'TEXT'
    }
  },
  chapters: {
    name: 'chapters',
    columns: {
      id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
      subject_id: 'INTEGER NOT NULL',
      name: 'TEXT NOT NULL',
      description: 'TEXT',
      order_index: 'INTEGER DEFAULT 0'
    }
  },
  topics: {
    name: 'topics',
    columns: {
      id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
      chapter_id: 'INTEGER NOT NULL',
      title: 'TEXT NOT NULL',
      content: 'TEXT',
      order_index: 'INTEGER DEFAULT 0',
      created_at: 'TEXT NOT NULL'
    }
  },
  files: {
    name: 'files',
    columns: {
      id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
      topic_id: 'INTEGER NOT NULL',
      title: 'TEXT NOT NULL',
      r2_key: 'TEXT NOT NULL',
      mime_type: 'TEXT',
      size: 'INTEGER',
      created_at: 'TEXT NOT NULL'
    }
  }
} as const;

const SCHEMA_VERSION = '1';

const TABLE_LIST = Object.values(TABLES).map((table) => table.name);

const columnDefinition = (columns: Record<string, string>) =>
  Object.entries(columns)
    .map(([name, type]) => `${name} ${type}`)
    .join(', ');

const createTableSQL = (table: (typeof TABLES)[keyof typeof TABLES]) =>
  `CREATE TABLE IF NOT EXISTS ${table.name} (${columnDefinition(table.columns)})`;

const getExistingTables = async (env: Bindings) => {
  const { results } = await env.DB.prepare(
    "SELECT name FROM sqlite_master WHERE type='table'"
  ).all<{ name: string }>();
  return results.map((row) => row.name);
};

const getExistingColumns = async (env: Bindings, tableName: string) => {
  const { results } = await env.DB.prepare(`PRAGMA table_info(${tableName})`).all<{ name: string }>();
  return results.map((row) => row.name);
};

const dropExtraTables = async (env: Bindings, existing: string[]) => {
  const extras = existing.filter(
    (name) => !TABLE_LIST.includes(name) && name !== 'sqlite_sequence'
  );
  for (const name of extras) {
    await env.DB.prepare(`DROP TABLE IF EXISTS ${name}`).run();
  }
};

const ensureTableColumns = async (env: Bindings, table: (typeof TABLES)[keyof typeof TABLES]) => {
  const existingColumns = await getExistingColumns(env, table.name);
  for (const [column, type] of Object.entries(table.columns)) {
    if (!existingColumns.includes(column)) {
      await env.DB.prepare(`ALTER TABLE ${table.name} ADD COLUMN ${column} ${type}`).run();
    }
  }
};

export const ensureSchema = async (env: Bindings) => {
  const existingTables = await getExistingTables(env);
  if (!existingTables.includes(TABLES.schemaMeta.name)) {
    await env.DB.prepare(createTableSQL(TABLES.schemaMeta)).run();
  }

  const versionRow = await env.DB.prepare(
    `SELECT value FROM ${TABLES.schemaMeta.name} WHERE key = 'schema_version'`
  ).first<{ value: string }>();

  if (versionRow?.value === SCHEMA_VERSION) {
    return;
  }

  await dropExtraTables(env, existingTables);

  for (const table of Object.values(TABLES)) {
    await env.DB.prepare(createTableSQL(table)).run();
    await ensureTableColumns(env, table);
  }

  await env.DB.prepare(
    `INSERT OR REPLACE INTO ${TABLES.schemaMeta.name} (key, value) VALUES ('schema_version', ?)`
  )
    .bind(SCHEMA_VERSION)
    .run();
};

export const hasAnyAdmin = async (env: Bindings) => {
  const row = await env.DB.prepare('SELECT id FROM admins LIMIT 1').first<{ id: number }>();
  return Boolean(row?.id);
};

export const countTable = async (env: Bindings, table: string) => {
  const row = await env.DB.prepare(`SELECT COUNT(*) as total FROM ${table}`).first<{ total: number }>();
  return row?.total ?? 0;
};
