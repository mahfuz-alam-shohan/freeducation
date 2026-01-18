import { Hono } from 'hono';

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

export const socialRoutes = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// Placeholder routes - will be implemented
socialRoutes.get('/posts', (c) => c.json({ message: 'Get posts endpoint' }));
socialRoutes.post('/posts', (c) => c.json({ message: 'Create post endpoint' }));
socialRoutes.post('/posts/:id/like', (c) => c.json({ message: 'Like post endpoint' }));
socialRoutes.post('/posts/:id/comment', (c) => c.json({ message: 'Comment post endpoint' }));
