import { loginPage } from "../ui/pages/login/index.js";
import { setupPage } from "../ui/pages/setup/index.js";
import { html, json, redirect } from "../core/response.js";
import { loginAdmin, setupFirstAdmin } from "../controllers/publicController.js";

export async function handlePublicRoute(request, env, url, hasAdmin) {
  if (request.method === "GET" && url.pathname === "/") {
    return hasAdmin ? redirect(new URL("/admin/login", url), 302) : html(setupPage());
  }

  if (request.method === "GET" && url.pathname === "/admin/login") {
    return hasAdmin ? html(loginPage()) : redirect(new URL("/", url), 302);
  }

  if (request.method === "POST" && url.pathname === "/api/setup") {
    const result = await setupFirstAdmin(request, env, hasAdmin);
    return json({ ok: result.ok }, result.status || 201, result.headers || {});
  }

  if (request.method === "POST" && url.pathname === "/api/login") {
    const result = await loginAdmin(request, env, hasAdmin);
    return json({ ok: result.ok }, result.status || 200, result.headers || {});
  }

  return null;
}
