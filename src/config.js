export const APP_NAME = "Legacy";
export const SESSION_COOKIE = "freeducation_session";
export const MAX_BODY_SIZE = 10_000;

export const ADMIN_SCHEMA = {
  freeducation_admins: [
    ["id", "INTEGER PRIMARY KEY AUTOINCREMENT"],
    ["name", "TEXT NOT NULL"],
    ["email", "TEXT NOT NULL UNIQUE"],
    ["password_hash", "TEXT NOT NULL"],
    ["password_salt", "TEXT NOT NULL"],
    ["created_at", "TEXT NOT NULL"],
    ["updated_at", "TEXT NOT NULL"],
  ],
  freeducation_sessions: [
    ["id", "INTEGER PRIMARY KEY AUTOINCREMENT"],
    ["admin_id", "INTEGER NOT NULL"],
    ["token_hash", "TEXT NOT NULL UNIQUE"],
    ["created_at", "TEXT NOT NULL"],
    ["expires_at", "TEXT NOT NULL"],
  ],
};
