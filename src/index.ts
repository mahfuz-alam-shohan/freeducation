const COOKIE_NAME = "freeducation_admin";
const SESSION_DAYS = 7;
const HASH_ITERATIONS = 100_000;

interface Env {
  DB: D1Database;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      return await routeRequest(request, env);
    } catch (error) {
      return renderErrorPage(request, error);
    }
  },
};

async function routeRequest(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const method = request.method.toUpperCase();
  const path = url.pathname;

  if (path.startsWith("/admin")) {
    return handleAdmin(request, env);
  }

  if (path === "/" && method === "GET") {
    return renderPublicHome();
  }

  return new Response("Not Found", { status: 404 });
}

async function handleAdmin(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const method = request.method.toUpperCase();
  const dbCheck = ensureDatabase(env);
  if (!dbCheck.ok) {
    return renderAdminShell({
      title: "Admin unavailable",
      subtitle: "Database configuration required.",
      error: dbCheck.message,
      form: `
        <section class="card">
          <p>Please attach the D1 database binding before continuing.</p>
        </section>
      `,
    });
  }

  const schemaCheck = await ensureSchema(env);
  if (!schemaCheck.ok) {
    return renderAdminShell({
      title: "Admin unavailable",
      subtitle: "Database schema initialization failed.",
      error: schemaCheck.message,
      form: `
        <section class="card">
          <p>We could not initialize the admin tables. Check your D1 database permissions and try again.</p>
        </section>
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
    const tab = url.searchParams.get("tab") === "users" ? "users" : "settings";
    const admins = await getAdminList(env);
    return renderDashboard({ admin: session, tab, admins });
  }

  const adminCount = await getAdminCount(env);
  if (adminCount === 0) {
    return renderSetupForm();
  }

  return renderLoginForm();
}

async function getAdminCount(env: Env): Promise<number> {
  const result = await env.DB.prepare("SELECT COUNT(*) as count FROM admins").first<{ count: number }>();
  return result?.count ?? 0;
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
  ).bind(name, email, passwordHash, createdAt).run();

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
  ).bind(email).first<{ id: number; name: string; email: string; password_hash: string }>();

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
  ).bind(name, email, passwordHash, createdAt).run();

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

async function createSession(env: Env, adminId: number): Promise<string> {
  const token = generateToken();
  const createdAt = new Date();
  const expiresAt = new Date(createdAt.getTime() + SESSION_DAYS * 24 * 60 * 60 * 1000);

  const result = await env.DB.prepare(
    "INSERT INTO admin_sessions (admin_id, token, created_at, expires_at) VALUES (?, ?, ?, ?)"
  ).bind(adminId, token, createdAt.toISOString(), expiresAt.toISOString()).run();

  if (!result.success) {
    throw new Error(result.error ? `Unable to create session: ${result.error}` : "Unable to create session.");
  }

  return token;
}

async function logoutAdmin(request: Request, env: Env): Promise<Response> {
  const token = getCookie(request, COOKIE_NAME);
  if (token) {
    await env.DB.prepare("DELETE FROM admin_sessions WHERE token = ?").bind(token).run();
  }

  const headers = new Headers({ Location: new URL("/admin", request.url).toString() });
  headers.append(
    "Set-Cookie",
    `${COOKIE_NAME}=; Path=/admin; HttpOnly; Secure; SameSite=Lax; Max-Age=0`
  );
  return new Response(null, { status: 303, headers });
}

async function handleFactoryReset(request: Request, env: Env): Promise<Response> {
  const statements = [
    "DROP TABLE IF EXISTS admin_sessions",
    "DROP TABLE IF EXISTS admins",
  ];

  for (const statement of statements) {
    const result = await env.DB.prepare(statement).run();
    if (!result.success) {
      throw new Error(result.error ? `Factory reset failed: ${result.error}` : "Factory reset failed.");
    }
  }

  const schemaResult = await ensureSchema(env);
  if (!schemaResult.ok) {
    throw new Error(schemaResult.message);
  }

  const headers = new Headers({ Location: new URL("/admin", request.url).toString() });
  headers.append(
    "Set-Cookie",
    `${COOKIE_NAME}=; Path=/admin; HttpOnly; Secure; SameSite=Lax; Max-Age=0`
  );
  return new Response(null, { status: 303, headers });
}

async function getSession(request: Request, env: Env): Promise<{ id: number; name: string; email: string } | null> {
  const token = getCookie(request, COOKIE_NAME);
  if (!token) {
    return null;
  }

  const now = new Date().toISOString();
  const session = await env.DB.prepare(
    `SELECT admins.id as id, admins.name as name, admins.email as email
     FROM admin_sessions
     JOIN admins ON admins.id = admin_sessions.admin_id
     WHERE admin_sessions.token = ? AND admin_sessions.expires_at > ?`
  ).bind(token, now).first<{ id: number; name: string; email: string }>();

  return session ?? null;
}

async function getAdminList(env: Env): Promise<{ id: number; name: string; email: string; created_at: string }[]> {
  const result = await env.DB.prepare(
    "SELECT id, name, email, created_at FROM admins ORDER BY created_at DESC"
  ).all<{ id: number; name: string; email: string; created_at: string }>();
  return result.results ?? [];
}

function getCookie(request: Request, name: string): string | null {
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) {
    return null;
  }

  const cookies = cookieHeader.split(";").map((part) => part.trim());
  for (const cookie of cookies) {
    const [key, ...valueParts] = cookie.split("=");
    if (key === name) {
      return decodeURIComponent(valueParts.join("="));
    }
  }

  return null;
}

function redirectWithSession(request: Request, token: string): Response {
  const maxAge = SESSION_DAYS * 24 * 60 * 60;
  const headers = new Headers({ Location: new URL("/admin", request.url).toString() });
  headers.append(
    "Set-Cookie",
    `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/admin; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`
  );
  return new Response(null, { status: 303, headers });
}

async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt,
      iterations: HASH_ITERATIONS,
    },
    key,
    256
  );

  const hash = new Uint8Array(bits);
  return [
    "pbkdf2",
    HASH_ITERATIONS.toString(),
    toBase64(salt),
    toBase64(hash),
  ].join("$");
}

async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [method, iterationsValue, saltValue, hashValue] = storedHash.split("$");
  if (method !== "pbkdf2") {
    return false;
  }

  const iterations = Number(iterationsValue);
  if (!iterations || !saltValue || !hashValue) {
    return false;
  }

  const salt = fromBase64(saltValue);
  const expectedHash = fromBase64(hashValue);

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt,
      iterations,
    },
    key,
    expectedHash.length * 8
  );

  const actualHash = new Uint8Array(bits);
  return timingSafeEqual(actualHash, expectedHash);
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i += 1) {
    result |= a[i] ^ b[i];
  }
  return result === 0;
}

function generateToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return toBase64Url(bytes);
}

function toBase64(data: Uint8Array): string {
  let binary = "";
  data.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function toBase64Url(data: Uint8Array): string {
  return toBase64(data).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64(value: string): Uint8Array {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function renderPublicHome(): Response {
  return createHtmlResponse(
    `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Freeducation</title>
  <style>
    :root {
      color-scheme: light;
      font-family: "Inter", "Segoe UI", system-ui, sans-serif;
      background: #f8fafc;
      color: #0f172a;
    }
    body {
      margin: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px 20px;
    }
    .shell {
      max-width: 640px;
      text-align: center;
      background: white;
      padding: 40px 28px;
      border-radius: 24px;
      box-shadow: 0 24px 60px rgba(15, 23, 42, 0.12);
    }
    .logo {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      font-weight: 700;
      font-size: 28px;
      color: #0f172a;
    }
    .logo svg {
      width: 52px;
      height: 52px;
    }
    p {
      margin: 20px 0 0;
      color: #475569;
      line-height: 1.6;
    }
    @media (min-width: 768px) {
      .shell {
        padding: 56px 60px;
      }
      .logo {
        font-size: 32px;
      }
    }
  </style>
</head>
<body>
  <main class="shell">
    ${renderLogo()}
    <p>
      Freeducation is preparing a new learning experience. Stay tuned as we build the
      student portal, course library, and community spaces.
    </p>
  </main>
</body>
</html>`,
  );
}

function ensureDatabase(env: Env): { ok: true } | { ok: false; message: string } {
  if (!env || !env.DB) {
    return {
      ok: false,
      message: "Missing D1 binding: add a [vars] or [[d1_databases]] section in wrangler.toml.",
    };
  }

  const maybePrepare = (env.DB as D1Database).prepare;
  if (typeof maybePrepare !== "function") {
    return {
      ok: false,
      message: "D1 binding is present but invalid. Please re-bind the database.",
    };
  }

  return { ok: true };
}

async function ensureSchema(env: Env): Promise<{ ok: true } | { ok: false; message: string }> {
  try {
    const statements = [
      `CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at TEXT NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS admin_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        admin_id INTEGER NOT NULL,
        token TEXT NOT NULL UNIQUE,
        created_at TEXT NOT NULL,
        expires_at TEXT NOT NULL,
        FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
      )`,
      "CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(token)",
      "CREATE INDEX IF NOT EXISTS idx_admin_sessions_admin_id ON admin_sessions(admin_id)",
    ];

    for (const statement of statements) {
      const result = await env.DB.prepare(statement).run();
      if (!result.success) {
        throw new Error(result.error ? `Schema update failed: ${result.error}` : "Schema update failed.");
      }
    }
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unable to initialize admin tables.",
    };
  }
}

function renderErrorPage(request: Request, error: unknown): Response {
  const message = error instanceof Error ? error.message : "Unexpected error.";
  const stack = error instanceof Error && error.stack ? error.stack : "";
  const content = `
    <section class="card">
      <p class="label">Request</p>
      <p class="muted">${escapeHtml(request.method)} ${escapeHtml(new URL(request.url).pathname)}</p>
      <p class="label" style="margin-top:16px;">Error</p>
      <p>${escapeHtml(message)}</p>
      ${stack ? `<pre class="stack">${escapeHtml(stack)}</pre>` : ""}
      <p class="muted">If this persists, check the Cloudflare Worker logs for details.</p>
    </section>
  `;

  return renderAdminShell({
    title: "Something went wrong",
    subtitle: "We hit a server error while preparing your page.",
    error: "Worker threw an exception.",
    form: content,
  });
}

function renderSetupForm(error?: string): Response {
  return renderAdminShell({
    title: "Create your first admin",
    subtitle: "Secure the Freeducation control panel.",
    error,
    form: `
      <form method="post" action="/admin/setup" class="card">
        <label>
          Full name
          <input name="name" type="text" placeholder="Admin name" required />
        </label>
        <label>
          Email address
          <input name="email" type="email" placeholder="admin@freeducation.com" required />
        </label>
        <label>
          Password
          <input name="password" type="password" minlength="8" placeholder="Create a strong password" required />
        </label>
        <button type="submit" class="primary">Create admin</button>
      </form>
    `,
  });
}

function renderLoginForm(error?: string): Response {
  return renderAdminShell({
    title: "Admin login",
    subtitle: "Welcome back to Freeducation.",
    error,
    form: `
      <form method="post" action="/admin/login" class="card">
        <label>
          Email address
          <input name="email" type="email" placeholder="admin@freeducation.com" required />
        </label>
        <label>
          Password
          <input name="password" type="password" minlength="8" placeholder="Enter your password" required />
        </label>
        <button type="submit" class="primary">Log in</button>
      </form>
    `,
  });
}

function renderDashboard(options: {
  admin: { id: number; name: string; email: string };
  tab: "settings" | "users";
  admins: { id: number; name: string; email: string; created_at: string }[];
  error?: string;
}): Response {
  const { admin, tab, admins, error } = options;
  return renderAdminShell({
    title: "Admin dashboard",
    subtitle: "Control center for Freeducation.",
    showHeader: false,
    form: `
      <section class="admin-shell">
        <header class="topbar">
          ${renderLogo()}
          <div class="topbar-title">
            <p class="label">Admin workspace</p>
            <h1>Freeducation</h1>
          </div>
          <div class="topbar-actions">
            <div class="user-chip">
              <div>
                <p class="muted">${escapeHtml(admin.name)}</p>
                <p class="muted small">${escapeHtml(admin.email)}</p>
              </div>
            </div>
            <form method="post" action="/admin/logout">
              <button class="ghost" type="submit">Log out</button>
            </form>
          </div>
        </header>
        ${error ? `<div class="error">${escapeHtml(error)}</div>` : ""}
        <div class="admin-layout">
          <aside class="sidebar">
            <nav class="menu">
              <span class="menu-title">Main menu</span>
              <a class="menu-item ${tab === "settings" ? "active" : ""}" href="/admin?tab=settings">Settings</a>
              <a class="menu-item ${tab === "users" ? "active" : ""}" href="/admin?tab=users">User management</a>
            </nav>
            <div class="sidebar-card">
              <p class="label">Session</p>
              <p class="muted">Logged in as ${escapeHtml(admin.name)}</p>
            </div>
          </aside>
          <section class="content">
            <div class="content-header">
              <div>
                <p class="label">Dashboard</p>
                <h2>${tab === "users" ? "User management" : "Settings"}</h2>
              </div>
              ${
                tab === "users"
                  ? `
                    <label class="primary action-button" for="admin-modal-toggle">Add admin</label>
                  `
                  : ""
              }
            </div>
            ${
              tab === "users"
                ? `
                  <section class="card table-card">
                    <div class="table-header">
                      <div>
                        <h4>Admins</h4>
                        <p class="muted">Manage access to the dashboard.</p>
                      </div>
                      <p class="muted">${admins.length} total</p>
                    </div>
                    <div class="table-scroll">
                      <table>
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Created</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${
                            admins.length > 0
                              ? admins
                                  .map(
                                    (entry) => `
                                      <tr>
                                        <td>${escapeHtml(entry.name)}</td>
                                        <td>${escapeHtml(entry.email)}</td>
                                        <td>${escapeHtml(new Date(entry.created_at).toLocaleDateString())}</td>
                                      </tr>
                                    `
                                  )
                                  .join("")
                              : `<tr><td colspan="3" class="muted">No admins yet.</td></tr>`
                          }
                        </tbody>
                      </table>
                    </div>
                  </section>
                  <input id="admin-modal-toggle" class="modal-toggle" type="checkbox" />
                  <div class="modal">
                    <label class="modal-backdrop" for="admin-modal-toggle"></label>
                    <div class="modal-card">
                      <div class="modal-header">
                        <div>
                          <p class="label">Add admin</p>
                          <h3>Create a new admin</h3>
                        </div>
                        <label class="ghost icon-button" for="admin-modal-toggle">Close</label>
                      </div>
                      <form method="post" action="/admin/admins" class="modal-form">
                        <label>
                          Name
                          <input name="name" type="text" placeholder="Admin name" required />
                        </label>
                        <label>
                          Email ID
                          <input name="email" type="email" placeholder="admin@freeducation.com" required />
                        </label>
                        <label>
                          Password
                          <input name="password" type="password" minlength="8" placeholder="Create password" required />
                        </label>
                        <div class="modal-actions">
                          <label class="ghost" for="admin-modal-toggle">Cancel</label>
                          <button class="primary" type="submit">Add admin</button>
                        </div>
                      </form>
                    </div>
                  </div>
                `
                : `
                  <section class="card settings-card">
                    <div>
                      <h4>Factory reset</h4>
                      <p class="muted">Drop all tables and recreate the database.</p>
                    </div>
                    <form method="post" action="/admin/reset">
                      <button class="danger" type="submit">Reset database</button>
                    </form>
                  </section>
                `
            }
          </section>
        </div>
        <nav class="bottom-tab">
          <a class="tab-item ${tab === "settings" ? "active" : ""}" href="/admin?tab=settings">
            <span>Settings</span>
          </a>
          <a class="tab-item ${tab === "users" ? "active" : ""}" href="/admin?tab=users">
            <span>Users</span>
          </a>
        </nav>
      </section>
    `,
  });
}

function renderAdminShell(options: {
  title: string;
  subtitle: string;
  form: string;
  error?: string;
  showHeader?: boolean;
}): Response {
  const { title, subtitle, form, error, showHeader = true } = options;
  return createHtmlResponse(
    `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)} | Freeducation</title>
  <style>
    :root {
      color-scheme: light;
      font-family: "Inter", "Segoe UI", system-ui, sans-serif;
      background: #f1f5f9;
      color: #0f172a;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      background: #f1f5f9;
      display: flex;
      justify-content: center;
      padding: 24px 18px 80px;
    }
    main {
      width: min(100%, 1100px);
    }
    header {
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin-bottom: 28px;
    }
    .logo {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      font-weight: 700;
      font-size: 26px;
      color: #0f172a;
    }
    .logo svg {
      width: 48px;
      height: 48px;
    }
    h1 {
      margin: 0;
      font-size: 28px;
    }
    p {
      margin: 0;
      color: #475569;
    }
    .error {
      background: #fee2e2;
      color: #991b1b;
      padding: 12px 16px;
      border-radius: 12px;
      margin-bottom: 16px;
    }
    .card {
      background: white;
      border-radius: 20px;
      padding: 24px;
      box-shadow: 0 20px 50px rgba(15, 23, 42, 0.12);
      display: grid;
      gap: 16px;
    }
    label {
      display: grid;
      gap: 6px;
      font-size: 14px;
      color: #334155;
    }
    input {
      border: 1px solid #cbd5f5;
      padding: 12px 14px;
      border-radius: 12px;
      font-size: 16px;
      font-family: inherit;
    }
    button {
      border: none;
      border-radius: 999px;
      padding: 12px 18px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
    }
    .primary {
      background: #2563eb;
      color: white;
      box-shadow: 0 12px 24px rgba(37, 99, 235, 0.3);
    }
    .ghost {
      background: #e2e8f0;
      color: #0f172a;
    }
    .icon-button {
      border-radius: 10px;
      padding: 8px 12px;
      font-size: 14px;
    }
    .danger {
      background: #dc2626;
      color: white;
      box-shadow: 0 12px 24px rgba(220, 38, 38, 0.3);
    }
    .dashboard {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: space-between;
      gap: 20px;
    }
    .label {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #64748b;
    }
    .muted {
      color: #64748b;
    }
    .grid {
      margin-top: 24px;
      display: grid;
      gap: 18px;
    }
    .panel {
      background: white;
      border-radius: 18px;
      padding: 20px;
      box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
    }
    .panel h4 {
      margin: 0 0 8px;
    }
    .panel ul {
      margin: 0;
      padding-left: 18px;
      color: #475569;
    }
    pre.stack {
      background: #0f172a;
      color: #e2e8f0;
      padding: 12px;
      border-radius: 12px;
      overflow-x: auto;
      font-size: 12px;
      line-height: 1.5;
      margin-top: 12px;
    }
    .admin-shell {
      display: grid;
      gap: 20px;
    }
    .topbar {
      display: grid;
      gap: 16px;
      align-items: center;
      background: white;
      border-radius: 20px;
      padding: 20px 22px;
      box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
    }
    .topbar-title h1 {
      margin: 6px 0 0;
      font-size: 24px;
    }
    .topbar-actions {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .user-chip {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 14px;
      border-radius: 16px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
    }
    .user-chip .small {
      font-size: 12px;
    }
    .admin-layout {
      display: grid;
      gap: 20px;
    }
    .sidebar {
      display: none;
      gap: 20px;
    }
    .sidebar-card {
      background: white;
      border-radius: 18px;
      padding: 18px;
      box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
      display: grid;
      gap: 8px;
    }
    .menu {
      background: white;
      border-radius: 18px;
      padding: 18px;
      box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
      display: grid;
      gap: 10px;
    }
    .menu-title {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.14em;
      color: #94a3b8;
    }
    .menu-item {
      text-decoration: none;
      padding: 12px 16px;
      border-radius: 14px;
      font-weight: 600;
      color: #0f172a;
      background: #f1f5f9;
      display: inline-flex;
      align-items: center;
      justify-content: space-between;
    }
    .menu-item.active {
      background: #2563eb;
      color: white;
      box-shadow: 0 16px 30px rgba(37, 99, 235, 0.25);
    }
    .content {
      display: grid;
      gap: 20px;
    }
    .content-header {
      display: flex;
      flex-direction: column;
      gap: 16px;
      justify-content: space-between;
      align-items: flex-start;
    }
    .content-header h2 {
      margin: 6px 0 0;
      font-size: 26px;
    }
    .action-button {
      text-align: center;
    }
    .settings-card {
      display: flex;
      flex-direction: column;
      gap: 16px;
      align-items: flex-start;
    }
    .table-card {
      display: grid;
      gap: 16px;
    }
    .table-header {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .table-scroll {
      overflow-x: auto;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      min-width: 420px;
    }
    th,
    td {
      text-align: left;
      padding: 12px 10px;
      border-bottom: 1px solid #e2e8f0;
      font-size: 14px;
    }
    th {
      color: #64748b;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-size: 11px;
    }
    .modal-toggle {
      position: absolute;
      opacity: 0;
      pointer-events: none;
    }
    .modal {
      position: fixed;
      inset: 0;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 20px;
      background: rgba(15, 23, 42, 0.5);
      z-index: 20;
    }
    .modal-card {
      width: min(100%, 420px);
      background: white;
      border-radius: 20px;
      padding: 22px;
      display: grid;
      gap: 16px;
      box-shadow: 0 24px 60px rgba(15, 23, 42, 0.2);
    }
    .modal-backdrop {
      position: absolute;
      inset: 0;
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
    }
    .modal-form {
      display: grid;
      gap: 12px;
    }
    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }
    .modal-toggle:checked + .modal {
      display: flex;
    }
    .bottom-tab {
      position: fixed;
      bottom: 16px;
      left: 16px;
      right: 16px;
      background: white;
      border-radius: 999px;
      box-shadow: 0 20px 40px rgba(15, 23, 42, 0.16);
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 4px;
      padding: 6px;
    }
    .tab-item {
      text-decoration: none;
      text-align: center;
      padding: 10px;
      border-radius: 999px;
      font-weight: 600;
      color: #475569;
      background: transparent;
    }
    .tab-item.active {
      background: #2563eb;
      color: white;
    }
    @media (min-width: 768px) {
      body {
        padding: 40px 40px 80px;
      }
      header {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }
      h1 {
        font-size: 34px;
      }
      .card {
        padding: 32px;
      }
      .dashboard {
        flex-direction: row;
        align-items: center;
      }
      .grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      .topbar {
        grid-template-columns: auto 1fr auto;
        align-items: center;
      }
      .topbar-actions {
        flex-direction: row;
        align-items: center;
      }
      .admin-layout {
        grid-template-columns: 250px minmax(0, 1fr);
      }
      .sidebar {
        display: grid;
      }
      .bottom-tab {
        display: none;
      }
      .content-header {
        flex-direction: row;
        align-items: center;
      }
      .settings-card {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }
    }
  </style>
</head>
<body>
  <main>
    ${
      showHeader
        ? `
    <header>
      ${renderLogo()}
      <div>
        <h1>${escapeHtml(title)}</h1>
        <p>${escapeHtml(subtitle)}</p>
      </div>
    </header>
    `
        : ""
    }
    ${error ? `<div class="error">${escapeHtml(error)}</div>` : ""}
    ${form}
  </main>
</body>
</html>`,
  );
}

function renderLogo(): string {
  return `
    <div class="logo" aria-label="Freeducation">
      <svg viewBox="0 0 96 96" role="img" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="hat" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stop-color="#1d4ed8" />
            <stop offset="100%" stop-color="#2563eb" />
          </linearGradient>
          <linearGradient id="rim" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stop-color="#0f172a" />
            <stop offset="100%" stop-color="#334155" />
          </linearGradient>
        </defs>
        <path d="M12 44 L48 24 L84 44 L48 64 Z" fill="url(#hat)" />
        <path d="M20 48 L48 62 L76 48" stroke="url(#rim)" stroke-width="4" stroke-linecap="round" />
        <circle cx="72" cy="52" r="6" fill="#f97316" />
      </svg>
      <span>Freeducation</span>
    </div>
  `;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function createHtmlResponse(html: string): Response {
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Security-Policy": "default-src 'self'; style-src 'self' 'unsafe-inline'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'",
      "Referrer-Policy": "no-referrer",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    },
  });
}
