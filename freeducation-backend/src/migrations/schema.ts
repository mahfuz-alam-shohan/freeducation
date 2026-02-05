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
  },
  {
    name: 'module_categories',
    columns: [
      { name: 'id', type: 'INTEGER', primaryKey: true },
      { name: 'key', type: 'TEXT', notNull: true },
      { name: 'name', type: 'TEXT', notNull: true },
      { name: 'description', type: 'TEXT' },
      { name: 'created_at', type: 'DATETIME', defaultValue: 'CURRENT_TIMESTAMP' },
      { name: 'updated_at', type: 'DATETIME', defaultValue: 'CURRENT_TIMESTAMP' }
    ],
    createTableSql: `
      CREATE TABLE {{table}} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `,
    indexSql: []
  },
  {
    name: 'module_templates',
    columns: [
      { name: 'id', type: 'INTEGER', primaryKey: true },
      { name: 'category_id', type: 'INTEGER', notNull: true },
      { name: 'code', type: 'TEXT', notNull: true },
      { name: 'name', type: 'TEXT', notNull: true },
      { name: 'description', type: 'TEXT' },
      { name: 'is_active', type: 'INTEGER', notNull: true, defaultValue: '1' },
      { name: 'created_at', type: 'DATETIME', defaultValue: 'CURRENT_TIMESTAMP' },
      { name: 'updated_at', type: 'DATETIME', defaultValue: 'CURRENT_TIMESTAMP' }
    ],
    createTableSql: `
      CREATE TABLE {{table}} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category_id INTEGER NOT NULL,
        code TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        description TEXT,
        is_active INTEGER NOT NULL DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES module_categories(id) ON DELETE CASCADE
      );
    `,
    indexSql: [
      'CREATE INDEX IF NOT EXISTS idx_module_templates_category ON {{table}}(category_id)',
      'CREATE INDEX IF NOT EXISTS idx_module_templates_active ON {{table}}(is_active)'
    ]
  },
  {
    name: 'module_nodes',
    columns: [
      { name: 'id', type: 'INTEGER', primaryKey: true },
      { name: 'template_id', type: 'INTEGER', notNull: true },
      { name: 'parent_id', type: 'INTEGER' },
      { name: 'node_key', type: 'TEXT', notNull: true },
      { name: 'server_name', type: 'TEXT', notNull: true },
      { name: 'node_type', type: 'TEXT', notNull: true },
      { name: 'has_image', type: 'INTEGER', notNull: true, defaultValue: '0' },
      { name: 'sort_order', type: 'INTEGER', notNull: true, defaultValue: '0' },
      { name: 'created_at', type: 'DATETIME', defaultValue: 'CURRENT_TIMESTAMP' },
      { name: 'updated_at', type: 'DATETIME', defaultValue: 'CURRENT_TIMESTAMP' }
    ],
    createTableSql: `
      CREATE TABLE {{table}} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        template_id INTEGER NOT NULL,
        parent_id INTEGER,
        node_key TEXT NOT NULL,
        server_name TEXT NOT NULL,
        node_type TEXT NOT NULL CHECK (node_type IN ('book', 'part')),
        has_image INTEGER NOT NULL DEFAULT 0,
        sort_order INTEGER NOT NULL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(template_id, node_key),
        FOREIGN KEY (template_id) REFERENCES module_templates(id) ON DELETE CASCADE,
        FOREIGN KEY (parent_id) REFERENCES module_nodes(id) ON DELETE CASCADE
      );
    `,
    indexSql: [
      'CREATE INDEX IF NOT EXISTS idx_module_nodes_template ON {{table}}(template_id)',
      'CREATE INDEX IF NOT EXISTS idx_module_nodes_parent ON {{table}}(parent_id)'
    ]
  },
  {
    name: 'subjects',
    columns: [
      { name: 'id', type: 'INTEGER', primaryKey: true },
      { name: 'template_id', type: 'INTEGER', notNull: true },
      { name: 'name', type: 'TEXT', notNull: true },
      { name: 'is_active', type: 'INTEGER', notNull: true, defaultValue: '1' },
      { name: 'created_at', type: 'DATETIME', defaultValue: 'CURRENT_TIMESTAMP' },
      { name: 'updated_at', type: 'DATETIME', defaultValue: 'CURRENT_TIMESTAMP' }
    ],
    createTableSql: `
      CREATE TABLE {{table}} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        template_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        is_active INTEGER NOT NULL DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (template_id) REFERENCES module_templates(id) ON DELETE RESTRICT
      );
    `,
    indexSql: [
      'CREATE INDEX IF NOT EXISTS idx_subjects_template ON {{table}}(template_id)',
      'CREATE INDEX IF NOT EXISTS idx_subjects_active ON {{table}}(is_active)'
    ]
  },
  {
    name: 'subject_node_overrides',
    columns: [
      { name: 'id', type: 'INTEGER', primaryKey: true },
      { name: 'subject_id', type: 'INTEGER', notNull: true },
      { name: 'node_id', type: 'INTEGER', notNull: true },
      { name: 'display_name', type: 'TEXT' },
      { name: 'image_key', type: 'TEXT' },
      { name: 'created_at', type: 'DATETIME', defaultValue: 'CURRENT_TIMESTAMP' },
      { name: 'updated_at', type: 'DATETIME', defaultValue: 'CURRENT_TIMESTAMP' }
    ],
    createTableSql: `
      CREATE TABLE {{table}} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        subject_id INTEGER NOT NULL,
        node_id INTEGER NOT NULL,
        display_name TEXT,
        image_key TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(subject_id, node_id),
        FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
        FOREIGN KEY (node_id) REFERENCES module_nodes(id) ON DELETE CASCADE
      );
    `,
    indexSql: [
      'CREATE INDEX IF NOT EXISTS idx_subject_node_subject ON {{table}}(subject_id)'
    ]
  },
  {
    name: 'subject_chapters',
    columns: [
      { name: 'id', type: 'INTEGER', primaryKey: true },
      { name: 'subject_id', type: 'INTEGER', notNull: true },
      { name: 'node_id', type: 'INTEGER', notNull: true },
      { name: 'name', type: 'TEXT', notNull: true },
      { name: 'image_key', type: 'TEXT' },
      { name: 'sort_order', type: 'INTEGER', notNull: true, defaultValue: '0' },
      { name: 'created_at', type: 'DATETIME', defaultValue: 'CURRENT_TIMESTAMP' },
      { name: 'updated_at', type: 'DATETIME', defaultValue: 'CURRENT_TIMESTAMP' }
    ],
    createTableSql: `
      CREATE TABLE {{table}} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        subject_id INTEGER NOT NULL,
        node_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        image_key TEXT,
        sort_order INTEGER NOT NULL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
        FOREIGN KEY (node_id) REFERENCES module_nodes(id) ON DELETE CASCADE
      );
    `,
    indexSql: [
      'CREATE INDEX IF NOT EXISTS idx_subject_chapters_subject ON {{table}}(subject_id)',
      'CREATE INDEX IF NOT EXISTS idx_subject_chapters_node ON {{table}}(node_id)'
    ]
  },
  {
    name: 'subject_short_notes',
    columns: [
      { name: 'id', type: 'INTEGER', primaryKey: true },
      { name: 'chapter_id', type: 'INTEGER', notNull: true },
      { name: 'note', type: 'TEXT', notNull: true },
      { name: 'image_key', type: 'TEXT' },
      { name: 'sort_order', type: 'INTEGER', notNull: true, defaultValue: '0' },
      { name: 'created_at', type: 'DATETIME', defaultValue: 'CURRENT_TIMESTAMP' }
    ],
    createTableSql: `
      CREATE TABLE {{table}} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        chapter_id INTEGER NOT NULL,
        note TEXT NOT NULL,
        image_key TEXT,
        sort_order INTEGER NOT NULL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (chapter_id) REFERENCES subject_chapters(id) ON DELETE CASCADE
      );
    `,
    indexSql: [
      'CREATE INDEX IF NOT EXISTS idx_subject_notes_chapter ON {{table}}(chapter_id)'
    ]
  },
  {
    name: 'subject_topics',
    columns: [
      { name: 'id', type: 'INTEGER', primaryKey: true },
      { name: 'chapter_id', type: 'INTEGER', notNull: true },
      { name: 'name', type: 'TEXT', notNull: true },
      { name: 'image_key', type: 'TEXT' },
      { name: 'sort_order', type: 'INTEGER', notNull: true, defaultValue: '0' },
      { name: 'created_at', type: 'DATETIME', defaultValue: 'CURRENT_TIMESTAMP' },
      { name: 'updated_at', type: 'DATETIME', defaultValue: 'CURRENT_TIMESTAMP' }
    ],
    createTableSql: `
      CREATE TABLE {{table}} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        chapter_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        image_key TEXT,
        sort_order INTEGER NOT NULL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (chapter_id) REFERENCES subject_chapters(id) ON DELETE CASCADE
      );
    `,
    indexSql: [
      'CREATE INDEX IF NOT EXISTS idx_subject_topics_chapter ON {{table}}(chapter_id)'
    ]
  },
  {
    name: 'subject_topic_notes',
    columns: [
      { name: 'id', type: 'INTEGER', primaryKey: true },
      { name: 'topic_id', type: 'INTEGER', notNull: true },
      { name: 'note', type: 'TEXT', notNull: true },
      { name: 'image_key', type: 'TEXT' },
      { name: 'sort_order', type: 'INTEGER', notNull: true, defaultValue: '0' },
      { name: 'created_at', type: 'DATETIME', defaultValue: 'CURRENT_TIMESTAMP' }
    ],
    createTableSql: `
      CREATE TABLE {{table}} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        topic_id INTEGER NOT NULL,
        note TEXT NOT NULL,
        image_key TEXT,
        sort_order INTEGER NOT NULL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (topic_id) REFERENCES subject_topics(id) ON DELETE CASCADE
      );
    `,
    indexSql: [
      'CREATE INDEX IF NOT EXISTS idx_subject_topic_notes_topic ON {{table}}(topic_id)'
    ]
  },
  {
    name: 'subject_topic_videos',
    columns: [
      { name: 'id', type: 'INTEGER', primaryKey: true },
      { name: 'topic_id', type: 'INTEGER', notNull: true },
      { name: 'mode', type: 'TEXT', notNull: true },
      { name: 'title', type: 'TEXT', notNull: true },
      { name: 'url', type: 'TEXT' },
      { name: 'author', type: 'TEXT' },
      { name: 'file_key', type: 'TEXT' },
      { name: 'sort_order', type: 'INTEGER', notNull: true, defaultValue: '0' },
      { name: 'created_at', type: 'DATETIME', defaultValue: 'CURRENT_TIMESTAMP' }
    ],
    createTableSql: `
      CREATE TABLE {{table}} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        topic_id INTEGER NOT NULL,
        mode TEXT NOT NULL CHECK (mode IN ('link', 'upload')),
        title TEXT NOT NULL,
        url TEXT,
        author TEXT,
        file_key TEXT,
        sort_order INTEGER NOT NULL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (topic_id) REFERENCES subject_topics(id) ON DELETE CASCADE
      );
    `,
    indexSql: [
      'CREATE INDEX IF NOT EXISTS idx_subject_topic_videos_topic ON {{table}}(topic_id)'
    ]
  },
  {
    name: 'subject_topic_questions',
    columns: [
      { name: 'id', type: 'INTEGER', primaryKey: true },
      { name: 'topic_id', type: 'INTEGER', notNull: true },
      { name: 'type_key', type: 'TEXT', notNull: true },
      { name: 'section_key', type: 'TEXT' },
      { name: 'question_text', type: 'TEXT', notNull: true },
      { name: 'answer_text', type: 'TEXT', notNull: true },
      { name: 'image_key', type: 'TEXT' },
      { name: 'option_a', type: 'TEXT' },
      { name: 'option_b', type: 'TEXT' },
      { name: 'option_c', type: 'TEXT' },
      { name: 'option_d', type: 'TEXT' },
      { name: 'correct_option', type: 'TEXT' },
      { name: 'sort_order', type: 'INTEGER', notNull: true, defaultValue: '0' },
      { name: 'created_at', type: 'DATETIME', defaultValue: 'CURRENT_TIMESTAMP' }
    ],
    createTableSql: `
      CREATE TABLE {{table}} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        topic_id INTEGER NOT NULL,
        type_key TEXT NOT NULL CHECK (type_key IN ('CQ', 'MCQ')),
        section_key TEXT,
        question_text TEXT NOT NULL,
        answer_text TEXT NOT NULL,
        image_key TEXT,
        option_a TEXT,
        option_b TEXT,
        option_c TEXT,
        option_d TEXT,
        correct_option TEXT,
        sort_order INTEGER NOT NULL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (topic_id) REFERENCES subject_topics(id) ON DELETE CASCADE
      );
    `,
    indexSql: [
      'CREATE INDEX IF NOT EXISTS idx_subject_topic_questions_topic ON {{table}}(topic_id)'
    ]
  },
  {
    name: 'subject_videos',
    columns: [
      { name: 'id', type: 'INTEGER', primaryKey: true },
      { name: 'chapter_id', type: 'INTEGER', notNull: true },
      { name: 'mode', type: 'TEXT', notNull: true },
      { name: 'title', type: 'TEXT', notNull: true },
      { name: 'url', type: 'TEXT' },
      { name: 'author', type: 'TEXT' },
      { name: 'file_key', type: 'TEXT' },
      { name: 'sort_order', type: 'INTEGER', notNull: true, defaultValue: '0' },
      { name: 'created_at', type: 'DATETIME', defaultValue: 'CURRENT_TIMESTAMP' }
    ],
    createTableSql: `
      CREATE TABLE {{table}} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        chapter_id INTEGER NOT NULL,
        mode TEXT NOT NULL CHECK (mode IN ('link', 'upload')),
        title TEXT NOT NULL,
        url TEXT,
        author TEXT,
        file_key TEXT,
        sort_order INTEGER NOT NULL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (chapter_id) REFERENCES subject_chapters(id) ON DELETE CASCADE
      );
    `,
    indexSql: [
      'CREATE INDEX IF NOT EXISTS idx_subject_videos_chapter ON {{table}}(chapter_id)'
    ]
  },
  {
    name: 'subject_question_type_labels',
    columns: [
      { name: 'id', type: 'INTEGER', primaryKey: true },
      { name: 'subject_id', type: 'INTEGER', notNull: true },
      { name: 'type_key', type: 'TEXT', notNull: true },
      { name: 'display_name', type: 'TEXT' },
      { name: 'created_at', type: 'DATETIME', defaultValue: 'CURRENT_TIMESTAMP' },
      { name: 'updated_at', type: 'DATETIME', defaultValue: 'CURRENT_TIMESTAMP' }
    ],
    createTableSql: `
      CREATE TABLE {{table}} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        subject_id INTEGER NOT NULL,
        type_key TEXT NOT NULL CHECK (type_key IN ('CQ', 'MCQ')),
        display_name TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(subject_id, type_key),
        FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
      );
    `,
    indexSql: []
  },
  {
    name: 'subject_cq_section_labels',
    columns: [
      { name: 'id', type: 'INTEGER', primaryKey: true },
      { name: 'subject_id', type: 'INTEGER', notNull: true },
      { name: 'section_key', type: 'TEXT', notNull: true },
      { name: 'display_name', type: 'TEXT' },
      { name: 'created_at', type: 'DATETIME', defaultValue: 'CURRENT_TIMESTAMP' },
      { name: 'updated_at', type: 'DATETIME', defaultValue: 'CURRENT_TIMESTAMP' }
    ],
    createTableSql: `
      CREATE TABLE {{table}} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        subject_id INTEGER NOT NULL,
        section_key TEXT NOT NULL CHECK (section_key IN ('KNOWLEDGE', 'TWO', 'THREE', 'FOUR')),
        display_name TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(subject_id, section_key),
        FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
      );
    `,
    indexSql: []
  },
  {
    name: 'subject_questions',
    columns: [
      { name: 'id', type: 'INTEGER', primaryKey: true },
      { name: 'chapter_id', type: 'INTEGER', notNull: true },
      { name: 'type_key', type: 'TEXT', notNull: true },
      { name: 'section_key', type: 'TEXT' },
      { name: 'question_text', type: 'TEXT', notNull: true },
      { name: 'answer_text', type: 'TEXT', notNull: true },
      { name: 'image_key', type: 'TEXT' },
      { name: 'option_a', type: 'TEXT' },
      { name: 'option_b', type: 'TEXT' },
      { name: 'option_c', type: 'TEXT' },
      { name: 'option_d', type: 'TEXT' },
      { name: 'correct_option', type: 'TEXT' },
      { name: 'sort_order', type: 'INTEGER', notNull: true, defaultValue: '0' },
      { name: 'created_at', type: 'DATETIME', defaultValue: 'CURRENT_TIMESTAMP' }
    ],
    createTableSql: `
      CREATE TABLE {{table}} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        chapter_id INTEGER NOT NULL,
        type_key TEXT NOT NULL CHECK (type_key IN ('CQ', 'MCQ')),
        section_key TEXT,
        question_text TEXT NOT NULL,
        answer_text TEXT NOT NULL,
        image_key TEXT,
        option_a TEXT,
        option_b TEXT,
        option_c TEXT,
        option_d TEXT,
        correct_option TEXT,
        sort_order INTEGER NOT NULL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (chapter_id) REFERENCES subject_chapters(id) ON DELETE CASCADE
      );
    `,
    indexSql: [
      'CREATE INDEX IF NOT EXISTS idx_subject_questions_chapter ON {{table}}(chapter_id)'
    ]
  }
];
