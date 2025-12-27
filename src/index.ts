/**
 * Freeducation - Mobile-First Educational Platform
 * Self-Healing Database Version
 */

interface Env {
  DB: D1Database;
  BUCKET: R2Bucket;
}

// --- 1. AUTOMATIC DATABASE SETUP (The "No Manual Code" Fix) ---

const SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    full_name TEXT,
    role TEXT DEFAULT 'admin',
    created_at INTEGER DEFAULT (unixepoch())
  );

  CREATE TABLE IF NOT EXISTS resources (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL,
    category TEXT,
    url TEXT,
    is_public BOOLEAN DEFAULT 1,
    created_by TEXT,
    created_at INTEGER DEFAULT (unixepoch())
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    expires_at INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  CREATE INDEX IF NOT EXISTS idx_resources_category ON resources(category);
`;

async function initializeDatabase(env: Env) {
  // Split statements by semicolon and run them in a batch
  // Note: D1 batching supports prepared statements.
  const statements = SCHEMA_SQL.split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0)
    .map(s => env.DB.prepare(s));
  
  await env.DB.batch(statements);
  console.log("Database initialized successfully from code.");
}

// --- 2. SECURITY & UTILS ---

const generateSalt = () => crypto.randomUUID().replace(/-/g, "");

async function hashPassword(password: string, salt: string): Promise<string> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password + salt),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );
  const derivedBits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: enc.encode(salt), iterations: 100000, hash: "SHA-256" },
    keyMaterial,
    256
  );
  return btoa(String.fromCharCode(...new Uint8Array(derivedBits)));
}

function getCookie(request: Request, name: string): string | null {
  const cookieString = request.headers.get("Cookie");
  if (!cookieString) return null;
  const cookies = cookieString.split(";");
  for (let cookie of cookies) {
    const [key, value] = cookie.split("=");
    if (key.trim() === name) return value;
  }
  return null;
}

// --- 3. HTML TEMPLATES ---

const css = `
  :root {
    --bg: #f8fafc; --surface: #ffffff; --primary: #006A4E;
    --primary-dark: #004d38; --red: #f42a41;
    --text: #0f172a; --muted: #64748b; --border: #e2e8f0;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: system-ui, -apple-system, sans-serif; background: var(--bg); color: var(--text); line-height: 1.5; padding-bottom: 5rem; }
  
  .container { width: 100%; max-width: 600px; margin: 0 auto; padding: 1rem; }
  
  .header { display: flex; align-items: center; justify-content: space-between; padding: 1rem 0; margin-bottom: 1rem; }
  .logo { font-weight: 800; font-size: 1.25rem; color: var(--primary); text-decoration: none; display: flex; align-items: center; gap: 0.5rem; }
  .logo-circle { width: 12px; height: 12px; background: var(--red); border-radius: 50%; }
  
  .card { background: var(--surface); padding: 1.25rem; border-radius: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); border: 1px solid var(--border); margin-bottom: 1rem; }
  .btn { display: inline-flex; justify-content: center; width: 100%; padding: 0.75rem; border-radius: 12px; font-weight: 600; text-decoration: none; border: none; cursor: pointer; transition: 0.2s; }
  .btn-primary { background: var(--primary); color: white; }
  .btn-outline { background: transparent; border: 1px solid var(--border); color: var(--text); }
  
  .input-group { margin-bottom: 1rem; }
  .input-group label { display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.5rem; }
  .input-group input, .input-group select, .input-group textarea { width: 100%; padding: 0.75rem; border-radius: 10px; border: 1px solid var(--border); font-size: 1rem; }
  
  .tag { background: #e0f2fe; color: #0284c7; padding: 0.25rem 0.6rem; border-radius: 99px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
  .tag.video { background: #fce7f3; color: #be185d; }
  .tag.pdf { background: #dcfce7; color: #166534; }

  .admin-bar { position: fixed; bottom: 0; left: 0; right: 0; background: var(--surface); border-top: 1px solid var(--border); padding: 0.75rem; display: flex; justify-content: center; gap: 1rem; font-size: 0.8rem; z-index: 100; }
  .admin-bar a { color: var(--muted); text-decoration: none; }
  .text-muted { color: var(--muted); }
  .text-center { text-align: center; }
  .mt-4 { margin-top: 1rem; }
`;

const layout = (title: string, content: string) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <style>${css}</style>
</head>
<body>
  ${content}
</body>
</html>`;

// --- 4. MAIN ROUTER ---

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    try {
      // --- ROUTE: HOMEPAGE (Student View) ---
      if (url.pathname === "/") {
        // Attempt to fetch resources. 
        // If tables don't exist, this will throw an error, which we catch below.
        let resources = [];
        try {
          const result = await env.DB.prepare("SELECT * FROM resources WHERE is_public = 1 ORDER BY created_at DESC LIMIT 10").all();
          resources = result.results || [];
        } catch (e: any) {
          // Detect missing table error specifically
          if (e.message && (e.message.includes("no such table") || e.message.includes("prepare"))) {
            console.log("Tables missing. Initializing database...");
            await initializeDatabase(env);
            return new Response(layout("Initializing...", `
              <div class="container" style="text-align:center; padding-top:20vh;">
                <h1>System Initialized</h1>
                <p>The database structure has been created automatically.</p>
                <p>Please <a href="/">refresh this page</a> to start.</p>
              </div>
            `), { headers: { "Content-Type": "text/html" } });
          }
          throw e; // Re-throw other errors
        }

        const resourceHtml = resources.length > 0 
          ? resources.map((r: any) => `
              <div class="card">
                <div style="display:flex; justify-content:space-between; align-items:start;">
                  <span class="tag ${r.type}">${r.type}</span>
                  <span style="font-size:0.7rem; color:var(--muted);">${new Date(r.created_at * 1000).toLocaleDateString()}</span>
                </div>
                <h3 style="margin: 0.75rem 0 0.5rem;">${r.title}</h3>
                <p class="text-muted" style="font-size: 0.9rem; margin-bottom: 1rem;">${r.description || ''}</p>
                <a href="${r.url}" class="btn btn-outline" target="_blank">Open Resource</a>
              </div>
            `).join('')
          : `<div class="card text-center" style="border-style: dashed; padding: 3rem 1rem;">
               <h3>No Content Yet</h3>
               <p class="text-muted">Admins have not uploaded any resources yet.</p>
             </div>`;

        return new Response(layout("Freeducation | Bangladesh", `
          <div class="container">
            <header class="header">
              <a href="/" class="logo"><div class="logo-circle"></div>Freeducation</a>
            </header>
            
            <div class="card" style="background: linear-gradient(135deg, #006A4E 0%, #004d38 100%); color: white; border: none;">
              <h2>Free Knowledge</h2>
              <p style="opacity: 0.9; margin-top: 0.5rem; font-size: 0.95rem;">
                A simple platform for Bangladeshi students to access free educational tools and books.
              </p>
            </div>

            <h4 style="margin: 1.5rem 0 1rem; color: var(--muted); text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em;">Recent Uploads</h4>
            ${resourceHtml}
          </div>

          <div class="admin-bar">
            <a href="/admin/login">Admin Login</a>
            <span style="color: #cbd5e1">•</span>
            <a href="/admin/setup">Top Admin Setup</a>
          </div>
        `), { headers: { "Content-Type": "text/html" } });
      }

      // --- ROUTE: SETUP (Top Admin) ---
      if (url.pathname === "/admin/setup") {
        // Ensure DB exists before checking users
        try {
          await env.DB.prepare("SELECT 1 FROM users LIMIT 1").first();
        } catch(e) { await initializeDatabase(env); }

        const userCount: any = await env.DB.prepare("SELECT count(*) as total FROM users").first();
        
        if (userCount && userCount.total > 0) {
          return new Response(layout("Setup Locked", `
            <div class="container text-center" style="padding-top: 20vh;">
              <div class="card">
                <h1>Setup Complete</h1>
                <p class="text-muted">The top admin already exists.</p>
                <a href="/admin/login" class="btn btn-primary mt-4">Login Here</a>
              </div>
            </div>
          `), { headers: { "Content-Type": "text/html" } });
        }

        if (request.method === "POST") {
          const formData = await request.formData();
          const email = formData.get("email") as string;
          const password = formData.get("password") as string;
          const name = formData.get("name") as string;

          const salt = generateSalt();
          const hash = await hashPassword(password, salt);
          const id = crypto.randomUUID();

          await env.DB.prepare(
            "INSERT INTO users (id, email, password_hash, salt, full_name, role) VALUES (?, ?, ?, ?, ?, 'super_admin')"
          ).bind(id, email, hash, salt, name).run();

          return Response.redirect(`${url.origin}/admin/login`, 303);
        }

        return new Response(layout("Create Top Admin", `
          <div class="container">
            <div class="card">
              <h2 class="text-center">System Setup</h2>
              <p class="text-center text-muted" style="font-size: 0.9rem;">Create the owner account.</p>
              <form method="POST" class="mt-4">
                <div class="input-group">
                  <label>Full Name</label>
                  <input type="text" name="name" required placeholder="e.g. Mahfuz Alam">
                </div>
                <div class="input-group">
                  <label>Email</label>
                  <input type="email" name="email" required>
                </div>
                <div class="input-group">
                  <label>Password</label>
                  <input type="password" name="password" required minlength="8">
                </div>
                <button type="submit" class="btn btn-primary">Create Account</button>
              </form>
            </div>
          </div>
        `), { headers: { "Content-Type": "text/html" } });
      }

      // --- ROUTE: LOGIN ---
      if (url.pathname === "/admin/login") {
        if (request.method === "POST") {
          const formData = await request.formData();
          const email = formData.get("email") as string;
          const password = formData.get("password") as string;

          // Ensure DB exists
          try { await env.DB.prepare("SELECT 1 FROM users LIMIT 1").first(); } catch(e) { await initializeDatabase(env); }

          const user: any = await env.DB.prepare("SELECT * FROM users WHERE email = ?").bind(email).first();

          if (!user) return new Response(layout("Error", `<div class="container"><div class="card"><h3>Invalid Email</h3><a href="/admin/login" class="btn btn-primary">Try Again</a></div></div>`), { headers: { "Content-Type": "text/html" } });

          const hash = await hashPassword(password, user.salt);
          if (hash !== user.password_hash) return new Response(layout("Error", `<div class="container"><div class="card"><h3>Invalid Password</h3><a href="/admin/login" class="btn btn-primary">Try Again</a></div></div>`), { headers: { "Content-Type": "text/html" } });

          const sessionId = crypto.randomUUID();
          const expiresAt = Math.floor(Date.now() / 1000) + 86400; // 24 hours

          await env.DB.prepare("INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)")
            .bind(sessionId, user.id, expiresAt).run();

          const headers = new Headers();
          headers.append("Set-Cookie", `session_id=${sessionId}; HttpOnly; Path=/; Max-Age=86400; SameSite=Lax; Secure`);
          headers.append("Location", "/admin/dashboard");
          return new Response(null, { status: 303, headers });
        }

        return new Response(layout("Admin Login", `
          <div class="container" style="padding-top: 10vh;">
            <div class="text-center mb-4">
              <a href="/" class="logo" style="justify-content: center;"><div class="logo-circle"></div>Freeducation</a>
            </div>
            <div class="card">
              <h2 class="text-center">Admin Login</h2>
              <form method="POST" class="mt-4">
                <div class="input-group">
                  <label>Email</label>
                  <input type="email" name="email" required>
                </div>
                <div class="input-group">
                  <label>Password</label>
                  <input type="password" name="password" required>
                </div>
                <button type="submit" class="btn btn-primary">Log In</button>
              </form>
            </div>
            <div class="text-center mt-4">
              <a href="/" class="text-muted" style="font-size: 0.9rem;">&larr; Back to Home</a>
            </div>
          </div>
        `), { headers: { "Content-Type": "text/html" } });
      }

      // --- ROUTE: DASHBOARD ---
      if (url.pathname.startsWith("/admin/dashboard")) {
        const sessionId = getCookie(request, "session_id");
        if (!sessionId) return Response.redirect(`${url.origin}/admin/login`, 303);

        const session: any = await env.DB.prepare(`
          SELECT sessions.*, users.full_name, users.role 
          FROM sessions 
          JOIN users ON sessions.user_id = users.id 
          WHERE sessions.id = ? AND sessions.expires_at > ?
        `).bind(sessionId, Math.floor(Date.now() / 1000)).first();

        if (!session) return Response.redirect(`${url.origin}/admin/login`, 303);

        // Add Resource Handler
        if (request.method === "POST" && url.pathname.includes("/add")) {
          const formData = await request.formData();
          await env.DB.prepare(`
            INSERT INTO resources (id, title, description, type, category, url, created_by)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `).bind(
            crypto.randomUUID(),
            formData.get("title"),
            formData.get("description"),
            formData.get("type"),
            formData.get("category"),
            formData.get("url"),
            session.user_id
          ).run();
          return Response.redirect(`${url.origin}/admin/dashboard`, 303);
        }

        // Logout Handler
        if (url.pathname.includes("/logout")) {
          await env.DB.prepare("DELETE FROM sessions WHERE id = ?").bind(sessionId).run();
          return Response.redirect(`${url.origin}/`, 303);
        }

        return new Response(layout("Dashboard", `
          <div class="container">
            <header class="header">
              <strong>Dashboard</strong>
              <div style="font-size: 0.8rem;">
                ${session.full_name} <span class="tag" style="margin-left: 5px;">${session.role}</span>
              </div>
            </header>

            <div class="card">
              <h3>Upload Content</h3>
              <form method="POST" action="/admin/dashboard/add" class="mt-4">
                <div class="input-group">
                  <label>Title</label>
                  <input type="text" name="title" required placeholder="Resource name">
                </div>
                <div class="input-group">
                  <label>Type</label>
                  <select name="type">
                    <option value="pdf">PDF / Ebook</option>
                    <option value="video">Video</option>
                    <option value="tool">Tool / Link</option>
                  </select>
                </div>
                <div class="input-group">
                  <label>Category</label>
                  <input type="text" name="category" placeholder="e.g. Class 10 Math">
                </div>
                <div class="input-group">
                  <label>URL (Google Drive, YouTube, etc)</label>
                  <input type="url" name="url" required placeholder="https://...">
                </div>
                <div class="input-group">
                  <label>Description (Optional)</label>
                  <textarea name="description" rows="2"></textarea>
                </div>
                <button type="submit" class="btn btn-primary">Publish Resource</button>
              </form>
            </div>

            <div class="text-center" style="margin: 2rem 0;">
              <a href="/admin/dashboard/logout" style="color: var(--red); font-size: 0.9rem;">Log Out</a>
            </div>
          </div>
        `), { headers: { "Content-Type": "text/html" } });
      }

      return new Response("Not Found", { status: 404 });

    } catch (e: any) {
      // GLOBAL ERROR CATCHER
      return new Response(`Server Error: ${e.message}\nStack: ${e.stack}`, { status: 500 });
    }
  }
};
