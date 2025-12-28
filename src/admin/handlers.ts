import type { Env } from "../types";
import { COOKIE_NAME } from "../constants";
import { createSession, getSession, hashPassword, logoutAdmin, redirectWithSession, verifyPassword } from "./auth";
import { ensureDatabase, ensureSchema, getAdminCount, getAdminList, resetDatabase } from "./db";
import { renderClassManagement, handleAddClass, handleAddGroup, handleLinkClasses } from "./classes";
import { renderAdminShell, renderDashboard, renderLoginForm, renderSetupForm } from "./render";

export async function handleAdmin(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const method = request.method.toUpperCase();
  const dbCheck = ensureDatabase(env);
  if (!dbCheck.ok) {
    return renderAdminShell({
      title: "System Error",
      currentTab: "",
      content: `
        <div class="empty-state">
          <div class="icon-box error-icon">!</div>
          <h3>Database Unavailable</h3>
          <p>${dbCheck.message}</p>
          <div class="card p-4 mt-4 bg-red-50 text-red-700 border-red-200">
             Please attach the D1 database binding in your wrangler.toml.
          </div>
        </div>
      `,
    });
  }

  const schemaCheck = await ensureSchema(env);
  if (!schemaCheck.ok) {
    return renderAdminShell({
      title: "System Error",
      currentTab: "",
      content: `
        <div class="empty-state">
          <div class="icon-box error-icon">!</div>
          <h3>Schema Initialization Failed</h3>
          <p>${schemaCheck.message}</p>
          <p class="text-sm mt-2 text-muted">Check your D1 database permissions and try again.</p>
        </div>
      `,
    });
  }

  if (url.pathname === "/admin/logout") {
    if (method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }
    return logoutAdmin(request, env);
  }

  if (url.pathname === "/admin/setup" && method === "POST") {
    return handleSetup(request, env);
  }

  if (url.pathname === "/admin/login" && method === "POST") {
    return handleLogin(request, env);
  }

  if (url.pathname === "/admin/admins") {
    if (method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }
    const session = await getSession(request, env);
    if (!session) {
      return Response.redirect(new URL("/admin", request.url), 303);
    }
    return handleAddAdmin(request, env, session);
  }

  if (url.pathname === "/admin/classes") {
    if (method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }
    const session = await getSession(request, env);
    if (!session) {
      return Response.redirect(new URL("/admin", request.url), 303);
    }
    return handleAddClass(request, env, session);
  }

  if (url.pathname === "/admin/class-groups") {
    if (method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }
    const session = await getSession(request, env);
    if (!session) {
      return Response.redirect(new URL("/admin", request.url), 303);
    }
    return handleAddGroup(request, env, session);
  }

  if (url.pathname === "/admin/class-links") {
    if (method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }
    const session = await getSession(request, env);
    if (!session) {
      return Response.redirect(new URL("/admin", request.url), 303);
    }
    return handleLinkClasses(request, env, session);
  }

  if (url.pathname === "/admin/reset") {
    if (method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }
    const session = await getSession(request, env);
    if (!session) {
      return Response.redirect(new URL("/admin", request.url), 303);
    }
    return handleFactoryReset(request, env);
  }

  if (url.pathname !== "/admin") {
    return new Response("Not Found", { status: 404 });
  }

  if (method !== "GET") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const session = await getSession(request, env);
  if (session) {
    const tabParam = url.searchParams.get("tab");
    const tab = tabParam === "users" ? "users" : tabParam === "classes" ? "classes" : "settings";
    if (tab === "classes") {
      return renderClassManagement({ admin: session, env });
    }
    const admins = await getAdminList(env);
    return renderDashboard({ admin: session, tab, admins });
  }

  const adminCount = await getAdminCount(env);
  if (adminCount === 0) {
    return renderSetupForm();
  }

  return renderLoginForm();
}

async function handleSetup(request: Request, env: Env): Promise<Response> {
  const adminCount = await getAdminCount(env);
  if (adminCount > 0) {
    return Response.redirect(new URL("/admin", request.url), 303);
  }

  const formData = await request.formData();
  const name = (formData.get("name") || "").toString().trim();
  const email = (formData.get("email") || "").toString().trim().toLowerCase();
  const password = (formData.get("password") || "").toString();

  if (!name || !email || !password) {
    return renderSetupForm("Please fill in all fields.");
  }

  const passwordHash = await hashPassword(password);
  const createdAt = new Date().toISOString();

  const insert = await env.DB.prepare(
    "INSERT INTO admins (name, email, password_hash, created_at) VALUES (?, ?, ?, ?)"
  )
    .bind(name, email, passwordHash, createdAt)
    .run();

  if (!insert.success) {
    return renderSetupForm("Unable to create admin. Please try again.");
  }

  const adminId = insert.meta.last_row_id as number;
  const sessionToken = await createSession(env, adminId);
  return redirectWithSession(request, sessionToken);
}

async function handleLogin(request: Request, env: Env): Promise<Response> {
  const formData = await request.formData();
  const email = (formData.get("email") || "").toString().trim().toLowerCase();
  const password = (formData.get("password") || "").toString();

  if (!email || !password) {
    return renderLoginForm("Please enter your email and password.");
  }

  const admin = await env.DB.prepare(
    "SELECT id, name, email, password_hash FROM admins WHERE email = ?"
  )
    .bind(email)
    .first<{ id: number; name: string; email: string; password_hash: string }>();

  if (!admin) {
    return renderLoginForm("Invalid credentials.");
  }

  const valid = await verifyPassword(password, admin.password_hash);
  if (!valid) {
    return renderLoginForm("Invalid credentials.");
  }

  const sessionToken = await createSession(env, admin.id);
  return redirectWithSession(request, sessionToken);
}

async function handleAddAdmin(
  request: Request,
  env: Env,
  admin: { id: number; name: string; email: string }
): Promise<Response> {
  const formData = await request.formData();
  const name = (formData.get("name") || "").toString().trim();
  const email = (formData.get("email") || "").toString().trim().toLowerCase();
  const password = (formData.get("password") || "").toString();

  if (!name || !email || !password) {
    const admins = await getAdminList(env);
    return renderDashboard({
      admin,
      tab: "users",
      admins,
      error: "Please fill in name, email, and password to add a new admin.",
    });
  }

  const passwordHash = await hashPassword(password);
  const createdAt = new Date().toISOString();
  const insert = await env.DB.prepare(
    "INSERT INTO admins (name, email, password_hash, created_at) VALUES (?, ?, ?, ?)"
  )
    .bind(name, email, passwordHash, createdAt)
    .run();

  if (!insert.success) {
    const admins = await getAdminList(env);
    return renderDashboard({
      admin,
      tab: "users",
      admins,
      error: "Unable to add the admin. Check if the email already exists.",
    });
  }

  return Response.redirect(new URL("/admin?tab=users", request.url), 303);
}

async function handleFactoryReset(request: Request, env: Env): Promise<Response> {
  await resetDatabase(env);

  const headers = new Headers({ Location: new URL("/admin", request.url).toString() });
  headers.append(
    "Set-Cookie",
    `${COOKIE_NAME}=; Path=/admin; HttpOnly; Secure; SameSite=Lax; Max-Age=0`
  );
  return new Response(null, { status: 303, headers });
}
