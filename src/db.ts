export type Env = {
  DB: D1Database;
};

type DBRow = Record<string, string | number | null>;

const toNumber = (value: string | number | null) =>
  value === null ? null : Number(value);

export async function getAdminCount(env: Env) {
  const result = await env.DB.prepare("SELECT COUNT(*) as count FROM admins").first();
  return Number(result?.count ?? 0);
}

export async function createAdmin(
  env: Env,
  username: string,
  passwordHash: string,
  passwordSalt: string
) {
  await env.DB.prepare(
    "INSERT INTO admins (username, password_hash, password_salt) VALUES (?1, ?2, ?3)"
  )
    .bind(username, passwordHash, passwordSalt)
    .run();
}

export async function getAdminByUsername(env: Env, username: string) {
  return env.DB.prepare(
    "SELECT * FROM admins WHERE username = ?1 LIMIT 1"
  )
    .bind(username)
    .first();
}

export async function createSession(
  env: Env,
  adminId: number,
  tokenHash: string,
  expiresAt: string
) {
  await env.DB.prepare(
    "INSERT INTO sessions (admin_id, token_hash, expires_at) VALUES (?1, ?2, ?3)"
  )
    .bind(adminId, tokenHash, expiresAt)
    .run();
}

export async function getSession(env: Env, tokenHash: string) {
  return env.DB.prepare(
    "SELECT sessions.*, admins.username FROM sessions JOIN admins ON admins.id = sessions.admin_id WHERE token_hash = ?1 AND expires_at > datetime('now') LIMIT 1"
  )
    .bind(tokenHash)
    .first();
}

export async function deleteSession(env: Env, tokenHash: string) {
  await env.DB.prepare("DELETE FROM sessions WHERE token_hash = ?1")
    .bind(tokenHash)
    .run();
}

export async function listClasses(env: Env) {
  const result = await env.DB.prepare(
    "SELECT * FROM classes ORDER BY sort_order, name"
  ).all();
  return result.results as DBRow[];
}

export async function listGroupsByClass(env: Env, classId: number) {
  const result = await env.DB.prepare(
    "SELECT * FROM groups WHERE class_id = ?1 ORDER BY sort_order, name"
  )
    .bind(classId)
    .all();
  return result.results as DBRow[];
}

export async function listSubjectsByClass(env: Env, classId: number) {
  const result = await env.DB.prepare(
    "SELECT * FROM subjects WHERE class_id = ?1 AND group_id IS NULL ORDER BY sort_order, name"
  )
    .bind(classId)
    .all();
  return result.results as DBRow[];
}

export async function listSubjectsByGroup(env: Env, groupId: number) {
  const result = await env.DB.prepare(
    "SELECT * FROM subjects WHERE group_id = ?1 ORDER BY sort_order, name"
  )
    .bind(groupId)
    .all();
  return result.results as DBRow[];
}

export async function listChaptersBySubject(env: Env, subjectId: number) {
  const result = await env.DB.prepare(
    "SELECT * FROM chapters WHERE subject_id = ?1 ORDER BY sort_order, name"
  )
    .bind(subjectId)
    .all();
  return result.results as DBRow[];
}

export async function listSubChaptersByChapter(env: Env, chapterId: number) {
  const result = await env.DB.prepare(
    "SELECT * FROM sub_chapters WHERE chapter_id = ?1 ORDER BY sort_order, name"
  )
    .bind(chapterId)
    .all();
  return result.results as DBRow[];
}

export async function listQuestionTypesByChapter(env: Env, chapterId: number) {
  const result = await env.DB.prepare(
    "SELECT * FROM question_types WHERE chapter_id = ?1 ORDER BY sort_order, name"
  )
    .bind(chapterId)
    .all();
  return result.results as DBRow[];
}

export async function listSources(env: Env) {
  const result = await env.DB.prepare(
    "SELECT * FROM sources ORDER BY category, entity, year"
  ).all();
  return result.results as DBRow[];
}

export async function listQuestions(
  env: Env,
  chapterId: number,
  typeId: number | null,
  sourceId: number | null
) {
  let query =
    "SELECT questions.*, sources.category, sources.entity, sources.year, question_types.name as type_name FROM questions LEFT JOIN sources ON sources.id = questions.source_id LEFT JOIN question_types ON question_types.id = questions.question_type_id WHERE questions.chapter_id = ?1";
  const binds: (number | null)[] = [chapterId];
  if (typeId) {
    query += " AND questions.question_type_id = ?2";
    binds.push(typeId);
  }
  if (sourceId) {
    query += typeId ? " AND questions.source_id = ?3" : " AND questions.source_id = ?2";
    binds.push(sourceId);
  }
  query += " ORDER BY questions.created_at DESC";
  const result = await env.DB.prepare(query).bind(...binds).all();
  return result.results as DBRow[];
}

export async function createClass(
  env: Env,
  name: string,
  hasGroups: boolean,
  sortOrder: number | null,
  mergedLabel: string | null
) {
  await env.DB.prepare(
    "INSERT INTO classes (name, has_groups, sort_order, merged_label) VALUES (?1, ?2, ?3, ?4)"
  )
    .bind(name, hasGroups ? 1 : 0, sortOrder, mergedLabel)
    .run();
}

export async function createGroup(
  env: Env,
  classId: number,
  name: string,
  sortOrder: number | null
) {
  await env.DB.prepare(
    "INSERT INTO groups (class_id, name, sort_order) VALUES (?1, ?2, ?3)"
  )
    .bind(classId, name, sortOrder)
    .run();
}

export async function createSubject(
  env: Env,
  classId: number,
  groupId: number | null,
  name: string,
  sortOrder: number | null
) {
  await env.DB.prepare(
    "INSERT INTO subjects (class_id, group_id, name, sort_order) VALUES (?1, ?2, ?3, ?4)"
  )
    .bind(classId, groupId, name, sortOrder)
    .run();
}

export async function createChapter(
  env: Env,
  subjectId: number,
  name: string,
  sortOrder: number | null
) {
  await env.DB.prepare(
    "INSERT INTO chapters (subject_id, name, sort_order) VALUES (?1, ?2, ?3)"
  )
    .bind(subjectId, name, sortOrder)
    .run();
}

export async function createSubChapter(
  env: Env,
  chapterId: number,
  name: string,
  sortOrder: number | null
) {
  await env.DB.prepare(
    "INSERT INTO sub_chapters (chapter_id, name, sort_order) VALUES (?1, ?2, ?3)"
  )
    .bind(chapterId, name, sortOrder)
    .run();
}

export async function createQuestionType(
  env: Env,
  chapterId: number,
  name: string,
  sortOrder: number | null
) {
  await env.DB.prepare(
    "INSERT INTO question_types (chapter_id, name, sort_order) VALUES (?1, ?2, ?3)"
  )
    .bind(chapterId, name, sortOrder)
    .run();
}

export async function createSource(
  env: Env,
  category: string,
  entity: string,
  year: string
) {
  await env.DB.prepare(
    "INSERT INTO sources (category, entity, year) VALUES (?1, ?2, ?3)"
  )
    .bind(category, entity, year)
    .run();
}

export async function createQuestion(
  env: Env,
  chapterId: number,
  questionTypeId: number | null,
  sourceId: number | null,
  imageUrl: string,
  description: string | null
) {
  await env.DB.prepare(
    "INSERT INTO questions (chapter_id, question_type_id, source_id, image_url, description) VALUES (?1, ?2, ?3, ?4, ?5)"
  )
    .bind(chapterId, questionTypeId, sourceId, imageUrl, description)
    .run();
}

export function normalizeId(value: string | null) {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

export function safeNumber(value: string | null) {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

export function getBoolean(value: string | null) {
  return value === "true" || value === "1";
}

export function mapCount(value: string | number | null) {
  return toNumber(value);
}
