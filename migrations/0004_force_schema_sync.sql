-- 1. Users Table (Force Recreate to ensure password_hash exists)
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'student',
    class_level TEXT,
    created_at INTEGER DEFAULT (unixepoch())
);

-- 2. Content Tables (Safe Creates)
CREATE TABLE IF NOT EXISTS classes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS subjects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    class_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    group_type TEXT DEFAULT 'common',
    icon TEXT,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS chapters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS materials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chapter_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    content_url TEXT NOT NULL,
    FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS mcqs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chapter_id INTEGER NOT NULL,
    question TEXT NOT NULL,
    options TEXT NOT NULL,
    correct_index INTEGER NOT NULL,
    explanation TEXT,
    FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE
);

-- 3. Ensure Basic Class Data Exists (Idempotent)
INSERT INTO classes (name, slug) VALUES ('Class 9 (SSC)', 'class-9') ON CONFLICT(slug) DO NOTHING;
INSERT INTO classes (name, slug) VALUES ('Class 10 (SSC)', 'class-10') ON CONFLICT(slug) DO NOTHING;
INSERT INTO classes (name, slug) VALUES ('HSC 1st Year', 'hsc-1') ON CONFLICT(slug) DO NOTHING;
INSERT INTO classes (name, slug) VALUES ('HSC 2nd Year', 'hsc-2') ON CONFLICT(slug) DO NOTHING;
