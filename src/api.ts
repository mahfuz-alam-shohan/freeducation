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
const normalizeLevel = (value: string) => value.trim().toUpperCase();
const isValidKey = (value: string) => /^[a-z0-9-]+$/.test(value);
const isValidSubject = (value: string) => /^[a-z0-9\s-]+$/.test(value);
const isValidLevel = (value: string) => ["SSC", "HSC"].includes(value);

const buildPasswordHash = async (password: string) => {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const saltHex = Array.from(salt)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  const hash = await hashPassword(password, saltHex);
  return {
    saltHex,
    passwordHash: `${saltHex}:${hash}`,
  };
};

type ThumbnailConfig = {
  table: "subject_thumbnails" | "chapter_thumbnails";
  keyColumn: "subject_key" | "chapter_key";
  keyField: "subjectKey" | "chapterKey";
  urlPrefix: "/api/thumbnails" | "/api/chapter-thumbnails";
  bucketPrefix: "thumbnails" | "chapter-thumbnails";
  includeZoom: boolean;
};

const subjectThumbnailConfig: ThumbnailConfig = {
  table: "subject_thumbnails",
  keyColumn: "subject_key",
  keyField: "subjectKey",
  urlPrefix: "/api/thumbnails",
  bucketPrefix: "thumbnails",
  includeZoom: true,
};

const chapterThumbnailConfig: ThumbnailConfig = {
  table: "chapter_thumbnails",
  keyColumn: "chapter_key",
  keyField: "chapterKey",
  urlPrefix: "/api/chapter-thumbnails",
  bucketPrefix: "chapter-thumbnails",
  includeZoom: false,
};

const getThumbnailVersion = (row: any) =>
  row?.updated_at ? new Date(row.updated_at as string).getTime() : Date.now();

const handleThumbnailList = async (env: Env, config: ThumbnailConfig) => {
  const columns = config.includeZoom ? `${config.keyColumn}, zoom, updated_at` : `${config.keyColumn}, updated_at`;
  const rows = await env.DB.prepare(
    `SELECT ${columns} FROM ${config.table} ORDER BY updated_at DESC`
  ).all();
  const thumbnails = (rows.results || []).map((row: any) => {
    const version = getThumbnailVersion(row);
    const keyValue = row[config.keyColumn];
    return {
      [config.keyField]: keyValue,
      ...(config.includeZoom ? { zoom: typeof row.zoom === "number" ? row.zoom : 1 } : {}),
      url: `${config.urlPrefix}/${keyValue}?v=${version}`,
    };
  });
  return Response.json({ thumbnails }, { headers: apiHeaders });
};

const handleThumbnailUpload = async (request: Request, env: Env, config: ThumbnailConfig) => {
  const payload = await getAuthPayload(request, env);
  if (!payload) return Response.json({ success: false, error: "Unauthorized" }, { status: 401, headers: apiHeaders });
  if (!ensureAdmin(payload)) {
    return Response.json({ success: false, error: "Admin access required." }, { status: 403, headers: apiHeaders });
  }
  const formData = await request.formData();
  const keyValue = String(formData.get(config.keyField) || "").trim().toLowerCase();
  if (!keyValue || !isValidKey(keyValue)) {
    return Response.json({ success: false, error: `Invalid ${config.keyField.replace("Key", " key")}.` }, { status: 400, headers: apiHeaders });
  }
  const zoomValue = config.includeZoom ? clampZoom(Number(formData.get("zoom"))) : null;
  const file = formData.get("file");
  const existing = await env.DB.prepare(
    `SELECT file_key, content_type${config.includeZoom ? ", zoom" : ""} FROM ${config.table} WHERE ${config.keyColumn} = ?`
  )
    .bind(keyValue)
    .first();

  if (!(file instanceof File) && !existing) {
    return Response.json({ success: false, error: "Thumbnail file is required." }, { status: 400, headers: apiHeaders });
  }

  let fileKey = existing?.file_key as string | undefined;
  let contentType = existing?.content_type as string | undefined;

  if (file instanceof File) {
    const arrayBuffer = await file.arrayBuffer();
    fileKey = `${config.bucketPrefix}/${keyValue}-${crypto.randomUUID()}-${file.name}`;
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

  const insertColumns = config.includeZoom
    ? `${config.keyColumn}, file_key, content_type, zoom, updated_at`
    : `${config.keyColumn}, file_key, content_type, updated_at`;
  const insertValues = config.includeZoom ? "?, ?, ?, ?, CURRENT_TIMESTAMP" : "?, ?, ?, CURRENT_TIMESTAMP";
  const updateColumns = config.includeZoom
    ? "file_key = excluded.file_key, content_type = excluded.content_type, zoom = excluded.zoom, updated_at = CURRENT_TIMESTAMP"
    : "file_key = excluded.file_key, content_type = excluded.content_type, updated_at = CURRENT_TIMESTAMP";
  const statement = env.DB.prepare(
    `INSERT INTO ${config.table} (${insertColumns}) VALUES (${insertValues}) ON CONFLICT(${config.keyColumn}) DO UPDATE SET ${updateColumns}`
  );
  const bindValues = config.includeZoom ? [keyValue, fileKey, contentType, zoomValue] : [keyValue, fileKey, contentType];
  await statement.bind(...bindValues).run();

  const cacheBuster = Date.now();
  return Response.json(
    {
      success: true,
      thumbnail: {
        [config.keyField]: keyValue,
        ...(config.includeZoom ? { zoom: zoomValue } : {}),
        url: `${config.urlPrefix}/${keyValue}?v=${cacheBuster}`,
      },
    },
    { headers: apiHeaders }
  );
};

const handleThumbnailGet = async (env: Env, config: ThumbnailConfig, rawKey: string) => {
  const keyValue = decodeURIComponent(rawKey).toLowerCase();
  if (!keyValue || !isValidKey(keyValue)) {
    return Response.json({ success: false, error: `Invalid ${config.keyField.replace("Key", " key")}.` }, { status: 400, headers: apiHeaders });
  }
  const thumbnail = await env.DB.prepare(`SELECT file_key, content_type FROM ${config.table} WHERE ${config.keyColumn} = ?`)
    .bind(keyValue)
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
};

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

const applyTeacherContentUpdate = (
  existingContent: any,
  incomingContent: any,
  assignment: { level: string; subject: string },
  canEditStructure: boolean
) => {
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
      if (canEditStructure) {
        applyArray("sscGoddoItems");
        applyArray("sscPoddoItems");
        applyArray("sscShohopathItems");
      }
    }
    if (level === "HSC") {
      if (canEditStructure) {
        applyArray("hscGoddoItems");
        applyArray("hscPoddoItems");
        applyArray("hscShohopathItems");
      }
    }
    applyMapWithFilter("srijonshilQuestions", (key) => key.startsWith(prefix));
    applyMapWithFilter("mcqQuestions", (key) => key.startsWith(prefix) && !key.startsWith(`${prefix}ICT-`));
    applyMapWithFilter("notesByItem", (key) => key.startsWith(prefix));
    return updated;
  }

  if (subject === "information and communication technology" && level === "SSC") {
    if (canEditStructure) {
      applyArray("sscIctChapters");
    }
    applyMapWithFilter("mcqQuestions", (key) => key.startsWith(`${prefix}ICT-`));
    return updated;
  }

  const sscScienceSubjects: Record<string, string> = {
    physics: "Physics",
    chemistry: "Chemistry",
    biology: "Biology",
  };

  if (level === "SSC" && sscScienceSubjects[subject]) {
    const subjectLabel = sscScienceSubjects[subject];
    const keyPrefix = `${prefix}${subjectLabel}-`;
    if (canEditStructure) {
      if (subject === "physics") applyArray("sscPhysicsChapters");
      if (subject === "chemistry") applyArray("sscChemistryChapters");
      if (subject === "biology") applyArray("sscBiologyChapters");
    }
    applyMapWithFilter("srijonshilQuestions", (key) => key.startsWith(keyPrefix));
    applyMapWithFilter("mcqQuestions", (key) => key.startsWith(keyPrefix));
    applyMapWithFilter("notesByItem", (key) => key.startsWith(keyPrefix));
    return updated;
  }

  const hscScienceSubjects: Record<string, { label: string; key: string }> = {
    "physics 1st paper": { label: "Physics 1st Paper", key: "hscPhysics1stChapters" },
    "physics 2nd paper": { label: "Physics 2nd Paper", key: "hscPhysics2ndChapters" },
    "chemistry 1st paper": { label: "Chemistry 1st Paper", key: "hscChemistry1stChapters" },
    "chemistry 2nd paper": { label: "Chemistry 2nd Paper", key: "hscChemistry2ndChapters" },
    "biology 1st paper": { label: "Biology 1st Paper", key: "hscBiology1stChapters" },
    "biology 2nd paper": { label: "Biology 2nd Paper", key: "hscBiology2ndChapters" },
  };

  if (level === "HSC" && hscScienceSubjects[subject]) {
    const subjectConfig = hscScienceSubjects[subject];
    const keyPrefix = `${prefix}${subjectConfig.label}-`;
    if (canEditStructure) {
      applyArray(subjectConfig.key);
    }
    applyMapWithFilter("srijonshilQuestions", (key) => key.startsWith(keyPrefix));
    applyMapWithFilter("mcqQuestions", (key) => key.startsWith(keyPrefix));
    applyMapWithFilter("notesByItem", (key) => key.startsWith(keyPrefix));
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
          return handleThumbnailList(env, subjectThumbnailConfig);
        }

        if (path === "/api/thumbnails" && request.method === "POST") {
          return handleThumbnailUpload(request, env, subjectThumbnailConfig);
        }

        if (path.startsWith("/api/thumbnails/") && request.method === "GET") {
          return handleThumbnailGet(env, subjectThumbnailConfig, path.replace("/api/thumbnails/", ""));
        }
      }

      if (path.startsWith("/api/chapter-thumbnails")) {
        if (path === "/api/chapter-thumbnails" && request.method === "GET") {
          return handleThumbnailList(env, chapterThumbnailConfig);
        }

        if (path === "/api/chapter-thumbnails" && request.method === "POST") {
          return handleThumbnailUpload(request, env, chapterThumbnailConfig);
        }

        if (path.startsWith("/api/chapter-thumbnails/") && request.method === "GET") {
          return handleThumbnailGet(env, chapterThumbnailConfig, path.replace("/api/chapter-thumbnails/", ""));
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

        const { passwordHash } = await buildPasswordHash(cleanedPassword);
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
            const permissionsRow = await env.DB.prepare("SELECT permissions FROM teacher_permissions WHERE user_id = ?")
              .bind(user.id)
              .first();
            permissions = permissionsRow?.permissions ? JSON.parse(permissionsRow.permissions as string) : [];
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

        const { passwordHash: nextPasswordHash } = await buildPasswordHash(newPassword);

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
        const teacherPermissions = await env.DB.prepare("SELECT user_id, permissions FROM teacher_permissions").all();
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
        const teacherPermissionsMap = new Map<number, string[]>();
        (teacherPermissions.results || []).forEach((row: any) => {
          if (row?.user_id) {
            teacherPermissionsMap.set(row.user_id, row.permissions ? JSON.parse(row.permissions as string) : []);
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
              permissions: teacherPermissionsMap.get(row.id) || [],
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

        const { passwordHash } = await buildPasswordHash(password);
        const username = email;

        await env.DB.prepare(
          "INSERT INTO users (username, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)"
        ).bind(username, name, email, passwordHash, role).run();

        const inserted = await env.DB.prepare("SELECT id FROM users WHERE email = ?").bind(email).first();
        if (!inserted?.id) {
          return Response.json({ success: false, error: "User creation failed." }, { status: 500, headers: apiHeaders });
        }

        if (role === "teacher") {
          const level = normalizeLevel(String(body.level || ""));
          const subject = normalizeSubject(String(body.subject || ""));
          if (!level || !subject) {
            return Response.json({ success: false, error: "Teacher level and subject are required." }, { status: 400, headers: apiHeaders });
          }
          if (!isValidLevel(level) || !isValidSubject(subject)) {
            return Response.json({ success: false, error: "Invalid teacher level or subject." }, { status: 400, headers: apiHeaders });
          }
          const rawPermissions = body.permissions || [];
          const permissions = Array.isArray(rawPermissions)
            ? rawPermissions.map((entry: any) => String(entry))
            : Object.entries(rawPermissions)
                .filter(([, enabled]) => Boolean(enabled))
                .map(([key]) => key);
          await env.DB.batch([
            env.DB.prepare("INSERT INTO teacher_assignments (user_id, level, subject) VALUES (?, ?, ?)").bind(
              inserted.id,
              level,
              subject
            ),
            env.DB.prepare("INSERT INTO teacher_permissions (user_id, permissions) VALUES (?, ?)").bind(
              inserted.id,
              JSON.stringify(permissions)
            ),
          ]);
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

      if (path === "/api/users" && request.method === "PUT") {
        const payload = await getAuthPayload(request, env);
        if (!ensureAdmin(payload)) return Response.json({ success: false, error: "Unauthorized" }, { status: 401, headers: apiHeaders });
        const body = await request.json() as any;
        const userId = Number(body.id);
        if (!userId) {
          return Response.json({ success: false, error: "User ID is required." }, { status: 400, headers: apiHeaders });
        }
        const role = String(body.role || "").trim().toLowerCase();
        if (role !== "teacher") {
          return Response.json({ success: false, error: "Only teacher updates are supported." }, { status: 400, headers: apiHeaders });
        }
        const level = normalizeLevel(String(body.level || ""));
        const subject = normalizeSubject(String(body.subject || ""));
        if (!level || !subject) {
          return Response.json({ success: false, error: "Teacher level and subject are required." }, { status: 400, headers: apiHeaders });
        }
        if (!isValidLevel(level) || !isValidSubject(subject)) {
          return Response.json({ success: false, error: "Invalid teacher level or subject." }, { status: 400, headers: apiHeaders });
        }
        const rawPermissions = body.permissions || [];
        const permissions = Array.isArray(rawPermissions)
          ? rawPermissions.map((entry: any) => String(entry))
          : Object.entries(rawPermissions)
              .filter(([, enabled]) => Boolean(enabled))
              .map(([key]) => key);
        await env.DB.batch([
          env.DB.prepare(
            "INSERT INTO teacher_assignments (user_id, level, subject) VALUES (?, ?, ?) " +
              "ON CONFLICT(user_id) DO UPDATE SET level = excluded.level, subject = excluded.subject"
          ).bind(userId, level, subject),
          env.DB.prepare(
            "INSERT INTO teacher_permissions (user_id, permissions) VALUES (?, ?) " +
              "ON CONFLICT(user_id) DO UPDATE SET permissions = excluded.permissions"
          ).bind(userId, JSON.stringify(permissions)),
        ]);
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
      }
  } catch (e: any) {
      return Response.json({ success: false, error: e.message || "Internal Server Error" }, { status: 500, headers: apiHeaders });
  }

  return null;
}
