import { Env } from './config';
import { initDB, getResources } from './db';
import { hashPassword, generateSalt } from './utils';
import { renderStudentHome } from './pages/public';
import { renderLogin, renderDashboard, renderUploadForm } from './pages/admin';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // --- 1. STUDENT HOMEPAGE ---
    if (url.pathname === "/") {
      const dbResult: any = await getResources(env);
      return new Response(renderStudentHome(dbResult.results || []), {
        headers: { "Content-Type": "text/html" }
      });
    }

    // --- 2. ADMIN SETUP (Self-Destructs after use) ---
    if (url.pathname === "/admin/setup") {
      // Logic: If ANY user exists, 404 this page.
      try {
        const check: any = await env.DB.prepare("SELECT 1 FROM users LIMIT 1").first();
        if (check) return new Response("Not Found", { status: 404 });
      } catch (e) {
        await initDB(env); // Create tables if checking fails (first run)
      }

      if (request.method === "POST") {
        const fd = await request.formData();
        const salt = generateSalt();
        const hash = await hashPassword(fd.get("password") as string, salt);
        
        await env.DB.prepare("INSERT INTO users (id, email, password_hash, salt, full_name, role) VALUES (?, ?, ?, ?, ?, 'super_admin')")
          .bind(crypto.randomUUID(), fd.get("email"), hash, salt, fd.get("name"))
          .run();
        
        return Response.redirect(`${url.origin}/admin/login`, 303);
      }

      // Simple raw HTML for setup since it's used once
      return new Response(`
        <form method="post" style="max-width:300px; margin: 50px auto; font-family: sans-serif;">
          <h2>Initialize System</h2>
          <input name="name" placeholder="Full Name" style="display:block; width:100%; margin-bottom:10px; padding:8px;">
          <input name="email" placeholder="Email" style="display:block; width:100%; margin-bottom:10px; padding:8px;">
          <input name="password" type="password" placeholder="Password" style="display:block; width:100%; margin-bottom:10px; padding:8px;">
          <button style="padding:10px 20px;">Create Owner</button>
        </form>
      `, { headers: { "Content-Type": "text/html" } });
    }

    // --- 3. LOGIN ---
    if (url.pathname === "/admin/login") {
      if (request.method === "POST") {
        const fd = await request.formData();
        const user: any = await env.DB.prepare("SELECT * FROM users WHERE email = ?").bind(fd.get("email")).first();
        
        if (!user) return new Response(renderLogin("User not found"), { headers: { "Content-Type": "text/html" } });
        
        const hash = await hashPassword(fd.get("password") as string, user.salt);
        if (hash !== user.password_hash) return new Response(renderLogin("Incorrect password"), { headers: { "Content-Type": "text/html" } });

        // Create Session
        const sid = crypto.randomUUID();
        const exp = Math.floor(Date.now() / 1000) + 86400;
        await env.DB.prepare("INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)").bind(sid, user.id, exp).run();

        const headers = new Headers();
        headers.append("Set-Cookie", `auth_token=${sid}; HttpOnly; Path=/; Max-Age=86400; Secure; SameSite=Lax`);
        headers.append("Location", "/admin/dashboard");
        return new Response(null, { status: 303, headers });
      }
      return new Response(renderLogin(), { headers: { "Content-Type": "text/html" } });
    }

    // --- 4. PROTECTED DASHBOARD ---
    if (url.pathname.startsWith("/admin/dashboard")) {
      const cookie = request.headers.get("Cookie");
      const sid = cookie?.split(";").find(c => c.trim().startsWith("auth_token="))?.split("=")[1];
      
      if (!sid) return Response.redirect(`${url.origin}/admin/login`, 303);

      const session: any = await env.DB.prepare(`
        SELECT s.*, u.full_name, u.role FROM sessions s 
        JOIN users u ON s.user_id = u.id 
        WHERE s.id = ? AND s.expires_at > ?
      `).bind(sid, Math.floor(Date.now() / 1000)).first();

      if (!session) return Response.redirect(`${url.origin}/admin/login`, 303);

      // Handle Add
      if (request.method === "POST" && url.pathname.includes("/add")) {
        const fd = await request.formData();
        await env.DB.prepare("INSERT INTO resources (id, title, description, type, category, url, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)")
          .bind(crypto.randomUUID(), fd.get("title"), fd.get("description"), fd.get("type"), fd.get("category"), fd.get("url"), session.user_id)
          .run();
        return new Response(renderDashboard(session, renderUploadForm(true)), { headers: { "Content-Type": "text/html" } });
      }

      return new Response(renderDashboard(session, renderUploadForm()), { headers: { "Content-Type": "text/html" } });
    }

    // --- 5. LOGOUT ---
    if (url.pathname === "/admin/logout") {
      // Ideally delete session from DB here
      return new Response(null, { 
        status: 303, 
        headers: { "Location": "/", "Set-Cookie": "auth_token=; Max-Age=0; Path=/" } 
      });
    }

    return new Response("Not Found", { status: 404 });
  }
};
