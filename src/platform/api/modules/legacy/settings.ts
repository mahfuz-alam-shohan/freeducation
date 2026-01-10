import { initDatabase } from "../../../shared/db";
import type { Env } from "../../../shared/types";
import { hashPassword } from "../../../shared/auth";
import { apiHeaders, ensureAdmin, getAuthPayload, recordEditHistory } from "./shared";

export const handleSettings = async (request: Request, env: Env, path: string): Promise<Response | null> => {
  if (path === "/api/settings/reset" && request.method === "POST") {
    const payload = await getAuthPayload(request, env);
    if (!ensureAdmin(payload)) return Response.json({ success: false, error: "Unauthorized" }, { status: 401, headers: apiHeaders });
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
    await recordEditHistory(env.DB, payload, "Settings reset", { scope: "soft" });
    return Response.json({ success: true }, { headers: apiHeaders });
  }

  if (path === "/api/settings/hard-reset" && request.method === "POST") {
    const payload = await getAuthPayload(request, env);
    if (!ensureAdmin(payload)) return Response.json({ success: false, error: "Unauthorized" }, { status: 401, headers: apiHeaders });
    const body = await request.json().catch(() => ({}));
    const password = String(body.password || "");
    if (!password) {
      return Response.json({ success: false, error: "Password is required." }, { status: 400, headers: apiHeaders });
    }

    const userRow = await env.DB.prepare("SELECT id, password_hash FROM users WHERE id = ?").bind(payload.id).first();
    let passwordHashSource = userRow?.password_hash as string | undefined;

    if (!passwordHashSource && payload.role === "admin") {
      const legacyRow = await env.DB.prepare("SELECT id, password_hash FROM admins WHERE id = ?").bind(payload.id).first();
      if (legacyRow?.password_hash) {
        passwordHashSource = legacyRow.password_hash as string;
      }
    }

    if (!passwordHashSource) {
      return Response.json({ success: false, error: "User not found." }, { status: 404, headers: apiHeaders });
    }

    const [saltHex, originalHash] = passwordHashSource.split(":");
    const currentHash = await hashPassword(password, saltHex);
    if (currentHash !== originalHash) {
      return Response.json({ success: false, error: "Password is incorrect." }, { status: 401, headers: apiHeaders });
    }

    let cursor: string | undefined;
    do {
      const list = await env.BUCKET.list({ cursor });
      const keys = list.objects.map((object) => object.key);
      if (keys.length) {
        await env.BUCKET.delete(keys);
      }
      cursor = list.truncated ? list.cursor : undefined;
    } while (cursor);

    await env.DB.batch([
      env.DB.prepare("DROP TABLE IF EXISTS edit_history"),
      env.DB.prepare("DROP TABLE IF EXISTS user_profiles"),
      env.DB.prepare("DROP TABLE IF EXISTS admin_permissions"),
      env.DB.prepare("DROP TABLE IF EXISTS teacher_assignments"),
      env.DB.prepare("DROP TABLE IF EXISTS teacher_permissions"),
      env.DB.prepare("DROP TABLE IF EXISTS content_store"),
      env.DB.prepare("DROP TABLE IF EXISTS class_groups"),
      env.DB.prepare("DROP TABLE IF EXISTS classes"),
      env.DB.prepare("DROP TABLE IF EXISTS fonts"),
      env.DB.prepare("DROP TABLE IF EXISTS subject_thumbnails"),
      env.DB.prepare("DROP TABLE IF EXISTS chapter_thumbnails"),
      env.DB.prepare("DROP TABLE IF EXISTS users"),
      env.DB.prepare("DROP TABLE IF EXISTS admins"),
    ]);
    await initDatabase(env.DB);
    return Response.json({ success: true }, { headers: apiHeaders });
  }

  return null;
};
