const MAX_POST_IMAGES = 4;
const POST_IMAGE_KEY_PREFIX = "social/posts/";

function sanitizeKey(value) {
  return String(value || "").trim();
}

function isValidPostImageKey(value) {
  const key = sanitizeKey(value);
  return Boolean(key) && key.startsWith(POST_IMAGE_KEY_PREFIX) && !key.includes("..");
}

function parseLegacyKeyList(raw) {
  if (!raw) return [];
  if (raw.includes(",")) {
    return raw.split(",").map((entry) => sanitizeKey(entry));
  }
  if (raw.includes("|")) {
    return raw.split("|").map((entry) => sanitizeKey(entry));
  }
  return [raw];
}

export function decodePostImageKeys(rawValue) {
  const raw = sanitizeKey(rawValue);
  if (!raw) return [];

  if (raw.startsWith("[")) {
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed
        .map((entry) => sanitizeKey(entry))
        .filter((entry) => isValidPostImageKey(entry))
        .slice(0, MAX_POST_IMAGES);
    } catch {
      return [];
    }
  }

  return parseLegacyKeyList(raw)
    .filter((entry) => isValidPostImageKey(entry))
    .slice(0, MAX_POST_IMAGES);
}

export function encodePostImageKeys(values) {
  const keys = Array.isArray(values)
    ? values
      .map((entry) => sanitizeKey(entry))
      .filter((entry) => isValidPostImageKey(entry))
      .slice(0, MAX_POST_IMAGES)
    : [];
  if (!keys.length) return "";
  if (keys.length === 1) return keys[0];
  return JSON.stringify(keys);
}

export function maxPostImages() {
  return MAX_POST_IMAGES;
}
