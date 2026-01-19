export type ColumnDefinition = {
  name: string;
  type: string;
  notNull?: boolean;
  unique?: boolean;
  defaultValue?: string;
  primaryKey?: boolean;
};

export type TableSchema = {
  name: string;
  columns: ColumnDefinition[];
};

export const adminTableSchema: TableSchema = {
  name: "admins",
  columns: [
    { name: "id", type: "INTEGER", primaryKey: true },
    { name: "name", type: "TEXT", notNull: true },
    { name: "email", type: "TEXT", notNull: true, unique: true },
    { name: "password_hash", type: "TEXT", notNull: true },
    { name: "date_of_birth", type: "TEXT", notNull: true },
    { name: "created_at", type: "TEXT", notNull: true },
  ],
};

export const studentTableSchema: TableSchema = {
  name: "students",
  columns: [
    { name: "id", type: "INTEGER", primaryKey: true },
    { name: "name", type: "TEXT", notNull: true },
    { name: "email", type: "TEXT", notNull: true, unique: true },
    { name: "password_hash", type: "TEXT", notNull: true },
    { name: "date_of_birth", type: "TEXT", notNull: true },
    { name: "created_at", type: "TEXT", notNull: true },
    { name: "verified_at", type: "TEXT" },
  ],
};

export const studentVerificationTableSchema: TableSchema = {
  name: "student_verifications",
  columns: [
    { name: "id", type: "INTEGER", primaryKey: true },
    { name: "student_id", type: "INTEGER", notNull: true },
    { name: "code_hash", type: "TEXT", notNull: true },
    { name: "attempts", type: "INTEGER", notNull: true, defaultValue: "0" },
    { name: "expires_at", type: "TEXT", notNull: true },
    { name: "created_at", type: "TEXT", notNull: true },
    { name: "used_at", type: "TEXT" },
  ],
};

export const expectedSchema: TableSchema[] = [adminTableSchema, studentTableSchema, studentVerificationTableSchema];

export const buildColumnSql = (column: ColumnDefinition): string => {
  const parts = [column.name, column.type];

  if (column.primaryKey) {
    parts.push("PRIMARY KEY");
  }

  if (column.notNull) {
    parts.push("NOT NULL");
  }

  if (column.unique) {
    parts.push("UNIQUE");
  }

  if (column.defaultValue) {
    parts.push(`DEFAULT ${column.defaultValue}`);
  }

  return parts.join(" ");
};

export const buildCreateTableSql = (table: TableSchema): string => {
  const columnSql = table.columns.map(buildColumnSql).join(", ");
  return `CREATE TABLE IF NOT EXISTS ${table.name} (${columnSql})`;
};
