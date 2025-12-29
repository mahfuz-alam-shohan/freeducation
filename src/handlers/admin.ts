import type { Bindings } from '../types';
import { adminLayout, publicLayout, escapeHtml } from '../templates/layout';
import { dbAll, dbFirst, dbRun } from '../utils/db';
import { createSalt, createSession, getSessionAdmin, hashPassword, verifyPassword } from '../utils/auth';
import { hasAnyAdmin } from '../db/schema';

// --- Auth Utilities ---
const parseForm = (form: FormData, key: string) => { const v = form.get(key); return (typeof v === 'string') ? v.trim() : ''; };

// --- LOGIN & SETUP ---
export const renderLogin = () => publicLayout('Instructor Login', `
  <div style="min-height: 80vh; display: flex; align-items: center; justify-content: center;">
    <div class="card" style="width: 100%; max-width: 400px;">
      <h2 style="text-align: center; margin-bottom: 1.5rem; color: var(--primary);">Instructor Portal</h2>
      <form class="stack" method="post" action="/admin/login">
        <div><label>Email</label><input type="email" name="email" required placeholder="admin@freeducation.bd"></div>
        <div><label>Password</label><input type="password" name="password" required></div>
        <button class="btn btn-primary" style="justify-content: center; width: 100%;">Secure Login</button>
      </form>
    </div>
  </div>
`);

export const handleLogin = async (env: Bindings, req: Request) => {
  const form = await req.formData();
  const email = parseForm(form, 'email');
  const password = parseForm(form, 'password');
  const admin = await dbFirst<{id:number, password_hash:string, password_salt:string}>(env, 'SELECT * FROM admins WHERE email=?', email);
  
  if (admin && await verifyPassword(password, admin.password_salt, admin.password_hash)) {
    const session = await createSession(env, admin.id);
    return new Response(null, { status: 302, headers: { Location: '/admin/dashboard', 'Set-Cookie': `session=${session.token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=43200` }});
  }
  return new Response('Invalid credentials', { status: 401 });
};

export const renderSetup = async (env: Bindings) => {
  if (await hasAnyAdmin(env)) return new Response('Admin exists', {status: 403});
  return publicLayout('Setup', `<form method="post" class="container stack" style="max-width:400px; margin-top:4rem;"><h2 class="text-center">System Setup</h2><input name="name" placeholder="Name"><input name="email" placeholder="Email"><input type="password" name="password" placeholder="Password"><button class="btn btn-primary">Create Owner</button></form>`);
};

export const handleSetup = async (env: Bindings, req: Request) => {
  if (await hasAnyAdmin(env)) return new Response('Forbidden', {status: 403});
  const form = await req.formData();
  const salt = createSalt();
  const hash = await hashPassword(parseForm(form, 'password'), salt);
  await dbRun(env, 'INSERT INTO admins (name, email, password_hash, password_salt, created_at) VALUES (?,?,?,?,?)', parseForm(form, 'name'), parseForm(form, 'email'), hash, salt, new Date().toISOString());
  return new Response(null, { status: 302, headers: { Location: '/admin/login' }});
};

// --- DASHBOARD & CLASSES ---
export const renderDashboard = async (env: Bindings, admin: {name: string}) => {
  const stats = await dbFirst<{classes:number, subjects:number, chapters:number}>(env, 
    'SELECT (SELECT COUNT(*) FROM classes) as classes, (SELECT COUNT(*) FROM subjects) as subjects, (SELECT COUNT(*) FROM chapters) as chapters');
  
  const body = `
    <div class="grid-3">
      <div class="card" style="border-left: 4px solid var(--primary);">
        <div class="text-muted">Total Classes</div>
        <div style="font-size: 2rem; font-weight: 700;">${stats?.classes || 0}</div>
      </div>
      <div class="card" style="border-left: 4px solid var(--secondary);">
        <div class="text-muted">Active Subjects</div>
        <div style="font-size: 2rem; font-weight: 700;">${stats?.subjects || 0}</div>
      </div>
      <div class="card" style="border-left: 4px solid var(--accent);">
        <div class="text-muted">Learning Chapters</div>
        <div style="font-size: 2rem; font-weight: 700;">${stats?.chapters || 0}</div>
      </div>
    </div>
    <div class="card" style="margin-top: 2rem;">
      <h3>Quick Actions</h3>
      <div class="grid-3" style="margin-top: 1rem;">
        <a href="/admin/classes" class="btn btn-outline">Manage Classes & Syllabus</a>
        <a href="/" target="_blank" class="btn btn-outline">View Live Site</a>
      </div>
    </div>
  `;
  return adminLayout('Dashboard', body, admin.name, 'dashboard');
};

export const renderClasses = async (env: Bindings, admin: {name:string}) => {
  const classes = await dbAll(env, 'SELECT * FROM classes ORDER BY id DESC');
  const body = `
    <div class="grid-2">
      <div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 1rem;">
          <h3>Academic Classes</h3>
        </div>
        <div class="stack">
          ${classes.map((c: any) => `
            <div class="card" style="display:flex; justify-content:space-between; align-items:center;">
              <div>
                <div style="font-weight:700; font-size: 1.1rem;">${escapeHtml(c.name)}</div>
                <div class="badge badge-blue">${escapeHtml(c.level)}</div>
              </div>
              <a href="/admin/classes/${c.id}/subjects" class="btn btn-primary btn-sm">Manage Subjects →</a>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="card" style="height: fit-content;">
        <h3>Add New Class</h3>
        <form method="post" action="/admin/classes" class="stack" style="margin-top:1rem;">
          <input name="name" placeholder="Class Name (e.g. Class 9-10)" required>
          <input name="level" placeholder="Level (e.g. SSC Science)" required>
          <button class="btn btn-primary">Create Class</button>
        </form>
      </div>
    </div>
  `;
  return adminLayout('Classes', body, admin.name, 'classes');
};

export const renderSubjects = async (env: Bindings, admin: {name:string}, classId: number) => {
  const cls = await dbFirst(env, 'SELECT * FROM classes WHERE id=?', classId) as any;
  const subjects = await dbAll(env, 'SELECT * FROM subjects WHERE class_id=?', classId);
  const body = `
    <div style="margin-bottom: 1.5rem;">
      <a href="/admin/classes" class="text-muted">← Back to Classes</a>
      <h2>${escapeHtml(cls.name)} Subjects</h2>
    </div>
    <div class="grid-2">
      <div class="stack">
        ${subjects.map((s: any) => `
          <div class="card">
            <div style="display:flex; justify-content:space-between;">
              <h3 style="color: var(--primary);">${escapeHtml(s.name)}</h3>
              <a href="/admin/subjects/${s.id}/dashboard" class="btn btn-outline btn-sm">Open Course Manager</a>
            </div>
            <p class="text-muted" style="margin-top:0.5rem;">${escapeHtml(s.description || 'No description')}</p>
          </div>
        `).join('')}
      </div>
      <div class="card" style="height: fit-content;">
        <h3>Add Subject</h3>
        <form method="post" action="/admin/classes/${classId}/subjects" class="stack">
          <input name="name" placeholder="Subject Name (e.g. Higher Math)" required>
          <textarea name="description" placeholder="Description"></textarea>
          <button class="btn btn-primary">Add Subject</button>
        </form>
      </div>
    </div>
  `;
  return adminLayout(`${cls.name} Subjects`, body, admin.name, 'classes');
};

// --- COURSE MANAGER ---
export const renderCourseDashboard = async (env: Bindings, admin: {name:string}, subjectId: number) => {
  const sub = await dbFirst(env, 'SELECT * FROM subjects WHERE id=?', subjectId) as any;
  const chapters = await dbAll(env, 'SELECT * FROM chapters WHERE subject_id=? ORDER BY order_index', subjectId);
  const resources = await dbAll(env, 'SELECT * FROM resources WHERE subject_id=? ORDER BY created_at DESC', subjectId);

  const body = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 2rem;">
      <div>
        <a href="/admin/classes/${sub.class_id}/subjects" class="text-muted">← Back to Subjects</a>
        <h1>${escapeHtml(sub.name)} <span class="badge badge-orange">Course Manager</span></h1>
      </div>
    </div>
    <div class="grid-2">
      <div>
        <h3 style="margin-bottom:1rem;">📖 Syllabus & Chapters</h3>
        <div class="stack">
          ${chapters.map((c: any) => `
            <div class="card" style="border-left: 4px solid var(--primary);">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <div>
                  <div class="text-muted" style="font-size:0.8rem;">Chapter ${c.order_index}</div>
                  <div style="font-weight:700; font-size:1.1rem;">${escapeHtml(c.name)}</div>
                </div>
                <div style="display:flex; gap:0.5rem;">
                   <a href="/admin/chapters/${c.id}/content" class="btn btn-primary btn-sm">Edit Content</a>
                   <a href="/admin/chapters/${c.id}/questions" class="btn btn-outline btn-sm">Question Bank</a>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="card" style="margin-top:1rem; background: var(--slate-50);">
          <h4>Add Chapter</h4>
          <form method="post" action="/admin/subjects/${subjectId}/chapters" style="display:flex; gap:0.5rem; margin-top:0.5rem;">
            <input name="order_index" type="number" placeholder="#" style="width:60px;" value="${chapters.length+1}">
            <input name="name" placeholder="Chapter Title" required>
            <button class="btn btn-primary">Add</button>
          </form>
        </div>
      </div>
      <div>
        <h3 style="margin-bottom:1rem;">📚 Digital Library (PDFs)</h3>
        <div class="card">
          <form method="post" action="/admin/subjects/${subjectId}/resources" enctype="multipart/form-data" class="stack">
            <label>Upload New Resource</label>
            <input name="title" placeholder="Title (e.g. Lecture Sheet 1)" required>
            <select name="category">
              <option value="guide">Lecture Sheet / Guide</option>
              <option value="board_paper">Board Question Paper</option>
              <option value="textbook">Textbook</option>
            </select>
            <input type="file" name="file" required>
            <button class="btn btn-outline">Upload PDF</button>
          </form>
        </div>
        <div class="stack" style="margin-top:1rem;">
           ${resources.map((r: any) => `
             <div style="background:white; padding:0.8rem; border-radius:8px; border:1px solid #e2e8f0; display:flex; justify-content:space-between;">
               <div>
                 <div style="font-weight:600;">${escapeHtml(r.title)}</div>
                 <div class="badge badge-green">${escapeHtml(r.category)}</div>
               </div>
               <a href="/resource/${r.id}" target="_blank" class="btn btn-sm btn-outline">View</a>
             </div>
           `).join('')}
        </div>
      </div>
    </div>
  `;
  return adminLayout(`${sub.name} Manager`, body, admin.name, 'classes');
};

export const renderChapterContent = async (env: Bindings, admin: {name:string}, chapterId: number) => {
  const chapter = await dbFirst(env, 'SELECT * FROM chapters WHERE id=?', chapterId) as any;
  const topics = await dbAll(env, 'SELECT * FROM topics WHERE chapter_id=? ORDER BY order_index', chapterId);
  const contents = await dbAll(env, `SELECT * FROM contents WHERE topic_id IN (SELECT id FROM topics WHERE chapter_id=?)`, chapterId);

  const body = `
    <div style="margin-bottom:2rem;">
       <a href="/admin/subjects/${chapter.subject_id}/dashboard" class="text-muted">← Back to Course</a>
       <h2>${escapeHtml(chapter.name)}: Content Editor</h2>
       <p class="text-muted">Break down the chapter into topics and explanations.</p>
    </div>
    <div class="grid-2">
       <div class="stack">
         ${topics.map((t: any) => {
            const topicContents = contents.filter((c:any) => c.topic_id === t.id);
            return `
            <div class="card">
               <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
                 <h3>${escapeHtml(t.title)}</h3>
                 <form method="post" action="/admin/topics/${t.id}/delete" onsubmit="return confirm('Delete topic?');"><button class="text-muted" style="background:none; border:none; cursor:pointer;">×</button></form>
               </div>
               <div style="margin-bottom:1rem; padding-left:0.5rem; border-left:2px solid #e2e8f0;">
                 ${topicContents.map((c:any) => `
                    <div style="font-size:0.85rem; margin-bottom:0.3rem;">
                       ${c.type === 'explanation' ? '📝 Explanation' : '💡 Short Q&A'} 
                       <span class="text-muted">(${escapeHtml(c.body.substring(0, 30))}...)</span>
                    </div>
                 `).join('')}
               </div>
               <form method="post" action="/admin/topics/${t.id}/contents" class="stack" style="background:#f8fafc; padding:0.8rem; border-radius:8px;">
                 <select name="type" style="padding:0.4rem;">
                   <option value="explanation">Detailed Explanation</option>
                   <option value="short_qa">Short Question (Gyan Mulok)</option>
                   <option value="formula">Key Formula</option>
                 </select>
                 <textarea name="body" placeholder="Write content here..." rows="3"></textarea>
                 <button class="btn btn-sm btn-outline">Add Content Block</button>
               </form>
            </div>
            `;
         }).join('')}
         <div class="card" style="border: 2px dashed #cbd5e1; text-align:center;">
            <h4>Add New Topic</h4>
            <form method="post" action="/admin/chapters/${chapterId}/topics" style="display:flex; gap:0.5rem; margin-top:0.5rem;">
               <input name="title" placeholder="Topic Title" required>
               <input name="order_index" type="number" placeholder="#" style="width:50px;" value="${topics.length+1}">
               <button class="btn btn-primary">Add Topic</button>
            </form>
         </div>
       </div>
    </div>
  `;
  return adminLayout(`Edit Content: ${chapter.name}`, body, admin.name, 'classes');
};

export const renderQuestionBank = async (env: Bindings, admin: {name:string}, chapterId: number) => {
  const chapter = await dbFirst(env, 'SELECT * FROM chapters WHERE id=?', chapterId) as any;
  const questions = await dbAll(env, 'SELECT * FROM questions WHERE chapter_id=? ORDER BY created_at DESC', chapterId);
  const body = `
    <div style="margin-bottom:2rem;">
       <a href="/admin/subjects/${chapter.subject_id}/dashboard" class="text-muted">← Back to Course</a>
       <h2>${escapeHtml(chapter.name)}: Question Bank</h2>
    </div>
    <div class="grid-2">
       <div>
         <h3 style="margin-bottom:1rem;">Existing Questions</h3>
         ${questions.map((q: any) => `
           <div class="question-item" style="background:white; padding:1rem; border:1px solid #e2e8f0; border-radius:8px; margin-bottom:1rem;">
             <div class="badge ${q.type === 'mcq' ? 'badge-blue' : 'badge-green'}">${q.type.toUpperCase()}</div>
             <div style="margin-top:0.5rem; font-weight:500;">${escapeHtml(q.question_text)}</div>
             <div style="margin-top:0.5rem; font-size:0.85rem; color:#64748b;">Solution: ${escapeHtml(q.solution_text || 'N/A')}</div>
           </div>
         `).join('')}
       </div>
       <div class="stack">
         <div class="card">
           <h3>Add MCQ</h3>
           <form method="post" action="/admin/chapters/${chapterId}/questions" class="stack">
             <input type="hidden" name="type" value="mcq">
             <textarea name="question" placeholder="Question Text" required></textarea>
             <input name="option_a" placeholder="Option A" required>
             <input name="option_b" placeholder="Option B" required>
             <input name="option_c" placeholder="Option C" required>
             <input name="option_d" placeholder="Option D" required>
             <select name="correct_answer">
               <option value="A">Answer: A</option>
               <option value="B">Answer: B</option>
               <option value="C">Answer: C</option>
               <option value="D">Answer: D</option>
             </select>
             <textarea name="solution" placeholder="Explanation (Optional)"></textarea>
             <button class="btn btn-primary">Save MCQ</button>
           </form>
         </div>
         <div class="card">
           <h3>Add Creative Question (CQ)</h3>
           <form method="post" action="/admin/chapters/${chapterId}/questions" class="stack">
             <input type="hidden" name="type" value="cq">
             <textarea name="question" placeholder="Stem / Stimulus (Uddipok)" rows="4" required></textarea>
             <textarea name="solution" placeholder="Solution Guidelines" rows="4"></textarea>
             <button class="btn btn-success" style="background:var(--success); color:white; border:none;">Save CQ</button>
           </form>
         </div>
       </div>
    </div>
  `;
  return adminLayout(`QB: ${chapter.name}`, body, admin.name, 'classes');
};

// --- DATA HANDLERS ---
export const handleCreateClass = async (env: Bindings, req: Request) => {
  const form = await req.formData();
  await dbRun(env, 'INSERT INTO classes (name, level, created_at) VALUES (?,?,?)', parseForm(form, 'name'), parseForm(form, 'level'), new Date().toISOString());
  return new Response(null, { status: 302, headers: { Location: '/admin/classes' }});
};
export const handleCreateSubject = async (env: Bindings, req: Request, classId: number) => {
  const form = await req.formData();
  await dbRun(env, 'INSERT INTO subjects (class_id, name, description) VALUES (?,?,?)', classId, parseForm(form, 'name'), parseForm(form, 'description'));
  return new Response(null, { status: 302, headers: { Location: `/admin/classes/${classId}/subjects` }});
};
export const handleCreateChapter = async (env: Bindings, req: Request, subjectId: number) => {
  const form = await req.formData();
  await dbRun(env, 'INSERT INTO chapters (subject_id, name, order_index) VALUES (?,?,?)', subjectId, parseForm(form, 'name'), parseForm(form, 'order_index'));
  return new Response(null, { status: 302, headers: { Location: `/admin/subjects/${subjectId}/dashboard` }});
};
export const handleCreateTopic = async (env: Bindings, req: Request, chapterId: number) => {
  const form = await req.formData();
  await dbRun(env, 'INSERT INTO topics (chapter_id, title, order_index) VALUES (?,?,?)', chapterId, parseForm(form, 'title'), parseForm(form, 'order_index'));
  return new Response(null, { status: 302, headers: { Location: `/admin/chapters/${chapterId}/content` }});
};
export const handleAddContent = async (env: Bindings, req: Request, topicId: number) => {
  const form = await req.formData();
  const t = await dbFirst(env, 'SELECT chapter_id FROM topics WHERE id=?', topicId) as any;
  await dbRun(env, 'INSERT INTO contents (topic_id, type, body) VALUES (?,?,?)', topicId, parseForm(form, 'type'), parseForm(form, 'body'));
  return new Response(null, { status: 302, headers: { Location: `/admin/chapters/${t.chapter_id}/content` }});
};
export const handleAddQuestion = async (env: Bindings, req: Request, chapterId: number) => {
  const form = await req.formData();
  const type = parseForm(form, 'type');
  let options = null;
  if (type === 'mcq') {
    options = JSON.stringify([parseForm(form, 'option_a'), parseForm(form, 'option_b'), parseForm(form, 'option_c'), parseForm(form, 'option_d')]);
  }
  await dbRun(env, 'INSERT INTO questions (chapter_id, type, question_text, options_json, correct_answer, solution_text, created_at) VALUES (?,?,?,?,?,?,?)',
    chapterId, type, parseForm(form, 'question'), options, parseForm(form, 'correct_answer'), parseForm(form, 'solution'), new Date().toISOString());
  return new Response(null, { status: 302, headers: { Location: `/admin/chapters/${chapterId}/questions` }});
};
export const handleUploadResource = async (env: Bindings, req: Request, subjectId: number) => {
  const form = await req.formData();
  const file = form.get('file') as File;
  const key = `res-${subjectId}-${Date.now()}-${file.name}`;
  await env.BUCKET.put(key, await file.arrayBuffer(), { httpMetadata: { contentType: file.type }});
  await dbRun(env, 'INSERT INTO resources (subject_id, category, title, r2_key, mime_type, created_at) VALUES (?,?,?,?,?,?)',
    subjectId, parseForm(form, 'category'), parseForm(form, 'title'), key, file.type, new Date().toISOString());
  return new Response(null, { status: 302, headers: { Location: `/admin/subjects/${subjectId}/dashboard` }});
};


