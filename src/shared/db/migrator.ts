import type { Env } from '../types';
import { getTableSchemas } from './schema';

const syncDatabaseSchemaWithDb = async (db: D1Database) => {
  const schemas = getTableSchemas();
  if (!schemas.length) return;

  const createStatements = schemas.map((schema) => db.prepare(schema.createSql));
  if (createStatements.length) {
    await db.batch(createStatements);
  }

  const alterStatements = [];
  for (const schema of schemas) {
    const info = await db.prepare(`PRAGMA table_info(${schema.name})`).all();
    const existing = new Set((info.results || []).map((row: any) => String(row.name)));
    for (const column of schema.columns) {
      if (!existing.has(column.name)) {
        alterStatements.push(db.prepare(`ALTER TABLE ${schema.name} ADD COLUMN ${column.name} ${column.sql}`));
      }
    }
  }

  if (alterStatements.length) {
    await db.batch(alterStatements);
  }
};

export const syncDatabaseSchema = async (env: Env) => syncDatabaseSchemaWithDb(env.DB);
export { syncDatabaseSchemaWithDb };
