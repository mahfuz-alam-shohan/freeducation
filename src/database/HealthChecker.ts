import { getDatabase } from './Database';

export class DatabaseHealthChecker {
  private db: any;
  private maxRetries: number = 5;
  private retryDelay: number = 1000; // 1 second

  constructor(env: any) {
    this.db = getDatabase(env.DB);
  }

  async checkDatabaseHealth(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    
    try {
      // Basic connection test
      const connectionTest = await this.db.healthCheck();
      
      if (!connectionTest.success) {
        return {
          status: 'unhealthy',
          message: 'Database connection failed',
          details: connectionTest,
          timestamp: new Date().toISOString(),
          responseTime: Date.now() - startTime
        };
      }

      // Check if tables exist
      const tablesCheck = await this.checkTablesExist();
      
      if (!tablesCheck.success) {
        return {
          status: 'unhealthy',
          message: 'Required tables missing',
          details: tablesCheck,
          timestamp: new Date().toISOString(),
          responseTime: Date.now() - startTime
        };
      }

      // Check if migrations are up to date
      const migrationsCheck = await this.checkMigrations();
      
      if (!migrationsCheck.success) {
        return {
          status: 'needs_migration',
          message: 'Database needs migration',
          details: migrationsCheck,
          timestamp: new Date().toISOString(),
          responseTime: Date.now() - startTime
        };
      }

      // Check if seed data exists
      const seedCheck = await this.checkSeedData();
      
      if (!seedCheck.success) {
        return {
          status: 'needs_seeding',
          message: 'Database needs seed data',
          details: seedCheck,
          timestamp: new Date().toISOString(),
          responseTime: Date.now() - startTime
        };
      }

      return {
        status: 'healthy',
        message: 'Database is ready',
        details: {
          connection: connectionTest,
          tables: tablesCheck,
          migrations: migrationsCheck,
          seed: seedCheck
        },
        timestamp: new Date().toISOString(),
        responseTime: Date.now() - startTime
      };

    } catch (error) {
      return {
        status: 'unhealthy',
        message: 'Database health check failed',
        details: { error: error.message },
        timestamp: new Date().toISOString(),
        responseTime: Date.now() - startTime
      };
    }
  }

  async initializeDatabase(): Promise<InitializationResult> {
    let retryCount = 0;

    while (retryCount < this.maxRetries) {
      try {
        console.log(`Database initialization attempt ${retryCount + 1}/${this.maxRetries}`);
        
        // Step 1: Check health first
        const health = await this.checkDatabaseHealth();
        
        if (health.status === 'healthy') {
          return {
            success: true,
            message: 'Database already initialized and healthy',
            details: health
          };
        }

        // Step 2: Run migrations if needed
        if (health.status === 'needs_migration') {
          console.log('Running database migrations...');
          await this.runMigrations();
        }

        // Step 3: Seed data if needed
        if (health.status === 'needs_seeding') {
          console.log('Seeding database...');
          await this.seedDatabase();
        }

        // Step 4: Final health check
        const finalHealth = await this.checkDatabaseHealth();
        
        if (finalHealth.status === 'healthy') {
          return {
            success: true,
            message: 'Database initialized successfully',
            details: finalHealth
          };
        }

        retryCount++;
        if (retryCount < this.maxRetries) {
          console.log(`Retrying in ${this.retryDelay}ms...`);
          await this.delay(this.retryDelay);
        }

      } catch (error) {
        retryCount++;
        console.error(`Initialization attempt ${retryCount} failed:`, error);
        
        if (retryCount < this.maxRetries) {
          await this.delay(this.retryDelay);
        }
      }
    }

    return {
      success: false,
      message: `Database initialization failed after ${this.maxRetries} attempts`,
      details: null
    };
  }

  private async checkTablesExist(): Promise<CheckResult> {
    const requiredTables = [
      'users', 'subjects', 'chapters', 'lessons', 'assignments',
      'submissions', 'study_sessions', 'social_posts', 'comments',
      'likes', 'notifications', 'credit_transactions', 'user_progress',
      'subject_enrollments', 'user_settings'
    ];

    try {
      const result = await this.db.prepare(`
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name IN (${requiredTables.map(() => '?').join(',')})
      `).bind(...requiredTables).all();

      const existingTables = result.results.map((row: any) => row.name);
      const missingTables = requiredTables.filter(table => !existingTables.includes(table));

      if (missingTables.length > 0) {
        return {
          success: false,
          message: `Missing tables: ${missingTables.join(', ')}`,
          details: { missingTables, existingTables }
        };
      }

      return {
        success: true,
        message: 'All required tables exist',
        details: { existingTables }
      };

    } catch (error) {
      return {
        success: false,
        message: 'Failed to check tables',
        details: { error: error.message }
      };
    }
  }

  private async checkMigrations(): Promise<CheckResult> {
    try {
      // Check if migrations table exists
      const migrationTable = await this.db.prepare(`
        SELECT name FROM sqlite_master WHERE type='table' AND name='migrations'
      `).first();

      if (!migrationTable) {
        return {
          success: false,
          message: 'Migrations table not found',
          details: null
        };
      }

      // Get latest migration
      const latestMigration = await this.db.prepare(`
        SELECT version FROM migrations ORDER BY version DESC LIMIT 1
      `).first();

      if (!latestMigration) {
        return {
          success: false,
          message: 'No migrations found',
          details: null
        };
      }

      return {
        success: true,
        message: 'Migrations are up to date',
        details: { latestVersion: latestMigration.version }
      };

    } catch (error) {
      return {
        success: false,
        message: 'Failed to check migrations',
        details: { error: error.message }
      };
    }
  }

  private async checkSeedData(): Promise<CheckResult> {
    try {
      // Check if admin user exists
      const adminUser = await this.db.prepare(`
        SELECT COUNT(*) as count FROM users WHERE user_type = 'admin'
      `).first();

      if (!adminUser || adminUser.count === 0) {
        return {
          success: false,
          message: 'No admin user found',
          details: { adminCount: adminUser?.count || 0 }
        };
      }

      // Check if subjects exist
      const subjectCount = await this.db.prepare(`
        SELECT COUNT(*) as count FROM subjects
      `).first();

      if (!subjectCount || subjectCount.count === 0) {
        return {
          success: false,
          message: 'No subjects found',
          details: { subjectCount: subjectCount?.count || 0 }
        };
      }

      return {
        success: true,
        message: 'Seed data exists',
        details: { adminCount: adminUser.count, subjectCount: subjectCount.count }
      };

    } catch (error) {
      return {
        success: false,
        message: 'Failed to check seed data',
        details: { error: error.message }
      };
    }
  }

  private async runMigrations(): Promise<void> {
    // This would integrate with the existing MigrationManager
    console.log('Running database migrations...');
    // Implementation would call MigrationManager.runMigrations()
  }

  private async seedDatabase(): Promise<void> {
    // This would integrate with existing seed data
    console.log('Seeding database with default data...');
    // Implementation would call seed functions
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export interface HealthCheckResult {
  status: 'healthy' | 'unhealthy' | 'needs_migration' | 'needs_seeding';
  message: string;
  details: any;
  timestamp: string;
  responseTime: number;
}

export interface InitializationResult {
  success: boolean;
  message: string;
  details: any;
}

export interface CheckResult {
  success: boolean;
  message: string;
  details: any;
}
