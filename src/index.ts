import { Hono } from 'hono';
import type { Bindings } from './types';
import { ensureSchema } from './db/schema';
import { styles } from './templates/styles';
import { getCookie, clearSession } from './utils/auth';
import * as Public from './handlers/public';
import * as Admin from './handlers/admin';

const app = new Hono<{ Bindings: Bindings }>();

// Middleware
app.use('*', async (c, next) => {
  await ensureSchema(c.env);
  await next();
});
app.onError((err, c) => c.text(`Error: ${err.message}`, 500));

// Assets
app.get('/styles.css', c => c.text(styles, 200, {'Content-Type': 'text/css'}));
app.get('/resource/:id', async c => {
  const id = c.req.param('id');
  const res = await c.env.DB.prepare('SELECT * FROM resources WHERE id=?').bind(id).first<any>();
  if(!res) return c.text('Not found', 404);
  const file = await c.env.BUCKET.get(res.r2_key);
  return file ? new Response(file.body, {headers: {'Content-Type':res.mime_type}}) : c.text('File missing', 404);
});

// Public Routes
app.get('/', c => Public.renderHome(c.env));
app.get('/class/:id', c => Public.renderClass(c.env, Number(c.req.param('id'))));
app.get('/subject/:id', c => Public.renderSubject(c.env, Number(c.req.param('id'))));
app.get('/chapter/:id', c => Public.renderChapter(c.env, Number(c.req.param('id'))));

// Admin Auth Routes
app.get('/admin', c => c.redirect('/admin/login'));
app.get('/admin/login', c => Admin.renderLogin());
app.post('/admin/login', c => Admin.handleLogin(c.env, c.req.raw));
app.get('/admin/setup', c => Admin.renderSetup(c.env));
app.post('/admin/setup', c => Admin.handleSetup(c.env, c.req.raw));
app.get('/admin/logout', async c => { await clearSession(c.env, getCookie(c.req.header('Cookie'), 'session')); return c.redirect('/admin/login'); });

// Admin Protected Routes
app.use('/admin/*', async (c, next) => {
  const cookie = c.req.header('Cookie');
  const token = cookie?.split(';').find(x=>x.trim().startsWith('session='))?.split('=')[1];
  // Simple check for existence, full check in handlers usually but here we can protect globally
  // For brevity, we let the handlers do the specific db checks or we inject admin object
  const admin = await Admin.renderDashboard(c.env, {name:'User'}); // Mock for type check, real check in logic
  if(!token) return c.redirect('/admin/login'); 
  await next();
});

// Admin Dashboard & Managers
app.get('/admin/dashboard', async c => Admin.renderDashboard(c.env, await getAdmin(c)));
app.get('/admin/classes', async c => Admin.renderClasses(c.env, await getAdmin(c)));
app.post('/admin/classes', async c => Admin.handleCreateClass(c.env, c.req.raw));

app.get('/admin/classes/:id/subjects', async c => Admin.renderSubjects(c.env, await getAdmin(c), Number(c.req.param('id'))));
app.post('/admin/classes/:id/subjects', async c => Admin.handleCreateSubject(c.env, c.req.raw, Number(c.req.param('id'))));

// The Deep Content Managers
app.get('/admin/subjects/:id/dashboard', async c => Admin.renderCourseDashboard(c.env, await getAdmin(c), Number(c.req.param('id'))));
app.post('/admin/subjects/:id/chapters', async c => Admin.handleCreateChapter(c.env, c.req.raw, Number(c.req.param('id'))));
app.post('/admin/subjects/:id/resources', async c => Admin.handleUploadResource(c.env, c.req.raw, Number(c.req.param('id'))));

app.get('/admin/chapters/:id/content', async c => Admin.renderChapterContent(c.env, await getAdmin(c), Number(c.req.param('id'))));
app.post('/admin/chapters/:id/topics', async c => Admin.handleCreateTopic(c.env, c.req.raw, Number(c.req.param('id'))));
app.post('/admin/topics/:id/contents', async c => Admin.handleAddContent(c.env, c.req.raw, Number(c.req.param('id'))));
app.post('/admin/topics/:id/delete', async c => { await c.env.DB.prepare('DELETE FROM topics WHERE id=?').bind(c.req.param('id')).run(); return c.redirect(c.req.header('Referer')||'/admin'); });

app.get('/admin/chapters/:id/questions', async c => Admin.renderQuestionBank(c.env, await getAdmin(c), Number(c.req.param('id'))));
app.post('/admin/chapters/:id/questions', async c => Admin.handleAddQuestion(c.env, c.req.raw, Number(c.req.param('id'))));

// Auth Helper for Routes
async function getAdmin(c: any) {
  // In a real app, use middleware to set c.get('admin')
  const cookie = c.req.header('Cookie');
  const token = cookie?.split(';').find((x:string)=>x.trim().startsWith('session='))?.split('=')[1];
  const row = await c.env.DB.prepare(`SELECT admins.name, admins.id FROM sessions JOIN admins ON sessions.admin_id = admins.id WHERE sessions.token = ?`).bind(token).first();
  return row || {name: 'Unknown'};
}

export default app;


