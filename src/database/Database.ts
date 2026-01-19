import { User, Subject, Assignment } from './models';
import { DEFAULT_ADMIN, DEFAULT_SUBJECTS } from './seeds';
import { runMigrations } from './migrations';

// Cloudflare D1 database type
interface D1Database {
  prepare(sql: string): any;
  exec(sql: string): any;
}

export class Database {
  private db: D1Database;
  private isInitialized = false;

  constructor(db: D1Database) {
    this.db = db;
  }

  /**
   * Initialize database - runs migrations and seeds
   */
  async initialize(): Promise<{ success: boolean; message: string }> {
    if (this.isInitialized) {
      return { success: true, message: 'Database already initialized' };
    }

    try {
      console.log('🚀 Initializing database...');
      
      // Step 1: Run migrations
      await runMigrations(this.db);
      
      // Step 2: Seed initial data
      await this.seedInitialData();
      
      console.log('✅ Database initialized successfully');
      this.isInitialized = true;
      
      return { success: true, message: 'Database initialized successfully' };
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      return { 
        success: false, 
        message: `Database initialization failed: ${(error as Error).message}` 
      };
    }
  }

  /**
   * Get database instance (auto-initializes if needed)
   */
  async getInstance(): Promise<D1Database> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    return this.db;
  }

  /**
   * Seed initial data
   */
  private async seedInitialData(): Promise<void> {
    try {
      console.log('🌱 Seeding initial data...');
      
      // Seed subjects
      await this.seedSubjects();
      
      // Seed admin user
      await this.seedAdminUser();
      
      console.log('✅ Initial data seeded successfully');
    } catch (error) {
      console.error('⚠️ Seeding warning:', error);
      // Don't fail initialization for seeding issues
    }
  }

  /**
   * Seed subjects data
   */
  private async seedSubjects(): Promise<void> {
    try {
      // Check if subjects already exist
      const result = await this.db.prepare('SELECT COUNT(*) as count FROM subjects').first();
      const subjectCount = result?.count || 0;
      
      if (subjectCount === 0) {
        console.log('📚 Inserting default subjects...');
        
        for (const subject of DEFAULT_SUBJECTS) {
          await this.db.prepare(`
            INSERT INTO subjects (name, code, description, category, class_level, group, icon, color, is_active, sort_order)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(
            subject.name,
            subject.code,
            subject.description,
            subject.category,
            subject.class_level,
            subject.group,
            subject.icon,
            subject.color,
            subject.is_active ? 1 : 0,
            subject.sort_order
          ).run();
        }

        console.log(`✅ Inserted ${DEFAULT_SUBJECTS.length} default subjects`);
      }
    } catch (error) {
      console.error('Error seeding subjects:', error);
    }
  }

  /**
   * Seed admin user
   */
  private async seedAdminUser(): Promise<void> {
    try {
      // Check if users already exist
      const result = await this.db.prepare('SELECT COUNT(*) as count FROM users').first();
      const userCount = result?.count || 0;
      
      if (userCount === 0) {
        console.log('👤 Creating default admin user...');
        
        const passwordHash = await this.hashPassword(DEFAULT_ADMIN.password);
        
        await this.db.prepare(`
          INSERT INTO users (username, email, password_hash, full_name, user_type, is_active, email_verified)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).bind(
          DEFAULT_ADMIN.username,
          DEFAULT_ADMIN.email,
          passwordHash,
          DEFAULT_ADMIN.full_name,
          DEFAULT_ADMIN.user_type,
          1, // is_active
          1  // email_verified
        ).run();

        console.log('✅ Default admin user created');
        console.log('⚠️ Please change default admin credentials immediately!');
        console.log('   Username: admin');
        console.log('   Password: admin123');
      }
    } catch (error) {
      console.error('Error seeding admin user:', error);
    }
  }

  /**
   * Simple password hashing (for development - replace with bcrypt in production)
   */
  private async hashPassword(password: string): Promise<string> {
    // This is a simple hash for development
    // In production, use proper password hashing
    const encoder = new TextEncoder();
    const data = encoder.encode(password + 'freeducation-salt');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Health check - verify database is working
   */
  async healthCheck(): Promise<{ healthy: boolean; message: string }> {
    try {
      const result = await this.db.prepare('SELECT 1 as test').first();
      if (result?.test === 1) {
        return { healthy: true, message: 'Database is healthy' };
      } else {
        return { healthy: false, message: 'Database query failed' };
      }
    } catch (error) {
      return { 
        healthy: false, 
        message: `Database health check failed: ${(error as Error).message}` 
      };
    }
  }

  /**
   * Get database statistics
   */
  async getStats(): Promise<Record<string, number>> {
    try {
      const stats: Record<string, number> = {};
      
      // Get table counts
      const tables = ['users', 'subjects', 'chapters', 'lessons', 'assignments', 'social_posts'];
      
      for (const table of tables) {
        const result = await this.db.prepare(`SELECT COUNT(*) as count FROM ${table}`).first();
        stats[`${table}_count`] = result?.count || 0;
      }
      
      return stats;
    } catch (error) {
      console.error('Error getting database stats:', error);
      return {};
    }
  }

  /**
   * User operations
   */
  async createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at' | 'password_hash'>, password: string): Promise<User | null> {
    const passwordHash = await this.hashPassword(password);
    
    const result = await this.db.prepare(`
      INSERT INTO users (username, email, password_hash, full_name, user_type, is_active, email_verified, avatar_url, phone, date_of_birth, address, bio)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      userData.username,
      userData.email,
      passwordHash,
      userData.full_name,
      userData.user_type,
      userData.is_active ? 1 : 0,
      userData.email_verified ? 1 : 0,
      userData.avatar_url,
      userData.phone,
      userData.date_of_birth,
      userData.address,
      userData.bio
    ).run();

    return this.getUserById(result.meta.last_row_id);
  }

  async getUserById(id: number): Promise<User | null> {
    const result = await this.db.prepare('SELECT * FROM users WHERE id = ?').bind(id).first();
    return result || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const result = await this.db.prepare('SELECT * FROM users WHERE email = ?').bind(email).first();
    return result || null;
  }

  /**
   * Subject operations
   */
  async getSubjects(): Promise<Subject[]> {
    const result = await this.db.prepare('SELECT * FROM subjects WHERE is_active = 1 ORDER BY sort_order').all();
    return result.results || [];
  }

  async getSubjectById(id: number): Promise<Subject | null> {
    const result = await this.db.prepare('SELECT * FROM subjects WHERE id = ?').bind(id).first();
    return result || null;
  }

  async getSubjectByCode(code: string): Promise<Subject | null> {
    const result = await this.db.prepare('SELECT * FROM subjects WHERE code = ?').bind(code).first();
    return result || null;
  }
}

// Singleton instance
let databaseInstance: Database | null = null;

export function getDatabase(db: D1Database): Database {
  if (!databaseInstance) {
    databaseInstance = new Database(db);
  }
  return databaseInstance;
}
