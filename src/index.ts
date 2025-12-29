import { Hono } from 'hono';
import type { Bindings } from './types';
import { ensureSchema, hasAnyAdmin } from './db/schema';
import {
  handleCreateChapter,
  handleCreateClass,
  handleCreateSubject,
  handleCreateTopic,
  handleDeleteChapter,
  handleDeleteClass,
  handleDeleteFile,
  handleDeleteSubject,
  handleDeleteTopic,
  handleLogin,
  handleSetup,
  handleUpdateChapter,
  handleUpdateClass,
  handleUpdateSubject,
  handleUpdateTopic,
  handleUploadFile,
  renderChapters,
  renderClasses,
  renderDashboard,
  renderEditChapter,
  renderEditClass,
  renderEditSubject,
  renderEditTopic,
  renderFiles,
  renderLogin,
  renderSetup,
  renderSubjects,
  renderTopics,
  requireAdmin
} from './handlers/admin';
import { renderChapter, renderClass, renderHome, renderSubject, renderTopic } from './handlers/public';
import { styles } from './templates/styles';
import { clearSession, getCookie } from './utils/auth';

const app = new Hono<{ Bindings: Bindings }>();

app.onError((err, c) => {
  const message = err instanceof Error ? err.message : String(err);
  const stack = err instanceof Error ? err.stack : undefined;
  console.error('Unhandled error', {
    method: c.req.method,
    path: c.req.path,
    message,
    stack
  });
  const body = stack
    ? `Internal Server Error\n\n${message}\n\n${stack}`
    : `Internal Server Error\n\n${message}`;
  return c.text(body, 500);
});

app.use('*', async (c, next) => {
  await ensureSchema(c.env);
  await next();
});

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

app.get('/files/:id', async (c) => {
  const fileId = Number(c.req.param('id'));
  const file = await c.env.DB.prepare(
    'SELECT title, r2_key, mime_type FROM files WHERE id = ?'
  )
    .bind(fileId)
    .first<{ title: string; r2_key: string; mime_type: string | null }>();
  if (!file) {
    return c.text('File not found', 404);
  }
  const object = await c.env.BUCKET.get(file.r2_key);
  if (!object) {
    return c.text('File not found in storage', 404);
  }
  return new Response(object.body, {
    headers: {
      'Content-Type': file.mime_type || 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${file.title}"`
    }
  });
});

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

app.get('/admin/setup', async (c) => {
  const html = await renderSetup(c.env);
  return c.html(html);
});

app.post('/admin/setup', async (c) => {
  return handleSetup(c.env, c.req.raw);
});

app.get('/admin/login', (c) => {
  return c.html(renderLogin());
});

app.post('/admin/login', async (c) => {
  return handleLogin(c.env, c.req.raw);
});

app.get('/admin/logout', async (c) => {
  const sessionToken = getCookie(c.req.header('Cookie') ?? null, 'session');
  await clearSession(c.env, sessionToken);
  return new Response(null, {
    status: 302,
    headers: {
      Location: '/',
      'Set-Cookie': 'session=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax'
    }
  });
});

app.use('/admin/*', async (c, next) => {
  const { admin } = await requireAdmin(c.env, c.req.raw);
  if (!admin) {
    return c.redirect('/admin/login');
  }
  c.set('admin', admin);
  await next();
});

app.get('/admin/dashboard', async (c) => {
  const admin = c.get('admin') as { name: string };
  return c.html(await renderDashboard(c.env, admin.name));
});

app.get('/admin/classes', async (c) => {
  const admin = c.get('admin') as { name: string };
  return c.html(await renderClasses(c.env, admin.name));
});

app.post('/admin/classes', async (c) => {
  return handleCreateClass(c.env, c.req.raw);
});

app.get('/admin/classes/:id/edit', async (c) => {
  const admin = c.get('admin') as { name: string };
  return c.html(await renderEditClass(c.env, admin.name, Number(c.req.param('id'))));
});

app.post('/admin/classes/:id/edit', async (c) => {
  return handleUpdateClass(c.env, c.req.raw, Number(c.req.param('id')));
});

app.post('/admin/classes/:id/delete', async (c) => {
  return handleDeleteClass(c.env, Number(c.req.param('id')));
});

app.get('/admin/classes/:id/subjects', async (c) => {
  const admin = c.get('admin') as { name: string };
  return c.html(await renderSubjects(c.env, admin.name, Number(c.req.param('id'))));
});

app.post('/admin/classes/:id/subjects', async (c) => {
  return handleCreateSubject(c.env, c.req.raw, Number(c.req.param('id')));
});

app.get('/admin/subjects/:id/edit', async (c) => {
  const admin = c.get('admin') as { name: string };
  return c.html(await renderEditSubject(c.env, admin.name, Number(c.req.param('id'))));
});

app.post('/admin/subjects/:id/edit', async (c) => {
  return handleUpdateSubject(c.env, c.req.raw, Number(c.req.param('id')));
});

app.post('/admin/subjects/:id/delete', async (c) => {
  return handleDeleteSubject(c.env, Number(c.req.param('id')));
});

app.get('/admin/subjects/:id/chapters', async (c) => {
  const admin = c.get('admin') as { name: string };
  return c.html(await renderChapters(c.env, admin.name, Number(c.req.param('id'))));
});

app.post('/admin/subjects/:id/chapters', async (c) => {
  return handleCreateChapter(c.env, c.req.raw, Number(c.req.param('id')));
});

app.get('/admin/chapters/:id/edit', async (c) => {
  const admin = c.get('admin') as { name: string };
  return c.html(await renderEditChapter(c.env, admin.name, Number(c.req.param('id'))));
});

app.post('/admin/chapters/:id/edit', async (c) => {
  return handleUpdateChapter(c.env, c.req.raw, Number(c.req.param('id')));
});

app.post('/admin/chapters/:id/delete', async (c) => {
  return handleDeleteChapter(c.env, Number(c.req.param('id')));
});

app.get('/admin/chapters/:id/topics', async (c) => {
  const admin = c.get('admin') as { name: string };
  return c.html(await renderTopics(c.env, admin.name, Number(c.req.param('id'))));
});

app.post('/admin/chapters/:id/topics', async (c) => {
  return handleCreateTopic(c.env, c.req.raw, Number(c.req.param('id')));
});

app.get('/admin/topics/:id/edit', async (c) => {
  const admin = c.get('admin') as { name: string };
  return c.html(await renderEditTopic(c.env, admin.name, Number(c.req.param('id'))));
});

app.post('/admin/topics/:id/edit', async (c) => {
  return handleUpdateTopic(c.env, c.req.raw, Number(c.req.param('id')));
});

app.post('/admin/topics/:id/delete', async (c) => {
  return handleDeleteTopic(c.env, Number(c.req.param('id')));
});

app.get('/admin/topics/:id/files', async (c) => {
  const admin = c.get('admin') as { name: string };
  return c.html(await renderFiles(c.env, admin.name, Number(c.req.param('id'))));
});

app.post('/admin/topics/:id/files', async (c) => {
  return handleUploadFile(c.env, c.req.raw, Number(c.req.param('id')));
});

app.post('/admin/files/:id/delete', async (c) => {
  return handleDeleteFile(c.env, Number(c.req.param('id')));
});

export default app;
