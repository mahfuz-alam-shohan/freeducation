import type { Env } from "../types";
import { apiHeaders, ensureAdmin, getAuthPayload } from "./shared";

const fetchChannelName = async (url: string) => {
  try {
    const response = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);
    if (!response.ok) return "YouTube";
    const data = await response.json<{ author_name?: string }>();
    return data.author_name || "YouTube";
  } catch {
    return "YouTube";
  }
};

const parseId = (path: string) => {
  const parts = path.split("/").filter(Boolean);
  return parts.length > 2 ? parts[2] : null;
};

export const handleVideos = async (request: Request, env: Env, path: string): Promise<Response | null> => {
  if (!path.startsWith("/api/videos")) return null;

  if (path === "/api/videos" && request.method === "GET") {
    const url = new URL(request.url);
    const contentKey = url.searchParams.get("key");
    if (!contentKey) {
      return Response.json({ success: false, error: "Missing content key." }, { status: 400, headers: apiHeaders });
    }
    const rows = await env.DB.prepare(
      "SELECT id, content_key, title, url, channel, created_at FROM video_resources WHERE content_key = ? ORDER BY created_at DESC"
    )
      .bind(contentKey)
      .all();
    return Response.json({ success: true, videos: rows.results || [] }, { headers: apiHeaders });
  }

  if (path === "/api/videos" && request.method === "POST") {
    const payload = await getAuthPayload(request, env);
    if (!ensureAdmin(payload)) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401, headers: apiHeaders });
    }
    const body = await request.json().catch(() => ({}));
    const contentKey = String(body?.contentKey || "").trim();
    const title = String(body?.title || "").trim();
    const url = String(body?.url || "").trim();
    if (!contentKey || !title || !url) {
      return Response.json({ success: false, error: "Content key, title, and url are required." }, { status: 400, headers: apiHeaders });
    }
    const channel = await fetchChannelName(url);
    const result = await env.DB.prepare(
      "INSERT INTO video_resources (content_key, title, url, channel) VALUES (?, ?, ?, ?)"
    )
      .bind(contentKey, title, url, channel)
      .run();
    return Response.json(
      {
        success: true,
        video: {
          id: result.meta?.last_row_id,
          content_key: contentKey,
          title,
          url,
          channel,
        },
      },
      { headers: apiHeaders }
    );
  }

  if (path.startsWith("/api/videos/") && request.method === "PUT") {
    const payload = await getAuthPayload(request, env);
    if (!ensureAdmin(payload)) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401, headers: apiHeaders });
    }
    const id = parseId(path);
    if (!id) {
      return Response.json({ success: false, error: "Missing video id." }, { status: 400, headers: apiHeaders });
    }
    const body = await request.json().catch(() => ({}));
    const title = String(body?.title || "").trim();
    const url = String(body?.url || "").trim();
    if (!title || !url) {
      return Response.json({ success: false, error: "Title and url are required." }, { status: 400, headers: apiHeaders });
    }
    const channel = await fetchChannelName(url);
    await env.DB.prepare("UPDATE video_resources SET title = ?, url = ?, channel = ? WHERE id = ?")
      .bind(title, url, channel, id)
      .run();
    return Response.json({ success: true, video: { id, title, url, channel } }, { headers: apiHeaders });
  }

  if (path.startsWith("/api/videos/") && request.method === "DELETE") {
    const payload = await getAuthPayload(request, env);
    if (!ensureAdmin(payload)) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401, headers: apiHeaders });
    }
    const id = parseId(path);
    if (!id) {
      return Response.json({ success: false, error: "Missing video id." }, { status: 400, headers: apiHeaders });
    }
    await env.DB.prepare("DELETE FROM video_resources WHERE id = ?").bind(id).run();
    return Response.json({ success: true }, { headers: apiHeaders });
  }

  return null;
};
