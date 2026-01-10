import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { Env } from '../../../../shared/types';
import type { ApiModule } from '../..';
import { teacherAssignmentRoutes } from './assignments';
import { teacherProfileRoutes } from './profile';
import '../schema';

const app = new Hono<{ Bindings: Env }>();
app.use('/api/*', cors());
app.route('/api/teacher', teacherProfileRoutes);
app.route('/api/teacher', teacherAssignmentRoutes);

export const createTeacherModule = (): ApiModule => ({
  id: 'teacher-profile',
  match: (path) => path.startsWith('/api/teacher'),
  handle: (request, env) => app.fetch(request, env),
});
