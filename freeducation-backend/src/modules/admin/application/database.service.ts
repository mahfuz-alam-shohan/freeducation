export interface TableInfo {
  name: string;
}

export interface TableColumn {
  name: string;
  type: string;
  notNull: boolean;
  primaryKey: boolean;
}

export interface TableData {
  table: string;
  columns: TableColumn[];
  rows: Record<string, unknown>[];
  primaryKey: string | null;
  total: number;
}

export class DatabaseService {
  constructor(private db: D1Database) {}

  async listTables(): Promise<TableInfo[]> {
    const result = await this.db.prepare(`
      SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'
    `).all();

    const names = (result.results || [])
      .map((row: any) => String(row.name))
      .filter((name) => !this.isSystemTable(name));

    return names.map((name) => ({ name }));
  }

  async getTableData(table: string, limit: number, offset: number): Promise<TableData> {
    await this.ensureTableAllowed(table);

    const columns = await this.getColumns(table);
    const primaryKey = columns.find((column) => column.primaryKey)?.name || null;

    const countResult = await this.db.prepare(`SELECT COUNT(*) as count FROM ${table}`).first();
    const total = Number(countResult?.count || 0);

    const rowsResult = await this.db.prepare(`
      SELECT * FROM ${table} LIMIT ? OFFSET ?
    `).bind(limit, offset).all();

    return {
      table,
      columns,
      rows: (rowsResult.results || []) as Record<string, unknown>[],
      primaryKey,
      total
    };
  }

  async deleteRow(table: string, primaryKey: string, value: string | number): Promise<void> {
    await this.ensureTableAllowed(table);
    await this.db.prepare(`DELETE FROM ${table} WHERE ${primaryKey} = ?`).bind(value).run();
  }

  async truncateTable(table: string): Promise<void> {
    await this.ensureTableAllowed(table);
    await this.db.prepare(`DELETE FROM ${table}`).run();
  }

  async dropTable(table: string): Promise<void> {
    await this.ensureTableAllowed(table);
    await this.db.prepare(`DROP TABLE IF EXISTS ${table}`).run();
  }

  private async ensureTableAllowed(table: string): Promise<void> {
    if (this.isSystemTable(table)) {
      throw new Error('System tables cannot be modified');
    }

    const tables = await this.listTables();
    if (!tables.some((item) => item.name === table)) {
      throw new Error('Table not found');
    }
  }

  private async getColumns(table: string): Promise<TableColumn[]> {
    const result = await this.db.prepare(`PRAGMA table_info(${table})`).all();
    return (result.results || []).map((row: any) => ({
      name: row.name,
      type: row.type,
      notNull: row.notnull === 1,
      primaryKey: row.pk === 1
    }));
  }

  private isSystemTable(name: string): boolean {
    const lower = name.toLowerCase();
    return (
      lower.startsWith('sqlite_') ||
      lower.startsWith('d1_') ||
      lower.startsWith('__d1') ||
      lower.startsWith('_cf') ||
      lower.startsWith('wrangler_') ||
      lower === 'schema_migrations'
    );
  }
}
