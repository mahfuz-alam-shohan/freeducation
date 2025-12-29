import type { Bindings } from '../types';
import { adminLayout, escapeHtml, publicLayout } from '../templates/layout';
import { dbAll, dbFirst, dbRun } from '../utils/db';
import { createSalt, createSession, getSessionAdmin, hashPassword, verifyPassword } from '../utils/auth';
import { hasAnyAdmin } from '../db/schema';

const parseFormValue = (form: FormData, key: string) => {
  const value = form.get(key);
  if (!value || typeof value !== 'string') {
    return '';
  }
  return value.trim();
};

// --- AUTH & SETUP ---

export const renderSetup = async (env: Bindings) => {
  if (await hasAnyAdmin(env)) {
    return publicLayout('Setup complete', '<div class="glass-card" style="text-align:center;"><h3>Admin already exists</h3><a href="/admin/login" class="btn btn-primary mt-2">Go to Login</a></div>');
  }
  const body = `
    <div style="max-width: 400px; margin: 0 auto;">
      <h2 class="text-center mb-4">Admin Setup</h2>
      <form class="stack" method="post" action="/admin/setup">
        <label>
          <span class="text-sm font-bold">Name</span>
          <input name="name" required placeholder="Instructor Name" />
        </label>
        <label>
          <span class="text-sm font-bold">Email</span>
          <input type="email" name="email" required placeholder="admin@school.com" />
        </label>
        <label>
          <span class="text-sm font-bold">Password</span>
          <input type="password" name="password" required placeholder="••••••••" />
        </label>
        <button class="btn btn-primary" type="submit">Create Admin Account</button>
      </form>
    </div>
  `;
  return publicLayout('Admin Setup', body);
};

export const handleSetup = async (env: Bindings, request: Request) => {
  if (await hasAnyAdmin(env)) {
    return new Response('Admin already exists', { status: 400 });
  }
  const form = await request.formData();
  const name = parseFormValue(form, 'name');
  const email = parseFormValue(form, 'email');
  const password = parseFormValue(form, 'password');
  if (!name || !email || !password) {
    return new Response('Missing fields', { status: 400 });
  }
  const salt = createSalt();
  const hash = await hashPassword(password, salt);
  await dbRun(
    env,
    'INSERT INTO admins (name, email, password_hash, password_salt, created_at) VALUES (?, ?, ?, ?, ?)',
    name,
    email,
    hash,
    salt,
    new Date().toISOString()
  );
  return new Response(null, {
    status: 302,
    headers: {
      Location: '/admin/login'
    }
  });
};

export const renderLogin = () => {
  const body = `
    <div style="max-width: 400px; margin: 4rem auto;">
      <div class="glass-card">
        <h2 class="text-center mb-4" style="color: var(--primary);">Instructor Login</h2>
        <form class="stack" method="post" action="/admin/login">
          <label>
            <span class="text-sm font-bold">Email</span>
            <input type="email" name="email" required />
          </label>
          <label>
            <span class="text-sm font-bold">Password</span>
            <input type="password" name="password" required />
          </label>
          <button class="btn btn-primary" type="submit">Sign In</button>
        </form>
      </div>
    </div>
  `;
  return publicLayout('Admin Login', body);
};

export const handleLogin = async (env: Bindings, request: Request) => {
  const form = await request.formData();
  const email = parseFormValue(form, 'email');
  const password = parseFormValue(form, 'password');
  const admin = await dbFirst<{
    id: number;
    password_hash: string;
    password_salt: string;
  }>(env, 'SELECT id, password_hash, password_salt FROM admins WHERE email = ?', email);

  if (!admin) {
    return new Response('Invalid credentials', { status: 401 });
  }
  const valid = await verifyPassword(password, admin.password_salt, admin.password_hash);
  if (!valid) {
    return new Response('Invalid credentials', { status: 401 });
  }
  const session = await createSession(env, admin.id);
  return new Response(null, {
    status: 302,
    headers: {
      Location: '/admin/dashboard',
      'Set-Cookie': `session=${session.token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 12}`
    }
  });
};

// --- DASHBOARD & CLASSES ---

export const renderDashboard = async (env: Bindings, adminName: string) => {
  const counts = await Promise.all([
    dbFirst<{ total: number }>(env, 'SELECT COUNT(*) as total FROM classes'),
    dbFirst<{ total: number }>(env, 'SELECT COUNT(*) as total FROM subjects'),
    dbFirst<{ total: number }>(env, 'SELECT COUNT(*) as total FROM chapters'),
    dbFirst<{ total: number }>(env, 'SELECT COUNT(*) as total FROM resources')
  ]);

  const body = `
    <div class="grid-2 mb-4">
      <div class="glass-card" style="background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white;">
        <h3>Welcome, ${escapeHtml(adminName)}</h3>
        <p style="opacity: 0.9;">Manage your digital curriculum efficiently.</p>
      </div>
      <div class="glass-card flex-between">
         <div>
            <div class="text-muted text-sm">Total Classes</div>
            <div style="font-size: 2rem; font-weight: 800; color: var(--primary);">${counts[0]?.total ?? 0}</div>
         </div>
         <div>
            <div class="text-muted text-sm">Subjects</div>
            <div style="font-size: 2rem; font-weight: 800; color: var(--secondary);">${counts[1]?.total ?? 0}</div>
         </div>
         <div>
            <div class="text-muted text-sm">Resources</div>
            <div style="font-size: 2rem; font-weight: 800; color: var(--accent);">${counts[3]?.total ?? 0}</div>
         </div>
      </div>
    </div>
    
    <div class="glass-card">
        <h3>Quick Actions</h3>
        <div class="flex-wrap mt-2">
            <a href="/admin/classes" class="btn btn-primary">Manage Classes</a>
            <a href="/" target="_blank" class="btn btn-soft">View Live Site ↗</a>
        </div>
    </div>
  `;
  return adminLayout('Dashboard', body, adminName);
};

export const renderClasses = async (env: Bindings, adminName: string) => {
  const classes = await dbAll<{ id: number; name: string; level: string; description: string | null }>(
    env,
    'SELECT id, name, level, description FROM classes ORDER BY id DESC'
  );

  const body = `
    <div class="grid-2">
        <div>
            <h3 class="mb-4">All Classes</h3>
            <table class="admin-table">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Level</th>
                    <th style="text-align: right;">Actions</th>
                </tr>
                </thead>
                <tbody>
                ${classes
                    .map(
                    (item) => `
                    <tr>
                    <td>${escapeHtml(item.name)}</td>
                    <td><span class="tag tag-board">${escapeHtml(item.level)}</span></td>
                    <td style="text-align: right;">
                        <a class="btn btn-soft" style="padding: 0.3rem 0.6rem; font-size: 0.8rem;" href="/admin/classes/${item.id}/subjects">Subjects</a>
                        <a class="btn btn-soft" style="padding: 0.3rem 0.6rem; font-size: 0.8rem;" href="/admin/classes/${item.id}/edit">Edit</a>
                    </td>
                    </tr>`
                    )
                    .join('')}
                </tbody>
            </table>
        </div>
        
        <div class="glass-card" style="height: fit-content;">
            <h3>Add New Class</h3>
            <form class="stack mt-2" method="post" action="/admin/classes">
                <input name="name" placeholder="Class Name (e.g. Class 10)" required />
                <input name="level" placeholder="Level (e.g. SSC, HSC)" required />
                <textarea name="description" placeholder="Description..."></textarea>
                <button class="btn btn-primary" type="submit">Create Class</button>
            </form>
        </div>
    </div>
  `;
  return adminLayout('Manage Classes', body, adminName);
};

export const handleCreateClass = async (env: Bindings, request: Request) => {
  const form = await request.formData();
  const name = parseFormValue(form, 'name');
  const level = parseFormValue(form, 'level');
  const description = parseFormValue(form, 'description');
  if (!name || !level) return new Response('Missing fields', { status: 400 });
  
  await dbRun(
    env,
    'INSERT INTO classes (name, level, description, created_at) VALUES (?, ?, ?, ?)',
    name, level, description || null, new Date().toISOString()
  );
  return new Response(null, { status: 302, headers: { Location: '/admin/classes' } });
};

export const renderEditClass = async (env: Bindings, adminName: string, classId: number) => {
  const classRow = await dbFirst<{ id: number; name: string; level: string; description: string | null }>(
    env,
    'SELECT id, name, level, description FROM classes WHERE id = ?',
    classId
  );
  if (!classRow) return adminLayout('Error', 'Class not found', adminName);

  const body = `
    <div style="max-width: 600px;">
        <form class="stack" method="post" action="/admin/classes/${classRow.id}/edit">
            <label>Name <input name="name" value="${escapeHtml(classRow.name)}" required /></label>
            <label>Level <input name="level" value="${escapeHtml(classRow.level)}" required /></label>
            <label>Description <textarea name="description">${escapeHtml(classRow.description ?? '')}</textarea></label>
            
            <div class="flex-between">
                <button class="btn btn-primary" type="submit">Save Changes</button>
                <button class="btn btn-soft" style="color: red; background: #fee2e2;" form="delete-form">Delete Class</button>
            </div>
        </form>
        <form id="delete-form" method="post" action="/admin/classes/${classRow.id}/delete" onsubmit="return confirm('Are you sure?');"></form>
    </div>
  `;
  return adminLayout('Edit Class', body, adminName);
};

export const handleUpdateClass = async (env: Bindings, request: Request, classId: number) => {
  const form = await request.formData();
  const name = parseFormValue(form, 'name');
  const level = parseFormValue(form, 'level');
  const description = parseFormValue(form, 'description');
  if (!name || !level) return new Response('Missing fields', { status: 400 });

  await dbRun(env, 'UPDATE classes SET name = ?, level = ?, description = ? WHERE id = ?', name, level, description || null, classId);
  return new Response(null, { status: 302, headers: { Location: '/admin/classes' } });
};

export const handleDeleteClass = async (env: Bindings, classId: number) => {
  await dbRun(env, 'DELETE FROM classes WHERE id = ?', classId);
  return new Response(null, { status: 302, headers: { Location: '/admin/classes' } });
};

// --- SUBJECTS ---

export const renderSubjects = async (env: Bindings, adminName: string, classId: number) => {
  const classRow = await dbFirst<{ name: string }>(env, 'SELECT name FROM classes WHERE id = ?', classId);
  if (!classRow) return adminLayout('Error', 'Class not found', adminName);

  const subjects = await dbAll<{ id: number; name: string; description: string | null }>(
    env,
    'SELECT id, name, description FROM subjects WHERE class_id = ? ORDER BY id DESC',
    classId
  );

  const body = `
    <div class="flex-between mb-4">
        <h3>Subjects for ${escapeHtml(classRow.name)}</h3>
        <a href="/admin/classes" class="btn btn-soft">Back to Classes</a>
    </div>

    <div class="grid-2">
        <div>
            <table class="admin-table">
                <thead><tr><th>Subject</th><th style="text-align: right;">Manage</th></tr></thead>
                <tbody>
                ${subjects.map((subject) => `
                    <tr>
                    <td>
                        <strong>${escapeHtml(subject.name)}</strong>
                        <div class="text-muted text-sm">${escapeHtml(subject.description ?? '')}</div>
                    </td>
                    <td style="text-align: right;">
                        <a class="btn btn-primary" style="padding: 0.3rem 0.8rem; font-size: 0.8rem;" href="/admin/subjects/${subject.id}/dashboard">Manage Content</a>
                        <a class="btn btn-soft" style="padding: 0.3rem 0.5rem;" href="/admin/subjects/${subject.id}/edit">⚙️</a>
                    </td>
                    </tr>`
                ).join('')}
                </tbody>
            </table>
        </div>
        
        <div class="glass-card" style="height: fit-content;">
            <h3>Add Subject</h3>
            <form class="stack mt-2" method="post" action="/admin/classes/${classId}/subjects">
                <input name="name" placeholder="Subject Name (e.g. Mathematics)" required />
                <textarea name="description" placeholder="Description..."></textarea>
                <button class="btn btn-primary" type="submit">Add Subject</button>
            </form>
        </div>
    </div>
  `;
  return adminLayout('Manage Subjects', body, adminName);
};

export const handleCreateSubject = async (env: Bindings, request: Request, classId: number) => {
  const form = await request.formData();
  const name = parseFormValue(form, 'name');
  const description = parseFormValue(form, 'description');
  if (!name) return new Response('Missing name', { status: 400 });

  await dbRun(env, 'INSERT INTO subjects (class_id, name, description) VALUES (?, ?, ?)', classId, name, description || null);
  return new Response(null, { status: 302, headers: { Location: `/admin/classes/${classId}/subjects` } });
};

export const renderEditSubject = async (env: Bindings, adminName: string, subjectId: number) => {
  const subject = await dbFirst<{ id: number; name: string; description: string | null; class_id: number }>(
    env,
    'SELECT id, name, description, class_id FROM subjects WHERE id = ?',
    subjectId
  );
  if (!subject) return adminLayout('Error', 'Subject not found', adminName);

  const body = `
    <div style="max-width: 600px;">
      <form class="stack" method="post" action="/admin/subjects/${subjectId}/edit">
        <label>Name <input name="name" value="${escapeHtml(subject.name)}" required /></label>
        <label>Description <textarea name="description">${escapeHtml(subject.description ?? '')}</textarea></label>
        <div class="flex-between">
            <button class="btn btn-primary" type="submit">Save Changes</button>
            <button class="btn btn-soft" style="color: red; background: #fee2e2;" form="delete-form">Delete Subject</button>
        </div>
      </form>
      <form id="delete-form" method="post" action="/admin/subjects/${subjectId}/delete" onsubmit="return confirm('Are you sure?');"></form>
    </div>
  `;
  return adminLayout('Edit Subject', body, adminName);
};

export const handleUpdateSubject = async (env: Bindings, request: Request, subjectId: number) => {
  const form = await request.formData();
  const name = parseFormValue(form, 'name');
  const description = parseFormValue(form, 'description');
  if (!name) return new Response('Missing name', { status: 400 });

  const subject = await dbFirst<{class_id: number}>(env, 'SELECT class_id FROM subjects WHERE id=?', subjectId);
  await dbRun(env, 'UPDATE subjects SET name = ?, description = ? WHERE id = ?', name, description || null, subjectId);
  return new Response(null, { status: 302, headers: { Location: `/admin/classes/${subject?.class_id}/subjects` } });
};

export const handleDeleteSubject = async (env: Bindings, subjectId: number) => {
  const subject = await dbFirst<{class_id: number}>(env, 'SELECT class_id FROM subjects WHERE id=?', subjectId);
  await dbRun(env, 'DELETE FROM subjects WHERE id = ?', subjectId);
  return new Response(null, { status: 302, headers: { Location: `/admin/classes/${subject?.class_id}/subjects` } });
};

// --- SUBJECT DASHBOARD (MERGED CHAPTERS + RESOURCES) ---

export const renderSubjectDashboard = async (env: Bindings, adminName: string, subjectId: number) => {
  const subject = await dbFirst<{ name: string; class_id: number }>(env, 'SELECT name, class_id FROM subjects WHERE id = ?', subjectId);
  if (!subject) return adminLayout('Error', 'Subject not found', adminName);

  const chapters = await dbAll<{ id: number; name: string; order_index: number }>(
    env,
    'SELECT id, name, order_index FROM chapters WHERE subject_id = ? ORDER BY order_index ASC',
    subjectId
  );
  
  const resources = await dbAll<{ id: number; title: string; category: string }>(
    env,
    'SELECT id, title, category FROM resources WHERE subject_id = ? ORDER BY id DESC',
    subjectId
  );

  const body = `
    <div class="flex-between mb-4">
        <div>
           <h2 class="text-primary">${escapeHtml(subject.name)} Content Manager</h2>
           <p class="text-muted text-sm">Organize chapters and library assets.</p>
        </div>
        <a href="/admin/classes/${subject.class_id}/subjects" class="btn btn-soft">Back</a>
    </div>

    <div class="grid-2">
       <!-- LEFT: CHAPTERS -->
       <div class="glass-card">
         <h3 class="mb-4">📘 Chapters (Lessons)</h3>
         <form method="post" action="/admin/subjects/${subjectId}/chapters" class="mb-4" style="display: flex; gap: 0.5rem;">
            <input name="name" placeholder="Chapter Name" required style="flex:1;" />
            <input name="order_index" type="number" placeholder="#" style="width: 60px;" value="${chapters.length + 1}" />
            <button class="btn btn-primary">Add</button>
         </form>
         
         <table class="admin-table">
            ${chapters.length === 0 ? '<tr><td class="text-muted">No chapters yet.</td></tr>' : ''}
            ${chapters.map(c => `
               <tr>
                 <td style="width: 30px; color: var(--text-muted);">#${c.order_index}</td>
                 <td>${escapeHtml(c.name)}</td>
                 <td style="text-align: right;">
                    <a href="/admin/chapters/${c.id}/topics" class="btn btn-soft" style="font-size: 0.8rem;">Manage Topics</a>
                    <a href="/admin/chapters/${c.id}/edit" class="btn btn-soft" style="font-size: 0.8rem;">Edit</a>
                 </td>
               </tr>
            `).join('')}
         </table>
       </div>

       <!-- RIGHT: RESOURCES -->
       <div class="glass-card" style="background: #f8fafc;">
         <h3 class="mb-4">📚 Library (Books & Papers)</h3>
         <form method="post" action="/admin/subjects/${subjectId}/resources" enctype="multipart/form-data" class="mb-4 stack">
            <input name="title" placeholder="Title (e.g. Math Textbook 2024)" required />
            <div class="flex-between">
                <select name="category" required style="flex:1; margin-right: 0.5rem;">
                    <option value="textbook">Textbook (NCTB)</option>
                    <option value="board_question">Board Question</option>
                    <option value="guide">Guide Book</option>
                </select>
                <input type="file" name="file" required style="flex:1;" />
            </div>
            <button class="btn btn-secondary" style="background: var(--secondary); color: white;">Upload Resource</button>
         </form>
         
         <table class="admin-table">
            ${resources.length === 0 ? '<tr><td class="text-muted">No resources uploaded.</td></tr>' : ''}
            ${resources.map(r => `
               <tr>
                 <td>
                    <strong>${escapeHtml(r.title)}</strong><br/>
                    <span class="tag" style="font-size: 0.7rem;">${r.category}</span>
                 </td>
                 <td style="text-align: right;">
                    <form method="post" action="/admin/resources/${r.id}/delete" onsubmit="return confirm('Delete this file?');">
                        <button class="btn btn-soft" style="color: red; padding: 0.2rem 0.6rem;">×</button>
                    </form>
                 </td>
               </tr>
            `).join('')}
         </table>
       </div>
    </div>
  `;
  return adminLayout(`Manage ${subject.name}`, body, adminName);
};

// --- RESOURCE HANDLERS ---

export const handleCreateResource = async (env: Bindings, request: Request, subjectId: number) => {
  const form = await request.formData();
  const title = parseFormValue(form, 'title');
  const category = parseFormValue(form, 'category');
  const file = form.get('file');

  if (!title || !category || !(file instanceof File)) return new Response('Bad Request', { status: 400 });

  const buffer = await file.arrayBuffer();
  const key = `res-${subjectId}/${Date.now()}-${file.name}`;
  
  await env.BUCKET.put(key, buffer, {
      httpMetadata: { contentType: file.type || 'application/pdf' }
  });

  await dbRun(
      env,
      'INSERT INTO resources (subject_id, category, title, r2_key, mime_type, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      subjectId, category, title, key, file.type, new Date().toISOString()
  );

  return new Response(null, { status: 302, headers: { Location: `/admin/subjects/${subjectId}/dashboard` } });
};

export const handleDeleteResource = async (env: Bindings, resourceId: number) => {
    const res = await dbFirst<{r2_key: string, subject_id: number}>(env, 'SELECT r2_key, subject_id FROM resources WHERE id = ?', resourceId);
    if(res) {
        await env.BUCKET.delete(res.r2_key);
        await dbRun(env, 'DELETE FROM resources WHERE id = ?', resourceId);
        return new Response(null, { status: 302, headers: { Location: `/admin/subjects/${res.subject_id}/dashboard` } });
    }
    return new Response('Not found', {status: 404});
};

// --- CHAPTERS ---

export const handleCreateChapter = async (env: Bindings, request: Request, subjectId: number) => {
  const form = await request.formData();
  const name = parseFormValue(form, 'name');
  const orderIndex = Number(parseFormValue(form, 'order_index')) || 0;
  
  if (!name) return new Response('Missing name', { status: 400 });

  await dbRun(env, 'INSERT INTO chapters (subject_id, name, order_index) VALUES (?, ?, ?)', subjectId, name, orderIndex);
  return new Response(null, { status: 302, headers: { Location: `/admin/subjects/${subjectId}/dashboard` } });
};

export const renderEditChapter = async (env: Bindings, adminName: string, chapterId: number) => {
  const chapter = await dbFirst<{ id: number; name: string; description: string | null; order_index: number; subject_id: number }>(
    env,
    'SELECT id, name, description, order_index, subject_id FROM chapters WHERE id = ?',
    chapterId
  );
  if (!chapter) return adminLayout('Error', 'Chapter not found', adminName);

  const body = `
    <div style="max-width: 600px;">
        <form class="stack" method="post" action="/admin/chapters/${chapterId}/edit">
            <label>Name <input name="name" value="${escapeHtml(chapter.name)}" required /></label>
            <label>Order <input type="number" name="order_index" value="${chapter.order_index}" /></label>
            <label>Description <textarea name="description">${escapeHtml(chapter.description ?? '')}</textarea></label>
            
            <div class="flex-between">
                <button class="btn btn-primary" type="submit">Update Chapter</button>
                <button class="btn btn-soft" style="color: red; background: #fee2e2;" form="delete-form">Delete Chapter</button>
            </div>
        </form>
        <form id="delete-form" method="post" action="/admin/chapters/${chapterId}/delete" onsubmit="return confirm('Delete this chapter and all topics?');"></form>
    </div>
  `;
  return adminLayout('Edit Chapter', body, adminName);
};

export const handleUpdateChapter = async (env: Bindings, request: Request, chapterId: number) => {
  const form = await request.formData();
  const name = parseFormValue(form, 'name');
  const description = parseFormValue(form, 'description');
  const orderIndex = Number(parseFormValue(form, 'order_index')) || 0;
  
  if (!name) return new Response('Missing name', { status: 400 });

  const chapter = await dbFirst<{subject_id: number}>(env, 'SELECT subject_id FROM chapters WHERE id=?', chapterId);
  await dbRun(env, 'UPDATE chapters SET name = ?, description = ?, order_index = ? WHERE id = ?', name, description || null, orderIndex, chapterId);
  
  return new Response(null, { status: 302, headers: { Location: `/admin/subjects/${chapter?.subject_id}/dashboard` } });
};

export const handleDeleteChapter = async (env: Bindings, chapterId: number) => {
  const chapter = await dbFirst<{subject_id: number}>(env, 'SELECT subject_id FROM chapters WHERE id=?', chapterId);
  await dbRun(env, 'DELETE FROM chapters WHERE id = ?', chapterId);
  return new Response(null, { status: 302, headers: { Location: `/admin/subjects/${chapter?.subject_id}/dashboard` } });
};

// --- TOPICS (LESSONS) ---

export const renderTopics = async (env: Bindings, adminName: string, chapterId: number) => {
  const chapter = await dbFirst<{ name: string; subject_id: number }>(env, 'SELECT name, subject_id FROM chapters WHERE id = ?', chapterId);
  if (!chapter) return adminLayout('Error', 'Chapter not found', adminName);

  const topics = await dbAll<{ id: number; title: string; type: string; order_index: number }>(
    env,
    'SELECT id, title, type, order_index FROM topics WHERE chapter_id = ? ORDER BY order_index ASC',
    chapterId
  );

  const body = `
    <div class="flex-between mb-4">
        <h3>Topics in ${escapeHtml(chapter.name)}</h3>
        <a href="/admin/subjects/${chapter.subject_id}/dashboard" class="btn btn-soft">Back to Subject</a>
    </div>

    <div class="grid-2">
        <div>
            <table class="admin-table">
                <thead><tr><th>Order</th><th>Title</th><th>Type</th><th style="text-align: right;">Actions</th></tr></thead>
                <tbody>
                ${topics.map(t => `
                    <tr>
                    <td>${t.order_index}</td>
                    <td>${escapeHtml(t.title)}</td>
                    <td><span class="tag" style="font-size: 0.7rem;">${t.type || 'note'}</span></td>
                    <td style="text-align: right;">
                        <a href="/admin/topics/${t.id}/files" class="btn btn-soft" style="font-size: 0.8rem;">Files</a>
                        <a href="/admin/topics/${t.id}/edit" class="btn btn-soft" style="font-size: 0.8rem;">Edit</a>
                    </td>
                    </tr>
                `).join('')}
                </tbody>
            </table>
        </div>

        <div class="glass-card" style="height: fit-content;">
            <h3>Add Topic</h3>
            <form class="stack mt-2" method="post" action="/admin/chapters/${chapterId}/topics">
                <input name="title" placeholder="Topic Title (e.g. Newton's 2nd Law)" required />
                <select name="type">
                    <option value="note">Standard Note</option>
                    <option value="math_solution">Math Solution</option>
                    <option value="cq_practice">Creative Question</option>
                </select>
                <textarea name="content" placeholder="Summary or Main Content..."></textarea>
                <input type="number" name="order_index" value="${topics.length + 1}" placeholder="Order" />
                <button class="btn btn-primary">Create Topic</button>
            </form>
        </div>
    </div>
  `;
  return adminLayout(`Topics: ${chapter.name}`, body, adminName);
};

export const handleCreateTopic = async (env: Bindings, request: Request, chapterId: number) => {
  const form = await request.formData();
  const title = parseFormValue(form, 'title');
  const type = parseFormValue(form, 'type');
  const content = parseFormValue(form, 'content');
  const orderIndex = Number(parseFormValue(form, 'order_index')) || 0;

  if (!title) return new Response('Missing title', { status: 400 });

  await dbRun(
    env,
    'INSERT INTO topics (chapter_id, title, content, type, order_index, created_at) VALUES (?, ?, ?, ?, ?, ?)',
    chapterId, title, content || null, type || 'note', orderIndex, new Date().toISOString()
  );
  return new Response(null, { status: 302, headers: { Location: `/admin/chapters/${chapterId}/topics` } });
};

export const renderEditTopic = async (env: Bindings, adminName: string, topicId: number) => {
  const topic = await dbFirst<{ id: number; title: string; content: string | null; type: string; order_index: number }>(
    env,
    'SELECT id, title, content, type, order_index FROM topics WHERE id = ?',
    topicId
  );
  if (!topic) return adminLayout('Error', 'Topic not found', adminName);

  const body = `
    <div style="max-width: 800px;">
        <form class="stack" method="post" action="/admin/topics/${topicId}/edit">
            <label>Title <input name="title" value="${escapeHtml(topic.title)}" required /></label>
            <label>Type 
                <select name="type">
                    <option value="note" ${topic.type === 'note' ? 'selected' : ''}>Standard Note</option>
                    <option value="math_solution" ${topic.type === 'math_solution' ? 'selected' : ''}>Math Solution</option>
                    <option value="cq_practice" ${topic.type === 'cq_practice' ? 'selected' : ''}>Creative Question</option>
                </select>
            </label>
            <label>Order <input type="number" name="order_index" value="${topic.order_index}" /></label>
            <label>Content <textarea name="content" style="min-height: 200px;">${escapeHtml(topic.content ?? '')}</textarea></label>
            
            <div class="flex-between">
                <button class="btn btn-primary" type="submit">Update Topic</button>
                <button class="btn btn-soft" style="color: red; background: #fee2e2;" form="delete-form">Delete Topic</button>
            </div>
        </form>
        <form id="delete-form" method="post" action="/admin/topics/${topicId}/delete" onsubmit="return confirm('Delete this topic?');"></form>
    </div>
  `;
  return adminLayout('Edit Topic', body, adminName);
};

export const handleUpdateTopic = async (env: Bindings, request: Request, topicId: number) => {
  const form = await request.formData();
  const title = parseFormValue(form, 'title');
  const type = parseFormValue(form, 'type');
  const content = parseFormValue(form, 'content');
  const orderIndex = Number(parseFormValue(form, 'order_index')) || 0;

  const topic = await dbFirst<{chapter_id: number}>(env, 'SELECT chapter_id FROM topics WHERE id=?', topicId);

  await dbRun(
    env,
    'UPDATE topics SET title = ?, content = ?, type = ?, order_index = ? WHERE id = ?',
    title, content || null, type, orderIndex, topicId
  );
  return new Response(null, { status: 302, headers: { Location: `/admin/chapters/${topic?.chapter_id}/topics` } });
};

export const handleDeleteTopic = async (env: Bindings, topicId: number) => {
  const topic = await dbFirst<{chapter_id: number}>(env, 'SELECT chapter_id FROM topics WHERE id=?', topicId);
  await dbRun(env, 'DELETE FROM topics WHERE id = ?', topicId);
  return new Response(null, { status: 302, headers: { Location: `/admin/chapters/${topic?.chapter_id}/topics` } });
};

// --- FILES FOR TOPICS ---

export const renderFiles = async (env: Bindings, adminName: string, topicId: number) => {
  const topic = await dbFirst<{ title: string; chapter_id: number }>(env, 'SELECT title, chapter_id FROM topics WHERE id = ?', topicId);
  if (!topic) return adminLayout('Error', 'Topic not found', adminName);

  const files = await dbAll<{ id: number; title: string; size: number }>(
    env,
    'SELECT id, title, size FROM files WHERE topic_id = ? ORDER BY id DESC',
    topicId
  );

  const body = `
    <div class="flex-between mb-4">
        <h3>Files for: ${escapeHtml(topic.title)}</h3>
        <a href="/admin/chapters/${topic.chapter_id}/topics" class="btn btn-soft">Back to Topics</a>
    </div>

    <div class="grid-2">
        <div class="glass-card">
            <h4 class="mb-4">Upload File</h4>
            <form class="stack" method="post" action="/admin/topics/${topicId}/files" enctype="multipart/form-data">
                <input name="title" placeholder="File Display Name" required />
                <input type="file" name="file" required />
                <button class="btn btn-primary">Upload</button>
            </form>
        </div>

        <div>
            <table class="admin-table">
                <thead><tr><th>File</th><th>Size</th><th>Action</th></tr></thead>
                <tbody>
                ${files.map(f => `
                    <tr>
                        <td>${escapeHtml(f.title)}</td>
                        <td>${Math.round(f.size / 1024)} KB</td>
                        <td>
                            <form method="post" action="/admin/files/${f.id}/delete">
                                <button class="btn btn-soft" style="color: red; padding: 0.2rem 0.6rem;">Delete</button>
                            </form>
                        </td>
                    </tr>
                `).join('')}
                </tbody>
            </table>
        </div>
    </div>
  `;
  return adminLayout('Manage Files', body, adminName);
};

export const handleUploadFile = async (env: Bindings, request: Request, topicId: number) => {
  const form = await request.formData();
  const title = parseFormValue(form, 'title');
  const file = form.get('file');
  if (!title || !(file instanceof File)) return new Response('Missing file', { status: 400 });

  const buffer = await file.arrayBuffer();
  const key = `topic-${topicId}/${Date.now()}-${file.name}`;
  
  await env.BUCKET.put(key, buffer, { httpMetadata: { contentType: file.type || 'application/octet-stream' } });
  
  await dbRun(
    env,
    'INSERT INTO files (topic_id, title, r2_key, mime_type, size, created_at) VALUES (?, ?, ?, ?, ?, ?)',
    topicId, title, key, file.type || null, buffer.byteLength, new Date().toISOString()
  );
  return new Response(null, { status: 302, headers: { Location: `/admin/topics/${topicId}/files` } });
};

export const handleDeleteFile = async (env: Bindings, fileId: number) => {
  const file = await dbFirst<{ r2_key: string; topic_id: number }>(env, 'SELECT r2_key, topic_id FROM files WHERE id = ?', fileId);
  if (file) {
    if (file.r2_key) await env.BUCKET.delete(file.r2_key);
    await dbRun(env, 'DELETE FROM files WHERE id = ?', fileId);
    return new Response(null, { status: 302, headers: { Location: `/admin/topics/${file.topic_id}/files` } });
  }
  return new Response('File not found', { status: 404 });
};

// --- AUTH HELPER ---

export const requireAdmin = async (env: Bindings, request: Request) => {
  const cookieHeader = request.headers.get('Cookie');
  const sessionToken = cookieHeader
    ?.split(';')
    .map((chunk) => chunk.trim())
    .find((chunk) => chunk.startsWith('session='))
    ?.split('=')[1];
  const admin = await getSessionAdmin(env, sessionToken);
  return { admin, sessionToken };
};
