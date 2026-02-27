import { ADMIN_COUNT_CACHE_MS, SCHEMA_REVALIDATE_MS, SESSION_CLEANUP_INTERVAL_MS } from "./config.js";
import { ensureSchema } from "./db/schema.js";
import { cleanupSessions, getAdminCount } from "./db/admins.js";
import { HttpError, mapDatabaseError } from "./core/errors.js";
import { json, redirect } from "./core/response.js";
import { handlePublicRoute } from "./routes/publicRoutes.js";
import { handleAdminRoute } from "./routes/adminRoutes.js";

let schemaReadyAt = 0;
let schemaInFlight = null;
let sessionCleanupAt = 0;
let sessionCleanupInFlight = null;
let adminCountCache = { value: 0, cachedAt: 0 };
let adminCountInFlight = null;

async function ensureSchemaCached(db) {
  const now = Date.now();
  if (schemaReadyAt && now - schemaReadyAt < SCHEMA_REVALIDATE_MS) return;
  if (!schemaInFlight) {
    schemaInFlight = ensureSchema(db)
      .then(() => {
        schemaReadyAt = Date.now();
      })
      .finally(() => {
        schemaInFlight = null;
      });
  }
  await schemaInFlight;
}

function scheduleSessionCleanup(db, ctx) {
  const now = Date.now();
  if (now - sessionCleanupAt < SESSION_CLEANUP_INTERVAL_MS || sessionCleanupInFlight) return;

  sessionCleanupInFlight = cleanupSessions(db)
    .then(() => {
      sessionCleanupAt = Date.now();
    })
    .catch((error) => {
      console.error("Session cleanup failed", error);
    })
    .finally(() => {
      sessionCleanupInFlight = null;
    });

  ctx.waitUntil(sessionCleanupInFlight);
}

async function getAdminCountCached(db) {
  const now = Date.now();
  if (now - adminCountCache.cachedAt < ADMIN_COUNT_CACHE_MS) {
    return adminCountCache.value;
  }

  if (!adminCountInFlight) {
    adminCountInFlight = getAdminCount(db)
      .then((count) => {
        adminCountCache = { value: count, cachedAt: Date.now() };
        return count;
      })
      .finally(() => {
        adminCountInFlight = null;
      });
  }

  return adminCountInFlight;
}


function needsFreshAdminCount(url, method) {
  if (method === "POST" && (url.pathname === "/api/setup" || url.pathname === "/api/login")) return true;
  if (method === "GET" && (url.pathname === "/" || url.pathname === "/admin/login")) return true;
  return false;
}

export default {
  async fetch(request, env, ctx) {
    try {
      await ensureSchemaCached(env.DB);
      scheduleSessionCleanup(env.DB, ctx);

      const url = new URL(request.url);
      const adminCount = needsFreshAdminCount(url, request.method) ? await getAdminCount(env.DB) : await getAdminCountCached(env.DB);
      const hasAdmin = adminCount > 0;

      const publicResponse = await handlePublicRoute(request, env, url, hasAdmin);
      if (publicResponse) return publicResponse;

      const adminResponse = await handleAdminRoute(request, env, url);
      if (adminResponse !== undefined && adminResponse !== null) return adminResponse;

      if (url.pathname.startsWith("/admin") || url.pathname.startsWith("/api/admin")) {
        return redirect(new URL("/admin/login", url), 302);
      }

      return new Response("Not found", { status: 404 });
    } catch (error) {
      if (error instanceof HttpError) {
        return json({
          error: error.message,
          ...(error.code ? { code: error.code } : {}),
          ...(error.detail ? { detail: error.detail } : {}),
        }, error.status);
      }

      const mapped = mapDatabaseError(error, "Internal error");
      if (mapped.code && mapped.code !== "DB_ERROR") {
        return json({ error: mapped.message, code: mapped.code, detail: mapped.detail }, mapped.status);
      }

      console.error("Unhandled worker error", error);
      return json({ error: "Internal error", code: "INTERNAL_ERROR", detail: String(error?.message || "Unknown error") }, 500);
    }
  },
};
