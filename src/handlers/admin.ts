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

export const renderSetup = async (env: Bindings) => {
  if (await hasAnyAdmin(env)) {
    return publicLayout('Setup complete', '<div class="alert">Admin already exists. Go to login.</div>');
  }
  const body = `
    <section class="card">
      <h2>Create the first admin</h2>
      <form class="form" method="post" action="/admin/setup">
        <label>
          Name
          <input name="name" required />
        </label>
        <label>
          Email
          <input type="email" name="email" required />
        </label>
        <label>
          Password
          <input type="password" name="password" required />
        </label>
        <button class="button" type="submit">Create admin</button>
      </form>
    </section>
  `;
  return publicLayout('Admin setup', body);
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
    <section class="card">
      <h2>Admin login</h2>
      <form class="form" method="post" action="/admin/login">
        <label>
          Email
          <input type="email" name="email" required />
        </label>
        <label>
          Password
          <input type="password" name="password" required />
        </label>
        <button class="button" type="submit">Sign in</button>
      </form>
    </section>
  `;
  return publicLayout('Admin login', body);
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

export const renderDashboard = async (env: Bindings, adminName: string) => {
  const counts = await Promise.all([
    dbFirst<{ total: number }>(env, 'SELECT COUNT(*) as total FROM classes'),
    dbFirst<{ total: number }>(env, 'SELECT COUNT(*) as total FROM subjects'),
    dbFirst<{ total: number }>(env, 'SELECT COUNT(*) as total FROM chapters'),
    dbFirst<{ total: number }>(env, 'SELECT COUNT(*) as total FROM topics')
  ]);

  const body = `
    <section class="card">
      <h2>Welcome back, ${escapeHtml(adminName)}</h2>
      <p class="muted">Keep the LMS organized by adding classes, subjects, chapters, topics, and files.</p>
    </section>
    <section class="grid two">
      <div class="card">
        <h3>Classes</h3>
        <p class="badge">${counts[0]?.total ?? 0} total</p>
        <a class="button" href="/admin/classes">Manage classes</a>
      </div>
      <div class="card">
        <h3>Subjects</h3>
        <p class="badge">${counts[1]?.total ?? 0} total</p>
        <a class="button" href="/admin/classes">Go to classes</a>
      </div>
      <div class="card">
        <h3>Chapters</h3>
        <p class="badge">${counts[2]?.total ?? 0} total</p>
        <a class="button" href="/admin/classes">Go to classes</a>
      </div>
      <div class="card">
        <h3>Topics</h3>
        <p class="badge">${counts[3]?.total ?? 0} total</p>
        <a class="button" href="/admin/classes">Go to classes</a>
      </div>
    </section>
  `;
  return adminLayout('Dashboard', body, adminName);
};

export const renderClasses = async (env: Bindings, adminName: string) => {
  const classes = await dbAll<{ id: number; name: string; level: string; description: string | null }>(
    env,
    'SELECT id, name, level, description FROM classes ORDER BY id DESC'
  );

  const body = `
    <section class="card">
      <h2>Classes</h2>
      <form class="form" method="post" action="/admin/classes">
        <label>
          Class name
          <input name="name" required />
        </label>
        <label>
          Level (e.g., Class 6, SSC, HSC)
          <input name="level" required />
        </label>
        <label>
          Description
          <textarea name="description"></textarea>
        </label>
        <button class="button" type="submit">Add class</button>
      </form>
    </section>
    <section class="card">
      <table class="table">
        <thead>
          <tr>
            <th>Class</th>
            <th>Level</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${classes
            .map(
              (item) => `
            <tr>
              <td>${escapeHtml(item.name)}</td>
              <td>${escapeHtml(item.level)}</td>
              <td>
                <a class="button outline" href="/admin/classes/${item.id}/subjects">Subjects</a>
                <a class="button outline" href="/admin/classes/${item.id}/edit">Edit</a>
                <form method="post" action="/admin/classes/${item.id}/delete" style="display:inline">
                  <button class="button secondary" type="submit">Delete</button>
                </form>
              </td>
            </tr>`
            )
            .join('')}
        </tbody>
      </table>
    </section>
  `;
  return adminLayout('Classes', body, adminName);
};

export const handleCreateClass = async (env: Bindings, request: Request) => {
  const form = await request.formData();
  const name = parseFormValue(form, 'name');
  const level = parseFormValue(form, 'level');
  const description = parseFormValue(form, 'description');
  if (!name || !level) {
    return new Response('Missing fields', { status: 400 });
  }
  await dbRun(
    env,
    'INSERT INTO classes (name, level, description, created_at) VALUES (?, ?, ?, ?)',
    name,
    level,
    description || null,
    new Date().toISOString()
  );
  return new Response(null, { status: 302, headers: { Location: '/admin/classes' } });
};

export const renderEditClass = async (env: Bindings, adminName: string, classId: number) => {
  const classRow = await dbFirst<{ id: number; name: string; level: string; description: string | null }>(
    env,
    'SELECT id, name, level, description FROM classes WHERE id = ?',
    classId
  );
  if (!classRow) {
    return adminLayout('Class not found', '<div class="alert">Class not found.</div>', adminName);
  }
  const body = `
    <section class="card">
      <h2>Edit class</h2>
      <form class="form" method="post" action="/admin/classes/${classRow.id}/edit">
        <label>
          Class name
          <input name="name" value="${escapeHtml(classRow.name)}" required />
        </label>
        <label>
          Level
          <input name="level" value="${escapeHtml(classRow.level)}" required />
        </label>
        <label>
          Description
          <textarea name="description">${escapeHtml(classRow.description ?? '')}</textarea>
        </label>
        <button class="button" type="submit">Save changes</button>
      </form>
    </section>
  `;
  return adminLayout('Edit class', body, adminName);
};

export const handleUpdateClass = async (env: Bindings, request: Request, classId: number) => {
  const form = await request.formData();
  const name = parseFormValue(form, 'name');
  const level = parseFormValue(form, 'level');
  const description = parseFormValue(form, 'description');
  if (!name || !level) {
    return new Response('Missing fields', { status: 400 });
  }
  await dbRun(
    env,
    'UPDATE classes SET name = ?, level = ?, description = ? WHERE id = ?',
    name,
    level,
    description || null,
    classId
  );
  return new Response(null, { status: 302, headers: { Location: '/admin/classes' } });
};

export const handleDeleteClass = async (env: Bindings, classId: number) => {
  await dbRun(env, 'DELETE FROM classes WHERE id = ?', classId);
  return new Response(null, { status: 302, headers: { Location: '/admin/classes' } });
};

export const renderSubjects = async (env: Bindings, adminName: string, classId: number) => {
  const classRow = await dbFirst<{ name: string }>(env, 'SELECT name FROM classes WHERE id = ?', classId);
  if (!classRow) {
    return adminLayout('Class not found', '<div class="alert">Class not found.</div>', adminName);
  }
  const subjects = await dbAll<{ id: number; name: string; description: string | null }>(
    env,
    'SELECT id, name, description FROM subjects WHERE class_id = ? ORDER BY id DESC',
    classId
  );
  const body = `
    <section class="card">
      <h2>Subjects for ${escapeHtml(classRow.name)}</h2>
      <form class="form" method="post" action="/admin/classes/${classId}/subjects">
        <label>
          Subject name
          <input name="name" required />
        </label>
        <label>
          Description
          <textarea name="description"></textarea>
        </label>
        <button class="button" type="submit">Add subject</button>
      </form>
    </section>
    <section class="card">
      <table class="table">
        <thead>
          <tr>
            <th>Subject</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${subjects
            .map(
              (subject) => `
            <tr>
              <td>
                <strong>${escapeHtml(subject.name)}</strong>
                <div class="muted">${escapeHtml(subject.description ?? 'No description')}</div>
              </td>
              <td>
                <a class="button outline" href="/admin/subjects/${subject.id}/chapters">Chapters</a>
                <a class="button outline" href="/admin/subjects/${subject.id}/edit">Edit</a>
                <form method="post" action="/admin/subjects/${subject.id}/delete" style="display:inline">
                  <button class="button secondary" type="submit">Delete</button>
                </form>
              </td>
            </tr>`
            )
            .join('')}
        </tbody>
      </table>
    </section>
  `;
  return adminLayout('Subjects', body, adminName);
};

export const handleCreateSubject = async (env: Bindings, request: Request, classId: number) => {
  const form = await request.formData();
  const name = parseFormValue(form, 'name');
  const description = parseFormValue(form, 'description');
  if (!name) {
    return new Response('Missing subject name', { status: 400 });
  }
  await dbRun(env, 'INSERT INTO subjects (class_id, name, description) VALUES (?, ?, ?)', classId, name, description || null);
  return new Response(null, { status: 302, headers: { Location: `/admin/classes/${classId}/subjects` } });
};

export const renderEditSubject = async (env: Bindings, adminName: string, subjectId: number) => {
  const subject = await dbFirst<{ id: number; name: string; description: string | null }>(
    env,
    'SELECT id, name, description FROM subjects WHERE id = ?',
    subjectId
  );
  if (!subject) {
    return adminLayout('Subject not found', '<div class="alert">Subject not found.</div>', adminName);
  }
  const body = `
    <section class="card">
      <h2>Edit subject</h2>
      <form class="form" method="post" action="/admin/subjects/${subjectId}/edit">
        <label>
          Subject name
          <input name="name" value="${escapeHtml(subject.name)}" required />
        </label>
        <label>
          Description
          <textarea name="description">${escapeHtml(subject.description ?? '')}</textarea>
        </label>
        <button class="button" type="submit">Save changes</button>
      </form>
    </section>
  `;
  return adminLayout('Edit subject', body, adminName);
};

export const handleUpdateSubject = async (env: Bindings, request: Request, subjectId: number) => {
  const form = await request.formData();
  const name = parseFormValue(form, 'name');
  const description = parseFormValue(form, 'description');
  if (!name) {
    return new Response('Missing subject name', { status: 400 });
  }
  await dbRun(env, 'UPDATE subjects SET name = ?, description = ? WHERE id = ?', name, description || null, subjectId);
  return new Response(null, { status: 302, headers: { Location: `/admin/subjects/${subjectId}/chapters` } });
};

export const handleDeleteSubject = async (env: Bindings, subjectId: number) => {
  await dbRun(env, 'DELETE FROM subjects WHERE id = ?', subjectId);
  return new Response(null, { status: 302, headers: { Location: '/admin/classes' } });
};

export const renderChapters = async (env: Bindings, adminName: string, subjectId: number) => {
  const subject = await dbFirst<{ name: string }>(env, 'SELECT name FROM subjects WHERE id = ?', subjectId);
  if (!subject) {
    return adminLayout('Subject not found', '<div class="alert">Subject not found.</div>', adminName);
  }
  const chapters = await dbAll<{ id: number; name: string; description: string | null; order_index: number | null }>(
    env,
    'SELECT id, name, description, order_index FROM chapters WHERE subject_id = ? ORDER BY order_index ASC, id ASC',
    subjectId
  );
  const body = `
    <section class="card">
      <h2>Chapters for ${escapeHtml(subject.name)}</h2>
      <form class="form" method="post" action="/admin/subjects/${subjectId}/chapters">
        <label>
          Chapter name
          <input name="name" required />
        </label>
        <label>
          Order index
          <input type="number" name="order_index" value="0" />
        </label>
        <label>
          Description
          <textarea name="description"></textarea>
        </label>
        <button class="button" type="submit">Add chapter</button>
      </form>
    </section>
    <section class="card">
      <table class="table">
        <thead>
          <tr>
            <th>Chapter</th>
            <th>Order</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${chapters
            .map(
              (chapter) => `
            <tr>
              <td>
                <strong>${escapeHtml(chapter.name)}</strong>
                <div class="muted">${escapeHtml(chapter.description ?? 'No description')}</div>
              </td>
              <td>${chapter.order_index ?? 0}</td>
              <td>
                <a class="button outline" href="/admin/chapters/${chapter.id}/topics">Topics</a>
                <a class="button outline" href="/admin/chapters/${chapter.id}/edit">Edit</a>
                <form method="post" action="/admin/chapters/${chapter.id}/delete" style="display:inline">
                  <button class="button secondary" type="submit">Delete</button>
                </form>
              </td>
            </tr>`
            )
            .join('')}
        </tbody>
      </table>
    </section>
  `;
  return adminLayout('Chapters', body, adminName);
};

export const handleCreateChapter = async (env: Bindings, request: Request, subjectId: number) => {
  const form = await request.formData();
  const name = parseFormValue(form, 'name');
  const description = parseFormValue(form, 'description');
  const orderIndex = Number.parseInt(parseFormValue(form, 'order_index'), 10) || 0;
  if (!name) {
    return new Response('Missing chapter name', { status: 400 });
  }
  await dbRun(
    env,
    'INSERT INTO chapters (subject_id, name, description, order_index) VALUES (?, ?, ?, ?)',
    subjectId,
    name,
    description || null,
    orderIndex
  );
  return new Response(null, { status: 302, headers: { Location: `/admin/subjects/${subjectId}/chapters` } });
};

export const renderEditChapter = async (env: Bindings, adminName: string, chapterId: number) => {
  const chapter = await dbFirst<{ id: number; name: string; description: string | null; order_index: number | null }>(
    env,
    'SELECT id, name, description, order_index FROM chapters WHERE id = ?',
    chapterId
  );
  if (!chapter) {
    return adminLayout('Chapter not found', '<div class="alert">Chapter not found.</div>', adminName);
  }
  const body = `
    <section class="card">
      <h2>Edit chapter</h2>
      <form class="form" method="post" action="/admin/chapters/${chapterId}/edit">
        <label>
          Chapter name
          <input name="name" value="${escapeHtml(chapter.name)}" required />
        </label>
        <label>
          Order index
          <input type="number" name="order_index" value="${chapter.order_index ?? 0}" />
        </label>
        <label>
          Description
          <textarea name="description">${escapeHtml(chapter.description ?? '')}</textarea>
        </label>
        <button class="button" type="submit">Save changes</button>
      </form>
    </section>
  `;
  return adminLayout('Edit chapter', body, adminName);
};

export const handleUpdateChapter = async (env: Bindings, request: Request, chapterId: number) => {
  const form = await request.formData();
  const name = parseFormValue(form, 'name');
  const description = parseFormValue(form, 'description');
  const orderIndex = Number.parseInt(parseFormValue(form, 'order_index'), 10) || 0;
  if (!name) {
    return new Response('Missing chapter name', { status: 400 });
  }
  await dbRun(
    env,
    'UPDATE chapters SET name = ?, description = ?, order_index = ? WHERE id = ?',
    name,
    description || null,
    orderIndex,
    chapterId
  );
  return new Response(null, { status: 302, headers: { Location: `/admin/chapters/${chapterId}/topics` } });
};

export const handleDeleteChapter = async (env: Bindings, chapterId: number) => {
  await dbRun(env, 'DELETE FROM chapters WHERE id = ?', chapterId);
  return new Response(null, { status: 302, headers: { Location: '/admin/classes' } });
};

export const renderTopics = async (env: Bindings, adminName: string, chapterId: number) => {
  const chapter = await dbFirst<{ name: string }>(env, 'SELECT name FROM chapters WHERE id = ?', chapterId);
  if (!chapter) {
    return adminLayout('Chapter not found', '<div class="alert">Chapter not found.</div>', adminName);
  }
  const topics = await dbAll<{ id: number; title: string; content: string | null; order_index: number | null }>(
    env,
    'SELECT id, title, content, order_index FROM topics WHERE chapter_id = ? ORDER BY order_index ASC, id ASC',
    chapterId
  );
  const body = `
    <section class="card">
      <h2>Topics for ${escapeHtml(chapter.name)}</h2>
      <form class="form" method="post" action="/admin/chapters/${chapterId}/topics">
        <label>
          Topic title
          <input name="title" required />
        </label>
        <label>
          Order index
          <input type="number" name="order_index" value="0" />
        </label>
        <label>
          Content or summary
          <textarea name="content"></textarea>
        </label>
        <button class="button" type="submit">Add topic</button>
      </form>
    </section>
    <section class="card">
      <table class="table">
        <thead>
          <tr>
            <th>Topic</th>
            <th>Order</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${topics
            .map(
              (topic) => `
            <tr>
              <td>
                <strong>${escapeHtml(topic.title)}</strong>
                <div class="muted">${escapeHtml(topic.content ?? 'No summary')}</div>
              </td>
              <td>${topic.order_index ?? 0}</td>
              <td>
                <a class="button outline" href="/admin/topics/${topic.id}/files">Files</a>
                <a class="button outline" href="/admin/topics/${topic.id}/edit">Edit</a>
                <form method="post" action="/admin/topics/${topic.id}/delete" style="display:inline">
                  <button class="button secondary" type="submit">Delete</button>
                </form>
              </td>
            </tr>`
            )
            .join('')}
        </tbody>
      </table>
    </section>
  `;
  return adminLayout('Topics', body, adminName);
};

export const handleCreateTopic = async (env: Bindings, request: Request, chapterId: number) => {
  const form = await request.formData();
  const title = parseFormValue(form, 'title');
  const content = parseFormValue(form, 'content');
  const orderIndex = Number.parseInt(parseFormValue(form, 'order_index'), 10) || 0;
  if (!title) {
    return new Response('Missing topic title', { status: 400 });
  }
  await dbRun(
    env,
    'INSERT INTO topics (chapter_id, title, content, order_index, created_at) VALUES (?, ?, ?, ?, ?)',
    chapterId,
    title,
    content || null,
    orderIndex,
    new Date().toISOString()
  );
  return new Response(null, { status: 302, headers: { Location: `/admin/chapters/${chapterId}/topics` } });
};

export const renderEditTopic = async (env: Bindings, adminName: string, topicId: number) => {
  const topic = await dbFirst<{ id: number; title: string; content: string | null; order_index: number | null }>(
    env,
    'SELECT id, title, content, order_index FROM topics WHERE id = ?',
    topicId
  );
  if (!topic) {
    return adminLayout('Topic not found', '<div class="alert">Topic not found.</div>', adminName);
  }
  const body = `
    <section class="card">
      <h2>Edit topic</h2>
      <form class="form" method="post" action="/admin/topics/${topicId}/edit">
        <label>
          Topic title
          <input name="title" value="${escapeHtml(topic.title)}" required />
        </label>
        <label>
          Order index
          <input type="number" name="order_index" value="${topic.order_index ?? 0}" />
        </label>
        <label>
          Content
          <textarea name="content">${escapeHtml(topic.content ?? '')}</textarea>
        </label>
        <button class="button" type="submit">Save changes</button>
      </form>
    </section>
  `;
  return adminLayout('Edit topic', body, adminName);
};

export const handleUpdateTopic = async (env: Bindings, request: Request, topicId: number) => {
  const form = await request.formData();
  const title = parseFormValue(form, 'title');
  const content = parseFormValue(form, 'content');
  const orderIndex = Number.parseInt(parseFormValue(form, 'order_index'), 10) || 0;
  if (!title) {
    return new Response('Missing topic title', { status: 400 });
  }
  await dbRun(
    env,
    'UPDATE topics SET title = ?, content = ?, order_index = ? WHERE id = ?',
    title,
    content || null,
    orderIndex,
    topicId
  );
  return new Response(null, { status: 302, headers: { Location: `/admin/topics/${topicId}/files` } });
};

export const handleDeleteTopic = async (env: Bindings, topicId: number) => {
  await dbRun(env, 'DELETE FROM topics WHERE id = ?', topicId);
  return new Response(null, { status: 302, headers: { Location: '/admin/classes' } });
};

export const renderFiles = async (env: Bindings, adminName: string, topicId: number) => {
  const topic = await dbFirst<{ title: string }>(env, 'SELECT title FROM topics WHERE id = ?', topicId);
  if (!topic) {
    return adminLayout('Topic not found', '<div class="alert">Topic not found.</div>', adminName);
  }
  const files = await dbAll<{ id: number; title: string; mime_type: string | null; size: number | null }>(
    env,
    'SELECT id, title, mime_type, size FROM files WHERE topic_id = ? ORDER BY id DESC',
    topicId
  );
  const body = `
    <section class="card">
      <h2>Files for ${escapeHtml(topic.title)}</h2>
      <form class="form" method="post" action="/admin/topics/${topicId}/files" enctype="multipart/form-data">
        <label>
          File title
          <input name="title" required />
        </label>
        <label>
          File
          <input type="file" name="file" required />
        </label>
        <button class="button" type="submit">Upload file</button>
      </form>
    </section>
    <section class="card">
      <table class="table">
        <thead>
          <tr>
            <th>File</th>
            <th>Size</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${files
            .map(
              (file) => `
            <tr>
              <td>
                <strong>${escapeHtml(file.title)}</strong>
                <div class="muted">${escapeHtml(file.mime_type ?? 'unknown')}</div>
              </td>
              <td>${file.size ?? 0} bytes</td>
              <td>
                <a class="button outline" href="/files/${file.id}">Preview</a>
                <form method="post" action="/admin/files/${file.id}/delete" style="display:inline">
                  <button class="button secondary" type="submit">Delete</button>
                </form>
              </td>
            </tr>`
            )
            .join('')}
        </tbody>
      </table>
    </section>
  `;
  return adminLayout('Files', body, adminName);
};

export const handleUploadFile = async (env: Bindings, request: Request, topicId: number) => {
  const form = await request.formData();
  const title = parseFormValue(form, 'title');
  const file = form.get('file');
  if (!title || !(file instanceof File)) {
    return new Response('Missing file', { status: 400 });
  }
  const buffer = await file.arrayBuffer();
  const key = `topic-${topicId}/${Date.now()}-${file.name}`;
  await env.BUCKET.put(key, buffer, {
    httpMetadata: {
      contentType: file.type || 'application/octet-stream'
    }
  });
  await dbRun(
    env,
    'INSERT INTO files (topic_id, title, r2_key, mime_type, size, created_at) VALUES (?, ?, ?, ?, ?, ?)',
    topicId,
    title,
    key,
    file.type || null,
    buffer.byteLength,
    new Date().toISOString()
  );
  return new Response(null, { status: 302, headers: { Location: `/admin/topics/${topicId}/files` } });
};

export const handleDeleteFile = async (env: Bindings, fileId: number) => {
  const file = await dbFirst<{ r2_key: string }>(env, 'SELECT r2_key FROM files WHERE id = ?', fileId);
  if (file?.r2_key) {
    await env.BUCKET.delete(file.r2_key);
  }
  await dbRun(env, 'DELETE FROM files WHERE id = ?', fileId);
  return new Response(null, { status: 302, headers: { Location: '/admin/classes' } });
};

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
