-- Users: Stores both Students and Admins
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL, -- In real app, hash this!
    name TEXT NOT NULL,
    role TEXT DEFAULT 'student', -- 'admin' or 'student'
    class_level TEXT,
    created_at INTEGER DEFAULT (unixepoch())
);

-- Classes: Class 9, 10, HSC
CREATE TABLE IF NOT EXISTS classes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL
);

-- Subjects: Physics, Bangla (Linked to Class)
CREATE TABLE IF NOT EXISTS subjects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    class_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    group_type TEXT DEFAULT 'common', -- science, arts, commerce, common
    icon TEXT,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
);

-- Chapters: Vector, Motion (Linked to Subject)
CREATE TABLE IF NOT EXISTS chapters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

-- Materials: PDFs, Video Links
CREATE TABLE IF NOT EXISTS materials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chapter_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    type TEXT NOT NULL, -- 'pdf', 'video', 'note'
    content_url TEXT NOT NULL, -- R2 key or YouTube Link
    FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE
);

-- MCQs: Question Bank
CREATE TABLE IF NOT EXISTS mcqs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chapter_id INTEGER NOT NULL,
    question TEXT NOT NULL,
    options TEXT NOT NULL, -- JSON string ["A", "B", "C", "D"]
    correct_index INTEGER NOT NULL, -- 0, 1, 2, or 3
    explanation TEXT,
    FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE
);
