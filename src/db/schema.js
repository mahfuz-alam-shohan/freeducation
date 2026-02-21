const TABLES = {
  users: {
    create: `CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      image_key TEXT,
      date_of_birth TEXT,
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
      date_of_birth: 'TEXT',
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
  subject_templates: {
    create: `CREATE TABLE IF NOT EXISTS subject_templates (
      id TEXT PRIMARY KEY,
      code TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      description TEXT,
      created_at TEXT NOT NULL
    )`,
    columns: {
      id: 'TEXT',
      code: 'TEXT',
      name: 'TEXT',
      description: 'TEXT',
      created_at: 'TEXT',
    },
  },
  template_nodes: {
    create: `CREATE TABLE IF NOT EXISTS template_nodes (
      id TEXT PRIMARY KEY,
      template_id TEXT NOT NULL,
      parent_id TEXT,
      node_key TEXT NOT NULL,
      server_name TEXT NOT NULL,
      node_type TEXT NOT NULL,
      supports_edit INTEGER NOT NULL DEFAULT 0,
      supports_image INTEGER NOT NULL DEFAULT 0,
      supports_chapters INTEGER NOT NULL DEFAULT 0,
      content_kind TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (template_id) REFERENCES subject_templates(id) ON DELETE CASCADE,
      FOREIGN KEY (parent_id) REFERENCES template_nodes(id) ON DELETE CASCADE
    )`,
    columns: {
      id: 'TEXT',
      template_id: 'TEXT',
      parent_id: 'TEXT',
      node_key: 'TEXT',
      server_name: 'TEXT',
      node_type: 'TEXT',
      supports_edit: 'INTEGER',
      supports_image: 'INTEGER',
      supports_chapters: 'INTEGER',
      content_kind: 'TEXT',
      sort_order: 'INTEGER',
    },
  },
  subjects: {
    create: `CREATE TABLE IF NOT EXISTS subjects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      class_level INTEGER NOT NULL,
      template_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (template_id) REFERENCES subject_templates(id)
    )`,
    columns: {
      id: 'TEXT',
      name: 'TEXT',
      class_level: 'INTEGER',
      template_id: 'TEXT',
      created_at: 'TEXT',
      updated_at: 'TEXT',
    },
  },
  subject_nodes: {
    create: `CREATE TABLE IF NOT EXISTS subject_nodes (
      id TEXT PRIMARY KEY,
      subject_id TEXT NOT NULL,
      template_node_id TEXT NOT NULL,
      parent_subject_node_id TEXT,
      server_name TEXT NOT NULL,
      display_name TEXT NOT NULL,
      image_key TEXT,
      supports_edit INTEGER NOT NULL DEFAULT 0,
      supports_image INTEGER NOT NULL DEFAULT 0,
      supports_chapters INTEGER NOT NULL DEFAULT 0,
      node_type TEXT NOT NULL,
      content_kind TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
      FOREIGN KEY (template_node_id) REFERENCES template_nodes(id),
      FOREIGN KEY (parent_subject_node_id) REFERENCES subject_nodes(id) ON DELETE CASCADE
    )`,
    columns: {
      id: 'TEXT',
      subject_id: 'TEXT',
      template_node_id: 'TEXT',
      parent_subject_node_id: 'TEXT',
      server_name: 'TEXT',
      display_name: 'TEXT',
      image_key: 'TEXT',
      supports_edit: 'INTEGER',
      supports_image: 'INTEGER',
      supports_chapters: 'INTEGER',
      node_type: 'TEXT',
      content_kind: 'TEXT',
      sort_order: 'INTEGER',
    },
  },
  chapters: {
    create: `CREATE TABLE IF NOT EXISTS chapters (
      id TEXT PRIMARY KEY,
      subject_node_id TEXT NOT NULL,
      name TEXT NOT NULL,
      image_key TEXT,
      has_topics INTEGER NOT NULL DEFAULT 0,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (subject_node_id) REFERENCES subject_nodes(id) ON DELETE CASCADE
    )`,
    columns: {
      id: 'TEXT',
      subject_node_id: 'TEXT',
      name: 'TEXT',
      image_key: 'TEXT',
      has_topics: 'INTEGER',
      sort_order: 'INTEGER',
      created_at: 'TEXT',
      updated_at: 'TEXT',
    },
  },
  topics: {
    create: `CREATE TABLE IF NOT EXISTS topics (
      id TEXT PRIMARY KEY,
      chapter_id TEXT NOT NULL,
      name TEXT NOT NULL,
      image_key TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE
    )`,
    columns: {
      id: 'TEXT',
      chapter_id: 'TEXT',
      name: 'TEXT',
      image_key: 'TEXT',
      sort_order: 'INTEGER',
      created_at: 'TEXT',
      updated_at: 'TEXT',
    },
  },
  short_notes: {
    create: `CREATE TABLE IF NOT EXISTS short_notes (
      id TEXT PRIMARY KEY,
      subject_id TEXT NOT NULL,
      subject_node_id TEXT NOT NULL,
      chapter_id TEXT,
      topic_id TEXT,
      title TEXT NOT NULL,
      content_html TEXT NOT NULL,
      image_key TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
      FOREIGN KEY (subject_node_id) REFERENCES subject_nodes(id) ON DELETE CASCADE,
      FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE,
      FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
    )`,
    columns: {
      id: 'TEXT',
      subject_id: 'TEXT',
      subject_node_id: 'TEXT',
      chapter_id: 'TEXT',
      topic_id: 'TEXT',
      title: 'TEXT',
      content_html: 'TEXT',
      image_key: 'TEXT',
      created_at: 'TEXT',
      updated_at: 'TEXT',
    },
  },
  mcq_bank: {
    create: `CREATE TABLE IF NOT EXISTS mcq_bank (
      id TEXT PRIMARY KEY,
      subject_id TEXT NOT NULL,
      subject_node_id TEXT NOT NULL,
      chapter_id TEXT,
      topic_id TEXT,
      question_html TEXT NOT NULL,
      option_a TEXT NOT NULL,
      option_b TEXT NOT NULL,
      option_c TEXT NOT NULL,
      option_d TEXT NOT NULL,
      correct_option TEXT NOT NULL,
      image_key TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
      FOREIGN KEY (subject_node_id) REFERENCES subject_nodes(id) ON DELETE CASCADE,
      FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE,
      FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
    )`,
    columns: {
      id: 'TEXT',
      subject_id: 'TEXT',
      subject_node_id: 'TEXT',
      chapter_id: 'TEXT',
      topic_id: 'TEXT',
      question_html: 'TEXT',
      option_a: 'TEXT',
      option_b: 'TEXT',
      option_c: 'TEXT',
      option_d: 'TEXT',
      correct_option: 'TEXT',
      image_key: 'TEXT',
      created_at: 'TEXT',
      updated_at: 'TEXT',
    },
  },
  content_entries: {
    create: `CREATE TABLE IF NOT EXISTS content_entries (
      id TEXT PRIMARY KEY,
      subject_id TEXT NOT NULL,
      subject_node_id TEXT NOT NULL,
      chapter_id TEXT,
      topic_id TEXT,
      content_kind TEXT NOT NULL,
      title TEXT NOT NULL,
      content_html TEXT NOT NULL,
      image_key TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
      FOREIGN KEY (subject_node_id) REFERENCES subject_nodes(id) ON DELETE CASCADE,
      FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE,
      FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
    )`,
    columns: {
      id: 'TEXT',
      subject_id: 'TEXT',
      subject_node_id: 'TEXT',
      chapter_id: 'TEXT',
      topic_id: 'TEXT',
      content_kind: 'TEXT',
      title: 'TEXT',
      content_html: 'TEXT',
      image_key: 'TEXT',
      created_at: 'TEXT',
      updated_at: 'TEXT',
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
  await runSql(db, 'CREATE INDEX IF NOT EXISTS idx_template_nodes_template ON template_nodes(template_id)');
  await runSql(db, 'CREATE INDEX IF NOT EXISTS idx_subject_nodes_subject ON subject_nodes(subject_id)');
  await runSql(db, 'CREATE INDEX IF NOT EXISTS idx_subject_nodes_parent ON subject_nodes(parent_subject_node_id)');
  await runSql(db, 'CREATE INDEX IF NOT EXISTS idx_chapters_node ON chapters(subject_node_id)');
  await runSql(db, 'CREATE INDEX IF NOT EXISTS idx_topics_chapter ON topics(chapter_id)');
  await runSql(db, 'CREATE INDEX IF NOT EXISTS idx_notes_lookup ON short_notes(subject_node_id, chapter_id)');
  await runSql(db, 'CREATE INDEX IF NOT EXISTS idx_mcq_lookup ON mcq_bank(subject_node_id, chapter_id)');
  await runSql(db, 'CREATE INDEX IF NOT EXISTS idx_content_entries_lookup ON content_entries(subject_node_id, chapter_id, content_kind)');
  schemaInitialized = true;
}
