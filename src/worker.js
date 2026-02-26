import { ensureSchema } from "./db/schema.js";
import { cleanupSessions, getAdminCount } from "./db/admins.js";
import { HttpError, mapDatabaseError } from "./core/errors.js";
import { json, redirect } from "./core/response.js";
import { handlePublicRoute } from "./routes/publicRoutes.js";
import { handleAdminRoute } from "./routes/adminRoutes.js";

export default {
  async fetch(request, env) {
    try {
      await ensureSchema(env.DB);
      await cleanupSessions(env.DB);

      const url = new URL(request.url);
      const hasAdmin = (await getAdminCount(env.DB)) > 0;

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
