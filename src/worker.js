import { ensureSchema } from './db/schema.js';
import {
  createAdmin,
  createSession,
  deleteSession,
  findUserByEmail,
  findUserById,
  getAdminCount,
  listUsers,
  updateUserImage,
  updateUserName,
  updateUserPassword,
} from './db/adminRepo.js';
import {
  createChapter,
  createMcq,
  createNote,
  createSubject,
  deleteChapter,
  deleteMcq,
  deleteNote,
  ensureDefaultTemplate,
  getChapter,
  getSubject,
  getSubjectNode,
  getTemplate,
  listChapters,
  listMcqs,
  listNotes,
  listSubjectNodesByParent,
  listSubjects,
  listTemplateNodes,
  listTemplates,
  updateChapter,
  updateMcq,
  updateNote,
  updateSubjectNode,
} from './db/modulesRepo.js';
import { hashPassword, verifyPassword } from './security/password.js';
import { buildSessionCookie, clearSessionCookie, createSignedToken } from './security/session.js';
import { html, json, redirect } from './http/response.js';
import { methodNotAllowed } from './http/request.js';
import { requireAuth } from './api/auth.js';
import {
  chaptersPage,
  contentKindsPage,
  dashboardPage,
  forbiddenPage,
  loginPage,
  mcqsPage,
  notesPage,
  profilePage,
  publicHomePage,
  setupPage,
  subjectNodeListPage,
  subjectsPage,
  templateDetailsPage,
  templatesPage,
  usersPage,
} from './pages/layout.js';
import { MAX_IMAGE_BYTES } from './env.js';

const MAX_BOOTSTRAP_BODY_BYTES = 4 * 1024 * 1024;
const ACCESS = {
  PUBLIC: 'public',
  AUTHENTICATED: 'authenticated',
};

function id() {
  return crypto.randomUUID();
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function uploadImage(env, folder, file) {
  if (!file || file.size === 0 || typeof file.arrayBuffer !== 'function') return null;
  if (file.size > MAX_IMAGE_BYTES) throw new Error('Image too large (max 3MB).');
  const ext = file.type === 'image/webp' ? 'webp' : file.type === 'image/png' ? 'png' : file.type === 'image/jpeg' ? 'jpg' : 'bin';
  const key = `${folder}/${id()}.${ext}`;
  await env.BUCKET.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type || 'application/octet-stream' },
  });
  return key;
}

async function createAndSetSession(env, userId) {
  const session = {
    id: id(),
    userId,
    expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 14,
    createdAt: new Date().toISOString(),
  };
  await createSession(env.DB, session);
  const token = await createSignedToken(env.AUTH_SECRET, session.id);
  return buildSessionCookie(token);
}

async function apiBootstrap(request, env) {
  if (request.method !== 'POST') return methodNotAllowed();
  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > MAX_BOOTSTRAP_BODY_BYTES) return json({ error: 'Request too large.' }, 413);
  if ((await getAdminCount(env.DB)) > 0) return json({ error: 'Admin already exists.' }, 409);

  try {
    const form = await request.formData();
    const name = String(form.get('name') || '').trim();
    const email = String(form.get('email') || '').trim().toLowerCase();
    const password = String(form.get('password') || '');
    const image = form.get('image');

    if (!name || name.length > 100 || !isEmail(email) || password.length < 8 || password.length > 120) {
      return json({ error: 'Invalid setup form.' }, 400);
    }

    const existing = await findUserByEmail(env.DB, email);
    if (existing) return json({ error: 'Email already in use.' }, 409);

    const hashed = await hashPassword(password);
    const imageKey = await uploadImage(env, 'profiles', image);
    const userId = id();
    await createAdmin(env.DB, {
      id: userId,
      email,
      name,
      imageKey,
      passwordHash: hashed.hash,
      passwordSalt: hashed.salt,
      passwordIterations: hashed.iterations,
      createdAt: new Date().toISOString(),
    });

    const cookie = await createAndSetSession(env, userId);
    return json({ ok: true }, 200, { 'Set-Cookie': cookie });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'Unable to create admin.' }, 500);
  }
}

async function apiLogin(request, env) {
  if (request.method !== 'POST') return methodNotAllowed();
  const body = await request.json().catch(() => null);
  if (!body) return json({ error: 'Invalid request.' }, 400);
  const email = String(body.email || '').trim().toLowerCase();
  const password = String(body.password || '');

  const user = await findUserByEmail(env.DB, email);
  if (!user) return json({ error: 'Invalid credentials.' }, 401);

  const valid = await verifyPassword(password, {
    salt: user.password_salt,
    hash: user.password_hash,
    iterations: user.password_iterations,
  });
  if (!valid) return json({ error: 'Invalid credentials.' }, 401);

  const cookie = await createAndSetSession(env, user.id);
  return json({ ok: true }, 200, { 'Set-Cookie': cookie });
}

async function apiLogout(env, user) {
  await deleteSession(env.DB, user.sessionId);
  return redirect('/login', { 'Set-Cookie': clearSessionCookie() });
}

async function getStats(db) {
  const [userCount, adminCount, sessionCount] = await Promise.all([
    db.prepare('SELECT COUNT(*) count FROM users').first(),
    db.prepare("SELECT COUNT(*) count FROM users WHERE role = 'admin'").first(),
    db.prepare('SELECT COUNT(*) count FROM sessions WHERE expires_at > ?1').bind(Date.now()).first(),
  ]);
  return {
    userCount: Number(userCount.count ?? 0),
    adminCount: Number(adminCount.count ?? 0),
    sessionCount: Number(sessionCount.count ?? 0),
  };
}

function routeRequiresRole(route, user) {
  return Array.isArray(route.roles) && !route.roles.includes(user.role);
}

const pageRoutes = [
  { path: '/', access: ACCESS.PUBLIC, handle: ({ user }) => html(publicHomePage(user)) },
  { path: '/login', access: ACCESS.PUBLIC, handle: () => html(loginPage()) },
  {
    path: '/dashboard',
    access: ACCESS.AUTHENTICATED,
    roles: ['admin'],
    handle: async ({ env, user }) => html(dashboardPage(user, await getStats(env.DB))),
  },
  { path: '/profile', access: ACCESS.AUTHENTICATED, handle: ({ user }) => html(profilePage(user)) },
  {
    path: '/users',
    access: ACCESS.AUTHENTICATED,
    roles: ['admin'],
    handle: async ({ env, user }) => html(usersPage(user, await listUsers(env.DB))),
  },
  {
    path: '/templates',
    access: ACCESS.AUTHENTICATED,
    roles: ['admin'],
    handle: async ({ env, user }) => html(templatesPage(user, await listTemplates(env.DB))),
  },
  {
    path: '/subjects',
    access: ACCESS.AUTHENTICATED,
    roles: ['admin'],
    handle: async ({ env, user }) => html(subjectsPage(user, await listSubjects(env.DB), await listTemplates(env.DB))),
  },
];


async function handleProfilePost(request, env, url, user) {
  if (request.method !== 'POST') return null;

  if (url.pathname === '/api/profile/name') {
    const form = await request.formData();
    const name = String(form.get('name') || '').trim();
    if (!name || name.length > 100) return redirect('/profile');
    await updateUserName(env.DB, user.id, name);
    return redirect('/profile');
  }

  if (url.pathname === '/api/profile/avatar') {
    const form = await request.formData();
    const imageKey = await uploadImage(env, 'profiles', form.get('avatar'));
    if (imageKey) await updateUserImage(env.DB, user.id, imageKey);
    return redirect('/profile');
  }

  if (url.pathname === '/api/profile/password') {
    const form = await request.formData();
    const currentPassword = String(form.get('currentPassword') || '');
    const newPassword = String(form.get('newPassword') || '');
    const confirmPassword = String(form.get('confirmPassword') || '');

    if (newPassword.length < 8 || newPassword.length > 120 || newPassword !== confirmPassword) return redirect('/profile');
    const currentUser = await findUserById(env.DB, user.id);
    if (!currentUser) return redirect('/profile');

    const valid = await verifyPassword(currentPassword, {
      salt: currentUser.password_salt,
      hash: currentUser.password_hash,
      iterations: currentUser.password_iterations,
    });
    if (!valid) return redirect('/profile');

    const hashed = await hashPassword(newPassword);
    await updateUserPassword(env.DB, user.id, hashed.hash, hashed.salt, hashed.iterations);
    return redirect('/profile');
  }

  return null;
}

async function handleAdminPost(request, env, url) {
  if (url.pathname === '/api/subjects' && request.method === 'POST') {
    const form = await request.formData();
    const name = String(form.get('name') || '').trim();
    const classLevel = Number(form.get('classLevel'));
    const templateId = String(form.get('templateId') || '');
    if (!name || !templateId || classLevel < 1 || classLevel > 12) return redirect('/subjects');
    await createSubject(env.DB, { name, classLevel, templateId });
    return redirect('/subjects');
  }

  if (url.pathname.startsWith('/api/subject-nodes/') && request.method === 'POST') {
    const nodeId = url.pathname.split('/').pop();
    const node = await getSubjectNode(env.DB, nodeId);
    if (!node) return new Response('Not found', { status: 404 });
    const form = await request.formData();
    const displayName = node.supports_edit ? String(form.get('displayName') || node.display_name).trim() : node.display_name;
    const removeImage = form.get('removeImage') === '1';
    const image = form.get('image');
    const uploaded = node.supports_image ? await uploadImage(env, 'subject-nodes', image) : null;
    const imageKey = removeImage ? null : uploaded || node.image_key;
    await updateSubjectNode(env.DB, nodeId, displayName || node.display_name, imageKey);
    return redirect(String(form.get('redirect') || '/subjects'));
  }

  if (url.pathname === '/api/chapters' && request.method === 'POST') {
    const form = await request.formData();
    const subjectNodeId = String(form.get('subjectNodeId') || '');
    const subjectId = String(form.get('subjectId') || '');
    const name = String(form.get('name') || '').trim();
    if (!subjectNodeId || !name) return redirect('/subjects');
    const imageKey = await uploadImage(env, 'chapters', form.get('image'));
    await createChapter(env.DB, subjectNodeId, name, imageKey);
    return redirect(`/subjects/${subjectId}/nodes/${subjectNodeId}`);
  }

  if (url.pathname.startsWith('/api/chapters/') && request.method === 'POST') {
    const chapterId = url.pathname.split('/').pop();
    const current = await getChapter(env.DB, chapterId);
    if (!current) return new Response('Not found', { status: 404 });
    const form = await request.formData();
    const intent = String(form.get('intent') || 'update');
    const subjectId = String(form.get('subjectId') || '');
    const nodeId = String(form.get('nodeId') || current.subject_node_id);
    if (intent === 'delete') {
      await deleteChapter(env.DB, chapterId);
    } else {
      const uploaded = await uploadImage(env, 'chapters', form.get('image'));
      const removeImage = form.get('removeImage') === '1';
      const imageKey = removeImage ? null : uploaded || current.image_key;
      await updateChapter(env.DB, chapterId, String(form.get('name') || current.name), imageKey);
    }
    return redirect(`/subjects/${subjectId}/nodes/${nodeId}`);
  }

  if (url.pathname === '/api/notes' && request.method === 'POST') {
    const form = await request.formData();
    const idVal = String(form.get('id') || '');
    const subjectId = String(form.get('subjectId') || '');
    const subjectNodeId = String(form.get('subjectNodeId') || '');
    const chapterId = String(form.get('chapterId') || '');
    const title = String(form.get('title') || '').trim();
    const contentHtml = String(form.get('contentHtml') || '').trim();
    const redirectUrl = `/subjects/${subjectId}/notes?node=${subjectNodeId}&chapter=${chapterId}`;
    if (!title || !contentHtml) return redirect(redirectUrl);
    if (!idVal) {
      const imageKey = await uploadImage(env, 'notes', form.get('image'));
      await createNote(env.DB, { subjectId, subjectNodeId, chapterId, title, contentHtml, imageKey });
    } else {
      const existing = (await listNotes(env.DB, subjectNodeId, chapterId)).find((n) => n.id === idVal);
      const uploaded = await uploadImage(env, 'notes', form.get('image'));
      const imageKey = form.get('removeImage') === '1' ? null : uploaded || existing?.image_key || null;
      await updateNote(env.DB, { id: idVal, title, contentHtml, imageKey });
    }
    return redirect(redirectUrl);
  }

  if (url.pathname === '/api/notes/delete' && request.method === 'POST') {
    const form = await request.formData();
    const idVal = String(form.get('id') || '');
    const subjectId = String(form.get('subjectId') || '');
    const subjectNodeId = String(form.get('subjectNodeId') || '');
    const chapterId = String(form.get('chapterId') || '');
    if (idVal) await deleteNote(env.DB, idVal);
    return redirect(`/subjects/${subjectId}/notes?node=${subjectNodeId}&chapter=${chapterId}`);
  }

  if (url.pathname === '/api/mcqs' && request.method === 'POST') {
    const form = await request.formData();
    const idVal = String(form.get('id') || '');
    const subjectId = String(form.get('subjectId') || '');
    const subjectNodeId = String(form.get('subjectNodeId') || '');
    const chapterId = String(form.get('chapterId') || '');
    const payload = {
      id: idVal,
      subjectId,
      subjectNodeId,
      chapterId,
      questionHtml: String(form.get('questionHtml') || '').trim(),
      optionA: String(form.get('optionA') || '').trim(),
      optionB: String(form.get('optionB') || '').trim(),
      optionC: String(form.get('optionC') || '').trim(),
      optionD: String(form.get('optionD') || '').trim(),
      correctOption: String(form.get('correctOption') || 'A'),
    };
    const redirectUrl = `/subjects/${subjectId}/mcqs?node=${subjectNodeId}&chapter=${chapterId}`;
    if (!payload.questionHtml || !payload.optionA || !payload.optionB || !payload.optionC || !payload.optionD) return redirect(redirectUrl);
    if (!idVal) {
      payload.imageKey = await uploadImage(env, 'mcq', form.get('image'));
      await createMcq(env.DB, payload);
    } else {
      const existing = (await listMcqs(env.DB, subjectNodeId, chapterId)).find((m) => m.id === idVal);
      const uploaded = await uploadImage(env, 'mcq', form.get('image'));
      payload.imageKey = form.get('removeImage') === '1' ? null : uploaded || existing?.image_key || null;
      await updateMcq(env.DB, payload);
    }
    return redirect(redirectUrl);
  }

  if (url.pathname === '/api/mcqs/delete' && request.method === 'POST') {
    const form = await request.formData();
    const idVal = String(form.get('id') || '');
    const subjectId = String(form.get('subjectId') || '');
    const subjectNodeId = String(form.get('subjectNodeId') || '');
    const chapterId = String(form.get('chapterId') || '');
    if (idVal) await deleteMcq(env.DB, idVal);
    return redirect(`/subjects/${subjectId}/mcqs?node=${subjectNodeId}&chapter=${chapterId}`);
  }

  return null;
}

async function handleDynamicPages(url, env, user) {
  const templateMatch = url.pathname.match(/^\/templates\/([^/]+)$/);
  if (templateMatch) {
    const template = await getTemplate(env.DB, templateMatch[1]);
    if (!template) return new Response('Not Found', { status: 404 });
    return html(templateDetailsPage(user, template, await listTemplateNodes(env.DB, template.id)));
  }

  const subjectRootMatch = url.pathname.match(/^\/subjects\/([^/]+)$/);
  if (subjectRootMatch) {
    const subject = await getSubject(env.DB, subjectRootMatch[1]);
    if (!subject) return new Response('Not Found', { status: 404 });
    const nodes = await listSubjectNodesByParent(env.DB, subject.id, null);
    return html(subjectNodeListPage(user, subject, `${subject.name} · Top Categories`, 'Manage Main Book and Assisting Book.', nodes, '/subjects'));
  }

  const subjectNodeMatch = url.pathname.match(/^\/subjects\/([^/]+)\/nodes\/([^/]+)$/);
  if (subjectNodeMatch) {
    const subject = await getSubject(env.DB, subjectNodeMatch[1]);
    const node = await getSubjectNode(env.DB, subjectNodeMatch[2]);
    if (!subject || !node) return new Response('Not Found', { status: 404 });

    if (node.supports_chapters) {
      return html(chaptersPage(user, subject, node, await listChapters(env.DB, node.id)));
    }

    const children = await listSubjectNodesByParent(env.DB, subject.id, node.id);
    if (children.length > 0) {
      return html(
        subjectNodeListPage(
          user,
          subject,
          `${subject.name} · ${node.display_name}`,
          'Rename items and upload template images.',
          children,
          `/subjects/${subject.id}`
        )
      );
    }

    return html(contentKindsPage(user, subject, node, null));
  }

  const chapterPageMatch = url.pathname.match(/^\/subjects\/([^/]+)\/nodes\/([^/]+)\/chapters\/([^/]+)$/);
  if (chapterPageMatch) {
    const subject = await getSubject(env.DB, chapterPageMatch[1]);
    const node = await getSubjectNode(env.DB, chapterPageMatch[2]);
    const chapter = await getChapter(env.DB, chapterPageMatch[3]);
    if (!subject || !node || !chapter) return new Response('Not Found', { status: 404 });
    return html(contentKindsPage(user, subject, node, chapter));
  }

  if (url.pathname.match(/^\/subjects\/([^/]+)\/notes$/)) {
    const subjectId = url.pathname.split('/')[2];
    const nodeId = url.searchParams.get('node');
    const chapterId = url.searchParams.get('chapter');
    const subject = await getSubject(env.DB, subjectId);
    const node = await getSubjectNode(env.DB, nodeId);
    const chapter = chapterId ? await getChapter(env.DB, chapterId) : null;
    if (!subject || !node) return new Response('Not Found', { status: 404 });
    return html(notesPage(user, subject, node, chapter, await listNotes(env.DB, node.id, chapter?.id)));
  }

  if (url.pathname.match(/^\/subjects\/([^/]+)\/mcqs$/)) {
    const subjectId = url.pathname.split('/')[2];
    const nodeId = url.searchParams.get('node');
    const chapterId = url.searchParams.get('chapter');
    const subject = await getSubject(env.DB, subjectId);
    const node = await getSubjectNode(env.DB, nodeId);
    const chapter = chapterId ? await getChapter(env.DB, chapterId) : null;
    if (!subject || !node) return new Response('Not Found', { status: 404 });
    return html(mcqsPage(user, subject, node, chapter, await listMcqs(env.DB, node.id, chapter?.id)));
  }

  return null;
}

export default {
  async fetch(request, env) {
    if (!env.AUTH_SECRET) return new Response('AUTH_SECRET is required', { status: 500 });

    try {
      await ensureSchema(env.DB, { cleanUnknownTables: env.CLEAN_UNKNOWN_TABLES === 'true' });
      await ensureDefaultTemplate(env.DB);
    } catch (error) {
      return json({ error: error instanceof Error ? error.message : 'Schema initialization failed.' }, 500);
    }

    const url = new URL(request.url);

    if (url.pathname === '/api/bootstrap') return apiBootstrap(request, env);
    if (url.pathname === '/api/login') return apiLogin(request, env);

    const adminCount = await getAdminCount(env.DB);
    if (adminCount === 0) {
      if (url.pathname === '/api/logout') return redirect('/setup');
      if (url.pathname === '/' || url.pathname === '/setup') return html(setupPage());
      return redirect('/setup');
    }

    const user = await requireAuth(request, env);
    if (url.pathname === '/api/logout') {
      if (!user) return redirect('/login');
      return apiLogout(env, user);
    }

    if (url.pathname.startsWith('/api/') && request.method === 'POST' && !['/api/bootstrap', '/api/login'].includes(url.pathname)) {
      if (!user) return redirect('/login');
      const profilePost = await handleProfilePost(request, env, url, user);
      if (profilePost) return profilePost;
      if (user.role !== 'admin') return html(forbiddenPage(), 403);
      const protectedPost = await handleAdminPost(request, env, url);
      if (protectedPost) return protectedPost;
    }

    const route = pageRoutes.find((item) => item.path === url.pathname);
    if (!route) {
      if (!user) return redirect('/login');
      if ((url.pathname.startsWith('/subjects') || url.pathname.startsWith('/templates')) && user.role !== 'admin') {
        return html(forbiddenPage(), 403);
      }
      const dynamic = await handleDynamicPages(url, env, user);
      if (dynamic) return dynamic;
      return new Response('Not Found', { status: 404 });
    }

    if (route.access === ACCESS.AUTHENTICATED && !user) {
      if (url.pathname.startsWith('/api/')) return json({ error: 'Unauthorized' }, 401);
      return redirect('/login');
    }

    if (route.access === ACCESS.AUTHENTICATED && routeRequiresRole(route, user)) return html(forbiddenPage(), 403);
    return route.handle({ request, env, user });
  },
};
