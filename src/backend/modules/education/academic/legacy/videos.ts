import type { Env } from "../../../../../shared/types";
import { apiHeaders, ensureAdmin, getAuthPayload } from "./shared";

const VIDEO_PREFIX = "videos";

const handleVideoUpload = async (request: Request, env: Env) => {
  const payload = await getAuthPayload(request, env);
  if (!payload) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401, headers: apiHeaders });
  }
  if (!ensureAdmin(payload) && payload?.role !== "teacher") {
    return Response.json({ success: false, error: "Admin or teacher access required." }, { status: 403, headers: apiHeaders });
  }
  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return Response.json({ success: false, error: "Video file is required." }, { status: 400, headers: apiHeaders });
  }

  const arrayBuffer = await file.arrayBuffer();
  const fileKey = `${VIDEO_PREFIX}/${crypto.randomUUID()}-${file.name}`;
  const contentType = file.type || "application/octet-stream";

  await env.BUCKET.put(fileKey, arrayBuffer, {
    httpMetadata: {
      contentType,
    },
  });

  return Response.json(
    {
      success: true,
      fileKey,
      url: `/api/videos/${encodeURIComponent(fileKey)}`,
    },
    { headers: apiHeaders }
  );
};

const handleVideoGet = async (env: Env, rawKey: string) => {
  const fileKey = decodeURIComponent(rawKey);
  if (!fileKey || !fileKey.startsWith(`${VIDEO_PREFIX}/`)) {
    return Response.json({ success: false, error: "Invalid video key." }, { status: 400, headers: apiHeaders });
  }
  const object = await env.BUCKET.get(fileKey);
  if (!object) {
    return Response.json({ success: false, error: "Video not found." }, { status: 404, headers: apiHeaders });
  }
  const headers = new Headers(apiHeaders);
  headers.set("Content-Type", object.httpMetadata?.contentType || "application/octet-stream");
  headers.set("Cache-Control", "public, max-age=3600");
  return new Response(object.body, { headers });
};

export const handleVideos = async (request: Request, env: Env, path: string): Promise<Response | null> => {
  if (path === "/api/videos" && request.method === "POST") {
    return handleVideoUpload(request, env);
  }

  if (path.startsWith("/api/videos/") && request.method === "GET") {
    return handleVideoGet(env, path.replace("/api/videos/", ""));
  }

  return null;
};
