import type { Bindings } from '../types';

const TABLES = {
  schemaMeta: {
    name: 'schema_meta',
    columns: { key: 'TEXT PRIMARY KEY', value: 'TEXT NOT NULL' }
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
      description: 'TEXT',
      icon_emoji: 'TEXT'
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
      order_index: 'INTEGER DEFAULT 0'
    }
  },
  /* Detailed Explanations / Notes */
  contents: {
    name: 'contents',
    columns: {
      id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
      topic_id: 'INTEGER NOT NULL',
      type: 'TEXT NOT NULL', /* 'explanation', 'short_qa' */
      body: 'TEXT NOT NULL',
      order_index: 'INTEGER DEFAULT 0'
    }
  },
  /* Question Bank (MCQ/CQ) */
  questions: {
    name: 'questions',
    columns: {
      id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
      chapter_id: 'INTEGER NOT NULL',
      type: 'TEXT NOT NULL', /* 'mcq', 'cq' */
      question_text: 'TEXT NOT NULL',
      options_json: 'TEXT',
      correct_answer: 'TEXT',
      solution_text: 'TEXT',
      created_at: 'TEXT NOT NULL'
    }
  },
  /* PDF Library */
  resources: {
    name: 'resources',
    columns: {
      id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
      subject_id: 'INTEGER NOT NULL',
      category: 'TEXT NOT NULL',
      title: 'TEXT NOT NULL',
      r2_key: 'TEXT NOT NULL',
      mime_type: 'TEXT',
      created_at: 'TEXT NOT NULL'
    }
  },
   /* Files for Topics (Legacy support) */
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

const SCHEMA_VERSION = '4';

const createTableSQL = (table: any) => {
  const cols = Object.entries(table.columns).map(([k, v]) => `${k} ${v}`).join(', ');
  return `CREATE TABLE IF NOT EXISTS ${table.name} (${cols})`;
};

export const ensureSchema = async (env: Bindings) => {
  const { results } = await env.DB.prepare("SELECT name FROM sqlite_master WHERE type='table'").all<{ name: string }>();
  const existing = results.map(r => r.name);
  
  if (!existing.includes('schema_meta')) {
    await env.DB.prepare(createTableSQL(TABLES.schemaMeta)).run();
    await env.DB.prepare("INSERT INTO schema_meta (key, value) VALUES ('schema_version', '0')").run();
  }

  for (const table of Object.values(TABLES)) {
    await env.DB.prepare(createTableSQL(table)).run();
    try {
      const tableInfo = await env.DB.prepare(`PRAGMA table_info(${table.name})`).all<{name:string}>();
      const existingCols = tableInfo.results.map(c => c.name);
      for (const [colName, colType] of Object.entries(table.columns)) {
        if (!existingCols.includes(colName)) {
          await env.DB.prepare(`ALTER TABLE ${table.name} ADD COLUMN ${colName} ${colType}`).run();
        }
      }
    } catch (e) { console.error(`Migration warning for ${table.name}`, e); }
  }
  
  await env.DB.prepare("UPDATE schema_meta SET value = ? WHERE key = 'schema_version'").bind(SCHEMA_VERSION).run();
};

export const hasAnyAdmin = async (env: Bindings) => {
  const row = await env.DB.prepare('SELECT id FROM admins LIMIT 1').first<{ id: number }>();
  return Boolean(row?.id);
};


