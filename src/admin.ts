import { Env, ClassRow, GroupRow } from "./types";
import { getSession, createSession, hashPassword, verifyPassword, destroySession, createAuthHeaders } from "./auth";
import { renderPage, escapeHtml } from "./ui";
import { ensureDatabase, resetDatabase } from "./db";

// --- Middleware / Check ---
async function requireAuth(request: Request, env: Env) {
  const session = await getSession(request, env);
  if (!session) return null;
  return session;
}

// --- Handlers ---

export async function handleAdminRequest(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  // 1. Health & Setup Check (Only on root admin)
  if (path === "/admin" || path === "/admin/") {
    // FORCE CHECK: This ensures the DB always matches the code schema on dashboard load.
    const dbStatus = await ensureDatabase(env); 
    if (!dbStatus.ok) return renderPage("Error", `<div class="alert alert-error">Database Error: ${dbStatus.message}</div>`, "dashboard");

    const session = await requireAuth(request, env);
    if (!session) {
      // Check if any admins exist. If not, show setup.
      const count = await env.DB.prepare("SELECT count(*) as c FROM admins").first<{c:number}>();
      if (count && count.c === 0) return renderSetup();
      return renderLogin();
    }
    
    return renderDashboard(session, env);
  }

  // 2. Auth Routes
  if (path === "/admin/login" && method === "POST") return handleLoginSubmit(request, env);
  if (path === "/admin/setup" && method === "POST") return handleSetupSubmit(request, env);
  if (path === "/admin/logout" && method === "POST") {
    const cookie = request.headers.get("Cookie");
    if(cookie && cookie.includes("freeducation_admin=")) {
        const token = cookie.split("freeducation_admin=")[1].split(";")[0];
        await destroySession(env, token);
    }
    return new Response(null, { status: 303, headers: createAuthHeaders("/admin", null) });
  }

  // 3. Protected Routes
  const session = await requireAuth(request, env);
  if (!session) return new Response(null, { status: 303, headers: { Location: "/admin" } });

  if (path === "/admin/classes") {
    if (method === "POST") return handleCreateClass(request, env);
    return renderClasses(session, env);
  }
  
  if (path === "/admin/classes/group" && method === "POST") return handleCreateGroup(request, env);
  if (path === "/admin/classes/link" && method === "POST") return handleLinkClasses(request, env);
  
  if (path === "/admin/settings") {
      if (method === "POST" && url.searchParams.get("action") === "reset") {
          await resetDatabase(env);
          return new Response(null, { status: 303, headers: { Location: "/admin/logout" } }); // Force logout after reset
      }
      return renderSettings(session);
  }

  return new Response("Not Found", { status: 404 });
}

// --- Page Renders ---

function renderLogin(error?: string) {
  return renderPage("Login", `
    <div style="min-height:80vh; display:flex; flex-direction:column; justify-content:center; align-items:center;">
      <div class="card" style="max-width:400px; width:100%;">
        <div style="text-align:center; margin-bottom:1.5rem;">
          <h2 style="margin:0;">Welcome Back</h2>
          <p style="color:var(--text-muted);">Sign in to your admin console</p>
        </div>
        ${error ? `<div class="alert alert-error">${error}</div>` : ""}
        <form method="POST" action="/admin/login" style="display:flex; flex-direction:column; gap:1rem;">
          <div>
            <label style="font-size:0.85rem; font-weight:600; display:block; margin-bottom:0.5rem;">Email</label>
            <input type="email" name="email" required class="input" placeholder="admin@example.com">
          </div>
          <div>
            <label style="font-size:0.85rem; font-weight:600; display:block; margin-bottom:0.5rem;">Password</label>
            <input type="password" name="password" required class="input" placeholder="••••••••">
          </div>
          <button type="submit" class="btn btn-primary" style="width:100%;">Sign In</button>
        </form>
      </div>
    </div>
  `, "");
}

function renderSetup(error?: string) {
  return renderPage("Setup", `
    <div style="min-height:80vh; display:flex; flex-direction:column; justify-content:center; align-items:center;">
      <div class="card" style="max-width:400px; width:100%;">
        <h2 style="text-align:center;">System Setup</h2>
        <p style="text-align:center; color:var(--text-muted); margin-bottom:1.5rem;">Create the owner account.</p>
        ${error ? `<div class="alert alert-error">${error}</div>` : ""}
        <form method="POST" action="/admin/setup" style="display:flex; flex-direction:column; gap:1rem;">
          <input type="text" name="name" required class="input" placeholder="Full Name">
          <input type="email" name="email" required class="input" placeholder="Email Address">
          <input type="password" name="password" required class="input" placeholder="Secure Password">
          <button type="submit" class="btn btn-primary">Create Owner</button>
        </form>
      </div>
    </div>
  `, "");
}

async function renderDashboard(session: any, env: Env) {
  // We use try-catch here because if tables are missing (despite our best efforts), the query might fail.
  let classCount = 0, adminCount = 0, groupCount = 0;
  
  try {
    const stats = await env.DB.batch([
      env.DB.prepare("SELECT COUNT(*) as c FROM classes"),
      env.DB.prepare("SELECT COUNT(*) as c FROM admins"),
      env.DB.prepare("SELECT COUNT(*) as c FROM class_groups")
    ]);
    classCount = stats[0].results?.[0]?.c || 0;
    adminCount = stats[1].results?.[0]?.c || 0;
    groupCount = stats[2].results?.[0]?.c || 0;
  } catch(e) {
    console.error("Dashboard stats failed", e);
  }

  return renderPage("Dashboard", `
    <div class="grid">
      <div class="card">
        <div style="font-size:0.85rem; color:var(--text-muted); font-weight:600; text-transform:uppercase;">Total Classes</div>
        <div style="font-size:2.5rem; font-weight:800; color:var(--primary-dark);">${classCount}</div>
      </div>
      <div class="card">
        <div style="font-size:0.85rem; color:var(--text-muted); font-weight:600; text-transform:uppercase;">Active Groups</div>
        <div style="font-size:2.5rem; font-weight:800; color:var(--text-main);">${groupCount}</div>
      </div>
      <div class="card">
        <div style="font-size:0.85rem; color:var(--text-muted); font-weight:600; text-transform:uppercase;">Administrators</div>
        <div style="font-size:2.5rem; font-weight:800; color:var(--text-main);">${adminCount}</div>
      </div>
    </div>

    <div class="card" style="margin-top:2rem;">
      <h3>Quick Actions</h3>
      <div style="display:flex; gap:1rem; flex-wrap:wrap;">
        <a href="/admin/classes" class="btn btn-primary">Manage Classes</a>
        <a href="/admin/settings" class="btn btn-ghost">System Settings</a>
      </div>
    </div>
  `, "dashboard", session);
}

async function renderClasses(session: any, env: Env) {
  const classes = await env.DB.prepare("SELECT * FROM classes ORDER BY created_at DESC").all<ClassRow>();
  const groups = await env.DB.prepare("SELECT * FROM class_groups").all<GroupRow>();
  
  // Group Logic
  const groupsByClass = new Map();
  groups.results?.forEach(g => {
    if(!groupsByClass.has(g.class_id)) groupsByClass.set(g.class_id, []);
    groupsByClass.get(g.class_id).push(g);
  });

  const listHtml = classes.results?.length ? classes.results.map(c => `
    <div class="card">
      <div style="display:flex; justify-content:space-between; align-items:start;">
        <div>
          <h3 style="margin:0;">${escapeHtml(c.name)}</h3>
          <div style="margin-top:0.5rem;">
            ${c.has_groups ? '<span class="badge badge-blue">Groups Enabled</span>' : '<span class="badge badge-gray">No Groups</span>'}
          </div>
        </div>
        <!-- Simple form to add group inline -->
        ${c.has_groups ? `
        <a href="#modal-group-${c.id}" class="btn btn-ghost" style="padding:0.4rem;">+ Group</a>
        ` : ''}
      </div>
      
      ${c.has_groups && groupsByClass.get(c.id)?.length ? `
        <div style="margin-top:1rem; display:flex; flex-wrap:wrap; gap:0.5rem;">
          ${groupsByClass.get(c.id).map((g: any) => `<span class="badge badge-gray">${escapeHtml(g.name)}</span>`).join('')}
        </div>
      ` : ''}

      <!-- Add Group Modal -->
      <div id="modal-group-${c.id}" class="modal-target modal-overlay">
        <div class="modal-box">
          <h3>Add Group to ${escapeHtml(c.name)}</h3>
          <form action="/admin/classes/group" method="POST">
            <input type="hidden" name="class_id" value="${c.id}">
            <input name="name" class="input" placeholder="Group Name (e.g. Science)" style="margin-bottom:1rem;" required>
            <div style="display:flex; justify-content:flex-end; gap:0.5rem;">
              <a href="#" class="btn btn-ghost">Cancel</a>
              <button class="btn btn-primary">Add</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `).join('') : '<div style="text-align:center; padding:3rem; color:var(--text-muted);">No classes found. Create one!</div>';

  return renderPage("Classes", `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
      <h2 style="margin:0;">Classes</h2>
      <a href="#new-class-modal" class="btn btn-primary">+ New Class</a>
    </div>
    
    <div class="grid">
      ${listHtml}
    </div>

    <!-- New Class Modal -->
    <div id="new-class-modal" class="modal-target modal-overlay">
      <div class="modal-box">
        <h3>Create New Class</h3>
        <form action="/admin/classes" method="POST">
          <div style="margin-bottom:1rem;">
             <label>Class Name</label>
             <input name="name" class="input" required placeholder="e.g. HSC 2026">
          </div>
          <div style="margin-bottom:1.5rem;">
             <label style="display:flex; align-items:center; gap:0.5rem;">
               <input type="checkbox" name="has_groups" value="1">
               Enable Groups (Science, Arts, etc.)
             </label>
          </div>
          <div style="display:flex; justify-content:flex-end; gap:0.5rem;">
            <a href="#" class="btn btn-ghost">Cancel</a>
            <button class="btn btn-primary">Create</button>
          </div>
        </form>
      </div>
    </div>
  `, "classes", session);
}

function renderSettings(session: any) {
    return renderPage("Settings", `
        <h2>Settings</h2>
        <div class="card">
            <h3 style="color:var(--danger);">Danger Zone</h3>
            <p style="color:var(--text-muted);">Resetting the database will delete all data permanently.</p>
            <form action="/admin/settings?action=reset" method="POST" onsubmit="return confirm('Are you strictly sure? This cannot be undone.');">
                <button class="btn btn-danger">Factory Reset Database</button>
            </form>
        </div>
    `, "settings", session);
}

// --- Action Handlers ---

async function handleLoginSubmit(request: Request, env: Env) {
  const formData = await request.formData();
  const email = formData.get("email")?.toString().trim();
  const password = formData.get("password")?.toString();

  if(!email || !password) return renderLogin("Missing fields");

  const admin = await env.DB.prepare("SELECT * FROM admins WHERE email = ?").bind(email).first<{id:number, password_hash:string}>();
  
  if(!admin || !(await verifyPassword(password, admin.password_hash))) {
      return renderLogin("Invalid credentials");
  }

  const token = await createSession(env, admin.id);
  return new Response(null, { status: 303, headers: createAuthHeaders("/admin", token) });
}

async function handleSetupSubmit(request: Request, env: Env) {
  const formData = await request.formData();
  const name = formData.get("name")?.toString();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if(!name || !email || !password) return renderSetup("All fields required");

  try {
      const hash = await hashPassword(password);
      const res = await env.DB.prepare("INSERT INTO admins (name, email, password_hash, created_at) VALUES (?,?,?,?)")
          .bind(name, email, hash, new Date().toISOString()).run();
      
      // Auto login
      const token = await createSession(env, res.meta.last_row_id as number);
      return new Response(null, { status: 303, headers: createAuthHeaders("/admin", token) });
  } catch(e) {
      return renderSetup("Email likely already taken or database error.");
  }
}

async function handleCreateClass(request: Request, env: Env) {
    const fd = await request.formData();
    await env.DB.prepare("INSERT INTO classes (name, has_groups, created_at) VALUES (?,?,?)")
        .bind(fd.get("name"), fd.get("has_groups") ? 1 : 0, new Date().toISOString()).run();
    return new Response(null, { status: 303, headers: { Location: "/admin/classes" } });
}

async function handleCreateGroup(request: Request, env: Env) {
    const fd = await request.formData();
    await env.DB.prepare("INSERT INTO class_groups (name, class_id, created_at) VALUES (?,?,?)")
        .bind(fd.get("name"), fd.get("class_id"), new Date().toISOString()).run();
    return new Response(null, { status: 303, headers: { Location: "/admin/classes" } });
}

async function handleLinkClasses(request: Request, env: Env) {
    // Placeholder for linking logic if needed
    return new Response(null, { status: 303, headers: { Location: "/admin/classes" } });
}


