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
      name: 'TEXT NOT NULL', /* e.g. Class 9-10 */
      level: 'TEXT NOT NULL', /* e.g. SSC */
      description: 'TEXT',
      created_at: 'TEXT NOT NULL'
    }
  },
  subjects: {
    name: 'subjects',
    columns: {
      id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
      class_id: 'INTEGER NOT NULL',
      name: 'TEXT NOT NULL', /* e.g. Physics */
      description: 'TEXT',
      icon_emoji: 'TEXT'
    }
  },
  chapters: {
    name: 'chapters',
    columns: {
      id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
      subject_id: 'INTEGER NOT NULL',
      name: 'TEXT NOT NULL', /* e.g. Motion (গতি) */
      description: 'TEXT',
      order_index: 'INTEGER DEFAULT 0'
    }
  },
  /* TOPICS: The breakdown of a chapter */
  topics: {
    name: 'topics',
    columns: {
      id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
      chapter_id: 'INTEGER NOT NULL',
      title: 'TEXT NOT NULL', /* e.g. Velocity */
      order_index: 'INTEGER DEFAULT 0'
    }
  },
  /* CONTENTS: The actual text/html content for a topic (Explanation, Short Q, etc.) */
  contents: {
    name: 'contents',
    columns: {
      id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
      topic_id: 'INTEGER NOT NULL',
      type: 'TEXT NOT NULL', /* 'explanation', 'short_qa' (gyan mulok), 'formula' */
      body: 'TEXT NOT NULL', /* HTML or Markdown */
      order_index: 'INTEGER DEFAULT 0'
    }
  },
  /* QUESTIONS: MCQs and Creative Questions (Srijonshil) */
  questions: {
    name: 'questions',
    columns: {
      id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
      chapter_id: 'INTEGER NOT NULL',
      type: 'TEXT NOT NULL', /* 'mcq', 'cq' (creative/srijonshil) */
      question_text: 'TEXT NOT NULL',
      options_json: 'TEXT', /* JSON for MCQ options e.g. ["A", "B", "C", "D"] */
      correct_answer: 'TEXT', /* For MCQ */
      solution_text: 'TEXT', /* Explanation of the answer */
      created_at: 'TEXT NOT NULL'
    }
  },
  /* RESOURCES: PDFs like Guides, Board Papers, Textbooks */
  resources: {
    name: 'resources',
    columns: {
      id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
      subject_id: 'INTEGER NOT NULL', /* Can be linked to subject */
      chapter_id: 'INTEGER', /* Optional: linked to specific chapter */
      category: 'TEXT NOT NULL', /* 'textbook', 'guide', 'board_paper', 'lecture_sheet' */
      title: 'TEXT NOT NULL',
      r2_key: 'TEXT NOT NULL',
      mime_type: 'TEXT',
      created_at: 'TEXT NOT NULL'
    }
  }
} as const;

const SCHEMA_VERSION = '3';

/* --- Schema Migration Logic --- */
const TABLE_LIST = Object.values(TABLES).map((table) => table.name);
const createTableSQL = (table: any) => {
  const cols = Object.entries(table.columns).map(([k, v]) => `${k} ${v}`).join(', ');
  return `CREATE TABLE IF NOT EXISTS ${table.name} (${cols})`;
};

export const ensureSchema = async (env: Bindings) => {
  // Check version
  const { results } = await env.DB.prepare("SELECT name FROM sqlite_master WHERE type='table'").all<{ name: string }>();
  const existing = results.map(r => r.name);
  
  if (!existing.includes('schema_meta')) {
    await env.DB.prepare(createTableSQL(TABLES.schemaMeta)).run();
    await env.DB.prepare("INSERT INTO schema_meta (key, value) VALUES ('schema_version', '0')").run();
  }

  const ver = await env.DB.prepare("SELECT value FROM schema_meta WHERE key='schema_version'").first<{value:string}>();
  
  // Simple migration: If version mismatch, just create missing tables/columns
  // In production, you'd want smarter migration, but this works for rapid dev
  for (const table of Object.values(TABLES)) {
    await env.DB.prepare(createTableSQL(table)).run();
    // Add columns if missing
    const tableInfo = await env.DB.prepare(`PRAGMA table_info(${table.name})`).all<{name:string}>();
    const existingCols = tableInfo.results.map(c => c.name);
    for (const [colName, colType] of Object.entries(table.columns)) {
      if (!existingCols.includes(colName)) {
        try {
          await env.DB.prepare(`ALTER TABLE ${table.name} ADD COLUMN ${colName} ${colType}`).run();
        } catch (e) { console.error(`Migration error on ${table.name}.${colName}`, e); }
      }
    }
  }
  
  await env.DB.prepare("UPDATE schema_meta SET value = ? WHERE key = 'schema_version'").bind(SCHEMA_VERSION).run();
};

export const hasAnyAdmin = async (env: Bindings) => {
  const row = await env.DB.prepare('SELECT id FROM admins LIMIT 1').first<{ id: number }>();
  return Boolean(row?.id);
};


