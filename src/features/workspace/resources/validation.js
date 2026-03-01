export function normalizeType(type) {
  const next = String(type || "").toLowerCase();
  if (["image", "pdf", "video", "other"].includes(next)) return next;
  return "";
}

export function normalizeUsage(usage) {
  const next = String(usage || "").toLowerCase();
  if (["profile-pic", "cover-pic", "other"].includes(next)) return next;
  return "";
}

export function normalizeObjectKey(key) {
  const objectKey = String(key || "").trim();
  if (!objectKey || objectKey.length > 350 || objectKey.includes("..")) return "";
  return objectKey;
}
