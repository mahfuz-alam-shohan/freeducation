CREATE TABLE IF NOT EXISTS subjects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  template_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (template_id) REFERENCES module_templates(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_subjects_template ON subjects(template_id);
CREATE INDEX IF NOT EXISTS idx_subjects_active ON subjects(is_active);

CREATE TABLE IF NOT EXISTS subject_node_overrides (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  subject_id INTEGER NOT NULL,
  node_id INTEGER NOT NULL,
  display_name TEXT,
  image_key TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(subject_id, node_id),
  FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
  FOREIGN KEY (node_id) REFERENCES module_nodes(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_subject_node_subject ON subject_node_overrides(subject_id);

CREATE TABLE IF NOT EXISTS subject_chapters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  subject_id INTEGER NOT NULL,
  node_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  image_key TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
  FOREIGN KEY (node_id) REFERENCES module_nodes(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_subject_chapters_subject ON subject_chapters(subject_id);
CREATE INDEX IF NOT EXISTS idx_subject_chapters_node ON subject_chapters(node_id);

CREATE TABLE IF NOT EXISTS subject_short_notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  chapter_id INTEGER NOT NULL,
  note TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (chapter_id) REFERENCES subject_chapters(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_subject_notes_chapter ON subject_short_notes(chapter_id);

CREATE TABLE IF NOT EXISTS subject_videos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  chapter_id INTEGER NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('link', 'upload')),
  title TEXT NOT NULL,
  url TEXT,
  author TEXT,
  file_key TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (chapter_id) REFERENCES subject_chapters(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_subject_videos_chapter ON subject_videos(chapter_id);

CREATE TABLE IF NOT EXISTS subject_question_type_labels (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  subject_id INTEGER NOT NULL,
  type_key TEXT NOT NULL CHECK (type_key IN ('CQ', 'MCQ')),
  display_name TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(subject_id, type_key),
  FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS subject_cq_section_labels (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  subject_id INTEGER NOT NULL,
  section_key TEXT NOT NULL CHECK (section_key IN ('KNOWLEDGE', 'TWO', 'THREE', 'FOUR')),
  display_name TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(subject_id, section_key),
  FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS subject_questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  chapter_id INTEGER NOT NULL,
  type_key TEXT NOT NULL CHECK (type_key IN ('CQ', 'MCQ')),
  section_key TEXT,
  question_text TEXT NOT NULL,
  answer_text TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (chapter_id) REFERENCES subject_chapters(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_subject_questions_chapter ON subject_questions(chapter_id);
