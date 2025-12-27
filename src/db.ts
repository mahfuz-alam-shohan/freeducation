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
  const expiresAt = new Date(Date.now() + appConfig.sessionDurationHours * 3600 * 1000);
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
      `SELECT questions.id, questions.prompt, questions.source_year as sourceYear,
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
      `SELECT questions.id, questions.prompt, questions.source_year as sourceYear,
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
