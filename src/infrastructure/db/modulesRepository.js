function toIsoNow() {
  return new Date().toISOString();
}

export async function upsertSubjectTemplate(db, template) {
  const now = toIsoNow();
  const existing = await db.prepare("SELECT id FROM freeducation_subject_templates WHERE code = ?1").bind(template.code).first();
  if (existing?.id) {
    await db.prepare(
      `UPDATE freeducation_subject_templates
       SET name = ?1, structure_json = ?2, updated_at = ?3
       WHERE id = ?4`,
    ).bind(template.name, template.structureJson, now, existing.id).run();
    return Number(existing.id);
  }

  const inserted = await db.prepare(
    `INSERT INTO freeducation_subject_templates (code, name, structure_json, created_at, updated_at)
     VALUES (?1, ?2, ?3, ?4, ?4)`,
  ).bind(template.code, template.name, template.structureJson, now).run();
  return Number(inserted?.meta?.last_row_id || 0);
}

export async function listSubjectTemplates(db) {
  const result = await db.prepare(
    `SELECT t.id, t.code, t.name, t.created_at,
            COUNT(s.id) AS subject_count
     FROM freeducation_subject_templates t
     LEFT JOIN freeducation_subjects s ON s.template_id = t.id
     GROUP BY t.id
     ORDER BY t.id ASC`,
  ).all();
  return result.results || [];
}

export async function listModuleClasses(db, { onlyHome = false } = {}) {
  if (onlyHome) {
    const result = await db.prepare(
      `SELECT id, name, image_key, show_in_home, sort_order, created_at
       FROM freeducation_module_classes
       WHERE show_in_home = 1
       ORDER BY sort_order ASC, id ASC`,
    ).all();
    return result.results || [];
  }

  const result = await db.prepare(
    `SELECT id, name, image_key, show_in_home, sort_order, created_at
     FROM freeducation_module_classes
     ORDER BY sort_order ASC, id ASC`,
  ).all();
  return result.results || [];
}

export async function findModuleClassById(db, classId) {
  return db.prepare(
    `SELECT id, name, image_key, show_in_home, sort_order, created_at
     FROM freeducation_module_classes
     WHERE id = ?1`,
  ).bind(classId).first();
}

export async function nextModuleClassSortOrder(db) {
  const row = await db.prepare(
    `SELECT COALESCE(MAX(sort_order), 0) + 1 AS next_sort
     FROM freeducation_module_classes`,
  ).first();
  return Number(row?.next_sort || 1);
}

export async function createModuleClass(db, { name, imageKey, showInHome, sortOrder }) {
  const now = toIsoNow();
  const inserted = await db.prepare(
    `INSERT INTO freeducation_module_classes
      (name, image_key, show_in_home, sort_order, created_at, updated_at)
     VALUES (?1, ?2, ?3, ?4, ?5, ?5)`,
  ).bind(name, imageKey || "", showInHome ? 1 : 0, sortOrder || 0, now).run();
  return Number(inserted?.meta?.last_row_id || 0);
}

export async function updateModuleClass(db, { classId, name, imageKey, showInHome }) {
  const now = toIsoNow();
  const hasName = typeof name === "string";
  const hasImage = typeof imageKey === "string";
  const hasShow = typeof showInHome === "boolean";
  if (!hasName && !hasImage && !hasShow) return;

  const updates = [];
  const values = [];
  if (hasName) {
    updates.push("name = ?" + String(values.length + 1));
    values.push(name);
  }
  if (hasImage) {
    updates.push("image_key = ?" + String(values.length + 1));
    values.push(imageKey);
  }
  if (hasShow) {
    updates.push("show_in_home = ?" + String(values.length + 1));
    values.push(showInHome ? 1 : 0);
  }
  updates.push("updated_at = ?" + String(values.length + 1));
  values.push(now);
  values.push(classId);

  await db.prepare(
    `UPDATE freeducation_module_classes
     SET ${updates.join(", ")}
     WHERE id = ?${values.length}`,
  ).bind(...values).run();
}

export async function findSubjectTemplateById(db, templateId) {
  return db.prepare(
    `SELECT id, code, name, structure_json, created_at
     FROM freeducation_subject_templates
     WHERE id = ?1`,
  ).bind(templateId).first();
}

export async function listSubjects(db) {
  const result = await db.prepare(
    `SELECT s.id, s.name, s.class_id, s.class_level, s.template_id, s.thumbnail_key, s.created_at,
            c.name AS class_name,
            t.code AS template_code,
            t.name AS template_name
     FROM freeducation_subjects s
     LEFT JOIN freeducation_module_classes c ON c.id = s.class_id
     JOIN freeducation_subject_templates t ON t.id = s.template_id
     ORDER BY datetime(s.created_at) DESC, s.id DESC`,
  ).all();
  return result.results || [];
}

export async function listSubjectsByClassId(db, { classId }) {
  const result = await db.prepare(
    `SELECT s.id, s.name, s.class_id, s.class_level, s.template_id, s.thumbnail_key, s.created_at,
            c.name AS class_name,
            t.code AS template_code,
            t.name AS template_name
     FROM freeducation_subjects s
     LEFT JOIN freeducation_module_classes c ON c.id = s.class_id
     JOIN freeducation_subject_templates t ON t.id = s.template_id
     WHERE s.class_id = ?1
     ORDER BY datetime(s.created_at) DESC, s.id DESC`,
  ).bind(classId).all();
  return result.results || [];
}

export async function createSubject(db, { name, classId, classLevel, templateId, createdBy }) {
  const now = toIsoNow();
  const inserted = await db.prepare(
    `INSERT INTO freeducation_subjects (name, class_id, class_level, template_id, thumbnail_key, created_by, created_at, updated_at)
     VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?7)`,
  ).bind(name, classId || 0, classLevel || 0, templateId, "", createdBy, now).run();
  return Number(inserted?.meta?.last_row_id || 0);
}

export async function findSubjectById(db, subjectId) {
  return db.prepare(
    `SELECT s.id, s.name, s.class_id, s.class_level, s.template_id, s.thumbnail_key, s.created_at,
            c.name AS class_name,
            t.code AS template_code,
            t.name AS template_name
     FROM freeducation_subjects s
     LEFT JOIN freeducation_module_classes c ON c.id = s.class_id
     JOIN freeducation_subject_templates t ON t.id = s.template_id
     WHERE s.id = ?1`,
  ).bind(subjectId).first();
}

export async function updateSubject(db, { subjectId, name, thumbnailKey, classId }) {
  const now = toIsoNow();
  const hasName = typeof name === "string";
  const hasThumbnail = typeof thumbnailKey === "string";
  const hasClassId = Number.isInteger(classId) && classId > 0;
  if (!hasName && !hasThumbnail && !hasClassId) return;

  const updates = [];
  const values = [];
  if (hasName) {
    updates.push("name = ?" + String(values.length + 1));
    values.push(name);
  }
  if (hasThumbnail) {
    updates.push("thumbnail_key = ?" + String(values.length + 1));
    values.push(thumbnailKey);
  }
  if (hasClassId) {
    updates.push("class_id = ?" + String(values.length + 1));
    values.push(classId);
  }
  updates.push("updated_at = ?" + String(values.length + 1));
  values.push(now);
  values.push(subjectId);

  await db.prepare(
    `UPDATE freeducation_subjects
     SET ${updates.join(", ")}
     WHERE id = ?${values.length}`,
  ).bind(...values).run();
}

export async function deleteSubjectContentItemsBySubjectId(db, { subjectId }) {
  await db.prepare(
    `DELETE FROM freeducation_subject_content_items
     WHERE subject_id = ?1`,
  ).bind(subjectId).run();
}

export async function deleteSubjectTopicsBySubjectId(db, { subjectId }) {
  await db.prepare(
    `DELETE FROM freeducation_subject_topics
     WHERE subject_id = ?1`,
  ).bind(subjectId).run();
}

export async function deleteSubjectChaptersBySubjectId(db, { subjectId }) {
  await db.prepare(
    `DELETE FROM freeducation_subject_chapters
     WHERE subject_id = ?1`,
  ).bind(subjectId).run();
}

export async function deleteSubjectNodesBySubjectId(db, { subjectId }) {
  await db.prepare(
    `DELETE FROM freeducation_subject_nodes
     WHERE subject_id = ?1`,
  ).bind(subjectId).run();
}

export async function deleteSubjectById(db, { subjectId }) {
  await db.prepare(
    `DELETE FROM freeducation_subjects
     WHERE id = ?1`,
  ).bind(subjectId).run();
}

export async function createSubjectNode(db, {
  subjectId,
  parentNodeId,
  templateNodeKey,
  serverName,
  displayName,
  sortOrder,
  supportsChapters,
  supportsTopics,
  canEditName,
  canUploadImage,
  contentTypesJson,
}) {
  const now = toIsoNow();
  const inserted = await db.prepare(
    `INSERT INTO freeducation_subject_nodes
      (subject_id, parent_node_id, template_node_key, server_name, display_name, sort_order,
       supports_chapters, supports_topics, can_edit_name, can_upload_image, image_key, content_types_json, created_at, updated_at)
     VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, '', ?11, ?12, ?12)`,
  ).bind(
    subjectId,
    parentNodeId || null,
    templateNodeKey,
    serverName,
    displayName,
    sortOrder,
    supportsChapters ? 1 : 0,
    supportsTopics ? 1 : 0,
    canEditName ? 1 : 0,
    canUploadImage ? 1 : 0,
    contentTypesJson,
    now,
  ).run();
  return Number(inserted?.meta?.last_row_id || 0);
}

export async function listSubjectNodesByParent(db, { subjectId, parentNodeId = null }) {
  if (parentNodeId === null || parentNodeId === undefined || Number(parentNodeId) === 0) {
    const result = await db.prepare(
      `SELECT id, subject_id, parent_node_id, template_node_key, server_name, display_name,
              sort_order, supports_chapters, supports_topics, can_edit_name, can_upload_image, image_key, content_types_json
       FROM freeducation_subject_nodes
       WHERE subject_id = ?1 AND parent_node_id IS NULL
       ORDER BY sort_order ASC, id ASC`,
    ).bind(subjectId).all();
    return result.results || [];
  }

  const result = await db.prepare(
    `SELECT id, subject_id, parent_node_id, template_node_key, server_name, display_name,
            sort_order, supports_chapters, supports_topics, can_edit_name, can_upload_image, image_key, content_types_json
     FROM freeducation_subject_nodes
     WHERE subject_id = ?1 AND parent_node_id = ?2
     ORDER BY sort_order ASC, id ASC`,
  ).bind(subjectId, parentNodeId).all();
  return result.results || [];
}

export async function listAllSubjectNodes(db, { subjectId }) {
  const result = await db.prepare(
    `SELECT id, subject_id, parent_node_id, template_node_key, server_name, display_name,
            sort_order, supports_chapters, supports_topics, can_edit_name, can_upload_image, image_key, content_types_json
     FROM freeducation_subject_nodes
     WHERE subject_id = ?1
     ORDER BY sort_order ASC, id ASC`,
  ).bind(subjectId).all();
  return result.results || [];
}

export async function countSubjectNodeChildren(db, { subjectId, parentNodeId }) {
  const result = await db.prepare(
    `SELECT COUNT(*) AS count
     FROM freeducation_subject_nodes
     WHERE subject_id = ?1 AND parent_node_id = ?2`,
  ).bind(subjectId, parentNodeId).first();
  return Number(result?.count || 0);
}

export async function findSubjectNodeById(db, { subjectId, nodeId }) {
  return db.prepare(
    `SELECT id, subject_id, parent_node_id, template_node_key, server_name, display_name,
            sort_order, supports_chapters, supports_topics, can_edit_name, can_upload_image, image_key, content_types_json
     FROM freeducation_subject_nodes
     WHERE subject_id = ?1 AND id = ?2`,
  ).bind(subjectId, nodeId).first();
}

export async function updateSubjectNode(db, { subjectId, nodeId, displayName, imageKey }) {
  const now = toIsoNow();
  if (imageKey === undefined) {
    await db.prepare(
      `UPDATE freeducation_subject_nodes
       SET display_name = ?1,
           updated_at = ?2
       WHERE subject_id = ?3 AND id = ?4`,
    ).bind(displayName, now, subjectId, nodeId).run();
    return;
  }

  await db.prepare(
    `UPDATE freeducation_subject_nodes
     SET display_name = ?1,
         image_key = ?2,
         updated_at = ?3
     WHERE subject_id = ?4 AND id = ?5`,
  ).bind(displayName, imageKey, now, subjectId, nodeId).run();
}

export async function listSubjectChapters(db, { subjectId, nodeId }) {
  const result = await db.prepare(
    `SELECT id, subject_id, node_id, chapter_number, name, topics_enabled, image_key, sort_order, created_at
     FROM freeducation_subject_chapters
     WHERE subject_id = ?1 AND node_id = ?2
     ORDER BY sort_order ASC, id ASC`,
  ).bind(subjectId, nodeId).all();
  return result.results || [];
}

export async function nextChapterSortOrder(db, { subjectId, nodeId }) {
  const row = await db.prepare(
    `SELECT COALESCE(MAX(sort_order), 0) + 1 AS next_sort
     FROM freeducation_subject_chapters
     WHERE subject_id = ?1 AND node_id = ?2`,
  ).bind(subjectId, nodeId).first();
  return Number(row?.next_sort || 1);
}

export async function createSubjectChapter(db, { subjectId, nodeId, chapterNumber, name, topicsEnabled, imageKey, sortOrder }) {
  const now = toIsoNow();
  const inserted = await db.prepare(
    `INSERT INTO freeducation_subject_chapters
      (subject_id, node_id, chapter_number, name, topics_enabled, image_key, sort_order, created_at, updated_at)
     VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?8)`,
  ).bind(subjectId, nodeId, chapterNumber || "", name, topicsEnabled ? 1 : 0, imageKey || "", sortOrder, now).run();
  return Number(inserted?.meta?.last_row_id || 0);
}

export async function findSubjectChapterById(db, { subjectId, chapterId }) {
  return db.prepare(
    `SELECT id, subject_id, node_id, chapter_number, name, topics_enabled, image_key, sort_order, created_at
     FROM freeducation_subject_chapters
     WHERE subject_id = ?1 AND id = ?2`,
  ).bind(subjectId, chapterId).first();
}

export async function updateSubjectChapter(db, { subjectId, chapterId, chapterNumber, name, topicsEnabled, imageKey }) {
  const now = toIsoNow();
  if (imageKey === undefined) {
    await db.prepare(
      `UPDATE freeducation_subject_chapters
       SET name = ?1,
           chapter_number = ?2,
           topics_enabled = ?3,
           updated_at = ?4
       WHERE subject_id = ?5 AND id = ?6`,
    ).bind(name, chapterNumber || "", topicsEnabled ? 1 : 0, now, subjectId, chapterId).run();
    return;
  }

  await db.prepare(
    `UPDATE freeducation_subject_chapters
     SET name = ?1,
         chapter_number = ?2,
         topics_enabled = ?3,
         image_key = ?4,
         updated_at = ?5
     WHERE subject_id = ?6 AND id = ?7`,
  ).bind(name, chapterNumber || "", topicsEnabled ? 1 : 0, imageKey, now, subjectId, chapterId).run();
}

export async function deleteSubjectChapter(db, { subjectId, chapterId }) {
  await db.prepare(
    `DELETE FROM freeducation_subject_chapters
     WHERE subject_id = ?1 AND id = ?2`,
  ).bind(subjectId, chapterId).run();
}

export async function reorderSubjectChapters(db, { subjectId, nodeId, chapterIds }) {
  const ids = Array.isArray(chapterIds) ? chapterIds.map((id) => Number(id || 0)).filter((id) => id > 0) : [];
  if (!ids.length) return;
  const now = toIsoNow();
  const query = db.prepare(
    `UPDATE freeducation_subject_chapters
     SET sort_order = ?1,
         chapter_number = ?2,
         updated_at = ?3
     WHERE subject_id = ?4 AND node_id = ?5 AND id = ?6`,
  );

  for (let index = 0; index < ids.length; index += 1) {
    const sortOrder = index + 1;
    await query.bind(sortOrder, String(sortOrder), now, subjectId, nodeId, ids[index]).run();
  }
}

export async function listSubjectTopics(db, { subjectId, chapterId }) {
  const result = await db.prepare(
    `SELECT id, subject_id, chapter_id, topic_number, name, image_key, sort_order, created_at
     FROM freeducation_subject_topics
     WHERE subject_id = ?1 AND chapter_id = ?2
     ORDER BY sort_order ASC, id ASC`,
  ).bind(subjectId, chapterId).all();
  return result.results || [];
}

export async function listAllSubjectTopicsByChapter(db, { subjectId, chapterId }) {
  const result = await db.prepare(
    `SELECT id, subject_id, chapter_id, topic_number, name, image_key, sort_order, created_at
     FROM freeducation_subject_topics
     WHERE subject_id = ?1 AND chapter_id = ?2
     ORDER BY sort_order ASC, id ASC`,
  ).bind(subjectId, chapterId).all();
  return result.results || [];
}

export async function listAllSubjectChaptersBySubject(db, { subjectId }) {
  const result = await db.prepare(
    `SELECT id, subject_id, node_id, chapter_number, name, topics_enabled, image_key, sort_order, created_at
     FROM freeducation_subject_chapters
     WHERE subject_id = ?1
     ORDER BY sort_order ASC, id ASC`,
  ).bind(subjectId).all();
  return result.results || [];
}

export async function listAllSubjectTopicsBySubject(db, { subjectId }) {
  const result = await db.prepare(
    `SELECT id, subject_id, chapter_id, topic_number, name, image_key, sort_order, created_at
     FROM freeducation_subject_topics
     WHERE subject_id = ?1
     ORDER BY sort_order ASC, id ASC`,
  ).bind(subjectId).all();
  return result.results || [];
}

export async function nextTopicSortOrder(db, { subjectId, chapterId }) {
  const row = await db.prepare(
    `SELECT COALESCE(MAX(sort_order), 0) + 1 AS next_sort
     FROM freeducation_subject_topics
     WHERE subject_id = ?1 AND chapter_id = ?2`,
  ).bind(subjectId, chapterId).first();
  return Number(row?.next_sort || 1);
}

export async function createSubjectTopic(db, { subjectId, chapterId, topicNumber, name, imageKey, sortOrder }) {
  const now = toIsoNow();
  const inserted = await db.prepare(
    `INSERT INTO freeducation_subject_topics
      (subject_id, chapter_id, topic_number, name, image_key, sort_order, created_at, updated_at)
     VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?7)`,
  ).bind(subjectId, chapterId, topicNumber || "", name, imageKey || "", sortOrder, now).run();
  return Number(inserted?.meta?.last_row_id || 0);
}

export async function findSubjectTopicById(db, { subjectId, topicId }) {
  return db.prepare(
    `SELECT id, subject_id, chapter_id, topic_number, name, image_key, sort_order, created_at
     FROM freeducation_subject_topics
     WHERE subject_id = ?1 AND id = ?2`,
  ).bind(subjectId, topicId).first();
}

export async function updateSubjectTopic(db, { subjectId, topicId, topicNumber, name, imageKey }) {
  const now = toIsoNow();
  if (imageKey === undefined) {
    await db.prepare(
      `UPDATE freeducation_subject_topics
       SET topic_number = ?1,
           name = ?2,
           updated_at = ?3
       WHERE subject_id = ?4 AND id = ?5`,
    ).bind(topicNumber || "", name, now, subjectId, topicId).run();
    return;
  }

  await db.prepare(
    `UPDATE freeducation_subject_topics
     SET topic_number = ?1,
         name = ?2,
         image_key = ?3,
         updated_at = ?4
     WHERE subject_id = ?5 AND id = ?6`,
  ).bind(topicNumber || "", name, imageKey, now, subjectId, topicId).run();
}

export async function deleteSubjectTopic(db, { subjectId, topicId }) {
  await db.prepare(
    `DELETE FROM freeducation_subject_topics
     WHERE subject_id = ?1 AND id = ?2`,
  ).bind(subjectId, topicId).run();
}

export async function deleteContentItemsByContext(db, { subjectId, contextType, contextId }) {
  await db.prepare(
    `DELETE FROM freeducation_subject_content_items
     WHERE subject_id = ?1 AND context_type = ?2 AND context_id = ?3`,
  ).bind(subjectId, contextType, contextId).run();
}

export async function listAllContentItemsByContext(db, { subjectId, contextType, contextId }) {
  const result = await db.prepare(
    `SELECT id, subject_id, context_type, context_id, content_type, body, image_key,
            options_json, correct_option, sort_order, created_by, created_at, updated_at
     FROM freeducation_subject_content_items
     WHERE subject_id = ?1 AND context_type = ?2 AND context_id = ?3
     ORDER BY sort_order ASC, id ASC`,
  ).bind(subjectId, contextType, contextId).all();
  return result.results || [];
}

export async function listAllContentItemsBySubject(db, { subjectId }) {
  const result = await db.prepare(
    `SELECT id, subject_id, context_type, context_id, content_type, body, image_key,
            options_json, correct_option, sort_order, created_by, created_at, updated_at
     FROM freeducation_subject_content_items
     WHERE subject_id = ?1
     ORDER BY sort_order ASC, id ASC`,
  ).bind(subjectId).all();
  return result.results || [];
}

export async function listContentItems(db, { subjectId, contextType, contextId, contentType }) {
  const result = await db.prepare(
    `SELECT id, subject_id, context_type, context_id, content_type, body, image_key,
            options_json, correct_option, sort_order, created_by, created_at, updated_at
     FROM freeducation_subject_content_items
     WHERE subject_id = ?1 AND context_type = ?2 AND context_id = ?3 AND content_type = ?4
     ORDER BY sort_order ASC, id ASC`,
  ).bind(subjectId, contextType, contextId, contentType).all();
  return result.results || [];
}

export async function nextContentSortOrder(db, { subjectId, contextType, contextId, contentType }) {
  const row = await db.prepare(
    `SELECT COALESCE(MAX(sort_order), 0) + 1 AS next_sort
     FROM freeducation_subject_content_items
     WHERE subject_id = ?1 AND context_type = ?2 AND context_id = ?3 AND content_type = ?4`,
  ).bind(subjectId, contextType, contextId, contentType).first();
  return Number(row?.next_sort || 1);
}

export async function createContentItem(db, {
  subjectId,
  contextType,
  contextId,
  contentType,
  body,
  imageKey,
  optionsJson,
  correctOption,
  sortOrder,
  createdBy,
}) {
  const now = toIsoNow();
  const inserted = await db.prepare(
    `INSERT INTO freeducation_subject_content_items
      (subject_id, context_type, context_id, content_type, body, image_key,
       options_json, correct_option, sort_order, created_by, created_at, updated_at)
     VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?11)`,
  ).bind(
    subjectId,
    contextType,
    contextId,
    contentType,
    body,
    imageKey || "",
    optionsJson,
    correctOption || "",
    sortOrder,
    createdBy,
    now,
  ).run();
  return Number(inserted?.meta?.last_row_id || 0);
}

export async function findContentItemById(db, { subjectId, itemId }) {
  return db.prepare(
    `SELECT id, subject_id, context_type, context_id, content_type, body, image_key,
            options_json, correct_option, sort_order, created_by, created_at, updated_at
     FROM freeducation_subject_content_items
     WHERE subject_id = ?1 AND id = ?2`,
  ).bind(subjectId, itemId).first();
}

export async function updateContentItem(db, {
  subjectId,
  itemId,
  body,
  imageKey,
  optionsJson,
  correctOption,
}) {
  const now = toIsoNow();
  if (imageKey === undefined) {
    await db.prepare(
      `UPDATE freeducation_subject_content_items
       SET body = ?1,
           options_json = ?2,
           correct_option = ?3,
           updated_at = ?4
       WHERE subject_id = ?5 AND id = ?6`,
    ).bind(body, optionsJson, correctOption || "", now, subjectId, itemId).run();
    return;
  }

  await db.prepare(
    `UPDATE freeducation_subject_content_items
     SET body = ?1,
         image_key = ?2,
         options_json = ?3,
         correct_option = ?4,
         updated_at = ?5
     WHERE subject_id = ?6 AND id = ?7`,
  ).bind(body, imageKey, optionsJson, correctOption || "", now, subjectId, itemId).run();
}

export async function deleteContentItem(db, { subjectId, itemId }) {
  await db.prepare(
    `DELETE FROM freeducation_subject_content_items
     WHERE subject_id = ?1 AND id = ?2`,
  ).bind(subjectId, itemId).run();
}
