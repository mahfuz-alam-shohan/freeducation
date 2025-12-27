/**
 * Freeducation - Mobile-First Educational Platform
 * Built for Cloudflare Workers + D1
 */

interface Env {
  DB: D1Database;
  BUCKET: R2Bucket;
}

// --- SECURITY & UTILS ---

// simple salt generator
const generateSalt = () => crypto.randomUUID().replace(/-/g, "");

// SHA-256 Password Hashing
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

// Cookie Helpers
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

// --- HTML TEMPLATES ---

const css = `
  :root {
    --bg: #f8fafc; --surface: #ffffff; --primary: #006A4E; /* BD Green-ish */
    --primary-dark: #004d38; --red: #f42a41; /* BD Red */
    --text: #0f172a; --muted: #64748b; --border: #e2e8f0;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: system-ui, -apple-system, sans-serif; background: var(--bg); color: var(--text); line-height: 1.5; padding-bottom: 4rem; }
  
  /* Mobile First Layout */
  .container { width: 100%; max-width: 600px; margin: 0 auto; padding: 1rem; }
  
  /* Components */
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
  
  /* Utilities */
  .text-center { text-align: center; }
  .text-sm { font-size: 0.875rem; }
  .text-muted { color: var(--muted); }
  .mt-4 { margin-top: 1rem; }
  .tag { background: #e0f2fe; color: #0284c7; padding: 0.25rem 0.6rem; border-radius: 99px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
  .tag.video { background: #fce7f3; color: #be185d; }

  /* Admin Footer */
  .admin-bar { position: fixed; bottom: 0; left: 0; right: 0; background: var(--surface); border-top: 1px solid var(--border); padding: 0.75rem; display: flex; justify-content: center; gap: 1rem; font-size: 0.8rem; }
  .admin-bar a { color: var(--muted); text-decoration: none; }
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

// --- ROUTE HANDLERS ---

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    
    // 1. PUBLIC LANDING PAGE (Student View)
    if (url.pathname === "/") {
      // Fetch latest resources (simulated query for now, easy to replace with SELECT * FROM resources)
      const { results } = await env.DB.prepare("SELECT * FROM resources WHERE is_public = 1 ORDER BY created_at DESC LIMIT 5").all();
      
      const resourceHtml = results.length > 0 
        ? results.map((r: any) => `
            <div class="card">
              <span class="tag ${r.type === 'video' ? 'video' : ''}">${r.type}</span>
              <h3 style="margin: 0.5rem 0;">${r.title}</h3>
              <p class="text-muted text-sm">${r.description || 'No description.'}</p>
              <a href="${r.url}" class="btn btn-outline mt-4" target="_blank">View Resource</a>
            </div>
          `).join('')
        : `<div class="text-center text-muted" style="padding: 2rem;">No resources uploaded yet.<br>Admins, please login to add content.</div>`;

      return new Response(layout("Freeducation | Bangladesh", `
        <div class="container">
          <header class="header">
            <a href="/" class="logo"><div class="logo-circle"></div>Freeducation</a>
            <span class="tag">Beta</span>
          </header>
          
          <div class="card" style="background: linear-gradient(135deg, #006A4E 0%, #004d38 100%); color: white; border: none;">
            <h2>Free Education for Everyone</h2>
            <p style="opacity: 0.9; margin-top: 0.5rem;">Access free books, videos, and tools to help you succeed in your studies.</p>
          </div>

          <h3 style="margin: 1.5rem 0 1rem;">Latest Uploads</h3>
          ${resourceHtml}
        </div>

        <div class="admin-bar">
          <a href="/admin/login">Admin Login</a>
          <span>•</span>
          <a href="/admin/setup">Setup</a>
        </div>
      `), { headers: { "Content-Type": "text/html" } });
    }

    // 2. TOP ADMIN SETUP (Bootstrap)
    if (url.pathname === "/admin/setup") {
      // SECURITY CRITICAL: Check if ANY user exists. If yes, block this page.
      const userCount: any = await env.DB.prepare("SELECT count(*) as total FROM users").first();
      
      if (userCount && userCount.total > 0) {
        return new Response(layout("Setup Locked", `
          <div class="container" style="display:grid; place-items:center; height: 80vh;">
            <div class="text-center">
              <h1>Setup Locked</h1>
              <p class="text-muted">The top admin account has already been created.</p>
              <a href="/admin/login" class="btn btn-primary mt-4">Go to Login</a>
            </div>
          </div>
        `), { headers: { "Content-Type": "text/html" } });
      }

      // Handle Form Submission
      if (request.method === "POST") {
        const formData = await request.formData();
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const name = formData.get("name") as string;

        if (!email || !password || !name) return new Response("Missing fields", { status: 400 });

        const salt = generateSalt();
        const hash = await hashPassword(password, salt);
        const id = crypto.randomUUID();

        // Create Super Admin
        await env.DB.prepare(
          "INSERT INTO users (id, email, password_hash, salt, full_name, role) VALUES (?, ?, ?, ?, ?, 'super_admin')"
        ).bind(id, email, hash, salt, name).run();

        return Response.redirect(`${url.origin}/admin/login`, 303);
      }

      // Render Setup Form
      return new Response(layout("Create Top Admin", `
        <div class="container">
          <div class="card">
            <h2 class="text-center">Initialize Platform</h2>
            <p class="text-center text-muted text-sm">Create the first Super Admin account.</p>
            <form method="POST" class="mt-4">
              <div class="input-group">
                <label>Full Name</label>
                <input type="text" name="name" required placeholder="e.g. Mahfuz Alam">
              </div>
              <div class="input-group">
                <label>Email</label>
                <input type="email" name="email" required placeholder="admin@freeducation.bd">
              </div>
              <div class="input-group">
                <label>Password</label>
                <input type="password" name="password" required minlength="8">
              </div>
              <button type="submit" class="btn btn-primary">Create System Owner</button>
            </form>
          </div>
        </div>
      `), { headers: { "Content-Type": "text/html" } });
    }

    // 3. ADMIN LOGIN
    if (url.pathname === "/admin/login") {
      if (request.method === "POST") {
        const formData = await request.formData();
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        const user: any = await env.DB.prepare("SELECT * FROM users WHERE email = ?").bind(email).first();

        if (!user) {
          return new Response("Invalid credentials", { status: 401 });
        }

        const hash = await hashPassword(password, user.salt);
        if (hash !== user.password_hash) {
          return new Response("Invalid credentials", { status: 401 });
        }

        // Create Session
        const sessionId = crypto.randomUUID();
        // Expire in 24 hours
        const expiresAt = Math.floor(Date.now() / 1000) + 86400; 

        await env.DB.prepare("INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)")
          .bind(sessionId, user.id, expiresAt).run();

        // Set Cookie and Redirect
        const headers = new Headers();
        headers.append("Set-Cookie", `session_id=${sessionId}; HttpOnly; Path=/; Max-Age=86400; SameSite=Lax; Secure`);
        headers.append("Location", "/admin/dashboard");
        
        return new Response(null, { status: 303, headers });
      }

      return new Response(layout("Admin Login", `
        <div class="container" style="height: 80vh; display: flex; flex-direction: column; justify-content: center;">
          <div class="text-center mb-4">
            <a href="/" class="logo" style="justify-content: center;"><div class="logo-circle"></div>Freeducation</a>
          </div>
          <div class="card">
            <h2 class="text-center">Admin Access</h2>
            <form method="POST" class="mt-4">
              <div class="input-group">
                <label>Email</label>
                <input type="email" name="email" required>
              </div>
              <div class="input-group">
                <label>Password</label>
                <input type="password" name="password" required>
              </div>
              <button type="submit" class="btn btn-primary">Login</button>
            </form>
            <div class="text-center mt-4">
              <a href="/" class="text-sm text-muted">Back to Student View</a>
            </div>
          </div>
        </div>
      `), { headers: { "Content-Type": "text/html" } });
    }

    // 4. PROTECTED DASHBOARD
    if (url.pathname.startsWith("/admin/dashboard")) {
      const sessionId = getCookie(request, "session_id");
      if (!sessionId) return Response.redirect(`${url.origin}/admin/login`, 303);

      // Validate Session
      const session: any = await env.DB.prepare(`
        SELECT sessions.*, users.full_name, users.role 
        FROM sessions 
        JOIN users ON sessions.user_id = users.id 
        WHERE sessions.id = ? AND sessions.expires_at > ?
      `).bind(sessionId, Math.floor(Date.now() / 1000)).first();

      if (!session) return Response.redirect(`${url.origin}/admin/login`, 303);

      // Handle Resource Upload (Simple Implementation)
      if (request.method === "POST" && url.pathname === "/admin/dashboard/add") {
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

      return new Response(layout("Admin Dashboard", `
        <div class="container">
          <header class="header">
            <strong>Admin Dashboard</strong>
            <span class="tag">${session.role}</span>
          </header>

          <div class="card">
            <h3>Welcome, ${session.full_name}</h3>
            <p class="text-muted text-sm">Manage content for Freeducation students.</p>
          </div>

          <h3>Quick Actions</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-bottom: 1.5rem;">
            <button onclick="document.getElementById('add-form').scrollIntoView()" class="btn btn-primary">Add New Content</button>
            <a href="/" class="btn btn-outline" target="_blank">View Site</a>
          </div>

          <div class="card" id="add-form">
            <h3>Upload Resource</h3>
            <form method="POST" action="/admin/dashboard/add" class="mt-4">
              <div class="input-group">
                <label>Title</label>
                <input type="text" name="title" required placeholder="e.g. HSC Physics Note">
              </div>
              <div class="input-group">
                <label>Type</label>
                <select name="type">
                  <option value="pdf">PDF Document</option>
                  <option value="video">Video Link</option>
                  <option value="tool">Interactive Tool</option>
                </select>
              </div>
              <div class="input-group">
                <label>Category</label>
                <input type="text" name="category" placeholder="e.g. Science">
              </div>
              <div class="input-group">
                <label>URL (Link or R2 Key)</label>
                <input type="url" name="url" required placeholder="https://...">
              </div>
              <div class="input-group">
                <label>Description</label>
                <textarea name="description" rows="3"></textarea>
              </div>
              <button type="submit" class="btn btn-primary">Publish</button>
            </form>
          </div>

          <div class="text-center mt-4 mb-4">
            <a href="/admin/logout" class="text-red-500 text-sm">Log Out</a>
          </div>
        </div>
      `), { headers: { "Content-Type": "text/html" } });
    }

    return new Response("Not Found", { status: 404 });
  }
};
