import { PLATFORM_SCHEMA } from "../../config/index.js";

const PLATFORM_INDEXES = [
  "CREATE INDEX IF NOT EXISTS idx_freeducation_admins_email ON freeducation_admins(email)",
  "CREATE INDEX IF NOT EXISTS idx_freeducation_sessions_token_hash ON freeducation_sessions(token_hash)",
  "CREATE INDEX IF NOT EXISTS idx_freeducation_sessions_expires_at ON freeducation_sessions(expires_at)",
  "CREATE INDEX IF NOT EXISTS idx_freeducation_sessions_admin_id ON freeducation_sessions(admin_id)",
  "CREATE INDEX IF NOT EXISTS idx_freeducation_social_posts_created_at ON freeducation_social_posts(created_at)",
  "CREATE INDEX IF NOT EXISTS idx_freeducation_social_posts_admin_id ON freeducation_social_posts(admin_id)",
  "CREATE INDEX IF NOT EXISTS idx_freeducation_social_posts_created_id ON freeducation_social_posts(created_at DESC, id DESC)",
  "CREATE INDEX IF NOT EXISTS idx_freeducation_social_posts_admin_created_id ON freeducation_social_posts(admin_id, created_at DESC, id DESC)",
  "CREATE INDEX IF NOT EXISTS idx_freeducation_social_comments_post_id ON freeducation_social_comments(post_id)",
  "CREATE INDEX IF NOT EXISTS idx_freeducation_social_comments_post_created ON freeducation_social_comments(post_id, created_at ASC, id ASC)",
  "CREATE INDEX IF NOT EXISTS idx_freeducation_social_comments_admin_id ON freeducation_social_comments(admin_id)",
  "CREATE UNIQUE INDEX IF NOT EXISTS idx_freeducation_social_reactions_unique ON freeducation_social_reactions(post_id, admin_id)",
  "CREATE INDEX IF NOT EXISTS idx_freeducation_social_reactions_post_id ON freeducation_social_reactions(post_id)",
  "CREATE UNIQUE INDEX IF NOT EXISTS idx_freeducation_social_comment_reactions_unique ON freeducation_social_comment_reactions(comment_id, admin_id)",
  "CREATE INDEX IF NOT EXISTS idx_freeducation_social_comment_reactions_comment_id ON freeducation_social_comment_reactions(comment_id)",
  "CREATE INDEX IF NOT EXISTS idx_freeducation_social_comment_reactions_admin_id ON freeducation_social_comment_reactions(admin_id)",
  "CREATE UNIQUE INDEX IF NOT EXISTS idx_freeducation_social_mates_pair_unique ON freeducation_social_mates(user_low_id, user_high_id)",
  "CREATE INDEX IF NOT EXISTS idx_freeducation_social_mates_receiver_status ON freeducation_social_mates(receiver_id, status, updated_at DESC, id DESC)",
  "CREATE INDEX IF NOT EXISTS idx_freeducation_social_mates_requester_status ON freeducation_social_mates(requester_id, status, updated_at DESC, id DESC)",
  "CREATE INDEX IF NOT EXISTS idx_freeducation_social_mates_low_status ON freeducation_social_mates(user_low_id, status, updated_at DESC, id DESC)",
  "CREATE INDEX IF NOT EXISTS idx_freeducation_social_mates_high_status ON freeducation_social_mates(user_high_id, status, updated_at DESC, id DESC)",
  "CREATE UNIQUE INDEX IF NOT EXISTS idx_freeducation_social_notification_reads_unique ON freeducation_social_notification_reads(admin_id, notification_id)",
  "CREATE INDEX IF NOT EXISTS idx_freeducation_social_notification_reads_admin_read_at ON freeducation_social_notification_reads(admin_id, read_at DESC)",
  "CREATE INDEX IF NOT EXISTS idx_freeducation_social_notification_meta_seen_at ON freeducation_social_notification_meta(seen_at)",
  "CREATE INDEX IF NOT EXISTS idx_freeducation_subject_templates_code ON freeducation_subject_templates(code)",
  "CREATE INDEX IF NOT EXISTS idx_freeducation_subjects_template_id ON freeducation_subjects(template_id)",
  "CREATE INDEX IF NOT EXISTS idx_freeducation_subjects_class_id ON freeducation_subjects(class_id)",
  "CREATE INDEX IF NOT EXISTS idx_freeducation_subjects_class_level ON freeducation_subjects(class_level)",
  "CREATE INDEX IF NOT EXISTS idx_freeducation_module_classes_sort ON freeducation_module_classes(sort_order ASC, id ASC)",
  "CREATE INDEX IF NOT EXISTS idx_freeducation_module_classes_show ON freeducation_module_classes(show_in_home, sort_order ASC, id ASC)",
  "CREATE INDEX IF NOT EXISTS idx_freeducation_subject_nodes_subject_parent_sort ON freeducation_subject_nodes(subject_id, parent_node_id, sort_order ASC, id ASC)",
  "CREATE INDEX IF NOT EXISTS idx_freeducation_subject_nodes_subject_key ON freeducation_subject_nodes(subject_id, template_node_key)",
  "CREATE INDEX IF NOT EXISTS idx_freeducation_subject_chapters_subject_node_sort ON freeducation_subject_chapters(subject_id, node_id, sort_order ASC, id ASC)",
  "CREATE INDEX IF NOT EXISTS idx_freeducation_subject_topics_subject_chapter_sort ON freeducation_subject_topics(subject_id, chapter_id, sort_order ASC, id ASC)",
  "CREATE INDEX IF NOT EXISTS idx_freeducation_subject_content_items_subject_context ON freeducation_subject_content_items(subject_id, context_type, context_id, content_type, sort_order ASC, id ASC)",
  "CREATE INDEX IF NOT EXISTS idx_freeducation_exam_sessions_user_status ON freeducation_exam_sessions(user_id, status, created_at DESC, id DESC)",
  "CREATE INDEX IF NOT EXISTS idx_freeducation_exam_sessions_subject ON freeducation_exam_sessions(subject_id, created_at DESC, id DESC)",
  "CREATE INDEX IF NOT EXISTS idx_freeducation_exam_session_questions_session_sort ON freeducation_exam_session_questions(session_id, sort_order ASC, id ASC)",
  "CREATE INDEX IF NOT EXISTS idx_freeducation_exam_attempts_user_status ON freeducation_exam_attempts(user_id, status, created_at DESC, id DESC)",
  "CREATE INDEX IF NOT EXISTS idx_freeducation_exam_attempts_session_attempt ON freeducation_exam_attempts(session_id, attempt_index ASC, id ASC)",
  "CREATE INDEX IF NOT EXISTS idx_freeducation_exam_attempt_answers_attempt_order ON freeducation_exam_attempt_answers(attempt_id, question_order ASC, id ASC)",
  "CREATE UNIQUE INDEX IF NOT EXISTS idx_freeducation_exam_attempt_answers_unique ON freeducation_exam_attempt_answers(attempt_id, session_question_id)",
];

export async function ensureSchema(db) {
  for (const [table, columns] of Object.entries(PLATFORM_SCHEMA)) {
    await db.prepare(`CREATE TABLE IF NOT EXISTS ${table} (${columns.map(([name, def]) => `${name} ${def}`).join(",")})`).run();
    await alignColumns(db, table, columns);
  }

  for (const indexQuery of PLATFORM_INDEXES) {
    await db.prepare(indexQuery).run();
  }
}

async function alignColumns(db, table, requiredColumns) {
  const required = new Map(requiredColumns);
  const currentInfo = await db.prepare(`PRAGMA table_info(${table})`).all();
  const currentCols = currentInfo.results.map((r) => r.name);

  const hasUnknown = currentCols.some((name) => !required.has(name));
  if (hasUnknown) {
    await rebuildTable(db, table, requiredColumns, currentCols.filter((name) => required.has(name)));
    return;
  }

  for (const [name, def] of requiredColumns) {
    if (!currentCols.includes(name)) {
      const addDef = def
        .replace(/\s+NOT\s+NULL/gi, "")
        .replace(/\s+UNIQUE/gi, "")
        .trim();
      await db.prepare(`ALTER TABLE ${table} ADD COLUMN ${name} ${addDef}`).run();
      await applyColumnBackfill(db, table, name);
    }
  }
}

async function applyColumnBackfill(db, table, column) {
  const now = new Date().toISOString();
  if (column === "created_at" || column === "updated_at") {
    await db.prepare(`UPDATE ${table} SET ${column} = ?1 WHERE ${column} IS NULL OR ${column} = ''`).bind(now).run();
  }
  if (column === "name") {
    await db.prepare(`UPDATE ${table} SET name = 'Administrator' WHERE name IS NULL OR name = ''`).run();
  }
  if (column === "user_type") {
    await db.prepare(`UPDATE ${table} SET user_type = 'Administrator' WHERE user_type IS NULL OR user_type = ''`).run();
  }
  if (column === "follow_low" || column === "follow_high") {
    await db.prepare(`UPDATE ${table} SET ${column} = 1 WHERE ${column} IS NULL OR ${column} = ''`).run();
  }
}

async function rebuildTable(db, table, requiredColumns, keepColumns) {
  const tempTable = `${table}_tmp_${Date.now()}`;
  const schemaSql = requiredColumns.map(([name, def]) => `${name} ${def}`).join(",");
  await db.prepare(`CREATE TABLE ${tempTable} (${schemaSql})`).run();

  if (keepColumns.length > 0) {
    const now = new Date().toISOString();
    const expressions = requiredColumns.map(([name, def]) => {
      if (keepColumns.includes(name)) return name;
      return defaultExpressionForColumn(name, def, now);
    });
    const targetColumns = requiredColumns.map(([name]) => name).join(",");
    await db.prepare(
      `INSERT INTO ${tempTable} (${targetColumns}) SELECT ${expressions.join(",")} FROM ${table}`,
    ).run();
  }

  await db.prepare(`DROP TABLE ${table}`).run();
  await db.prepare(`ALTER TABLE ${tempTable} RENAME TO ${table}`).run();

  for (const [name] of requiredColumns) {
    await applyColumnBackfill(db, table, name);
  }
}

function defaultExpressionForColumn(column, definition, now) {
  if (column === "created_at" || column === "updated_at") {
    return `'${now}'`;
  }
  if (column === "name") {
    return `'Administrator'`;
  }
  if (column === "user_type") {
    return `'Administrator'`;
  }
  if (column === "follow_low" || column === "follow_high") {
    return "1";
  }

  const type = definition.split(/\s+/)[0]?.toUpperCase() || "TEXT";
  if (type.includes("INT") || type.includes("REAL") || type.includes("NUM")) {
    return "0";
  }
  return "''";
}
