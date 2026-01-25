// Cloudflare Workers D1 Database interface
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
