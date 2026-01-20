import { buildColumnSql, buildCreateTableSql, expectedSchema, type ColumnDefinition } from "./schema";

type D1Database = {
  prepare: (query: string) => {
    all: <T = unknown>() => Promise<{ results: T[] }>;
    run: () => Promise<void>;
  };
};

type ColumnInfo = {
  name: string;
  type: string;
  notnull: number;
  dflt_value: string | null;
  pk: number;
};

type TablePlan = {
  table: string;
  recreate: boolean;
  addColumns: ColumnDefinition[];
};

const getExistingTables = async (db: D1Database): Promise<string[]> => {
  const result = await db
    .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'")
    .all<{ name: string }>();
  return result.results.map((row) => row.name);
};

const getTableColumns = async (db: D1Database, table: string): Promise<ColumnInfo[]> => {
  const result = await db.prepare(`PRAGMA table_info(${table})`).all<ColumnInfo>();
  return result.results;
};

const hasMatchingColumn = (expected: ColumnDefinition, existing: ColumnInfo): boolean => {
  const expectedType = expected.type.toUpperCase();
  const existingType = existing.type.toUpperCase();

  if (expectedType !== existingType) {
    return false;
  }

  if (expected.primaryKey && existing.pk !== 1) {
    return false;
  }

  if (expected.notNull && existing.notnull !== 1) {
    return false;
  }

  return true;
};

const planTableUpdate = (expected: { name: string; columns: ColumnDefinition[] }, existingColumns: ColumnInfo[]): TablePlan => {
  const existingMap = new Map(existingColumns.map((column) => [column.name, column]));
  const expectedNames = new Set(expected.columns.map((column) => column.name));

  let recreate = false;
  const addColumns: ColumnDefinition[] = [];

  for (const existing of existingColumns) {
    if (!expectedNames.has(existing.name)) {
      recreate = true;
      break;
    }
  }

  if (!recreate) {
    for (const expectedColumn of expected.columns) {
      const existing = existingMap.get(expectedColumn.name);

      if (!existing) {
        if (expectedColumn.primaryKey || expectedColumn.unique) {
          recreate = true;
          break;
        }
        addColumns.push(expectedColumn);
        continue;
      }

      if (!hasMatchingColumn(expectedColumn, existing)) {
        recreate = true;
        break;
      }
    }
  }

  return {
    table: expected.name,
    recreate,
    addColumns,
  };
};

const dropTable = async (db: D1Database, table: string): Promise<void> => {
  await db.prepare(`DROP TABLE IF EXISTS ${table}`).run();
};

const createTable = async (db: D1Database, table: { name: string; columns: ColumnDefinition[] }): Promise<void> => {
  await db.prepare(buildCreateTableSql(table)).run();
};

const addColumn = async (db: D1Database, table: string, column: ColumnDefinition): Promise<void> => {
  const columnSql = buildColumnSql({ ...column, primaryKey: false, unique: false });
  await db.prepare(`ALTER TABLE ${table} ADD COLUMN ${columnSql}`).run();
};

const isAuthorizationError = (error: unknown): boolean => {
  if (!(error instanceof Error)) {
    return false;
  }

  return error.message.includes("SQLITE_AUTH") || error.message.includes("not authorized");
};

const createMinimalSchema = async (db: D1Database): Promise<void> => {
  for (const table of expectedSchema) {
    await createTable(db, table);
  }
};

export const ensureSchema = async (db: D1Database): Promise<void> => {
  try {
    const existingTables = await getExistingTables(db);
    const expectedTableNames = new Set(expectedSchema.map((table) => table.name));

    for (const table of existingTables) {
      if (!expectedTableNames.has(table)) {
        await dropTable(db, table);
      }
    }

    for (const table of expectedSchema) {
      if (!existingTables.includes(table.name)) {
        await createTable(db, table);
        continue;
      }

      const columns = await getTableColumns(db, table.name);
      const plan = planTableUpdate(table, columns);

      if (plan.recreate) {
        await dropTable(db, table.name);
        await createTable(db, table);
        continue;
      }

      for (const column of plan.addColumns) {
        await addColumn(db, table.name, column);
      }
    }
  } catch (error) {
    if (isAuthorizationError(error)) {
      await createMinimalSchema(db);
      return;
    }

    throw error;
  }
};
