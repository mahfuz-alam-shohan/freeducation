export interface ColumnDefinition {
  name: string;
  type: string;
  notNull?: boolean;
  defaultValue?: string;
  primaryKey?: boolean;
}

export interface TableDefinition {
  name: string;
  columns: ColumnDefinition[];
  createTableSql: string;
  indexSql: string[];
}

export const TABLE_DEFINITIONS: TableDefinition[] = [
  {
    name: 'users',
    columns: [
      { name: 'id', type: 'INTEGER', primaryKey: true },
      { name: 'email', type: 'TEXT', notNull: true },
      { name: 'password_hash', type: 'TEXT', notNull: true },
      { name: 'role', type: 'TEXT', notNull: true },
      { name: 'first_name', type: 'TEXT', notNull: true },
      { name: 'last_name', type: 'TEXT', notNull: true },
      { name: 'is_active', type: 'INTEGER', notNull: true, defaultValue: '1' },
      { name: 'created_at', type: 'DATETIME', defaultValue: 'CURRENT_TIMESTAMP' },
      { name: 'updated_at', type: 'DATETIME', defaultValue: 'CURRENT_TIMESTAMP' }
    ],
    createTableSql: `
      CREATE TABLE {{table}} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('admin', 'teacher', 'student')),
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        is_active INTEGER NOT NULL DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `,
    indexSql: [
      'CREATE INDEX IF NOT EXISTS idx_users_email ON {{table}}(email)',
      'CREATE INDEX IF NOT EXISTS idx_users_role ON {{table}}(role)',
      'CREATE INDEX IF NOT EXISTS idx_users_active ON {{table}}(is_active)'
    ]
  },
  {
    name: 'admin_sessions',
    columns: [
      { name: 'id', type: 'TEXT', primaryKey: true },
      { name: 'user_id', type: 'INTEGER', notNull: true },
      { name: 'token_hash', type: 'TEXT', notNull: true },
      { name: 'created_at', type: 'DATETIME', defaultValue: 'CURRENT_TIMESTAMP' },
      { name: 'expires_at', type: 'DATETIME', notNull: true },
      { name: 'last_accessed_at', type: 'DATETIME', defaultValue: 'CURRENT_TIMESTAMP' },
      { name: 'is_active', type: 'INTEGER', notNull: true, defaultValue: '1' },
      { name: 'user_agent', type: 'TEXT' },
      { name: 'ip_address', type: 'TEXT' }
    ],
    createTableSql: `
      CREATE TABLE {{table}} (
        id TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL,
        token_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        expires_at DATETIME NOT NULL,
        last_accessed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_active INTEGER NOT NULL DEFAULT 1,
        user_agent TEXT,
        ip_address TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `,
    indexSql: [
      'CREATE INDEX IF NOT EXISTS idx_admin_sessions_user_id ON {{table}}(user_id)',
      'CREATE INDEX IF NOT EXISTS idx_admin_sessions_token_hash ON {{table}}(token_hash)',
      'CREATE INDEX IF NOT EXISTS idx_admin_sessions_active ON {{table}}(is_active)'
    ]
  },
  {
    name: 'api_endpoints',
    columns: [
      { name: 'id', type: 'TEXT', primaryKey: true },
      { name: 'name', type: 'TEXT', notNull: true },
      { name: 'method', type: 'TEXT', notNull: true },
      { name: 'path', type: 'TEXT', notNull: true },
      { name: 'description', type: 'TEXT' },
      { name: 'data_summary', type: 'TEXT' },
      { name: 'is_public', type: 'INTEGER', notNull: true, defaultValue: '0' },
      { name: 'is_enabled', type: 'INTEGER', notNull: true, defaultValue: '1' },
      { name: 'is_system', type: 'INTEGER', notNull: true, defaultValue: '0' },
      { name: 'created_at', type: 'DATETIME', defaultValue: 'CURRENT_TIMESTAMP' },
      { name: 'updated_at', type: 'DATETIME', defaultValue: 'CURRENT_TIMESTAMP' }
    ],
    createTableSql: `
      CREATE TABLE {{table}} (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        method TEXT NOT NULL,
        path TEXT NOT NULL,
        description TEXT,
        data_summary TEXT,
        is_public INTEGER NOT NULL DEFAULT 0,
        is_enabled INTEGER NOT NULL DEFAULT 1,
        is_system INTEGER NOT NULL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `,
    indexSql: [
      'CREATE UNIQUE INDEX IF NOT EXISTS idx_api_endpoints_method_path ON {{table}}(method, path)',
      'CREATE INDEX IF NOT EXISTS idx_api_endpoints_enabled ON {{table}}(is_enabled)'
    ]
  },
  {
    name: 'api_keys',
    columns: [
      { name: 'id', type: 'TEXT', primaryKey: true },
      { name: 'endpoint_id', type: 'TEXT', notNull: true },
      { name: 'label', type: 'TEXT', notNull: true },
      { name: 'key_hash', type: 'TEXT', notNull: true },
      { name: 'prefix', type: 'TEXT', notNull: true },
      { name: 'is_enabled', type: 'INTEGER', notNull: true, defaultValue: '1' },
      { name: 'created_at', type: 'DATETIME', defaultValue: 'CURRENT_TIMESTAMP' },
      { name: 'last_used_at', type: 'DATETIME' },
      { name: 'expires_at', type: 'DATETIME' }
    ],
    createTableSql: `
      CREATE TABLE {{table}} (
        id TEXT PRIMARY KEY,
        endpoint_id TEXT NOT NULL,
        label TEXT NOT NULL,
        key_hash TEXT NOT NULL,
        prefix TEXT NOT NULL,
        is_enabled INTEGER NOT NULL DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_used_at DATETIME,
        expires_at DATETIME,
        FOREIGN KEY (endpoint_id) REFERENCES api_endpoints(id) ON DELETE CASCADE
      );
    `,
    indexSql: [
      'CREATE INDEX IF NOT EXISTS idx_api_keys_endpoint ON {{table}}(endpoint_id)',
      'CREATE INDEX IF NOT EXISTS idx_api_keys_enabled ON {{table}}(is_enabled)'
    ]
  },
  {
    name: 'api_access_roles',
    columns: [
      { name: 'id', type: 'TEXT', primaryKey: true },
      { name: 'endpoint_id', type: 'TEXT', notNull: true },
      { name: 'role', type: 'TEXT', notNull: true },
      { name: 'is_enabled', type: 'INTEGER', notNull: true, defaultValue: '1' },
      { name: 'created_at', type: 'DATETIME', defaultValue: 'CURRENT_TIMESTAMP' }
    ],
    createTableSql: `
      CREATE TABLE {{table}} (
        id TEXT PRIMARY KEY,
        endpoint_id TEXT NOT NULL,
        role TEXT NOT NULL,
        is_enabled INTEGER NOT NULL DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (endpoint_id) REFERENCES api_endpoints(id) ON DELETE CASCADE
      );
    `,
    indexSql: [
      'CREATE UNIQUE INDEX IF NOT EXISTS idx_api_access_roles_endpoint_role ON {{table}}(endpoint_id, role)'
    ]
  },
  {
    name: 'api_user_overrides',
    columns: [
      { name: 'id', type: 'TEXT', primaryKey: true },
      { name: 'endpoint_id', type: 'TEXT', notNull: true },
      { name: 'user_id', type: 'INTEGER', notNull: true },
      { name: 'mode', type: 'TEXT', notNull: true },
      { name: 'created_at', type: 'DATETIME', defaultValue: 'CURRENT_TIMESTAMP' }
    ],
    createTableSql: `
      CREATE TABLE {{table}} (
        id TEXT PRIMARY KEY,
        endpoint_id TEXT NOT NULL,
        user_id INTEGER NOT NULL,
        mode TEXT NOT NULL CHECK (mode IN ('allow', 'deny')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (endpoint_id) REFERENCES api_endpoints(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `,
    indexSql: [
      'CREATE UNIQUE INDEX IF NOT EXISTS idx_api_user_overrides_endpoint_user ON {{table}}(endpoint_id, user_id)'
    ]
  }
];
