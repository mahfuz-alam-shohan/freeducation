import type { Env } from '../../../shared/types';
import { getTableSchemas } from '../../../shared/db/schema';
import '../users/schema';
import '../../domains/academic/shared/schema';
import '../../domains/social/schema';

type ColumnChange = {
  table: string;
  column: string;
  sql: string;
};

type MigrationReport = {
  createdTables: string[];
  addedColumns: ColumnChange[];
  errors: { table: string; error: string }[];
};

const ensureTable = async (db: D1Database, schema: { name: string; createSql: string }) => {
  const existing = await db
    .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name=?")
    .bind(schema.name)
    .first();
  if (existing?.name) return true;
  await db.prepare(schema.createSql).run();
  return false;
};

const loadTableColumns = async (db: D1Database, tableName: string) => {
  const info = await db.prepare(`PRAGMA table_info(${tableName})`).all();
  return new Set((info.results || []).map((row: any) => String(row.name)));
};

const backfillProfiles = async (db: D1Database) => {
  const userColumns = await loadTableColumns(db, 'users');
  const hasLegacyProfile =
    userColumns.has('username') || userColumns.has('name') || userColumns.has('class_label') || userColumns.has('group_label');

  if (hasLegacyProfile) {
    const usernameExpr = userColumns.has('username') ? 'username' : 'email';
    const nameExpr = userColumns.has('name') ? 'name' : usernameExpr;
    await db.prepare(
      `INSERT INTO user_profiles (user_id, username, name)
       SELECT id, ${usernameExpr}, ${nameExpr}
       FROM users
       WHERE id NOT IN (SELECT user_id FROM user_profiles)`
    ).run();
  }

  const hasAcademicColumns =
    userColumns.has('class_label') ||
    userColumns.has('group_label') ||
    userColumns.has('religion') ||
    userColumns.has('date_of_birth') ||
    userColumns.has('batch_year') ||
    userColumns.has('points');

  if (hasAcademicColumns) {
    const classLabelExpr = userColumns.has('class_label') ? 'class_label' : 'NULL';
    const groupLabelExpr = userColumns.has('group_label') ? 'group_label' : 'NULL';
    const religionExpr = userColumns.has('religion') ? 'religion' : 'NULL';
    const dateOfBirthExpr = userColumns.has('date_of_birth') ? 'date_of_birth' : 'NULL';
    const batchYearExpr = userColumns.has('batch_year') ? 'batch_year' : 'NULL';
    const pointsExpr = userColumns.has('points') ? 'points' : '0';
    await db.prepare(
      `INSERT INTO academic_profiles (user_id, class_label, group_label, religion, date_of_birth, batch_year, points)
       SELECT id, ${classLabelExpr}, ${groupLabelExpr}, ${religionExpr}, ${dateOfBirthExpr}, ${batchYearExpr}, ${pointsExpr}
       FROM users
       WHERE role = 'student' AND id NOT IN (SELECT user_id FROM academic_profiles)`
    ).run();
  }
};

export const syncDatabaseSchema = async (env: Env): Promise<MigrationReport> => {
  const schemas = getTableSchemas();
  const report: MigrationReport = {
    createdTables: [],
    addedColumns: [],
    errors: [],
  };

  for (const schema of schemas) {
    try {
      const existed = await ensureTable(env.DB, schema);
      if (!existed) {
        report.createdTables.push(schema.name);
        if (schema.seeds && schema.seeds.length) {
          const seedStatements = schema.seeds.map((sql) => env.DB.prepare(sql));
          await env.DB.batch(seedStatements);
        }
        continue;
      }

      const existingColumns = await loadTableColumns(env.DB, schema.name);
      for (const column of schema.columns) {
        if (existingColumns.has(column.name)) continue;
        await env.DB.prepare(`ALTER TABLE ${schema.name} ADD COLUMN ${column.name} ${column.sql}`).run();
        report.addedColumns.push({ table: schema.name, column: column.name, sql: column.sql });
      }
    } catch (error) {
      report.errors.push({
        table: schema.name,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  await backfillProfiles(env.DB);

  return report;
};
