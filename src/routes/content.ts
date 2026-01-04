import type { Env } from "../types";
import { apiHeaders, applyTeacherContentUpdate, ensureAdmin, getAuthPayload, safeParseContent } from "./shared";

export const handleContent = async (request: Request, env: Env, path: string): Promise<Response | null> => {
  if (path !== "/api/content") return null;

  if (request.method === "GET") {
    const row = await env.DB.prepare("SELECT data FROM content_store WHERE key = ?").bind("app-content").first();
    let content = {};
    if (row?.data) {
      content = safeParseContent(row.data);
    }
    return Response.json({ success: true, content }, { headers: apiHeaders });
  }

  if (request.method === "PUT") {
    const payload = await getAuthPayload(request, env);
    if (!payload) return Response.json({ success: false, error: "Unauthorized" }, { status: 401, headers: apiHeaders });
    const body = await request.json().catch(() => ({}));
    if (!body || typeof body !== "object") {
      return Response.json({ success: false, error: "Invalid content payload." }, { status: 400, headers: apiHeaders });
    }

    if (ensureAdmin(payload)) {
      await env.DB.prepare(
        "INSERT INTO content_store (key, data, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP) " +
          "ON CONFLICT(key) DO UPDATE SET data = excluded.data, updated_at = CURRENT_TIMESTAMP"
      ).bind("app-content", JSON.stringify(body)).run();
      return Response.json({ success: true }, { headers: apiHeaders });
    }

    if (payload.role === "teacher") {
      if (!payload.assignment) {
        return Response.json({ success: false, error: "Assignment missing." }, { status: 400, headers: apiHeaders });
      }
      const canEditStructure = Array.isArray(payload.permissions) && payload.permissions.includes("structure");
      const row = await env.DB.prepare("SELECT data FROM content_store WHERE key = ?").bind("app-content").first();
      const existingContent = row?.data ? safeParseContent(row.data) : {};
      const updatedContent = applyTeacherContentUpdate(existingContent, body, payload.assignment, canEditStructure);
      if (!updatedContent) {
        return Response.json({ success: false, error: "Subject is not configured for updates." }, { status: 400, headers: apiHeaders });
      }
      await env.DB.prepare(
        "INSERT INTO content_store (key, data, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP) " +
          "ON CONFLICT(key) DO UPDATE SET data = excluded.data, updated_at = CURRENT_TIMESTAMP"
      ).bind("app-content", JSON.stringify(updatedContent)).run();
      return Response.json({ success: true }, { headers: apiHeaders });
    }

    return Response.json({ success: false, error: "Unauthorized" }, { status: 401, headers: apiHeaders });
  }

  return null;
};
