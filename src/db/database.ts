import { drizzle } from 'drizzle-orm/d1';

export interface Database {
  query: (sql: string, params?: any[]) => Promise<any>;
  batch: (queries: Array<{sql: string, params?: any[]}>) => Promise<any[]>;
}

export class DatabaseManager {
  private db: D1Database;
  private drizzle: any;

  constructor(d1Database: D1Database) {
    this.db = d1Database;
    this.drizzle = drizzle(d1Database);
  }

  async query(sql: string, params: any[] = []): Promise<any> {
    try {
      const stmt = this.db.prepare(sql);
      if (params.length > 0) {
        return await stmt.bind(...params).all();
      }
      return await stmt.all();
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  async run(sql: string, params: any[] = []): Promise<any> {
    try {
      const stmt = this.db.prepare(sql);
      if (params.length > 0) {
        return await stmt.bind(...params).run();
      }
      return await stmt.run();
    } catch (error) {
      console.error('Database run error:', error);
      throw error;
    }
  }

  async batch(queries: Array<{sql: string, params?: any[]}>): Promise<any[]> {
    try {
      const statements = queries.map(q => {
        const stmt = this.db.prepare(q.sql);
        return q.params && q.params.length > 0 ? stmt.bind(...q.params) : stmt;
      });
      return await this.db.batch(statements);
    } catch (error) {
      console.error('Database batch error:', error);
      throw error;
    }
  }

  getDrizzle() {
    return this.drizzle;
  }

  getD1() {
    return this.db;
  }
}
