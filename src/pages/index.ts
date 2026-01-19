import { LayoutManager } from '../components/layout/LayoutManager';
import { getDatabase } from '../database';
import { renderHomePage } from './home';

export async function handlePage(request: Request, env: any, db: any): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;

  // Get user from token (simplified for now)
  const user = await getUserFromRequest(request, db, env);
  
  // Detect device type
  const userAgent = request.headers.get('user-agent') || '';
  const deviceType = detectDeviceType(userAgent);

  // Layout Manager will handle all device-specific components
  const layoutManager = new LayoutManager();
  
  // Route to different pages
  if (path === '/') {
    return renderHomePage(request, layoutManager, user, deviceType, env);
  }

  if (path === '/subjects') {
    return renderSubjectsPage(request, layoutManager, user, deviceType, env);
  }

  if (path === '/login') {
    return renderLoginPage(request, layoutManager, deviceType, env);
  }

  if (path === '/register') {
    return renderRegisterPage(request, layoutManager, deviceType, env);
  }

  // 404 for unknown pages
  return renderNotFoundPage(request, layoutManager, user, deviceType, env);
}

// Helper functions
function detectDeviceType(userAgent: string): string {
  if (/mobile/i.test(userAgent)) return 'mobile';
  if (/tablet|ipad/i.test(userAgent)) return 'tablet';
  return 'desktop';
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

// Placeholder page render functions - these will be created as separate modular files
async function renderDashboardPage(request: Request, layoutManager: any, user: any, deviceType: string, env: any): Promise<Response> {
  const content = `
    <div class="p-6">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Welcome back, ${user?.full_name || 'Student'}!</h1>
        <p class="text-gray-600">Here's what's happening with your learning today.</p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i class="fas fa-book text-blue-600 text-xl"></i>
            </div>
            <h3 class="ml-3 text-lg font-semibold">Subjects</h3>
          </div>
          <p class="text-3xl font-bold text-blue-600">15</p>
          <p class="text-gray-600">Active subjects</p>
        </div>
      </div>
    </div>
  `;

  const html = layoutManager.render({
    user,
    deviceType,
    children: content,
    showFooter: true,
    footerType: 'full'
  });

  return new Response(html, {
    headers: { 'Content-Type': 'text/html' }
  });
}

async function renderSubjectsPage(request: Request, layoutManager: any, user: any, deviceType: string, env: any): Promise<Response> {
  const content = `
    <div class="p-6">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Subjects</h1>
        <p class="text-gray-600">Choose your subjects and start learning.</p>
      </div>
    </div>
  `;

  const html = layoutManager.render({
    user,
    deviceType,
    children: content,
    showFooter: true,
    footerType: 'full'
  });

  return new Response(html, {
    headers: { 'Content-Type': 'text/html' }
  });
}

async function renderLoginPage(request: Request, layoutManager: any, deviceType: string, env: any): Promise<Response> {
  const content = `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
      </div>
    </div>
  `;

  const html = layoutManager.render({
    user: null,
    deviceType,
    children: content,
    showFooter: false
  });

  return new Response(html, {
    headers: { 'Content-Type': 'text/html' }
  });
}

async function renderRegisterPage(request: Request, layoutManager: any, deviceType: string, env: any): Promise<Response> {
  const content = `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
      </div>
    </div>
  `;

  const html = layoutManager.render({
    user: null,
    deviceType,
    children: content,
    showFooter: false
  });

  return new Response(html, {
    headers: { 'Content-Type': 'text/html' }
  });
}

async function renderNotFoundPage(request: Request, layoutManager: any, user: any, deviceType: string, env: any): Promise<Response> {
  const content = `
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Page Not Found</h1>
        <p class="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
      </div>
    </div>
  `;

  const html = layoutManager.render({
    user,
    deviceType,
    children: content,
    showFooter: true
  });

  return new Response(html, {
    headers: { 'Content-Type': 'text/html' }
  });
}
