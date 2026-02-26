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
    const contentType = String(request.headers.get("content-type") || "").toLowerCase();
    const wantsHtml = contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data");
    if (wantsHtml) {
      return redirect(new URL("/admin/login", url), 303);
    }
    return json({ ok: result.ok }, result.status || 201, result.headers || {});
  }

  if (request.method === "POST" && url.pathname === "/api/login") {
    const result = await loginAdmin(request, env, hasAdmin);
    const contentType = String(request.headers.get("content-type") || "").toLowerCase();
    const wantsHtml = contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data");
    if (wantsHtml) {
      const response = redirect(new URL("/admin/dashboard", url), 303);
      for (const [header, value] of Object.entries(result.headers || {})) {
        response.headers.set(header, value);
      }
      return response;
    }
    return json({ ok: result.ok }, result.status || 200, result.headers || {});
  }

  return null;
}
