import { Env, ClassRow, SubjectRow, ChapterRow, TopicRow, ContentRow, QuestionRow } from "./types";
import { getSession, createSession, hashPassword, verifyPassword, destroySession, createAuthHeaders } from "./auth";
import { renderPage, escapeHtml } from "./ui";
import { ensureDatabase, resetDatabase } from "./db";
import {
  renderClassesList,
  renderClassDetail,
  handleCreateClass,
  handleEditClass,
  handleDeleteClass,
  handleCreateGroup,
  handleDeleteGroup,
  handleLinkClasses,
  handleCreateSubject,
  handleEditSubject,
  handleDeleteSubject
} from "./admin/classes";

// --- Middleware ---
async function requireAuth(request: Request, env: Env) {
  const session = await getSession(request, env);
  if (!session) return null;
  return session;
}

function displayOrder(order: number | null | undefined, fallback: number) {
  if (typeof order === "number" && order > 0) return order;
  return fallback;
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

    <div class="stat-grid">
      <div class="stat-card">
        <div>
          <div class="stat-label">Classes</div>
          <div class="stat-value">${counts.classes}</div>
        </div>
        <div class="stat-icon">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"></path><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"></path></svg>
        </div>
      </div>
      <div class="stat-card">
        <div>
          <div class="stat-label">Subjects</div>
          <div class="stat-value">${counts.subjects}</div>
        </div>
        <div class="stat-icon">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"></path><path d="M4 4v16a2 2 0 002 2h14"></path><path d="M8 7h10"></path><path d="M8 11h10"></path><path d="M8 15h7"></path></svg>
        </div>
      </div>
    </div>
    
    <div class="list-header">Quick Actions</div>
    <div class="inset-list">
      <div class="list-row" onclick="window.location='/admin/classes'">
         <div class="row-icon"><svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"></path><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"></path></svg></div>
         <div class="row-content">
           <div class="row-title">Manage Classes</div>
           <div class="row-subtitle">Organize subjects and groups</div>
         </div>
         <div class="row-action" style="color:var(--text-main); font-weight:600;">${counts.classes} ›</div>
      </div>
      <div class="list-row" onclick="window.location='/admin/settings'">
         <div class="row-icon"><svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1 0-2.83 2 2 0 0 1 0 2.83l.06.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg></div>
         <div class="row-content">
           <div class="row-title">Settings</div>
           <div class="row-subtitle">Manage admin access and resets</div>
         </div>
         <div class="row-action">›</div>
      </div>
    </div>
  `, "dashboard", session);
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
      ${chapters.results?.map((ch, idx) => {
        const chapterNo = displayOrder(ch.sort_order, idx + 1);
        return `
        <div class="list-row">
           <div class="order-chip"><span>Ch</span>${chapterNo}</div>
           <div class="row-content">
             <div class="row-title">${escapeHtml(ch.name)}</div>
           </div>
           <button class="btn-icon-circle" onclick="openEdit('edit-chapter-modal', '/admin/chapters/edit', {id: '${ch.id}', name: '${escapeHtml(ch.name)}', sort_order: '${ch.sort_order}', subject_id: '${subjectId}'})">
              <svg width="20" height="20" fill="none" stroke="#C7C7CC" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
           </button>
           <div class="row-action" onclick="window.location='/admin/chapters/${ch.id}'"><svg width="20" height="20" fill="none" stroke="#C7C7CC" stroke-width="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"></path></svg></div>
        </div>
      `;
      }).join('') || '<div style="padding:16px; text-align:center; color:var(--text-secondary);">No chapters yet</div>'}
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
             <div class="input-group"><input name="name" class="input" required placeholder="Chapter title"></div>
             <div class="input-group"><input name="sort_order" type="number" class="input" placeholder="Chapter No. (textbook order)"></div>
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
             <div class="input-group"><input name="sort_order" type="number" class="input" placeholder="Chapter No."></div>
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
  const chapterNo = displayOrder(chapter.sort_order, 0);
  
  const topics = await env.DB.prepare("SELECT * FROM topics WHERE chapter_id = ? ORDER BY sort_order ASC").bind(chapterId).all<TopicRow>();
  
  const qCounts = await env.DB.prepare(`
    SELECT type, COUNT(*) as c FROM questions WHERE chapter_id = ? GROUP BY type
  `).bind(chapterId).all<{type:string, c:number}>();
  
  const counts = { mcq: 0, short: 0, board: 0 };
  qCounts.results?.forEach(r => { if(counts[r.type as keyof typeof counts] !== undefined) counts[r.type as keyof typeof counts] = r.c; });

  const breadcrumbs = `<a href="/admin/classes">Classes</a> / ... / <a href="/admin/subjects/${chapter.subject_id}">${subject?.name}</a>`;

  return renderPage(chapter.name, `
    <div class="header">
      <div class="page-subtitle" style="text-transform:uppercase; letter-spacing:1px; font-weight:600; font-size:11px;">${chapterNo ? `Chapter ${chapterNo}` : "Chapter"}</div>
      <h1 class="page-title">${escapeHtml(chapter.name)}</h1>
    </div>

    <!-- Topics Section -->
    <div class="list-header" style="display:flex; justify-content:space-between;">
       <span>Topics</span>
       <button onclick="toggleModal('new-topic-modal', true)" style="color:var(--primary); font-weight:600;">+</button>
    </div>
    <div class="inset-list">
       ${topics.results?.map((t, idx) => {
         const topicNo = displayOrder(t.sort_order, idx + 1);
         return `
         <div class="list-row" onclick="window.location='/admin/topics/${t.id}'">
            <div class="order-chip"><span>Topic</span>${topicNo}</div>
            <div class="row-content">
               <div class="row-title" style="font-size:16px;">${escapeHtml(t.title)}</div>
            </div>
            <div class="row-action">›</div>
         </div>
       `;
       }).join('') || '<div style="padding:16px; text-align:center; color:var(--text-secondary); font-size:14px;">No topics added</div>'}
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
             <div class="input-group"><input name="title" class="input" required placeholder="Topic title"></div>
             <div class="input-group"><input name="sort_order" type="number" class="input" placeholder="Topic No."></div>
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
  const chapterNo = chapter ? displayOrder(chapter.sort_order, 0) : 0;
  const topicNo = displayOrder(topic.sort_order, 0);
  
  const contents = await env.DB.prepare("SELECT * FROM topic_contents WHERE topic_id = ? ORDER BY sort_order ASC").bind(topicId).all<ContentRow>();

  const breadcrumbs = `<a href="/admin/chapters/${topic.chapter_id}">${chapter?.name}</a>`;

  return renderPage(topic.title, `
    <div class="header">
      <div class="page-subtitle">${chapterNo ? `Chapter ${chapterNo}` : "Chapter"}${topicNo ? ` • Topic ${topicNo}` : ""}</div>
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
