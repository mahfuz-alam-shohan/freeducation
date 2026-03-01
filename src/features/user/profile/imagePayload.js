import { HttpError } from "../../../shared/http/errors.js";

export function parseProfileImagePayload(imageData) {
  const dataUrl = String(imageData || "").trim();
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,([A-Za-z0-9+/=]+)$/);
  if (!match) throw new HttpError(400, "Invalid image payload");

  const contentType = match[1];
  if (!["image/jpeg", "image/png", "image/webp"].includes(contentType)) {
    throw new HttpError(400, "Unsupported image format");
  }

  const binary = Uint8Array.from(atob(match[2]), (char) => char.charCodeAt(0));
  if (!binary.byteLength) throw new HttpError(400, "Image is empty");
  if (binary.byteLength > 500_000) throw new HttpError(413, "Image is too large");

  const ext = contentType === "image/png" ? "png" : contentType === "image/webp" ? "webp" : "jpg";
  return { binary, contentType, ext };
}

export function normalizeImageType(value) {
  const imageType = String(value || "").toLowerCase();
  if (!["avatar", "cover"].includes(imageType)) {
    throw new HttpError(400, "Invalid image type");
  }
  return imageType;
}
