ALTER TABLE subject_short_notes ADD COLUMN image_key TEXT;

CREATE TABLE IF NOT EXISTS subject_topics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  chapter_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  image_key TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (chapter_id) REFERENCES subject_chapters(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_subject_topics_chapter ON subject_topics(chapter_id);

CREATE TABLE IF NOT EXISTS subject_topic_notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  topic_id INTEGER NOT NULL,
  note TEXT NOT NULL,
  image_key TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (topic_id) REFERENCES subject_topics(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_subject_topic_notes_topic ON subject_topic_notes(topic_id);

CREATE TABLE IF NOT EXISTS subject_topic_videos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  topic_id INTEGER NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('link', 'upload')),
  title TEXT NOT NULL,
  url TEXT,
  author TEXT,
  file_key TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (topic_id) REFERENCES subject_topics(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_subject_topic_videos_topic ON subject_topic_videos(topic_id);

CREATE TABLE IF NOT EXISTS subject_topic_questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  topic_id INTEGER NOT NULL,
  type_key TEXT NOT NULL CHECK (type_key IN ('CQ', 'MCQ')),
  section_key TEXT,
  question_text TEXT NOT NULL,
  answer_text TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (topic_id) REFERENCES subject_topics(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_subject_topic_questions_topic ON subject_topic_questions(topic_id);
