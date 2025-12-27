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
  linked_class_id INTEGER,
  created_at TEXT NOT NULL
  ,FOREIGN KEY (linked_class_id) REFERENCES classes(id) ON DELETE SET NULL
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
@@ -127,50 +129,63 @@ CREATE TABLE IF NOT EXISTS questions (
  FOREIGN KEY (source_entity_id) REFERENCES source_entities(id) ON DELETE SET NULL
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

INSERT OR IGNORE INTO source_categories (name) VALUES ('Board Exam'), ('University Admission'), ('College Test');
`;

export const setupDatabase = async (db: D1Database) => {
  const cleanSQL = SCHEMA_SQL.replace(/--.*$/gm, '');
  const statements = cleanSQL.split(';').map(s => s.trim()).filter(s => s.length > 0);
  for (const statement of statements) {
    try { await db.prepare(statement).run(); } catch (err: any) { console.warn("Schema:", err.message); }
  }
};

export const ensureClassLinkColumn = async (db: D1Database) => {
  try {
    const info = await db.prepare("PRAGMA table_info(classes)").all();
    if (!info.results || info.results.length === 0) return;
    const hasColumn = info.results.some((row: any) => row.name === "linked_class_id");
    if (!hasColumn) {
      await db.prepare("ALTER TABLE classes ADD COLUMN linked_class_id INTEGER").run();
    }
  } catch (err: any) {
    console.warn("Schema migrate:", err.message);
  }
};

// --- ACCESSORS ---
export const getAdminCount = async (db: D1Database) => (await db.prepare("SELECT COUNT(*) as count FROM users").first('count') as number) ?? 0;
export const getUserByEmail = async (db: D1Database, email: string) => {
  const r: any = await db.prepare("SELECT * FROM users WHERE email = ?").bind(email).first();
  return r ? { id: r.id, email: r.email, passwordHash: r.password_hash } : null;
};

// --- INSERTS ---
export const createAdmin = async (db: D1Database, email: string, hash: string) => {
  await db.prepare("INSERT INTO users (email, password_hash, role, created_at) VALUES (?, ?, 'admin', datetime('now'))").bind(email, hash).run();
  const r: any = await db.prepare("SELECT * FROM users WHERE email=?").bind(email).first();
  return r as User;
};

export const createSession = async (db: D1Database, uid: number, hash: string) => {
  const exp = new Date(Date.now() + 8 * 3600 * 1000).toISOString();
  await db.prepare("INSERT INTO sessions (user_id, token_hash, created_at, expires_at) VALUES (?, ?, datetime('now'), ?)").bind(uid, hash, exp).run();
};

export const getUserFromSession = async (db: D1Database, hash: string) => {
  const r: any = await db.prepare(`SELECT u.* FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = ? AND s.expires_at > datetime('now')`).bind(hash).first();
  return r as User;
};

// --- CORE DATA ---
@@ -187,50 +202,63 @@ export const getHierarchy = async (db: D1Database) => {

export const getSources = async (db: D1Database) => {
  const [c, e] = await Promise.all([
    db.prepare("SELECT * FROM source_categories ORDER BY id").all(),
    db.prepare("SELECT * FROM source_entities ORDER BY id").all()
  ]);
  return { categories: c.results||[], entities: e.results||[] };
};

export const getFeaturedCards = async (db: D1Database) => {
  return (await db.prepare("SELECT * FROM featured_cards ORDER BY position ASC, id DESC").all()).results || [];
};

// --- CREATION HELPERS ---
export const insertClass = async (db: D1Database, name: string, hasGroups: boolean) => {
  if (await db.prepare("SELECT id FROM classes WHERE lower(name)=lower(?)").bind(name).first()) throw new Error("Exists");
  await db.prepare("INSERT INTO classes (name, has_groups, created_at) VALUES (?, ?, datetime('now'))").bind(name, hasGroups?1:0).run();
};
export const insertGroup = (db: D1Database, cid: string, name: string) => db.prepare("INSERT INTO groups (class_id, name) VALUES (?, ?)").bind(cid, name).run();
export const insertSubject = (db: D1Database, cid: string, gid: string|null, name: string) => db.prepare("INSERT INTO subjects (class_id, group_id, name) VALUES (?, ?, ?)").bind(cid, gid, name).run();
export const insertChapter = (db: D1Database, sid: string, name: string, pos: number) => db.prepare("INSERT INTO chapters (subject_id, name, position) VALUES (?, ?, ?)").bind(sid, name, pos).run();
export const insertSubChapter = (db: D1Database, chid: string, name: string) => db.prepare("INSERT INTO subchapters (chapter_id, name, position) VALUES (?, ?, 1)").bind(chid, name).run();
export const insertSourceEntity = (db: D1Database, cid: string, name: string) => db.prepare("INSERT INTO source_entities (category_id, name) VALUES (?, ?)").bind(cid, name).run();
export const insertLearningMaterial = (db: D1Database, p: any) => db.prepare(`INSERT INTO learning_materials (subchapter_id, title, material_type, url, notes, created_at) VALUES (?, ?, ?, ?, ?, datetime('now'))`).bind(p.subchapterId, p.title, p.materialType, p.url, p.notes).run();

// --- UPDATE HELPERS ---
export const updateClass = (db: D1Database, id: string, name: string, hasGroups: boolean) =>
  db.prepare("UPDATE classes SET name = ?, has_groups = ? WHERE id = ?").bind(name, hasGroups ? 1 : 0, id).run();

export const updateClassLink = (db: D1Database, id: string, linkedId: string | null) =>
  db.prepare("UPDATE classes SET linked_class_id = ? WHERE id = ?").bind(linkedId, id).run();

export const updateGroup = (db: D1Database, id: string, name: string) =>
  db.prepare("UPDATE groups SET name = ? WHERE id = ?").bind(name, id).run();

export const updateSubject = (db: D1Database, id: string, name: string, groupId: string | null) =>
  db.prepare("UPDATE subjects SET name = ?, group_id = ? WHERE id = ?").bind(name, groupId, id).run();

// --- FEATURED CARDS ---
export const insertFeaturedCard = async (db: D1Database, p: any) => {
  await db.prepare(`INSERT INTO featured_cards (title, subtitle, image_url, target_link, bg_color, position, created_at) VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`)
    .bind(p.title, p.subtitle, p.imageUrl, p.link, p.color, Number(p.position)||0).run();
};

// --- CQ SYSTEM INSERTS ---
export const insertStem = async (db: D1Database, p: any) => {
  const res = await db.prepare(`INSERT INTO stems (content, image_url, source_entity_id, source_year, subject_id, created_at) VALUES (?, ?, ?, ?, ?, datetime('now')) RETURNING id`)
    .bind(p.content, p.imageUrl || null, p.sourceEntityId, p.sourceYear, p.subjectId).first();
  return res?.id;
};

export const insertQuestion = async (db: D1Database, p: any) => {
  await db.prepare(`
    INSERT INTO questions 
    (chapter_id, subchapter_id, stem_id, question_part, is_connected, prompt, image_url, source_entity_id, source_year, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `).bind(
    p.chapterId, 
    p.subchapterId || null, 
    p.stemId || null, 
    p.questionPart, 
    p.isConnected === 'true' ? 1 : 0,
    p.prompt, 
@@ -246,53 +274,51 @@ export const deleteItem = async (db: D1Database, table: string, id: string) => {
  await db.prepare(`DELETE FROM ${table} WHERE id = ?`).bind(id).run();
};

// --- SMART QUERY ---
export const listQuestionsFiltered = async (db: D1Database, f: any) => {
  // Complex Join to get Question + Linked Stem info
  let sql = `
    SELECT q.*, 
           st.content as stemContent, st.image_url as stemImage,
           ch.name as chapterName, 
           sch.name as topicName, 
           COALESCE(se.name, st_se.name) as sourceName, 
           COALESCE(q.source_year, st.source_year) as year
    FROM questions q
    JOIN chapters ch ON ch.id = q.chapter_id
    LEFT JOIN subchapters sch ON sch.id = q.subchapter_id
    LEFT JOIN stems st ON st.id = q.stem_id
    LEFT JOIN source_entities se ON se.id = q.source_entity_id
    LEFT JOIN source_entities st_se ON st_se.id = st.source_entity_id
    JOIN subjects s ON s.id = ch.subject_id
  `;
  
  const conds = [];
  const vals = [];

  if (f.classId && !f.subjectId) { conds.push("s.class_id = ?"); vals.push(f.classId); }
  if (f.subjectId) { conds.push("s.id = ?"); vals.push(f.subjectId); }
  if (f.chapterId) { conds.push("ch.id = ?"); vals.push(f.chapterId); }
  if (f.subchapterId) { conds.push("sch.id = ?"); vals.push(f.subchapterId); }

  if (conds.length) sql += " WHERE " + conds.join(" AND ");
  
  // Order: First by Stem ID (to group them), then by Part (k, kh, g, gh)
  sql += ` ORDER BY 
    CASE WHEN q.stem_id IS NULL THEN q.id ELSE q.stem_id END DESC,
    CASE q.question_part 
      WHEN 'stem' THEN 0 
      WHEN 'k' THEN 1 
      WHEN 'kh' THEN 2 
      WHEN 'g' THEN 3 
      WHEN 'gh' THEN 4 
      ELSE 5 
    END ASC
    LIMIT 100`;

  return (await db.prepare(sql).bind(...vals).all()).results ?? [];
};

export const listLearningMaterials = async (db: D1Database) => {
  return (await db.prepare("SELECT * FROM learning_materials ORDER BY id DESC LIMIT 20").all()).results ?? [];
};
