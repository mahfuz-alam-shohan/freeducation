export async function initDatabase(db: D1Database) {
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password_hash TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS classes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE,
      parent_class_id INTEGER NULL,
      program_label TEXT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS groups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      class_id INTEGER,
      FOREIGN KEY(class_id) REFERENCES classes(id)
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS subjects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      class_id INTEGER,
      is_common BOOLEAN,
      group_id INTEGER NULL,
      FOREIGN KEY(class_id) REFERENCES classes(id),
      FOREIGN KEY(group_id) REFERENCES groups(id)
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS chapters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      subject_id INTEGER,
      order_num INTEGER,
      FOREIGN KEY(subject_id) REFERENCES subjects(id)
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS topics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      chapter_id INTEGER,
      content TEXT,
      order_num INTEGER,
      FOREIGN KEY(chapter_id) REFERENCES chapters(id)
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT, 
      topic_id INTEGER,
      question_text TEXT,
      options TEXT, 
      answer TEXT,
      metadata TEXT, 
      FOREIGN KEY(topic_id) REFERENCES topics(id)
    )`),
  ]);
}

export async function resolveContentId(db: D1Database, classId: string | number) {
  const cls = await db.prepare("SELECT parent_class_id FROM classes WHERE id = ?").bind(classId).first();
  return cls && cls.parent_class_id ? cls.parent_class_id : classId;
}
