import type { Bindings } from '../types';

const TABLES = {
  schemaMeta: { name: 'schema_meta', cols: 'key TEXT PRIMARY KEY, value TEXT' },
  admins: { name: 'admins', cols: 'id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT UNIQUE, password_hash TEXT, password_salt TEXT, created_at TEXT' },
  sessions: { name: 'sessions', cols: 'id INTEGER PRIMARY KEY AUTOINCREMENT, admin_id INTEGER, token TEXT UNIQUE, expires_at TEXT, created_at TEXT' },
  classes: { name: 'classes', cols: 'id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, level TEXT, description TEXT, created_at TEXT' },
  subjects: { name: 'subjects', cols: 'id INTEGER PRIMARY KEY AUTOINCREMENT, class_id INTEGER, name TEXT, description TEXT, icon_emoji TEXT' },
  chapters: { name: 'chapters', cols: 'id INTEGER PRIMARY KEY AUTOINCREMENT, subject_id INTEGER, name TEXT, description TEXT, order_index INTEGER DEFAULT 0' },
  topics: { name: 'topics', cols: 'id INTEGER PRIMARY KEY AUTOINCREMENT, chapter_id INTEGER, title TEXT, order_index INTEGER DEFAULT 0' },
  contents: { name: 'contents', cols: 'id INTEGER PRIMARY KEY AUTOINCREMENT, topic_id INTEGER, type TEXT, body TEXT, order_index INTEGER DEFAULT 0' },
  questions: { name: 'questions', cols: 'id INTEGER PRIMARY KEY AUTOINCREMENT, chapter_id INTEGER, type TEXT, question_text TEXT, options_json TEXT, correct_answer TEXT, solution_text TEXT, created_at TEXT' },
  resources: { name: 'resources', cols: 'id INTEGER PRIMARY KEY AUTOINCREMENT, subject_id INTEGER, category TEXT, title TEXT, r2_key TEXT, mime_type TEXT, created_at TEXT' },
  files: { name: 'files', cols: 'id INTEGER PRIMARY KEY AUTOINCREMENT, topic_id INTEGER, title TEXT, r2_key TEXT, mime_type TEXT, size INTEGER, created_at TEXT' }
};

const SCHEMA_VERSION = '5';

export const ensureSchema = async (env: Bindings) => {
  try {
    // 1. Create Tables Safely
    for (const [key, table] of Object.entries(TABLES)) {
      try {
        await env.DB.prepare(`CREATE TABLE IF NOT EXISTS ${table.name} (${table.cols})`).run();
      } catch (e) {
        console.error(`Failed to create table ${table.name}:`, e);
      }
    }

    // 2. Add Missing Columns (Manual Migration Check)
    // We try to select the column; if it fails, we add it.
    // This is safer than PRAGMA checks which vary by SQLite version.
    
    // Example: Add 'level' to classes if missing
    try { await env.DB.prepare('SELECT level FROM classes LIMIT 1').run(); } 
    catch { await env.DB.prepare('ALTER TABLE classes ADD COLUMN level TEXT').run().catch(() => {}); }

    try { await env.DB.prepare('SELECT icon_emoji FROM subjects LIMIT 1').run(); }
    catch { await env.DB.prepare('ALTER TABLE subjects ADD COLUMN icon_emoji TEXT').run().catch(() => {}); }

    try { await env.DB.prepare('SELECT order_index FROM chapters LIMIT 1').run(); }
    catch { await env.DB.prepare('ALTER TABLE chapters ADD COLUMN order_index INTEGER DEFAULT 0').run().catch(() => {}); }

    try { await env.DB.prepare('SELECT type FROM contents LIMIT 1').run(); }
    catch { await env.DB.prepare('ALTER TABLE contents ADD COLUMN type TEXT').run().catch(() => {}); }

  } catch (err) {
    console.error('Critical Schema Error (Ignored to keep app alive):', err);
  }
};

export const hasAnyAdmin = async (env: Bindings) => {
  try {
    const row = await env.DB.prepare('SELECT id FROM admins LIMIT 1').first<{ id: number }>();
    return Boolean(row?.id);
  } catch (e) {
    return false;
  }
};
