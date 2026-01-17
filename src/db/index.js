// Database utilities for Cloudflare D1
export class Database {
  constructor(db) {
    this.db = db;
  }

  async prepare(stmt) {
    return this.db.prepare(stmt);
  }

  async run(stmt, params = []) {
    return await this.db.prepare(stmt).bind(...params).run();
  }

  async get(stmt, params = []) {
    return await this.db.prepare(stmt).bind(...params).first();
  }

  async all(stmt, params = []) {
    return await this.db.prepare(stmt).bind(...params).all();
  }

  async batch(queries) {
    return await this.db.batch(queries);
  }
}

export function initializeDB(d1Database) {
  return new Database(d1Database);
}
