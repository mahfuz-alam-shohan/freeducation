import { appConfig } from "./config";

export interface Env {
  DB: D1Database;
  BUCKET: R2Bucket;
}

export interface User {
  id: number;
  email: string;
  role: "admin";
}

// --- AUTOMATIC SCHEMA SETUP ---
const SCHEMA_SQL = `
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  token_hash TEXT NOT NULL,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS classes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  has_groups INTEGER NOT NULL DEFAULT 0,
  is_merged INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS groups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  class_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS subjects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  class_id INTEGER NOT NULL,
  group_id INTEGER,
  name TEXT NOT NULL,
  FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
  FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS chapters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  subject_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  position INTEGER NOT NULL,
  FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS subchapters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  chapter_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  position INTEGER NOT NULL,
  FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS question_types (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  chapter_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS source_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS source_entities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  FOREIGN KEY (category_id) REFERENCES source_categories(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  chapter_id INTEGER NOT NULL,
  question_type_id INTEGER NOT NULL,
  source_entity_id INTEGER NOT NULL,
  source_year TEXT NOT NULL,
  prompt TEXT NOT NULL,
  image_url TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE,
  FOREIGN KEY (question_type_id) REFERENCES question_types(id) ON DELETE CASCADE,
  FOREIGN KEY (source_entity_id) REFERENCES source_entities(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS learning_materials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  subchapter_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  material_type TEXT NOT NULL,
  url TEXT NOT NULL,
  notes TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (subchapter_id) REFERENCES subchapters(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_subjects_class_id ON subjects(class_id);
CREATE INDEX IF NOT EXISTS idx_chapters_subject_id ON chapters(subject_id);
CREATE INDEX IF NOT EXISTS idx_subchapters_chapter_id ON subchapters(chapter_id);
CREATE INDEX IF NOT EXISTS idx_questions_chapter_id ON questions(chapter_id);
CREATE INDEX IF NOT EXISTS idx_questions_question_type_id ON questions(question_type_id);
CREATE INDEX IF NOT EXISTS idx_questions_source_entity_id ON questions(source_entity_id);

INSERT OR IGNORE INTO source_categories (name) VALUES
  ('Board Exam'),
  ('University Admission'),
  ('Top Colleges');
`;

export const setupDatabase = async (db: D1Database) => {
  console.log("Running DB Setup...");

  // 1. Remove comments to ensure clean splitting
  const cleanSQL = SCHEMA_SQL.replace(/--.*$/gm, '');

  // 2. Split by semicolon
  const statements = cleanSQL
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  // 3. Execute sequentially (One by One)
  // This avoids the 'aggregateD1Meta' crash associated with db.exec/db.batch in some envs
  for (const statement of statements) {
    try {
      await db.prepare(statement).run();
    } catch (err: any) {
      console.warn(`Setup warning for statement: "${statement.substring(0, 30)}..." - ${err.message}`);
    }
  }

  console.log("DB Setup Complete.");
};
// ------------------------------

// Safe config access helper
const getSessionDuration = () => {
  return (appConfig && appConfig.sessionDurationHours) ? appConfig.sessionDurationHours : 8;
};

export const getAdminCount = async (db: D1Database) => {
  const result = await db.prepare("SELECT COUNT(*) as count FROM users").all();
  return (result.results?.[0]?.count as number) ?? 0;
};

export const getUserByEmail = async (db: D1Database, email: string) => {
  const result = await db
    .prepare("SELECT id, email, password_hash as passwordHash FROM users WHERE email = ?")
    .bind(email)
    .first();
  if (!result) return null;
  return {
    id: result.id as number,
    email: result.email as string,
    passwordHash: result.passwordHash as string,
  };
};

export const createAdmin = async (db: D1Database, email: string, passwordHash: string) => {
  const statement = db.prepare(
    "INSERT INTO users (email, password_hash, role, created_at) VALUES (?, ?, 'admin', datetime('now'))"
  );
  await statement.bind(email, passwordHash).run();
  const row = await db
    .prepare("SELECT id, email FROM users WHERE email = ?")
    .bind(email)
    .first();
  if (!row) {
    throw new Error("Admin creation failed");
  }
  return { id: row.id as number, email: row.email as string } as User;
};

export const createSession = async (
  db: D1Database,
  userId: number,
  tokenHash: string
) => {
  // SAFE FALLBACK: use getSessionDuration()
  const duration = getSessionDuration(); 
  const expiresAt = new Date(Date.now() + duration * 3600 * 1000);
  
  await db
    .prepare(
      "INSERT INTO sessions (user_id, token_hash, created_at, expires_at) VALUES (?, ?, datetime('now'), ?)")
    .bind(userId, tokenHash, expiresAt.toISOString())
    .run();
};

export const getUserFromSession = async (db: D1Database, tokenHash: string) => {
  const row = await db
    .prepare(
      `SELECT users.id as id, users.email as email, users.role as role
       FROM sessions
       JOIN users ON users.id = sessions.user_id
       WHERE sessions.token_hash = ? AND sessions.expires_at > datetime('now')`
    )
    .bind(tokenHash)
    .first();
  if (!row) return null;
  return {
    id: row.id as number,
    email: row.email as string,
    role: row.role as "admin",
  } as User;
};

export const getHierarchy = async (db: D1Database) => {
  const classes = await db.prepare("SELECT * FROM classes ORDER BY id").all();
  const groups = await db.prepare("SELECT * FROM groups ORDER BY id").all();
  const subjects = await db.prepare("SELECT * FROM subjects ORDER BY id").all();
  const chapters = await db.prepare("SELECT * FROM chapters ORDER BY id").all();
  const subchapters = await db.prepare("SELECT * FROM subchapters ORDER BY id").all();
  return {
    classes: classes.results ?? [],
    groups: groups.results ?? [],
    subjects: subjects.results ?? [],
    chapters: chapters.results ?? [],
    subchapters: subchapters.results ?? [],
  };
};

export const getQuestionTypes = async (db: D1Database, chapterId?: string) => {
  const query = chapterId
    ? db.prepare("SELECT * FROM question_types WHERE chapter_id = ? ORDER BY id").bind(chapterId)
    : db.prepare("SELECT * FROM question_types ORDER BY id");
  const result = await query.all();
  return result.results ?? [];
};

export const getSources = async (db: D1Database) => {
  const categories = await db.prepare("SELECT * FROM source_categories ORDER BY id").all();
  const entities = await db
    .prepare("SELECT * FROM source_entities ORDER BY id")
    .all();
  return {
    categories: categories.results ?? [],
    entities: entities.results ?? [],
  };
};

export const insertClass = async (
  db: D1Database,
  name: string,
  hasGroups: boolean,
  isMerged: boolean
) => {
  await db
    .prepare(
      "INSERT INTO classes (name, has_groups, is_merged, created_at) VALUES (?, ?, ?, datetime('now'))"
    )
    .bind(name, hasGroups ? 1 : 0, isMerged ? 1 : 0)
    .run();
};

export const insertGroup = async (db: D1Database, classId: string, name: string) => {
  await db
    .prepare("INSERT INTO groups (class_id, name) VALUES (?, ?)")
    .bind(classId, name)
    .run();
};

export const insertSubject = async (
  db: D1Database,
  classId: string,
  groupId: string | null,
  name: string
) => {
  await db
    .prepare("INSERT INTO subjects (class_id, group_id, name) VALUES (?, ?, ?)")
    .bind(classId, groupId, name)
    .run();
};

export const insertChapter = async (
  db: D1Database,
  subjectId: string,
  name: string,
  position: number
) => {
  await db
    .prepare("INSERT INTO chapters (subject_id, name, position) VALUES (?, ?, ?)")
    .bind(subjectId, name, position)
    .run();
};

export const insertSubChapter = async (
  db: D1Database,
  chapterId: string,
  name: string,
  position: number
) => {
  await db
    .prepare("INSERT INTO subchapters (chapter_id, name, position) VALUES (?, ?, ?)")
    .bind(chapterId, name, position)
    .run();
};

export const insertQuestionType = async (
  db: D1Database,
  chapterId: string,
  name: string
) => {
  await db
    .prepare("INSERT INTO question_types (chapter_id, name) VALUES (?, ?)")
    .bind(chapterId, name)
    .run();
};

export const insertSourceEntity = async (
  db: D1Database,
  categoryId: string,
  name: string
) => {
  await db
    .prepare("INSERT INTO source_entities (category_id, name) VALUES (?, ?)")
    .bind(categoryId, name)
    .run();
};

export const insertQuestion = async (
  db: D1Database,
  payload: {
    chapterId: string;
    questionTypeId: string;
    sourceEntityId: string;
    sourceYear: string;
    prompt: string;
    imageUrl: string | null;
  }
) => {
  await db
    .prepare(
      `INSERT INTO questions
      (chapter_id, question_type_id, source_entity_id, source_year, prompt, image_url, created_at)
      VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`
    )
    .bind(
      payload.chapterId,
      payload.questionTypeId,
      payload.sourceEntityId,
      payload.sourceYear,
      payload.prompt,
      payload.imageUrl
    )
    .run();
};

export const listQuestions = async (db: D1Database) => {
  const result = await db
    .prepare(
      `SELECT questions.id, questions.prompt, questions.source_year as sourceYear, questions.image_url as imageUrl,
        question_types.name as questionType,
        chapters.name as chapter,
        subjects.name as subject,
        source_entities.name as sourceEntity
      FROM questions
      JOIN question_types ON question_types.id = questions.question_type_id
      JOIN chapters ON chapters.id = questions.chapter_id
      JOIN subjects ON subjects.id = chapters.subject_id
      JOIN source_entities ON source_entities.id = questions.source_entity_id
      ORDER BY questions.id DESC
      LIMIT 50`
    )
    .all();
  return result.results ?? [];
};

export const listQuestionsFiltered = async (
  db: D1Database,
  filters: {
    classId?: string;
    subjectId?: string;
    chapterId?: string;
    questionTypeId?: string;
  }
) => {
  const conditions: string[] = [];
  const values: string[] = [];

  if (filters.classId) {
    conditions.push("subjects.class_id = ?");
    values.push(filters.classId);
  }
  if (filters.subjectId) {
    conditions.push("subjects.id = ?");
    values.push(filters.subjectId);
  }
  if (filters.chapterId) {
    conditions.push("chapters.id = ?");
    values.push(filters.chapterId);
  }
  if (filters.questionTypeId) {
    conditions.push("question_types.id = ?");
    values.push(filters.questionTypeId);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const result = await db
    .prepare(
      `SELECT questions.id, questions.prompt, questions.source_year as sourceYear, questions.image_url as imageUrl,
        question_types.name as questionType,
        chapters.name as chapter,
        subjects.name as subject,
        source_entities.name as sourceEntity
      FROM questions
      JOIN question_types ON question_types.id = questions.question_type_id
      JOIN chapters ON chapters.id = questions.chapter_id
      JOIN subjects ON subjects.id = chapters.subject_id
      JOIN source_entities ON source_entities.id = questions.source_entity_id
      ${whereClause}
      ORDER BY questions.id DESC
      LIMIT 50`
    )
    .bind(...values)
    .all();
  return result.results ?? [];
};

export const listLearningMaterials = async (db: D1Database) => {
  const result = await db
    .prepare(
      `SELECT learning_materials.id, learning_materials.title, learning_materials.material_type as materialType,
        subchapters.name as subchapter, chapters.name as chapter
      FROM learning_materials
      JOIN subchapters ON subchapters.id = learning_materials.subchapter_id
      JOIN chapters ON chapters.id = subchapters.chapter_id
      ORDER BY learning_materials.id DESC
      LIMIT 50`
    )
    .all();
  return result.results ?? [];
};

export const insertLearningMaterial = async (
  db: D1Database,
  payload: {
    subchapterId: string;
    title: string;
    materialType: string;
    url: string;
    notes: string | null;
  }
) => {
  await db
    .prepare(
      `INSERT INTO learning_materials
      (subchapter_id, title, material_type, url, notes, created_at)
      VALUES (?, ?, ?, ?, ?, datetime('now'))`
    )
    .bind(
      payload.subchapterId,
      payload.title,
      payload.materialType,
      payload.url,
      payload.notes
    )
    .run();
};


