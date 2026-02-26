import { ensureSchema } from "./db/schema.js";
import { cleanupSessions, getAdminCount } from "./db/admins.js";
import { HttpError } from "./core/errors.js";
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
        return json({ error: error.message }, error.status);
      }

      const message = String(error?.message || "");
      if (message.includes("UNIQUE constraint failed") || message.includes("SQLITE_CONSTRAINT_UNIQUE")) {
        return json({ error: "Email already in use" }, 409);
      }

      console.error("Unhandled worker error", error);
      return json({ error: "Internal error" }, 500);
    }
  },
};
