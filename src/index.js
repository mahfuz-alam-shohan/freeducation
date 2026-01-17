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

// Serve static files (built React app)
app.get('/*', async (c) => {
  const url = new URL(c.req.url);
  const path = url.pathname;

  // API routes - let them pass through
  if (path.startsWith('/api/')) {
    return;
  }

  // Try to serve static files first, fallback to HTML
  try {
    // Serve static assets if they exist
    if (path.startsWith('/assets/') || path.endsWith('.js') || path.endsWith('.css')) {
      const assetPath = path.slice(1); // Remove leading /
      const asset = await c.env.ASSETS.get(assetPath);
      if (asset) {
        const headers = new Headers();
        headers.set('Content-Type', getContentType(assetPath));
        return new Response(asset.body, { headers });
      }
    }

    // Serve HTML for all other routes
    const html = await c.env.ASSETS.get('index.html');
    if (html) {
      return new Response(html.body, {
        headers: { 'Content-Type': 'text/html' }
      });
    }
  } catch (error) {
    console.error('Static file error:', error);
  }

  // Fallback HTML if no static files available
  return c.html(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>freeducation - Education Platform</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
  <div id="root">
    <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f3f4f6;">
      <div style="text-align: center;">
        <div style="width: 4rem; height: 4rem; background: #3b82f6; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;">
          <span style="color: white; font-size: 1.5rem;">🎓</span>
        </div>
        <h1 style="font-size: 2rem; font-weight: bold; color: #1f2937; margin-bottom: 0.5rem;">freeducation</h1>
        <p style="color: #6b7280; margin-bottom: 2rem;">Setting up your education platform...</p>
        <div style="width: 2rem; height: 2rem; border: 4px solid #e5e7eb; border-top: 4px solid #3b82f6; border-radius: 50%; animation: spin 1s linear infinite;"></div>
      </div>
    </div>
    <script>
      setTimeout(() => {
        document.getElementById('root').innerHTML = '<div style="text-align: center; padding: 2rem;"><h2 style="color: #dc2626;">Platform Ready</h2><p style="color: #6b7280;">Please wait while we complete the setup...</p></div>';
      }, 2000);
    </script>
</body>
</html>
  `);
});

function getContentType(path) {
  const ext = path.split('.').pop();
  const types = {
    'js': 'application/javascript',
    'css': 'text/css',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'gif': 'image/gif',
    'svg': 'image/svg+xml'
  };
  return types[ext] || 'text/plain';
}

// Database migration endpoint
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
