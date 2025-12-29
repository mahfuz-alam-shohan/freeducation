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
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'approved', 'published')),
  title TEXT NOT NULL,
  description TEXT,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  year INTEGER,
  board_university TEXT,
  owner_id TEXT,
  created_by TEXT,
  updated_by TEXT,
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

-- Question banks and assessment entities.
CREATE TABLE IF NOT EXISTS question_banks (
  id TEXT PRIMARY KEY,
  release_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL CHECK (status IN ('draft', 'active', 'archived')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (release_id) REFERENCES curriculum_releases(id)
);

CREATE TABLE IF NOT EXISTS scoring_rules (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  rule_type TEXT NOT NULL CHECK (rule_type IN ('standard', 'negative_marking', 'partial_credit')),
  config_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS question_sets (
  content_item_id TEXT PRIMARY KEY,
  bank_id TEXT NOT NULL,
  scoring_rule_id TEXT,
  default_time_limit_seconds INTEGER,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (content_item_id) REFERENCES content_items(id),
  FOREIGN KEY (bank_id) REFERENCES question_banks(id),
  FOREIGN KEY (scoring_rule_id) REFERENCES scoring_rules(id)
);

CREATE TABLE IF NOT EXISTS question_set_time_limits (
  id TEXT PRIMARY KEY,
  question_set_id TEXT NOT NULL,
  applies_to TEXT NOT NULL CHECK (applies_to IN ('practice', 'exam', 'assignment')),
  time_limit_seconds INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (question_set_id) REFERENCES question_sets(content_item_id)
);

CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,
  question_set_id TEXT NOT NULL,
  lesson_id TEXT,
  outcome_id TEXT,
  prompt TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('single_choice', 'multiple_choice', 'true_false', 'short_answer')),
  explanation TEXT,
  points REAL NOT NULL DEFAULT 1,
  sequence INTEGER NOT NULL,
  answer_key TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (question_set_id) REFERENCES question_sets(content_item_id),
  FOREIGN KEY (lesson_id) REFERENCES content_items(id),
  FOREIGN KEY (outcome_id) REFERENCES outcomes(id)
);

CREATE TABLE IF NOT EXISTS question_choices (
  id TEXT PRIMARY KEY,
  question_id TEXT NOT NULL,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  is_correct INTEGER NOT NULL DEFAULT 0,
  sequence INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (question_id) REFERENCES questions(id)
);

CREATE TABLE IF NOT EXISTS practice_tests (
  id TEXT PRIMARY KEY,
  release_id TEXT NOT NULL,
  title TEXT NOT NULL,
  filters_json TEXT NOT NULL,
  scoring_rule_id TEXT,
  time_limit_seconds INTEGER,
  question_count INTEGER NOT NULL,
  created_by TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (release_id) REFERENCES curriculum_releases(id),
  FOREIGN KEY (scoring_rule_id) REFERENCES scoring_rules(id)
);

CREATE TABLE IF NOT EXISTS practice_test_questions (
  practice_test_id TEXT NOT NULL,
  question_id TEXT NOT NULL,
  sequence INTEGER NOT NULL,
  points_override REAL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (practice_test_id, question_id),
  FOREIGN KEY (practice_test_id) REFERENCES practice_tests(id),
  FOREIGN KEY (question_id) REFERENCES questions(id)
);

CREATE TABLE IF NOT EXISTS practice_test_attempts (
  id TEXT PRIMARY KEY,
  practice_test_id TEXT NOT NULL,
  user_id TEXT,
  status TEXT NOT NULL CHECK (status IN ('in_progress', 'submitted', 'expired')),
  started_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  submitted_at TEXT,
  score REAL,
  max_score REAL,
  time_limit_seconds INTEGER,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (practice_test_id) REFERENCES practice_tests(id)
);

CREATE TABLE IF NOT EXISTS practice_test_attempt_answers (
  attempt_id TEXT NOT NULL,
  question_id TEXT NOT NULL,
  selected_choice_ids TEXT,
  answer_text TEXT,
  is_correct INTEGER,
  awarded_points REAL,
  answered_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (attempt_id, question_id),
  FOREIGN KEY (attempt_id) REFERENCES practice_test_attempts(id),
  FOREIGN KEY (question_id) REFERENCES questions(id)
);

-- User models and learner progress (future auth integration planned via external identities).
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  user_type TEXT NOT NULL CHECK (user_type IN ('student', 'teacher')),
  display_name TEXT NOT NULL,
  email TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  last_login_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Maps users to external auth providers (e.g. OAuth, SSO). No auth logic implemented yet.
CREATE TABLE IF NOT EXISTS user_auth_identities (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  provider TEXT NOT NULL,
  provider_subject TEXT NOT NULL,
  email_verified INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (provider, provider_subject),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS student_profiles (
  user_id TEXT PRIMARY KEY,
  grade_id TEXT,
  enrollment_year INTEGER,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (grade_id) REFERENCES grades(id)
);

CREATE TABLE IF NOT EXISTS teacher_profiles (
  user_id TEXT PRIMARY KEY,
  organization TEXT,
  region TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS lesson_progress (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('not_started', 'in_progress', 'completed')),
  started_at TEXT,
  completed_at TEXT,
  last_viewed_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, lesson_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (lesson_id) REFERENCES content_items(id)
);

CREATE TABLE IF NOT EXISTS question_set_attempts (
  id TEXT PRIMARY KEY,
  question_set_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('in_progress', 'submitted', 'expired')),
  started_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  submitted_at TEXT,
  score REAL,
  max_score REAL,
  time_limit_seconds INTEGER,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (question_set_id) REFERENCES question_sets(content_item_id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS question_set_attempt_answers (
  attempt_id TEXT NOT NULL,
  question_id TEXT NOT NULL,
  selected_choice_ids TEXT,
  answer_text TEXT,
  is_correct INTEGER,
  awarded_points REAL,
  answered_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (attempt_id, question_id),
  FOREIGN KEY (attempt_id) REFERENCES question_set_attempts(id),
  FOREIGN KEY (question_id) REFERENCES questions(id)
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

-- Admin roles and ownership/audit tracking.
CREATE TABLE IF NOT EXISTS user_roles (
  user_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'content_admin', 'coordinator', 'reviewer')),
  assigned_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, role)
);

CREATE TABLE IF NOT EXISTS content_item_audit_logs (
  id TEXT PRIMARY KEY,
  content_item_id TEXT NOT NULL,
  action TEXT NOT NULL,
  actor_id TEXT,
  from_status TEXT CHECK (from_status IN ('draft', 'review', 'approved', 'published')),
  to_status TEXT CHECK (to_status IN ('draft', 'review', 'approved', 'published')),
  details_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (content_item_id) REFERENCES content_items(id)
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
CREATE INDEX IF NOT EXISTS idx_content_items_status ON content_items(status);
CREATE INDEX IF NOT EXISTS idx_content_items_owner ON content_items(owner_id);
CREATE INDEX IF NOT EXISTS idx_content_tags_name ON content_tags(name);
CREATE INDEX IF NOT EXISTS idx_content_item_tags_tag ON content_item_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_lesson_notes_note ON lesson_notes(note_id);
CREATE INDEX IF NOT EXISTS idx_lesson_question_sets_qs ON lesson_question_sets(question_set_id);
CREATE INDEX IF NOT EXISTS idx_question_banks_release ON question_banks(release_id);
CREATE INDEX IF NOT EXISTS idx_question_sets_bank ON question_sets(bank_id);
CREATE INDEX IF NOT EXISTS idx_question_sets_rule ON question_sets(scoring_rule_id);
CREATE INDEX IF NOT EXISTS idx_question_time_limits_set ON question_set_time_limits(question_set_id);
CREATE INDEX IF NOT EXISTS idx_questions_set ON questions(question_set_id);
CREATE INDEX IF NOT EXISTS idx_questions_lesson ON questions(lesson_id);
CREATE INDEX IF NOT EXISTS idx_questions_outcome ON questions(outcome_id);
CREATE INDEX IF NOT EXISTS idx_question_choices_question ON question_choices(question_id);
CREATE INDEX IF NOT EXISTS idx_practice_tests_release ON practice_tests(release_id);
CREATE INDEX IF NOT EXISTS idx_practice_tests_rule ON practice_tests(scoring_rule_id);
CREATE INDEX IF NOT EXISTS idx_practice_test_questions_test ON practice_test_questions(practice_test_id);
CREATE INDEX IF NOT EXISTS idx_practice_test_attempts_test ON practice_test_attempts(practice_test_id);
CREATE INDEX IF NOT EXISTS idx_practice_test_attempts_user ON practice_test_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_practice_test_attempt_answers_attempt ON practice_test_attempt_answers(attempt_id);
CREATE INDEX IF NOT EXISTS idx_users_type ON users(user_type);
CREATE INDEX IF NOT EXISTS idx_user_auth_provider ON user_auth_identities(provider);
CREATE INDEX IF NOT EXISTS idx_user_auth_user ON user_auth_identities(user_id);
CREATE INDEX IF NOT EXISTS idx_student_profiles_grade ON student_profiles(grade_id);
CREATE INDEX IF NOT EXISTS idx_teacher_profiles_region ON teacher_profiles(region);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user ON lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_lesson ON lesson_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_question_set_attempts_set ON question_set_attempts(question_set_id);
CREATE INDEX IF NOT EXISTS idx_question_set_attempts_user ON question_set_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_question_set_attempt_answers_attempt ON question_set_attempt_answers(attempt_id);
CREATE INDEX IF NOT EXISTS idx_overrides_entity ON curriculum_overrides(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_overrides_release ON curriculum_overrides(release_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);
CREATE INDEX IF NOT EXISTS idx_content_item_audit_logs_item ON content_item_audit_logs(content_item_id);
CREATE INDEX IF NOT EXISTS idx_content_items_release_status_updated_at ON content_items(release_id, status, updated_at);
CREATE INDEX IF NOT EXISTS idx_content_items_release_type_year_chapter_id ON content_items(release_id, type, year, chapter_id);
CREATE INDEX IF NOT EXISTS idx_chapters_subject_release_id ON chapters(subject_id, release_id);
CREATE INDEX IF NOT EXISTS idx_subjects_grade_release_id ON subjects(grade_id, release_id);
CREATE INDEX IF NOT EXISTS idx_lesson_question_sets_lesson_id_question_set_id ON lesson_question_sets(lesson_id, question_set_id);
