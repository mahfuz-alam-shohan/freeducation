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

const QUESTION_TYPE_LABELS: Record<QuestionRow["type"], string> = {
  mcq: "MCQs",
  short: "Short Questions",
  board: "Board Questions",
  versity: "Versity Questions",
  college: "College Test Questions",
  custom: "Custom Questions"
};

const QUESTION_TYPE_OPTIONS = [
  { value: "mcq", label: QUESTION_TYPE_LABELS.mcq },
  { value: "short", label: QUESTION_TYPE_LABELS.short },
  { value: "board", label: QUESTION_TYPE_LABELS.board },
  { value: "versity", label: QUESTION_TYPE_LABELS.versity },
  { value: "college", label: QUESTION_TYPE_LABELS.college },
  { value: "custom", label: QUESTION_TYPE_LABELS.custom }
];

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
  if (path === "/admin/topics/edit" && method === "POST") return handleEditTopic(request, env);
  if (path === "/admin/topics/delete" && method === "POST") return handleDeleteTopic(request, env);
  if (path.match(/^\/admin\/topics\/(\d+)$/)) return renderTopicDetail(session, env, parseInt(path.split('/').pop()!));

  // --- Content ---
  if (path === "/admin/content") { if (method === "POST") return handleCreateContent(request, env); return redirect("/admin/classes"); }
  if (path === "/admin/content/delete" && method === "POST") return handleDeleteContent(request, env);

  // --- Questions ---
  if (path === "/admin/questions") { if (method === "POST") return handleCreateQuestion(request, env); return redirect("/admin/classes"); }
  if (path === "/admin/questions/cq" && method === "POST") return handleCreateCqQuestions(request, env);
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
           <button class="btn-icon-circle" type="button" aria-label="Edit chapter ${escapeHtml(ch.name)}" title="Edit chapter" onclick="openEdit('edit-chapter-modal', '/admin/chapters/edit', {id: '${ch.id}', name: '${escapeHtml(ch.name)}', sort_order: '${ch.sort_order}', subject_id: '${subjectId}'})">
              <svg width="20" height="20" fill="none" stroke="#C7C7CC" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
           </button>
           <button class="row-action" type="button" aria-label="Open chapter ${escapeHtml(ch.name)}" title="Open chapter" onclick="window.location='/admin/chapters/${ch.id}'"><svg width="20" height="20" fill="none" stroke="#C7C7CC" stroke-width="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"></path></svg></button>
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
  
  const counts = { mcq: 0, short: 0, board: 0, versity: 0, college: 0, custom: 0 };
  qCounts.results?.forEach(r => {
    if (counts[r.type as keyof typeof counts] !== undefined) {
      counts[r.type as keyof typeof counts] = r.c;
    }
  });
  const totalQuestions = Object.values(counts).reduce((acc, val) => acc + val, 0);

  const breadcrumbs = `<a href="/admin/classes">Classes</a> / ... / <a href="/admin/subjects/${chapter.subject_id}">${subject?.name}</a>`;

  return renderPage(chapter.name, `
    <div class="header">
      <div class="page-subtitle" style="text-transform:uppercase; letter-spacing:1px; font-weight:600; font-size:11px;">${chapterNo ? `Chapter ${chapterNo}` : "Chapter"}</div>
      <h1 class="page-title">${escapeHtml(chapter.name)}</h1>
    </div>

    <!-- Topics Section -->
    <div class="list-header" style="display:flex; justify-content:space-between;">
       <span>Topics</span>
       <button onclick="toggleModal('new-topic-modal', true)" class="btn-icon" type="button" aria-label="Add topic" title="Add topic">+</button>
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
            <button class="btn-icon-circle" type="button" aria-label="Edit topic ${escapeHtml(t.title)}" title="Edit topic" onclick="event.stopPropagation(); openEdit('edit-topic-modal', '/admin/topics/edit', {id: '${t.id}', title: '${escapeHtml(t.title)}', sort_order: '${t.sort_order}', chapter_id: '${chapterId}'})">
              <svg width="20" height="20" fill="none" stroke="#8E8E93" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
            </button>
            <div class="row-action" aria-hidden="true">›</div>
         </div>
       `;
       }).join('') || '<div style="padding:16px; text-align:center; color:var(--text-secondary); font-size:14px;">No topics added</div>'}
    </div>

    <!-- Question Bank Section -->
    <div class="list-header">Central Question Bank</div>
    <div class="inset-list">
       <div class="list-row" onclick="window.location='/admin/questions/view?chapter_id=${chapterId}'">
          <div class="row-content"><div class="row-title">All Questions</div></div>
          <div class="row-action" style="color:var(--text-main); font-weight:600;">${totalQuestions} ›</div>
       </div>
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
       <div class="list-row" onclick="window.location='/admin/questions/view?chapter_id=${chapterId}&type=versity'">
          <div class="row-content"><div class="row-title">Versity Questions</div></div>
          <div class="row-action" style="color:var(--text-main); font-weight:600;">${counts.versity} ›</div>
       </div>
       <div class="list-row" onclick="window.location='/admin/questions/view?chapter_id=${chapterId}&type=college'">
          <div class="row-content"><div class="row-title">College Test Questions</div></div>
          <div class="row-action" style="color:var(--text-main); font-weight:600;">${counts.college} ›</div>
       </div>
       <div class="list-row" onclick="window.location='/admin/questions/view?chapter_id=${chapterId}&type=custom'">
          <div class="row-content"><div class="row-title">Custom Questions</div></div>
          <div class="row-action" style="color:var(--text-main); font-weight:600;">${counts.custom} ›</div>
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

    <!-- Edit Topic Modal -->
    <div id="edit-topic-modal" class="modal-overlay">
      <div class="modal-card">
        <div class="modal-header">Edit Topic</div>
        <form method="POST">
           <input type="hidden" name="id">
           <input type="hidden" name="chapter_id" value="${chapterId}">
           <input type="hidden" name="return_to" value="/admin/chapters/${chapterId}">
           <div class="modal-body">
             <div class="input-group"><input name="title" class="input" required placeholder="Topic title"></div>
             <div class="input-group"><input name="sort_order" type="number" class="input" placeholder="Topic No."></div>
           </div>
           <div class="modal-actions">
             <div class="modal-btn" onclick="toggleModal('edit-topic-modal', false)">Cancel</div>
             <button class="modal-btn">Save</button>
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
  const qCounts = await env.DB.prepare(`
    SELECT type, COUNT(*) as c FROM questions WHERE topic_id = ? GROUP BY type
  `).bind(topicId).all<{type:string, c:number}>();
  const counts = { mcq: 0, short: 0, board: 0, versity: 0, college: 0, custom: 0 };
  qCounts.results?.forEach(r => {
    if (counts[r.type as keyof typeof counts] !== undefined) {
      counts[r.type as keyof typeof counts] = r.c;
    }
  });
  const totalQuestions = Object.values(counts).reduce((acc, val) => acc + val, 0);

  const breadcrumbs = `<a href="/admin/chapters/${topic.chapter_id}">${chapter?.name}</a>`;

  return renderPage(topic.title, `
    <div class="header">
      <div class="page-subtitle">${chapterNo ? `Chapter ${chapterNo}` : "Chapter"}${topicNo ? ` • Topic ${topicNo}` : ""}</div>
      <h1 class="page-title" style="font-size:24px;">${escapeHtml(topic.title)}</h1>
    </div>
    <div class="action-row">
       <button onclick="openEdit('edit-topic-modal', '/admin/topics/edit', {id: '${topicId}', title: '${escapeHtml(topic.title)}', sort_order: '${topic.sort_order}', chapter_id: '${topic.chapter_id}'})" class="btn-text">Edit Topic</button>
    </div>

    <div class="list-header" style="display:flex; justify-content:space-between;">
       <span>Content</span>
       <button onclick="toggleModal('new-content-modal', true)" class="btn-text" type="button" aria-label="Add content">+ Add</button>
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
               <button class="row-action" type="submit" aria-label="Delete content ${escapeHtml(c.title)}" title="Delete content" style="color:var(--danger);"><svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
            </form>
         </div>
      `).join('') || '<div style="padding:16px; text-align:center; color:var(--text-secondary); font-size:14px;">No content yet</div>'}
    </div>

    <div class="list-header">Topic Question Bank</div>
    <div class="inset-list">
       <div class="list-row" onclick="window.location='/admin/questions/view?chapter_id=${topic.chapter_id}&topic_id=${topicId}'">
          <div class="row-content"><div class="row-title">All Questions</div></div>
          <div class="row-action" style="color:var(--text-main); font-weight:600;">${totalQuestions} ›</div>
       </div>
       <div class="list-row" onclick="window.location='/admin/questions/view?chapter_id=${topic.chapter_id}&topic_id=${topicId}&type=mcq'">
          <div class="row-content"><div class="row-title">MCQs</div></div>
          <div class="row-action" style="color:var(--text-main); font-weight:600;">${counts.mcq} ›</div>
       </div>
       <div class="list-row" onclick="window.location='/admin/questions/view?chapter_id=${topic.chapter_id}&topic_id=${topicId}&type=short'">
          <div class="row-content"><div class="row-title">Short Questions</div></div>
          <div class="row-action" style="color:var(--text-main); font-weight:600;">${counts.short} ›</div>
       </div>
       <div class="list-row" onclick="window.location='/admin/questions/view?chapter_id=${topic.chapter_id}&topic_id=${topicId}&type=board'">
          <div class="row-content"><div class="row-title">Board Questions</div></div>
          <div class="row-action" style="color:var(--text-main); font-weight:600;">${counts.board} ›</div>
       </div>
       <div class="list-row" onclick="window.location='/admin/questions/view?chapter_id=${topic.chapter_id}&topic_id=${topicId}&type=versity'">
          <div class="row-content"><div class="row-title">Versity Questions</div></div>
          <div class="row-action" style="color:var(--text-main); font-weight:600;">${counts.versity} ›</div>
       </div>
       <div class="list-row" onclick="window.location='/admin/questions/view?chapter_id=${topic.chapter_id}&topic_id=${topicId}&type=college'">
          <div class="row-content"><div class="row-title">College Test Questions</div></div>
          <div class="row-action" style="color:var(--text-main); font-weight:600;">${counts.college} ›</div>
       </div>
       <div class="list-row" onclick="window.location='/admin/questions/view?chapter_id=${topic.chapter_id}&topic_id=${topicId}&type=custom'">
          <div class="row-content"><div class="row-title">Custom Questions</div></div>
          <div class="row-action" style="color:var(--text-main); font-weight:600;">${counts.custom} ›</div>
       </div>
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

    <!-- Edit Topic Modal -->
    <div id="edit-topic-modal" class="modal-overlay">
      <div class="modal-card">
        <div class="modal-header">Edit Topic</div>
        <form method="POST">
           <input type="hidden" name="id">
           <input type="hidden" name="chapter_id" value="${topic.chapter_id}">
           <input type="hidden" name="return_to" value="/admin/topics/${topicId}">
           <div class="modal-body">
             <div class="input-group"><input name="title" class="input" required placeholder="Topic title"></div>
             <div class="input-group"><input name="sort_order" type="number" class="input" placeholder="Topic No."></div>
           </div>
           <div class="modal-actions">
             <div class="modal-btn" onclick="toggleModal('edit-topic-modal', false)">Cancel</div>
             <button class="modal-btn">Save</button>
           </div>
        </form>
      </div>
    </div>
  `, "classes", session, breadcrumbs);
}

async function renderQuestionList(session: any, env: Env, params: URLSearchParams) {
  const chapterId = parseInt(params.get("chapter_id")!);
  const topicIdParam = params.get("topic_id");
  const topicId = topicIdParam ? parseInt(topicIdParam) : null;
  const typeParam = params.get("type") as QuestionRow["type"] | null;
  const type = typeParam && typeParam !== ("all" as QuestionRow["type"]) ? typeParam : null;
  
  const chapter = await env.DB.prepare("SELECT * FROM chapters WHERE id = ?").bind(chapterId).first<ChapterRow>();
  const topic = topicId ? await env.DB.prepare("SELECT * FROM topics WHERE id = ?").bind(topicId).first<TopicRow>() : null;
  const subjectChapters = chapter
    ? await env.DB.prepare("SELECT * FROM chapters WHERE subject_id = ? ORDER BY sort_order ASC, created_at ASC").bind(chapter.subject_id).all<ChapterRow>()
    : { results: [] as ChapterRow[] };
  const chapterIds = subjectChapters.results?.map((item) => item.id).filter(Boolean) || [];
  let chapterTopics: TopicRow[] = [];
  if (chapterIds.length > 0) {
    const placeholders = chapterIds.map(() => "?").join(", ");
    const topicsResult = await env.DB.prepare(
      `SELECT * FROM topics WHERE chapter_id IN (${placeholders}) ORDER BY sort_order ASC, created_at ASC`
    ).bind(...chapterIds).all<TopicRow>();
    chapterTopics = topicsResult.results || [];
  }
  const questions = await env.DB.prepare(`
    SELECT q.*, t.title as topic_title
    FROM questions q
    LEFT JOIN topics t ON t.id = q.topic_id
    WHERE q.chapter_id = ?
    ${topicId ? "AND q.topic_id = ?" : ""}
    ${type ? "AND q.type = ?" : ""}
    ORDER BY q.sort_order ASC, q.created_at DESC
  `).bind(
    chapterId,
    ...(topicId ? [topicId] : []),
    ...(type ? [type] : [])
  ).all<(QuestionRow & { topic_title?: string })>();
  
  const typeLabel = type ? QUESTION_TYPE_LABELS[type] : "All Questions";
  const breadcrumbs = `<a href="/admin/chapters/${chapterId}">${chapter?.name}</a>${topic ? ` / <a href="/admin/topics/${topic.id}">${topic.title}</a>` : ''}`;
  const scenarioGroups = new Set<string>();

  const renderScenarioBlock = (q: QuestionRow) => {
    if (!q.cq_group_id || !q.cq_related) return "";
    if (!q.scenario_text && !q.scenario_media_url) return "";
    if (scenarioGroups.has(q.cq_group_id)) return "";
    scenarioGroups.add(q.cq_group_id);
    const mediaLabel = q.scenario_media_type ? `View scenario ${q.scenario_media_type}` : "View scenario attachment";
    return `
      <div class="list-row" style="align-items:flex-start; padding:12px 16px; background:rgba(142,142,147,0.08);">
        <div class="row-content">
          <div style="font-size:12px; text-transform:uppercase; letter-spacing:0.6px; color:var(--text-secondary); font-weight:600;">Scenario</div>
          ${q.scenario_text ? `<div style="font-size:15px; margin-top:6px;">${escapeHtml(q.scenario_text)}</div>` : ''}
          ${q.scenario_media_url ? `<div style="font-size:12px; margin-top:6px;"><a href="${escapeHtml(q.scenario_media_url)}" target="_blank" rel="noopener">${escapeHtml(mediaLabel)}</a></div>` : ''}
        </div>
      </div>
    `;
  };

  return renderPage(`${typeLabel}`, `
    <div class="header">
      <div class="page-subtitle">Question Bank</div>
      <h1 class="page-title" style="font-size:24px;">${typeLabel}</h1>
    </div>

    <div class="list-header" style="display:flex; justify-content:space-between; align-items:center;">
       <span>${questions.results?.length || 0} Questions</span>
       <div class="inline-actions">
         ${type === "board" ? `<button onclick="toggleModal('new-cq-modal', true)" class="btn-text" type="button" aria-label="Add CQ scenario">+ Add CQ</button>` : ''}
         <button onclick="toggleModal('new-q-modal', true)" class="btn-text" type="button" aria-label="Add question">+ Add</button>
       </div>
    </div>

    <div class="inset-list">
       ${questions.results?.map((q, i) => `
          ${renderScenarioBlock(q)}
          <div class="list-row" style="align-items:flex-start; padding:12px 16px;">
             <div style="font-weight:600; font-size:14px; color:var(--text-secondary); margin-right:12px; margin-top:2px;">${i+1}</div>
             <div class="row-content">
                <div style="font-size:15px; margin-bottom:6px;">${escapeHtml(q.question)}</div>
                <div class="inline-actions" style="flex-wrap:wrap;">
                  <span class="badge">${escapeHtml(QUESTION_TYPE_LABELS[q.type] || q.type.toUpperCase())}</span>
                  ${q.cq_label ? `<span class="badge blue">CQ: ${escapeHtml(q.cq_label)}</span>` : ''}
                  ${q.topic_title ? `<span class="badge blue">Topic: ${escapeHtml(q.topic_title)}</span>` : ''}
                  ${q.source_label ? `<span class="badge purple">${escapeHtml(
                    q.type === "board" ? `Board: ${q.source_label}` : q.type === "versity" ? `University: ${q.source_label}` : q.type === "college" ? `College: ${q.source_label}` : q.source_label
                  )}</span>` : ''}
                </div>
                ${q.type === 'mcq' && q.answer ? `<div style="font-size:12px; color:var(--text-secondary); margin-top:6px;">Answer: ${escapeHtml(q.answer)}</div>` : ''}
                ${q.answer && q.type !== 'mcq' && (!q.answer_type || q.answer_type === 'text') ? `<div style="font-size:12px; color:var(--text-secondary); margin-top:6px;">Answer: ${escapeHtml(q.answer)}</div>` : ''}
                ${q.answer_media ? `<div style="font-size:12px; margin-top:6px;"><a href="${escapeHtml(q.answer_media)}" target="_blank" rel="noopener">View ${escapeHtml(q.answer_type || 'answer')}</a></div>` : ''}
             </div>
             <form action="/admin/questions/delete" method="POST" onsubmit="return confirm('Delete?');" style="margin-left:8px;">
               <input type="hidden" name="id" value="${q.id}">
               <input type="hidden" name="chapter_id" value="${chapterId}">
               <input type="hidden" name="type" value="${type || ''}">
               ${topicId ? `<input type="hidden" name="topic_id" value="${topicId}">` : ''}
               <button type="submit" aria-label="Delete question ${escapeHtml(q.question)}" title="Delete question" style="color:var(--danger); font-size:20px;">×</button>
             </form>
          </div>
       `).join('') || '<div style="padding:20px; text-align:center; color:var(--text-secondary);">Empty</div>'}
    </div>

    <!-- New Question Modal -->
    <div id="new-q-modal" class="modal-overlay">
      <div class="modal-card">
        <div class="modal-header">New ${typeLabel}</div>
        <form action="/admin/questions" method="POST" data-question-form ${type ? `data-question-type="${type}"` : ''}>
           <input type="hidden" name="chapter_id" value="${chapterId}">
           ${topicId ? `<input type="hidden" name="topic_id" value="${topicId}">` : ''}
           ${type ? `<input type="hidden" name="type" value="${type}">` : `
             <div class="modal-body" style="padding-bottom:0;">
               <div class="input-group">
                 <select name="type" class="input" onchange="updateQuestionForm(this)">
                   ${QUESTION_TYPE_OPTIONS.map(option => `<option value="${option.value}">${option.label}</option>`).join('')}
                 </select>
               </div>
             </div>
           `}
           <div class="modal-body">
             <div class="input-group">
               <textarea name="question" class="input" required placeholder="Question Text" style="height:60px;"></textarea>
             </div>
             <div class="input-group" data-question-source>
               <input name="source_label" class="input" placeholder="Board / University / College name">
             </div>
             <div data-question-mcq>
               <div class="input-group"><input name="option_a" class="input" placeholder="Option A"></div>
               <div class="input-group"><input name="option_b" class="input" placeholder="Option B"></div>
               <div class="input-group"><input name="option_c" class="input" placeholder="Option C"></div>
               <div class="input-group"><input name="option_d" class="input" placeholder="Option D"></div>
               <div class="input-group"><input name="answer" class="input" placeholder="Correct Answer (e.g. A)"></div>
             </div>
             <div class="input-group" data-question-answer>
               <textarea name="answer" class="input" placeholder="Model Answer / Key Points" style="height:80px;"></textarea>
             </div>
             <div class="input-group" data-question-attachment>
               <select name="answer_type" class="input">
                 <option value="text">Answer as text</option>
                 <option value="image">Answer as image (URL)</option>
                 <option value="pdf">Answer as PDF (URL)</option>
                 <option value="link">Answer as link (URL)</option>
               </select>
             </div>
             <div class="input-group" data-question-attachment>
               <input name="answer_media" class="input" placeholder="Answer URL (image/pdf/link)">
             </div>
           </div>
           <div class="modal-actions">
             <div class="modal-btn" onclick="toggleModal('new-q-modal', false)">Cancel</div>
             <button class="modal-btn">Save</button>
           </div>
        </form>
      </div>
    </div>

    ${type === "board" ? `
    <div id="new-cq-modal" class="modal-overlay">
      <div class="modal-card">
        <div class="modal-header">New CQ Scenario</div>
        <form action="/admin/questions/cq" method="POST">
           <input type="hidden" name="chapter_id" value="${chapterId}">
           <div class="modal-body">
             <div class="input-group">
               <textarea name="scenario_text" class="input" placeholder="Scenario details" style="height:90px;"></textarea>
             </div>
             <div class="input-group">
               <select name="scenario_media_type" class="input">
                 <option value="">No scenario attachment</option>
                 <option value="image">Scenario image (URL)</option>
                 <option value="pdf">Scenario PDF (URL)</option>
                 <option value="link">Scenario link (URL)</option>
               </select>
             </div>
             <div class="input-group">
               <input name="scenario_media_url" class="input" placeholder="Scenario URL (image/pdf/link)">
             </div>
             <div class="input-group">
               <input name="source_label" class="input" required placeholder="Board name">
             </div>
           </div>
           <div class="modal-body" style="border-top:0.5px solid var(--separator);">
             ${["ক", "খ", "গ", "ঘ"].map((label, index) => `
               <div data-cq-question style="padding-bottom:12px; margin-bottom:12px; border-bottom:0.5px solid var(--separator);">
                 <div style="font-weight:600; margin-bottom:8px;">${label} প্রশ্ন</div>
                 <div class="input-group">
                   <textarea name="cq_question_${index + 1}" class="input" required placeholder="Question text" style="height:70px;"></textarea>
                 </div>
                 <div class="input-group form-row">
                   <span class="form-row-label">Scenario related</span>
                   <input type="checkbox" name="cq_related_${index + 1}" value="1" class="toggle" ${index > 1 ? "checked" : ""}>
                 </div>
                 <div class="input-group">
                   <select name="cq_chapter_id_${index + 1}" class="input" required data-cq-chapter>
                     ${(subjectChapters.results || []).map((ch) => `<option value="${ch.id}" ${ch.id === chapterId ? "selected" : ""}>${escapeHtml(ch.name)}</option>`).join('')}
                   </select>
                 </div>
                 <div class="input-group">
                   <select name="cq_topic_id_${index + 1}" class="input" data-cq-topic>
                     <option value="">No topic</option>
                     ${chapterTopics.map((tp) => `<option value="${tp.id}" data-chapter-id="${tp.chapter_id}">${escapeHtml(tp.title)}</option>`).join('')}
                   </select>
                 </div>
               </div>
             `).join('')}
           </div>
           <div class="modal-actions">
             <div class="modal-btn" onclick="toggleModal('new-cq-modal', false)">Cancel</div>
             <button class="modal-btn">Save CQ</button>
           </div>
        </form>
      </div>
    </div>
    ` : ''}
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
async function handleEditTopic(request: Request, env: Env) {
  const fd = await request.formData();
  await env.DB.prepare("UPDATE topics SET title = ?, sort_order = ? WHERE id = ?")
    .bind(fd.get("title"), fd.get("sort_order") || 0, fd.get("id")).run();
  const returnTo = fd.get("return_to");
  if (returnTo) return redirect(returnTo.toString());
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
  const type = fd.get("type") as QuestionRow["type"];
  const sourceLabel = fd.get("source_label")?.toString().trim();
  if (["board", "versity", "college"].includes(type) && !sourceLabel) {
    return new Response("Source name required for board, versity, or college questions.", { status: 400 });
  }
  let options = null;
  if(type === 'mcq') {
    options = JSON.stringify({
      A: fd.get("option_a"), B: fd.get("option_b"), C: fd.get("option_c"), D: fd.get("option_d")
    });
  }
  const cqGroupId = fd.get("cq_group_id")?.toString().trim() || null;
  const cqLabel = fd.get("cq_label")?.toString().trim() || null;
  const cqRelated = fd.get("cq_related") ? 1 : 0;
  const scenarioText = fd.get("scenario_text")?.toString().trim() || null;
  const scenarioMediaUrl = fd.get("scenario_media_url")?.toString().trim() || null;
  const scenarioMediaTypeRaw = fd.get("scenario_media_type")?.toString().trim() || null;
  const scenarioMediaType = scenarioMediaUrl ? scenarioMediaTypeRaw : null;
  const answerType = (fd.get("answer_type")?.toString() || "text") as QuestionRow["answer_type"];
  const answerMedia = fd.get("answer_media")?.toString().trim() || null;
  await env.DB.prepare(`
    INSERT INTO questions (chapter_id, topic_id, type, source_label, question, cq_group_id, cq_label, cq_related, scenario_text, scenario_media_type, scenario_media_url, options, answer, answer_type, answer_media, created_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `).bind(
    fd.get("chapter_id"),
    fd.get("topic_id") || null,
    type,
    sourceLabel || null,
    fd.get("question"),
    cqGroupId,
    cqLabel,
    cqRelated,
    scenarioText,
    scenarioMediaType,
    scenarioMediaUrl,
    options,
    fd.get("answer"),
    answerType,
    answerMedia,
    new Date().toISOString()
  ).run();
  const params = new URLSearchParams({ chapter_id: fd.get("chapter_id") as string });
  const topicId = fd.get("topic_id");
  if (topicId) params.set("topic_id", topicId.toString());
  if (type) params.set("type", type.toString());
  return redirect(`/admin/questions/view?${params.toString()}`);
}

async function handleCreateCqQuestions(request: Request, env: Env) {
  const fd = await request.formData();
  const chapterId = fd.get("chapter_id")?.toString();
  const sourceLabel = fd.get("source_label")?.toString().trim();
  if (!sourceLabel) {
    return new Response("Board name required for CQ questions.", { status: 400 });
  }
  const scenarioText = fd.get("scenario_text")?.toString().trim() || null;
  const scenarioMediaUrl = fd.get("scenario_media_url")?.toString().trim() || null;
  const scenarioMediaTypeRaw = fd.get("scenario_media_type")?.toString().trim() || null;
  const scenarioMediaType = scenarioMediaUrl ? scenarioMediaTypeRaw : null;
  const cqGroupId = crypto.randomUUID();
  const labels = ["ক", "খ", "গ", "ঘ"];

  for (let index = 0; index < labels.length; index += 1) {
    const position = index + 1;
    const question = fd.get(`cq_question_${position}`)?.toString().trim();
    if (!question) continue;
    const questionChapterId = fd.get(`cq_chapter_id_${position}`)?.toString();
    if (!questionChapterId) continue;
    const topicIdRaw = fd.get(`cq_topic_id_${position}`)?.toString();
    const related = fd.get(`cq_related_${position}`) ? 1 : 0;
    await env.DB.prepare(`
      INSERT INTO questions (chapter_id, topic_id, type, source_label, question, cq_group_id, cq_label, cq_related, scenario_text, scenario_media_type, scenario_media_url, sort_order, created_at)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
    `).bind(
      questionChapterId,
      topicIdRaw || null,
      "board",
      sourceLabel,
      question,
      cqGroupId,
      labels[index],
      related,
      related ? scenarioText : null,
      related ? scenarioMediaType : null,
      related ? scenarioMediaUrl : null,
      position,
      new Date().toISOString()
    ).run();
  }

  const params = new URLSearchParams({ chapter_id: chapterId || "" });
  params.set("type", "board");
  return redirect(`/admin/questions/view?${params.toString()}`);
}
async function handleDeleteQuestion(request: Request, env: Env) {
  const fd = await request.formData();
  await env.DB.prepare("DELETE FROM questions WHERE id = ?").bind(fd.get("id")).run();
  const type = fd.get("type");
  const topicId = fd.get("topic_id");
  const params = new URLSearchParams({ chapter_id: fd.get("chapter_id") as string });
  if (topicId) params.set("topic_id", topicId.toString());
  if (type) params.set("type", type.toString());
  return redirect(`/admin/questions/view?${params.toString()}`);
}
