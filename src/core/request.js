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
