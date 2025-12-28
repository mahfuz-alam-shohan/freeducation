import { Env, ClassRow, GroupRow, SubjectRow, ChapterRow } from "./types";
import { getSession, createSession, hashPassword, verifyPassword, destroySession, createAuthHeaders } from "./auth";
import { renderPage, escapeHtml } from "./ui";
import { ensureDatabase, resetDatabase } from "./db";

async function requireAuth(request: Request, env: Env) {
  const session = await getSession(request, env);
  if (!session) return null;
  return session;
}

export async function handleAdminRequest(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  if (path === "/admin" || path === "/admin/") {
    const dbStatus = await ensureDatabase(env);
    if (!dbStatus.ok) return renderPage("Error", `DB Error: ${dbStatus.message}`, "dashboard");
    const session = await requireAuth(request, env);
    if (!session) {
      const c = await env.DB.prepare("SELECT count(*) as c FROM admins").first<{c:number}>();
      return (c && c.c === 0) ? renderSetup() : renderLogin();
    }
    return renderDashboard(session, env);
  }

  if (path === "/admin/login" && method === "POST") return handleLoginSubmit(request, env);
  if (path === "/admin/setup" && method === "POST") return handleSetupSubmit(request, env);
  if (path === "/admin/logout" && method === "POST") {
    const cookie = request.headers.get("Cookie");
    if(cookie) {
        const token = cookie.match(/freeducation_admin=([^;]+)/)?.[1];
        if(token) await destroySession(env, token);
    }
    return new Response(null, { status: 303, headers: createAuthHeaders("/admin", null) });
  }

  const session = await requireAuth(request, env);
  if (!session) return new Response(null, { status: 303, headers: { Location: "/admin" } });

  // Class Management
  if (path === "/admin/classes") {
    if (method === "POST") return handleCreateClass(request, env);
    return renderClassesList(session, env);
  }
  if (path === "/admin/classes/edit" && method === "POST") return handleEditClass(request, env);
  if (path === "/admin/classes/delete" && method === "POST") return handleDeleteClass(request, env);
  
  const classMatch = path.match(/^\/admin\/classes\/(\d+)$/);
  if (classMatch) return renderClassDetail(session, env, parseInt(classMatch[1]));

  if (path === "/admin/classes/group" && method === "POST") return handleCreateGroup(request, env);
  if (path === "/admin/classes/group/delete" && method === "POST") return handleDeleteGroup(request, env);
  if (path === "/admin/classes/link" && method === "POST") return handleLinkClasses(request, env);

  // Subject Management
  if (path === "/admin/subjects") {
    if (method === "POST") return handleCreateSubject(request, env);
    return new Response(null, { status: 303, headers: { Location: "/admin/classes" } });
  }
  if (path === "/admin/subjects/edit" && method === "POST") return handleEditSubject(request, env);
  if (path === "/admin/subjects/delete" && method === "POST") return handleDeleteSubject(request, env);
  
  const subjectMatch = path.match(/^\/admin\/subjects\/(\d+)$/);
  if (subjectMatch) return renderSubjectDetail(session, env, parseInt(subjectMatch[1]));

  // Chapter Management
  if (path === "/admin/chapters" && method === "POST") return handleCreateChapter(request, env);
  if (path === "/admin/chapters/edit" && method === "POST") return handleEditChapter(request, env);
  if (path === "/admin/chapters/delete" && method === "POST") return handleDeleteChapter(request, env);

  // Settings
  if (path === "/admin/settings") {
    if (method === "POST" && url.searchParams.get("action") === "reset") {
      await resetDatabase(env);
      return new Response(null, { status: 303, headers: { Location: "/admin/logout" } });
    }
    return renderSettings(session);
  }

  return new Response("Not Found", { status: 404 });
}

// --- Renderers ---

async function renderDashboard(session: any, env: Env) {
  let counts = { classes: 0, subjects: 0 };
  try {
    const res = await env.DB.batch([
      env.DB.prepare("SELECT COUNT(*) as c FROM classes"),
      env.DB.prepare("SELECT COUNT(*) as c FROM subjects")
    ]);
    counts.classes = res[0].results?.[0]?.c as number || 0;
    counts.subjects = res[1].results?.[0]?.c as number || 0;
  } catch(e) {}

  return renderPage("Overview", `
    <div class="header">
       <h1 class="page-title">Overview</h1>
       <div style="font-size:12px; color:var(--primary); font-weight:600;">${session.name}</div>
    </div>
    
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:20px;">
      <div style="background:#fff; padding:15px; border-radius:12px; text-align:center; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
        <div style="font-size:11px; color:#8e8e93; text-transform:uppercase; font-weight:600;">Classes</div>
        <div style="font-size:28px; font-weight:700; color:var(--text-main);">${counts.classes}</div>
      </div>
      <div style="background:#fff; padding:15px; border-radius:12px; text-align:center; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
        <div style="font-size:11px; color:#8e8e93; text-transform:uppercase; font-weight:600;">Subjects</div>
        <div style="font-size:28px; font-weight:700; color:var(--primary);">${counts.subjects}</div>
      </div>
    </div>
    
    <div class="section-title">Quick Actions</div>
    <div class="ios-list">
      <div class="ios-row" onclick="window.location='/admin/classes'">
         <div class="row-icon"><svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"></path><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"></path></svg></div>
         <div class="row-content"><div class="row-title">Manage Classes</div></div>
         <div class="row-action">›</div>
      </div>
      <div class="ios-row" onclick="window.location='/admin/settings'">
         <div class="row-icon"><svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg></div>
         <div class="row-content"><div class="row-title">Settings</div></div>
         <div class="row-action">›</div>
      </div>
    </div>
  `, "dashboard", session);
}

async function renderClassesList(session: any, env: Env) {
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
    <div class="header">
      <h1 class="page-title">Classes</h1>
      <button onclick="openModal('new-class-modal')" class="btn" style="font-size:24px; padding:0;">+</button>
    </div>

    <div class="ios-list">
      ${classes.results?.map(c => `
        <div class="ios-row">
          <div class="row-content" onclick="window.location='/admin/classes/${c.id}'">
            <div class="row-title">${escapeHtml(c.name)}</div>
            <div class="row-subtitle">
              ${c.has_groups ? 'Groups Enabled • ' : ''}
              ${c.link_name ? `Linked: ${escapeHtml(c.link_name)}` : `${c.subject_count} Subjects`}
            </div>
          </div>
          <button class="btn-icon" onclick="openEditModal('edit-class-modal', '/admin/classes/edit', {id: '${c.id}', name: '${escapeHtml(c.name)}', has_groups: ${c.has_groups}})">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
          </button>
        </div>
      `).join('') || '<div class="ios-row"><div class="row-content text-center" style="color:var(--text-muted);">No classes yet</div></div>'}
    </div>

    <!-- Create Modal -->
    <div id="new-class-modal" class="modal-overlay">
      <div class="modal-box">
        <h3 class="page-title" style="font-size:20px; margin-bottom:1rem;">New Class</h3>
        <form action="/admin/classes" method="POST">
          <input name="name" class="input" required placeholder="Class Name (e.g. Class 10)">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:1rem; padding:10px; background:#f2f2f7; border-radius:8px;">
             <input type="checkbox" name="has_groups" value="1" style="width:20px; height:20px;">
             <div style="font-size:15px;">Enable Groups (Science, Arts)</div>
          </div>
          <div style="display:flex; gap:10px;">
             <button type="button" onclick="closeModal('new-class-modal')" class="btn" style="flex:1; color:var(--text-muted);">Cancel</button>
             <button class="btn-filled" style="flex:1;">Create</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit Modal -->
    <div id="edit-class-modal" class="modal-overlay">
      <div class="modal-box">
        <h3 class="page-title" style="font-size:20px; margin-bottom:1rem;">Edit Class</h3>
        <form method="POST">
          <input type="hidden" name="id">
          <input name="name" class="input" required placeholder="Class Name">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:1rem; padding:10px; background:#f2f2f7; border-radius:8px;">
             <input type="checkbox" name="has_groups" value="1" style="width:20px; height:20px;">
             <div style="font-size:15px;">Enable Groups</div>
          </div>
          <button class="btn-filled" style="margin-bottom:1rem;">Save Changes</button>
        </form>
        <form action="/admin/classes/delete" method="POST">
           <input type="hidden" name="id" id="del-cls-id">
           <button class="btn" style="color:var(--danger); width:100%;" onclick="this.form.querySelector('#del-cls-id').value = document.querySelector('#edit-class-modal input[name=id]').value; return confirm('Delete entire class?');">Delete Class</button>
           <button type="button" onclick="closeModal('edit-class-modal')" class="btn" style="width:100%; color:var(--text-muted);">Cancel</button>
        </form>
      </div>
    </div>
  `, "classes", session);
}

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

  const allSubjects = subjects.results as SubjectRow[] || [];
  const groupList = groups.results as GroupRow[] || [];
  
  // Organize Hierarchy
  const commonSubjects = allSubjects.filter(s => !s.group_id);
  const subjectsByGroup = new Map<number, SubjectRow[]>();
  groupList.forEach(g => subjectsByGroup.set(g.id, allSubjects.filter(s => s.group_id === g.id)));

  return renderPage(classData.name, `
    <div class="header">
      <div>
        <h1 class="page-title">${escapeHtml(classData.name)}</h1>
        ${classData.link_name ? `<div style="font-size:13px; color:var(--primary);">🔗 Linked: ${escapeHtml(classData.link_name)}</div>` : ''}
      </div>
      <div style="display:flex; gap:10px;">
        ${classData.has_groups ? `<button onclick="openModal('new-group-modal')" class="btn-sm">+ Group</button>` : ''}
        <button onclick="openModal('link-modal')" class="btn-sm">Link</button>
      </div>
    </div>

    <!-- Hierarchy: Common Subjects -->
    <details open>
      <summary>
         <span>Common Subjects <span style="color:var(--text-muted); font-weight:400; margin-left:5px;">(${commonSubjects.length})</span></span>
         <button class="btn-icon" onclick="event.preventDefault(); openEditModal('new-subject-modal', '/admin/subjects', {class_id: ${classId}, group_id: ''});"><svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"></path></svg></button>
      </summary>
      <div class="group-content">
        ${commonSubjects.map(s => `
          <div class="ios-row nested-row">
            <div class="row-content" onclick="window.location='/admin/subjects/${s.id}'">
              <div class="row-title">${escapeHtml(s.name)}</div>
            </div>
            <button class="btn-icon" onclick="openEditModal('edit-subject-modal', '/admin/subjects/edit', {id: '${s.id}', name: '${escapeHtml(s.name)}', class_id: '${classId}'})">
               <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </button>
          </div>
        `).join('')}
        ${commonSubjects.length === 0 ? '<div style="padding:15px; text-align:center; color:var(--text-muted); font-size:14px;">No common subjects</div>' : ''}
      </div>
    </details>

    <!-- Hierarchy: Groups -->
    ${groupList.map(g => `
      <details>
        <summary>
           <span>${escapeHtml(g.name)} <span style="color:var(--text-muted); font-weight:400; margin-left:5px;">(${(subjectsByGroup.get(g.id) || []).length})</span></span>
           <div style="display:flex; align-items:center;">
             <button class="btn-icon" style="margin-right:5px; color:var(--text-muted);" onclick="event.preventDefault(); openEditModal('delete-group-modal', '/admin/classes/group/delete', {id: '${g.id}'})"><svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
             <button class="btn-icon" onclick="event.preventDefault(); openEditModal('new-subject-modal', '/admin/subjects', {class_id: ${classId}, group_id: ${g.id}});"><svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"></path></svg></button>
           </div>
        </summary>
        <div class="group-content">
          ${(subjectsByGroup.get(g.id) || []).map(s => `
            <div class="ios-row nested-row">
              <div class="row-content" onclick="window.location='/admin/subjects/${s.id}'">
                <div class="row-title">${escapeHtml(s.name)}</div>
              </div>
              <button class="btn-icon" onclick="openEditModal('edit-subject-modal', '/admin/subjects/edit', {id: '${s.id}', name: '${escapeHtml(s.name)}', class_id: '${classId}'})">
                 <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              </button>
            </div>
          `).join('')}
          ${(subjectsByGroup.get(g.id) || []).length === 0 ? '<div style="padding:15px; text-align:center; color:var(--text-muted); font-size:14px;">No subjects in this group</div>' : ''}
        </div>
      </details>
    `).join('')}

    <!-- Modals -->
    <div id="new-subject-modal" class="modal-overlay">
      <div class="modal-box">
        <h3>New Subject</h3>
        <form action="/admin/subjects" method="POST">
           <input type="hidden" name="class_id">
           <input type="hidden" name="group_id">
           <input name="name" class="input" required placeholder="Subject Name">
           <div style="display:flex; gap:10px; margin-top:10px;">
             <button type="button" onclick="closeModal('new-subject-modal')" class="btn" style="flex:1;">Cancel</button>
             <button class="btn-filled" style="flex:1;">Add</button>
           </div>
        </form>
      </div>
    </div>
    
    <div id="edit-subject-modal" class="modal-overlay">
      <div class="modal-box">
        <h3>Edit Subject</h3>
        <form method="POST">
           <input type="hidden" name="id">
           <input type="hidden" name="class_id">
           <input name="name" class="input" required>
           <button class="btn-filled" style="margin:10px 0;">Save</button>
        </form>
        <form action="/admin/subjects/delete" method="POST">
           <input type="hidden" name="id" id="del-sub-id">
           <input type="hidden" name="class_id" value="${classId}">
           <button class="btn" style="color:var(--danger); width:100%;" onclick="this.form.querySelector('#del-sub-id').value = document.querySelector('#edit-subject-modal input[name=id]').value; return confirm('Delete Subject?');">Delete Subject</button>
           <button type="button" onclick="closeModal('edit-subject-modal')" class="btn" style="width:100%; color:var(--text-muted);">Cancel</button>
        </form>
      </div>
    </div>
    
    <div id="new-group-modal" class="modal-overlay">
      <div class="modal-box">
        <h3>New Group</h3>
        <form action="/admin/classes/group" method="POST">
           <input type="hidden" name="class_id" value="${classId}">
           <input name="name" class="input" required placeholder="Group Name (e.g. Commerce)">
           <div style="display:flex; gap:10px; margin-top:10px;">
             <button type="button" onclick="closeModal('new-group-modal')" class="btn" style="flex:1;">Cancel</button>
             <button class="btn-filled" style="flex:1;">Create</button>
           </div>
        </form>
      </div>
    </div>
    
    <div id="delete-group-modal" class="modal-overlay">
      <div class="modal-box">
         <h3>Delete Group?</h3>
         <p style="color:var(--text-muted); font-size:14px; margin-bottom:1rem;">This will delete the group. Subjects in this group might become orphans or be deleted.</p>
         <form action="/admin/classes/group/delete" method="POST">
            <input type="hidden" name="id">
            <input type="hidden" name="class_id" value="${classId}">
            <button class="btn-filled" style="background:var(--danger);">Delete Group</button>
            <button type="button" onclick="closeModal('delete-group-modal')" class="btn" style="width:100%; margin-top:10px;">Cancel</button>
         </form>
      </div>
    </div>
    
    <div id="link-modal" class="modal-overlay">
      <div class="modal-box">
         <h3>Link Class</h3>
         <form action="/admin/classes/link" method="POST">
           <input type="hidden" name="class_id" value="${classId}">
           <input type="number" name="link_class_id" class="input" placeholder="Other Class ID">
           <button class="btn-filled">Link</button>
           <button type="button" onclick="closeModal('link-modal')" class="btn" style="width:100%; margin-top:10px;">Cancel</button>
         </form>
      </div>
    </div>
  `, "classes", session, `<a href="/admin/classes">Classes</a>`);
}

async function renderSubjectDetail(session: any, env: Env, subjectId: number) {
  const subject = await env.DB.prepare("SELECT * FROM subjects WHERE id = ?").bind(subjectId).first<SubjectRow>();
  if (!subject) return new Response("Subject not found", { status: 404 });
  
  const classInfo = await env.DB.prepare("SELECT * FROM classes WHERE id = ?").bind(subject.class_id).first<ClassRow>();
  const chapters = await env.DB.prepare("SELECT * FROM chapters WHERE subject_id = ? ORDER BY sort_order ASC, created_at ASC").bind(subjectId).all<ChapterRow>();

  return renderPage(subject.name, `
    <div class="header">
       <div>
         <div style="font-size:12px; font-weight:700; color:var(--text-muted); text-transform:uppercase;">Subject</div>
         <h1 class="page-title">${escapeHtml(subject.name)}</h1>
       </div>
       <button onclick="openModal('new-chapter-modal')" class="btn" style="font-size:24px; padding:0;">+</button>
    </div>

    <div class="ios-list">
      ${chapters.results?.map((ch, idx) => `
        <div class="ios-row">
           <div style="font-size:13px; font-weight:700; color:var(--text-muted); width:30px; margin-right:10px;">${idx+1}</div>
           <div class="row-content">
             <div class="row-title">${escapeHtml(ch.name)}</div>
           </div>
           <button class="btn-icon" onclick="openEditModal('edit-chapter-modal', '/admin/chapters/edit', {id: '${ch.id}', name: '${escapeHtml(ch.name)}', sort_order: '${ch.sort_order}', subject_id: '${subjectId}'})">
              <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
           </button>
        </div>
      `).join('') || '<div style="padding:20px; text-align:center; color:var(--text-muted);">No chapters yet</div>'}
    </div>

    <!-- Modals -->
    <div id="new-chapter-modal" class="modal-overlay">
      <div class="modal-box">
        <h3>New Chapter</h3>
        <form action="/admin/chapters" method="POST">
           <input type="hidden" name="subject_id" value="${subjectId}">
           <input name="name" class="input" required placeholder="Chapter Name">
           <input name="sort_order" type="number" class="input" placeholder="Order (Optional)">
           <div style="display:flex; gap:10px;">
             <button type="button" onclick="closeModal('new-chapter-modal')" class="btn" style="flex:1;">Cancel</button>
             <button class="btn-filled" style="flex:1;">Add</button>
           </div>
        </form>
      </div>
    </div>
    
    <div id="edit-chapter-modal" class="modal-overlay">
      <div class="modal-box">
        <h3>Edit Chapter</h3>
        <form method="POST">
           <input type="hidden" name="id">
           <input type="hidden" name="subject_id">
           <input name="name" class="input" required>
           <input name="sort_order" type="number" class="input">
           <button class="btn-filled" style="margin:10px 0;">Save</button>
        </form>
        <form action="/admin/chapters/delete" method="POST">
           <input type="hidden" name="id" id="del-ch-id">
           <input type="hidden" name="subject_id" value="${subjectId}">
           <button class="btn" style="color:var(--danger); width:100%;" onclick="this.form.querySelector('#del-ch-id').value = document.querySelector('#edit-chapter-modal input[name=id]').value; return confirm('Delete Chapter?');">Delete Chapter</button>
           <button type="button" onclick="closeModal('edit-chapter-modal')" class="btn" style="width:100%; color:var(--text-muted);">Cancel</button>
        </form>
      </div>
    </div>

  `, "classes", session, `<a href="/admin/classes">Classes</a> / <a href="/admin/classes/${subject.class_id}">${classInfo ? escapeHtml(classInfo.name) : 'Class'}</a>`);
}

function renderLogin(error?: string) {
  return renderPage("Login", `
    <div style="height:80vh; display:flex; align-items:center; justify-content:center;">
      <div class="modal-box" style="transform:none; box-shadow:none; border:1px solid var(--border-light);">
         <h1 class="page-title" style="text-align:center; margin-bottom:20px;">Admin</h1>
         ${error ? `<div style="background:#fee2e2; color:red; padding:10px; border-radius:8px; margin-bottom:10px; font-size:14px; text-align:center;">${error}</div>` : ''}
         <form method="POST" action="/admin/login">
            <input name="email" class="input" required placeholder="Email">
            <input name="password" type="password" class="input" required placeholder="Password">
            <button class="btn-filled" style="margin-top:10px;">Log In</button>
         </form>
      </div>
    </div>
  `, "");
}
function renderSetup(error?: string) { return renderLogin("Setup Needed"); }
function renderSettings(session: any) {
  return renderPage("Settings", `
    <h1 class="page-title" style="margin-bottom:20px;">Settings</h1>
    <div class="section-title">Danger Zone</div>
    <div class="ios-list">
       <form action="/admin/settings?action=reset" method="POST" onsubmit="return confirm('Strictly sure?');">
         <button class="ios-row" style="width:100%; border:none; color:var(--danger); font-weight:600;">
            <div class="row-content">Factory Reset Database</div>
         </button>
       </form>
    </div>
  `, "settings", session);
}

// Logic Handlers
async function handleLoginSubmit(request: Request, env: Env) {
  const fd = await request.formData();
  const admin = await env.DB.prepare("SELECT * FROM admins WHERE email = ?").bind(fd.get("email")).first<{id:number, password_hash:string}>();
  if(!admin || !(await verifyPassword(fd.get("password") as string, admin.password_hash))) return renderLogin("Invalid credentials");
  const token = await createSession(env, admin.id);
  return new Response(null, { status: 303, headers: createAuthHeaders("/admin", token) });
}
async function handleSetupSubmit(request: Request, env: Env) { return new Response("Setup Logic"); }

async function handleCreateClass(request: Request, env: Env) {
    const fd = await request.formData();
    await env.DB.prepare("INSERT INTO classes (name, has_groups, created_at) VALUES (?,?,?)").bind(fd.get("name"), fd.get("has_groups") ? 1 : 0, new Date().toISOString()).run();
    return new Response(null, { status: 303, headers: { Location: "/admin/classes" } });
}
async function handleEditClass(request: Request, env: Env) {
    const fd = await request.formData();
    await env.DB.prepare("UPDATE classes SET name = ?, has_groups = ? WHERE id = ?").bind(fd.get("name"), fd.get("has_groups") ? 1 : 0, fd.get("id")).run();
    return new Response(null, { status: 303, headers: { Location: "/admin/classes" } });
}
async function handleDeleteClass(request: Request, env: Env) {
    const fd = await request.formData();
    await env.DB.prepare("DELETE FROM classes WHERE id = ?").bind(fd.get("id")).run();
    return new Response(null, { status: 303, headers: { Location: "/admin/classes" } });
}

async function handleCreateGroup(request: Request, env: Env) {
    const fd = await request.formData();
    const classId = Number(fd.get("class_id"));
    const linkRow = await env.DB.prepare("SELECT link_id FROM class_link_members WHERE class_id = ?").bind(classId).first<{ link_id: number }>();
    await env.DB.prepare("INSERT INTO class_groups (name, class_id, link_id, created_at) VALUES (?,?,?,?)").bind(fd.get("name"), linkRow?.link_id ? null : classId, linkRow?.link_id || null, new Date().toISOString()).run();
    return new Response(null, { status: 303, headers: { Location: `/admin/classes/${classId}` } });
}
async function handleDeleteGroup(request: Request, env: Env) {
    const fd = await request.formData();
    await env.DB.prepare("DELETE FROM class_groups WHERE id = ?").bind(fd.get("id")).run();
    return new Response(null, { status: 303, headers: { Location: `/admin/classes/${fd.get("class_id")}` } });
}
async function handleLinkClasses(request: Request, env: Env) { return new Response(null, { status: 303, headers: { Location: request.headers.get("Referer") || "/admin/classes" } }); }

async function handleCreateSubject(request: Request, env: Env) {
  const fd = await request.formData();
  const classId = Number(fd.get("class_id"));
  const linkRow = await env.DB.prepare("SELECT link_id FROM class_link_members WHERE class_id = ?").bind(classId).first<{ link_id: number }>();
  await env.DB.prepare("INSERT INTO subjects (name, class_id, group_id, link_id, created_at) VALUES (?,?,?,?,?)")
    .bind(fd.get("name"), linkRow?.link_id ? null : classId, fd.get("group_id") || null, linkRow?.link_id || null, new Date().toISOString()).run();
  return new Response(null, { status: 303, headers: { Location: `/admin/classes/${classId}` } });
}
async function handleEditSubject(request: Request, env: Env) {
  const fd = await request.formData();
  await env.DB.prepare("UPDATE subjects SET name = ? WHERE id = ?").bind(fd.get("name"), fd.get("id")).run();
  return new Response(null, { status: 303, headers: { Location: `/admin/classes/${fd.get("class_id")}` } });
}
async function handleDeleteSubject(request: Request, env: Env) {
  const fd = await request.formData();
  await env.DB.prepare("DELETE FROM subjects WHERE id = ?").bind(fd.get("id")).run();
  return new Response(null, { status: 303, headers: { Location: `/admin/classes/${fd.get("class_id")}` } });
}

async function handleCreateChapter(request: Request, env: Env) {
  const fd = await request.formData();
  await env.DB.prepare("INSERT INTO chapters (subject_id, name, sort_order, created_at) VALUES (?,?,?,?)").bind(fd.get("subject_id"), fd.get("name"), fd.get("sort_order"), new Date().toISOString()).run();
  return new Response(null, { status: 303, headers: { Location: `/admin/subjects/${fd.get("subject_id")}` } });
}
async function handleEditChapter(request: Request, env: Env) {
  const fd = await request.formData();
  await env.DB.prepare("UPDATE chapters SET name = ?, sort_order = ? WHERE id = ?").bind(fd.get("name"), fd.get("sort_order"), fd.get("id")).run();
  return new Response(null, { status: 303, headers: { Location: `/admin/subjects/${fd.get("subject_id")}` } });
}
async function handleDeleteChapter(request: Request, env: Env) {
  const fd = await request.formData();
  await env.DB.prepare("DELETE FROM chapters WHERE id = ?").bind(fd.get("id")).run();
  return new Response(null, { status: 303, headers: { Location: `/admin/subjects/${fd.get("subject_id")}` } });
}


