import { SCHEMA_REVALIDATE_MS, SESSION_CLEANUP_INTERVAL_MS } from "../config/index.js";
import { ensureSchema } from "../infrastructure/db/schema.js";
import { cleanupExpiredSessions } from "../infrastructure/db/sessionsRepository.js";
import { HttpError, mapDatabaseError } from "../shared/http/errors.js";
import { json, redirect } from "../shared/http/response.js";
import { handlePublicRoute } from "./routes/publicRoutes.js";
import { handleWorkspaceRoute } from "./routes/workspaceRoutes.js";

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

  sessionCleanupInFlight = cleanupExpiredSessions(db)
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

      const workspaceResponse = await handleWorkspaceRoute(request, env, url);
      if (workspaceResponse !== undefined && workspaceResponse !== null) return workspaceResponse;

      if (url.pathname.startsWith("/admin") || url.pathname.startsWith("/teacher") || url.pathname.startsWith("/student") || url.pathname.startsWith("/api/admin") || url.pathname.startsWith("/api/teacher") || url.pathname.startsWith("/api/student")) {
        return redirect(new URL("/login", url), 302);
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
