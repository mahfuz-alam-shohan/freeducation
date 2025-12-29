import { Hono } from 'hono';
import type { Bindings, Variables } from './types';
import { ensureSchema } from './db/schema';
import { styles } from './templates/styles';
import { getCookie, clearSession } from './utils/auth';
import * as Public from './handlers/public';
import * as Admin from './handlers/admin';

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// Health Check (Bypass DB)
app.get('/health', (c) => c.text('OK'));

// Middleware: DB Schema Check
app.use('*', async (c, next) => {
  try {
    await ensureSchema(c.env);
  } catch (e) {
    console.error('Schema check failed:', e);
  }
  await next();
});

// Assets
app.get('/styles.css', c => c.text(styles, 200, {'Content-Type': 'text/css'}));

app.get('/resource/:id', async c => {
  try {
    const id = c.req.param('id');
    const res = await c.env.DB.prepare('SELECT * FROM resources WHERE id=?').bind(id).first<any>();
    if(!res) return c.text('Not found', 404);
    if(!c.env.BUCKET) return c.text('Bucket not configured', 500);
    const file = await c.env.BUCKET.get(res.r2_key);
    return file ? new Response(file.body, {headers: {'Content-Type':res.mime_type}}) : c.text('File missing', 404);
  } catch(e) { return c.text('Error fetching resource', 500); }
});

// Public Routes
app.get('/', c => Public.renderHome(c.env));
app.get('/class/:id', c => Public.renderClass(c.env, Number(c.req.param('id'))));
app.get('/subject/:id', c => Public.renderSubject(c.env, Number(c.req.param('id'))));
app.get('/chapter/:id', c => Public.renderChapter(c.env, Number(c.req.param('id'))));

// Admin Routes
app.get('/admin', c => c.redirect('/admin/login'));
app.get('/admin/login', c => Admin.renderLogin());
app.post('/admin/login', c => Admin.handleLogin(c.env, c.req.raw));
app.get('/admin/setup', c => Admin.renderSetup(c.env));
app.post('/admin/setup', c => Admin.handleSetup(c.env, c.req.raw));
app.get('/admin/logout', async c => { await clearSession(c.env, getCookie(c.req.header('Cookie'), 'session')); return c.redirect('/admin/login'); });

// Admin Protected
app.use('/admin/*', async (c, next) => {
  const cookie = c.req.header('Cookie');
  const token = cookie?.split(';').find((x:string)=>x.trim().startsWith('session='))?.split('=')[1];
  if (!token) return c.redirect('/admin/login');
  
  // Safe Admin Check
  try {
    const row = await c.env.DB.prepare(`SELECT admins.name, admins.id FROM sessions JOIN admins ON sessions.admin_id = admins.id WHERE sessions.token = ?`).bind(token).first<{name:string, id:number}>();
    if (!row) return c.redirect('/admin/login');
    c.set('admin', row);
  } catch(e) {
    return c.redirect('/admin/login');
  }
  await next();
});

// Admin Dashboard
app.get('/admin/dashboard', c => Admin.renderDashboard(c.env, c.get('admin')!));
app.get('/admin/classes', c => Admin.renderClasses(c.env, c.get('admin')!));
app.post('/admin/classes', c => Admin.handleCreateClass(c.env, c.req.raw));

app.get('/admin/classes/:id/subjects', c => Admin.renderSubjects(c.env, c.get('admin')!, Number(c.req.param('id'))));
app.post('/admin/classes/:id/subjects', c => Admin.handleCreateSubject(c.env, c.req.raw, Number(c.req.param('id'))));

app.get('/admin/subjects/:id/dashboard', c => Admin.renderCourseDashboard(c.env, c.get('admin')!, Number(c.req.param('id'))));
app.post('/admin/subjects/:id/chapters', c => Admin.handleCreateChapter(c.env, c.req.raw, Number(c.req.param('id'))));
app.post('/admin/subjects/:id/resources', c => Admin.handleUploadResource(c.env, c.req.raw, Number(c.req.param('id'))));

app.get('/admin/chapters/:id/content', c => Admin.renderChapterContent(c.env, c.get('admin')!, Number(c.req.param('id'))));
app.post('/admin/chapters/:id/topics', c => Admin.handleCreateTopic(c.env, c.req.raw, Number(c.req.param('id'))));
app.post('/admin/topics/:id/contents', c => Admin.handleAddContent(c.env, c.req.raw, Number(c.req.param('id'))));
app.post('/admin/topics/:id/delete', async c => { await c.env.DB.prepare('DELETE FROM topics WHERE id=?').bind(c.req.param('id')).run(); return c.redirect(c.req.header('Referer')||'/admin'); });

app.get('/admin/chapters/:id/questions', c => Admin.renderQuestionBank(c.env, c.get('admin')!, Number(c.req.param('id'))));
app.post('/admin/chapters/:id/questions', c => Admin.handleAddQuestion(c.env, c.req.raw, Number(c.req.param('id'))));

export default app;
