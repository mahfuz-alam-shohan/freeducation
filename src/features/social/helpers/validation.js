import { HttpError } from "../../../shared/http/errors.js";
import { maxPostImages } from "../../../shared/social/postImages.js";

export function sanitizePostText(value) {
  return String(value || "").trim();
}

export function parseDataImage(payload) {
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
  if (binary.byteLength > 900_000) throw new HttpError(413, "Image is too large after compression");

  const ext = contentType === "image/png" ? "png" : contentType === "image/webp" ? "webp" : "jpg";
  return { binary, contentType, ext };
}

export function parseDataImages(payload) {
  if (Array.isArray(payload)) {
    const maxImages = maxPostImages();
    const parsed = payload
      .map((item) => parseDataImage(item))
      .filter(Boolean);
    if (parsed.length > maxImages) {
      throw new HttpError(400, `You can attach up to ${maxImages} images`);
    }
    return parsed;
  }

  const single = parseDataImage(payload);
  return single ? [single] : [];
}

export function parsePositiveId(value, label) {
  const id = Number.parseInt(String(value || ""), 10);
  if (!Number.isInteger(id) || id <= 0) throw new HttpError(400, `Invalid ${label}`);
  return id;
}
