import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { Env } from '../../../../shared/types';
import type { ApiModule } from '../..';
import studentAuth from './auth';
import '../schema';

const app = new Hono<{ Bindings: Env }>();
app.use('/api/*', cors());
app.route('/api/student', studentAuth);

export const createStudentModule = (): ApiModule => ({
  id: 'student-auth',
  match: (path) => path.startsWith('/api/student'),
  handle: (request, env) => app.fetch(request, env),
});
