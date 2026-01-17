import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { authRoutes } from './routes/auth.js';
import { adminRoutes } from './routes/admin.js';
import { migrateDatabase } from '../database/migrate.js';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger());

// Database migration endpoint (for first setup)
app.post('/api/migrate', async (c) => {
  try {
    const result = await migrateDatabase(c.env.DB);
    return c.json(result);
  } catch (error) {
    console.error('Migration error:', error);
    return c.json({ 
      success: false, 
      error: error.message 
    }, 500);
  }
});

// Health check
app.get('/', (c) => {
  return c.json({ 
    message: 'freeducation API is running',
    version: '1.0.0',
    status: 'healthy'
  });
});

// Routes
app.route('/api/auth', authRoutes);
app.route('/api/admin', adminRoutes);

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Route not found' }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error(err);
  return c.json({ 
    error: 'Internal server error',
    message: err.message 
  }, 500);
});

export default app;
