import { createSessionCookie } from "../lib/auth.js";
import { hashPassword, generateSalt } from "../lib/crypto.js";
import { findUserByEmail, hasAdmin, insertAdmin } from "../lib/db.js";
import { roleHomePath } from "../lib/roles.js";
import { htmlResponse, redirect } from "../lib/http.js";
import { loginPage, messagePage, setupPage } from "../views/auth.js";

async function handlePublicRoutes(request, env) {
  const url = new URL(request.url);
  const method = request.method.toUpperCase();

  if (url.pathname === "/") {
    const adminExists = await hasAdmin(env.DB);
    if (!adminExists) {
      return htmlResponse(setupPage());
    }
    return redirect("/login");
  }

  if (url.pathname === "/setup" && method === "POST") {
    const adminExists = await hasAdmin(env.DB);
    if (adminExists) {
      return redirect("/login");
    }
    const form = await request.formData();
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim().toLowerCase();
    const password = String(form.get("password") || "");
    if (!name || !email || !password) {
      return htmlResponse(
        messagePage({
          title: "Missing details",
          message: "Please complete all fields to continue.",
          linkLabel: "Return to setup",
          linkHref: "/",
        }),
        400
      );
    }
    const salt = generateSalt();
    const passwordHash = await hashPassword(password, salt);
    await insertAdmin(env.DB, { email, passwordHash, salt, name });
    return redirect("/login");
  }

  if (url.pathname === "/login" && method === "GET") {
    return htmlResponse(loginPage());
  }

  if (url.pathname === "/login" && method === "POST") {
    const form = await request.formData();
    const email = String(form.get("email") || "").trim().toLowerCase();
    const password = String(form.get("password") || "");
    const user = await findUserByEmail(env.DB, email);

    if (!user) {
      return htmlResponse(
        messagePage({
          title: "Login failed",
          message: "We could not find that account. Try again.",
          linkLabel: "Return to login",
          linkHref: "/login",
        }),
        401
      );
    }

    const expected = await hashPassword(password, user.password_salt);
    if (expected !== user.password_hash) {
      return htmlResponse(
        messagePage({
          title: "Login failed",
          message: "The password does not match. Try again.",
          linkLabel: "Return to login",
          linkHref: "/login",
        }),
        401
      );
    }

    const session = await createSessionCookie(user, env.JWT_SECRET);
    return new Response(null, {
      status: 302,
      headers: {
        Location: roleHomePath(user.role),
        "Set-Cookie": `session=${session}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=28800`,
      },
    });
  }

  if (url.pathname === "/logout" && method === "POST") {
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/login",
        "Set-Cookie": "session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0",
      },
    });
  }

  return null;
}

export { handlePublicRoutes };
