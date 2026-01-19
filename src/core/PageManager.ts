import { getDatabase } from '../database';

export interface PageData {
  content: string;
  title: string;
  description?: string;
  metadata?: Record<string, any>;
  scripts?: string[];
  styles?: string[];
}

export class PageManager {
  private db: any;
  private env: any;

  constructor(env: any) {
    this.env = env;
    this.db = getDatabase(env.DB);
  }

  async getPageData(pagePath: string, user: any): Promise<PageData> {
    switch (pagePath) {
      case '/':
        return await this.getHomePageData(user);
      case '/admin-setup':
        return await this.getAdminSetupPageData(user);
      case '/subjects':
        return await this.getSubjectsPageData(user);
      case '/login':
        return await this.getLoginPageData(user);
      case '/register':
        return await this.getRegisterPageData(user);
      default:
        return await this.getNotFoundPageData(user);
    }
  }

  private async getAdminSetupPageData(user: any): Promise<PageData> {
    return {
      title: 'Admin Setup - Free Education Platform',
      description: 'Create your first administrator account',
      content: `
        <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div class="max-w-md w-full space-y-8">
            <div class="text-center">
              <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i class="fas fa-user-shield text-blue-600 text-3xl"></i>
              </div>
              <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Create Administrator Account
              </h2>
              <p class="mt-2 text-center text-sm text-gray-600">
                This is the first time setup. Create your administrator account to manage the platform.
              </p>
            </div>
            <form class="mt-8 space-y-6" method="POST" action="/api/admin/setup">
              <div class="space-y-6">
                <div>
                  <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
                  <div class="mt-1">
                    <input id="username" name="username" type="text" required class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                  </div>
                </div>

                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
                  <div class="mt-1">
                    <input id="email" name="email" type="email" autocomplete="email" required class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                  </div>
                </div>

                <div>
                  <label for="full_name" class="block text-sm font-medium text-gray-700">Full Name</label>
                  <div class="mt-1">
                    <input id="full_name" name="full_name" type="text" required class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                  </div>
                </div>

                <div>
                  <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                  <div class="mt-1">
                    <input id="password" name="password" type="password" autocomplete="new-password" required class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                  </div>
                  <p class="mt-2 text-sm text-gray-500">
                    Use a strong password with at least 8 characters, including uppercase, lowercase, numbers, and symbols.
                  </p>
                </div>

                <div>
                  <label for="confirm_password" class="block text-sm font-medium text-gray-700">Confirm Password</label>
                  <div class="mt-1">
                    <input id="confirm_password" name="confirm_password" type="password" autocomplete="new-password" required class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                  </div>
                </div>
              </div>

              <div>
                <button type="submit" class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Create Administrator Account
                </button>
              </div>

              <div class="text-center">
                <p class="text-xs text-gray-500">
                  After creating this account, you will be redirected to the admin dashboard.
                  This setup page will be permanently disabled.
                </p>
              </div>
            </form>
          </div>
        </div>
      `,
      metadata: {
        pageType: 'admin_setup',
        requiresAuth: false,
        setupRequired: true
      }
    };
  }

  private async getHomePageData(user: any): Promise<PageData> {
    return {
      title: 'freeducation',
      description: 'Free education platform for Bangladesh',
      content: `
        <!-- Blank content area - freeducation platform -->
        <div class="min-h-screen flex items-center justify-center">
          <div class="text-center">
            <div class="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <i class="fas fa-graduation-cap text-blue-600 text-4xl"></i>
            </div>
            <h1 class="text-4xl font-bold text-gray-900 mb-4">freeducation</h1>
            <p class="text-xl text-gray-600">Free education platform for Bangladesh</p>
          </div>
        </div>
      `,
      metadata: {
        pageType: 'home',
        requiresAuth: false
      }
    };
  }

  private async getSubjectsPageData(user: any): Promise<PageData> {
    // Fetch subjects from database
    const subjects = await this.db.prepare('SELECT * FROM subjects ORDER BY name').all();

    return {
      title: 'Subjects - Free Education Platform',
      description: 'Browse all available subjects for Classes 6-12',
      content: `
        <div class="p-6">
          <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Subjects</h1>
            <p class="text-gray-600">Choose your subjects and start learning.</p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            ${subjects.results.map((subject: any) => `
              <div class="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer">
                <div class="flex items-center mb-4">
                  <div class="w-16 h-16 bg-${subject.color || 'blue'}-100 rounded-lg flex items-center justify-center">
                    <i class="fas fa-${subject.icon || 'book'} text-${subject.color || 'blue'}-600 text-2xl"></i>
                  </div>
                  <div class="ml-4">
                    <h3 class="text-xl font-bold text-gray-900">${subject.name}</h3>
                    <p class="text-sm text-gray-500">Class ${subject.class_levels}</p>
                  </div>
                </div>
                <p class="text-gray-600 mb-4">${subject.description}</p>
                <div class="flex items-center text-sm text-gray-500">
                  <i class="fas fa-book-open mr-2"></i>
                  <span>${subject.chapters_count || 0} Chapters</span>
                  <i class="fas fa-clock ml-4 mr-2"></i>
                  <span>${subject.estimated_hours || 0} hours</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `,
      metadata: {
        pageType: 'subjects',
        requiresAuth: true,
        subjectsCount: subjects.results.length
      }
    };
  }

  private async getLoginPageData(user: any): Promise<PageData> {
    return {
      title: 'Sign In - Free Education Platform',
      description: 'Sign in to your account',
      content: `
        <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div class="max-w-md w-full space-y-8">
            <div>
              <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Sign in to your account
              </h2>
              <p class="mt-2 text-center text-sm text-gray-600">
                Or <a href="/register" class="font-medium text-blue-600 hover:text-blue-500">create a new account</a>
              </p>
            </div>
            <form class="mt-8 space-y-6" method="POST" action="/api/auth/login">
              <div class="space-y-6">
                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
                  <div class="mt-1">
                    <input id="email" name="email" type="email" autocomplete="email" required class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                  </div>
                </div>

                <div>
                  <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                  <div class="mt-1">
                    <input id="password" name="password" type="password" autocomplete="current-password" required class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                  </div>
                </div>
              </div>

              <div>
                <button type="submit" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      `,
      metadata: {
        pageType: 'auth',
        requiresAuth: false,
        authAction: 'login'
      }
    };
  }

  private async getRegisterPageData(user: any): Promise<PageData> {
    return {
      title: 'Create Account - Free Education Platform',
      description: 'Create your account to start learning',
      content: `
        <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div class="max-w-md w-full space-y-8">
            <div>
              <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Create your account
              </h2>
              <p class="mt-2 text-center text-sm text-gray-600">
                Or <a href="/login" class="font-medium text-blue-600 hover:text-blue-500">sign in to your existing account</a>
              </p>
            </div>
            <form class="mt-8 space-y-6" method="POST" action="/api/auth/register">
              <div class="space-y-6">
                <div>
                  <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
                  <div class="mt-1">
                    <input id="username" name="username" type="text" required class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                  </div>
                </div>

                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
                  <div class="mt-1">
                    <input id="email" name="email" type="email" autocomplete="email" required class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                  </div>
                </div>

                <div>
                  <label for="full_name" class="block text-sm font-medium text-gray-700">Full Name</label>
                  <div class="mt-1">
                    <input id="full_name" name="full_name" type="text" required class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                  </div>
                </div>

                <div>
                  <label for="user_type" class="block text-sm font-medium text-gray-700">User Type</label>
                  <div class="mt-1">
                    <select id="user_type" name="user_type" required class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                      <option value="writer">Content Writer</option>
                      <option value="publisher">Publisher</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                  <div class="mt-1">
                    <input id="password" name="password" type="password" autocomplete="new-password" required class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                  </div>
                </div>
              </div>

              <div>
                <button type="submit" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      `,
      metadata: {
        pageType: 'auth',
        requiresAuth: false,
        authAction: 'register'
      }
    };
  }

  async getNotFoundPageData(user: any): Promise<PageData> {
    return {
      title: 'Page Not Found - Free Education Platform',
      description: 'The page you are looking for does not exist',
      content: `
        <div class="min-h-screen flex items-center justify-center bg-gray-50">
          <div class="text-center">
            <div class="mb-8">
              <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <i class="fas fa-search text-blue-600 text-3xl"></i>
              </div>
            </div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Page Not Found</h1>
            <p class="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
            <a href="/" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Go back home
            </a>
          </div>
        </div>
      `,
      metadata: {
        pageType: 'error',
        requiresAuth: false,
        errorCode: 404
      }
    };
  }

  private async getHomeStats(): Promise<any> {
    // Fetch real stats from database
    const subjectsCount = await this.db.prepare('SELECT COUNT(*) as count FROM subjects').first();
    const lessonsCount = await this.db.prepare('SELECT COUNT(*) as count FROM lessons').first();
    
    return {
      subjects: subjectsCount?.count || 15,
      classes: '6-12',
      lessons: lessonsCount?.count || 1000
    };
  }

  private async getFeaturedSubjects(): Promise<any[]> {
    // Fetch featured subjects from database
    const subjects = await this.db.prepare('SELECT * FROM subjects WHERE featured = 1 LIMIT 6').all();
    
    return subjects.results.map((subject: any) => ({
      name: subject.name,
      description: subject.description,
      icon: subject.icon || 'book',
      color: subject.color || 'blue',
      classes: subject.class_levels,
      chapters: subject.chapters_count || 0,
      hours: subject.estimated_hours || 0
    }));
  }
}
