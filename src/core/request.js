import { MAX_BODY_SIZE } from "../config.js";
import { HttpError } from "./errors.js";

export function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

export async function readJsonBody(request) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_BODY_SIZE) {
    throw new HttpError(413, "Request body too large");
  }

  const text = await request.text();
  if (text.length > MAX_BODY_SIZE) {
    throw new HttpError(413, "Request body too large");
  }

  try {
    return text ? JSON.parse(text) : {};
  } catch {
    throw new HttpError(400, "Invalid JSON body");
  }
}

export async function readBody(request) {
  const contentType = String(request.headers.get("content-type") || "").toLowerCase();

  if (contentType.includes("application/json") || !contentType) {
    return readJsonBody(request);
  }

  if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    return Object.fromEntries([...form.entries()].map(([key, value]) => [key, typeof value === "string" ? value : ""]));
  }

  throw new HttpError(415, "Unsupported content type");
}
