import { Hono } from 'hono';
import { authRoutes } from './auth';
import { userRoutes } from './users';
import { educationRoutes } from './education';
import { assessmentRoutes } from './assessments';
import { socialRoutes } from './social';
import { adminRoutes } from './admin';

type Bindings = {
  DB: D1Database;
  BUCKET: R2Bucket;
  GMAIL_CLIENT_ID: string;
  GMAIL_CLIENT_SECRET: string;
  GMAIL_REFRESH_TOKEN: string;
  JWT_SECRET: string;
};

type Variables = {
  db: any;
  userId?: string;
  userEmail?: string;
  userRole?: string;
};

export function setupRoutes(app: Hono<{ Bindings: Bindings; Variables: Variables }>) {
  // API versioning
  const api = app.basePath('/api/v1');
  
  // Route groups
  api.route('/auth', authRoutes);
  api.route('/users', userRoutes);
  api.route('/education', educationRoutes);
  api.route('/assessments', assessmentRoutes);
  api.route('/social', socialRoutes);
  api.route('/admin', adminRoutes);
  
  // Setup admin endpoint (special case)
  app.route('/api', adminRoutes);
}
