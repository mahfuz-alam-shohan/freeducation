import { getTableSchemas } from "./schema";
import { syncDatabaseSchemaWithDb } from "./migrator";

export async function initDatabase(db: D1Database) {
  const schemas = getTableSchemas();
  const createStatements = schemas.map((schema) => db.prepare(schema.createSql));
  const seedStatements = schemas.flatMap((schema) =>
    (schema.seeds || []).map((sql) => db.prepare(sql))
  );

  if (createStatements.length || seedStatements.length) {
    await db.batch([...createStatements, ...seedStatements]);
  }

  await syncDatabaseSchemaWithDb(db);
}
