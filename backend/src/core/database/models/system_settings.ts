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

export interface SystemSetting {
  key: string;
  value: string;
  updated_at: string;
}

export class SystemSettingsModel {
  constructor(private db: D1Database) {}

  async get(key: string): Promise<string | null> {
    const result = await this.db.prepare(
      'SELECT value FROM system_settings WHERE key = ?'
    ).bind(key).first();

    return result?.value as string || null;
  }

  async set(key: string, value: string): Promise<void> {
    await this.db.prepare(`
      INSERT OR REPLACE INTO system_settings (key, value, updated_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
    `).bind(key, value).run();
  }

  async isAdminCreated(): Promise<boolean> {
    const value = await this.get('admin_created');
    return value === 'true';
  }

  async markAdminCreated(): Promise<void> {
    await this.set('admin_created', 'true');
  }
}
