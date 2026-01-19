import { getDatabase } from './database';
import { StartupManager } from './database/StartupManager';
import { Combiner } from './core/Combiner';

export default {
  async fetch(request: Request, env: any): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // Initialize startup manager
    const startupManager = new StartupManager(env);
    
    try {
      // Step 1: Initialize application (database first!)
      const startup = await startupManager.initializeApplication();
      
      if (!startup.success) {
        console.error('Application startup failed:', startup.message);
        return new Response(
          JSON.stringify({ 
            error: 'Application initialization failed',
            stage: startup.stage,
            message: startup.message,
            timestamp: new Date().toISOString()
          }), 
          { status: 503, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Step 2: Route requests only after successful initialization
      return handleRequest(request, env, startupManager);

    } catch (error: any) {
      console.error('Worker error:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Internal Server Error',
          message: error.message || error,
          timestamp: new Date().toISOString()
        }), 
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
};

async function handleRequest(request: Request, env: any, startupManager: StartupManager): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  // Initialize database
  const db = getDatabase(env.DB);
  
  try {
    // Check if admin setup is required
    const startupStatus = await startupManager.initializeApplication();
    
    if (startupStatus.stage === 'admin_setup_required') {
      // Force redirect to admin setup page
      if (path !== '/admin-setup') {
        return new Response(null, {
          status: 302,
          headers: { Location: '/admin-setup' }
        });
      }
    } else if (startupStatus.stage === 'complete') {
      // Admin exists, block admin setup page
      if (path === '/admin-setup') {
        return new Response(null, {
          status: 302,
          headers: { Location: '/' }
        });
      }
    }

    // API Routes
    if (path.startsWith('/api/')) {
      return handleAPI(request, env, db);
    }

    // Health check endpoint
    if (path === '/health') {
      const health = await startupManager.getHealthStatus();
      return Response.json(health);
    }

    // Startup status endpoint
    if (path === '/startup-status') {
      const status = await startupManager.getHealthStatus();
      return Response.json({
        startup: 'complete',
        database: status,
        timestamp: new Date().toISOString()
      });
    }

    // Page Routes - Use Combiner architecture
    if (path.startsWith('/')) {
      return handlePageWithCombiner(request, env, db);
    }

    // 404 for unknown routes
    return new Response(
      JSON.stringify({ error: 'Route not found' }), 
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Request handling error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Request handling failed',
        message: error.message || error,
        timestamp: new Date().toISOString()
      }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

async function handlePageWithCombiner(request: Request, env: any, db: any): Promise<Response> {
  try {
    // Get user from token (simplified for now)
    const user = await getUserFromRequest(request, db, env);
    
    // Initialize combiner
    const combiner = new Combiner(env);
    
    // Combine and render page
    const result = await combiner.combineAndRender(request, env, user);
    
    // Log any warnings or conflicts
    if (result.data.warnings.length > 0) {
      console.log('Page warnings:', result.data.warnings);
    }
    
    if (result.data.conflicts.length > 0) {
      console.log('Page conflicts resolved:', result.data.conflicts);
    }
    
    // Return HTML response
    return new Response(result.html, {
      headers: { 'Content-Type': 'text/html' }
    });

  } catch (error: any) {
    console.error('Combiner error:', error);
    
    // Fallback to simple error page
    return new Response(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Error - Free Education Platform</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
      </head>
      <body class="bg-gray-50 min-h-screen flex items-center justify-center">
        <div class="text-center">
          <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i class="fas fa-exclamation-triangle text-red-600 text-3xl"></i>
          </div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Something went wrong</h1>
          <p class="text-gray-600 mb-8">We're having trouble loading this page.</p>
          <a href="/" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Go back home
          </a>
        </div>
      </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

async function getUserFromRequest(request: Request, db: any, env: any): Promise<any> {
  // TODO: Implement proper JWT verification
  // For now, return a mock user
  return {
    id: 1,
    username: 'demo_user',
    email: 'demo@freeducation.com',
    full_name: 'Demo User',
    user_type: 'student'
  };
}

async function handleAPI(request: Request, env: any, db: any): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  // Check if admin setup is required - block all API endpoints except admin setup
  const startupManager = new StartupManager(env);
  const startupStatus = await startupManager.initializeApplication();
  
  if (startupStatus.stage === 'admin_setup_required') {
    if (path !== '/api/admin/setup') {
      return new Response(
        JSON.stringify({ 
          error: 'Admin setup required',
          message: 'Please complete admin setup first',
          redirect: '/admin-setup'
        }), 
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } else if (startupStatus.stage === 'complete') {
    if (path === '/api/admin/setup') {
      return new Response(
        JSON.stringify({ 
          error: 'Admin setup already completed',
          message: 'Admin account already exists'
        }), 
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  // Route API endpoints
  if (path === '/api/admin/setup' && method === 'POST') {
    return handleAdminSetupAPI(request, db);
  }

  if (path === '/api/menu' && method === 'GET') {
    return handleMenuAPI(request, db);
  }

  if (path === '/api/auth/login' && method === 'POST') {
    return handleLoginAPI(request, db);
  }

  if (path === '/api/auth/register' && method === 'POST') {
    return handleRegisterAPI(request, db);
  }

  if (path === '/api/users' && method === 'GET') {
    return handleUsersAPI(request, db);
  }

  if (path === '/api/subjects' && method === 'GET') {
    return handleSubjectsAPI(request, db);
  }

  // 404 for unknown API routes
  return new Response(
    JSON.stringify({ error: 'API endpoint not found' }), 
    { status: 404, headers: { 'Content-Type': 'application/json' } }
  );
}

async function handleAdminSetupAPI(request: Request, db: any): Promise<Response> {
  try {
    const { username, email, full_name, password, confirm_password } = await request.json();
    
    // Validate input
    if (!username || !email || !password || !full_name || !confirm_password) {
      return new Response(
        JSON.stringify({ error: 'All fields are required' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate username (alphanumeric, min 3 chars)
    const usernameRegex = /^[a-zA-Z0-9]{3,20}$/;
    if (!usernameRegex.test(username)) {
      return new Response(
        JSON.stringify({ error: 'Username must be 3-20 alphanumeric characters' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate full name (min 2 chars, letters only)
    const nameRegex = /^[a-zA-Z\s]{2,50}$/;
    if (!nameRegex.test(full_name)) {
      return new Response(
        JSON.stringify({ error: 'Full name must be 2-50 letters only' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return new Response(
        JSON.stringify({ error: 'Password must be at least 8 characters long' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password)) {
      return new Response(
        JSON.stringify({ error: 'Password must contain uppercase, lowercase, number, and special character' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if passwords match
    if (password !== confirm_password) {
      return new Response(
        JSON.stringify({ error: 'Passwords do not match' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if admin already exists
    const existingAdmin = await db.prepare('SELECT COUNT(*) as count FROM users WHERE user_type = \'admin\'').first();
    if (existingAdmin && existingAdmin.count > 0) {
      return new Response(
        JSON.stringify({ error: 'Admin account already exists' }), 
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if username already exists
    const existingUsername = await db.prepare('SELECT COUNT(*) as count FROM users WHERE username = ?').bind(username).first();
    if (existingUsername && existingUsername.count > 0) {
      return new Response(
        JSON.stringify({ error: 'Username already exists' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if email already exists
    const existingEmail = await db.prepare('SELECT COUNT(*) as count FROM users WHERE email = ?').bind(email).first();
    if (existingEmail && existingEmail.count > 0) {
      return new Response(
        JSON.stringify({ error: 'Email already exists' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Hash password with proper salt
    const salt = crypto.randomUUID();
    const encoder = new TextEncoder();
    const data = encoder.encode(password + salt);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // Create admin user with proper data
    const adminData = {
      username: username.trim(),
      email: email.toLowerCase().trim(),
      full_name: full_name.trim(),
      user_type: 'admin',
      password_hash: hashHex,
      salt: salt,
      is_active: true,
      email_verified: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Insert admin user with proper SQL
    const result = await db.prepare(`
      INSERT INTO users (username, email, full_name, user_type, password_hash, salt, is_active, email_verified, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      adminData.username,
      adminData.email,
      adminData.full_name,
      adminData.user_type,
      adminData.password_hash,
      adminData.salt,
      adminData.is_active,
      adminData.email_verified,
      adminData.created_at,
      adminData.updated_at
    ).run();

    if (result.success) {
      // Log admin creation for security audit
      console.log('Admin account created:', {
        username: adminData.username,
        email: adminData.email,
        created_at: adminData.created_at,
        ip: request.headers.get('CF-Connecting-IP') || 'unknown'
      });

      return Response.json({
        success: true,
        message: 'Admin account created successfully',
        data: {
          id: result.meta.last_row_id,
          username: adminData.username,
          email: adminData.email,
          full_name: adminData.full_name,
          user_type: adminData.user_type
        },
        redirect: '/'
      });
    } else {
      return new Response(
        JSON.stringify({ error: 'Failed to create admin account' }), 
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error: any) {
    console.error('Admin setup error:', error);
    return new Response(
      JSON.stringify({ error: 'Admin setup failed' }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

async function handleMenuAPI(request: Request, db: any): Promise<Response> {
  const url = new URL(request.url);
  const role = url.searchParams.get('role') || 'student';

  try {
    // Get menu items based on user role
    const menuItems = getMenuByRole(role);
    
    return Response.json({
      success: true,
      data: menuItems
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch menu' }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

async function handleLoginAPI(request: Request, db: any): Promise<Response> {
  try {
    const { email, password } = await request.json();
    
    // Validate input
    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email and password required' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get user from database
    const user = await db.getUserByEmail(email);
    
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Invalid credentials' }), 
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // TODO: Verify password hash
    // For now, just return success (implement proper password verification later)
    
    // Generate JWT token
    const token = await generateJWT(user);
    
    return Response.json({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          full_name: user.full_name,
          user_type: user.user_type
        },
        token: token,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      }
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Login failed' }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

async function handleRegisterAPI(request: Request, db: any): Promise<Response> {
  try {
    const userData = await request.json();
    
    // Validate required fields
    const requiredFields = ['username', 'email', 'password', 'full_name', 'user_type'];
    for (const field of requiredFields) {
      if (!userData[field]) {
        return new Response(
          JSON.stringify({ error: `${field} is required` }), 
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // Create user in database
    const user = await db.createUser(userData, userData.password);
    
    if (user) {
      return Response.json({
        success: true,
        data: {
          id: user.id,
          username: user.username,
          email: user.email,
          full_name: user.full_name,
          user_type: user.user_type
        }
      });
    } else {
      return new Response(
        JSON.stringify({ error: 'Failed to create user' }), 
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Registration failed' }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

async function handleUsersAPI(request: Request, db: any): Promise<Response> {
  try {
    // TODO: Implement getAllUsers method in database
    const users = [{ message: "User API endpoint - implement getAllUsers in database" }];
    
    return Response.json({
      success: true,
      data: users
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch users' }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

async function handleSubjectsAPI(request: Request, db: any): Promise<Response> {
  try {
    const subjects = await db.getSubjects();
    
    return Response.json({
      success: true,
      data: subjects
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch subjects' }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

function getMenuByRole(role: string) {
  const baseItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-home', href: '/dashboard' },
    { id: 'subjects', label: 'Subjects', icon: 'fas fa-book', href: '/subjects' },
    { id: 'schedule', label: 'Schedule', icon: 'fas fa-calendar', href: '/schedule' },
    { id: 'progress', label: 'Progress', icon: 'fas fa-chart-line', href: '/progress' }
  ];

  const roleSpecificItems = {
    admin: [
      { id: 'users', label: 'Users', icon: 'fas fa-users', href: '/admin/users' },
      { id: 'settings', label: 'Settings', icon: 'fas fa-cog', href: '/admin/settings' },
      { id: 'analytics', label: 'Analytics', icon: 'fas fa-chart-bar', href: '/admin/analytics' }
    ],
    teacher: [
      { id: 'classes', label: 'My Classes', icon: 'fas fa-chalkboard', href: '/teacher/classes' },
      { id: 'assignments', label: 'Assignments', icon: 'fas fa-tasks', href: '/teacher/assignments' },
      { id: 'students', label: 'Students', icon: 'fas fa-graduation-cap', href: '/teacher/students' }
    ],
    student: [
      { id: 'materials', label: 'Study Materials', icon: 'fas fa-book-open', href: '/student/materials' },
      { id: 'assignments', label: 'Assignments', icon: 'fas fa-clipboard-list', href: '/student/assignments' },
      { id: 'achievements', label: 'Achievements', icon: 'fas fa-trophy', href: '/student/achievements' }
    ],
    writer: [
      { id: 'content', label: 'My Content', icon: 'fas fa-pen', href: '/writer/content' },
      { id: 'drafts', label: 'Drafts', icon: 'fas fa-folder', href: '/writer/drafts' },
      { id: 'analytics', label: 'Analytics', icon: 'fas fa-chart-pie', href: '/writer/analytics' }
    ],
    publisher: [
      { id: 'publications', label: 'Publications', icon: 'fas fa-book', href: '/publisher/publications' },
      { id: 'revenue', label: 'Revenue', icon: 'fas fa-dollar-sign', href: '/publisher/revenue' },
      { id: 'authors', label: 'Authors', icon: 'fas fa-users', href: '/publisher/authors' }
    ]
  };

  return [...baseItems, ...(roleSpecificItems[role as keyof typeof roleSpecificItems] || [])];
}

async function generateJWT(user: any): Promise<string> {
  // Simple JWT generation (use proper library in production)
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.user_type,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
  };

  // TODO: Implement proper JWT signing with env.JWT_SECRET
  // For now, return a mock token
  return btoa(JSON.stringify({ header, payload }));
}
