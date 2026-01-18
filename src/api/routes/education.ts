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

export const educationRoutes = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// Placeholder routes - will be implemented
educationRoutes.get('/subjects', (c) => c.json({ message: 'Get subjects endpoint' }));
educationRoutes.get('/subjects/:id', (c) => c.json({ message: 'Get subject endpoint' }));
educationRoutes.get('/subjects/:id/chapters', (c) => c.json({ message: 'Get chapters endpoint' }));
educationRoutes.get('/chapters/:id/lessons', (c) => c.json({ message: 'Get lessons endpoint' }));
