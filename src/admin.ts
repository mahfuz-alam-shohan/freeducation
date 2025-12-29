import { Env, ClassRow, GroupRow, SubjectRow, ChapterRow, TopicRow, ContentRow, QuestionRow } from "./types";
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

  // 1. Root & Health (The Entry Point)
  if (path === "/admin" || path === "/admin/") {
    const dbStatus = await ensureDatabase(env);
    if (!dbStatus.ok) return renderPage("Error", `DB Error: ${dbStatus.message}`, "dashboard");
    
    // Check if any admins exist at all
    const countQuery = await env.DB.prepare("SELECT count(*) as c FROM admins").first<{c:number}>();
    const adminCount = countQuery?.c || 0;

    // If no admins, FORCE Setup
    if (adminCount === 0) {
        return renderSetup();
    }

    // Otherwise, check session
    const session = await requireAuth(request, env);
    if (!session) {
      return renderLogin();
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
        if(token) await destroySession(env, token);
    }
    return new Response(null, { status: 303, headers: createAuthHeaders("/admin", null) });
  }

  // 3. Authenticated Routes
  const session = await requireAuth(request, env);
  if (!session) return new Response(null, { status: 303, headers: { Location: "/admin" } });

  // --- Classes ---
  if (path === "/admin/classes") {
    if (method === "POST") return handleCreateClass(request, env);
    return renderClassesList(session, env);
  }
  if (path === "/admin/classes/edit" && method === "POST") return handleEditClass(request, env);
  if (path === "/admin/classes/delete" && method === "POST") return handleDeleteClass(request, env);
  if (path.match(/^\/admin\/classes\/(\d+)$/)) return renderClassDetail(session, env, parseInt(path.split('/').pop()!));

  if (path === "/admin/classes/group" && method === "POST") return handleCreateGroup(request, env);
  if (path === "/admin/classes/group/delete" && method === "POST") return handleDeleteGroup(request, env);
  if (path === "/admin/classes/link" && method === "POST") return handleLinkClasses(request, env);

  // --- Subjects ---
  if (path === "/admin/subjects") { if (method === "POST") return handleCreateSubject(request, env); return redirect("/admin/classes"); }
  if (path === "/admin/subjects/edit" && method === "POST") return handleEditSubject(request, env);
  if (path === "/admin/subjects/delete" && method === "POST") return handleDeleteSubject(request, env);
  if (path.match(/^\/admin\/subjects\/(\d+)$/)) return renderSubjectDetail(session, env, parseInt(path.split('/').pop()!));

  // --- Chapters ---
  if (path === "/admin/chapters") { if (method === "POST") return handleCreateChapter(request, env); return redirect("/admin/classes"); }
  if (path === "/admin/chapters/edit" && method === "POST") return handleEditChapter(request, env);
  if (path === "/admin/chapters/delete" && method === "POST") return handleDeleteChapter(request, env);
  if (path.match(/^\/admin\/chapters\/(\d+)$/)) return renderChapterDetail(session, env, parseInt(path.split('/').pop()!));

  // --- Topics ---
  if (path === "/admin/topics") { if (method === "POST") return handleCreateTopic(request, env); return redirect("/admin/classes"); }
  if (path === "/admin/topics/delete" && method === "POST") return handleDeleteTopic(request, env);
  if (path.match(/^\/admin\/topics\/(\d+)$/)) return renderTopicDetail(session, env, parseInt(path.split('/').pop()!));

  // --- Content ---
  if (path === "/admin/content") { if (method === "POST") return handleCreateContent(request, env); return redirect("/admin/classes"); }
  if (path === "/admin/content/delete" && method === "POST") return handleDeleteContent(request, env);

  // --- Questions ---
  if (path === "/admin/questions") { if (method === "POST") return handleCreateQuestion(request, env); return redirect("/admin/classes"); }
  if (path === "/admin/questions/delete" && method === "POST") return handleDeleteQuestion(request, env);
  if (path === "/admin/questions/view") return renderQuestionList(session, env, url.searchParams);

  // --- Settings ---
  if (path === "/admin/settings") {
    if (method === "POST" && url.searchParams.get("action") === "reset") {
      await resetDatabase(env);
      return new Response(null, { 
        status: 303, 
        headers: { 
            "Location": "/admin",
            "Set-Cookie": "freeducation_admin=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0"
        } 
      });
    }
    return renderSettings(session);
  }

  return new Response("Not Found", { status: 404 });
}

function redirect(loc: string) { return new Response(null, { status: 303, headers: { Location: loc } }); }

// --- Views ---

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
           <div class="row-action" onclick="window.location='/admin/chapters/${ch.id}'"><svg width="20" height="20" fill="none" stroke="#C7C7CC" stroke-width="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"></path></svg></div>
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

async function renderChapterDetail(session: any, env: Env, chapterId: number) {
  const chapter = await env.DB.prepare("SELECT * FROM chapters WHERE id = ?").bind(chapterId).first<ChapterRow>();
  if (!chapter) return new Response("Not found", { status: 404 });
  const subject = await env.DB.prepare("SELECT * FROM subjects WHERE id = ?").bind(chapter.subject_id).first<SubjectRow>();
  
  const topics = await env.DB.prepare("SELECT * FROM topics WHERE chapter_id = ? ORDER BY sort_order ASC").bind(chapterId).all<TopicRow>();
  
  const qCounts = await env.DB.prepare(`
    SELECT type, COUNT(*) as c FROM questions WHERE chapter_id = ? GROUP BY type
  `).bind(chapterId).all<{type:string, c:number}>();
  
  const counts = { mcq: 0, short: 0, board: 0 };
  qCounts.results?.forEach(r => { if(counts[r.type as keyof typeof counts] !== undefined) counts[r.type as keyof typeof counts] = r.c; });

  const breadcrumbs = `<a href="/admin/classes">Classes</a> / ... / <a href="/admin/subjects/${chapter.subject_id}">${subject?.name}</a>`;

  return renderPage(chapter.name, `
    <div class="header">
      <div class="page-subtitle" style="text-transform:uppercase; letter-spacing:1px; font-weight:600; font-size:11px;">Chapter</div>
      <h1 class="page-title">${escapeHtml(chapter.name)}</h1>
    </div>

    <!-- Topics Section -->
    <div class="list-header" style="display:flex; justify-content:space-between;">
       <span>Learning Path</span>
       <button onclick="toggleModal('new-topic-modal', true)" style="color:var(--primary); font-weight:600;">+</button>
    </div>
    <div class="inset-list">
       ${topics.results?.map((t, idx) => `
         <div class="list-row" onclick="window.location='/admin/topics/${t.id}'">
            <div style="font-size:14px; color:var(--text-secondary); margin-right:12px; font-variant-numeric:tabular-nums;">${String(idx+1).padStart(2,'0')}</div>
            <div class="row-content">
               <div class="row-title" style="font-size:16px;">${escapeHtml(t.title)}</div>
            </div>
            <div class="row-action">›</div>
         </div>
       `).join('') || '<div style="padding:16px; text-align:center; color:var(--text-secondary); font-size:14px;">No topics added</div>'}
    </div>

    <!-- Question Bank Section -->
    <div class="list-header">Question Bank</div>
    <div class="inset-list">
       <div class="list-row" onclick="window.location='/admin/questions/view?chapter_id=${chapterId}&type=mcq'">
          <div class="row-content"><div class="row-title">MCQs</div></div>
          <div class="row-action" style="color:var(--text-main); font-weight:600;">${counts.mcq} ›</div>
       </div>
       <div class="list-row" onclick="window.location='/admin/questions/view?chapter_id=${chapterId}&type=short'">
          <div class="row-content"><div class="row-title">Short Questions</div></div>
          <div class="row-action" style="color:var(--text-main); font-weight:600;">${counts.short} ›</div>
       </div>
       <div class="list-row" onclick="window.location='/admin/questions/view?chapter_id=${chapterId}&type=board'">
          <div class="row-content"><div class="row-title">Board Questions</div></div>
          <div class="row-action" style="color:var(--text-main); font-weight:600;">${counts.board} ›</div>
       </div>
    </div>

    <!-- New Topic Modal -->
    <div id="new-topic-modal" class="modal-overlay">
      <div class="modal-card">
        <div class="modal-header">New Topic</div>
        <form action="/admin/topics" method="POST">
           <input type="hidden" name="chapter_id" value="${chapterId}">
           <div class="modal-body">
             <div class="input-group"><input name="title" class="input" required placeholder="Topic Title"></div>
             <div class="input-group"><input name="sort_order" type="number" class="input" placeholder="Order"></div>
           </div>
           <div class="modal-actions">
             <div class="modal-btn" onclick="toggleModal('new-topic-modal', false)">Cancel</div>
             <button class="modal-btn">Create</button>
           </div>
        </form>
      </div>
    </div>
  `, "classes", session, breadcrumbs);
}

async function renderTopicDetail(session: any, env: Env, topicId: number) {
  const topic = await env.DB.prepare("SELECT * FROM topics WHERE id = ?").bind(topicId).first<TopicRow>();
  if(!topic) return new Response("Not found", {status:404});
  const chapter = await env.DB.prepare("SELECT * FROM chapters WHERE id = ?").bind(topic.chapter_id).first<ChapterRow>();
  
  const contents = await env.DB.prepare("SELECT * FROM topic_contents WHERE topic_id = ? ORDER BY sort_order ASC").bind(topicId).all<ContentRow>();

  const breadcrumbs = `<a href="/admin/chapters/${topic.chapter_id}">${chapter?.name}</a>`;

  return renderPage(topic.title, `
    <div class="header">
      <div class="page-subtitle">Topic</div>
      <h1 class="page-title" style="font-size:24px;">${escapeHtml(topic.title)}</h1>
    </div>

    <div class="list-header" style="display:flex; justify-content:space-between;">
       <span>Content</span>
       <button onclick="toggleModal('new-content-modal', true)" style="color:var(--primary); font-weight:600;">+ Add</button>
    </div>

    <div class="inset-list">
      ${contents.results?.map(c => `
         <div class="list-row">
            <div class="row-icon">
               ${c.type === 'video' ? '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>' : 
                 c.type === 'pdf' ? '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>' :
                 '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>'}
            </div>
            <div class="row-content">
               <div class="row-title" style="font-size:15px;">${escapeHtml(c.title)}</div>
               <div class="row-subtitle">${c.type.toUpperCase()}</div>
            </div>
            <form action="/admin/content/delete" method="POST" onsubmit="return confirm('Delete?');" style="margin:0;">
               <input type="hidden" name="id" value="${c.id}">
               <input type="hidden" name="topic_id" value="${topicId}">
               <button class="row-action" style="color:var(--danger);"><svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
            </form>
         </div>
      `).join('') || '<div style="padding:16px; text-align:center; color:var(--text-secondary); font-size:14px;">No content yet</div>'}
    </div>
    
    <div style="text-align:center; margin-top:20px;">
       <form action="/admin/topics/delete" method="POST" onsubmit="return confirm('Delete Topic?');">
          <input type="hidden" name="id" value="${topicId}">
          <input type="hidden" name="chapter_id" value="${topic.chapter_id}">
          <button class="btn-text" style="color:var(--danger);">Delete Topic</button>
       </form>
    </div>

    <!-- New Content Modal -->
    <div id="new-content-modal" class="modal-overlay">
      <div class="modal-card">
        <div class="modal-header">Add Content</div>
        <form action="/admin/content" method="POST">
           <input type="hidden" name="topic_id" value="${topicId}">
           <div class="modal-body">
             <div class="input-group">
                <select name="type" class="input">
                   <option value="note">Note (Text)</option>
                   <option value="video">Video (URL)</option>
                   <option value="pdf">PDF (URL)</option>
                   <option value="explanation">Explanation</option>
                </select>
             </div>
             <div class="input-group"><input name="title" class="input" required placeholder="Title"></div>
             <div class="input-group"><textarea name="data" class="input" placeholder="Body Text or URL" style="height:80px; font-family:inherit;"></textarea></div>
           </div>
           <div class="modal-actions">
             <div class="modal-btn" onclick="toggleModal('new-content-modal', false)">Cancel</div>
             <button class="modal-btn">Add</button>
           </div>
        </form>
      </div>
    </div>
  `, "classes", session, breadcrumbs);
}

async function renderQuestionList(session: any, env: Env, params: URLSearchParams) {
  const chapterId = parseInt(params.get("chapter_id")!);
  const type = params.get("type") as 'mcq' | 'short' | 'board';
  
  const chapter = await env.DB.prepare("SELECT * FROM chapters WHERE id = ?").bind(chapterId).first<ChapterRow>();
  const questions = await env.DB.prepare("SELECT * FROM questions WHERE chapter_id = ? AND type = ? ORDER BY sort_order ASC").bind(chapterId, type).all<QuestionRow>();
  
  const typeLabel = type === 'mcq' ? 'MCQs' : type === 'short' ? 'Short Questions' : 'Board Questions';
  const breadcrumbs = `<a href="/admin/chapters/${chapterId}">${chapter?.name}</a>`;

  return renderPage(`${typeLabel}`, `
    <div class="header">
      <div class="page-subtitle">Question Bank</div>
      <h1 class="page-title" style="font-size:24px;">${typeLabel}</h1>
    </div>

    <div class="list-header" style="display:flex; justify-content:space-between;">
       <span>${questions.results?.length || 0} Questions</span>
       <button onclick="toggleModal('new-q-modal', true)" style="color:var(--primary); font-weight:600;">+ Add</button>
    </div>

    <div class="inset-list">
       ${questions.results?.map((q, i) => `
          <div class="list-row" style="align-items:flex-start; padding:12px 16px;">
             <div style="font-weight:600; font-size:14px; color:var(--text-secondary); margin-right:12px; margin-top:2px;">${i+1}</div>
             <div class="row-content">
                <div style="font-size:15px; margin-bottom:4px;">${escapeHtml(q.question)}</div>
                ${q.type === 'mcq' ? `<div style="font-size:12px; color:var(--text-secondary);">Answer: ${escapeHtml(q.answer)}</div>` : ''}
             </div>
             <form action="/admin/questions/delete" method="POST" onsubmit="return confirm('Delete?');" style="margin-left:8px;">
               <input type="hidden" name="id" value="${q.id}">
               <input type="hidden" name="chapter_id" value="${chapterId}">
               <input type="hidden" name="type" value="${type}">
               <button style="color:var(--danger); font-size:20px;">×</button>
             </form>
          </div>
       `).join('') || '<div style="padding:20px; text-align:center; color:var(--text-secondary);">Empty</div>'}
    </div>

    <!-- New Question Modal -->
    <div id="new-q-modal" class="modal-overlay">
      <div class="modal-card">
        <div class="modal-header">New ${typeLabel}</div>
        <form action="/admin/questions" method="POST">
           <input type="hidden" name="chapter_id" value="${chapterId}">
           <input type="hidden" name="type" value="${type}">
           <div class="modal-body">
             <div class="input-group">
               <textarea name="question" class="input" required placeholder="Question Text" style="height:60px;"></textarea>
             </div>
             ${type === 'mcq' ? `
               <div class="input-group"><input name="option_a" class="input" placeholder="Option A"></div>
               <div class="input-group"><input name="option_b" class="input" placeholder="Option B"></div>
               <div class="input-group"><input name="option_c" class="input" placeholder="Option C"></div>
               <div class="input-group"><input name="option_d" class="input" placeholder="Option D"></div>
               <div class="input-group"><input name="answer" class="input" placeholder="Correct Answer (e.g. A)"></div>
             ` : `
               <div class="input-group"><textarea name="answer" class="input" placeholder="Model Answer / Key Points" style="height:80px;"></textarea></div>
             `}
           </div>
           <div class="modal-actions">
             <div class="modal-btn" onclick="toggleModal('new-q-modal', false)">Cancel</div>
             <button class="modal-btn">Save</button>
           </div>
        </form>
      </div>
    </div>
  `, "classes", session, breadcrumbs);
}

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

function renderSetup(error?: string) {
  return renderPage("Setup", `
    <div style="height:80vh; display:flex; align-items:center; justify-content:center;">
      <div class="modal-card" style="transform:scale(1);">
         <div class="modal-header">Welcome Owner</div>
         ${error ? `<div style="padding:10px; background:#FFEBEE; color:var(--danger); text-align:center; font-size:14px;">${error}</div>` : ''}
         <div style="padding:16px; text-align:center; color:var(--text-secondary); font-size:14px; line-height:1.5;">
            The system has been reset. Please create the first admin account to get started.
         </div>
         <form method="POST" action="/admin/setup">
            <div class="modal-body">
               <div class="input-group"><input name="name" class="input" required placeholder="Full Name"></div>
               <div class="input-group"><input name="email" class="input" required placeholder="Email"></div>
               <div class="input-group"><input name="password" type="password" class="input" required placeholder="Password"></div>
            </div>
            <div class="modal-actions">
               <button class="modal-btn" style="width:100%; font-weight:600;">Create Account</button>
            </div>
         </form>
      </div>
    </div>
  `, "");
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

// --- Logic Handlers ---

async function handleLoginSubmit(request: Request, env: Env) {
  const fd = await request.formData();
  const admin = await env.DB.prepare("SELECT * FROM admins WHERE email = ?").bind(fd.get("email")).first<{id:number, password_hash:string}>();
  if(!admin || !(await verifyPassword(fd.get("password") as string, admin.password_hash))) return renderLogin("Invalid credentials");
  const token = await createSession(env, admin.id);
  return new Response(null, { status: 303, headers: createAuthHeaders("/admin", token) });
}

async function handleSetupSubmit(request: Request, env: Env) {
  const formData = await request.formData();
  const name = formData.get("name")?.toString();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if(!name || !email || !password) return renderSetup("All fields required");

  // Strict check: Only allow setup if DB is empty
  const count = await env.DB.prepare("SELECT count(*) as c FROM admins").first<{c:number}>();
  if(count && count.c > 0) return renderLogin("Setup already completed");

  try {
      const hash = await hashPassword(password);
      const res = await env.DB.prepare("INSERT INTO admins (name, email, password_hash, created_at) VALUES (?,?,?,?)")
          .bind(name, email, hash, new Date().toISOString()).run();
      
      const token = await createSession(env, res.meta.last_row_id as number);
      return new Response(null, { status: 303, headers: createAuthHeaders("/admin", token) });
  } catch(e: any) {
      return renderSetup("Error creating account. Email might be taken.");
  }
}

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
       await env.DB.prepare("INSERT OR IGNORE INTO class_link_members (link_id, class_id) VALUES (?,?)").bind(linkId, classId).run();
       await env.DB.prepare("INSERT OR IGNORE INTO class_link_members (link_id, class_id) VALUES (?,?)").bind(linkId, targetId).run();
       await env.DB.prepare("UPDATE subjects SET link_id = ?, class_id = NULL WHERE class_id IN (?, ?)").bind(linkId, classId, targetId).run();
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

async function handleCreateTopic(request: Request, env: Env) {
  const fd = await request.formData();
  await env.DB.prepare("INSERT INTO topics (chapter_id, title, sort_order, created_at) VALUES (?,?,?,?)")
    .bind(fd.get("chapter_id"), fd.get("title"), fd.get("sort_order")||0, new Date().toISOString()).run();
  return redirect(`/admin/chapters/${fd.get("chapter_id")}`);
}
async function handleDeleteTopic(request: Request, env: Env) {
  const fd = await request.formData();
  await env.DB.prepare("DELETE FROM topics WHERE id = ?").bind(fd.get("id")).run();
  return redirect(`/admin/chapters/${fd.get("chapter_id")}`);
}

async function handleCreateContent(request: Request, env: Env) {
  const fd = await request.formData();
  await env.DB.prepare("INSERT INTO topic_contents (topic_id, type, title, data, created_at) VALUES (?,?,?,?,?)")
    .bind(fd.get("topic_id"), fd.get("type"), fd.get("title"), fd.get("data"), new Date().toISOString()).run();
  return redirect(`/admin/topics/${fd.get("topic_id")}`);
}
async function handleDeleteContent(request: Request, env: Env) {
  const fd = await request.formData();
  await env.DB.prepare("DELETE FROM topic_contents WHERE id = ?").bind(fd.get("id")).run();
  return redirect(`/admin/topics/${fd.get("topic_id")}`);
}

async function handleCreateQuestion(request: Request, env: Env) {
  const fd = await request.formData();
  const type = fd.get("type") as string;
  let options = null;
  if(type === 'mcq') {
    options = JSON.stringify({
      A: fd.get("option_a"), B: fd.get("option_b"), C: fd.get("option_c"), D: fd.get("option_d")
    });
  }
  await env.DB.prepare("INSERT INTO questions (chapter_id, type, question, options, answer, created_at) VALUES (?,?,?,?,?,?)")
    .bind(fd.get("chapter_id"), type, fd.get("question"), options, fd.get("answer"), new Date().toISOString()).run();
  return redirect(`/admin/questions/view?chapter_id=${fd.get("chapter_id")}&type=${type}`);
}
async function handleDeleteQuestion(request: Request, env: Env) {
  const fd = await request.formData();
  await env.DB.prepare("DELETE FROM questions WHERE id = ?").bind(fd.get("id")).run();
  return redirect(`/admin/questions/view?chapter_id=${fd.get("chapter_id")}&type=${fd.get("type")}`);
}


