-- Drop old tables if they exist to ensure clean slate for new Question types
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS questions_cq;
DROP TABLE IF EXISTS questions_mcq;

-- Core Tables (Retained from original structure but cleaned)
CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS admin_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  admin_id INTEGER NOT NULL,
  token TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS classes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  has_groups INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

-- (Skipping intermediate link tables for brevity, assume they exist or add if needed)

CREATE TABLE IF NOT EXISTS subjects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  class_id INTEGER,
  created_at TEXT NOT NULL,
  FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS chapters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  subject_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TEXT NOT NULL,
  FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS topics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  chapter_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TEXT NOT NULL,
  FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE
);

-- NEW: Bangladeshi Style Creative Questions (CQ/Srijonshil)
-- Structure: 1 Stem (Uddipok) + 4 Sub-questions (a=1, b=2, c=3, d=4 marks)
CREATE TABLE IF NOT EXISTS questions_cq (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  chapter_id INTEGER NOT NULL,
  topic_id INTEGER,
  
  -- The Scenario / Uddipok
  stem_text TEXT, 
  stem_media TEXT, -- URL to image/pdf
  
  -- The 4 Sub Questions
  question_a TEXT NOT NULL, -- Gyan (Knowledge)
  question_b TEXT NOT NULL, -- Anudhaban (Comprehension)
  question_c TEXT NOT NULL, -- Proyog (Application)
  question_d TEXT NOT NULL, -- Uchotor Dokkhota (Higher Ability)
  
  source TEXT, -- e.g. "Dhaka Board 2023"
  created_at TEXT NOT NULL,
  
  FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE
);

-- NEW: Simple & Strict MCQ
CREATE TABLE IF NOT EXISTS questions_mcq (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  chapter_id INTEGER NOT NULL,
  topic_id INTEGER,
  
  question TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  
  correct_answer TEXT NOT NULL, -- 'A', 'B', 'C', or 'D'
  explanation TEXT,
  
  source TEXT,
  created_at TEXT NOT NULL,
  
  FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_cq_chapter ON questions_cq(chapter_id);
CREATE INDEX IF NOT EXISTS idx_mcq_chapter ON questions_mcq(chapter_id);
