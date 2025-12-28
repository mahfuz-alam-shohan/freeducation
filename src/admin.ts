import { Env, ClassRow, GroupRow, SubjectRow, ChapterRow } from "./types";
import { getSession, createSession, hashPassword, verifyPassword, destroySession, createAuthHeaders } from "./auth";
import { renderPage, escapeHtml } from "./ui";
import { ensureDatabase, resetDatabase } from "./db";

// --- Middleware ---
async function requireAuth(request: Request, env: Env) {
  const session = await getSession(request, env);
  if (!session) return null;
  return session;
}

// --- Main Handler ---
export async function handleAdminRequest(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  // 1. Root & Health
  if (path === "/admin" || path === "/admin/") {
    const dbStatus = await ensureDatabase(env);
    if (!dbStatus.ok) return renderPage("Error", `Database Error: ${dbStatus.message}`, "dashboard");
    const session = await requireAuth(request, env);
    if (!session) {
      const count = await env.DB.prepare("SELECT count(*) as c FROM admins").first<{c:number}>();
      return (count && count.c === 0) ? renderSetup() : renderLogin();
    }
    return renderDashboard(session, env);
  }

  // 2. Auth Actions
  if (path === "/admin/login" && method === "POST") return handleLoginSubmit(request, env);
  if (path === "/admin/setup" && method === "POST") return handleSetupSubmit(request, env);
  if (path === "/admin/logout" && method === "POST") {
    const cookie = request.headers.get("Cookie");
    if(cookie) {
      const token = cookie.match(/freeducation_admin=([^;]+)/)?.[1];
      if (token) await destroySession(env, token);
    }
    return new Response(null, { status: 303, headers: createAuthHeaders("/admin", null) });
  }

  // 3. Authenticated Routes
  const session = await requireAuth(request, env);
  if (!session) return new Response(null, { status: 303, headers: { Location: "/admin" } });

  // --- Classes & Groups ---
  if (path === "/admin/classes") {
    if (method === "POST") return handleCreateClass(request, env);
    return renderClassesList(session, env);
  }
  
  const classMatch = path.match(/^\/admin\/classes\/(\d+)$/);
  if (classMatch) {
    return renderClassDetail(session, env, parseInt(classMatch[1]));
  }
  
  if (path === "/admin/classes/group" && method === "POST") return handleCreateGroup(request, env);
  if (path === "/admin/classes/link" && method === "POST") return handleLinkClasses(request, env);

  // --- Subjects & Chapters ---
  if (path === "/admin/subjects" && method === "POST") return handleCreateSubject(request, env);
  
  const subjectMatch = path.match(/^\/admin\/subjects\/(\d+)$/);
  if (subjectMatch) {
    return renderSubjectDetail(session, env, parseInt(subjectMatch[1]));
  }
  
  if (path === "/admin/chapters" && method === "POST") return handleCreateChapter(request, env);

  // --- Settings ---
  if (path === "/admin/settings") {
    if (method === "POST" && url.searchParams.get("action") === "reset") {
      await resetDatabase(env);
      return new Response(null, { status: 303, headers: { Location: "/admin/logout" } });
    }
    return renderSettings(session);
  }

  return new Response("Not Found", { status: 404 });
}

// --- Views ---

function renderLogin(error?: string) {
  return renderPage("Login", `
    <div style="min-height:80vh; display:flex; align-items:center; justify-content:center; padding:1.5rem;">
      <div class="card" style="max-width:380px; width:100%;">
        <div class="card-body">
          <h2 style="text-align:center; margin-top:0;">Admin Login</h2>
          ${error ? `<div style="color:var(--danger); background:#fee2e2; padding:0.5rem; border-radius:0.5rem; margin-bottom:1rem; font-size:0.9rem;">${error}</div>` : ""}
          <form method="POST" action="/admin/login" style="display:flex; flex-direction:column; gap:1.25rem;">
            <div>
               <label style="display:block;margin-bottom:0.5rem;font-weight:600;">Email</label>
               <input type="email" name="email" required class="input" placeholder="you@example.com">
            </div>
            <div>
               <label style="display:block;margin-bottom:0.5rem;font-weight:600;">Password</label>
               <input type="password" name="password" required class="input" placeholder="••••••••">
            </div>
            <button class="btn btn-primary" style="width:100%;">Sign In</button>
          </form>
        </div>
      </div>
    </div>
  `, "");
}

function renderSetup(error?: string) {
  return renderPage("Setup", `
    <div style="min-height:80vh; display:flex; align-items:center; justify-content:center; padding:1.5rem;">
      <div class="card" style="max-width:380px; width:100%;">
        <div class="card-body">
          <h2 style="text-align:center; margin-top:0;">Setup Owner</h2>
          ${error ? `<div style="color:var(--danger);">${error}</div>` : ""}
          <form method="POST" action="/admin/setup" style="display:flex; flex-direction:column; gap:1rem;">
            <input type="text" name="name" required class="input" placeholder="Full Name">
            <input type="email" name="email" required class="input" placeholder="Email">
            <input type="password" name="password" required class="input" placeholder="Password">
            <button class="btn btn-primary">Create Account</button>
          </form>
        </div>
      </div>
    </div>
  `, "");
}

async function renderDashboard(session: any, env: Env) {
  let counts = { classes: 0, subjects: 0, admins: 0 };
  try {
    const res = await env.DB.batch([
      env.DB.prepare("SELECT COUNT(*) as c FROM classes"),
      env.DB.prepare("SELECT COUNT(*) as c FROM subjects"),
      env.DB.prepare("SELECT COUNT(*) as c FROM admins")
    ]);
    counts.classes = res[0].results?.[0]?.c as number || 0;
    counts.subjects = res[1].results?.[0]?.c as number || 0;
    counts.admins = res[2].results?.[0]?.c as number || 0;
  } catch(e) {}

  return renderPage("Dashboard", `
    <div class="header-bar">
      <h1 class="page-title">Dashboard</h1>
      <p style="color:var(--text-muted); margin:0;">Overview of your content</p>
    </div>
    
    <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap:1rem; margin-bottom:2rem;">
      <div class="card" style="margin:0;"><div class="card-body">
        <div style="color:var(--text-muted); font-size:0.75rem; font-weight:700; text-transform:uppercase;">Classes</div>
        <div style="font-size:2rem; font-weight:800; color:var(--primary);">${counts.classes}</div>
      </div></div>
      <div class="card" style="margin:0;"><div class="card-body">
        <div style="color:var(--text-muted); font-size:0.75rem; font-weight:700; text-transform:uppercase;">Subjects</div>
        <div style="font-size:2rem; font-weight:800;">${counts.subjects}</div>
      </div></div>
    </div>
    
    <div class="card">
      <div class="card-header">
        <h3>Quick Actions</h3>
      </div>
      <div class="card-body">
        <a href="/admin/classes" class="btn btn-primary" style="width:100%;">Manage Classes</a>
      </div>
    </div>
  `, "dashboard", session);
}

// --- List View: Classes (Mobile Card List) ---
async function renderClassesList(session: any, env: Env) {
  // Corrected query using lm.link_id alias
  const classes = await env.DB.prepare(`
    SELECT c.*, 
           (SELECT COUNT(*) FROM subjects WHERE class_id = c.id OR (link_id IS NOT NULL AND link_id = lm.link_id)) as subject_count,
           l.name as link_name
    FROM classes c
    LEFT JOIN class_link_members lm ON lm.class_id = c.id
    LEFT JOIN class_links l ON l.id = lm.link_id
    ORDER BY c.created_at DESC
  `).all<ClassRow & {subject_count: number}>();

  return renderPage("Classes", `
    <div class="header-bar">
      <h1 class="page-title">Classes</h1>
      <div class="action-bar">
         <a href="#new-class-modal" class="btn btn-primary">+ New Class</a>
      </div>
    </div>

    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Class Name</th>
            <th>Type</th>
            <th>Stats</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${classes.results?.map(c => `
            <tr>
              <td data-label="Name">
                <a href="/admin/classes/${c.id}" style="text-decoration:none; color:inherit;">${escapeHtml(c.name)}</a>
              </td>
              <td data-label="Type">
                ${c.has_groups ? '<span class="badge badge-blue">Groups</span>' : '<span class="badge badge-gray">Standard</span>'}
                ${c.link_name ? `<span class="badge badge-purple">Linked</span>` : ''}
              </td>
              <td data-label="Stats">
                ${c.subject_count} Subjects
              </td>
              <td>
                <a href="/admin/classes/${c.id}" class="btn btn-white btn-sm" style="width:100%;">Manage</a>
              </td>
            </tr>
          `).join('') || '<tr><td colspan="4" style="text-align:center; padding:2rem; color:var(--text-muted);">No classes found</td></tr>'}
        </tbody>
      </table>
    </div>

    <!-- Modals -->
    <div id="new-class-modal" class="modal-target modal-overlay">
      <div class="modal-box">
        <h3 style="margin-top:0;">Create New Class</h3>
        <form action="/admin/classes" method="POST">
          <label style="display:block; margin-bottom:0.5rem; font-weight:600;">Class Name</label>
          <input name="name" class="input" required placeholder="e.g. Class 9" style="margin-bottom:1rem;">
          
          <label style="display:flex; align-items:center; gap:0.75rem; margin-bottom:1.5rem; padding:0.75rem; border:1px solid var(--border); border-radius:0.75rem;">
            <input type="checkbox" name="has_groups" value="1" style="transform:scale(1.2);">
            <div>
              <div style="font-weight:600;">Enable Groups</div>
              <div style="font-size:0.8rem; color:var(--text-muted);">For Science, Arts, Commerce</div>
            </div>
          </label>
          
          <div style="display:flex; gap:0.75rem;">
            <a href="#" class="btn btn-white" style="flex:1;">Cancel</a>
            <button class="btn btn-primary" style="flex:1;">Create</button>
          </div>
        </form>
      </div>
    </div>
  `, "classes", session);
}

// --- Detail View: Class (Mobile Hub) ---
async function renderClassDetail(session: any, env: Env, classId: number) {
  const classData = await env.DB.prepare(`
    SELECT c.*, l.name as link_name, l.id as link_id
    FROM classes c
    LEFT JOIN class_link_members lm ON lm.class_id = c.id
    LEFT JOIN class_links l ON l.id = lm.link_id
    WHERE c.id = ?
  `).bind(classId).first<ClassRow>();

  if (!classData) return new Response("Class not found", { status: 404 });

  const linkId = classData.link_id;
  
  const [subjects, groups] = await env.DB.batch([
    env.DB.prepare(`
      SELECT s.*, g.name as group_name
      FROM subjects s
      LEFT JOIN class_groups g ON g.id = s.group_id
      WHERE (s.class_id = ? OR (s.link_id IS NOT NULL AND s.link_id = ?))
      ORDER BY s.group_id ASC, s.name ASC
    `).bind(classId, linkId || -1),
    env.DB.prepare(`
      SELECT * FROM class_groups 
      WHERE (class_id = ? OR (link_id IS NOT NULL AND link_id = ?))
    `).bind(classId, linkId || -1)
  ]);

  const subjectList = subjects.results as SubjectRow[] || [];
  const groupList = groups.results as GroupRow[] || [];

  const breadcrumbs = `
    <a href="/admin/classes">Classes</a> 
    <span class="breadcrumb-sep">/</span> 
    <span>${escapeHtml(classData.name)}</span>
  `;

  return renderPage(classData.name, `
    <div class="header-bar">
      <h1 class="page-title">${escapeHtml(classData.name)}</h1>
      ${classData.link_name ? `<div style="font-size:0.85rem; color:var(--primary); background:#eff6ff; padding:0.5rem; border-radius:0.5rem; display:inline-block; margin-bottom:0.5rem;">🔗 Linked: ${escapeHtml(classData.link_name)}</div>` : ''}
      
      <div class="action-bar">
        <a href="#modal-subject" class="btn btn-primary">+ Subject</a>
        ${classData.has_groups ? `<a href="#modal-group" class="btn btn-white">+ Group</a>` : ''}
        <a href="#modal-link" class="btn btn-ghost">Link</a>
      </div>
    </div>

    <!-- Section: Common Subjects -->
    <h3 style="margin-bottom:0.75rem;">Subjects</h3>
    <div class="table-container">
      <table class="data-table">
        <thead><tr><th>Name</th><th>Details</th><th>Action</th></tr></thead>
        <tbody>
          ${subjectList.map(s => `
            <tr>
              <td data-label="Subject">
                <a href="/admin/subjects/${s.id}" style="text-decoration:none; color:inherit;">${escapeHtml(s.name)}</a>
              </td>
              <td data-label="Details">
                <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
                   ${s.group_name ? `<span class="badge badge-gray">${escapeHtml(s.group_name)}</span>` : '<span class="badge badge-gray">Common</span>'}
                   ${s.link_id ? `<span class="badge badge-purple">Shared</span>` : ''}
                </div>
              </td>
              <td>
                <a href="/admin/subjects/${s.id}" class="btn btn-white btn-sm" style="width:100%;">Chapters</a>
              </td>
            </tr>
          `).join('') || '<tr><td colspan="3" style="text-align:center; padding:2rem; color:var(--text-muted);">No subjects yet.</td></tr>'}
        </tbody>
      </table>
    </div>
    
    <!-- Add Subject Modal -->
    <div id="modal-subject" class="modal-target modal-overlay">
      <div class="modal-box">
        <h3>Add Subject</h3>
        <form action="/admin/subjects" method="POST">
          <input type="hidden" name="class_id" value="${classId}">
          <label style="display:block; margin-bottom:0.5rem;">Subject Name</label>
          <input name="name" class="input" required placeholder="e.g. Physics" style="margin-bottom:1rem;">
          
          ${classData.has_groups ? `
            <label style="display:block; margin-bottom:0.5rem;">Group (Optional)</label>
            <select name="group_id" class="input select" style="margin-bottom:1.5rem;">
              <option value="">Common Subject (All Students)</option>
              ${groupList.map(g => `<option value="${g.id}">${escapeHtml(g.name)}</option>`).join('')}
            </select>
          ` : ''}
          
          <div style="display:flex; gap:0.75rem;">
            <a href="#" class="btn btn-white" style="flex:1;">Cancel</a>
            <button class="btn btn-primary" style="flex:1;">Add</button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Add Group Modal -->
    <div id="modal-group" class="modal-target modal-overlay">
      <div class="modal-box">
        <h3>Add Group</h3>
        <form action="/admin/classes/group" method="POST">
          <input type="hidden" name="class_id" value="${classId}">
          <input name="name" class="input" required placeholder="Group Name (e.g. Science)" style="margin-bottom:1rem;">
          <div style="display:flex; gap:0.75rem;">
            <a href="#" class="btn btn-white" style="flex:1;">Cancel</a>
            <button class="btn btn-primary" style="flex:1;">Add</button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Link Modal -->
    <div id="modal-link" class="modal-target modal-overlay">
      <div class="modal-box">
        <h3>Link Class</h3>
        <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:1rem;">Share content with another class (e.g. Class 9 & 10).</p>
        <form action="/admin/classes/link" method="POST">
          <input type="hidden" name="class_id" value="${classId}">
          <input name="link_class_id" class="input" placeholder="ID of other class" required type="number" style="margin-bottom:1rem;">
          <div style="display:flex; gap:0.75rem;">
            <a href="#" class="btn btn-white" style="flex:1;">Cancel</a>
            <button class="btn btn-primary" style="flex:1;">Link</button>
          </div>
        </form>
      </div>
    </div>

  `, "classes", session, breadcrumbs);
}

// --- Detail View: Subject (Chapter Manager) ---
async function renderSubjectDetail(session: any, env: Env, subjectId: number) {
  const subject = await env.DB.prepare("SELECT * FROM subjects WHERE id = ?").bind(subjectId).first<SubjectRow>();
  if (!subject) return new Response("Subject not found", { status: 404 });
  
  const classInfo = await env.DB.prepare("SELECT * FROM classes WHERE id = ?").bind(subject.class_id).first<ClassRow>();

  const chapters = await env.DB.prepare("SELECT * FROM chapters WHERE subject_id = ? ORDER BY sort_order ASC, created_at ASC").bind(subjectId).all<ChapterRow>();

  const breadcrumbs = `
    <a href="/admin/classes">Classes</a>
    <span class="breadcrumb-sep">/</span>
    <a href="/admin/classes/${subject.class_id}">${classInfo ? escapeHtml(classInfo.name) : 'Class'}</a>
  `;

  return renderPage(subject.name, `
    <div class="header-bar">
      <div style="color:var(--text-muted); font-size:0.9rem; margin-bottom:0.25rem;">Subject</div>
      <h1 class="page-title" style="margin-bottom:1rem;">${escapeHtml(subject.name)}</h1>
      <div class="action-bar">
         <a href="#modal-chapter" class="btn btn-primary">+ New Chapter</a>
      </div>
    </div>

    <div class="table-container">
      <table class="data-table">
        <thead><tr><th>#</th><th>Chapter</th><th>Action</th></tr></thead>
        <tbody>
          ${chapters.results?.map((ch, idx) => `
            <tr>
              <td data-label="Chapter">
                <span style="color:var(--text-muted); font-size:0.9rem; margin-right:0.5rem;">#${idx + 1}</span>
                ${escapeHtml(ch.name)}
              </td>
              <td data-label="Info">
                 <span style="font-size:0.85rem; color:var(--text-muted);">0 Topics</span>
              </td>
              <td>
                <a href="#" class="btn btn-white btn-sm" style="width:100%;">Edit</a>
              </td>
            </tr>
          `).join('') || '<tr><td colspan="3" style="text-align:center; padding:3rem; color:var(--text-muted);">No chapters yet.</td></tr>'}
        </tbody>
      </table>
    </div>

    <!-- New Chapter Modal -->
    <div id="modal-chapter" class="modal-target modal-overlay">
      <div class="modal-box">
        <h3>Add Chapter</h3>
        <form action="/admin/chapters" method="POST">
          <input type="hidden" name="subject_id" value="${subjectId}">
          <label style="display:block; margin-bottom:0.5rem;">Chapter Name</label>
          <input name="name" class="input" required placeholder="e.g. Motion" style="margin-bottom:1rem;">
          <label style="display:block; margin-bottom:0.5rem;">Order</label>
          <input name="sort_order" type="number" class="input" value="0" style="margin-bottom:1.5rem;">
          <div style="display:flex; gap:0.75rem;">
            <a href="#" class="btn btn-white" style="flex:1;">Cancel</a>
            <button class="btn btn-primary" style="flex:1;">Add</button>
          </div>
        </form>
      </div>
    </div>
  `, "classes", session, breadcrumbs);
}

function renderSettings(session: any) {
  return renderPage("Settings", `
      <div class="header-bar"><h1 class="page-title">Settings</h1></div>
      
      <div class="card" style="border-color:#fca5a5; background:#fff5f5;">
          <div class="card-body">
            <h3 style="color:#991b1b; margin-top:0;">Danger Zone</h3>
            <p style="color:#7f1d1d; margin-top:0.5rem; font-size:0.9rem;">Resetting the database will delete ALL content.</p>
            <form action="/admin/settings?action=reset" method="POST" onsubmit="return confirm('Strictly sure?');">
                <button class="btn btn-danger" style="width:100%;">Factory Reset DB</button>
            </form>
          </div>
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
      const token = await createSession(env, res.meta.last_row_id as number);
      return new Response(null, { status: 303, headers: createAuthHeaders("/admin", token) });
  } catch(e) {
      return renderSetup("Database error or email taken.");
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
    const classId = Number(fd.get("class_id"));
    
    // Check if class is linked
    const linkRow = await env.DB.prepare("SELECT link_id FROM class_link_members WHERE class_id = ?").bind(classId).first<{ link_id: number }>();
    const linkId = linkRow?.link_id || null;
    
    await env.DB.prepare("INSERT INTO class_groups (name, class_id, link_id, created_at) VALUES (?,?,?,?)")
        .bind(fd.get("name"), linkId ? null : classId, linkId, new Date().toISOString()).run();
        
    return new Response(null, { status: 303, headers: { Location: `/admin/classes/${classId}` } });
}

async function handleLinkClasses(request: Request, env: Env) {
    const fd = await request.formData();
    const classId = Number(fd.get("class_id"));
    const targetId = Number(fd.get("link_class_id"));

    if (classId && targetId) {
       // Create link
       const linkRes = await env.DB.prepare("INSERT INTO class_links (name, created_at) VALUES (?, ?)").bind("Linked Classes", new Date().toISOString()).run();
       const linkId = linkRes.meta.last_row_id;
       await env.DB.prepare("INSERT INTO class_link_members (link_id, class_id) VALUES (?,?), (?,?)").bind(linkId, classId, linkId, targetId).run();
       
       // Migrate local subjects to link
       await env.DB.prepare("UPDATE subjects SET link_id = ?, class_id = NULL WHERE class_id IN (?, ?)").bind(linkId, classId, targetId).run();
    }
    return new Response(null, { status: 303, headers: { Location: `/admin/classes/${classId}` } });
}

async function handleCreateSubject(request: Request, env: Env) {
  const fd = await request.formData();
  const classId = Number(fd.get("class_id"));
  const groupId = fd.get("group_id") ? Number(fd.get("group_id")) : null;
  const name = fd.get("name")?.toString().trim();

  if (classId && name) {
    const linkRow = await env.DB.prepare("SELECT link_id FROM class_link_members WHERE class_id = ?").bind(classId).first<{ link_id: number }>();
    const linkId = linkRow?.link_id || null;
    
    await env.DB.prepare("INSERT INTO subjects (name, class_id, group_id, link_id, created_at) VALUES (?,?,?,?,?)")
      .bind(name, linkId ? null : classId, groupId, linkId, new Date().toISOString())
      .run();
  }

  return new Response(null, { status: 303, headers: { Location: `/admin/classes/${classId}` } });
}

async function handleCreateChapter(request: Request, env: Env) {
  const fd = await request.formData();
  const subjectId = Number(fd.get("subject_id"));
  const name = fd.get("name")?.toString();
  const order = Number(fd.get("sort_order") || 0);

  if (subjectId && name) {
    await env.DB.prepare("INSERT INTO chapters (subject_id, name, sort_order, created_at) VALUES (?,?,?,?)")
      .bind(subjectId, name, order, new Date().toISOString()).run();
  }
  
  return new Response(null, { status: 303, headers: { Location: `/admin/subjects/${subjectId}` } });
}
