import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema.js';

export function createDB(d1Database) {
  return drizzle(d1Database, { schema });
}

// This will be initialized in the worker
export let db;

export function initializeDB(d1Database) {
  db = createDB(d1Database);
  return db;
}
