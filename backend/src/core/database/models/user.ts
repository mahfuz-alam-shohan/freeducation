// D1 Database interface for Cloudflare Workers
interface D1Database {
  prepare(sql: string): D1PreparedStatement;
}

interface D1PreparedStatement {
  bind(...values: any[]): D1PreparedStatement;
  run(): Promise<D1Result>;
  first(): Promise<any>;
  all(): Promise<D1ResultSet>;
}

interface D1Result {
  success: boolean;
  meta?: any;
  results?: any[];
}

interface D1ResultSet {
  results: any[];
  success: boolean;
  meta?: any;
}

export interface User {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  role: 'admin' | 'teacher' | 'student';
  profile_picture_url?: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  email_verified: boolean;
  last_login_at?: string;
}

export interface CreateUserData {
  email: string;
  password: string;
  name: string;
  role?: 'admin' | 'teacher' | 'student';
  profile_picture_url?: string;
}

export class UserModel {
  constructor(private db: D1Database) {}

  async create(userData: CreateUserData): Promise<User> {
    const id = crypto.randomUUID();
    const password_hash = await this.hashPassword(userData.password);
    
    const result = await this.db.prepare(`
      INSERT INTO users (id, email, password_hash, name, role, profile_picture_url)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      userData.email,
      password_hash,
      userData.name,
      userData.role || 'student',
      userData.profile_picture_url || null
    ).run();

    if (!result.success) {
      throw new Error('Failed to create user');
    }

    return this.findById(id);
  }

  async findById(id: string): Promise<User> {
    const result = await this.db.prepare(
      'SELECT * FROM users WHERE id = ?'
    ).bind(id).first();

    return result as User;
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.db.prepare(
      'SELECT * FROM users WHERE email = ?'
    ).bind(email).first();

    return result as User || null;
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.db.prepare(
      'UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(id).run();
  }

  private async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    const passwordHash = await this.hashPassword(password);
    return passwordHash === hash;
  }
}
