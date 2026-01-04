import type { Env } from "../types";
import { apiHeaders, getAuthPayload } from "./shared";

const getFileKeyFromPath = (path: string) => {
  const rawKey = path.replace("/api/videos/", "");
  if (!rawKey) return null;
  try {
    return decodeURIComponent(rawKey);
  } catch {
    return rawKey;
  }
};

export const handleVideos = async (request: Request, env: Env, path: string): Promise<Response | null> => {
  if (!path.startsWith("/api/videos")) return null;

  if (path === "/api/videos/upload" && request.method === "POST") {
    const payload = await getAuthPayload(request, env);
    if (!payload) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401, headers: apiHeaders });
    }
    if (payload.role !== "admin" && payload.role !== "teacher") {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401, headers: apiHeaders });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      return Response.json({ success: false, error: "Video file is required." }, { status: 400, headers: apiHeaders });
    }

    const arrayBuffer = await file.arrayBuffer();
    const key = `videos/${crypto.randomUUID()}-${file.name}`;
    await env.BUCKET.put(key, arrayBuffer, {
      httpMetadata: {
        contentType: file.type || "application/octet-stream",
      },
    });
    await env.DB.prepare(
      "INSERT INTO video_assets (file_key, content_type, original_name) VALUES (?, ?, ?)"
    ).bind(key, file.type || "application/octet-stream", file.name).run();

    return Response.json(
      {
        success: true,
        fileKey: key,
        url: `/api/videos/${encodeURIComponent(key)}`,
      },
      { headers: apiHeaders }
    );
  }

  if (path.startsWith("/api/videos/") && request.method === "GET") {
    const key = getFileKeyFromPath(path);
    if (!key) {
      return Response.json({ success: false, error: "Video key is required." }, { status: 400, headers: apiHeaders });
    }
    const video = await env.DB.prepare("SELECT content_type FROM video_assets WHERE file_key = ?").bind(key).first();
    const object = await env.BUCKET.get(key);
    if (!object) {
      return Response.json({ success: false, error: "Video not found." }, { status: 404, headers: apiHeaders });
    }
    const headers = new Headers(apiHeaders);
    headers.set("Content-Type", (video?.content_type as string) || object.httpMetadata?.contentType || "application/octet-stream");
    headers.set("Cache-Control", "public, max-age=31536000");
    return new Response(object.body, { headers });
  }

  return null;
};
