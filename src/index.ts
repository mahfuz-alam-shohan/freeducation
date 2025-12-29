import { Hono } from 'hono';
import type { Bindings } from './types';
import { ensureSchema, hasAnyAdmin } from './db/schema';
import {
  handleCreateChapter,
  handleCreateClass,
  handleCreateResource,
  handleCreateSubject,
  handleCreateTopic,
  handleDeleteChapter,
  handleDeleteClass,
  handleDeleteFile,
  handleDeleteResource,
  handleDeleteSubject,
  handleDeleteTopic,
  handleLogin,
  handleSetup,
  handleUpdateChapter,
  handleUpdateClass,
  handleUpdateSubject,
  handleUpdateTopic,
  handleUploadFile,
  renderClasses,
  renderDashboard,
  renderEditChapter,
  renderEditClass,
  renderEditSubject,
  renderEditTopic,
  renderFiles,
  renderLogin,
  renderSetup,
  renderSubjectDashboard,
  renderSubjects,
  renderTopics,
  requireAdmin
} from './handlers/admin';
import { renderChapter, renderClass, renderHome, renderSubject, renderTopic } from './handlers/public';
import { styles } from './templates/styles';
import { clearSession, getCookie } from './utils/auth';

const app = new Hono<{ Bindings: Bindings }>();

// --- ERROR HANDLING & MIDDLEWARE ---
app.onError((err, c) => {
  const message = err instanceof Error ? err.message : String(err);
  console.error('Error:', message);
  return c.text(`Internal Server Error: ${message}`, 500);
});

app.use('*', async (c, next) => {
  await ensureSchema(c.env);
  await next();
});

// --- PUBLIC ASSETS & ROUTES ---
app.get('/styles.css', (c) => {
  return c.text(styles, 200, { 'Content-Type': 'text/css' });
});

app.get('/', async (c) => {
  const html = await renderHome(c.env);
  return c.html(html);
});

app.get('/class/:id', async (c) => {
  const html = await renderClass(c.env, Number(c.req.param('id')));
  return c.html(html);
});

app.get('/subject/:id', async (c) => {
  const html = await renderSubject(c.env, Number(c.req.param('id')));
  return c.html(html);
});

app.get('/chapter/:id', async (c) => {
  const html = await renderChapter(c.env, Number(c.req.param('id')));
  return c.html(html);
});

app.get('/topic/:id', async (c) => {
  const html = await renderTopic(c.env, Number(c.req.param('id')));
  return c.html(html);
});

// File Downloader (Binary)
app.get('/files/:id', async (c) => {
  const fileId = Number(c.req.param('id'));
  const file = await c.env.DB.prepare(
    'SELECT title, r2_key, mime_type FROM files WHERE id = ?'
  )
    .bind(fileId)
    .first<{ title: string; r2_key: string; mime_type: string | null }>();
  if (!file) return c.text('File not found', 404);
  
  const object = await c.env.BUCKET.get(file.r2_key);
  if (!object) return c.text('File content missing', 404);
  
  return new Response(object.body, {
    headers: {
      'Content-Type': file.mime_type || 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${file.title}"`
    }
  });
});

// Resource Viewer (PDF/Inline)
app.get('/resource/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const res = await c.env.DB.prepare('SELECT title, r2_key, mime_type FROM resources WHERE id = ?').bind(id).first<{title:string, r2_key:string, mime_type:string}>();
  if(!res) return c.text('Resource not found', 404);
  
  const object = await c.env.BUCKET.get(res.r2_key);
  if(!object) return c.text('Resource content missing', 404);

  return new Response(object.body, {
    headers: {
      'Content-Type': res.mime_type || 'application/pdf',
      'Content-Disposition': `inline; filename="${res.title}"` // "inline" allows browser preview
    }
  });
});

// --- ADMIN ROUTES ---

// Admin Entry Check
app.get('/admin', async (c) => {
  const { admin } = await requireAdmin(c.env, c.req.raw);
  if (!admin) {
    if (!(await hasAnyAdmin(c.env))) {
      return c.redirect('/admin/setup');
    }
    return c.redirect('/admin/login');
  }
  return c.redirect('/admin/dashboard');
});

// Auth
app.get('/admin/setup', async (c) => c.html(await renderSetup(c.env)));
app.post('/admin/setup', async (c) => handleSetup(c.env, c.req.raw));
app.get('/admin/login', (c) => c.html(renderLogin()));
app.post('/admin/login', async (c) => handleLogin(c.env, c.req.raw));
app.get('/admin/logout', async (c) => {
  const sessionToken = getCookie(c.req.header('Cookie') ?? null, 'session');
  await clearSession(c.env, sessionToken);
  return c.redirect('/');
});

// Admin Middleware
app.use('/admin/*', async (c, next) => {
  const { admin } = await requireAdmin(c.env, c.req.raw);
  if (!admin) return c.redirect('/admin/login');
  c.set('admin', admin);
  await next();
});

// Dashboard
app.get('/admin/dashboard', async (c) => {
  const admin = c.get('admin') as { name: string };
  return c.html(await renderDashboard(c.env, admin.name));
});

// Classes
app.get('/admin/classes', async (c) => {
  const admin = c.get('admin') as { name: string };
  return c.html(await renderClasses(c.env, admin.name));
});
app.post('/admin/classes', async (c) => handleCreateClass(c.env, c.req.raw));
app.get('/admin/classes/:id/edit', async (c) => {
  const admin = c.get('admin') as { name: string };
  return c.html(await renderEditClass(c.env, admin.name, Number(c.req.param('id'))));
});
app.post('/admin/classes/:id/edit', async (c) => handleUpdateClass(c.env, c.req.raw, Number(c.req.param('id'))));
app.post('/admin/classes/:id/delete', async (c) => handleDeleteClass(c.env, Number(c.req.param('id'))));

// Subjects
app.get('/admin/classes/:id/subjects', async (c) => {
  const admin = c.get('admin') as { name: string };
  return c.html(await renderSubjects(c.env, admin.name, Number(c.req.param('id'))));
});
app.post('/admin/classes/:id/subjects', async (c) => handleCreateSubject(c.env, c.req.raw, Number(c.req.param('id'))));
app.get('/admin/subjects/:id/edit', async (c) => {
  const admin = c.get('admin') as { name: string };
  return c.html(await renderEditSubject(c.env, admin.name, Number(c.req.param('id'))));
});
app.post('/admin/subjects/:id/edit', async (c) => handleUpdateSubject(c.env, c.req.raw, Number(c.req.param('id'))));
app.post('/admin/subjects/:id/delete', async (c) => handleDeleteSubject(c.env, Number(c.req.param('id'))));

// Subject Dashboard (Chapters + Resources)
app.get('/admin/subjects/:id/dashboard', async (c) => {
  const admin = c.get('admin') as { name: string };
  return c.html(await renderSubjectDashboard(c.env, admin.name, Number(c.req.param('id'))));
});

// Resources (New)
app.post('/admin/subjects/:id/resources', async (c) => handleCreateResource(c.env, c.req.raw, Number(c.req.param('id'))));
app.post('/admin/resources/:id/delete', async (c) => handleDeleteResource(c.env, Number(c.req.param('id'))));

// Chapters
app.post('/admin/subjects/:id/chapters', async (c) => handleCreateChapter(c.env, c.req.raw, Number(c.req.param('id'))));
app.get('/admin/chapters/:id/edit', async (c) => {
  const admin = c.get('admin') as { name: string };
  return c.html(await renderEditChapter(c.env, admin.name, Number(c.req.param('id'))));
});
app.post('/admin/chapters/:id/edit', async (c) => handleUpdateChapter(c.env, c.req.raw, Number(c.req.param('id'))));
app.post('/admin/chapters/:id/delete', async (c) => handleDeleteChapter(c.env, Number(c.req.param('id'))));

// Topics
app.get('/admin/chapters/:id/topics', async (c) => {
  const admin = c.get('admin') as { name: string };
  return c.html(await renderTopics(c.env, admin.name, Number(c.req.param('id'))));
});
app.post('/admin/chapters/:id/topics', async (c) => handleCreateTopic(c.env, c.req.raw, Number(c.req.param('id'))));
app.get('/admin/topics/:id/edit', async (c) => {
  const admin = c.get('admin') as { name: string };
  return c.html(await renderEditTopic(c.env, admin.name, Number(c.req.param('id'))));
});
app.post('/admin/topics/:id/edit', async (c) => handleUpdateTopic(c.env, c.req.raw, Number(c.req.param('id'))));
app.post('/admin/topics/:id/delete', async (c) => handleDeleteTopic(c.env, Number(c.req.param('id'))));

// Files
app.get('/admin/topics/:id/files', async (c) => {
  const admin = c.get('admin') as { name: string };
  return c.html(await renderFiles(c.env, admin.name, Number(c.req.param('id'))));
});
app.post('/admin/topics/:id/files', async (c) => handleUploadFile(c.env, c.req.raw, Number(c.req.param('id'))));
app.post('/admin/files/:id/delete', async (c) => handleDeleteFile(c.env, Number(c.req.param('id'))));

export default app;
