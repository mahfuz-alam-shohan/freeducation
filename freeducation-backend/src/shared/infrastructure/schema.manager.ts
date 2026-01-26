import { TableDefinition } from '../../migrations/schema';

interface ColumnInfo {
  name: string;
  type: string;
  notNull: boolean;
  defaultValue: string | null;
  primaryKey: boolean;
}

export interface ReconcileResult {
  droppedTables: string[];
  createdTables: string[];
  rebuiltTables: string[];
  addedColumns: Record<string, string[]>;
  warnings: string[];
}

export class SchemaManager {
  constructor(private db: D1Database, private definitions: TableDefinition[]) {}

  async reconcile(): Promise<ReconcileResult> {
    const result: ReconcileResult = {
      droppedTables: [],
      createdTables: [],
      rebuiltTables: [],
      addedColumns: {},
      warnings: []
    };

    const expectedTableNames = this.definitions.map((def) => def.name);
    const existingTables = await this.listTables();

    for (const table of existingTables) {
      if (this.shouldIgnoreTable(table)) {
        continue;
      }
      if (!expectedTableNames.includes(table)) {
        try {
          await this.db.prepare(`DROP TABLE IF EXISTS ${table}`).run();
          result.droppedTables.push(table);
        } catch (error) {
          result.warnings.push(`Failed to drop table ${table}: ${this.formatError(error)}`);
        }
      }
    }

    for (const definition of this.definitions) {
      const exists = existingTables.includes(definition.name);

      if (!exists) {
        await this.createTable(definition, definition.name);
        result.createdTables.push(definition.name);
        continue;
      }

      const columns = await this.getColumns(definition.name);
      const schemaCheck = this.compareSchema(definition, columns);

      if (schemaCheck.shouldRebuild) {
        try {
          await this.rebuildTable(definition, columns);
          result.rebuiltTables.push(definition.name);
        } catch (error) {
          result.warnings.push(`Failed to rebuild ${definition.name}: ${this.formatError(error)}`);
        }
        if (schemaCheck.warning) {
          result.warnings.push(schemaCheck.warning);
        }
        continue;
      }

      const missingColumns = this.getMissingColumns(definition, columns);
      if (missingColumns.length > 0) {
        const nonAddable = missingColumns.filter((column) => column.notNull && column.defaultValue === undefined);
        if (nonAddable.length > 0) {
          await this.rebuildTable(definition, columns);
          result.rebuiltTables.push(definition.name);
          result.warnings.push(
            `Rebuilt ${definition.name} because missing columns require constraints: ${nonAddable.map((column) => column.name).join(', ')}`
          );
          continue;
        }

        result.addedColumns[definition.name] = [];
        for (const column of missingColumns) {
          const sql = this.buildAddColumnSql(definition.name, column);
          if (!sql) {
            result.warnings.push(
              `Column ${definition.name}.${column.name} missing; requires rebuild to enforce constraints`
            );
            continue;
          }
          try {
            await this.db.prepare(sql).run();
            result.addedColumns[definition.name].push(column.name);
          } catch (error) {
            result.warnings.push(`Failed to add column ${definition.name}.${column.name}: ${this.formatError(error)}`);
          }
        }
      }
    }

    return result;
  }

  private async listTables(): Promise<string[]> {
    const result = await this.db.prepare(`
      SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'
    `).all();

    return (result.results || []).map((row: any) => String(row.name));
  }

  private shouldIgnoreTable(name: string): boolean {
    const lower = name.toLowerCase();
    if (lower === 'schema_migrations') {
      return true;
    }
    if (lower.startsWith('sqlite_')) {
      return true;
    }
    if (lower.startsWith('d1_') || lower.startsWith('__d1') || lower.startsWith('_cf')) {
      return true;
    }
    if (lower.startsWith('wrangler_')) {
      return true;
    }
    return false;
  }

  private formatError(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    return String(error);
  }

  private async getColumns(tableName: string): Promise<ColumnInfo[]> {
    const result = await this.db.prepare(`PRAGMA table_info(${tableName})`).all();
    return (result.results || []).map((row: any) => ({
      name: row.name,
      type: String(row.type || ''),
      notNull: row.notnull === 1,
      defaultValue: row.dflt_value === null ? null : String(row.dflt_value),
      primaryKey: row.pk === 1
    }));
  }

  private normalizeType(type: string): string {
    return type.replace(/\s+/g, ' ').trim().toUpperCase();
  }

  private compareSchema(definition: TableDefinition, columns: ColumnInfo[]) {
    const expectedNames = definition.columns.map((column) => column.name);
    const existingNames = columns.map((column) => column.name);

    const extraColumns = existingNames.filter((name) => !expectedNames.includes(name));
    if (extraColumns.length > 0) {
      return {
        shouldRebuild: true,
        warning: `Extra columns detected in ${definition.name}: ${extraColumns.join(', ')}`
      };
    }

    for (const expected of definition.columns) {
      const actual = columns.find((column) => column.name === expected.name);
      if (!actual) {
        continue;
      }

      if (this.normalizeType(actual.type) !== this.normalizeType(expected.type)) {
        return {
          shouldRebuild: true,
          warning: `Column type mismatch for ${definition.name}.${expected.name}`
        };
      }

      if ((expected.notNull ?? false) !== actual.notNull) {
        return {
          shouldRebuild: true,
          warning: `Column nullability mismatch for ${definition.name}.${expected.name}`
        };
      }

      if ((expected.primaryKey ?? false) !== actual.primaryKey) {
        return {
          shouldRebuild: true,
          warning: `Primary key mismatch for ${definition.name}.${expected.name}`
        };
      }
    }

    return { shouldRebuild: false, warning: '' };
  }

  private getMissingColumns(definition: TableDefinition, columns: ColumnInfo[]) {
    return definition.columns.filter((expected) => !columns.some((column) => column.name === expected.name));
  }

  private buildAddColumnSql(tableName: string, column: { name: string; type: string; notNull?: boolean; defaultValue?: string; }): string | null {
    if (column.notNull && column.defaultValue === undefined) {
      return null;
    }

    let sql = `ALTER TABLE ${tableName} ADD COLUMN ${column.name} ${column.type}`;

    if (column.defaultValue !== undefined) {
      sql += ` DEFAULT ${column.defaultValue}`;
    }

    if (column.notNull) {
      sql += ' NOT NULL';
    }

    return sql;
  }

  private async createTable(definition: TableDefinition, tableName: string): Promise<void> {
    const tableSql = definition.createTableSql.replace(/\{\{table\}\}/g, tableName).trim();
    await this.db.prepare(tableSql).run();

    for (const indexSql of definition.indexSql) {
      const sql = indexSql.replace(/\{\{table\}\}/g, tableName).trim();
      await this.db.prepare(sql).run();
    }
  }

  private async rebuildTable(definition: TableDefinition, columns: ColumnInfo[]): Promise<void> {
    const tempName = `${definition.name}_rebuild_${Date.now()}`;
    await this.createTable(definition, tempName);

    const existingColumns = columns.map((column) => column.name);
    const transferableColumns = definition.columns
      .map((column) => column.name)
      .filter((name) => existingColumns.includes(name));

    if (transferableColumns.length > 0) {
      const columnsList = transferableColumns.join(', ');
      await this.db.prepare(`
        INSERT INTO ${tempName} (${columnsList})
        SELECT ${columnsList} FROM ${definition.name}
      `).run();
    }

    await this.db.prepare(`DROP TABLE ${definition.name}`).run();
    await this.db.prepare(`ALTER TABLE ${tempName} RENAME TO ${definition.name}`).run();

    for (const indexSql of definition.indexSql) {
      const sql = indexSql.replace(/\{\{table\}\}/g, definition.name).trim();
      await this.db.prepare(sql).run();
    }
  }
}
