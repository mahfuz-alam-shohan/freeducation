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

  // Root & Health
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

  // Auth
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
       <h1 class="page-title">Admin</h1>
       <div class="page-subtitle">Welcome back, ${session.name}</div>
    </div>
    
    <div class="list-header">Overview</div>
    <div class="inset-list">
      <div class="list-row" onclick="window.location='/admin/classes'">
         <div class="row-icon"><svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"></path><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"></path></svg></div>
         <div class="row-content">
           <div class="row-title">Classes</div>
         </div>
         <div class="row-action" style="color:var(--text-main); font-weight:600;">${counts.classes} ›</div>
      </div>
      <div class="list-row">
         <div class="row-icon"><svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg></div>
         <div class="row-content">
           <div class="row-title">Subjects</div>
         </div>
         <div class="row-action" style="color:var(--text-main); font-weight:600;">${counts.subjects}</div>
      </div>
    </div>
  `, "dashboard", session);
}

async function renderClassesList(session: any, env: Env) {
  const classes = await env.DB.prepare(`
    SELECT c.*, 
           (SELECT COUNT(*) FROM subjects WHERE class_id = c.id OR (link_id IS NOT NULL AND link_id = lm.link_id)) as subject_count,
           lm.link_id
    FROM classes c
    LEFT JOIN class_link_members lm ON lm.class_id = c.id
    ORDER BY c.created_at DESC
  `).all<ClassRow & {subject_count: number, link_id: number}>();

  // Helper to find linked classes
  const linkIds = classes.results?.map(c => c.link_id).filter(Boolean) || [];
  let linkMap = new Map<number, string[]>();
  
  if (linkIds.length > 0) {
      const links = await env.DB.prepare(`
        SELECT lm.link_id, c.name 
        FROM class_link_members lm 
        JOIN classes c ON c.id = lm.class_id 
        WHERE lm.link_id IN (${linkIds.join(',')})
      `).all<{link_id: number, name: string}>();
      
      links.results?.forEach(l => {
          if (!linkMap.has(l.link_id)) linkMap.set(l.link_id, []);
          linkMap.get(l.link_id)?.push(l.name);
      });
  }

  return renderPage("Classes", `
    <div class="header" style="display:flex; justify-content:space-between; align-items:flex-end;">
      <div>
        <h1 class="page-title">Classes</h1>
        <div class="page-subtitle">Manage curriculum</div>
      </div>
      <button onclick="toggleModal('new-class-modal', true)" class="btn-text">Add</button>
    </div>

    <div class="inset-list">
      ${classes.results?.map(c => {
        const syncedWith = c.link_id ? linkMap.get(c.link_id)?.filter(n => n !== c.name) : [];
        const syncText = syncedWith && syncedWith.length > 0 ? `Synced: ${syncedWith.join(', ')}` : '';
        
        return `
        <div class="list-row">
          <div class="row-content" onclick="window.location='/admin/classes/${c.id}'" style="cursor:pointer;">
            <div class="row-title">${escapeHtml(c.name)}</div>
            <div class="row-subtitle">
              ${syncText ? `<span style="color:var(--primary); font-weight:600;">${escapeHtml(syncText)}</span>` : `${c.subject_count} Subjects`}
              ${c.has_groups ? ' • Groups' : ''}
            </div>
          </div>
          <button class="btn-icon-circle" style="background:none;" onclick="openEdit('edit-class-modal', '/admin/classes/edit', {id: '${c.id}', name: '${escapeHtml(c.name)}', has_groups: ${c.has_groups}})">
            <svg width="20" height="20" fill="none" stroke="#C7C7CC" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
          </button>
          <div class="row-action" onclick="window.location='/admin/classes/${c.id}'">
            <svg width="20" height="20" fill="none" stroke="#C7C7CC" stroke-width="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"></path></svg>
          </div>
        </div>
      `}).join('') || '<div style="padding:16px; text-align:center; color:var(--text-secondary);">No classes found. Tap Add to create one.</div>'}
    </div>

    <!-- Create Class Modal -->
    <div id="new-class-modal" class="modal-overlay">
      <div class="modal-card">
        <div class="modal-header">New Class</div>
        <form action="/admin/classes" method="POST">
          <div class="modal-body">
             <div class="input-group">
                <input name="name" class="input" required placeholder="Class Name (e.g. Class 9)">
             </div>
             <div class="input-group" style="display:flex; align-items:center; justify-content:space-between;">
                <span style="font-size:17px;">Enable Groups</span>
                <input type="checkbox" name="has_groups" value="1" style="width:20px; height:20px;">
             </div>
          </div>
          <div class="modal-actions">
             <div class="modal-btn" onclick="toggleModal('new-class-modal', false)">Cancel</div>
             <button class="modal-btn">Create</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit Class Modal -->
    <div id="edit-class-modal" class="modal-overlay">
      <div class="modal-card">
        <div class="modal-header">Edit Class</div>
        <form method="POST">
          <div class="modal-body">
             <input type="hidden" name="id">
             <div class="input-group">
                <input name="name" class="input" required placeholder="Class Name">
             </div>
             <div class="input-group" style="display:flex; align-items:center; justify-content:space-between;">
                <span style="font-size:17px;">Enable Groups</span>
                <input type="checkbox" name="has_groups" value="1" style="width:20px; height:20px;">
             </div>
          </div>
          <div class="modal-actions">
             <div class="modal-btn" onclick="toggleModal('edit-class-modal', false)">Cancel</div>
             <button class="modal-btn">Save</button>
          </div>
        </form>
        <form action="/admin/classes/delete" method="POST" style="border-top:0.5px solid var(--separator);">
           <input type="hidden" name="id" id="del-cls-id">
           <div class="modal-actions">
             <button class="modal-btn danger" onclick="this.form.querySelector('#del-cls-id').value = document.querySelector('#edit-class-modal input[name=id]').value; return confirm('Delete entire class?');">Delete Class</button>
           </div>
        </form>
      </div>
    </div>
  `, "classes", session);
}

async function renderClassDetail(session: any, env: Env, classId: number) {
  const classData = await env.DB.prepare(`
    SELECT c.*, lm.link_id
    FROM classes c
    LEFT JOIN class_link_members lm ON lm.class_id = c.id
    WHERE c.id = ?
  `).bind(classId).first<ClassRow & {link_id: number}>();

  if (!classData) return new Response("Class not found", { status: 404 });

  let linkedNames: string[] = [];
  if (classData.link_id) {
     const res = await env.DB.prepare("SELECT c.name FROM class_link_members lm JOIN classes c ON c.id = lm.class_id WHERE lm.link_id = ? AND c.id != ?").bind(classData.link_id, classId).all<{name:string}>();
     linkedNames = res.results?.map(r => r.name) || [];
  }
  
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
  
  const commonSubjects = allSubjects.filter(s => !s.group_id);
  const subjectsByGroup = new Map<number, SubjectRow[]>();
  groupList.forEach(g => subjectsByGroup.set(g.id, allSubjects.filter(s => s.group_id === g.id)));

  return renderPage(classData.name, `
    <div class="header">
      <h1 class="page-title">${escapeHtml(classData.name)}</h1>
      <div class="page-subtitle">
         ${linkedNames.length > 0 
           ? `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg> 
              <span style="color:var(--primary); font-weight:600; margin-left:4px;">Synced: ${escapeHtml(linkedNames.join(', '))}</span>` 
           : 'Local Mode'}
      </div>
    </div>

    <div style="padding:0 1rem; margin-bottom:1rem; display:flex; gap:10px;">
       ${classData.has_groups ? `<button onclick="toggleModal('new-group-modal', true)" class="btn-text" style="font-size:15px; font-weight:600;">+ Group</button>` : ''}
       <button onclick="toggleModal('link-modal', true)" class="btn-text" style="font-size:15px; font-weight:600;">Sync Class</button>
    </div>

    <!-- COMMON SUBJECTS -->
    <div class="list-header" style="display:flex; justify-content:space-between;">
       <span>Common Subjects</span>
       <button onclick="openEdit('new-subject-modal', '/admin/subjects', {class_id: ${classId}, group_id: ''})" style="color:var(--primary); font-weight:600;">+</button>
    </div>
    <div class="inset-list">
      ${commonSubjects.map(s => `
        <div class="list-row">
           <div class="row-content" onclick="window.location='/admin/subjects/${s.id}'" style="cursor:pointer;">
             <div class="row-title">${escapeHtml(s.name)}</div>
           </div>
           <button class="btn-icon-circle" style="background:none;" onclick="openEdit('edit-subject-modal', '/admin/subjects/edit', {id: '${s.id}', name: '${escapeHtml(s.name)}', class_id: '${classId}'})">
             <svg width="20" height="20" fill="none" stroke="#C7C7CC" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
           </button>
           <div class="row-action" onclick="window.location='/admin/subjects/${s.id}'"><svg width="20" height="20" fill="none" stroke="#C7C7CC" stroke-width="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"></path></svg></div>
        </div>
      `).join('') || '<div style="padding:14px 16px; color:var(--text-secondary); font-size:15px;">No common subjects</div>'}
    </div>

    <!-- GROUPS -->
    ${groupList.map(g => `
      <div class="list-header" style="display:flex; justify-content:space-between; align-items:center;">
         <span>${escapeHtml(g.name)}</span>
         <div style="display:flex; gap:12px;">
            <button onclick="openEdit('delete-group-modal', '/admin/classes/group/delete', {id: '${g.id}'})" style="color:var(--text-secondary);">Trash</button>
            <button onclick="openEdit('new-subject-modal', '/admin/subjects', {class_id: ${classId}, group_id: ${g.id}})" style="color:var(--primary); font-weight:600;">+</button>
         </div>
      </div>
      <div class="inset-list">
         ${(subjectsByGroup.get(g.id) || []).map(s => `
           <div class="list-row">
             <div class="row-content" onclick="window.location='/admin/subjects/${s.id}'" style="cursor:pointer;">
               <div class="row-title">${escapeHtml(s.name)}</div>
             </div>
             <button class="btn-icon-circle" style="background:none;" onclick="openEdit('edit-subject-modal', '/admin/subjects/edit', {id: '${s.id}', name: '${escapeHtml(s.name)}', class_id: '${classId}'})">
               <svg width="20" height="20" fill="none" stroke="#C7C7CC" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
             </button>
             <div class="row-action" onclick="window.location='/admin/subjects/${s.id}'"><svg width="20" height="20" fill="none" stroke="#C7C7CC" stroke-width="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"></path></svg></div>
           </div>
         `).join('') || '<div style="padding:14px 16px; color:var(--text-secondary); font-size:15px;">No subjects in this group</div>'}
      </div>
    `).join('')}

    <!-- Add Subject Modal -->
    <div id="new-subject-modal" class="modal-overlay">
      <div class="modal-card">
        <div class="modal-header">New Subject</div>
        <form action="/admin/subjects" method="POST">
           <input type="hidden" name="class_id">
           <input type="hidden" name="group_id">
           <div class="modal-body">
             <div class="input-group"><input name="name" class="input" required placeholder="Subject Name"></div>
             <p style="font-size:13px; color:var(--text-secondary); text-align:center;">This subject will be auto-synced to all linked classes.</p>
           </div>
           <div class="modal-actions">
             <div class="modal-btn" onclick="toggleModal('new-subject-modal', false)">Cancel</div>
             <button class="modal-btn">Add</button>
           </div>
        </form>
      </div>
    </div>
    
    <!-- Edit Subject Modal -->
    <div id="edit-subject-modal" class="modal-overlay">
      <div class="modal-card">
        <div class="modal-header">Edit Subject</div>
        <form method="POST">
           <input type="hidden" name="id">
           <input type="hidden" name="class_id">
           <div class="modal-body">
             <div class="input-group"><input name="name" class="input" required></div>
           </div>
           <div class="modal-actions">
             <div class="modal-btn" onclick="toggleModal('edit-subject-modal', false)">Cancel</div>
             <button class="modal-btn">Save</button>
           </div>
        </form>
        <form action="/admin/subjects/delete" method="POST" style="border-top:0.5px solid var(--separator);">
           <input type="hidden" name="id" id="del-sub-id">
           <input type="hidden" name="class_id" value="${classId}">
           <div class="modal-actions">
             <button class="modal-btn danger" onclick="this.form.querySelector('#del-sub-id').value = document.querySelector('#edit-subject-modal input[name=id]').value; return confirm('Delete Subject from ALL linked classes?');">Delete</button>
           </div>
        </form>
      </div>
    </div>
    
    <!-- New Group Modal -->
    <div id="new-group-modal" class="modal-overlay">
      <div class="modal-card">
        <div class="modal-header">New Group</div>
        <form action="/admin/classes/group" method="POST">
           <input type="hidden" name="class_id" value="${classId}">
           <div class="modal-body">
             <div class="input-group"><input name="name" class="input" required placeholder="Group Name (e.g. Science)"></div>
           </div>
           <div class="modal-actions">
             <div class="modal-btn" onclick="toggleModal('new-group-modal', false)">Cancel</div>
             <button class="modal-btn">Create</button>
           </div>
        </form>
      </div>
    </div>
    
    <!-- Delete Group Confirmation -->
    <div id="delete-group-modal" class="modal-overlay">
      <div class="modal-card">
        <div class="modal-header" style="color:var(--danger);">Delete Group?</div>
        <form action="/admin/classes/group/delete" method="POST">
           <input type="hidden" name="id">
           <input type="hidden" name="class_id" value="${classId}">
           <div class="modal-body" style="text-align:center; color:var(--text-secondary); font-size:15px;">
              This will remove the group and its subjects from ALL linked classes.
           </div>
           <div class="modal-actions">
             <div class="modal-btn" onclick="toggleModal('delete-group-modal', false)">Cancel</div>
             <button class="modal-btn danger">Delete</button>
           </div>
        </form>
      </div>
    </div>
    
    <!-- Link Modal -->
    <div id="link-modal" class="modal-overlay">
      <div class="modal-card">
        <div class="modal-header">Sync Class</div>
        <form action="/admin/classes/link" method="POST">
           <input type="hidden" name="class_id" value="${classId}">
           <div class="modal-body">
             <div style="font-size:14px; color:var(--text-secondary); margin-bottom:12px; line-height:1.4;">
                Enter the ID of another class to sync with. Content from both classes will be merged and shared.
             </div>
             <div class="input-group"><input type="number" name="link_class_id" class="input" placeholder="Class ID to sync with"></div>
           </div>
           <div class="modal-actions">
             <div class="modal-btn" onclick="toggleModal('link-modal', false)">Cancel</div>
             <button class="modal-btn">Sync</button>
           </div>
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
       <h1 class="page-title">${escapeHtml(subject.name)}</h1>
       <div class="page-subtitle">Chapters</div>
    </div>

    <div class="inset-list">
      ${chapters.results?.map((ch, idx) => `
        <div class="list-row">
           <div style="font-size:15px; font-weight:600; color:var(--text-secondary); width:30px; text-align:center;">${idx+1}</div>
           <div class="row-content">
             <div class="row-title">${escapeHtml(ch.name)}</div>
           </div>
           <button class="btn-icon-circle" style="background:none;" onclick="openEdit('edit-chapter-modal', '/admin/chapters/edit', {id: '${ch.id}', name: '${escapeHtml(ch.name)}', sort_order: '${ch.sort_order}', subject_id: '${subjectId}'})">
              <svg width="20" height="20" fill="none" stroke="#C7C7CC" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
           </button>
        </div>
      `).join('') || '<div style="padding:16px; text-align:center; color:var(--text-secondary);">No chapters yet</div>'}
    </div>

    <div style="text-align:center;">
       <button onclick="toggleModal('new-chapter-modal', true)" class="btn-text">+ Add Chapter</button>
    </div>

    <!-- New Chapter Modal -->
    <div id="new-chapter-modal" class="modal-overlay">
      <div class="modal-card">
        <div class="modal-header">New Chapter</div>
        <form action="/admin/chapters" method="POST">
           <input type="hidden" name="subject_id" value="${subjectId}">
           <div class="modal-body">
             <div class="input-group"><input name="name" class="input" required placeholder="Chapter Name"></div>
             <div class="input-group"><input name="sort_order" type="number" class="input" placeholder="Order (Optional)"></div>
           </div>
           <div class="modal-actions">
             <div class="modal-btn" onclick="toggleModal('new-chapter-modal', false)">Cancel</div>
             <button class="modal-btn">Add</button>
           </div>
        </form>
      </div>
    </div>

    <!-- Edit Chapter Modal -->
    <div id="edit-chapter-modal" class="modal-overlay">
      <div class="modal-card">
        <div class="modal-header">Edit Chapter</div>
        <form method="POST">
           <input type="hidden" name="id">
           <input type="hidden" name="subject_id">
           <div class="modal-body">
             <div class="input-group"><input name="name" class="input" required></div>
             <div class="input-group"><input name="sort_order" type="number" class="input" placeholder="Order"></div>
           </div>
           <div class="modal-actions">
             <div class="modal-btn" onclick="toggleModal('edit-chapter-modal', false)">Cancel</div>
             <button class="modal-btn">Save</button>
           </div>
        </form>
        <form action="/admin/chapters/delete" method="POST" style="border-top:0.5px solid var(--separator);">
           <input type="hidden" name="id" id="del-ch-id">
           <input type="hidden" name="subject_id" value="${subjectId}">
           <div class="modal-actions">
             <button class="modal-btn danger" onclick="this.form.querySelector('#del-ch-id').value = document.querySelector('#edit-chapter-modal input[name=id]').value; return confirm('Delete Chapter?');">Delete</button>
           </div>
        </form>
      </div>
    </div>
  `, "classes", session, `<a href="/admin/classes">Classes</a> / <a href="/admin/classes/${subject.class_id}">${classInfo ? escapeHtml(classInfo.name) : 'Class'}</a>`);
}

function renderLogin(error?: string) {
  return renderPage("Login", `
    <div style="height:80vh; display:flex; align-items:center; justify-content:center;">
      <div class="modal-card" style="transform:scale(1);">
         <div class="modal-header">Admin Access</div>
         ${error ? `<div style="padding:10px; background:#FFEBEE; color:var(--danger); text-align:center; font-size:14px;">${error}</div>` : ''}
         <form method="POST" action="/admin/login">
            <div class="modal-body">
               <div class="input-group"><input name="email" class="input" required placeholder="Email"></div>
               <div class="input-group"><input name="password" type="password" class="input" required placeholder="Password"></div>
            </div>
            <div class="modal-actions">
               <button class="modal-btn" style="width:100%; font-weight:600;">Sign In</button>
            </div>
         </form>
      </div>
    </div>
  `, "");
}

function renderSetup(error?: string) { return renderLogin("Setup Needed"); }

function renderSettings(session: any) {
  return renderPage("Settings", `
    <div class="header">
       <h1 class="page-title">Settings</h1>
    </div>
    
    <div class="list-header">System</div>
    <div class="inset-list">
       <form action="/admin/settings?action=reset" method="POST" onsubmit="return confirm('Strictly sure?');">
         <button class="list-row" style="width:100%; text-align:left;">
            <div class="row-content"><div class="row-title" style="color:var(--danger);">Factory Reset Database</div></div>
         </button>
       </form>
       <form action="/admin/logout" method="POST">
         <button class="list-row" style="width:100%; text-align:left;">
            <div class="row-content"><div class="row-title">Sign Out</div></div>
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
async function handleLinkClasses(request: Request, env: Env) {
    const fd = await request.formData();
    const classId = Number(fd.get("class_id"));
    const targetId = Number(fd.get("link_class_id"));

    if (classId && targetId) {
       // 1. Get existing link or create new
       let linkId: number | null = null;
       const c1Link = await env.DB.prepare("SELECT link_id FROM class_link_members WHERE class_id = ?").bind(classId).first<{link_id: number}>();
       if (c1Link) linkId = c1Link.link_id;
       const c2Link = await env.DB.prepare("SELECT link_id FROM class_link_members WHERE class_id = ?").bind(targetId).first<{link_id: number}>();
       if (c2Link) {
           if (linkId && linkId !== c2Link.link_id) return new Response("Error: Classes belong to different links.", {status: 400});
           linkId = c2Link.link_id;
       }

       if (!linkId) {
           const linkRes = await env.DB.prepare("INSERT INTO class_links (name, created_at) VALUES (?, ?)").bind("Linked Group", new Date().toISOString()).run();
           linkId = linkRes.meta.last_row_id as number;
       }

       // 2. Add members
       await env.DB.prepare("INSERT OR IGNORE INTO class_link_members (link_id, class_id) VALUES (?,?)").bind(linkId, classId).run();
       await env.DB.prepare("INSERT OR IGNORE INTO class_link_members (link_id, class_id) VALUES (?,?)").bind(linkId, targetId).run();
       
       // 3. Migrate Content (The "Sync" Magic)
       // Move Subjects
       await env.DB.prepare("UPDATE subjects SET link_id = ?, class_id = NULL WHERE class_id IN (?, ?)").bind(linkId, classId, targetId).run();
       // Move Groups
       await env.DB.prepare("UPDATE class_groups SET link_id = ?, class_id = NULL WHERE class_id IN (?, ?)").bind(linkId, classId, targetId).run();
    }
    return new Response(null, { status: 303, headers: { Location: `/admin/classes/${classId}` } });
}

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


