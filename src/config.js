export const APP_NAME = "Freeducation";
export const SESSION_COOKIE = "freeducation_session";
export const MAX_BODY_SIZE = 800_000;
export const SCHEMA_REVALIDATE_MS = 5 * 60 * 1000;
export const SESSION_CLEANUP_INTERVAL_MS = 60 * 1000;

export const ADMIN_SCHEMA = {
  freeducation_admins: [
    ["id", "INTEGER PRIMARY KEY AUTOINCREMENT"],
    ["name", "TEXT NOT NULL"],
    ["email", "TEXT NOT NULL UNIQUE"],
    ["password_hash", "TEXT NOT NULL"],
    ["password_salt", "TEXT NOT NULL"],
    ["date_of_birth", "TEXT NOT NULL DEFAULT ''"],
    ["gender", "TEXT NOT NULL DEFAULT ''"],
    ["user_type", "TEXT NOT NULL DEFAULT 'Administrator'"],
    ["avatar_key", "TEXT NOT NULL DEFAULT ''"],
    ["cover_key", "TEXT NOT NULL DEFAULT ''"],
    ["created_at", "TEXT NOT NULL"],
    ["updated_at", "TEXT NOT NULL"],
  ],
  freeducation_sessions: [
    ["id", "INTEGER PRIMARY KEY AUTOINCREMENT"],
    ["admin_id", "INTEGER NOT NULL"],
    ["token_hash", "TEXT NOT NULL UNIQUE"],
    ["device_label", "TEXT NOT NULL DEFAULT ''"],
    ["created_at", "TEXT NOT NULL"],
    ["expires_at", "TEXT NOT NULL"],
  ],
};
