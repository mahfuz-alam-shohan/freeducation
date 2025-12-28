export interface Env {
  DB: D1Database;
}

export interface AdminSession {
  id: number;
  name: string;
  email: string;
}
