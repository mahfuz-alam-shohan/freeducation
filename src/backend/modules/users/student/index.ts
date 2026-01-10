import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { Env } from '../../../../shared/types';
import type { ApiModule } from '../..';
import { handleStudentProfile } from './profile';
import { handleStudentPoints } from './points';
import '../schema';

const app = new Hono<{ Bindings: Env }>();
app.use('/api/*', cors());
app.get('/api/student/profile', async (c) => handleStudentProfile(c.req.raw, c.env, '/api/student/profile'));
app.put('/api/student/profile', async (c) => handleStudentProfile(c.req.raw, c.env, '/api/student/profile'));
app.get('/api/points', async (c) => handleStudentPoints(c.req.raw, c.env, '/api/points'));

export const createStudentModule = (): ApiModule => ({
  id: 'student-auth',
  match: (path) => path.startsWith('/api/student'),
  handle: (request, env) => app.fetch(request, env),
});
