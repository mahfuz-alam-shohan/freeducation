import { readSessionCookie } from "../lib/auth.js";
import { hashPassword, generateSalt } from "../lib/crypto.js";
import { findUserIdByEmail, insertAdmin, listAdmins } from "../lib/db.js";
import { htmlResponse, redirect } from "../lib/http.js";
import { dashboardPage, userManagementPage } from "../views/admin.js";

async function handleAdminRoutes(request, env) {
  const url = new URL(request.url);
  const method = request.method.toUpperCase();

  if (!url.pathname.startsWith("/admin")) {
    return null;
  }

  const session = await readSessionCookie(request, env.JWT_SECRET);
  if (!session) {
    return redirect("/login");
  }

  if (url.pathname === "/admin") {
    return htmlResponse(dashboardPage(session));
  }

  if (url.pathname === "/admin/users" && method === "GET") {
    const admins = await listAdmins(env.DB);
    return htmlResponse(userManagementPage(session, admins));
  }

  if (url.pathname === "/admin/users" && method === "POST") {
    const form = await request.formData();
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim().toLowerCase();
    const password = String(form.get("password") || "");
    if (!name || !email || !password) {
      return redirect("/admin/users");
    }
    const existing = await findUserIdByEmail(env.DB, email);
    if (!existing) {
      const salt = generateSalt();
      const passwordHash = await hashPassword(password, salt);
      await insertAdmin(env.DB, { email, passwordHash, salt, name });
    }
    return redirect("/admin/users");
  }

  return htmlResponse("Not found", 404);
}

export { handleAdminRoutes };
