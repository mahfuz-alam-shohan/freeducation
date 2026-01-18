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

export const userRoutes = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// Placeholder routes - will be implemented
userRoutes.get('/', (c) => c.json({ message: 'Get users endpoint' }));
userRoutes.get('/:id', (c) => c.json({ message: 'Get user endpoint' }));
userRoutes.put('/:id', (c) => c.json({ message: 'Update user endpoint' }));
userRoutes.delete('/:id', (c) => c.json({ message: 'Delete user endpoint' }));
