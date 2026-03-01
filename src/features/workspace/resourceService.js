import { HttpError } from "../../shared/http/errors.js";
import { clearUserImageKeyReferences } from "../../infrastructure/db/usersRepository.js";
import { normalizeObjectInfo } from "./resources/mappers.js";
import { normalizeObjectKey, normalizeType, normalizeUsage } from "./resources/validation.js";

export async function listWorkspaceResources(env, options = {}) {
  const typeFilter = normalizeType(options.type);
  const usageFilter = normalizeUsage(options.usage);
  const cursor = String(options.cursor || "").trim();
  const limit = Math.max(1, Math.min(120, Number.parseInt(String(options.limit || ""), 10) || 45));
  const search = String(options.search || "").trim().toLowerCase();
  const apiBase = String(options.apiBase || "/api/admin");

  const listed = await env.BUCKET.list({ cursor: cursor || undefined, limit });

  const files = listed.objects
    .map((item) => normalizeObjectInfo(item, apiBase))
    .filter((file) => {
      if (typeFilter && file.type !== typeFilter) return false;
      if (usageFilter && file.usage !== usageFilter) return false;
      if (search && !file.key.toLowerCase().includes(search)) return false;
      return true;
    });

  return {
    files,
    cursor: listed.truncated ? listed.cursor || "" : "",
    truncated: Boolean(listed.truncated),
  };
}

export async function getWorkspaceResourceObject(env, key) {
  const objectKey = normalizeObjectKey(key);
  if (!objectKey) throw new HttpError(400, "Invalid object key");

  const object = await env.BUCKET.get(objectKey);
  if (!object) throw new HttpError(404, "File not found");

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("cache-control", headers.get("cache-control") || "public, max-age=86400");
  headers.set("content-disposition", `inline; filename=\"${objectKey.split("/").pop() || "file"}\"`);
  return new Response(object.body, { headers });
}

export async function deleteWorkspaceResource(env, key) {
  const objectKey = normalizeObjectKey(key);
  if (!objectKey) throw new HttpError(400, "Invalid object key");

  await env.BUCKET.delete(objectKey);
  await clearUserImageKeyReferences(env.DB, objectKey);

  return { ok: true, key: objectKey };
}
