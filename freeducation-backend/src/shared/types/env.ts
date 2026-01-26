export interface Env {
  DB: D1Database;
  BUCKET?: R2Bucket;
  ADMIN_BOOTSTRAP_SECRET?: string;
  CORS_ORIGIN?: string;
  SESSION_TTL_DAYS?: string;
  SESSION_COOKIE_NAME?: string;
}
