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
const clampZoom = (value: number | null) => {
  if (!value || Number.isNaN(value)) return 1;
  return Math.min(1, Math.max(0.8, value));
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

const normalizeEmail = (value: string) => value.trim().toLowerCase();

const ensureAdmin = (payload: any | null) => {
  if (!payload || payload.role !== "admin") return false;
  return true;
};

const normalizeSubject = (value: string) => value.trim().toLowerCase();

const safeParseContent = (data: unknown) => {
  if (typeof data !== "string") return {};
  try {
    return JSON.parse(data);
  } catch {
    return {};
  }
};

const filterMap = (value: any, predicate: (key: string) => boolean) => {
  if (!value || typeof value !== "object") return {};
  return Object.fromEntries(Object.entries(value).filter(([key]) => predicate(key)));
};

const mergeMaps = (existing: any, updates: any) => {
  if (!existing || typeof existing !== "object") return { ...(updates || {}) };
  return { ...existing, ...(updates || {}) };
};

const applyTeacherContentUpdate = (existingContent: any, incomingContent: any, assignment: { level: string; subject: string }) => {
  const level = String(assignment.level || "").toUpperCase();
  const subject = normalizeSubject(String(assignment.subject || ""));
  const updated = { ...existingContent };
  const prefix = `${level}-`;

  const applyArray = (key: string) => {
    if (Array.isArray(incomingContent?.[key])) {
      updated[key] = incomingContent[key];
    }
  };

  const applyMapWithFilter = (key: string, predicate: (mapKey: string) => boolean) => {
    if (incomingContent?.[key] && typeof incomingContent[key] === "object") {
      const filtered = filterMap(incomingContent[key], predicate);
      updated[key] = mergeMaps(existingContent?.[key], filtered);
    }
  };

  if (subject === "bangla 1st paper") {
    if (level === "SSC") {
      applyArray("sscGoddoItems");
      applyArray("sscPoddoItems");
      applyArray("sscShohopathItems");
    }
    if (level === "HSC") {
      applyArray("hscGoddoItems");
      applyArray("hscPoddoItems");
      applyArray("hscShohopathItems");
    }
    applyMapWithFilter("srijonshilQuestions", (key) => key.startsWith(prefix));
    applyMapWithFilter("mcqQuestions", (key) => key.startsWith(prefix) && !key.startsWith(`${prefix}ICT-`));
    applyMapWithFilter("notesByItem", (key) => key.startsWith(prefix));
    return updated;
  }

  if (subject === "information and communication technology" && level === "SSC") {
    applyArray("sscIctChapters");
    applyMapWithFilter("mcqQuestions", (key) => key.startsWith(`${prefix}ICT-`));
    return updated;
  }

  if (subject === "english 1st paper" && level === "HSC") {
    applyMapWithFilter("englishQuestions", (key) => key.startsWith(prefix));
    return updated;
  }

  return null;
};

let dbInitialized = false;
let dbInitPromise: Promise<void> | null = null;

const ensureDatabaseReady = async (env: Env) => {
  if (dbInitialized) return;
  if (!dbInitPromise) {
    dbInitPromise = initDatabase(env.DB)
      .then(() => {
        dbInitialized = true;
      })
      .catch((error) => {
        dbInitPromise = null;
        throw error;
      });
  }
  await dbInitPromise;
};

export async function handleApiRequest(request: Request, env: Env): Promise<Response | null> {
  const url = new URL(request.url);
  const path = url.pathname;

  if (request.method === "OPTIONS") return new Response(null, { headers: apiHeaders });
  if (!path.startsWith("/api/")) return null;

  try {
      await ensureDatabaseReady(env);

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

      if (path.startsWith("/api/thumbnails")) {
        if (path === "/api/thumbnails" && request.method === "GET") {
          const rows = await env.DB.prepare("SELECT subject_key, zoom FROM subject_thumbnails ORDER BY updated_at DESC").all();
          const thumbnails = (rows.results || []).map((row: any) => ({
            subjectKey: row.subject_key,
            zoom: typeof row.zoom === "number" ? row.zoom : 1,
            url: `/api/thumbnails/${row.subject_key}`,
          }));
          return Response.json({ thumbnails }, { headers: apiHeaders });
        }

        if (path === "/api/thumbnails" && request.method === "POST") {
          const payload = await getAuthPayload(request, env);
          if (!payload) return Response.json({ success: false, error: "Unauthorized" }, { status: 401, headers: apiHeaders });
          const formData = await request.formData();
          const subjectKey = String(formData.get("subjectKey") || "").trim().toLowerCase();
          if (!subjectKey || !/^[a-z0-9-]+$/.test(subjectKey)) {
            return Response.json({ success: false, error: "Invalid subject key." }, { status: 400, headers: apiHeaders });
          }
          const zoomValue = clampZoom(Number(formData.get("zoom")));
          const file = formData.get("file");
          const existing = await env.DB.prepare("SELECT file_key, content_type FROM subject_thumbnails WHERE subject_key = ?")
            .bind(subjectKey)
            .first();

          if (!(file instanceof File) && !existing) {
            return Response.json({ success: false, error: "Thumbnail file is required." }, { status: 400, headers: apiHeaders });
          }

          let fileKey = existing?.file_key as string | undefined;
          let contentType = existing?.content_type as string | undefined;

          if (file instanceof File) {
            const arrayBuffer = await file.arrayBuffer();
            fileKey = `thumbnails/${subjectKey}-${crypto.randomUUID()}-${file.name}`;
            contentType = file.type || "application/octet-stream";
            await env.BUCKET.put(fileKey, arrayBuffer, {
              httpMetadata: {
                contentType,
              },
            });
            if (existing?.file_key) {
              await env.BUCKET.delete(existing.file_key as string);
            }
          }

          await env.DB.prepare(
            "INSERT INTO subject_thumbnails (subject_key, file_key, content_type, zoom, updated_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP) " +
              "ON CONFLICT(subject_key) DO UPDATE SET file_key = excluded.file_key, content_type = excluded.content_type, zoom = excluded.zoom, updated_at = CURRENT_TIMESTAMP"
          ).bind(subjectKey, fileKey, contentType, zoomValue).run();

          return Response.json(
            {
              success: true,
              thumbnail: {
                subjectKey,
                zoom: zoomValue,
                url: `/api/thumbnails/${subjectKey}`,
              },
            },
            { headers: apiHeaders }
          );
        }

        if (path.startsWith("/api/thumbnails/") && request.method === "GET") {
          const subjectKey = decodeURIComponent(path.replace("/api/thumbnails/", "")).toLowerCase();
          if (!subjectKey || !/^[a-z0-9-]+$/.test(subjectKey)) {
            return Response.json({ success: false, error: "Invalid subject key." }, { status: 400, headers: apiHeaders });
          }
          const thumbnail = await env.DB.prepare("SELECT file_key, content_type FROM subject_thumbnails WHERE subject_key = ?")
            .bind(subjectKey)
            .first();
          if (!thumbnail) {
            return Response.json({ success: false, error: "Thumbnail not found." }, { status: 404, headers: apiHeaders });
          }
          const object = await env.BUCKET.get(thumbnail.file_key as string);
          if (!object) {
            return Response.json({ success: false, error: "Thumbnail file missing." }, { status: 404, headers: apiHeaders });
          }
          const headers = new Headers(apiHeaders);
          headers.set("Content-Type", (thumbnail.content_type as string) || "application/octet-stream");
          headers.set("Cache-Control", "public, max-age=86400");
          return new Response(object.body, { headers });
        }
      }

      // 1. SYSTEM INITIALIZATION
      if (path === "/api/init" && request.method === "POST") {
        await initDatabase(env.DB);
        return Response.json({ success: true, message: "Database initialized" }, { headers: apiHeaders });
      }

      if (path === "/api/setup-status") {
        const result = await env.DB.prepare("SELECT count(*) as count FROM users WHERE role = 'admin'").first();
        const legacy = await env.DB.prepare("SELECT count(*) as count FROM admins").first();
        const hasAdmin = (result?.count as number) > 0 || (legacy?.count as number) > 0;
        return Response.json({ hasAdmin }, { headers: apiHeaders });
      }

      // 2. AUTHENTICATION
      if (path === "/api/register-admin" && request.method === "POST") {
        const { username, password } = await request.json() as any;
        const count = await env.DB.prepare("SELECT count(*) as count FROM users WHERE role = 'admin'").first();
        const legacyCount = await env.DB.prepare("SELECT count(*) as count FROM admins").first();
        if ((count?.count as number) > 0 || (legacyCount?.count as number) > 0) {
          return Response.json({ success: false, error: "User already exists" }, { status: 403, headers: apiHeaders });
        }

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
        const passwordHash = `${saltHex}:${hash}`;
        await env.DB.batch([
          env.DB.prepare("INSERT INTO users (username, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)")
            .bind(cleanedUsername, cleanedUsername, null, passwordHash, "admin"),
          env.DB.prepare("INSERT INTO admin_permissions (user_id, permissions) VALUES ((SELECT id FROM users WHERE username = ?), ?)")
            .bind(cleanedUsername, JSON.stringify(["dashboard", "classes", "settings", "thumbnails", "userManagement"])),
          env.DB.prepare("INSERT INTO admins (username, password_hash) VALUES (?, ?)").bind(cleanedUsername, passwordHash),
        ]);
        return Response.json({ success: true }, { headers: apiHeaders });
      }

      if (path === "/api/login" && request.method === "POST") {
        const { username, password } = await request.json() as any;
        const cleanedUsername = String(username || "").trim();
        const cleanedPassword = String(password || "");
        if (!cleanedUsername || !cleanedPassword) {
          return Response.json({ success: false, error: "Username and password are required." }, { status: 400, headers: apiHeaders });
        }
        const normalizedEmail = normalizeEmail(cleanedUsername);
        let user = await env.DB.prepare("SELECT * FROM users WHERE username = ? OR email = ?").bind(cleanedUsername, normalizedEmail).first();
        let role = user?.role as string | undefined;
        let permissions: string[] = [];
        let assignment: { level: string; subject: string } | null = null;

        if (user) {
          const [saltHex, originalHash] = (user.password_hash as string).split(':');
          const hash = await hashPassword(cleanedPassword, saltHex);
          if (hash !== originalHash) return Response.json({ success: false, error: "Invalid credentials" }, { status: 401, headers: apiHeaders });

          if (role === "admin") {
            const row = await env.DB.prepare("SELECT permissions FROM admin_permissions WHERE user_id = ?").bind(user.id).first();
            permissions = row?.permissions ? JSON.parse(row.permissions as string) : [];
          }
          if (role === "teacher") {
            const row = await env.DB.prepare("SELECT level, subject FROM teacher_assignments WHERE user_id = ?").bind(user.id).first();
            assignment = row ? { level: row.level as string, subject: row.subject as string } : null;
          }
        } else {
          const legacy = await env.DB.prepare("SELECT * FROM admins WHERE username = ?").bind(cleanedUsername).first();
          if (!legacy) return Response.json({ success: false, error: "Invalid credentials" }, { status: 401, headers: apiHeaders });
          user = legacy;
          role = "admin";
          const [saltHex, originalHash] = (legacy.password_hash as string).split(':');
          const hash = await hashPassword(cleanedPassword, saltHex);
          if (hash !== originalHash) return Response.json({ success: false, error: "Invalid credentials" }, { status: 401, headers: apiHeaders });
          permissions = ["dashboard", "classes", "settings", "thumbnails", "userManagement"];
        }

        const secret = requireJwtSecret(env);
        const token = await createToken(
          {
            username: user.username || user.email || user.name,
            id: user.id,
            role,
            permissions,
            assignment,
          },
          secret
        );
        return Response.json(
          {
            success: true,
            username: user.username || user.email || user.name,
            role,
            permissions,
            assignment,
            token,
          },
          { headers: apiHeaders }
        );
      }

      if (path === "/api/me" && request.method === "GET") {
        const authHeader = request.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) return Response.json({ user: null }, { headers: apiHeaders });
        const secret = requireJwtSecret(env);
        const payload = await verifyToken(authHeader.split(" ")[1], secret);
        return Response.json(
          {
            user: payload
              ? {
                  username: payload.username,
                  role: payload.role,
                  permissions: payload.permissions || [],
                  assignment: payload.assignment || null,
                }
              : null,
          },
          { headers: apiHeaders }
        );
      }

      if (path === "/api/change-password" && request.method === "POST") {
        const payload = await getAuthPayload(request, env);
        if (!payload) return Response.json({ success: false, error: "Unauthorized" }, { status: 401, headers: apiHeaders });
        const body = await request.json().catch(() => ({}));
        const currentPassword = String(body.currentPassword || "");
        const newPassword = String(body.newPassword || "");
        const confirmPassword = String(body.confirmPassword || "");

        if (!currentPassword || !newPassword || !confirmPassword) {
          return Response.json({ success: false, error: "All password fields are required." }, { status: 400, headers: apiHeaders });
        }
        if (newPassword.length < 8) {
          return Response.json({ success: false, error: "New password must be at least 8 characters." }, { status: 400, headers: apiHeaders });
        }
        if (newPassword !== confirmPassword) {
          return Response.json({ success: false, error: "New passwords do not match." }, { status: 400, headers: apiHeaders });
        }

        const userRow = await env.DB.prepare("SELECT id, username, password_hash FROM users WHERE id = ?").bind(payload.id).first();
        let passwordHashSource = userRow?.password_hash as string | undefined;
        let adminRow: { id: number; username: string; password_hash: string } | null = null;

        if (!passwordHashSource && payload.role === "admin") {
          const legacyRow = await env.DB.prepare("SELECT id, username, password_hash FROM admins WHERE id = ?").bind(payload.id).first();
          if (legacyRow?.password_hash) {
            adminRow = legacyRow as any;
            passwordHashSource = legacyRow.password_hash as string;
          }
        }

        if (!passwordHashSource) {
          return Response.json({ success: false, error: "User not found." }, { status: 404, headers: apiHeaders });
        }

        const [saltHex, originalHash] = passwordHashSource.split(":");
        const currentHash = await hashPassword(currentPassword, saltHex);
        if (currentHash !== originalHash) {
          return Response.json({ success: false, error: "Current password is incorrect." }, { status: 401, headers: apiHeaders });
        }

        const salt = crypto.getRandomValues(new Uint8Array(16));
        const newSaltHex = Array.from(salt).map(b => b.toString(16).padStart(2, "0")).join("");
        const nextHash = await hashPassword(newPassword, newSaltHex);
        const nextPasswordHash = `${newSaltHex}:${nextHash}`;

        const updates = [];
        if (userRow?.id) {
          updates.push(env.DB.prepare("UPDATE users SET password_hash = ? WHERE id = ?").bind(nextPasswordHash, userRow.id));
          updates.push(env.DB.prepare("UPDATE admins SET password_hash = ? WHERE username = ?").bind(nextPasswordHash, userRow.username));
        }
        if (adminRow?.id) {
          updates.push(env.DB.prepare("UPDATE admins SET password_hash = ? WHERE id = ?").bind(nextPasswordHash, adminRow.id));
        }

        if (updates.length) {
          await env.DB.batch(updates);
        }

        return Response.json({ success: true }, { headers: apiHeaders });
      }

      if (path === "/api/users" && request.method === "GET") {
        const payload = await getAuthPayload(request, env);
        if (!ensureAdmin(payload)) return Response.json({ success: false, error: "Unauthorized" }, { status: 401, headers: apiHeaders });
        const admins = await env.DB.prepare("SELECT id, name, email FROM users WHERE role = 'admin' ORDER BY created_at DESC").all();
        const teachers = await env.DB.prepare("SELECT id, name, email FROM users WHERE role = 'teacher' ORDER BY created_at DESC").all();
        const adminPermissions = await env.DB.prepare("SELECT user_id, permissions FROM admin_permissions").all();
        const teacherAssignments = await env.DB.prepare("SELECT user_id, level, subject FROM teacher_assignments").all();

        const permissionsMap = new Map<number, string[]>();
        (adminPermissions.results || []).forEach((row: any) => {
          if (row?.user_id) {
            permissionsMap.set(row.user_id, row.permissions ? JSON.parse(row.permissions as string) : []);
          }
        });
        const assignmentMap = new Map<number, { level: string; subject: string }>();
        (teacherAssignments.results || []).forEach((row: any) => {
          if (row?.user_id) {
            assignmentMap.set(row.user_id, { level: row.level as string, subject: row.subject as string });
          }
        });

        return Response.json(
          {
            success: true,
            admins: (admins.results || []).map((row: any) => ({
              id: row.id,
              name: row.name,
              email: row.email,
              permissions: permissionsMap.get(row.id) || [],
            })),
            teachers: (teachers.results || []).map((row: any) => ({
              id: row.id,
              name: row.name,
              email: row.email,
              level: assignmentMap.get(row.id)?.level || "",
              subject: assignmentMap.get(row.id)?.subject || "",
            })),
          },
          { headers: apiHeaders }
        );
      }

      if (path === "/api/users" && request.method === "POST") {
        const payload = await getAuthPayload(request, env);
        if (!ensureAdmin(payload)) return Response.json({ success: false, error: "Unauthorized" }, { status: 401, headers: apiHeaders });
        const body = await request.json() as any;
        const role = String(body.role || "").trim().toLowerCase();
        const name = String(body.name || "").trim();
        const email = normalizeEmail(String(body.email || ""));
        const password = String(body.password || "");
        if (!name || !email || !password) {
          return Response.json({ success: false, error: "Name, email, and password are required." }, { status: 400, headers: apiHeaders });
        }
        if (password.length < 8) {
          return Response.json({ success: false, error: "Password must be at least 8 characters." }, { status: 400, headers: apiHeaders });
        }
        if (!["admin", "teacher"].includes(role)) {
          return Response.json({ success: false, error: "Invalid role." }, { status: 400, headers: apiHeaders });
        }

        const salt = crypto.getRandomValues(new Uint8Array(16));
        const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
        const hash = await hashPassword(password, saltHex);
        const passwordHash = `${saltHex}:${hash}`;
        const username = email;

        await env.DB.prepare(
          "INSERT INTO users (username, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)"
        ).bind(username, name, email, passwordHash, role).run();

        const inserted = await env.DB.prepare("SELECT id FROM users WHERE email = ?").bind(email).first();
        if (!inserted?.id) {
          return Response.json({ success: false, error: "User creation failed." }, { status: 500, headers: apiHeaders });
        }

        if (role === "teacher") {
          const level = String(body.level || "").trim();
          const subject = String(body.subject || "").trim();
          if (!level || !subject) {
            return Response.json({ success: false, error: "Teacher level and subject are required." }, { status: 400, headers: apiHeaders });
          }
          await env.DB.prepare("INSERT INTO teacher_assignments (user_id, level, subject) VALUES (?, ?, ?)")
            .bind(inserted.id, level, subject)
            .run();
        }

        if (role === "admin") {
          const rawPermissions = body.permissions || [];
          const permissions = Array.isArray(rawPermissions)
            ? rawPermissions.map((entry: any) => String(entry))
            : Object.entries(rawPermissions)
                .filter(([, enabled]) => Boolean(enabled))
                .map(([key]) => key);
          await env.DB.prepare("INSERT INTO admin_permissions (user_id, permissions) VALUES (?, ?)")
            .bind(inserted.id, JSON.stringify(permissions))
            .run();
        }

        return Response.json({ success: true }, { headers: apiHeaders });
      }

      if (path === "/api/content" && request.method === "GET") {
        const row = await env.DB.prepare("SELECT data FROM content_store WHERE key = ?").bind("app-content").first();
        let content = {};
        if (row?.data) {
          try {
            content = JSON.parse(row.data as string);
          } catch {
            content = {};
          }
        }
        return Response.json({ success: true, content }, { headers: apiHeaders });
      }

      if (path === "/api/content" && request.method === "PUT") {
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
          const row = await env.DB.prepare("SELECT data FROM content_store WHERE key = ?").bind("app-content").first();
          const existingContent = row?.data ? safeParseContent(row.data) : {};
          const updatedContent = applyTeacherContentUpdate(existingContent, body, payload.assignment);
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
        const thumbnailRows = await env.DB.prepare("SELECT file_key FROM subject_thumbnails").all();
        const thumbnailKeys = (thumbnailRows.results || [])
          .map((row: any) => row.file_key)
          .filter((key: string | null) => typeof key === "string" && key.length > 0);
        if (keys.length > 0) {
          await env.BUCKET.delete(keys);
        }
        if (thumbnailKeys.length > 0) {
          await env.BUCKET.delete(thumbnailKeys);
        }

        await env.DB.batch([
          env.DB.prepare("DELETE FROM fonts"),
          env.DB.prepare("DELETE FROM subject_thumbnails"),
          env.DB.prepare("DELETE FROM content_store WHERE key = 'app-content'"),
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
