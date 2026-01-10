import { Hono } from 'hono';
import type { Env } from '../shared/types';
import { createSystemModule } from './core/system';
import { createAdminModule } from './core/users/admin';
import { createStudentModule } from './core/users/student';
import { createTeacherModule } from './core/users/teacher';
import { createSubjectsModule } from './domains/academic/subjects';
import type { ApiModule } from './core/registry';
import { apiHeaders } from './core/users/shared/utils';
import { ensureDatabaseReady } from './core/db/ensure';

export const app = new Hono<{ Bindings: Env }>();

const buildRequestWithPath = (request: Request, path: string) => {
  const url = new URL(request.url);
  url.pathname = path;
  return new Request(url, request);
};

const forwardToModule = async (module: ApiModule, request: Request, env: Env, path: string) => {
  const response = await module.handle(buildRequestWithPath(request, path), env);
  return response ?? null;
};

const systemModule = createSystemModule();
const adminModule = createAdminModule();
const studentModule = createStudentModule();
const teacherModule = createTeacherModule();
const subjectsModule = createSubjectsModule();

app.all('/api/system', async (c) => {
  const response = await forwardToModule(systemModule, c.req.raw, c.env, '/api/system');
  return response ?? c.notFound();
});

app.all('/api/system/*', async (c) => {
  const suffix = c.req.path.replace('/api/system', '');
  const response = await forwardToModule(systemModule, c.req.raw, c.env, `/api/system${suffix}`);
  return response ?? c.notFound();
});

app.all('/api/login', async (c) => {
  const response = await forwardToModule(systemModule, c.req.raw, c.env, '/api/login');
  return response ?? c.notFound();
});

app.all('/api/register-admin', async (c) => {
  const response = await forwardToModule(systemModule, c.req.raw, c.env, '/api/register-admin');
  return response ?? c.notFound();
});

app.all('/api/me', async (c) => {
  const response = await forwardToModule(systemModule, c.req.raw, c.env, '/api/me');
  return response ?? c.notFound();
});

app.all('/api/change-password', async (c) => {
  const response = await forwardToModule(systemModule, c.req.raw, c.env, '/api/change-password');
  return response ?? c.notFound();
});

app.all('/api/users', async (c) => {
  const response = await forwardToModule(adminModule, c.req.raw, c.env, '/api/users');
  return response ?? c.notFound();
});

app.all('/api/users/*', async (c) => {
  const suffix = c.req.path.replace('/api/users', '');
  if (suffix.startsWith('/student')) {
    const nextPath = `/api/student${suffix.slice('/student'.length)}` || '/api/student';
    const response = await forwardToModule(studentModule, c.req.raw, c.env, nextPath);
    return response ?? c.notFound();
  }
  if (suffix.startsWith('/teacher')) {
    const nextPath = `/api/teacher${suffix.slice('/teacher'.length)}` || '/api/teacher';
    const response = await forwardToModule(teacherModule, c.req.raw, c.env, nextPath);
    return response ?? c.notFound();
  }
  return c.notFound();
});

app.all('/api/student', async (c) => {
  const response = await forwardToModule(studentModule, c.req.raw, c.env, '/api/student');
  return response ?? c.notFound();
});

app.all('/api/student/*', async (c) => {
  const suffix = c.req.path.replace('/api/student', '');
  const nextPath = `/api/student${suffix}` || '/api/student';
  const response = await forwardToModule(studentModule, c.req.raw, c.env, nextPath);
  return response ?? c.notFound();
});

app.all('/api/points', async (c) => {
  const response = await forwardToModule(studentModule, c.req.raw, c.env, '/api/points');
  return response ?? c.notFound();
});

app.all('/api/classes', async (c) => {
  const response = await forwardToModule(subjectsModule, c.req.raw, c.env, '/api/classes');
  return response ?? c.notFound();
});

app.all('/api/content', async (c) => {
  const response = await forwardToModule(subjectsModule, c.req.raw, c.env, '/api/content');
  return response ?? c.notFound();
});

app.all('/api/content/*', async (c) => {
  const suffix = c.req.path.replace('/api/content', '');
  const response = await forwardToModule(subjectsModule, c.req.raw, c.env, `/api/content${suffix}`);
  return response ?? c.notFound();
});

app.all('/api/videos', async (c) => {
  const response = await forwardToModule(subjectsModule, c.req.raw, c.env, '/api/videos');
  return response ?? c.notFound();
});

app.all('/api/videos/*', async (c) => {
  const suffix = c.req.path.replace('/api/videos', '');
  const response = await forwardToModule(subjectsModule, c.req.raw, c.env, `/api/videos${suffix}`);
  return response ?? c.notFound();
});

app.all('/api/thumbnails', async (c) => {
  const response = await forwardToModule(subjectsModule, c.req.raw, c.env, '/api/thumbnails');
  return response ?? c.notFound();
});

app.all('/api/chapter-thumbnails', async (c) => {
  const response = await forwardToModule(subjectsModule, c.req.raw, c.env, '/api/chapter-thumbnails');
  return response ?? c.notFound();
});

app.all('/api/fonts', async (c) => {
  const response = await forwardToModule(subjectsModule, c.req.raw, c.env, '/api/fonts');
  return response ?? c.notFound();
});

app.all('/api/academic', async (c) => {
  const response = await forwardToModule(subjectsModule, c.req.raw, c.env, '/api');
  return response ?? c.notFound();
});

app.all('/api/academic/*', async (c) => {
  const suffix = c.req.path.replace('/api/academic', '');
  const response = await forwardToModule(subjectsModule, c.req.raw, c.env, `/api${suffix}`);
  return response ?? c.notFound();
});

export const handleApiRequest = async (request: Request, env: Env) => {
  const url = new URL(request.url);
  if (!url.pathname.startsWith('/api')) {
    return null;
  }

  await ensureDatabaseReady(env);
  const response = await app.fetch(request, env);
  if (response.status !== 404) {
    return response;
  }

  return Response.json({ success: false, error: 'API route not found.' }, { status: 404, headers: apiHeaders });
};
