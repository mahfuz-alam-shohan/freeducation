import { HttpError } from "../../shared/http/errors.js";
import { readBody } from "../../shared/http/request.js";
import {
  createModuleClass,
  createContentItem,
  createSubject,
  createSubjectChapter,
  createSubjectNode,
  createSubjectTopic,
  deleteContentItem,
  deleteContentItemsByContext,
  deleteSubjectById,
  deleteSubjectChapter,
  deleteSubjectChaptersBySubjectId,
  deleteSubjectContentItemsBySubjectId,
  deleteSubjectNodesBySubjectId,
  deleteSubjectTopic,
  deleteSubjectTopicsBySubjectId,
  findContentItemById,
  findModuleClassById,
  findSubjectById,
  findSubjectChapterById,
  findSubjectNodeById,
  findSubjectTopicById,
  findSubjectTemplateById,
  listAllContentItemsBySubject,
  listAllSubjectChaptersBySubject,
  listModuleClasses,
  listAllContentItemsByContext,
  listContentItems,
  listAllSubjectNodes,
  listAllSubjectTopicsBySubject,
  listAllSubjectTopicsByChapter,
  listSubjectChapters,
  listSubjectNodesByParent,
  listSubjectTopics,
  listSubjectTemplates,
  listSubjectsByClassId,
  listSubjects,
  nextChapterSortOrder,
  nextContentSortOrder,
  nextModuleClassSortOrder,
  nextTopicSortOrder,
  reorderSubjectChapters,
  updateContentItem,
  updateModuleClass,
  updateSubject,
  updateSubjectChapter,
  updateSubjectNode,
  updateSubjectTopic,
  upsertSubjectTemplate,
} from "../../infrastructure/db/modulesRepository.js";
import {
  BASE_CONTENT_TYPE_KEYS,
  CONTENT_MODULE_KEYS,
  contentLabelForType,
  contentTypeMetaList,
  isEditableContentType,
  isKnownContentType,
  publicReaderModules,
} from "../../shared/modules/contentModules.js";

const BASE_CONTENT_TYPES = BASE_CONTENT_TYPE_KEYS;
const CONTENT_TYPES = CONTENT_MODULE_KEYS;
const BANGLA_TEMPLATE = {
  code: "BANGLA-1ST-NCTB2010",
  name: "BANGLA-1ST-NCTB2010",
  nodes: [
    {
      key: "main_book",
      parentKey: null,
      serverName: "Main Book",
      sortOrder: 1,
      supportsChapters: false,
      supportsTopics: false,
      canEditName: true,
      canUploadImage: true,
      contentTypes: [],
    },
    {
      key: "stories",
      parentKey: "main_book",
      serverName: "Stories",
      sortOrder: 1,
      supportsChapters: true,
      supportsTopics: false,
      canEditName: true,
      canUploadImage: true,
      contentTypes: [...BASE_CONTENT_TYPES],
    },
    {
      key: "rhymes",
      parentKey: "main_book",
      serverName: "Rhymes",
      sortOrder: 2,
      supportsChapters: true,
      supportsTopics: false,
      canEditName: true,
      canUploadImage: true,
      contentTypes: [...BASE_CONTENT_TYPES],
    },
    {
      key: "assisting_book",
      parentKey: null,
      serverName: "Assisting Book",
      sortOrder: 2,
      supportsChapters: false,
      supportsTopics: false,
      canEditName: true,
      canUploadImage: true,
      contentTypes: [],
    },
    {
      key: "drama",
      parentKey: "assisting_book",
      serverName: "Drama",
      sortOrder: 1,
      supportsChapters: false,
      supportsTopics: false,
      canEditName: true,
      canUploadImage: true,
      contentTypes: [...BASE_CONTENT_TYPES],
    },
    {
      key: "novel",
      parentKey: "assisting_book",
      serverName: "Novel",
      sortOrder: 2,
      supportsChapters: false,
      supportsTopics: false,
      canEditName: true,
      canUploadImage: true,
      contentTypes: [...BASE_CONTENT_TYPES],
    },
  ],
};
const PHY_TEMPLATE = {
  code: "PHY-CHEM-BIO-NCTB2010",
  name: "PHY-CHEM-BIO-NCTB2010",
  nodes: [
    {
      key: "chapters",
      parentKey: null,
      serverName: "Chapters",
      sortOrder: 1,
      supportsChapters: true,
      supportsTopics: true,
      canEditName: false,
      canUploadImage: false,
      contentTypes: [...CONTENT_TYPES],
    },
  ],
};
const BANGLA_TEMPLATE_CODE = "BANGLA-1ST-NCTB2010";
const BANGLA_ROOT_KEYS = ["main_book", "assisting_book"];
const BANGLA_CHILD_KEYS = {
  main_book: ["stories", "rhymes"],
  assisting_book: ["drama", "novel"],
};
const BANGLA_LEAF_KEYS = new Set(["stories", "rhymes", "drama", "novel"]);

function parsePositiveId(value, label) {
  const id = Number.parseInt(String(value || ""), 10);
  if (!Number.isInteger(id) || id <= 0) throw new HttpError(400, `Invalid ${label}`);
  return id;
}

function normalizeName(value, label = "name", min = 2, max = 120) {
  const text = String(value || "").trim();
  if (text.length < min || text.length > max) {
    throw new HttpError(400, `${label} must be between ${min} and ${max} characters`);
  }
  return text;
}

function normalizeClassId(value) {
  return parsePositiveId(value, "class id");
}

function normalizeBoolean(value) {
  if (typeof value === "boolean") return value;
  const text = String(value || "").trim().toLowerCase();
  return text === "1" || text === "true" || text === "yes" || text === "on";
}

function normalizeOrdinalLabel(value, { label = "number", max = 24, required = false } = {}) {
  const text = String(value || "").trim();
  if (!text) {
    if (required) throw new HttpError(400, `${label} is required`);
    return "";
  }
  if (text.length > max) throw new HttpError(400, `${label} must be ${max} characters or fewer`);
  return text;
}

function normalizeContextType(value) {
  const type = String(value || "").trim().toLowerCase();
  if (type !== "node" && type !== "chapter" && type !== "topic") {
    throw new HttpError(400, "Context type must be node, chapter, or topic");
  }
  return type;
}

function normalizeContentType(value) {
  const type = String(value || "").trim().toLowerCase();
  if (!isKnownContentType(type)) {
    throw new HttpError(400, "Invalid content type");
  }
  return type;
}

function sanitizeHtml(value, { max = 40_000, required = true } = {}) {
  const raw = String(value || "").trim();
  if (!raw) {
    if (required) throw new HttpError(400, "Content is required");
    return "";
  }
  const cleaned = raw
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/\son[a-z]+=\"[^\"]*\"/gi, "")
    .replace(/\son[a-z]+=\'[^\']*\'/gi, "");

  if (cleaned.length > max) throw new HttpError(400, `Content must be ${max} characters or fewer`);
  return cleaned;
}

function safeJsonParse(value, fallback) {
  try {
    return JSON.parse(String(value || ""));
  } catch {
    return fallback;
  }
}

function templateToStructure(template = BANGLA_TEMPLATE) {
  return {
    code: template.code,
    name: template.name,
    nodes: template.nodes,
  };
}

function boolFromInt(value) {
  return Number(value || 0) === 1;
}

function imageUrlForKey(key) {
  const normalized = String(key || "").trim();
  if (!normalized) return "";
  return `/api/workspace/files/object?key=${encodeURIComponent(normalized)}`;
}

function mapTemplateNode(node) {
  const contentTypes = Array.isArray(node?.contentTypes) ? node.contentTypes.filter((type) => isKnownContentType(type)) : [];
  return {
    key: String(node?.key || ""),
    parentKey: node?.parentKey ? String(node.parentKey) : null,
    serverName: String(node?.serverName || "").trim(),
    sortOrder: Number(node?.sortOrder || 0),
    supportsChapters: Boolean(node?.supportsChapters),
    supportsTopics: Boolean(node?.supportsTopics),
    canEditName: node?.canEditName !== false,
    canUploadImage: node?.canUploadImage !== false,
    contentTypes,
  };
}

function parseTemplateStructure(raw) {
  const parsed = safeJsonParse(raw, null);
  const nodes = Array.isArray(parsed?.nodes) ? parsed.nodes.map(mapTemplateNode).filter((node) => node.key && node.serverName) : [];
  if (!nodes.length) {
    return templateToStructure(BANGLA_TEMPLATE);
  }
  return {
    code: String(parsed?.code || BANGLA_TEMPLATE.code),
    name: String(parsed?.name || BANGLA_TEMPLATE.name),
    nodes,
  };
}

function contentTypeMeta(contentTypes = []) {
  return contentTypeMetaList(contentTypes);
}

function serializeSubjectNode(row) {
  const parsedContentTypes = safeJsonParse(row?.content_types_json, []);
  const contentTypes = Array.isArray(parsedContentTypes) ? parsedContentTypes.filter((type) => isKnownContentType(type)) : [];

  return {
    id: Number(row?.id || 0),
    parentNodeId: row?.parent_node_id == null ? null : Number(row.parent_node_id),
    templateNodeKey: String(row?.template_node_key || ""),
    serverName: String(row?.server_name || ""),
    displayName: String(row?.display_name || ""),
    sortOrder: Number(row?.sort_order || 0),
    supportsChapters: boolFromInt(row?.supports_chapters),
    supportsTopics: boolFromInt(row?.supports_topics),
    canEditName: boolFromInt(row?.can_edit_name),
    canUploadImage: boolFromInt(row?.can_upload_image),
    imageKey: String(row?.image_key || ""),
    imageUrl: imageUrlForKey(row?.image_key),
    contentTypes,
    contentTypeMeta: contentTypeMeta(contentTypes),
  };
}

function serializeChapter(row) {
  return {
    id: Number(row?.id || 0),
    nodeId: Number(row?.node_id || 0),
    chapterNumber: String(row?.sort_order || row?.chapter_number || ""),
    name: String(row?.name || ""),
    topicsEnabled: boolFromInt(row?.topics_enabled),
    imageKey: String(row?.image_key || ""),
    imageUrl: imageUrlForKey(row?.image_key),
    sortOrder: Number(row?.sort_order || 0),
    createdAt: String(row?.created_at || ""),
  };
}

function serializeTopic(row) {
  return {
    id: Number(row?.id || 0),
    chapterId: Number(row?.chapter_id || 0),
    topicNumber: String(row?.topic_number || ""),
    name: String(row?.name || ""),
    imageKey: String(row?.image_key || ""),
    imageUrl: imageUrlForKey(row?.image_key),
    sortOrder: Number(row?.sort_order || 0),
    createdAt: String(row?.created_at || ""),
  };
}

function serializeSubject(row) {
  const classLevel = Number(row?.class_level || 0);
  const className = String(row?.class_name || "").trim();
  return {
    id: Number(row?.id || 0),
    name: String(row?.name || ""),
    classId: Number(row?.class_id || 0),
    classLevel,
    className: className || (classLevel > 0 ? `Class ${classLevel}` : ""),
    templateId: Number(row?.template_id || 0),
    templateCode: String(row?.template_code || ""),
    templateName: String(row?.template_name || ""),
    thumbnailKey: String(row?.thumbnail_key || ""),
    thumbnailUrl: imageUrlForKey(row?.thumbnail_key),
    createdAt: String(row?.created_at || ""),
  };
}

function serializeModuleClass(row) {
  return {
    id: Number(row?.id || 0),
    name: String(row?.name || ""),
    imageKey: String(row?.image_key || ""),
    imageUrl: imageUrlForKey(row?.image_key),
    publicImageUrl: `/api/public/classes/${Number(row?.id || 0)}/image`,
    showInHome: boolFromInt(row?.show_in_home),
    sortOrder: Number(row?.sort_order || 0),
    createdAt: String(row?.created_at || ""),
  };
}

function orderedNodesByTemplateKeys(nodes, keys) {
  const nodeMap = new Map();
  for (const node of nodes) {
    const key = String(node?.templateNodeKey || "").trim();
    if (!key || nodeMap.has(key)) continue;
    nodeMap.set(key, node);
  }
  return keys.map((key) => nodeMap.get(key)).filter(Boolean);
}

async function listBanglaOrderedNodes(db, subjectId, keys) {
  const allRows = await listAllSubjectNodes(db, { subjectId });
  const allNodes = allRows.map(serializeSubjectNode);
  return orderedNodesByTemplateKeys(allNodes, keys);
}

function parseDataImage(payload) {
  const dataUrl = String(payload || "").trim();
  if (!dataUrl) return null;
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,([A-Za-z0-9+/=]+)$/);
  if (!match) throw new HttpError(400, "Invalid image payload");

  const contentType = match[1].toLowerCase();
  if (!["image/jpeg", "image/png", "image/webp"].includes(contentType)) {
    throw new HttpError(400, "Unsupported image format");
  }

  const binary = Uint8Array.from(atob(match[2]), (char) => char.charCodeAt(0));
  if (!binary.byteLength) throw new HttpError(400, "Image is empty");
  if (binary.byteLength > 1_200_000) throw new HttpError(413, "Image is too large after compression");

  const ext = contentType === "image/png" ? "png" : contentType === "image/webp" ? "webp" : "jpg";
  return { binary, contentType, ext };
}

async function safeDeleteImage(env, key) {
  const normalized = String(key || "").trim();
  if (!normalized || !env?.BUCKET || typeof env.BUCKET.delete !== "function") return;
  try {
    await env.BUCKET.delete(normalized);
  } catch {
    // Ignore cleanup failures for stale objects.
  }
}

async function uploadOptionalImage(env, { dataUrl, keyPrefix }) {
  const parsedImage = parseDataImage(dataUrl);
  if (!parsedImage) return "";

  if (!env?.BUCKET || typeof env.BUCKET.put !== "function") {
    throw new HttpError(500, "Image storage is not configured");
  }

  const key = `${keyPrefix}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${parsedImage.ext}`;
  await env.BUCKET.put(key, parsedImage.binary, {
    httpMetadata: { contentType: parsedImage.contentType, cacheControl: "public, max-age=604800" },
  });
  return key;
}

async function ensureDefaultTemplates(db) {
  const defaults = [BANGLA_TEMPLATE, PHY_TEMPLATE];
  for (const template of defaults) {
    await upsertSubjectTemplate(db, {
      code: template.code,
      name: template.name,
      structureJson: JSON.stringify(templateToStructure(template)),
    });
  }
}

function hierarchyRowsFromTemplate(structure) {
  const nodes = Array.isArray(structure?.nodes) ? structure.nodes.map(mapTemplateNode) : [];
  const grouped = new Map();
  nodes.forEach((node) => {
    const parentKey = node.parentKey || "__root__";
    if (!grouped.has(parentKey)) grouped.set(parentKey, []);
    grouped.get(parentKey).push(node);
  });
  for (const list of grouped.values()) {
    list.sort((a, b) => (a.sortOrder - b.sortOrder) || a.serverName.localeCompare(b.serverName));
  }

  const rows = [];

  const walk = (parentKey, depth) => {
    const list = grouped.get(parentKey) || [];
    for (const node of list) {
      rows.push({
        id: `node:${node.key}`,
        name: node.serverName,
        depth,
        editable: node.canEditName,
        imageUpload: node.canUploadImage,
        supportsChapters: node.supportsChapters,
        kind: "node",
      });

      if (node.supportsChapters) {
        rows.push({
          id: `chapters:${node.key}`,
          name: "Chapters",
          depth: depth + 1,
          editable: true,
          imageUpload: true,
          supportsChapters: false,
          kind: "chapters",
        });

        if (node.supportsTopics) {
          rows.push({
            id: `topics:${node.key}`,
            name: "Topics (optional per chapter)",
            depth: depth + 2,
            editable: true,
            imageUpload: true,
            supportsChapters: false,
            kind: "topics",
          });
        }

        node.contentTypes.forEach((type) => {
          rows.push({
            id: `content:${node.key}:${node.supportsTopics ? "topic-or-chapter" : "chapter"}:${type}`,
            name: contentLabelForType(type),
            depth: node.supportsTopics ? depth + 3 : depth + 2,
            editable: false,
            imageUpload: false,
            supportsChapters: false,
            kind: "content",
          });
        });
      } else if (node.contentTypes.length) {
        node.contentTypes.forEach((type) => {
          rows.push({
            id: `content:${node.key}:${type}`,
            name: contentLabelForType(type),
            depth: depth + 1,
            editable: false,
            imageUpload: false,
            supportsChapters: false,
            kind: "content",
          });
        });
      }

      walk(node.key, depth + 1);
    }
  };

  walk("__root__", 0);
  return rows;
}

async function getSubjectOrThrow(db, subjectId) {
  const subject = await findSubjectById(db, subjectId);
  if (!subject) throw new HttpError(404, "Subject not found");
  return serializeSubject(subject);
}

async function getNodeOrThrow(db, subjectId, nodeId) {
  const node = await findSubjectNodeById(db, { subjectId, nodeId });
  if (!node) throw new HttpError(404, "Node not found");
  return serializeSubjectNode(node);
}

async function resolveContentContext(db, subjectId, contextTypeRaw, contextIdRaw) {
  const contextType = normalizeContextType(contextTypeRaw);
  const contextId = parsePositiveId(contextIdRaw, "context id");

  if (contextType === "node") {
    const node = await getNodeOrThrow(db, subjectId, contextId);
    return {
      contextType,
      contextId,
      node,
      chapter: null,
      contentTypes: node.contentTypes,
      label: node.displayName,
      parentNode: node.parentNodeId ? await getNodeOrThrow(db, subjectId, node.parentNodeId) : null,
    };
  }

  if (contextType === "chapter") {
    const chapterRow = await findSubjectChapterById(db, { subjectId, chapterId: contextId });
    if (!chapterRow) throw new HttpError(404, "Chapter not found");
    const chapter = serializeChapter(chapterRow);
    const node = await getNodeOrThrow(db, subjectId, chapter.nodeId);
    return {
      contextType,
      contextId,
      node,
      chapter,
      topic: null,
      contentTypes: node.contentTypes,
      label: chapter.name,
      parentNode: node,
    };
  }

  const topicRow = await findSubjectTopicById(db, { subjectId, topicId: contextId });
  if (!topicRow) throw new HttpError(404, "Topic not found");
  const topic = serializeTopic(topicRow);
  const topicChapterRow = await findSubjectChapterById(db, { subjectId, chapterId: topic.chapterId });
  if (!topicChapterRow) throw new HttpError(404, "Chapter not found");
  const chapter = serializeChapter(topicChapterRow);
  const node = await getNodeOrThrow(db, subjectId, chapter.nodeId);
  return {
    contextType,
    contextId,
    node,
    chapter,
    topic,
    contentTypes: node.contentTypes,
    label: topic.name,
    parentNode: chapter,
  };
}

function validateMcqPayload(body) {
  const options = Array.isArray(body?.options) ? body.options : [];
  if (options.length !== 4) throw new HttpError(400, "MCQ requires exactly 4 options");
  const sanitizedOptions = options.map((option) => sanitizeHtml(option, { max: 4_000, required: true }));
  const correctOption = String(body?.correctOption || "").trim().toUpperCase();
  if (!["A", "B", "C", "D"].includes(correctOption)) {
    throw new HttpError(400, "Correct option must be A, B, C, or D");
  }
  return {
    options: sanitizedOptions,
    correctOption,
  };
}

function serializeContentItem(row) {
  const options = safeJsonParse(row?.options_json, []);
  return {
    id: Number(row?.id || 0),
    contextType: String(row?.context_type || ""),
    contextId: Number(row?.context_id || 0),
    contentType: String(row?.content_type || ""),
    body: String(row?.body || ""),
    options: Array.isArray(options) ? options.map((option) => String(option || "")) : [],
    correctOption: String(row?.correct_option || ""),
    imageKey: String(row?.image_key || ""),
    imageUrl: imageUrlForKey(row?.image_key),
    sortOrder: Number(row?.sort_order || 0),
    createdAt: String(row?.created_at || ""),
    updatedAt: String(row?.updated_at || ""),
  };
}

export async function listModuleTemplates(env) {
  await ensureDefaultTemplates(env.DB);
  const rows = await listSubjectTemplates(env.DB);
  return {
    templates: rows.map((row) => ({
      id: Number(row?.id || 0),
      code: String(row?.code || ""),
      name: String(row?.name || ""),
      subjectCount: Number(row?.subject_count || 0),
      createdAt: String(row?.created_at || ""),
    })),
  };
}

export async function getModuleTemplateDetail(env, templateIdRaw) {
  await ensureDefaultTemplates(env.DB);
  const templateId = parsePositiveId(templateIdRaw, "template id");
  const row = await findSubjectTemplateById(env.DB, templateId);
  if (!row) throw new HttpError(404, "Template not found");

  const structure = parseTemplateStructure(row?.structure_json);
  return {
    template: {
      id: Number(row?.id || 0),
      code: String(row?.code || ""),
      name: String(row?.name || ""),
      rows: hierarchyRowsFromTemplate(structure),
    },
  };
}

export async function listModuleClassesForAdmin(env) {
  const rows = await listModuleClasses(env.DB);
  return {
    classes: rows.map(serializeModuleClass),
  };
}

export async function createModuleClassEntry(request, env) {
  const body = await readBody(request, { maxBodySize: 1_600_000 });
  const name = normalizeName(body?.name, "Class name", 2, 120);
  const showInHome = normalizeBoolean(body?.showInHome);
  const sortOrder = await nextModuleClassSortOrder(env.DB);
  const imageKey = await uploadOptionalImage(env, {
    dataUrl: body?.imageData,
    keyPrefix: "modules/classes",
  });

  const classId = await createModuleClass(env.DB, {
    name,
    imageKey,
    showInHome,
    sortOrder,
  });
  const row = await findModuleClassById(env.DB, classId);
  return {
    ok: true,
    classItem: serializeModuleClass(row),
  };
}

export async function updateModuleClassEntry(request, env, classIdRaw) {
  const classId = parsePositiveId(classIdRaw, "class id");
  const current = await findModuleClassById(env.DB, classId);
  if (!current) throw new HttpError(404, "Class not found");
  const body = await readBody(request, { maxBodySize: 1_600_000 });

  const hasName = String(body?.name ?? "").trim().length > 0;
  const nextName = hasName ? normalizeName(body?.name, "Class name", 2, 120) : String(current?.name || "");
  const hasShowFlag = body?.showInHome !== undefined;
  const nextShowInHome = hasShowFlag ? normalizeBoolean(body?.showInHome) : boolFromInt(current?.show_in_home);

  const requestedClear = Boolean(body?.clearImage);
  const hasImageData = Boolean(String(body?.imageData || "").trim());
  let nextImageKey;
  if (hasImageData) {
    nextImageKey = await uploadOptionalImage(env, {
      dataUrl: body?.imageData,
      keyPrefix: `modules/classes/${classId}`,
    });
  } else if (requestedClear) {
    nextImageKey = "";
  }

  await updateModuleClass(env.DB, {
    classId,
    name: nextName,
    imageKey: nextImageKey,
    showInHome: nextShowInHome,
  });

  if (nextImageKey !== undefined && current?.image_key && current.image_key !== nextImageKey) {
    await safeDeleteImage(env, current.image_key);
  }

  const updated = await findModuleClassById(env.DB, classId);
  return {
    ok: true,
    classItem: serializeModuleClass(updated),
  };
}

export async function listPublicModuleClasses(env, options = {}) {
  const onlyHome = options?.onlyHome === true;
  const rows = await listModuleClasses(env.DB, { onlyHome });
  return {
    classes: rows.map(serializeModuleClass),
  };
}

export async function getPublicModuleClassImageMeta(env, classIdRaw) {
  const classId = parsePositiveId(classIdRaw, "class id");
  const row = await findModuleClassById(env.DB, classId);
  if (!row) throw new HttpError(404, "Class not found");
  const key = String(row?.image_key || "").trim();
  if (!key) throw new HttpError(404, "Class image not found");
  return { key };
}

export async function getPublicModuleClassSubjects(env, classIdRaw) {
  const classId = parsePositiveId(classIdRaw, "class id");
  const classRow = await findModuleClassById(env.DB, classId);
  if (!classRow) throw new HttpError(404, "Class not found");
  const rows = await listSubjectsByClassId(env.DB, { classId });
  return {
    classItem: serializeModuleClass(classRow),
    subjects: rows.map(serializeSubject),
  };
}

export async function getModuleClassSubjects(env, classIdRaw) {
  return getPublicModuleClassSubjects(env, classIdRaw);
}

export async function getPublicSubjectBooks(env, subjectIdRaw) {
  const subjectId = parsePositiveId(subjectIdRaw, "subject id");
  const subject = await getSubjectOrThrow(env.DB, subjectId);
  const nodes = (await listAllSubjectNodes(env.DB, { subjectId })).map(serializeSubjectNode);
  const childrenByParent = new Map();
  for (const node of nodes) {
    const parentId = Number(node?.parentNodeId || 0);
    if (!parentId) continue;
    if (!childrenByParent.has(parentId)) childrenByParent.set(parentId, []);
    childrenByParent.get(parentId).push(node);
  }
  for (const list of childrenByParent.values()) {
    list.sort((a, b) => (Number(a?.sortOrder || 0) - Number(b?.sortOrder || 0)) || (Number(a?.id || 0) - Number(b?.id || 0)));
  }

  let roots = nodes.filter((node) => !Number(node?.parentNodeId || 0));
  roots.sort((a, b) => (Number(a?.sortOrder || 0) - Number(b?.sortOrder || 0)) || (Number(a?.id || 0) - Number(b?.id || 0)));

  if (subject.templateCode === BANGLA_TEMPLATE_CODE) {
    const orderedRoots = orderedNodesByTemplateKeys(nodes, BANGLA_ROOT_KEYS);
    if (orderedRoots.length) roots = orderedRoots;
    for (const root of roots) {
      const expectedChildKeys = BANGLA_CHILD_KEYS[String(root?.templateNodeKey || "")] || [];
      if (!expectedChildKeys.length) continue;
      const orderedChildren = orderedNodesByTemplateKeys(nodes, expectedChildKeys).filter((node) => Number(node?.parentNodeId || 0) === Number(root?.id || 0));
      if (orderedChildren.length) childrenByParent.set(Number(root?.id || 0), orderedChildren);
    }
  }

  return {
    subject,
    roots,
    childrenByRoot: roots.map((root) => ({
      rootId: Number(root?.id || 0),
      items: childrenByParent.get(Number(root?.id || 0)) || [],
    })),
  };
}

export async function getPublicSubjectNodeChapters(env, subjectIdRaw, nodeIdRaw) {
  const subjectId = parsePositiveId(subjectIdRaw, "subject id");
  const nodeId = parsePositiveId(nodeIdRaw, "node id");
  const subject = await getSubjectOrThrow(env.DB, subjectId);
  const node = await getNodeOrThrow(env.DB, subjectId, nodeId);
  const chapters = node.supportsChapters
    ? (await listSubjectChapters(env.DB, { subjectId, nodeId })).map(serializeChapter)
    : [];
  return {
    subject,
    node,
    chapters,
  };
}

export async function getPublicChapterReader(env, subjectIdRaw, chapterIdRaw) {
  const subjectId = parsePositiveId(subjectIdRaw, "subject id");
  const chapterId = parsePositiveId(chapterIdRaw, "chapter id");
  const subject = await getSubjectOrThrow(env.DB, subjectId);
  const chapterRow = await findSubjectChapterById(env.DB, { subjectId, chapterId });
  if (!chapterRow) throw new HttpError(404, "Chapter not found");
  const chapter = serializeChapter(chapterRow);
  const node = await getNodeOrThrow(env.DB, subjectId, chapter.nodeId);
  const availableTypes = Array.isArray(node?.contentTypes) ? node.contentTypes : [];
  const contentModules = publicReaderModules(availableTypes);

  const loadByType = async (contentType) => {
    if (!availableTypes.includes(contentType)) return [];
    const rows = await listContentItems(env.DB, {
      subjectId,
      contextType: "chapter",
      contextId: chapter.id,
      contentType,
    });
    return rows.map(serializeContentItem);
  };

  const contentItemsByType = Object.fromEntries(await Promise.all(
    contentModules.map(async (moduleItem) => [moduleItem.key, await loadByType(moduleItem.key)]),
  ));

  return {
    subject,
    node,
    chapter,
    contentModules,
    contentItemsByType,
  };
}

export async function listModuleSubjects(env) {
  await ensureDefaultTemplates(env.DB);
  const rows = await listSubjects(env.DB);
  return {
    subjects: rows.map(serializeSubject),
  };
}

export async function createModuleSubject(request, env, actorId) {
  await ensureDefaultTemplates(env.DB);
  const body = await readBody(request, { maxBodySize: 1_600_000 });
  const name = normalizeName(body?.name, "Subject name", 2, 140);
  const classId = normalizeClassId(body?.classId);
  const templateId = parsePositiveId(body?.templateId, "template id");
  const classRow = await findModuleClassById(env.DB, classId);
  if (!classRow) throw new HttpError(404, "Class not found");

  const templateRow = await findSubjectTemplateById(env.DB, templateId);
  if (!templateRow) throw new HttpError(404, "Template not found");

  const structure = parseTemplateStructure(templateRow?.structure_json);
  const subjectId = await createSubject(env.DB, {
    name,
    classId,
    classLevel: 0,
    templateId,
    createdBy: Number(actorId || 0),
  });

  const hasThumbnailData = Boolean(String(body?.imageData || "").trim());
  if (hasThumbnailData) {
    const thumbnailKey = await uploadOptionalImage(env, {
      dataUrl: body.imageData,
      keyPrefix: `modules/subjects/${subjectId}/thumbnail`,
    });
    await updateSubject(env.DB, { subjectId, thumbnailKey });
  }

  const nodes = Array.isArray(structure?.nodes) ? structure.nodes.map(mapTemplateNode) : [];
  const pending = [...nodes];
  const nodeIdByKey = new Map();

  while (pending.length) {
    let progressed = false;
    for (let i = pending.length - 1; i >= 0; i -= 1) {
      const node = pending[i];
      const parentId = node.parentKey ? nodeIdByKey.get(node.parentKey) : null;
      if (node.parentKey && !parentId) continue;

      const nodeId = await createSubjectNode(env.DB, {
        subjectId,
        parentNodeId: parentId || null,
        templateNodeKey: node.key,
        serverName: node.serverName,
        displayName: node.serverName,
        sortOrder: node.sortOrder,
        supportsChapters: node.supportsChapters,
        supportsTopics: node.supportsTopics,
        canEditName: node.canEditName,
        canUploadImage: node.canUploadImage,
        contentTypesJson: JSON.stringify(node.contentTypes),
      });
      nodeIdByKey.set(node.key, nodeId);
      pending.splice(i, 1);
      progressed = true;
    }

    if (!progressed) {
      throw new HttpError(500, "Template hierarchy could not be instantiated");
    }
  }

  return { ok: true, subjectId };
}

export async function updateModuleSubject(request, env, subjectIdRaw) {
  const subjectId = parsePositiveId(subjectIdRaw, "subject id");
  const current = await getSubjectOrThrow(env.DB, subjectId);
  const body = await readBody(request, { maxBodySize: 1_600_000 });

  let nextName = current.name;
  const rawName = String(body?.name ?? "").trim();
  if (rawName) {
    nextName = normalizeName(rawName, "Subject name", 2, 140);
  }

  let nextClassId;
  const hasClassId = body?.classId !== undefined && body?.classId !== null && String(body?.classId).trim() !== "";
  if (hasClassId) {
    nextClassId = normalizeClassId(body?.classId);
    const classRow = await findModuleClassById(env.DB, nextClassId);
    if (!classRow) throw new HttpError(404, "Class not found");
  }

  const requestedClear = Boolean(body?.clearImage);
  const hasImageData = Boolean(String(body?.imageData || "").trim());
  let nextThumbnailKey;

  if (hasImageData) {
    nextThumbnailKey = await uploadOptionalImage(env, {
      dataUrl: body.imageData,
      keyPrefix: `modules/subjects/${subjectId}/thumbnail`,
    });
  } else if (requestedClear) {
    nextThumbnailKey = "";
  }

  await updateSubject(env.DB, {
    subjectId,
    name: nextName,
    thumbnailKey: nextThumbnailKey,
    classId: nextClassId,
  });

  if (nextThumbnailKey !== undefined && current.thumbnailKey && current.thumbnailKey !== nextThumbnailKey) {
    await safeDeleteImage(env, current.thumbnailKey);
  }

  const updated = await getSubjectOrThrow(env.DB, subjectId);
  return { ok: true, subject: updated };
}

export async function deleteModuleSubject(env, subjectIdRaw) {
  const subjectId = parsePositiveId(subjectIdRaw, "subject id");
  const subject = await getSubjectOrThrow(env.DB, subjectId);
  const [nodes, chapters, topics, contentItems] = await Promise.all([
    listAllSubjectNodes(env.DB, { subjectId }),
    listAllSubjectChaptersBySubject(env.DB, { subjectId }),
    listAllSubjectTopicsBySubject(env.DB, { subjectId }),
    listAllContentItemsBySubject(env.DB, { subjectId }),
  ]);

  await deleteSubjectContentItemsBySubjectId(env.DB, { subjectId });
  await deleteSubjectTopicsBySubjectId(env.DB, { subjectId });
  await deleteSubjectChaptersBySubjectId(env.DB, { subjectId });
  await deleteSubjectNodesBySubjectId(env.DB, { subjectId });
  await deleteSubjectById(env.DB, { subjectId });

  const keys = new Set();
  const collectKey = (value) => {
    const key = String(value || "").trim();
    if (key) keys.add(key);
  };
  collectKey(subject.thumbnailKey);
  for (const node of nodes) collectKey(node?.image_key);
  for (const chapter of chapters) collectKey(chapter?.image_key);
  for (const topic of topics) collectKey(topic?.image_key);
  for (const item of contentItems) collectKey(item?.image_key);

  for (const key of keys) {
    await safeDeleteImage(env, key);
  }

  return { ok: true };
}

export async function getModuleSubjectOverview(env, subjectIdRaw) {
  const subjectId = parsePositiveId(subjectIdRaw, "subject id");
  const subject = await getSubjectOrThrow(env.DB, subjectId);
  const rows = await listSubjectNodesByParent(env.DB, { subjectId, parentNodeId: null });
  let nodes = rows.map(serializeSubjectNode);

  if (subject.templateCode === BANGLA_TEMPLATE_CODE) {
    const ordered = await listBanglaOrderedNodes(env.DB, subjectId, BANGLA_ROOT_KEYS);
    if (ordered.length) nodes = ordered;
  }

  return {
    subject,
    nodes,
  };
}

export async function getModuleSubjectNodeView(env, subjectIdRaw, nodeIdRaw) {
  const subjectId = parsePositiveId(subjectIdRaw, "subject id");
  const nodeId = parsePositiveId(nodeIdRaw, "node id");

  const subject = await getSubjectOrThrow(env.DB, subjectId);
  const node = await getNodeOrThrow(env.DB, subjectId, nodeId);
  const parentNode = node.parentNodeId ? await getNodeOrThrow(env.DB, subjectId, node.parentNodeId) : null;
  const children = await listSubjectNodesByParent(env.DB, { subjectId, parentNodeId: node.id });
  let childNodes = children.map(serializeSubjectNode);

  if (subject.templateCode === BANGLA_TEMPLATE_CODE) {
    const expectedChildKeys = BANGLA_CHILD_KEYS[node.templateNodeKey];
    if (Array.isArray(expectedChildKeys) && expectedChildKeys.length) {
      const orderedChildren = await listBanglaOrderedNodes(env.DB, subjectId, expectedChildKeys);
      childNodes = orderedChildren;
    } else if (BANGLA_LEAF_KEYS.has(node.templateNodeKey)) {
      childNodes = [];
    }
  }

  const chapters = node.supportsChapters
    ? (await listSubjectChapters(env.DB, { subjectId, nodeId: node.id })).map(serializeChapter)
    : [];

  return {
    subject,
    node,
    parentNode,
    childNodes,
    chapters,
    contentTypes: contentTypeMeta(node.contentTypes),
  };
}

export async function updateModuleSubjectNode(request, env, subjectIdRaw, nodeIdRaw) {
  const subjectId = parsePositiveId(subjectIdRaw, "subject id");
  const nodeId = parsePositiveId(nodeIdRaw, "node id");
  const body = await readBody(request, { maxBodySize: 1_600_000 });

  const node = await getNodeOrThrow(env.DB, subjectId, nodeId);

  let displayName = node.displayName;
  if (node.canEditName) {
    const candidate = String(body?.displayName ?? "").trim();
    if (candidate) {
      displayName = normalizeName(candidate, "Display name", 2, 120);
    }
  }

  const requestedClear = Boolean(body?.clearImage);
  const hasImageData = Boolean(String(body?.imageData || "").trim());
  let nextImageKey;

  if (node.canUploadImage) {
    if (hasImageData) {
      nextImageKey = await uploadOptionalImage(env, {
        dataUrl: body.imageData,
        keyPrefix: `modules/subjects/${subjectId}/nodes/${nodeId}`,
      });
    } else if (requestedClear) {
      nextImageKey = "";
    }
  }

  await updateSubjectNode(env.DB, {
    subjectId,
    nodeId,
    displayName,
    imageKey: nextImageKey,
  });

  if (nextImageKey !== undefined && node.imageKey && node.imageKey !== nextImageKey) {
    await safeDeleteImage(env, node.imageKey);
  }

  const updated = await getNodeOrThrow(env.DB, subjectId, nodeId);
  return { ok: true, node: updated };
}

export async function createModuleChapter(request, env, subjectIdRaw) {
  const subjectId = parsePositiveId(subjectIdRaw, "subject id");
  const body = await readBody(request, { maxBodySize: 1_600_000 });

  const nodeId = parsePositiveId(body?.nodeId, "node id");
  const node = await getNodeOrThrow(env.DB, subjectId, nodeId);
  if (!node.supportsChapters) throw new HttpError(400, "This section does not support chapters");

  const chapterName = normalizeName(body?.name, "Chapter name", 2, 140);
  const topicsEnabled = node.supportsTopics ? Boolean(body?.topicsEnabled) : false;
  const sortOrder = await nextChapterSortOrder(env.DB, { subjectId, nodeId });
  const chapterNumber = String(sortOrder);
  const imageKey = await uploadOptionalImage(env, {
    dataUrl: body?.imageData,
    keyPrefix: `modules/subjects/${subjectId}/chapters/${nodeId}`,
  });

  const chapterId = await createSubjectChapter(env.DB, {
    subjectId,
    nodeId,
    chapterNumber,
    name: chapterName,
    topicsEnabled,
    imageKey,
    sortOrder,
  });

  const chapterRow = await findSubjectChapterById(env.DB, { subjectId, chapterId });
  return {
    ok: true,
    chapter: serializeChapter(chapterRow),
  };
}

export async function updateModuleChapter(request, env, subjectIdRaw, chapterIdRaw) {
  const subjectId = parsePositiveId(subjectIdRaw, "subject id");
  const chapterId = parsePositiveId(chapterIdRaw, "chapter id");
  const body = await readBody(request, { maxBodySize: 1_600_000 });

  const current = await findSubjectChapterById(env.DB, { subjectId, chapterId });
  if (!current) throw new HttpError(404, "Chapter not found");

  const node = await getNodeOrThrow(env.DB, subjectId, Number(current.node_id || 0));
  const name = String(body?.name || "").trim() ? normalizeName(body?.name, "Chapter name", 2, 140) : String(current?.name || "");
  const chapterNumber = String(current?.chapter_number || "");
  const topicsEnabled = body?.topicsEnabled === undefined
    ? boolFromInt(current?.topics_enabled)
    : (node.supportsTopics ? Boolean(body?.topicsEnabled) : false);
  const requestedClear = Boolean(body?.clearImage);
  const hasImageData = Boolean(String(body?.imageData || "").trim());
  let nextImageKey;

  if (hasImageData) {
    nextImageKey = await uploadOptionalImage(env, {
      dataUrl: body.imageData,
      keyPrefix: `modules/subjects/${subjectId}/chapters/${current.node_id}`,
    });
  } else if (requestedClear) {
    nextImageKey = "";
  }

  await updateSubjectChapter(env.DB, {
    subjectId,
    chapterId,
    chapterNumber,
    name,
    topicsEnabled,
    imageKey: nextImageKey,
  });

  if (nextImageKey !== undefined && current.image_key && current.image_key !== nextImageKey) {
    await safeDeleteImage(env, current.image_key);
  }

  const updated = await findSubjectChapterById(env.DB, { subjectId, chapterId });
  return { ok: true, chapter: serializeChapter(updated) };
}

export async function moveModuleChapter(request, env, subjectIdRaw, chapterIdRaw) {
  const subjectId = parsePositiveId(subjectIdRaw, "subject id");
  const chapterId = parsePositiveId(chapterIdRaw, "chapter id");
  const body = await readBody(request, { maxBodySize: 50_000 });
  const direction = String(body?.direction || "").trim().toLowerCase();
  if (direction !== "up" && direction !== "down") {
    throw new HttpError(400, "Direction must be up or down");
  }

  const current = await findSubjectChapterById(env.DB, { subjectId, chapterId });
  if (!current) throw new HttpError(404, "Chapter not found");

  const nodeId = Number(current?.node_id || 0);
  const rows = await listSubjectChapters(env.DB, { subjectId, nodeId });
  const chapterIds = rows.map((row) => Number(row?.id || 0)).filter((id) => id > 0);
  const currentIndex = chapterIds.indexOf(chapterId);
  if (currentIndex < 0 || chapterIds.length < 2) {
    const unchanged = await findSubjectChapterById(env.DB, { subjectId, chapterId });
    return { ok: true, moved: false, chapter: serializeChapter(unchanged) };
  }

  const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
  if (targetIndex < 0 || targetIndex >= chapterIds.length) {
    const unchanged = await findSubjectChapterById(env.DB, { subjectId, chapterId });
    return { ok: true, moved: false, chapter: serializeChapter(unchanged) };
  }

  const reordered = chapterIds.slice();
  const temp = reordered[currentIndex];
  reordered[currentIndex] = reordered[targetIndex];
  reordered[targetIndex] = temp;
  await reorderSubjectChapters(env.DB, {
    subjectId,
    nodeId,
    chapterIds: reordered,
  });

  const updated = await findSubjectChapterById(env.DB, { subjectId, chapterId });
  return { ok: true, moved: true, chapter: serializeChapter(updated) };
}

export async function deleteModuleChapter(env, subjectIdRaw, chapterIdRaw) {
  const subjectId = parsePositiveId(subjectIdRaw, "subject id");
  const chapterId = parsePositiveId(chapterIdRaw, "chapter id");

  const chapter = await findSubjectChapterById(env.DB, { subjectId, chapterId });
  if (!chapter) throw new HttpError(404, "Chapter not found");

  const topics = await listAllSubjectTopicsByChapter(env.DB, { subjectId, chapterId });
  const existingItems = await listAllContentItemsByContext(env.DB, {
    subjectId,
    contextType: "chapter",
    contextId: chapterId,
  });
  const topicItems = [];
  for (const topic of topics) {
    const items = await listAllContentItemsByContext(env.DB, {
      subjectId,
      contextType: "topic",
      contextId: Number(topic?.id || 0),
    });
    topicItems.push(...items);
  }

  await deleteContentItemsByContext(env.DB, {
    subjectId,
    contextType: "chapter",
    contextId: chapterId,
  });
  for (const topic of topics) {
    await deleteContentItemsByContext(env.DB, {
      subjectId,
      contextType: "topic",
      contextId: Number(topic?.id || 0),
    });
    await deleteSubjectTopic(env.DB, { subjectId, topicId: Number(topic?.id || 0) });
  }
  await deleteSubjectChapter(env.DB, { subjectId, chapterId });

  if (chapter.image_key) await safeDeleteImage(env, chapter.image_key);
  for (const item of existingItems) {
    if (item?.image_key) await safeDeleteImage(env, item.image_key);
  }
  for (const topic of topics) {
    if (topic?.image_key) await safeDeleteImage(env, topic.image_key);
  }
  for (const item of topicItems) {
    if (item?.image_key) await safeDeleteImage(env, item.image_key);
  }

  return { ok: true };
}

export async function getModuleChapterView(env, subjectIdRaw, chapterIdRaw) {
  const subjectId = parsePositiveId(subjectIdRaw, "subject id");
  const chapterId = parsePositiveId(chapterIdRaw, "chapter id");

  const subject = await getSubjectOrThrow(env.DB, subjectId);
  const chapterRow = await findSubjectChapterById(env.DB, { subjectId, chapterId });
  if (!chapterRow) throw new HttpError(404, "Chapter not found");
  const chapter = serializeChapter(chapterRow);
  const node = await getNodeOrThrow(env.DB, subjectId, chapter.nodeId);
  const topics = chapter.topicsEnabled
    ? (await listSubjectTopics(env.DB, { subjectId, chapterId: chapter.id })).map(serializeTopic)
    : [];

  return {
    subject,
    node,
    chapter,
    topics,
    contentTypes: contentTypeMeta(node.contentTypes),
  };
}

export async function createModuleTopic(request, env, subjectIdRaw) {
  const subjectId = parsePositiveId(subjectIdRaw, "subject id");
  const body = await readBody(request, { maxBodySize: 1_600_000 });
  const chapterId = parsePositiveId(body?.chapterId, "chapter id");
  const chapterRow = await findSubjectChapterById(env.DB, { subjectId, chapterId });
  if (!chapterRow) throw new HttpError(404, "Chapter not found");
  const chapter = serializeChapter(chapterRow);
  if (!chapter.topicsEnabled) throw new HttpError(400, "Topics are disabled for this chapter");

  const topicNumber = normalizeOrdinalLabel(body?.topicNumber, { label: "Topic number", max: 24, required: false });
  const name = normalizeName(body?.name, "Topic name", 2, 140);
  const sortOrder = await nextTopicSortOrder(env.DB, { subjectId, chapterId });
  const imageKey = await uploadOptionalImage(env, {
    dataUrl: body?.imageData,
    keyPrefix: `modules/subjects/${subjectId}/topics/${chapterId}`,
  });

  const topicId = await createSubjectTopic(env.DB, {
    subjectId,
    chapterId,
    topicNumber,
    name,
    imageKey,
    sortOrder,
  });
  const created = await findSubjectTopicById(env.DB, { subjectId, topicId });
  return {
    ok: true,
    topic: serializeTopic(created),
  };
}

export async function updateModuleTopic(request, env, subjectIdRaw, topicIdRaw) {
  const subjectId = parsePositiveId(subjectIdRaw, "subject id");
  const topicId = parsePositiveId(topicIdRaw, "topic id");
  const body = await readBody(request, { maxBodySize: 1_600_000 });

  const current = await findSubjectTopicById(env.DB, { subjectId, topicId });
  if (!current) throw new HttpError(404, "Topic not found");
  const name = String(body?.name || "").trim() ? normalizeName(body?.name, "Topic name", 2, 140) : String(current?.name || "");
  const topicNumber = body?.topicNumber === undefined
    ? String(current?.topic_number || "")
    : normalizeOrdinalLabel(body?.topicNumber, { label: "Topic number", max: 24, required: false });
  const requestedClear = Boolean(body?.clearImage);
  const hasImageData = Boolean(String(body?.imageData || "").trim());
  let nextImageKey;

  if (hasImageData) {
    nextImageKey = await uploadOptionalImage(env, {
      dataUrl: body?.imageData,
      keyPrefix: `modules/subjects/${subjectId}/topics/${current.chapter_id}`,
    });
  } else if (requestedClear) {
    nextImageKey = "";
  }

  await updateSubjectTopic(env.DB, {
    subjectId,
    topicId,
    topicNumber,
    name,
    imageKey: nextImageKey,
  });

  if (nextImageKey !== undefined && current.image_key && current.image_key !== nextImageKey) {
    await safeDeleteImage(env, current.image_key);
  }

  const updated = await findSubjectTopicById(env.DB, { subjectId, topicId });
  return { ok: true, topic: serializeTopic(updated) };
}

export async function deleteModuleTopic(env, subjectIdRaw, topicIdRaw) {
  const subjectId = parsePositiveId(subjectIdRaw, "subject id");
  const topicId = parsePositiveId(topicIdRaw, "topic id");
  const topic = await findSubjectTopicById(env.DB, { subjectId, topicId });
  if (!topic) throw new HttpError(404, "Topic not found");

  const items = await listAllContentItemsByContext(env.DB, {
    subjectId,
    contextType: "topic",
    contextId: topicId,
  });

  await deleteContentItemsByContext(env.DB, {
    subjectId,
    contextType: "topic",
    contextId: topicId,
  });
  await deleteSubjectTopic(env.DB, { subjectId, topicId });

  if (topic.image_key) await safeDeleteImage(env, topic.image_key);
  for (const item of items) {
    if (item?.image_key) await safeDeleteImage(env, item.image_key);
  }
  return { ok: true };
}

export async function getModuleTopicView(env, subjectIdRaw, topicIdRaw) {
  const subjectId = parsePositiveId(subjectIdRaw, "subject id");
  const topicId = parsePositiveId(topicIdRaw, "topic id");
  const subject = await getSubjectOrThrow(env.DB, subjectId);
  const topicRow = await findSubjectTopicById(env.DB, { subjectId, topicId });
  if (!topicRow) throw new HttpError(404, "Topic not found");
  const topic = serializeTopic(topicRow);
  const chapterRow = await findSubjectChapterById(env.DB, { subjectId, chapterId: topic.chapterId });
  if (!chapterRow) throw new HttpError(404, "Chapter not found");
  const chapter = serializeChapter(chapterRow);
  const node = await getNodeOrThrow(env.DB, subjectId, chapter.nodeId);

  return {
    subject,
    node,
    chapter,
    topic,
    contentTypes: contentTypeMeta(node.contentTypes),
  };
}

export async function getModuleContentContext(env, subjectIdRaw, options = {}) {
  const subjectId = parsePositiveId(subjectIdRaw, "subject id");
  const subject = await getSubjectOrThrow(env.DB, subjectId);
  const resolved = await resolveContentContext(env.DB, subjectId, options?.contextType, options?.contextId);

  return {
    subject,
    contextType: resolved.contextType,
    contextId: resolved.contextId,
    node: resolved.node,
    chapter: resolved.chapter,
    topic: resolved.topic || null,
    parentNode: resolved.parentNode,
    label: resolved.label,
    contentTypes: contentTypeMeta(resolved.contentTypes),
  };
}

export async function listModuleContentItems(env, subjectIdRaw, options = {}) {
  const subjectId = parsePositiveId(subjectIdRaw, "subject id");
  const contentType = normalizeContentType(options?.contentType);
  const resolved = await resolveContentContext(env.DB, subjectId, options?.contextType, options?.contextId);

  if (!resolved.contentTypes.includes(contentType)) {
    throw new HttpError(400, "This content type is not supported in selected context");
  }

  if (!isEditableContentType(contentType)) {
    return {
      items: [],
      contentType,
      editable: false,
    };
  }

  const rows = await listContentItems(env.DB, {
    subjectId,
    contextType: resolved.contextType,
    contextId: resolved.contextId,
    contentType,
  });
  const serialized = rows.map(serializeContentItem);

  return {
    contentType,
    editable: true,
    items: contentType === "summary" ? serialized.slice(0, 1) : serialized,
  };
}

export async function createModuleContentItem(request, env, subjectIdRaw, actorId) {
  const subjectId = parsePositiveId(subjectIdRaw, "subject id");
  const body = await readBody(request, { maxBodySize: 1_800_000 });
  const contentType = normalizeContentType(body?.contentType);
  const resolved = await resolveContentContext(env.DB, subjectId, body?.contextType, body?.contextId);

  if (!resolved.contentTypes.includes(contentType)) {
    throw new HttpError(400, "This content type is not supported in selected context");
  }
  if (!isEditableContentType(contentType)) {
    throw new HttpError(400, "This content type is not editable yet");
  }

  const bodyHtml = sanitizeHtml(body?.body, { max: 50_000, required: true });
  let optionsJson = "[]";
  let correctOption = "";

  if (contentType === "mcq_bank") {
    const mcq = validateMcqPayload(body);
    optionsJson = JSON.stringify(mcq.options);
    correctOption = mcq.correctOption;
  } else if (contentType === "summary") {
    optionsJson = "[]";
    correctOption = "";
  }

  const requestedClear = Boolean(body?.clearImage);
  const hasImageData = Boolean(String(body?.imageData || "").trim());
  const imageKey = hasImageData
    ? await uploadOptionalImage(env, {
      dataUrl: body?.imageData,
      keyPrefix: `modules/subjects/${subjectId}/content/${resolved.contextType}/${resolved.contextId}/${contentType}`,
    })
    : "";

  const existingSummary = contentType === "summary"
    ? await listContentItems(env.DB, {
      subjectId,
      contextType: resolved.contextType,
      contextId: resolved.contextId,
      contentType,
    })
    : [];

  if (contentType === "summary" && existingSummary.length) {
    const current = existingSummary[0];
    const nextImageKey = hasImageData ? imageKey : (requestedClear ? "" : undefined);
    await updateContentItem(env.DB, {
      subjectId,
      itemId: Number(current.id || 0),
      body: bodyHtml,
      imageKey: nextImageKey,
      optionsJson,
      correctOption,
    });
    if (nextImageKey !== undefined && current.image_key && current.image_key !== nextImageKey) {
      await safeDeleteImage(env, current.image_key);
    }
    const updatedSummary = await findContentItemById(env.DB, { subjectId, itemId: Number(current.id || 0) });
    return { ok: true, item: serializeContentItem(updatedSummary) };
  }

  const sortOrder = await nextContentSortOrder(env.DB, {
    subjectId,
    contextType: resolved.contextType,
    contextId: resolved.contextId,
    contentType,
  });

  const itemId = await createContentItem(env.DB, {
    subjectId,
    contextType: resolved.contextType,
    contextId: resolved.contextId,
    contentType,
    body: bodyHtml,
    imageKey,
    optionsJson,
    correctOption,
    sortOrder,
    createdBy: Number(actorId || 0),
  });

  const created = await findContentItemById(env.DB, { subjectId, itemId });
  return { ok: true, item: serializeContentItem(created) };
}

export async function updateModuleContentItem(request, env, subjectIdRaw, itemIdRaw) {
  const subjectId = parsePositiveId(subjectIdRaw, "subject id");
  const itemId = parsePositiveId(itemIdRaw, "item id");
  const body = await readBody(request, { maxBodySize: 1_800_000 });

  const current = await findContentItemById(env.DB, { subjectId, itemId });
  if (!current) throw new HttpError(404, "Content item not found");

  const contentType = normalizeContentType(current?.content_type);
  if (!isEditableContentType(contentType)) {
    throw new HttpError(400, "This content type is not editable yet");
  }

  const html = sanitizeHtml(body?.body, { max: 50_000, required: true });
  let optionsJson = String(current?.options_json || "[]");
  let correctOption = String(current?.correct_option || "");

  if (contentType === "mcq_bank") {
    const mcq = validateMcqPayload(body);
    optionsJson = JSON.stringify(mcq.options);
    correctOption = mcq.correctOption;
  } else if (contentType === "summary") {
    optionsJson = "[]";
    correctOption = "";
  } else {
    optionsJson = "[]";
    correctOption = "";
  }

  const requestedClear = Boolean(body?.clearImage);
  const hasImageData = Boolean(String(body?.imageData || "").trim());
  let nextImageKey;

  if (hasImageData) {
    nextImageKey = await uploadOptionalImage(env, {
      dataUrl: body.imageData,
      keyPrefix: `modules/subjects/${subjectId}/content/${current.context_type}/${current.context_id}/${contentType}`,
    });
  } else if (requestedClear) {
    nextImageKey = "";
  }

  await updateContentItem(env.DB, {
    subjectId,
    itemId,
    body: html,
    imageKey: nextImageKey,
    optionsJson,
    correctOption,
  });

  if (nextImageKey !== undefined && current.image_key && current.image_key !== nextImageKey) {
    await safeDeleteImage(env, current.image_key);
  }

  const updated = await findContentItemById(env.DB, { subjectId, itemId });
  return { ok: true, item: serializeContentItem(updated) };
}

export async function deleteModuleContentItem(env, subjectIdRaw, itemIdRaw) {
  const subjectId = parsePositiveId(subjectIdRaw, "subject id");
  const itemId = parsePositiveId(itemIdRaw, "item id");
  const current = await findContentItemById(env.DB, { subjectId, itemId });
  if (!current) throw new HttpError(404, "Content item not found");

  await deleteContentItem(env.DB, { subjectId, itemId });
  if (current.image_key) await safeDeleteImage(env, current.image_key);

  return { ok: true };
}
