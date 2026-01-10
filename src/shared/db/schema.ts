export type ColumnDefinition = {
  name: string;
  sql: string;
};

export type TableSchema = {
  name: string;
  createSql: string;
  columns: ColumnDefinition[];
  seeds?: string[];
};

const tableRegistry = new Map<string, TableSchema>();

export const registerTableSchema = (schema: TableSchema) => {
  if (tableRegistry.has(schema.name)) return;
  tableRegistry.set(schema.name, schema);
};

export const getTableSchemas = () => Array.from(tableRegistry.values());
