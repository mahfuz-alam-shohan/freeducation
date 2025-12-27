import { Env } from './config';

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    full_name TEXT,
    role TEXT DEFAULT 'admin',
    created_at INTEGER DEFAULT (unixepoch())
  );
  CREATE TABLE IF NOT EXISTS resources (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL,
    category TEXT,
    url TEXT,
    is_public BOOLEAN DEFAULT 1,
    views INTEGER DEFAULT 0,
    created_by TEXT,
    created_at INTEGER DEFAULT (unixepoch())
  );
  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    expires_at INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  CREATE INDEX IF NOT EXISTS idx_resources_search ON resources(title, category);
`;

export async function initDB(env: Env) {
  const statements = SCHEMA.split(';').map(s => s.trim()).filter(s => s.length > 0);
  for (const stmt of statements) {
    await env.DB.prepare(stmt).run();
  }
}

export async function getResources(env: Env, query: string = '') {
  try {
    if (query) {
      return await env.DB.prepare("SELECT * FROM resources WHERE is_public = 1 AND (title LIKE ? OR category LIKE ?) ORDER BY created_at DESC LIMIT 50")
        .bind(`%${query}%`, `%${query}%`).all();
    }
    return await env.DB.prepare("SELECT * FROM resources WHERE is_public = 1 ORDER BY created_at DESC LIMIT 50").all();
  } catch (e: any) {
    if (e.message.includes("no such table")) {
      await initDB(env);
      return { results: [] };
    }
    throw e;
  }
}
