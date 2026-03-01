import { FILE_TYPE_EXTENSIONS } from "./constants.js";

export function normalizeObjectInfo(item, apiBase) {
  const key = String(item?.key || "");
  const extension = key.includes(".") ? key.split(".").pop().toLowerCase() : "";
  const type = detectFileType(extension, String(item?.httpMetadata?.contentType || ""));
  const usage = detectUsageFromKey(key);
  return {
    key,
    type,
    usage,
    extension,
    size: Number(item?.size || 0),
    uploadedAt: item?.uploaded ? new Date(item.uploaded).toISOString() : "",
    etag: item?.etag || "",
    contentType: item?.httpMetadata?.contentType || "",
    previewUrl: `${apiBase}/files/object?key=${encodeURIComponent(key)}`,
  };
}

function detectFileType(extension, contentType) {
  const lowered = String(contentType || "").toLowerCase();
  if (lowered.startsWith("image/")) return "image";
  if (lowered.startsWith("video/")) return "video";
  if (lowered === "application/pdf") return "pdf";
  for (const [type, extensions] of Object.entries(FILE_TYPE_EXTENSIONS)) {
    if (extensions.includes(extension)) return type;
  }
  return "other";
}

function detectUsageFromKey(key) {
  const lower = String(key || "").toLowerCase();
  if (lower.includes("avatar")) return "profile-pic";
  if (lower.includes("cover")) return "cover-pic";
  return "other";
}
