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
    publicReader: { enabled: false, tabKey: "summary", panelMode: "rich" },
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
  return types
    .map((type) => String(type || "").trim().toLowerCase())
    .filter((type, index, list) => Boolean(type) && list.indexOf(type) === index && isKnownContentType(type))
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
  const allowed = new Set(
    (Array.isArray(contentTypes) ? contentTypes : [])
      .map((type) => String(type || "").trim().toLowerCase())
      .filter((type) => isKnownContentType(type)),
  );

  return CONTENT_MODULES
    .filter((item) => item.publicReader.enabled && allowed.has(item.key))
    .map((item) => ({
      key: item.key,
      label: item.label,
      tabKey: item.publicReader.tabKey,
      panelMode: item.publicReader.panelMode,
    }));
}

