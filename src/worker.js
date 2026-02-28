import { SCHEMA_REVALIDATE_MS, SESSION_CLEANUP_INTERVAL_MS } from "./config.js";
import { ensureSchema } from "./db/schema.js";
import { cleanupSessions } from "./db/admins.js";
import { HttpError, mapDatabaseError } from "./core/errors.js";
import { json, redirect } from "./core/response.js";
import { handlePublicRoute } from "./routes/publicRoutes.js";
import { handleAdminRoute } from "./routes/adminRoutes.js";
import { handleTeacherRoute } from "./routes/teacherRoutes.js";
import { handleStudentRoute } from "./routes/studentRoutes.js";

let schemaReadyAt = 0;
let schemaInFlight = null;
let sessionCleanupAt = 0;
let sessionCleanupInFlight = null;

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

export default {
  async fetch(request, env, ctx) {
    try {
      await ensureSchemaCached(env.DB);
      scheduleSessionCleanup(env.DB, ctx);

      const url = new URL(request.url);
      const publicResponse = await handlePublicRoute(request, env, url);
      if (publicResponse) return publicResponse;

      const adminResponse = await handleAdminRoute(request, env, url);
      if (adminResponse !== undefined && adminResponse !== null) return adminResponse;

      const teacherResponse = await handleTeacherRoute(request, env, url);
      if (teacherResponse !== undefined && teacherResponse !== null) return teacherResponse;

      const studentResponse = await handleStudentRoute(request, env, url);
      if (studentResponse !== undefined && studentResponse !== null) return studentResponse;

      if (url.pathname.startsWith("/admin") || url.pathname.startsWith("/teacher") || url.pathname.startsWith("/student") || url.pathname.startsWith("/api/admin") || url.pathname.startsWith("/api/teacher") || url.pathname.startsWith("/api/student")) {
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
