import { dashboardPage } from "../ui/pages/dashboard/index.js";
import { usersPage } from "../ui/pages/users/index.js";
import { html, json } from "../core/response.js";
import { createAdminUser, deleteAdminUser, listAdminUsers, overview } from "../controllers/adminController.js";
import { destroySession, getAuthenticatedAdmin } from "../core/auth.js";

export async function handleAdminRoute(request, env, url) {
  if (request.method === "POST" && url.pathname === "/api/logout") {
    const result = await destroySession(request, env);
    return json({ ok: true }, 200, result.headers || {});
  }

  const admin = await getAuthenticatedAdmin(request, env);
  if (!admin) return null;

  if (request.method === "GET" && url.pathname === "/admin/dashboard") {
    return html(dashboardPage(admin));
  }

  if (request.method === "GET" && url.pathname === "/admin/users") {
    return html(usersPage(admin));
  }

  if (request.method === "GET" && url.pathname === "/api/admin/overview") {
    return json(await overview(env));
  }

  if (request.method === "GET" && url.pathname === "/api/admin/users") {
    return json({ users: await listAdminUsers(env) });
  }

  if (request.method === "POST" && url.pathname === "/api/admin/users") {
    const result = await createAdminUser(request, env);
    return json(result, 201);
  }

  if (request.method === "DELETE" && url.pathname.startsWith("/api/admin/users/")) {
    const userId = url.pathname.slice("/api/admin/users/".length);
    const result = await deleteAdminUser(userId, env, admin.id);
    return json(result);
  }

  return undefined;
}
