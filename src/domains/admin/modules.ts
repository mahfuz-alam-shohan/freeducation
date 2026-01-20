export type ModuleListItem = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  isActive: number;
  createdAt: string;
};

export type ClassGroup = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
};

export type SubjectListItem = {
  id: number;
  name: string;
  slug: string;
  templateSlug: string | null;
  description: string | null;
  isTwoPaper: number;
  createdAt: string;
};

export type SubjectDetail = {
  id: number;
  name: string;
  slug: string;
  templateSlug: string | null;
  description: string | null;
  isTwoPaper: number;
};

export type SubjectClassGroup = {
  classSubjectId: number;
  classGroupId: number;
  classGroupName: string;
  classGroupSlug: string;
  stream: string;
  isOptional: number;
};

export type ChapterItem = {
  id: number;
  title: string;
  slug: string;
  position: number;
  summary: string | null;
  createdAt: string;
};

export type TopicItem = {
  id: number;
  title: string;
  slug: string;
  position: number;
  createdAt: string;
};

export type ContentItem = {
  id: number;
  contentType: string;
  title: string;
  body: string | null;
  resourceUrl: string | null;
  position: number;
  createdAt: string;
};

type D1Database = {
  prepare: (query: string) => {
    all: <T = unknown>() => Promise<{ results: T[] }>;
    run: () => Promise<void>;
    bind: (...values: unknown[]) => { all: <T = unknown>() => Promise<{ results: T[] }>; run: () => Promise<void> };
  };
};

export const listModules = async (db: D1Database): Promise<ModuleListItem[]> => {
  const result = await db
    .prepare(
      "SELECT id, name, slug, description, is_active as isActive, created_at as createdAt FROM modules ORDER BY createdAt DESC",
    )
    .all<ModuleListItem>();
  return result.results;
};

export const ensureModulesSeed = async (db: D1Database): Promise<void> => {
  const createdAt = new Date().toISOString();
  await db
    .prepare(
      `INSERT INTO modules (name, slug, description, is_active, created_at)
       SELECT ?, ?, ?, ?, ?
       WHERE NOT EXISTS (SELECT 1 FROM modules WHERE slug = ?)`,
    )
    .bind("Subjects", "subjects", "Manage class subjects, chapters, and content.", 1, createdAt, "subjects")
    .run();
};

export const createModule = async (
  db: D1Database,
  payload: { name: string; slug: string; description?: string; isActive?: boolean },
): Promise<void> => {
  const createdAt = new Date().toISOString();
  await db
    .prepare("INSERT INTO modules (name, slug, description, is_active, created_at) VALUES (?, ?, ?, ?, ?)")
    .bind(payload.name, payload.slug, payload.description ?? null, payload.isActive ? 1 : 0, createdAt)
    .run();
};

export const listClassGroups = async (db: D1Database): Promise<ClassGroup[]> => {
  const result = await db
    .prepare(
      "SELECT id, name, slug, description, created_at as createdAt FROM class_groups ORDER BY createdAt DESC",
    )
    .all<ClassGroup>();
  return result.results;
};

export const ensureDefaultClassGroups = async (db: D1Database): Promise<void> => {
  const createdAt = new Date().toISOString();
  const classGroups = [
    { name: "Class 9-10", slug: "9-10", description: "Combined curriculum for class 9 and 10." },
    { name: "Class 11-12", slug: "11-12", description: "Combined curriculum for class 11 and 12." },
  ];

  for (const group of classGroups) {
    await db
      .prepare(
        `INSERT INTO class_groups (name, slug, description, created_at)
         SELECT ?, ?, ?, ?
         WHERE NOT EXISTS (SELECT 1 FROM class_groups WHERE slug = ?)`,
      )
      .bind(group.name, group.slug, group.description, createdAt, group.slug)
      .run();
  }
};

export const syncSubjectTemplates = async (
  db: D1Database,
  templates: Array<{
    slug: string;
    name: string;
    classGroups: Array<{ slug: string; stream: string; isOptional: boolean }>;
  }>,
): Promise<void> => {
  const createdAt = new Date().toISOString();
  const classGroupRows = await db
    .prepare("SELECT id, slug FROM class_groups")
    .all<{ id: number; slug: string }>();
  const classGroupMap = new Map(classGroupRows.results.map((group) => [group.slug, group.id]));

  for (const template of templates) {
    await db
      .prepare(
        `INSERT INTO subjects (name, slug, template_slug, description, is_two_paper, created_at)
         SELECT ?, ?, ?, ?, ?, ?
         WHERE NOT EXISTS (SELECT 1 FROM subjects WHERE slug = ?)`,
      )
      .bind(template.name, template.slug, template.slug, null, 0, createdAt, template.slug)
      .run();

    const subjectResult = await db
      .prepare("SELECT id FROM subjects WHERE slug = ?")
      .bind(template.slug)
      .all<{ id: number }>();
    const subjectId = subjectResult.results[0]?.id;
    if (!subjectId) {
      continue;
    }

    for (const group of template.classGroups) {
      const classGroupId = classGroupMap.get(group.slug);
      if (!classGroupId) {
        continue;
      }

      await db
        .prepare(
          `INSERT INTO class_subjects (class_group_id, subject_id, stream, is_optional, created_at)
           SELECT ?, ?, ?, ?, ?
           WHERE NOT EXISTS (
             SELECT 1 FROM class_subjects WHERE class_group_id = ? AND subject_id = ?
           )`,
        )
        .bind(
          classGroupId,
          subjectId,
          group.stream,
          group.isOptional ? 1 : 0,
          createdAt,
          classGroupId,
          subjectId,
        )
        .run();
    }
  }
};

export const createClassGroup = async (
  db: D1Database,
  payload: { name: string; slug: string; description?: string },
): Promise<void> => {
  const createdAt = new Date().toISOString();
  await db
    .prepare("INSERT INTO class_groups (name, slug, description, created_at) VALUES (?, ?, ?, ?)")
    .bind(payload.name, payload.slug, payload.description ?? null, createdAt)
    .run();
};

export const listSubjects = async (db: D1Database): Promise<SubjectListItem[]> => {
  const result = await db
    .prepare(
      `SELECT subjects.id,
        subjects.name,
        subjects.slug,
        subjects.template_slug as templateSlug,
        subjects.description,
        subjects.is_two_paper as isTwoPaper,
        subjects.created_at as createdAt
      FROM subjects
      ORDER BY subjects.name ASC`,
    )
    .all<SubjectListItem>();

  return result.results;
};

export const getSubjectById = async (db: D1Database, subjectId: number): Promise<SubjectDetail | null> => {
  const result = await db
    .prepare("SELECT id, name, slug, template_slug as templateSlug, description, is_two_paper as isTwoPaper FROM subjects WHERE id = ?")
    .bind(subjectId)
    .all<SubjectDetail>();
  return result.results[0] ?? null;
};

export const listSubjectClassGroups = async (
  db: D1Database,
  subjectId: number,
): Promise<SubjectClassGroup[]> => {
  const result = await db
    .prepare(
      `SELECT class_subjects.id as classSubjectId,
        class_subjects.class_group_id as classGroupId,
        class_subjects.stream as stream,
        class_subjects.is_optional as isOptional,
        class_groups.name as classGroupName,
        class_groups.slug as classGroupSlug
      FROM class_subjects
      JOIN class_groups ON class_groups.id = class_subjects.class_group_id
      WHERE class_subjects.subject_id = ?
      ORDER BY class_groups.slug ASC`,
    )
    .bind(subjectId)
    .all<SubjectClassGroup>();
  return result.results;
};

export const createSubject = async (
  db: D1Database,
  payload: {
    name: string;
    slug: string;
    templateSlug?: string;
    description?: string;
    isTwoPaper: boolean;
    classGroupIds: number[];
    stream: string;
    isOptional: boolean;
  },
): Promise<void> => {
  const createdAt = new Date().toISOString();
  await db
    .prepare(
      "INSERT INTO subjects (name, slug, template_slug, description, is_two_paper, created_at) VALUES (?, ?, ?, ?, ?, ?)",
    )
    .bind(
      payload.name,
      payload.slug,
      payload.templateSlug ?? null,
      payload.description ?? null,
      payload.isTwoPaper ? 1 : 0,
      createdAt,
    )
    .run();

  const subjectResult = await db.prepare("SELECT id FROM subjects WHERE slug = ?").bind(payload.slug).all<{ id: number }>();
  const subjectId = subjectResult.results[0]?.id;
  if (!subjectId) {
    throw new Error("Unable to locate newly created subject.");
  }

  for (const classGroupId of payload.classGroupIds) {
    await db
      .prepare(
        "INSERT INTO class_subjects (class_group_id, subject_id, stream, is_optional, created_at) VALUES (?, ?, ?, ?, ?)",
      )
      .bind(classGroupId, subjectId, payload.stream, payload.isOptional ? 1 : 0, createdAt)
      .run();
  }
};

export const deleteSubject = async (db: D1Database, subjectId: number): Promise<void> => {
  await db
    .prepare(
      "DELETE FROM content_items WHERE topic_id IN (SELECT id FROM chapter_topics WHERE chapter_id IN (SELECT id FROM chapters WHERE class_subject_id IN (SELECT id FROM class_subjects WHERE subject_id = ?)))",
    )
    .bind(subjectId)
    .run();
  await db
    .prepare(
      "DELETE FROM content_items WHERE chapter_id IN (SELECT id FROM chapters WHERE class_subject_id IN (SELECT id FROM class_subjects WHERE subject_id = ?))",
    )
    .bind(subjectId)
    .run();
  await db
    .prepare(
      "DELETE FROM chapter_topics WHERE chapter_id IN (SELECT id FROM chapters WHERE class_subject_id IN (SELECT id FROM class_subjects WHERE subject_id = ?))",
    )
    .bind(subjectId)
    .run();
  await db
    .prepare("DELETE FROM chapters WHERE class_subject_id IN (SELECT id FROM class_subjects WHERE subject_id = ?)")
    .bind(subjectId)
    .run();
  await db.prepare("DELETE FROM class_subjects WHERE subject_id = ?").bind(subjectId).run();
  await db.prepare("DELETE FROM subjects WHERE id = ?").bind(subjectId).run();
};

export const listChapters = async (db: D1Database, classSubjectId: number): Promise<ChapterItem[]> => {
  const result = await db
    .prepare(
      "SELECT id, title, slug, position, summary, created_at as createdAt FROM chapters WHERE class_subject_id = ? ORDER BY position ASC, createdAt ASC",
    )
    .bind(classSubjectId)
    .all<ChapterItem>();
  return result.results;
};

export const createChapter = async (
  db: D1Database,
  payload: { classSubjectId: number; title: string; slug: string; position: number; summary?: string },
): Promise<void> => {
  const createdAt = new Date().toISOString();
  await db
    .prepare(
      "INSERT INTO chapters (class_subject_id, title, slug, position, summary, created_at) VALUES (?, ?, ?, ?, ?, ?)",
    )
    .bind(payload.classSubjectId, payload.title, payload.slug, payload.position, payload.summary ?? null, createdAt)
    .run();
};

export const deleteChapter = async (db: D1Database, chapterId: number): Promise<void> => {
  await db
    .prepare("DELETE FROM content_items WHERE topic_id IN (SELECT id FROM chapter_topics WHERE chapter_id = ?)")
    .bind(chapterId)
    .run();
  await db.prepare("DELETE FROM content_items WHERE chapter_id = ?").bind(chapterId).run();
  await db.prepare("DELETE FROM chapter_topics WHERE chapter_id = ?").bind(chapterId).run();
  await db.prepare("DELETE FROM chapters WHERE id = ?").bind(chapterId).run();
};

export const listTopics = async (db: D1Database, chapterId: number): Promise<TopicItem[]> => {
  const result = await db
    .prepare(
      "SELECT id, title, slug, position, created_at as createdAt FROM chapter_topics WHERE chapter_id = ? ORDER BY position ASC, createdAt ASC",
    )
    .bind(chapterId)
    .all<TopicItem>();
  return result.results;
};

export const createTopic = async (
  db: D1Database,
  payload: { chapterId: number; title: string; slug: string; position: number },
): Promise<void> => {
  const createdAt = new Date().toISOString();
  await db
    .prepare("INSERT INTO chapter_topics (chapter_id, title, slug, position, created_at) VALUES (?, ?, ?, ?, ?)")
    .bind(payload.chapterId, payload.title, payload.slug, payload.position, createdAt)
    .run();
};

export const deleteTopic = async (db: D1Database, topicId: number): Promise<void> => {
  await db.prepare("DELETE FROM content_items WHERE topic_id = ?").bind(topicId).run();
  await db.prepare("DELETE FROM chapter_topics WHERE id = ?").bind(topicId).run();
};

export const listContentItems = async (
  db: D1Database,
  payload: { topicId?: number; chapterId?: number },
): Promise<ContentItem[]> => {
  if (payload.topicId) {
    const result = await db
      .prepare(
        "SELECT id, content_type as contentType, title, body, resource_url as resourceUrl, position, created_at as createdAt FROM content_items WHERE topic_id = ? ORDER BY position ASC, createdAt ASC",
      )
      .bind(payload.topicId)
      .all<ContentItem>();
    return result.results;
  }

  if (payload.chapterId) {
    const result = await db
      .prepare(
        "SELECT id, content_type as contentType, title, body, resource_url as resourceUrl, position, created_at as createdAt FROM content_items WHERE chapter_id = ? ORDER BY position ASC, createdAt ASC",
      )
      .bind(payload.chapterId)
      .all<ContentItem>();
    return result.results;
  }

  return [];
};

export const createContentItem = async (
  db: D1Database,
  payload: {
    chapterId?: number;
    topicId?: number;
    contentType: string;
    title: string;
    body?: string;
    resourceUrl?: string;
    position: number;
    metadataJson?: string;
  },
): Promise<void> => {
  const createdAt = new Date().toISOString();
  await db
    .prepare(
      "INSERT INTO content_items (chapter_id, topic_id, content_type, title, body, resource_url, position, metadata_json, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    )
    .bind(
      payload.chapterId ?? null,
      payload.topicId ?? null,
      payload.contentType,
      payload.title,
      payload.body ?? null,
      payload.resourceUrl ?? null,
      payload.position,
      payload.metadataJson ?? null,
      createdAt,
    )
    .run();
};

export const deleteContentItem = async (db: D1Database, contentItemId: number): Promise<void> => {
  await db.prepare("DELETE FROM content_items WHERE id = ?").bind(contentItemId).run();
};
