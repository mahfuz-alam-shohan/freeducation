function nowIso() {
  return new Date().toISOString();
}

function buildNodeScopeClause(subjectNodeId, chapterId, topicId) {
  const clauses = ['subject_node_id = ?1'];
  const params = [subjectNodeId];

  if (chapterId) {
    clauses.push(`chapter_id = ?${params.length + 1}`);
    params.push(chapterId);
  } else {
    clauses.push('chapter_id IS NULL');
  }

  if (topicId) {
    clauses.push(`topic_id = ?${params.length + 1}`);
    params.push(topicId);
  } else {
    clauses.push('topic_id IS NULL');
  }

  return { whereSql: clauses.join(' AND '), params };
}

const CODE_TEMPLATE_CODES = ['BANGLA-1ST-NCTB2010', 'PHY-CHEM-BIO-NCTB2010'];

async function removeNonCodeTemplates(db) {
  const placeholders = CODE_TEMPLATE_CODES.map((_, i) => `?${i + 1}`).join(', ');
  const nonCodeTemplates = await db
    .prepare(`SELECT id FROM subject_templates WHERE code NOT IN (${placeholders})`)
    .bind(...CODE_TEMPLATE_CODES)
    .all();

  for (const template of nonCodeTemplates.results ?? []) {
    await db.prepare('DELETE FROM subjects WHERE template_id = ?1').bind(template.id).run();
    await db.prepare('DELETE FROM subject_templates WHERE id = ?1').bind(template.id).run();
  }
}

export async function ensureDefaultTemplate(db) {
  await removeNonCodeTemplates(db);

  const existing = await db.prepare("SELECT id FROM subject_templates WHERE code = 'BANGLA-1ST-NCTB2010'").first();
  if (existing?.id) return existing.id;

  const templateId = crypto.randomUUID();
  const createdAt = nowIso();
  await db
    .prepare('INSERT INTO subject_templates (id, code, name, description, created_at) VALUES (?1, ?2, ?3, ?4, ?5)')
    .bind(templateId, 'BANGLA-1ST-NCTB2010', 'BANGLA-1ST-NCTB2010', 'Default Bangla First Paper skeleton.', createdAt)
    .run();

  const nodes = [
    { key: 'main_book', parent: null, name: 'Main Book', type: 'section', edit: 1, image: 1, sort: 1, chapter: 0, contentKind: null },
    { key: 'stories', parent: 'main_book', name: 'Stories', type: 'section', edit: 1, image: 1, sort: 2, chapter: 1, contentKind: null },
    { key: 'rhymes', parent: 'main_book', name: 'Rhymes', type: 'section', edit: 1, image: 1, sort: 3, chapter: 1, contentKind: null },
    { key: 'assisting_book', parent: null, name: 'Assisting Book', type: 'section', edit: 1, image: 1, sort: 4, chapter: 0, contentKind: null },
    { key: 'drama', parent: 'assisting_book', name: 'Drama', type: 'section', edit: 1, image: 1, sort: 5, chapter: 0, contentKind: null },
    { key: 'novel', parent: 'assisting_book', name: 'Novel', type: 'section', edit: 1, image: 1, sort: 6, chapter: 0, contentKind: null },
  ];

  const contentKinds = ['CQ Bank', 'MCQ Bank', 'Short Notes', 'Videos'];
  const contentNodes = [
    ...contentKinds.map((name, i) => ({ key: `stories_${name.toLowerCase().replace(/\s+/g, '_')}`, parent: 'stories', name, sort: 10 + i })),
    ...contentKinds.map((name, i) => ({ key: `rhymes_${name.toLowerCase().replace(/\s+/g, '_')}`, parent: 'rhymes', name, sort: 20 + i })),
    ...contentKinds.map((name, i) => ({ key: `drama_${name.toLowerCase().replace(/\s+/g, '_')}`, parent: 'drama', name, sort: 30 + i })),
    ...contentKinds.map((name, i) => ({ key: `novel_${name.toLowerCase().replace(/\s+/g, '_')}`, parent: 'novel', name, sort: 40 + i })),
  ];

  const all = [
    ...nodes,
    ...contentNodes.map((n) => ({
      key: n.key,
      parent: n.parent,
      name: n.name,
      type: 'content',
      edit: 0,
      image: 0,
      sort: n.sort,
      chapter: 0,
      contentKind: n.name,
    })),
  ];

  const idByKey = new Map();
  for (const node of all) {
    const id = crypto.randomUUID();
    idByKey.set(node.key, id);
    await db
      .prepare(
        `INSERT INTO template_nodes (
          id, template_id, parent_id, node_key, server_name, node_type, supports_edit, supports_image,
          supports_chapters, content_kind, sort_order
        ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11)`
      )
      .bind(
        id,
        templateId,
        node.parent ? idByKey.get(node.parent) : null,
        node.key,
        node.name,
        node.type,
        node.edit,
        node.image,
        node.chapter,
        node.contentKind,
        node.sort
      )
      .run();
  }

  return templateId;
}

export async function ensurePhyChemBioTemplate(db) {
  const existing = await db.prepare("SELECT id FROM subject_templates WHERE code = 'PHY-CHEM-BIO-NCTB2010'").first();
  if (existing?.id) return existing.id;

  const templateId = crypto.randomUUID();
  const createdAt = nowIso();
  await db
    .prepare('INSERT INTO subject_templates (id, code, name, description, created_at) VALUES (?1, ?2, ?3, ?4, ?5)')
    .bind(templateId, 'PHY-CHEM-BIO-NCTB2010', 'PHY-CHEM-BIO-NCTB2010', 'Single main book with chapter/topic support.', createdAt)
    .run();

  const nodes = [
    { key: 'main_book', parent: null, name: 'Main Book', type: 'section', edit: 1, image: 1, sort: 1, chapter: 1, contentKind: null },
    { key: 'cq_bank', parent: 'main_book', name: 'CQ Bank', type: 'content', edit: 0, image: 0, sort: 10, chapter: 0, contentKind: 'CQ Bank' },
    { key: 'mcq_bank', parent: 'main_book', name: 'MCQ Bank', type: 'content', edit: 0, image: 0, sort: 11, chapter: 0, contentKind: 'MCQ Bank' },
    { key: 'short_notes', parent: 'main_book', name: 'Short Notes', type: 'content', edit: 0, image: 0, sort: 12, chapter: 0, contentKind: 'Short Notes' },
    { key: 'videos', parent: 'main_book', name: 'Videos', type: 'content', edit: 0, image: 0, sort: 13, chapter: 0, contentKind: 'Videos' },
    { key: 'summary', parent: 'main_book', name: 'Summary', type: 'content', edit: 0, image: 0, sort: 14, chapter: 0, contentKind: 'Summary' },
  ];

  const idByKey = new Map();
  for (const node of nodes) {
    const id = crypto.randomUUID();
    idByKey.set(node.key, id);
    await db
      .prepare(
        `INSERT INTO template_nodes (
          id, template_id, parent_id, node_key, server_name, node_type, supports_edit, supports_image,
          supports_chapters, content_kind, sort_order
        ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11)`
      )
      .bind(
        id,
        templateId,
        node.parent ? idByKey.get(node.parent) : null,
        node.key,
        node.name,
        node.type,
        node.edit,
        node.image,
        node.chapter,
        node.contentKind,
        node.sort
      )
      .run();
  }

  return templateId;
}

export async function ensureDefaultClasses(db) {
  const count = await db.prepare('SELECT COUNT(*) count FROM classes').first();
  if (Number(count?.count ?? 0) > 0) return;

  const createdAt = nowIso();
  for (let i = 1; i <= 12; i += 1) {
    await db
      .prepare('INSERT INTO classes (id, name, image_key, show_on_home, sort_order, created_at, updated_at) VALUES (?1, ?2, NULL, 1, ?3, ?4, ?4)')
      .bind(crypto.randomUUID(), `Class ${i}`, i, createdAt)
      .run();
  }
}

export async function listClasses(db, options = {}) {
  const whereClause = options.homepageOnly ? 'WHERE show_on_home = 1' : '';
  const rows = await db
    .prepare(`SELECT id, name, image_key, show_on_home, sort_order, created_at, updated_at FROM classes ${whereClause} ORDER BY sort_order ASC, created_at ASC`)
    .all();
  return rows.results ?? [];
}

export async function getClassById(db, classId) {
  return db.prepare('SELECT id, name, image_key, show_on_home, sort_order, created_at, updated_at FROM classes WHERE id = ?1').bind(classId).first();
}

export async function createClass(db, input) {
  const id = crypto.randomUUID();
  const createdAt = nowIso();
  const maxRow = await db.prepare('SELECT COALESCE(MAX(sort_order), 0) maxOrder FROM classes').first();
  const nextOrder = Number(maxRow?.maxOrder || 0) + 1;
  await db
    .prepare('INSERT INTO classes (id, name, image_key, show_on_home, sort_order, created_at, updated_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?6)')
    .bind(id, input.name, input.imageKey || null, input.showOnHome ? 1 : 0, nextOrder, createdAt)
    .run();
  return id;
}

export async function updateClass(db, classId, input) {
  await db
    .prepare('UPDATE classes SET name = ?2, image_key = ?3, show_on_home = ?4, updated_at = ?5 WHERE id = ?1')
    .bind(classId, input.name, input.imageKey || null, input.showOnHome ? 1 : 0, nowIso())
    .run();
}

export async function moveClass(db, classId, direction) {
  const classes = await listClasses(db);
  const index = classes.findIndex((item) => item.id === classId);
  if (index === -1) return;
  const targetIndex = direction === 'up' ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= classes.length) return;

  const current = classes[index];
  const target = classes[targetIndex];

  await db.prepare('UPDATE classes SET sort_order = ?2, updated_at = ?3 WHERE id = ?1').bind(current.id, target.sort_order, nowIso()).run();
  await db.prepare('UPDATE classes SET sort_order = ?2, updated_at = ?3 WHERE id = ?1').bind(target.id, current.sort_order, nowIso()).run();
}

export async function deleteClass(db, classId) {
  await db.prepare('UPDATE subjects SET class_id = NULL WHERE class_id = ?1').bind(classId).run();
  await db.prepare('DELETE FROM classes WHERE id = ?1').bind(classId).run();

  const classes = await listClasses(db);
  for (let index = 0; index < classes.length; index += 1) {
    const item = classes[index];
    const nextOrder = index + 1;
    if (Number(item.sort_order) === nextOrder) continue;
    await db.prepare('UPDATE classes SET sort_order = ?2, updated_at = ?3 WHERE id = ?1').bind(item.id, nextOrder, nowIso()).run();
  }
}

export async function listTemplates(db) {
  const rows = await db.prepare('SELECT id, code, name, description, created_at FROM subject_templates ORDER BY created_at ASC').all();
  return rows.results ?? [];
}

export async function getTemplate(db, templateId) {
  return db.prepare('SELECT id, code, name, description, created_at FROM subject_templates WHERE id = ?1').bind(templateId).first();
}

export async function listTemplateNodes(db, templateId) {
  const rows = await db
    .prepare(
      `SELECT id, parent_id, node_key, server_name, node_type, supports_edit, supports_image,
              supports_chapters, content_kind, sort_order
       FROM template_nodes
       WHERE template_id = ?1
       ORDER BY sort_order ASC, server_name ASC`
    )
    .bind(templateId)
    .all();
  return rows.results ?? [];
}

export async function listSubjects(db) {
  const rows = await db
    .prepare(
      `SELECT s.id, s.name, s.class_level, s.class_id, c.name class_name, s.image_key, s.created_at, t.name template_name
       FROM subjects s
       LEFT JOIN classes c ON c.id = s.class_id
       JOIN subject_templates t ON t.id = s.template_id
       ORDER BY s.created_at DESC`
    )
    .all();
  return rows.results ?? [];
}

export async function listSubjectsByClass(db, classId) {
  const rows = await db
    .prepare(
      `SELECT s.id, s.name, s.class_level, s.class_id, c.name class_name, s.template_id, s.image_key, s.created_at, t.name template_name
       FROM subjects s
       LEFT JOIN classes c ON c.id = s.class_id
       JOIN subject_templates t ON t.id = s.template_id
       WHERE s.class_id = ?1
       ORDER BY s.name ASC, s.created_at ASC`
    )
    .bind(classId)
    .all();
  return rows.results ?? [];
}

export async function createSubject(db, input) {
  const id = crypto.randomUUID();
  const createdAt = nowIso();
  await db
    .prepare('INSERT INTO subjects (id, name, class_level, class_id, template_id, image_key, created_at, updated_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?7)')
    .bind(id, input.name, input.classLevel, input.classId || null, input.templateId, input.imageKey || null, createdAt)
    .run();

  const templateNodes = await listTemplateNodes(db, input.templateId);
  const map = new Map();
  for (const node of templateNodes) {
    const nodeId = crypto.randomUUID();
    map.set(node.id, nodeId);
    await db
      .prepare(
        `INSERT INTO subject_nodes (
          id, subject_id, template_node_id, parent_subject_node_id, server_name,
          display_name, image_key, supports_edit, supports_image, supports_chapters,
          node_type, content_kind, sort_order
        ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, NULL, ?7, ?8, ?9, ?10, ?11, ?12)`
      )
      .bind(
        nodeId,
        id,
        node.id,
        node.parent_id ? map.get(node.parent_id) : null,
        node.server_name,
        node.server_name,
        node.supports_edit,
        node.supports_image,
        node.supports_chapters,
        node.node_type,
        node.content_kind,
        node.sort_order
      )
      .run();
  }

  return id;
}


export async function updateSubject(db, subjectId, name, imageKey) {
  await db.prepare('UPDATE subjects SET name = ?2, image_key = ?3, updated_at = ?4 WHERE id = ?1').bind(subjectId, name, imageKey, nowIso()).run();
}

export async function deleteSubject(db, subjectId) {
  await db.prepare('DELETE FROM subjects WHERE id = ?1').bind(subjectId).run();
}

export async function getSubject(db, subjectId) {
  return db
    .prepare(
      `SELECT s.id, s.name, s.class_level, s.class_id, c.name class_name, s.template_id, s.image_key, s.created_at, t.name template_name
       FROM subjects s
       LEFT JOIN classes c ON c.id = s.class_id
       JOIN subject_templates t ON t.id = s.template_id
       WHERE s.id = ?1`
    )
    .bind(subjectId)
    .first();
}

export async function listSubjectNodesByParent(db, subjectId, parentId = null) {
  const sql = parentId
    ? `SELECT * FROM subject_nodes WHERE subject_id = ?1 AND parent_subject_node_id = ?2 ORDER BY sort_order ASC, display_name ASC`
    : `SELECT * FROM subject_nodes WHERE subject_id = ?1 AND parent_subject_node_id IS NULL ORDER BY sort_order ASC, display_name ASC`;
  const stmt = db.prepare(sql);
  const rows = parentId ? await stmt.bind(subjectId, parentId).all() : await stmt.bind(subjectId).all();
  return rows.results ?? [];
}

export async function getSubjectNode(db, subjectNodeId) {
  return db.prepare('SELECT * FROM subject_nodes WHERE id = ?1').bind(subjectNodeId).first();
}

export async function updateSubjectNode(db, subjectNodeId, displayName, imageKey) {
  await db
    .prepare('UPDATE subject_nodes SET display_name = ?2, image_key = ?3 WHERE id = ?1')
    .bind(subjectNodeId, displayName, imageKey)
    .run();
}

export async function listChapters(db, subjectNodeId) {
  const rows = await db
    .prepare('SELECT * FROM chapters WHERE subject_node_id = ?1 ORDER BY sort_order ASC, created_at ASC')
    .bind(subjectNodeId)
    .all();
  return rows.results ?? [];
}

export async function createChapter(db, subjectNodeId, name, imageKey, hasTopics = 0) {
  const id = crypto.randomUUID();
  const createdAt = nowIso();
  const max = await db.prepare('SELECT COALESCE(MAX(sort_order), 0) maxSort FROM chapters WHERE subject_node_id = ?1').bind(subjectNodeId).first();
  await db
    .prepare(
      'INSERT INTO chapters (id, subject_node_id, name, image_key, has_topics, sort_order, created_at, updated_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?7)'
    )
    .bind(id, subjectNodeId, name, imageKey, hasTopics ? 1 : 0, Number(max?.maxSort ?? 0) + 1, createdAt)
    .run();
}

export async function updateChapter(db, chapterId, name, imageKey, hasTopics) {
  await db
    .prepare('UPDATE chapters SET name = ?2, image_key = ?3, has_topics = ?4, updated_at = ?5 WHERE id = ?1')
    .bind(chapterId, name, imageKey, hasTopics ? 1 : 0, nowIso())
    .run();
}

export async function deleteChapter(db, chapterId) {
  await db.prepare('DELETE FROM chapters WHERE id = ?1').bind(chapterId).run();
}

export async function getChapter(db, chapterId) {
  return db.prepare('SELECT * FROM chapters WHERE id = ?1').bind(chapterId).first();
}

export async function listTopics(db, chapterId) {
  const rows = await db.prepare('SELECT * FROM topics WHERE chapter_id = ?1 ORDER BY sort_order ASC, created_at ASC').bind(chapterId).all();
  return rows.results ?? [];
}

export async function getTopic(db, topicId) {
  return db.prepare('SELECT * FROM topics WHERE id = ?1').bind(topicId).first();
}

export async function createTopic(db, chapterId, name, imageKey) {
  const id = crypto.randomUUID();
  const createdAt = nowIso();
  const max = await db.prepare('SELECT COALESCE(MAX(sort_order), 0) maxSort FROM topics WHERE chapter_id = ?1').bind(chapterId).first();
  await db
    .prepare('INSERT INTO topics (id, chapter_id, name, image_key, sort_order, created_at, updated_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?6)')
    .bind(id, chapterId, name, imageKey, Number(max?.maxSort ?? 0) + 1, createdAt)
    .run();
}

export async function updateTopic(db, topicId, name, imageKey) {
  await db.prepare('UPDATE topics SET name = ?2, image_key = ?3, updated_at = ?4 WHERE id = ?1').bind(topicId, name, imageKey, nowIso()).run();
}

export async function deleteTopic(db, topicId) {
  await db.prepare('DELETE FROM topics WHERE id = ?1').bind(topicId).run();
}

export async function listNotes(db, subjectNodeId, chapterId, topicId = null) {
  const scope = buildNodeScopeClause(subjectNodeId, chapterId || null, topicId || null);
  const rows = await db
    .prepare(`SELECT * FROM short_notes WHERE ${scope.whereSql} ORDER BY created_at DESC`)
    .bind(...scope.params)
    .all();
  return rows.results ?? [];
}

export async function createNote(db, input) {
  const createdAt = nowIso();
  await db
    .prepare(
      `INSERT INTO short_notes (id, subject_id, subject_node_id, chapter_id, topic_id, title, content_html, image_key, created_at, updated_at)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?9)`
    )
    .bind(
      crypto.randomUUID(),
      input.subjectId,
      input.subjectNodeId,
      input.chapterId || null,
      input.topicId || null,
      input.title || '',
      input.contentHtml,
      input.imageKey,
      createdAt
    )
    .run();
}

export async function updateNote(db, input) {
  await db
    .prepare('UPDATE short_notes SET title = ?2, content_html = ?3, image_key = ?4, updated_at = ?5 WHERE id = ?1')
    .bind(input.id, input.title || '', input.contentHtml, input.imageKey, nowIso())
    .run();
}

export async function deleteNote(db, noteId) {
  await db.prepare('DELETE FROM short_notes WHERE id = ?1').bind(noteId).run();
}

export async function listMcqs(db, subjectNodeId, chapterId, topicId = null) {
  const scope = buildNodeScopeClause(subjectNodeId, chapterId || null, topicId || null);
  const rows = await db
    .prepare(`SELECT * FROM mcq_bank WHERE ${scope.whereSql} ORDER BY created_at DESC`)
    .bind(...scope.params)
    .all();
  return rows.results ?? [];
}

export async function createMcq(db, input) {
  const createdAt = nowIso();
  await db
    .prepare(
      `INSERT INTO mcq_bank (
        id, subject_id, subject_node_id, chapter_id, topic_id, question_html,
        option_a, option_b, option_c, option_d, correct_option, image_key, created_at, updated_at
      ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?13)`
    )
    .bind(
      crypto.randomUUID(),
      input.subjectId,
      input.subjectNodeId,
      input.chapterId || null,
      input.topicId || null,
      input.questionHtml,
      input.optionA,
      input.optionB,
      input.optionC,
      input.optionD,
      input.correctOption,
      input.imageKey,
      createdAt
    )
    .run();
}

export async function updateMcq(db, input) {
  await db
    .prepare(
      `UPDATE mcq_bank
       SET question_html = ?2, option_a = ?3, option_b = ?4, option_c = ?5, option_d = ?6,
           correct_option = ?7, image_key = ?8, updated_at = ?9
       WHERE id = ?1`
    )
    .bind(input.id, input.questionHtml, input.optionA, input.optionB, input.optionC, input.optionD, input.correctOption, input.imageKey, nowIso())
    .run();
}

export async function deleteMcq(db, mcqId) {
  await db.prepare('DELETE FROM mcq_bank WHERE id = ?1').bind(mcqId).run();
}


export async function listContentEntries(db, subjectNodeId, chapterId, topicId, contentKind) {
  const scope = buildNodeScopeClause(subjectNodeId, chapterId || null, topicId || null);
  const contentKindParam = scope.params.length + 1;
  const rows = await db
    .prepare(
      `SELECT * FROM content_entries
       WHERE ${scope.whereSql}
         AND content_kind = ?${contentKindParam}
       ORDER BY created_at DESC`
    )
    .bind(...scope.params, contentKind)
    .all();
  return rows.results ?? [];
}

export async function createContentEntry(db, input) {
  const createdAt = nowIso();
  await db
    .prepare(
      `INSERT INTO content_entries (
        id, subject_id, subject_node_id, chapter_id, topic_id, content_kind,
        title, content_html, image_key, created_at, updated_at
      ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?10)`
    )
    .bind(
      crypto.randomUUID(),
      input.subjectId,
      input.subjectNodeId,
      input.chapterId || null,
      input.topicId || null,
      input.contentKind,
      input.title || '',
      input.contentHtml,
      input.imageKey,
      createdAt
    )
    .run();
}

export async function upsertSummaryEntry(db, input) {
  const scope = buildNodeScopeClause(input.subjectNodeId, input.chapterId || null, input.topicId || null);
  const existing = await db
    .prepare(
      `SELECT id FROM content_entries
       WHERE ${scope.whereSql}
         AND content_kind = 'Summary'
       LIMIT 1`
    )
    .bind(...scope.params)
    .first();

  if (existing?.id) {
    await updateContentEntry(db, { id: existing.id, title: '', contentHtml: input.contentHtml, imageKey: input.imageKey || null });
    return existing.id;
  }

  await createContentEntry(db, {
    subjectId: input.subjectId,
    subjectNodeId: input.subjectNodeId,
    chapterId: input.chapterId,
    topicId: input.topicId,
    contentKind: 'Summary',
    title: '',
    contentHtml: input.contentHtml,
    imageKey: input.imageKey || null,
  });
  return null;
}

export async function updateContentEntry(db, input) {
  await db
    .prepare('UPDATE content_entries SET title = ?2, content_html = ?3, image_key = ?4, updated_at = ?5 WHERE id = ?1')
    .bind(input.id, input.title || '', input.contentHtml, input.imageKey, nowIso())
    .run();
}

export async function deleteContentEntry(db, entryId) {
  await db.prepare('DELETE FROM content_entries WHERE id = ?1').bind(entryId).run();
}
