import { initDatabase } from "../db";
import type { Env } from "../types";
import { apiHeaders, getAuthPayload } from "./shared";

export const handleSettings = async (request: Request, env: Env, path: string): Promise<Response | null> => {
  if (path !== "/api/settings/reset" || request.method !== "POST") return null;

  const payload = await getAuthPayload(request, env);
  if (!payload) return Response.json({ success: false, error: "Unauthorized" }, { status: 401, headers: apiHeaders });
  const body = await request.json().catch(() => ({}));
  if (!body || body.confirm !== true) {
    return Response.json({ success: false, error: "Confirmation required." }, { status: 400, headers: apiHeaders });
  }

  const fontRows = await env.DB.prepare("SELECT file_key FROM fonts").all();
  const keys = (fontRows.results || [])
    .map((row: any) => row.file_key)
    .filter((key: string | null) => typeof key === "string" && key.length > 0);
  const thumbnailRows = await env.DB.prepare("SELECT file_key FROM subject_thumbnails").all();
  const thumbnailKeys = (thumbnailRows.results || [])
    .map((row: any) => row.file_key)
    .filter((key: string | null) => typeof key === "string" && key.length > 0);
  const chapterThumbnailRows = await env.DB.prepare("SELECT file_key FROM chapter_thumbnails").all();
  const chapterThumbnailKeys = (chapterThumbnailRows.results || [])
    .map((row: any) => row.file_key)
    .filter((key: string | null) => typeof key === "string" && key.length > 0);
  if (keys.length > 0) {
    await env.BUCKET.delete(keys);
  }
  if (thumbnailKeys.length > 0) {
    await env.BUCKET.delete(thumbnailKeys);
  }
  if (chapterThumbnailKeys.length > 0) {
    await env.BUCKET.delete(chapterThumbnailKeys);
  }

  await env.DB.batch([
    env.DB.prepare("DELETE FROM fonts"),
    env.DB.prepare("DELETE FROM subject_thumbnails"),
    env.DB.prepare("DELETE FROM chapter_thumbnails"),
    env.DB.prepare("DELETE FROM content_store WHERE key = 'app-content'"),
    env.DB.prepare("DELETE FROM class_groups"),
    env.DB.prepare("DELETE FROM classes"),
  ]);
  await initDatabase(env.DB);
  return Response.json({ success: true }, { headers: apiHeaders });
};
