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

export const expectedSchema: TableSchema[] = [adminTableSchema];

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
