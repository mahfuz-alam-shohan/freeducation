// D1 Database interface for Cloudflare Workers
export interface D1Database {
  prepare(sql: string): D1PreparedStatement;
}

export interface D1PreparedStatement {
  bind(...values: any[]): D1PreparedStatement;
  run(): Promise<D1Result>;
  first(): Promise<any>;
  all(): Promise<D1ResultSet>;
}

export interface D1Result {
  success: boolean;
  meta?: any;
  results?: any[];
}

export interface D1ResultSet {
  results: any[];
  success: boolean;
  meta?: any;
}

export interface Migration {
  version: string;
  description: string;
  up: string;
  down?: string;
}

export class MigrationManager {
  private migrations: Migration[] = [];

  constructor(private db: D1Database) {}

  addMigration(migration: Migration): void {
    this.migrations.push(migration);
  }

  async runMigrations(): Promise<void> {
    // Create migrations table if it doesn't exist
    await this.db.prepare(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version TEXT PRIMARY KEY,
        applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();

    // Get applied migrations
    const appliedResult = await this.db.prepare(
      'SELECT version FROM schema_migrations ORDER BY version'
    ).all();
    
    const appliedVersions = new Set(appliedResult.results?.map((row: any) => row.version) || []);

    // Run pending migrations
    for (const migration of this.migrations) {
      if (!appliedVersions.has(migration.version)) {
        console.log(`Running migration: ${migration.version} - ${migration.description}`);
        
        try {
          // Execute migration
          await this.db.prepare(migration.up).run();
          
          // Mark as applied
          await this.db.prepare(
            'INSERT INTO schema_migrations (version) VALUES (?)'
          ).bind(migration.version).run();
          
          console.log(`Migration ${migration.version} completed successfully`);
        } catch (error) {
          console.error(`Migration ${migration.version} failed:`, error);
          throw error;
        }
      }
    }
  }

  async resetDatabase(): Promise<void> {
    console.log('Resetting database...');
    
    // Drop all tables in reverse dependency order
    const tables = [
      'schema_migrations',
      'system_settings',
      'subjects',
      'users'
    ];

    for (const table of tables) {
      try {
        await this.db.prepare(`DROP TABLE IF EXISTS ${table}`).run();
        console.log(`Dropped table: ${table}`);
      } catch (error) {
        console.warn(`Failed to drop table ${table}:`, error);
      }
    }

    // Clear migration records
    this.migrations = [];
  }

  async checkAndRecreate(): Promise<void> {
    // Check if tables exist and have correct schema
    const tables = ['users', 'subjects', 'system_settings'];
    
    for (const table of tables) {
      try {
        const result = await this.db.prepare(`PRAGMA table_info(${table})`).all();
        
        if (!result.results || result.results.length === 0) {
          console.log(`Table ${table} missing, will recreate`);
          await this.resetDatabase();
          await this.runMigrations();
          return;
        }
      } catch (error) {
        console.log(`Error checking table ${table}, recreating database:`, error);
        await this.resetDatabase();
        await this.runMigrations();
        return;
      }
    }
  }
}
