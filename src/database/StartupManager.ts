import { DatabaseHealthChecker, InitializationResult } from './HealthChecker';
import { getDatabase } from './Database';

export class StartupManager {
  private healthChecker: DatabaseHealthChecker;
  private env: any;
  private maxRetries: number = 5;
  private retryDelay: number = 1000;

  constructor(env: any) {
    this.env = env;
    this.healthChecker = new DatabaseHealthChecker(env);
  }

  async initializeApplication(): Promise<StartupResult> {
    let retryCount = 0;

    while (retryCount < this.maxRetries) {
      try {
        console.log(`Database initialization attempt ${retryCount + 1}/${this.maxRetries}`);
        
        // Step 1: Check health first
        const health = await this.healthChecker.checkDatabaseHealth();
        
        if (health.status === 'unhealthy') {
          console.error('Database health check failed:', health.message);
          retryCount++;
          if (retryCount < this.maxRetries) {
            console.log(`Retrying in ${this.retryDelay}ms...`);
            await this.delay(this.retryDelay);
          }
          continue;
        }

        // Step 2: Check if admin exists
        const adminCheck = await this.checkAdminExists();
        
        if (!adminCheck.exists) {
          console.log('No admin found - system in setup mode');
          return {
            success: true,
            message: 'System ready for admin setup',
            stage: 'admin_setup_required',
            details: {
              database: health,
              adminExists: false,
              setupRequired: true
            }
          };
        }

        // Step 3: Run migrations if needed
        if (health.status === 'needs_migration') {
          console.log('Running database migrations...');
          await this.runMigrations();
        }

        // Step 4: Seed data if needed
        if (health.status === 'needs_seeding') {
          console.log('Seeding database...');
          await this.seedDatabase();
        }

        // Step 5: Final health check
        const finalHealth = await this.healthChecker.checkDatabaseHealth();
        
        if (finalHealth.status === 'healthy') {
          return {
            success: true,
            message: 'Application started successfully',
            stage: 'complete',
            details: {
              database: finalHealth,
              adminExists: true,
              setupRequired: false
            }
          };
        }

        retryCount++;
        if (retryCount < this.maxRetries) {
          console.log(`Retrying in ${this.retryDelay}ms...`);
          await this.delay(this.retryDelay);
        }

      } catch (error: any) {
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
      stage: 'error',
      details: null
    };
  }

  async checkAdminExists(): Promise<{ exists: boolean; count: number }> {
    try {
      const db = getDatabase(this.env.DB);
      const result = await db.prepare('SELECT COUNT(*) as count FROM users WHERE user_type = \'admin\'').first();
      
      return {
        exists: (result?.count || 0) > 0,
        count: result?.count || 0
      };
    } catch (error) {
      console.error('Admin check failed:', error);
      return { exists: false, count: 0 };
    }
  }

  private async verifyComponents(): Promise<ComponentCheckResult> {
    try {
      const db = getDatabase(this.env.DB);
      
      // Test database operations
      const testQuery = await db.prepare('SELECT 1 as test').first();
      
      if (!testQuery || testQuery.test !== 1) {
        return {
          success: false,
          message: 'Database query test failed',
          details: { testQuery }
        };
      }

      // Test database write operations
      const testWrite = await db.prepare(`
        CREATE TABLE IF NOT EXISTS startup_test (
          id INTEGER PRIMARY KEY,
          timestamp TEXT,
          test_value TEXT
        )
      `).run();

      await db.prepare(`
        INSERT INTO startup_test (timestamp, test_value) VALUES (?, ?)
      `).bind(new Date().toISOString(), 'startup_test').run();

      // Test database read operations
      const testRead = await db.prepare(`
        SELECT * FROM startup_test WHERE test_value = ?
      `).bind('startup_test').first();

      if (!testRead) {
        return {
          success: false,
          message: 'Database read/write test failed',
          details: { testRead }
        };
      }

      // Cleanup test table
      await db.prepare('DROP TABLE startup_test').run();

      return {
        success: true,
        message: 'All components verified',
        details: {
          database: 'operational',
          readWrite: 'working',
          timestamp: new Date().toISOString()
        }
      };

    } catch (error: any) {
      return {
        success: false,
        message: 'Component verification failed',
        details: { error: error.message || error }
      };
    }
  }

  async getHealthStatus(): Promise<any> {
    return await this.healthChecker.checkDatabaseHealth();
  }

  async forceReinitialization(): Promise<InitializationResult> {
    console.log('🔄 Forcing database reinitialization...');
    return await this.healthChecker.initializeDatabase();
  }

  private async runMigrations(): Promise<void> {
    console.log('Running database migrations...');
    // Implementation would call MigrationManager.runMigrations()
  }

  private async seedDatabase(): Promise<void> {
    console.log('Seeding database with default data...');
    // Implementation would call seed functions
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export interface StartupResult {
  success: boolean;
  message: string;
  stage: 'database' | 'admin_setup_required' | 'components' | 'health_check' | 'error' | 'complete';
  details: any;
}

export interface ComponentCheckResult {
  success: boolean;
  message: string;
  details: any;
}
