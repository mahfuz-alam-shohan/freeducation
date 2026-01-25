import { MigrationManager, D1Database } from './migrations/migration_manager';
import { UserModel } from './models/user';
import { SystemSettingsModel } from './models/system_settings';

export class DatabaseManager {
  public migrationManager: MigrationManager;
  public users: UserModel;
  public systemSettings: SystemSettingsModel;

  constructor(private db: D1Database) {
    this.migrationManager = new MigrationManager(db);
    this.users = new UserModel(db);
    this.systemSettings = new SystemSettingsModel(db);
  }

  async initialize(): Promise<void> {
    console.log('Initializing database...');
    
    // Add initial migration
    const migrationSQL = await this.loadMigration('001_initial_schema.sql');
    this.migrationManager.addMigration({
      version: '001',
      description: 'Initial database schema',
      up: migrationSQL
    });

    // Check and recreate if needed
    await this.migrationManager.checkAndRecreate();
    
    // Run migrations
    await this.migrationManager.runMigrations();
    
    console.log('Database initialized successfully');
  }

  private async loadMigration(filename: string): Promise<string> {
    // In a real implementation, you'd load this from the file system
    // For now, we'll return the SQL inline
    return `
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'student',
        profile_picture_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT 1,
        email_verified BOOLEAN DEFAULT 0,
        last_login_at DATETIME
      );

      CREATE TABLE IF NOT EXISTS subjects (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        type TEXT NOT NULL,
        teacher_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT 1,
        FOREIGN KEY (teacher_id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS system_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      INSERT OR IGNORE INTO system_settings (key, value) VALUES 
        ('admin_created', 'false'),
        ('site_name', 'Freeducation'),
        ('maintenance_mode', 'false');
    `;
  }
}
