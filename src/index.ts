import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { createDatabase, runMigrations } from '@/core/database/connection';
import { setupRoutes } from '@/api/routes';
import { errorHandler } from '@/core/middleware/errorHandler';
import baseTemplate from '@/web/templates/base.html';
import mainJs from '@/web/static/js/main.js';
import componentsJs from '@/web/static/js/components.js';

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

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// Global middleware
app.use('*', cors({
  origin: ['http://localhost:3000', 'https://your-domain.com'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

app.use('*', logger());
app.use('*', errorHandler);

// Health check endpoint
app.get('/health', (c) => {
  return c.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Database debug endpoint
app.get('/debug', (c) => {
  return c.json({
    hasDB: !!c.env.DB,
    envKeys: Object.keys(c.env),
    DBType: typeof c.env.DB,
    DBString: String(c.env.DB),
    allEnv: c.env
  });
});

// Simple test endpoint without database
app.get('/test', (c) => {
  return c.json({
    message: 'FreeEducation Platform',
    status: 'Working',
    timestamp: new Date().toISOString()
  });
});

// Database connection test endpoint
app.get('/db-test', async (c) => {
  try {
    if (!c.env.DB) {
      return c.json({ error: 'No DB found' });
    }
    
    const database = createDatabase(c.env);
    return c.json({ 
      success: true,
      message: 'Database connection created',
      dbType: typeof database.db
    });
  } catch (error) {
    return c.json({ 
      error: 'Database connection failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Migration test endpoint
app.get('/migration-test', async (c) => {
  try {
    if (!c.env.DB) {
      return c.json({ error: 'No DB found' });
    }
    
    const database = createDatabase(c.env);
    await runMigrations(database);
    
    return c.json({ 
      success: true,
      message: 'Migrations completed'
    });
  } catch (error) {
    return c.json({ 
      error: 'Migration failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
  }
});

// Check existing tables endpoint
app.get('/check-tables', async (c) => {
  try {
    if (!c.env.DB) {
      return c.json({ error: 'No DB found' });
    }
    
    const rawDB = c.env.DB;
    
    // Get all table names
    const tablesResult = await rawDB.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table'
    `).all();
    
    const tables = tablesResult.results || [];
    
    // Get users table schema if it exists
    let usersSchema = null;
    const usersTableExists = tables.some((t: any) => t.name === 'users');
    
    if (usersTableExists) {
      const schemaResult = await rawDB.prepare(`
        PRAGMA table_info(users)
      `).all();
      usersSchema = schemaResult.results || [];
    }
    
    return c.json({ 
      tables: tables.map((t: any) => t.name),
      usersTableExists,
      usersSchema
    });
  } catch (error) {
    return c.json({ 
      error: 'Table check failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Reset database endpoint (DANGEROUS - only for development)
app.get('/reset-db', async (c) => {
  try {
    if (!c.env.DB) {
      return c.json({ error: 'No DB found' });
    }
    
    const rawDB = c.env.DB;
    
    // Drop all tables
    const tables = ['users', 'user_profiles', 'subjects', 'chapters', 'lessons', 
                   'assessments', 'questions', 'user_assessments', 'credit_transactions',
                   'study_sessions', 'social_posts', 'social_likes', 'social_comments',
                   'system_settings', 'audit_logs'];
    
    for (const table of tables) {
      await rawDB.prepare(`DROP TABLE IF EXISTS ${table}`).run();
    }
    
    return c.json({ 
      success: true,
      message: 'Database reset - all tables dropped'
    });
  } catch (error) {
    return c.json({ 
      error: 'Database reset failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Force migration endpoint
app.get('/force-migration', async (c) => {
  try {
    if (!c.env.DB) {
      return c.json({ error: 'No DB found' });
    }
    
    const database = createDatabase(c.env);
    
    // First drop conflicting tables
    const rawDB = database.rawDB;
    const conflictingTables = ['users', 'user_profiles', 'site_settings'];
    
    for (const table of conflictingTables) {
      await rawDB.prepare(`DROP TABLE IF EXISTS ${table}`).run();
    }
    
    // Then run migrations
    await runMigrations(database);
    
    return c.json({ 
      success: true,
      message: 'Force migration completed'
    });
  } catch (error) {
    return c.json({ 
      error: 'Force migration failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
  }
});

// Simple test route that bypasses all middleware
app.get('/simple-test', (c) => {
  return c.json({
    message: 'Simple test working',
    timestamp: new Date().toISOString(),
    env: Object.keys(c.env)
  });
});

// Test home page without middleware
app.get('/test-home', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Test Home</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-gray-50">
      <div class="min-h-screen flex items-center justify-center">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">FreeEducation Platform</h1>
          <p class="text-gray-600 mb-8">Test page - working!</p>
          <div class="space-x-4">
            <a href="/login" class="bg-blue-600 text-white px-4 py-2 rounded">Login</a>
            <a href="/register" class="bg-green-600 text-white px-4 py-2 rounded">Register</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Initialize database and setup routes (only for API routes)
app.use('/api/*', async (c, next) => {
  try {
    // Check if D1 database is available
    if (!c.env.DB) {
      console.error('D1 database not found in environment');
      return c.json({ error: 'D1 database not available' }, 500);
    }
    
    // Initialize database connection
    const database = createDatabase(c.env);
    
    // Run auto-migrations
    await runMigrations(database);
    
    // Store database in context for use in routes
    c.set('db', database.db);
    
    await next();
  } catch (error) {
    console.error('Database initialization failed:', error);
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
    console.error('Full error:', error);
    return c.json({ 
      error: 'Database initialization failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      fullError: String(error)
    }, 500);
  }
});

// Setup API routes
setupRoutes(app);

// Static file serving
app.get('/static/*', async (c) => {
  const path = c.req.path;
  
  // Serve JavaScript files
  if (path.endsWith('.js')) {
    // In a real implementation, you'd serve from R2 or build process
    // For now, we'll return the JS content directly
    if (path.includes('main.js')) {
      return c.text(mainJs, 200, { 'Content-Type': 'application/javascript' });
    }
    if (path.includes('components.js')) {
      return c.text(componentsJs, 200, { 'Content-Type': 'application/javascript' });
    }
  }
  
  return c.text('File not found', 404);
});

// Homepage route
app.get('/', async (c) => {
  // Create the homepage HTML
  const homepageHTML = `
    <div class="pt-16">
      <!-- Hero Section -->
      <section class="bg-gradient-to-br from-primary to-blue-600 text-white py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center">
            <h1 class="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Welcome to FreeEducation
            </h1>
            <p class="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Learn, Practice, and Connect with our comprehensive educational platform. 
              Access quality content, take assessments, and join a community of learners.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <button onclick="window.location.href='/subjects'" class="btn-scale px-8 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 focus-ring">
                Start Learning
              </button>
              <button onclick="window.location.href='/assessments'" class="btn-scale px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary focus-ring">
                Take Assessment
              </button>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Features Section -->
      <section class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose FreeEducation?
            </h2>
            <p class="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide everything you need for successful learning in one platform.
            </p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div class="text-center p-6 rounded-lg hover-lift bg-gray-50">
              <div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">Rich Content</h3>
              <p class="text-gray-600">Access comprehensive educational materials across various subjects and class levels.</p>
            </div>
            
            <div class="text-center p-6 rounded-lg hover-lift bg-gray-50">
              <div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">Practice Tests</h3>
              <p class="text-gray-600">Improve your knowledge with MCQ tests, previous year questions, and practice assessments.</p>
            </div>
            
            <div class="text-center p-6 rounded-lg hover-lift bg-gray-50">
              <div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">Earn Credits</h3>
              <p class="text-gray-600">Get rewarded for your learning progress and use credits to access premium features.</p>
            </div>
            
            <div class="text-center p-6 rounded-lg hover-lift bg-gray-50">
              <div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">Community</h3>
              <p class="text-gray-600">Connect with fellow learners, share knowledge, and collaborate on educational goals.</p>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Stats Section -->
      <section class="py-20 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Platform Statistics
            </h2>
            <p class="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of learners already benefiting from our platform.
            </p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div class="text-center p-6 bg-white rounded-lg shadow-sm hover-lift">
              <div class="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
              </div>
              <div class="text-3xl font-bold text-gray-900 mb-2">10,000+</div>
              <div class="text-gray-600">Active Learners</div>
            </div>
            
            <div class="text-center p-6 bg-white rounded-lg shadow-sm hover-lift">
              <div class="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
              <div class="text-3xl font-bold text-gray-900 mb-2">500+</div>
              <div class="text-gray-600">Subjects</div>
            </div>
            
            <div class="text-center p-6 bg-white rounded-lg shadow-sm hover-lift">
              <div class="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
              <div class="text-3xl font-bold text-gray-900 mb-2">1,000+</div>
              <div class="text-gray-600">Assessments</div>
            </div>
            
            <div class="text-center p-6 bg-white rounded-lg shadow-sm hover-lift">
              <div class="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div class="text-3xl font-bold text-gray-900 mb-2">50,000+</div>
              <div class="text-gray-600">Questions</div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- CTA Section -->
      <section class="py-20 bg-gradient-to-r from-primary to-blue-600">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Learning Journey?
          </h2>
          <p class="text-xl text-blue-100 mb-8">
            Join thousands of students who are already learning with FreeEducation. 
            Create your free account and start exploring today.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button onclick="window.location.href='/register'" class="btn-scale px-8 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 focus-ring">
              Create Free Account
            </button>
            <button onclick="window.location.href='/login'" class="btn-scale px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary focus-ring">
              Sign In
            </button>
          </div>
        </div>
      </section>
    </div>
  `;
  
  // Generate the header HTML
  const headerHTML = `
    <header class="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-30 h-16">
      <div class="flex items-center justify-between h-full px-4">
        <!-- Sidebar Toggle -->
        <button onclick="SidebarManager.toggle()" class="btn-scale p-2 rounded-lg hover:bg-gray-100 focus-ring">
          <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
        
        <!-- Brand Logo -->
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
          </div>
          <span class="text-xl font-bold text-gray-900">freeducation</span>
        </div>
        
        <!-- User Area -->
        <div class="flex items-center space-x-3">
          <!-- Notification Bell -->
          <button class="btn-scale p-2 rounded-lg hover:bg-gray-100 focus-ring relative">
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
            </svg>
          </button>
          
          <!-- Login/Register Buttons -->
          <button onclick="window.location.href='/login'" class="btn-scale px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus-ring">
            Login
          </button>
          <button onclick="window.location.href='/register'" class="btn-scale px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-blue-600 focus-ring">
            Register
          </button>
        </div>
      </div>
    </header>
  `;
  
  // Generate the sidebar HTML
  const sidebarHTML = `
    <aside id="sidebar" class="fixed inset-y-0 left-0 w-64 bg-white shadow-sm border-r border-gray-200 z-20 transform sidebar-transition">
      <div class="p-4 border-b border-gray-200">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
          </div>
          <span class="text-lg font-bold text-gray-900">freeducation</span>
        </div>
      </div>
      
      <div class="p-4 border-b border-gray-200 space-y-2">
        <button onclick="window.location.href='/login'" class="btn-scale w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus-ring rounded-lg">
          Login
        </button>
        <button onclick="window.location.href='/register'" class="btn-scale w-full px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-blue-600 focus-ring rounded-lg">
          Register
        </button>
      </div>
      
      <nav class="p-4 space-y-1">
        <a href="/" class="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium bg-primary text-white focus-ring">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
          </svg>
          <span>Home</span>
        </a>
        <a href="/subjects" class="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 focus-ring">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
          </svg>
          <span>Subjects</span>
        </a>
        <a href="/classes" class="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 focus-ring">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"></path>
          </svg>
          <span>Classes</span>
        </a>
        <a href="/assessments" class="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 focus-ring">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
          <span>Assessments</span>
        </a>
        <a href="/community" class="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 opacity-60 cursor-not-allowed focus-ring">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
          </svg>
          <span>Community (Coming Soon)</span>
        </a>
        <a href="/settings" class="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 focus-ring">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
          </svg>
          <span>Settings</span>
        </a>
      </nav>
    </aside>
    
    <!-- Mobile Sidebar Overlay -->
    <div id="sidebar-overlay" class="fixed inset-0 bg-black bg-opacity-50 z-40 hidden sidebar-overlay"></div>
  `;
  
  // Replace template variables
  const finalHTML = baseTemplate
    .replace('{{title}}', 'Home')
    .replace('{{header}}', headerHTML)
    .replace('{{sidebar}}', sidebarHTML)
    .replace('{{content}}', homepageHTML)
    .replace('{{scripts}}', `
      <script>
        // Set current page for sidebar
        AppState.currentPage = 'home';
        
        // Initialize sidebar state
        AppState.sidebarOpen = false;
        
        // Add mobile sidebar classes
        if (Utils.isMobile()) {
          const sidebar = document.getElementById('sidebar');
          sidebar.classList.add('-translate-x-full');
        }
      </script>
    `);
  
  return c.html(finalHTML);
});

// Login page route
app.get('/login', async (c) => {
  // Generate the login page HTML
  const loginPageHTML = `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <a href="/register" class="font-medium text-primary hover:text-blue-600">
              create a new account
            </a>
          </p>
        </div>
        <form class="mt-8 space-y-6" action="/api/v1/auth/login" method="POST">
          <div class="rounded-md shadow-sm -space-y-px">
            <div>
              <label for="email" class="sr-only">Email address</label>
              <input id="email" name="email" type="email" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm" placeholder="Email address">
            </div>
            <div>
              <label for="password" class="sr-only">Password</label>
              <input id="password" name="password" type="password" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm" placeholder="Password">
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input id="remember-me" name="rememberMe" type="checkbox" class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded">
              <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div class="text-sm">
              <a href="#" class="font-medium text-primary hover:text-blue-600">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button type="submit" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  // Generate the header HTML (minimal for auth pages)
  const headerHTML = `
    <header class="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-30 h-16">
      <div class="flex items-center justify-between h-full px-4">
        <!-- Sidebar Toggle (hidden on auth pages) -->
        <div class="w-10"></div>
        
        <!-- Brand Logo -->
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
          </div>
          <span class="text-xl font-bold text-gray-900">freeducation</span>
        </div>
        
        <!-- User Area (hidden on auth pages) -->
        <div class="w-32"></div>
      </div>
    </header>
  `;
  
  // No sidebar for auth pages
  const sidebarHTML = '';
  
  // Replace template variables
  const finalHTML = baseTemplate
    .replace('{{title}}', 'Login')
    .replace('{{header}}', headerHTML)
    .replace('{{sidebar}}', sidebarHTML)
    .replace('{{content}}', loginPageHTML)
    .replace('{{scripts}}', `
      <script src="/static/js/main.js"></script>
    `);
  
  return c.html(finalHTML);
});

// Register page route
app.get('/register', async (c) => {
  // Generate the register page HTML
  const registerPageHTML = `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <a href="/login" class="font-medium text-primary hover:text-blue-600">
              sign in to your existing account
            </a>
          </p>
        </div>
        <form class="mt-8 space-y-6" action="/api/v1/auth/register" method="POST">
          <div class="space-y-4">
            <div>
              <label for="role" class="block text-sm font-medium text-gray-700">Account Type</label>
              <select id="role" name="role" required class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="writer">Writer</option>
                <option value="publisher">Publisher</option>
              </select>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="firstName" class="block text-sm font-medium text-gray-700">First Name</label>
                <input id="firstName" name="firstName" type="text" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="First name">
              </div>
              <div>
                <label for="lastName" class="block text-sm font-medium text-gray-700">Last Name</label>
                <input id="lastName" name="lastName" type="text" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="Last name">
              </div>
            </div>
            
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
              <input id="email" name="email" type="email" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="Email address">
            </div>
            
            <div>
              <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
              <input id="username" name="username" type="text" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="Username">
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                <input id="password" name="password" type="password" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="Password">
              </div>
              <div>
                <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input id="confirmPassword" name="confirmPassword" type="password" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="Confirm password">
              </div>
            </div>
          </div>

          <div class="flex items-center">
            <input id="terms" name="terms" type="checkbox" required class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded">
            <label for="terms" class="ml-2 block text-sm text-gray-900">
              I agree to the Terms of Service and Privacy Policy
            </label>
          </div>

          <div>
            <button type="submit" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              Create account
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  // Generate the header HTML (minimal for auth pages)
  const headerHTML = `
    <header class="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-30 h-16">
      <div class="flex items-center justify-between h-full px-4">
        <!-- Sidebar Toggle (hidden on auth pages) -->
        <div class="w-10"></div>
        
        <!-- Brand Logo -->
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
          </div>
          <span class="text-xl font-bold text-gray-900">freeducation</span>
        </div>
        
        <!-- User Area (hidden on auth pages) -->
        <div class="w-32"></div>
      </div>
    </header>
  `;
  
  // No sidebar for auth pages
  const sidebarHTML = '';
  
  // Replace template variables
  const finalHTML = baseTemplate
    .replace('{{title}}', 'Register')
    .replace('{{header}}', headerHTML)
    .replace('{{sidebar}}', sidebarHTML)
    .replace('{{content}}', registerPageHTML)
    .replace('{{scripts}}', `
      <script src="/static/js/main.js"></script>
    `);
  
  return c.html(finalHTML);
});

// First-time admin setup route (only accessible if no admin exists)
app.get('/setup', async (c) => {
  const db = c.get('db');
  
  try {
    // Check if admin already exists
    const adminExists = await db.prepare(`
      SELECT id FROM users WHERE role = 'admin' LIMIT 1
    `).first();

    if (adminExists) {
      return c.json({ error: 'Admin already exists' }, 403);
    }

    // Generate setup token (valid for 24 hours)
    const setupToken = crypto.randomUUID();
    const expiresAt = Date.now() + (24 * 60 * 60 * 1000); // 24 hours

    // Store setup token
    await db.prepare(`
      INSERT OR REPLACE INTO system_settings (key, value, type, category, updated_at)
      VALUES ('setup_token', ?, 'string', 'setup', ?)
    `).bind(setupToken, expiresAt).run();

    return c.json({
      message: 'Setup required',
      setupUrl: `/setup/${setupToken}`,
      expiresAt: new Date(expiresAt).toISOString()
    });
  } catch (error) {
    console.error('Setup check failed:', error);
    return c.json({ error: 'Setup check failed' }, 500);
  }
});

// Admin setup form endpoint
app.get('/setup/:token', async (c) => {
  const token = c.req.param('token');
  const db = c.get('db');

  try {
    // Verify setup token
    const setupData = await db.prepare(`
      SELECT value FROM system_settings 
      WHERE key = 'setup_token' AND value = ? AND CAST(value AS INTEGER) > ?
    `).bind(token, Date.now()).first();

    if (!setupData) {
      return c.json({ error: 'Invalid or expired setup token' }, 400);
    }

    // Return setup form HTML
    const setupForm = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FreeEducation - Initial Setup</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div class="text-center mb-8">
            <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
            </div>
            <h1 class="text-2xl font-bold text-gray-900">FreeEducation Setup</h1>
            <p class="text-gray-600 mt-2">Create your administrator account</p>
        </div>

        <form id="setupForm" class="space-y-6">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input type="text" name="firstName" required 
                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input type="text" name="lastName" required 
                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input type="email" name="email" required 
                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <input type="text" name="username" required pattern="[a-zA-Z0-9_]{3,20}"
                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <p class="text-xs text-gray-500 mt-1">3-20 characters, letters, numbers, and underscores only</p>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input type="password" name="password" required minlength="8"
                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <p class="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <input type="password" name="confirmPassword" required 
                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>

            <button type="submit" 
                    class="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition duration-200">
                Create Admin Account
            </button>
        </form>

        <div id="message" class="mt-4 hidden"></div>
    </div>

    <script>
        document.getElementById('setupForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            
            if (data.password !== data.confirmPassword) {
                showMessage('Passwords do not match', 'error');
                return;
            }

            try {
                const response = await fetch('/api/setup/admin', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        token: '${token}',
                        firstName: data.firstName,
                        lastName: data.lastName,
                        email: data.email,
                        username: data.username,
                        password: data.password
                    })
                });

                const result = await response.json();

                if (response.ok) {
                    showMessage('Admin account created successfully! Redirecting to login...', 'success');
                    setTimeout(() => {
                        window.location.href = '/login';
                    }, 2000);
                } else {
                    showMessage(result.error || 'Setup failed', 'error');
                }
            } catch (error) {
                showMessage('Network error. Please try again.', 'error');
            }
        });

        function showMessage(text, type) {
            const messageEl = document.getElementById('message');
            messageEl.className = \`mt-4 p-4 rounded-lg \${
                type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }\`;
            messageEl.textContent = text;
            messageEl.classList.remove('hidden');
        }
    </script>
</body>
</html>`;

    return c.html(setupForm);
  } catch (error) {
    console.error('Setup form failed:', error);
    return c.json({ error: 'Setup form failed' }, 500);
  }
});

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Route not found' }, 404);
});

export default app;
