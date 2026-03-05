const CONTENT_MODULE_DEFS = [
  {
    key: "cq_bank",
    label: "CQ Bank",
    editable: false,
    includeInBase: true,
    publicReader: { enabled: true, tabKey: "cq", panelMode: "rich" },
  },
  {
    key: "mcq_bank",
    label: "MCQ Bank",
    editable: true,
    includeInBase: true,
    publicReader: { enabled: true, tabKey: "mcq", panelMode: "mcq" },
  },
  {
    key: "short_notes",
    label: "Short Notes",
    editable: true,
    includeInBase: true,
    publicReader: { enabled: true, tabKey: "short", panelMode: "short" },
  },
  {
    key: "videos",
    label: "Videos",
    editable: false,
    includeInBase: true,
    publicReader: { enabled: true, tabKey: "videos", panelMode: "rich" },
  },
  {
    key: "summary",
    label: "Summary",
    editable: true,
    includeInBase: false,
    publicReader: { enabled: true, tabKey: "summary", panelMode: "rich" },
  },
];

export const CONTENT_MODULES = Object.freeze(CONTENT_MODULE_DEFS.map((item) => Object.freeze({
  key: item.key,
  label: item.label,
  editable: Boolean(item.editable),
  includeInBase: Boolean(item.includeInBase),
  publicReader: Object.freeze({
    enabled: Boolean(item?.publicReader?.enabled),
    tabKey: String(item?.publicReader?.tabKey || item.key),
    panelMode: String(item?.publicReader?.panelMode || "rich"),
  }),
})));

export const CONTENT_MODULE_KEYS = Object.freeze(CONTENT_MODULES.map((item) => item.key));
export const BASE_CONTENT_TYPE_KEYS = Object.freeze(
  CONTENT_MODULES.filter((item) => item.includeInBase).map((item) => item.key),
);
export const EDITABLE_CONTENT_TYPE_KEYS = Object.freeze(
  CONTENT_MODULES.filter((item) => item.editable).map((item) => item.key),
);
export const EDITABLE_CONTENT_TYPE_SET = new Set(EDITABLE_CONTENT_TYPE_KEYS);

export const CONTENT_LABELS = Object.freeze(
  Object.fromEntries(CONTENT_MODULES.map((item) => [item.key, item.label])),
);

const MODULE_BY_KEY = new Map(CONTENT_MODULES.map((item) => [item.key, item]));
const CONTENT_TYPE_PRIORITY = Object.freeze({
  summary: 1,
  short_notes: 2,
  mcq_bank: 3,
});

function contentTypePriority(key = "") {
  const normalized = String(key || "").trim().toLowerCase();
  return Number(CONTENT_TYPE_PRIORITY[normalized] || 999);
}

export function contentModuleByKey(key) {
  return MODULE_BY_KEY.get(String(key || "").trim().toLowerCase()) || null;
}

export function isKnownContentType(key) {
  return Boolean(contentModuleByKey(key));
}

export function isEditableContentType(key) {
  return EDITABLE_CONTENT_TYPE_SET.has(String(key || "").trim().toLowerCase());
}

export function contentLabelForType(key) {
  const item = contentModuleByKey(key);
  return item?.label || String(key || "");
}

export function contentTypeMetaList(contentTypes = []) {
  const types = Array.isArray(contentTypes) ? contentTypes : [];
  const normalized = types
    .map((type) => String(type || "").trim().toLowerCase())
    .filter((type, index, list) => Boolean(type) && list.indexOf(type) === index && isKnownContentType(type));

  const ordered = normalized
    .map((key, index) => ({ key, index }))
    .sort((a, b) => {
      const priorityDiff = contentTypePriority(a.key) - contentTypePriority(b.key);
      if (priorityDiff !== 0) return priorityDiff;
      return a.index - b.index;
    })
    .map((item) => item.key);

  return ordered
    .map((key) => {
      const item = contentModuleByKey(key);
      return {
        key,
        label: item?.label || key,
        editable: Boolean(item?.editable),
      };
    });
}

export function publicReaderModules(contentTypes = []) {
  const allowedList = (Array.isArray(contentTypes) ? contentTypes : [])
    .map((type) => String(type || "").trim().toLowerCase())
    .filter((type, index, list) => isKnownContentType(type) && list.indexOf(type) === index);

  const allowed = new Set(
    (Array.isArray(contentTypes) ? contentTypes : [])
      .map((type) => String(type || "").trim().toLowerCase())
      .filter((type) => isKnownContentType(type)),
  );

  return CONTENT_MODULES
    .filter((item) => item.publicReader.enabled && allowed.has(item.key))
    .sort((a, b) => {
      const priorityDiff = contentTypePriority(a.key) - contentTypePriority(b.key);
      if (priorityDiff !== 0) return priorityDiff;
      return allowedList.indexOf(a.key) - allowedList.indexOf(b.key);
    })
    .map((item) => ({
      key: item.key,
      label: item.label,
      tabKey: item.publicReader.tabKey,
      panelMode: item.publicReader.panelMode,
    }));
}
