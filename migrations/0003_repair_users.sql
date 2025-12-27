-- 1. Force cleanup of the potentially outdated table
DROP TABLE IF EXISTS users;

-- 2. Recreate the Users table with ALL required security columns
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,  -- Critical for security
    name TEXT NOT NULL,
    role TEXT DEFAULT 'student',  -- Critical for Admin vs Student logic
    class_level TEXT,
    created_at INTEGER DEFAULT (unixepoch())
);
