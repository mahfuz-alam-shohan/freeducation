-- CLEANUP (Reset everything to ensure stability)
PRAGMA foreign_keys = OFF;
DROP TABLE IF EXISTS exam_questions;
DROP TABLE IF EXISTS exams;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS topics;
DROP TABLE IF EXISTS chapters;
DROP TABLE IF EXISTS subjects;
DROP TABLE IF EXISTS groups;
DROP TABLE IF EXISTS classes;
DROP TABLE IF EXISTS programs;
DROP TABLE IF EXISTS users;
PRAGMA foreign_keys = ON;

-- 1. AUTH
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    email TEXT UNIQUE NOT NULL, 
    password_hash TEXT NOT NULL, 
    name TEXT NOT NULL, 
    role TEXT DEFAULT 'student', -- 'admin' or 'student'
    created_at INTEGER DEFAULT (unixepoch())
);

-- 2. PROGRAMS (The "Connection" Layer)
-- Example: "SSC" (covers Class 9-10), "HSC" (covers Class 11-12)
CREATE TABLE programs (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    title TEXT NOT NULL UNIQUE, -- "SSC", "HSC", "JSC"
    slug TEXT UNIQUE NOT NULL
);

-- 3. CLASSES (Specific Years)
-- Example: "Class 9" belongs to "SSC"
CREATE TABLE classes (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    program_id INTEGER NOT NULL,
    title TEXT NOT NULL, -- "Class 9", "Class 10"
    FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE
);

-- 4. GROUPS (Streams)
-- Example: "Science", "Humanities", "Business Studies"
CREATE TABLE groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    title TEXT NOT NULL UNIQUE -- "Science", "Arts", "Commerce", "Common"
);

-- 5. SUBJECTS (The Core)
-- Linked to a PROGRAM (SSC) and a GROUP (Science). 
-- This means "SSC Physics" covers both Class 9 and 10.
CREATE TABLE subjects (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    program_id INTEGER NOT NULL,
    group_id INTEGER NOT NULL,
    title TEXT NOT NULL, -- "Physics", "Bangla 1st"
    code TEXT, -- "136"
    icon TEXT,
    FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
);

-- 6. CHAPTERS
CREATE TABLE chapters (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    subject_id INTEGER NOT NULL, 
    title TEXT NOT NULL, 
    sort_order INTEGER DEFAULT 0, 
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

-- 7. TOPICS (The "Micro" Unit for Exams)
CREATE TABLE topics (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    chapter_id INTEGER NOT NULL, 
    title TEXT NOT NULL, 
    FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE
);

-- 8. QUESTION BANK
CREATE TABLE questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    topic_id INTEGER NOT NULL, 
    type TEXT DEFAULT 'mcq', 
    question_text TEXT NOT NULL,
    options TEXT NOT NULL, -- JSON Array
    correct_answer TEXT NOT NULL, 
    explanation TEXT,
    difficulty TEXT DEFAULT 'medium',
    FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
);

-- 9. EXAMS
CREATE TABLE exams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    subject_id INTEGER NOT NULL,
    duration_minutes INTEGER DEFAULT 25,
    is_active BOOLEAN DEFAULT 1,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

CREATE TABLE exam_questions (
    exam_id INTEGER NOT NULL,
    question_id INTEGER NOT NULL,
    FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

-- SEED DATA (NCTB Defaults)
INSERT INTO programs (title, slug) VALUES ('SSC (9-10)', 'ssc'), ('HSC (11-12)', 'hsc');
INSERT INTO classes (program_id, title) SELECT id, 'Class 9' FROM programs WHERE slug='ssc';
INSERT INTO classes (program_id, title) SELECT id, 'Class 10' FROM programs WHERE slug='ssc';
INSERT INTO classes (program_id, title) SELECT id, '1st Year' FROM programs WHERE slug='hsc';
INSERT INTO classes (program_id, title) SELECT id, '2nd Year' FROM programs WHERE slug='hsc';
INSERT INTO groups (title) VALUES ('Science'), ('Humanities (Arts)'), ('Business Studies'), ('Common');
