import type { Env } from "../types";
import { apiHeaders } from "./shared";

const fontFormatMatchers = [
  { format: "woff2", contentHints: ["woff2"], extensions: [".woff2"] },
  { format: "woff", contentHints: ["woff"], extensions: [".woff"] },
  { format: "opentype", contentHints: ["opentype"], extensions: [".otf"] },
  { format: "truetype", contentHints: ["truetype"], extensions: [".ttf"] },
];

const inferFontFormat = (contentType: string | null, fileName: string | null) => {
  const lowerType = (contentType || "").toLowerCase();
  const lowerName = (fileName || "").toLowerCase();
  for (const matcher of fontFormatMatchers) {
    if (matcher.contentHints.some((hint) => lowerType.includes(hint))) return matcher.format;
    if (matcher.extensions.some((ext) => lowerName.endsWith(ext))) return matcher.format;
  }
  return "truetype";
};

export const handleFonts = async (request: Request, env: Env, path: string): Promise<Response | null> => {
  if (!path.startsWith("/api/fonts")) return null;

  await env.DB.prepare(`CREATE TABLE IF NOT EXISTS fonts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    file_key TEXT,
    content_type TEXT,
    original_name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`).run();

  if (path === "/api/fonts" && request.method === "GET") {
    const fonts = await env.DB.prepare("SELECT id, name, content_type, original_name FROM fonts ORDER BY created_at DESC").all();
    const formatted = (fonts.results || []).map((font: any) => ({
      id: font.id,
      name: font.name,
      original_name: font.original_name,
      content_type: font.content_type,
      format: inferFontFormat(font.content_type, font.original_name),
      url: `/api/fonts/file/${font.id}`,
    }));
    return Response.json(formatted, { headers: apiHeaders });
  }

  if (path.startsWith("/api/fonts/file/") && request.method === "GET") {
    const id = path.split("/").pop();
    if (!id) {
      return Response.json({ success: false, error: "Font ID is required." }, { status: 400, headers: apiHeaders });
    }
    const font = await env.DB.prepare("SELECT file_key, content_type FROM fonts WHERE id = ?").bind(id).first();
    if (!font) {
      return Response.json({ success: false, error: "Font not found." }, { status: 404, headers: apiHeaders });
    }
    const object = await env.BUCKET.get(font.file_key as string);
    if (!object) {
      return Response.json({ success: false, error: "Font file missing." }, { status: 404, headers: apiHeaders });
    }
    const headers = new Headers(apiHeaders);
    headers.set("Content-Type", (font.content_type as string) || "application/octet-stream");
    headers.set("Cache-Control", "public, max-age=31536000");
    return new Response(object.body, { headers });
  }

  if (path === "/api/fonts/bulk" && request.method === "POST") {
    const formData = await request.formData();
    const files = formData.getAll("files").filter((entry) => entry instanceof File) as File[];
    if (files.length === 0) {
      return Response.json({ success: false, error: "No font files provided." }, { status: 400, headers: apiHeaders });
    }

    const inserts = [];
    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const key = `fonts/${crypto.randomUUID()}-${file.name}`;
      await env.BUCKET.put(key, arrayBuffer, {
        httpMetadata: {
          contentType: file.type || "application/octet-stream",
        },
      });
      const baseName = file.name.replace(/\.[^/.]+$/, "") || file.name;
      inserts.push(
        env.DB.prepare("INSERT INTO fonts (name, file_key, content_type, original_name) VALUES (?, ?, ?, ?)").bind(
          baseName,
          key,
          file.type || "application/octet-stream",
          file.name
        )
      );
    }

    await env.DB.batch(inserts);
    return Response.json({ success: true, inserted: inserts.length }, { headers: apiHeaders });
  }

  return null;
};
