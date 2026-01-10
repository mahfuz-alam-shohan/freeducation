import type { Env } from "../../../../../shared/types";
import { apiHeaders, getAuthPayload } from "./shared";

export const handleClasses = async (request: Request, env: Env, path: string): Promise<Response | null> => {
  if (path !== "/api/classes") return null;

  if (request.method === "GET") {
    const payload = await getAuthPayload(request, env);
    if (!payload) return Response.json({ success: false, error: "Unauthorized" }, { status: 401, headers: apiHeaders });
    const result = await env.DB.prepare("SELECT id, name, created_at FROM classes ORDER BY created_at DESC").all();
    return Response.json({ success: true, classes: result.results || [] }, { headers: apiHeaders });
  }

  if (request.method === "POST") {
    const payload = await getAuthPayload(request, env);
    if (!payload) return Response.json({ success: false, error: "Unauthorized" }, { status: 401, headers: apiHeaders });
    const { name } = (await request.json()) as any;
    const trimmedName = String(name || "").trim();
    if (!trimmedName) {
      return Response.json({ success: false, error: "Class name is required" }, { status: 400, headers: apiHeaders });
    }
    await env.DB.prepare("INSERT INTO classes (name) VALUES (?)").bind(trimmedName).run();
    const created = await env.DB.prepare("SELECT id, name, created_at FROM classes WHERE name = ?").bind(trimmedName).first();
    return Response.json({ success: true, class: created }, { headers: apiHeaders });
  }

  return null;
};
