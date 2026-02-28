import { loginPage } from "../ui/pages/login/index.js";
import { homePage } from "../ui/pages/home/index.js";
import { html, json, redirect } from "../core/response.js";
import { loginAdmin } from "../controllers/publicController.js";
import { getAuthenticatedAdmin } from "../core/auth.js";

export async function handlePublicRoute(request, env, url) {
  if (request.method === "GET" && url.pathname === "/") {
    const admin = await getAuthenticatedAdmin(request, env);
    return html(homePage({ admin }));
  }

  if (request.method === "GET" && url.pathname === "/admin/login") {
    return html(loginPage());
  }

  if (request.method === "POST" && url.pathname === "/api/login") {
    const result = await loginAdmin(request, env);
    const contentType = String(request.headers.get("content-type") || "").toLowerCase();
    const wantsHtml = contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data");
    if (wantsHtml) {
      const response = redirect(new URL(result.redirectTo || "/admin/dashboard", url), 303);
      for (const [header, value] of Object.entries(result.headers || {})) {
        response.headers.set(header, value);
      }
      return response;
    }
    return json({ ok: result.ok, redirectTo: result.redirectTo || "/admin/dashboard" }, result.status || 200, result.headers || {});
  }

  return null;
}
