import { getTableSchemas, type TableSchema } from "./schema";

export async function initDatabase(db: D1Database) {
  const schemas = getTableSchemas();
  const createStatements = schemas.map((schema) => db.prepare(schema.createSql));
  const seedStatements = schemas.flatMap((schema) =>
    (schema.seeds || []).map((sql) => db.prepare(sql))
  );

  if (createStatements.length || seedStatements.length) {
    await db.batch([...createStatements, ...seedStatements]);
  }

  await ensureTableColumns(db, schemas);
}

const ensureTableColumns = async (db: D1Database, schemas: TableSchema[]) => {
  for (const schema of schemas) {
    try {
      const info = await db.prepare(`PRAGMA table_info(${schema.name})`).all();
      const existing = new Set((info.results || []).map((row: any) => String(row.name)));
      for (const column of schema.columns) {
        if (!existing.has(column.name)) {
          await db.prepare(`ALTER TABLE ${schema.name} ADD COLUMN ${column.name} ${column.sql}`).run();
        }
      }
    } catch (e) {
      console.warn(`Skipping column check for ${schema.name}.`, e);
    }
  }
};
