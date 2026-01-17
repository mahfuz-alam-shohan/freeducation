-- freeducation database schema for Cloudflare D1
-- Version: 1.0.0
-- This script will clean and rebuild the database structure

-- Drop all existing tables to ensure clean start
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS admins;
DROP TABLE IF EXISTS system_config;

-- Recreate tables with correct structure
-- System configuration table
CREATE TABLE IF NOT EXISTS system_config (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Admins table
CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    date_of_birth TEXT NOT NULL,
    is_active BOOLEAN DEFAULT 1,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Users table (for future use - students, teachers, etc.)
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_type TEXT NOT NULL DEFAULT 'student', -- student, teacher, writer, publisher
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    date_of_birth TEXT NOT NULL,
    is_active BOOLEAN DEFAULT 1,
    created_by_admin INTEGER,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by_admin) REFERENCES admins(id)
);

-- Sessions table for authentication
CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    user_type TEXT NOT NULL, -- 'admin' or 'user'
    expires_at TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES admins(id) ON DELETE CASCADE
);

-- Clean up any existing data and insert fresh configuration
DELETE FROM system_config;

-- Insert initial system configuration
INSERT INTO system_config (key, value) VALUES 
    ('admin_initialized', 'false'),
    ('app_version', '1.0.0'),
    ('maintenance_mode', 'false'),
    ('db_schema_version', '1.0.0'),
    ('last_cleaned', CURRENT_TIMESTAMP);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);
CREATE INDEX IF NOT EXISTS idx_admins_active ON admins(is_active);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_type ON users(user_type);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);

-- Database cleanup and repair complete
-- This ensures:
-- 1. All old/mismatched tables are removed
-- 2. All tables have correct structure
-- 3. All unwanted columns are eliminated
-- 4. Fresh start with clean data
-- 5. Proper indexes for performance
