-- Curriculum core entities and versioned releases
CREATE TABLE IF NOT EXISTS curriculum_releases (
  id TEXT PRIMARY KEY,
  version TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL CHECK (status IN ('draft', 'active', 'archived')),
  released_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS grades (
  id TEXT PRIMARY KEY,
  release_id TEXT NOT NULL,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  sequence INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (release_id) REFERENCES curriculum_releases(id)
);

CREATE TABLE IF NOT EXISTS subjects (
  id TEXT PRIMARY KEY,
  release_id TEXT NOT NULL,
  grade_id TEXT NOT NULL,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  sequence INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (release_id) REFERENCES curriculum_releases(id),
  FOREIGN KEY (grade_id) REFERENCES grades(id)
);

CREATE TABLE IF NOT EXISTS chapters (
  id TEXT PRIMARY KEY,
  release_id TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  sequence INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (release_id) REFERENCES curriculum_releases(id),
  FOREIGN KEY (subject_id) REFERENCES subjects(id)
);

CREATE TABLE IF NOT EXISTS outcomes (
  id TEXT PRIMARY KEY,
  release_id TEXT NOT NULL,
  chapter_id TEXT NOT NULL,
  code TEXT NOT NULL,
  description TEXT NOT NULL,
  sequence INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (release_id) REFERENCES curriculum_releases(id),
  FOREIGN KEY (chapter_id) REFERENCES chapters(id)
);

-- Content items (lessons, notes, question sets, etc.) with shared metadata.
CREATE TABLE IF NOT EXISTS content_items (
  id TEXT PRIMARY KEY,
  release_id TEXT NOT NULL,
  chapter_id TEXT,
  outcome_id TEXT,
  type TEXT NOT NULL CHECK (type IN ('lesson', 'note', 'question_set', 'resource')),
  title TEXT NOT NULL,
  description TEXT,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  year INTEGER,
  board_university TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (release_id) REFERENCES curriculum_releases(id),
  FOREIGN KEY (chapter_id) REFERENCES chapters(id),
  FOREIGN KEY (outcome_id) REFERENCES outcomes(id)
);

CREATE TABLE IF NOT EXISTS content_tags (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS content_item_tags (
  content_item_id TEXT NOT NULL,
  tag_id TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (content_item_id, tag_id),
  FOREIGN KEY (content_item_id) REFERENCES content_items(id),
  FOREIGN KEY (tag_id) REFERENCES content_tags(id)
);

-- Relationship tables linking lessons to notes and question sets.
CREATE TABLE IF NOT EXISTS lesson_notes (
  lesson_id TEXT NOT NULL,
  note_id TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (lesson_id, note_id),
  FOREIGN KEY (lesson_id) REFERENCES content_items(id),
  FOREIGN KEY (note_id) REFERENCES content_items(id)
);

CREATE TABLE IF NOT EXISTS lesson_question_sets (
  lesson_id TEXT NOT NULL,
  question_set_id TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (lesson_id, question_set_id),
  FOREIGN KEY (lesson_id) REFERENCES content_items(id),
  FOREIGN KEY (question_set_id) REFERENCES content_items(id)
);

-- Admin overrides: non-destructive edits layered on top of baseline records.
-- override_data stores partial updates (e.g. {"name": "New Name"}).
CREATE TABLE IF NOT EXISTS curriculum_overrides (
  id TEXT PRIMARY KEY,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('grade', 'subject', 'chapter', 'outcome')),
  entity_id TEXT NOT NULL,
  release_id TEXT NOT NULL,
  override_data TEXT NOT NULL,
  reason TEXT,
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (release_id) REFERENCES curriculum_releases(id)
);

CREATE INDEX IF NOT EXISTS idx_grades_release ON grades(release_id);
CREATE INDEX IF NOT EXISTS idx_subjects_grade ON subjects(grade_id);
CREATE INDEX IF NOT EXISTS idx_subjects_release ON subjects(release_id);
CREATE INDEX IF NOT EXISTS idx_chapters_subject ON chapters(subject_id);
CREATE INDEX IF NOT EXISTS idx_chapters_release ON chapters(release_id);
CREATE INDEX IF NOT EXISTS idx_outcomes_chapter ON outcomes(chapter_id);
CREATE INDEX IF NOT EXISTS idx_outcomes_release ON outcomes(release_id);
CREATE INDEX IF NOT EXISTS idx_content_items_release ON content_items(release_id);
CREATE INDEX IF NOT EXISTS idx_content_items_chapter ON content_items(chapter_id);
CREATE INDEX IF NOT EXISTS idx_content_items_outcome ON content_items(outcome_id);
CREATE INDEX IF NOT EXISTS idx_content_items_type ON content_items(type);
CREATE INDEX IF NOT EXISTS idx_content_tags_name ON content_tags(name);
CREATE INDEX IF NOT EXISTS idx_content_item_tags_tag ON content_item_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_lesson_notes_note ON lesson_notes(note_id);
CREATE INDEX IF NOT EXISTS idx_lesson_question_sets_qs ON lesson_question_sets(question_set_id);
CREATE INDEX IF NOT EXISTS idx_overrides_entity ON curriculum_overrides(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_overrides_release ON curriculum_overrides(release_id);
