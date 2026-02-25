import { ensureSchema } from "./db/schema.js";
import { createSession, createUser, deleteSession, findUserByEmail, findUserById, listUsers, updateUserCoverImage, updateUserDateOfBirth, updateUserImage, updateUserName, updateUserPassword } from "./db/adminRepo.js";
import { hashPassword, verifyPassword } from "./security/password.js";
import { buildSessionCookie, clearSessionCookie, createSignedToken } from "./security/session.js";
import { html, json, redirect } from "./http/response.js";
import { methodNotAllowed } from "./http/request.js";
import { requireAuth } from "./api/auth.js";
import { forbiddenPage, loginPage, mediaManagerPage, profilePage, publicHomePage, usersPage } from "./pages/layout.js";
import { MAX_IMAGE_BYTES, SESSION_COOKIE } from "./env.js";

const ACCESS = {
  PUBLIC: "public",
  AUTHENTICATED: "authenticated",
};

let appReadyPromise = null;

function id() {
  return crypto.randomUUID();
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isSupportedRole(role) {
  return role === "admin" || role === "teacher";
}

function hasSessionCookie(request) {
  const cookie = request.headers.get("cookie") || "";
  return cookie.includes(`${SESSION_COOKIE}=`);
}

function shouldResolveUser(request, route, pathname) {
  if (hasSessionCookie(request)) return true;
  if (route?.access === ACCESS.AUTHENTICATED) return true;
  if (pathname.startsWith("/api/") || pathname.startsWith("/media/")) return true;
  return false;
}

function inferMediaTypeFromKey(key) {
  const ext = String(key.split(".").pop() || "").toLowerCase();
  const imageExt = new Set(["jpg", "jpeg", "png", "gif", "webp", "svg", "avif", "bmp"]);
  const videoExt = new Set(["mp4", "webm", "mov", "m4v", "avi", "mkv", "wmv", "3gp", "m3u8"]);
  if (imageExt.has(ext)) return { mediaType: "image", ext };
  if (videoExt.has(ext)) return { mediaType: "video", ext };
  return { mediaType: "other", ext };
}

function inferSourceFromKey(key) {
  const firstSegment = String(key || "").split("/").filter(Boolean)[0] || "root";
  return firstSegment;
}

async function listAllBucketObjects(bucket) {
  const rows = [];
  let cursor;

  while (true) {
    const listing = await bucket.list({ limit: 1000, cursor });
    for (const object of listing.objects || []) {
      const typeInfo = inferMediaTypeFromKey(object.key);
      rows.push({
        key: object.key,
        size: Number(object.size || 0),
        uploaded: object.uploaded || null,
        mediaType: typeInfo.mediaType,
        ext: typeInfo.ext,
        source: inferSourceFromKey(object.key),
        storageStatus: "bucket",
      });
    }

    if (!listing.truncated || !listing.cursor) break;
    cursor = listing.cursor;
  }

  return rows.sort((a, b) => String(b.uploaded || "").localeCompare(String(a.uploaded || "")));
}

function filterMediaRows(rows, filters) {
  const type = filters.type === "image" || filters.type === "video" || filters.type === "other" ? filters.type : "all";
  const source = String(filters.source || "all").trim();
  const search = String(filters.search || "").trim().toLowerCase();

  return rows.filter((row) => {
    if (type !== "all" && row.mediaType !== type) return false;
    if (source !== "all" && row.source !== source) return false;
    if (search && !row.key.toLowerCase().includes(search)) return false;
    return true;
  });
}

async function uploadImage(env, folder, file) {
  if (!file || file.size === 0 || typeof file.arrayBuffer !== "function") return null;
  if (file.size > MAX_IMAGE_BYTES) throw new Error("Image too large (max 5MB).");
  const ext = file.type === "image/webp" ? "webp" : file.type === "image/png" ? "png" : file.type === "image/jpeg" ? "jpg" : "bin";
  const key = `${folder}/${id()}.${ext}`;
  await env.BUCKET.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type || "application/octet-stream" },
  });
  return key;
}

function sanitizeMediaKey(value) {
  const key = String(value || "").trim();
  if (!key || key.includes("..")) return null;
  return key;
}

async function deleteBucketObjects(env, keys) {
  const safeKeys = Array.from(new Set(keys.map((key) => sanitizeMediaKey(key)).filter(Boolean)));
  await Promise.allSettled(safeKeys.map((key) => env.BUCKET.delete(key)));
}

async function replaceMediaKey(env, previousKey, nextKey) {
  const previous = sanitizeMediaKey(previousKey);
  const next = sanitizeMediaKey(nextKey);
  if (!previous || previous === next) return;
  await deleteBucketObjects(env, [previous]);
}

async function listImageKeys(db, sql, ...params) {
  const rows = await db.prepare(sql).bind(...params).all();
  return (rows.results || []).map((row) => row.image_key).filter(Boolean);
}

async function listAllReferencedMediaKeys(db) {
  const queries = ["SELECT image_key FROM users", "SELECT cover_image_key AS image_key FROM users"];
  const results = await Promise.all(queries.map((sql) => listImageKeys(db, sql)));
  return Array.from(new Set(results.flat().map((key) => sanitizeMediaKey(key)).filter(Boolean)));
}

async function clearMediaReferences(db, key) {
  const safeKey = sanitizeMediaKey(key);
  if (!safeKey) return;

  const cleanupQueries = [
    "UPDATE users SET image_key = NULL WHERE image_key = ?1",
    "UPDATE users SET cover_image_key = NULL WHERE cover_image_key = ?1",
  ];

  await Promise.all(cleanupQueries.map((sql) => db.prepare(sql).bind(safeKey).run()));
}

function mergeMediaRows(bucketRows, databaseKeys) {
  const rowMap = new Map(bucketRows.map((row) => [row.key, row]));

  for (const key of databaseKeys) {
    if (rowMap.has(key)) continue;
    const typeInfo = inferMediaTypeFromKey(key);
    rowMap.set(key, {
      key,
      size: 0,
      uploaded: null,
      mediaType: typeInfo.mediaType,
      ext: typeInfo.ext,
      source: inferSourceFromKey(key),
      storageStatus: "database_only",
    });
  }

  return Array.from(rowMap.values()).sort((a, b) => String(b.uploaded || "").localeCompare(String(a.uploaded || "")));
}

async function createAndSetSession(env, userId) {
  const session = {
    id: id(),
    userId,
    expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 14,
    createdAt: new Date().toISOString(),
  };
  await createSession(env.DB, session);
  const token = await createSignedToken(env.AUTH_SECRET, session.id);
  return buildSessionCookie(token);
}

async function ensureAppReady(env) {
  if (!appReadyPromise) {
    appReadyPromise = ensureSchema(env.DB, { cleanUnknownTables: env.CLEAN_UNKNOWN_TABLES === "true" });
  }

  try {
    await appReadyPromise;
  } catch (error) {
    appReadyPromise = null;
    throw error;
  }
}

async function apiLogin(request, env) {
  if (request.method !== "POST") return methodNotAllowed();
  const body = await request.json().catch(() => null);
  if (!body) return json({ error: "Invalid request." }, 400);
  const email = String(body.email || "")
    .trim()
    .toLowerCase();
  const password = String(body.password || "");

  const user = await findUserByEmail(env.DB, email);
  if (!user) return json({ error: "Invalid credentials." }, 401);

  const valid = await verifyPassword(password, {
    salt: user.password_salt,
    hash: user.password_hash,
    iterations: user.password_iterations,
  });
  if (!valid) return json({ error: "Invalid credentials." }, 401);

  const cookie = await createAndSetSession(env, user.id);
  return json({ ok: true }, 200, { "Set-Cookie": cookie });
}

async function apiLogout(env, user) {
  await deleteSession(env.DB, user.sessionId);
  return redirect("/login", { "Set-Cookie": clearSessionCookie() });
}

function routeRequiresRole(route, user) {
  return Array.isArray(route.roles) && !route.roles.includes(user.role);
}

function isPrivatePagePath(pathname, route) {
  if (route?.access === ACCESS.AUTHENTICATED) return true;
  if (pathname === "/login") return true;
  if (pathname.startsWith("/profile") || pathname.startsWith("/users")) return true;
  if (pathname.startsWith("/admin/")) return true;
  return false;
}

function resolvePageCacheControl(pathname, route, user) {
  if (user) return "private, no-store, max-age=0, must-revalidate";
  if (isPrivatePagePath(pathname, route)) return "private, no-store, max-age=0, must-revalidate";
  if (pathname === "/") return "public, max-age=1800, stale-while-revalidate=21600";
  return "public, max-age=600, stale-while-revalidate=3600";
}

function applyHtmlPageCaching(response, pathname, route, user = null) {
  if (!(response instanceof Response)) return response;
  const contentType = String(response.headers.get("content-type") || "").toLowerCase();
  if (!contentType.includes("text/html")) return response;

  const headers = new Headers(response.headers);
  headers.set("cache-control", resolvePageCacheControl(pathname, route, user));
  return new Response(response.body, { status: response.status, headers });
}

function canUsePublicHtmlEdgeCache(request, pathname, route, user) {
  if (request.method !== "GET") return false;
  if (user) return false;
  if (hasSessionCookie(request)) return false;
  return !isPrivatePagePath(pathname, route);
}

function buildPublicHtmlCacheKey(request, pathname, search) {
  return new Request(`https://public-page-cache.local${pathname}${search}`, {
    method: "GET",
    headers: {
      "accept-language": request.headers.get("accept-language") || "",
    },
  });
}

async function maybeServeCachedPublicHtml(request, pathname, search, route, user) {
  if (!canUsePublicHtmlEdgeCache(request, pathname, route, user)) return null;
  const cached = await caches.default.match(buildPublicHtmlCacheKey(request, pathname, search));
  if (!cached) return null;
  const headers = new Headers(cached.headers);
  headers.set("x-edge-cache", "HIT");
  return new Response(cached.body, { status: cached.status, headers });
}

function queuePublicHtmlEdgeCacheWrite(ctx, request, url, route, user, response) {
  if (!canUsePublicHtmlEdgeCache(request, url.pathname, route, user)) return response;
  if (!(response instanceof Response) || response.status !== 200) return response;
  const contentType = String(response.headers.get("content-type") || "").toLowerCase();
  if (!contentType.includes("text/html")) return response;

  const cacheable = response.clone();
  ctx.waitUntil(caches.default.put(buildPublicHtmlCacheKey(request, url.pathname, url.search), cacheable));

  const headers = new Headers(response.headers);
  headers.set("x-edge-cache", "MISS");
  return new Response(response.body, { status: response.status, headers });
}

const pageRoutes = [
  {
    path: "/",
    access: ACCESS.PUBLIC,
    handle: async ({ user }) => html(publicHomePage(user)),
  },
  { path: "/login", access: ACCESS.PUBLIC, handle: () => html(loginPage()) },
  { path: "/profile", access: ACCESS.AUTHENTICATED, handle: ({ user }) => html(profilePage(user)) },
  {
    path: "/users",
    access: ACCESS.AUTHENTICATED,
    roles: ["admin"],
    handle: async ({ env, user }) => html(usersPage(user, await listUsers(env.DB))),
  },
  {
    path: "/admin/file-manager",
    access: ACCESS.AUTHENTICATED,
    roles: ["admin"],
    handle: async ({ env, user, url }) => {
      const filters = {
        type: String(url.searchParams.get("type") || "all"),
        source: String(url.searchParams.get("source") || "all"),
        search: String(url.searchParams.get("search") || ""),
      };
      const [bucketRows, databaseKeys] = await Promise.all([listAllBucketObjects(env.BUCKET), listAllReferencedMediaKeys(env.DB)]);
      const rows = mergeMediaRows(bucketRows, databaseKeys);
      const filteredRows = filterMediaRows(rows, filters);

      return html(
        mediaManagerPage(user, {
          rows: filteredRows,
          filters,
          loadedCount: filteredRows.length,
          totalCount: rows.length,
          bucketCount: bucketRows.length,
          databaseOnlyCount: rows.filter((row) => row.storageStatus === "database_only").length,
        }),
      );
    },
  },
];

async function handleProfilePost(request, env, url, user) {
  if (request.method !== "POST") return null;

  if (url.pathname === "/api/profile/name") {
    const form = await request.formData();
    const name = String(form.get("name") || "").trim();
    if (!name || name.length > 100) return redirect("/profile");
    await updateUserName(env.DB, user.id, name);
    return redirect("/profile");
  }

  if (url.pathname === "/api/profile/avatar") {
    const form = await request.formData();
    const imageKey = await uploadImage(env, "profiles", form.get("avatar"));
    if (imageKey) {
      await updateUserImage(env.DB, user.id, imageKey);
      await replaceMediaKey(env, user.image_key, imageKey);
    }

    const wantsJson = request.headers.get("accept")?.includes("application/json");
    if (wantsJson) return json({ ok: true, imageKey, imageUrl: imageKey ? `/media/${encodeURIComponent(imageKey)}` : null });

    return redirect("/profile");
  }

  if (url.pathname === "/api/profile/cover") {
    const form = await request.formData();
    const imageKey = await uploadImage(env, "profile-covers", form.get("cover"));
    if (imageKey) {
      await updateUserCoverImage(env.DB, user.id, imageKey);
      await replaceMediaKey(env, user.cover_image_key, imageKey);
    }

    const wantsJson = request.headers.get("accept")?.includes("application/json");
    if (wantsJson) return json({ ok: true, imageKey, imageUrl: imageKey ? `/media/${encodeURIComponent(imageKey)}` : null });

    return redirect("/profile");
  }

  if (url.pathname === "/api/profile/password") {
    const form = await request.formData();
    const currentPassword = String(form.get("currentPassword") || "");
    const newPassword = String(form.get("newPassword") || "");

    if (newPassword.length < 8 || newPassword.length > 120) return redirect("/profile");
    const currentUser = await findUserById(env.DB, user.id);
    if (!currentUser) return redirect("/profile");

    const valid = await verifyPassword(currentPassword, {
      salt: currentUser.password_salt,
      hash: currentUser.password_hash,
      iterations: currentUser.password_iterations,
    });
    if (!valid) return redirect("/profile");

    const hashed = await hashPassword(newPassword);
    await updateUserPassword(env.DB, user.id, hashed.hash, hashed.salt, hashed.iterations);
    return redirect("/profile");
  }

  if (url.pathname === "/api/profile/dob") {
    const form = await request.formData();
    let dateOfBirthRaw = String(form.get("dateOfBirth") || "").trim();

    if (!dateOfBirthRaw) {
      const day = String(form.get("dobDay") || "").trim();
      const month = String(form.get("dobMonth") || "").trim();
      const year = String(form.get("dobYear") || "").trim();
      if (!day && !month && !year) {
        await updateUserDateOfBirth(env.DB, user.id, null);
        return redirect("/profile");
      }
      if (day && month && year) dateOfBirthRaw = `${year.padStart(4, "0")}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }

    if (!dateOfBirthRaw) return redirect("/profile");

    const dobMatch = /^\d{4}-\d{2}-\d{2}$/.test(dateOfBirthRaw);
    const dobDate = new Date(`${dateOfBirthRaw}T00:00:00.000Z`);
    const isValidDate = Number.isFinite(dobDate.getTime()) && dobDate.toISOString().slice(0, 10) === dateOfBirthRaw;
    const earliest = new Date(Date.UTC(1900, 0, 1));
    const today = new Date();
    const latest = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
    if (!dobMatch || !isValidDate || dobDate < earliest || dobDate > latest) return redirect("/profile");

    await updateUserDateOfBirth(env.DB, user.id, dateOfBirthRaw);
    return redirect("/profile");
  }

  return null;
}

async function handleAdminPost(request, env, url) {
  if (url.pathname === "/api/users" && request.method === "POST") {
    const form = await request.formData();
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "")
      .trim()
      .toLowerCase();
    const password = String(form.get("password") || "");
    const role = String(form.get("role") || "").trim().toLowerCase();

    if (!name || name.length > 100 || !isEmail(email) || password.length < 8 || password.length > 120 || !isSupportedRole(role)) {
      return redirect("/users");
    }

    const existing = await findUserByEmail(env.DB, email);
    if (existing) return redirect("/users");

    const hashed = await hashPassword(password);
    await createUser(env.DB, {
      id: id(),
      email,
      name,
      role,
      passwordHash: hashed.hash,
      passwordSalt: hashed.salt,
      passwordIterations: hashed.iterations,
      createdAt: new Date().toISOString(),
    });
    return redirect("/users");
  }

  if (url.pathname === "/api/media/delete" && request.method === "POST") {
    const form = await request.formData();
    const key = sanitizeMediaKey(form.get("key"));
    const redirectTo = String(form.get("redirect") || "/admin/file-manager");
    if (!key) return redirect(redirectTo || "/admin/file-manager");
    await deleteBucketObjects(env, [key]);
    await clearMediaReferences(env.DB, key);
    return redirect(redirectTo || "/admin/file-manager");
  }

  return null;
}

async function serveMedia(request, url, env, user, ctx) {
  const encodedKey = url.pathname.slice("/media/".length);
  if (!encodedKey) return new Response("Not Found", { status: 404 });

  let key;
  try {
    key = decodeURIComponent(encodedKey);
  } catch {
    return new Response("Not Found", { status: 404 });
  }

  if (!key || key.includes("..")) return new Response("Not Found", { status: 404 });

  const isUserSpecificMedia = key.startsWith("profiles/");
  if (isUserSpecificMedia && !user) return redirect("/login");

  const method = request.method.toUpperCase();
  const canUseCache = method === "GET";
  const cacheKey = new Request(`https://media-cache.local/${encodeURIComponent(key)}`, { method: "GET" });
  if (canUseCache) {
    const cached = await caches.default.match(cacheKey);
    if (cached) return cached;
  }

  const object = await env.BUCKET.get(key);
  if (!object) return new Response("Not Found", { status: 404 });

  const etag = object.httpEtag;
  const ifNoneMatch = request.headers.get("if-none-match");
  if (etag && ifNoneMatch && ifNoneMatch === etag) {
    return new Response(null, {
      status: 304,
      headers: {
        etag,
        "cache-control": `${isUserSpecificMedia ? "private" : "public"}, max-age=2592000, stale-while-revalidate=86400`,
      },
    });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  if (etag) headers.set("etag", etag);
  headers.set("cache-control", `${isUserSpecificMedia ? "private" : "public"}, max-age=2592000, stale-while-revalidate=86400`);
  headers.set("accept-ranges", "bytes");

  if (method === "HEAD") return new Response(null, { headers });
  const response = new Response(object.body, { headers });
  if (canUseCache) ctx.waitUntil(caches.default.put(cacheKey, response.clone()));
  return response;
}

export default {
  async fetch(request, env, ctx) {
    if (!env.AUTH_SECRET) return new Response("AUTH_SECRET is required", { status: 500 });

    try {
      await ensureAppReady(env);
    } catch (error) {
      return json({ error: error instanceof Error ? error.message : "Schema initialization failed." }, 500);
    }

    const url = new URL(request.url);

    if (url.pathname === "/api/login") return apiLogin(request, env);

    const route = pageRoutes.find((item) => item.path === url.pathname);
    const user = shouldResolveUser(request, route, url.pathname) ? await requireAuth(request, env) : null;

    const cachedPublicPage = await maybeServeCachedPublicHtml(request, url.pathname, url.search, route, user);
    if (cachedPublicPage) return cachedPublicPage;

    if (url.pathname.startsWith("/media/")) return serveMedia(request, url, env, user, ctx);

    if (url.pathname === "/api/logout") {
      if (!user) return redirect("/login");
      return apiLogout(env, user);
    }

    if (url.pathname.startsWith("/api/") && request.method === "POST" && url.pathname !== "/api/login") {
      if (!user) return redirect("/login");
      const profilePost = await handleProfilePost(request, env, url, user);
      if (profilePost) return profilePost;
      if (user.role !== "admin") return applyHtmlPageCaching(html(forbiddenPage(), 403), url.pathname, route, user);
      const protectedPost = await handleAdminPost(request, env, url);
      if (protectedPost) return protectedPost;
    }

    if (!route) return new Response("Not Found", { status: 404 });

    if (route.access === ACCESS.AUTHENTICATED && !user) {
      if (url.pathname.startsWith("/api/")) return json({ error: "Unauthorized" }, 401);
      return redirect("/login");
    }

    if (route.access === ACCESS.AUTHENTICATED && routeRequiresRole(route, user)) return applyHtmlPageCaching(html(forbiddenPage(), 403), url.pathname, route, user);

    const routeResponse = await route.handle({ request, env, user, url });
    return queuePublicHtmlEdgeCacheWrite(ctx, request, url, route, user, applyHtmlPageCaching(routeResponse, url.pathname, route, user));
  },
};
