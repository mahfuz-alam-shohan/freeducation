-- Drop existing tables to ensure a clean slate if needed (be careful in production)
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS resources;
DROP TABLE IF EXISTS users;

-- 1. Users Table: Stores admins and staff
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    full_name TEXT,
    role TEXT DEFAULT 'admin', -- 'super_admin', 'director', 'admin', 'moderator'
    created_at INTEGER DEFAULT (unixepoch())
);

-- 2. Resources Table: The books, videos, and tools for students
CREATE TABLE resources (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL, -- 'pdf', 'video', 'tool'
    category TEXT,      -- 'STEM', 'Language', 'Exam Prep'
    url TEXT,           -- External link or R2 key
    is_public BOOLEAN DEFAULT 1,
    created_by TEXT,
    created_at INTEGER DEFAULT (unixepoch()),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 3. Sessions Table: For secure login management
CREATE TABLE sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    expires_at INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Index for fast lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_resources_category ON resources(category);
