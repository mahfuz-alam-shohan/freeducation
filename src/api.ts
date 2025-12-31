import { hashPassword, createToken, verifyToken } from "./auth";
import { initDatabase } from "./db";
import type { Env } from "./types";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS, PUT, DELETE",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const securityHeaders = {
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

const apiHeaders = {
  ...corsHeaders,
  ...securityHeaders,
};

const requireJwtSecret = (env: Env) => {
  const secret = env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT secret is not configured.");
  }
  return secret;
};

const inferFontFormat = (contentType: string | null, fileName: string | null) => {
  const lowerType = (contentType || "").toLowerCase();
  if (lowerType.includes("woff2")) return "woff2";
  if (lowerType.includes("woff")) return "woff";
  if (lowerType.includes("opentype")) return "opentype";
  if (lowerType.includes("truetype")) return "truetype";

  const lowerName = (fileName || "").toLowerCase();
  if (lowerName.endsWith(".woff2")) return "woff2";
  if (lowerName.endsWith(".woff")) return "woff";
  if (lowerName.endsWith(".otf")) return "opentype";
  if (lowerName.endsWith(".ttf")) return "truetype";
  return "truetype";
};

const getAuthPayload = async (request: Request, env: Env) => {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const secret = requireJwtSecret(env);
  return await verifyToken(authHeader.split(" ")[1], secret);
};

export async function handleApiRequest(request: Request, env: Env): Promise<Response | null> {
  const url = new URL(request.url);
  const path = url.pathname;

  if (request.method === "OPTIONS") return new Response(null, { headers: apiHeaders });

  try {
      if (path.startsWith("/api/fonts")) {
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
      }

      // 1. SYSTEM INITIALIZATION
      if (path === "/api/init" && request.method === "POST") {
        await initDatabase(env.DB);
        return Response.json({ success: true, message: "Database initialized" }, { headers: apiHeaders });
      }

      if (path === "/api/setup-status") {
        const result = await env.DB.prepare("SELECT count(*) as count FROM admins").first();
        return Response.json({ hasAdmin: (result?.count as number) > 0 }, { headers: apiHeaders });
      }

      // 2. AUTHENTICATION
      if (path === "/api/register-admin" && request.method === "POST") {
        const { username, password } = await request.json() as any;
        const count = await env.DB.prepare("SELECT count(*) as count FROM admins").first();
        if ((count?.count as number) > 0) return Response.json({ success: false, error: "User already exists" }, { status: 403, headers: apiHeaders });

        const cleanedUsername = String(username || "").trim();
        const cleanedPassword = String(password || "");
        if (cleanedUsername.length < 3) {
          return Response.json({ success: false, error: "Username must be at least 3 characters." }, { status: 400, headers: apiHeaders });
        }
        if (cleanedPassword.length < 8) {
          return Response.json({ success: false, error: "Password must be at least 8 characters." }, { status: 400, headers: apiHeaders });
        }

        const salt = crypto.getRandomValues(new Uint8Array(16));
        const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
        const hash = await hashPassword(cleanedPassword, saltHex);
        await env.DB.prepare("INSERT INTO admins (username, password_hash) VALUES (?, ?)").bind(cleanedUsername, `${saltHex}:${hash}`).run();
        return Response.json({ success: true }, { headers: apiHeaders });
      }

      if (path === "/api/login" && request.method === "POST") {
        const { username, password } = await request.json() as any;
        const cleanedUsername = String(username || "").trim();
        const cleanedPassword = String(password || "");
        if (!cleanedUsername || !cleanedPassword) {
          return Response.json({ success: false, error: "Username and password are required." }, { status: 400, headers: apiHeaders });
        }
        const user = await env.DB.prepare("SELECT * FROM admins WHERE username = ?").bind(cleanedUsername).first();
        if (!user) return Response.json({ success: false, error: "Invalid credentials" }, { status: 401, headers: apiHeaders });

        const [saltHex, originalHash] = (user.password_hash as string).split(':');
        const hash = await hashPassword(cleanedPassword, saltHex);
        if (hash !== originalHash) return Response.json({ success: false, error: "Invalid credentials" }, { status: 401, headers: apiHeaders });

        const secret = requireJwtSecret(env);
        const token = await createToken({ username: user.username, id: user.id }, secret);
        return Response.json({ success: true, username: user.username, token }, { headers: apiHeaders });
      }

      if (path === "/api/me" && request.method === "GET") {
        const authHeader = request.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) return Response.json({ user: null }, { headers: apiHeaders });
        const secret = requireJwtSecret(env);
        const payload = await verifyToken(authHeader.split(" ")[1], secret);
        return Response.json({ user: payload ? { username: payload.username } : null }, { headers: apiHeaders });
      }

      // 3. CLASSES
      if (path === "/api/classes" && request.method === "GET") {
        const payload = await getAuthPayload(request, env);
        if (!payload) return Response.json({ success: false, error: "Unauthorized" }, { status: 401, headers: apiHeaders });
        const result = await env.DB.prepare("SELECT id, name, created_at FROM classes ORDER BY created_at DESC").all();
        return Response.json({ success: true, classes: result.results || [] }, { headers: apiHeaders });
      }

      if (path === "/api/classes" && request.method === "POST") {
        const payload = await getAuthPayload(request, env);
        if (!payload) return Response.json({ success: false, error: "Unauthorized" }, { status: 401, headers: apiHeaders });
        const { name } = await request.json() as any;
        const trimmedName = String(name || "").trim();
        if (!trimmedName) {
          return Response.json({ success: false, error: "Class name is required" }, { status: 400, headers: apiHeaders });
        }
        await env.DB.prepare("INSERT INTO classes (name) VALUES (?)").bind(trimmedName).run();
        const created = await env.DB.prepare("SELECT id, name, created_at FROM classes WHERE name = ?").bind(trimmedName).first();
        return Response.json({ success: true, class: created }, { headers: apiHeaders });
      }

      // 4. SETTINGS
      if (path === "/api/settings/reset" && request.method === "POST") {
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
        if (keys.length > 0) {
          await env.BUCKET.delete(keys);
        }

        await env.DB.batch([
          env.DB.prepare("DELETE FROM fonts"),
          env.DB.prepare("DELETE FROM class_groups"),
          env.DB.prepare("DELETE FROM classes"),
        ]);
        await initDatabase(env.DB);
        return Response.json({ success: true }, { headers: apiHeaders });
      }
  } catch (e: any) {
      return Response.json({ success: false, error: e.message || "Internal Server Error" }, { status: 500, headers: apiHeaders });
  }

  return null;
}
