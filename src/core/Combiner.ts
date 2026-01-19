import { LayoutManager, LayoutData } from './LayoutManager';
import { PageManager, PageData } from './PageManager';

export interface CombinedData {
  layout: LayoutData;
  page: PageData;
  conflicts: string[];
  warnings: string[];
}

export interface RenderResult {
  html: string;
  data: CombinedData;
  errors: string[];
}

export class Combiner {
  private layoutManager: LayoutManager;
  private pageManager: PageManager;

  constructor(env: any) {
    this.layoutManager = new LayoutManager();
    this.pageManager = new PageManager(env);
  }

  async combineAndRender(request: Request, env: any, user: any): Promise<RenderResult> {
    const errors: string[] = [];
    const warnings: string[] = [];
    const conflicts: string[] = [];

    try {
      // Step 1: Fetch layout data
      const layoutData = await this.layoutManager.getLayoutData(request, env, user);
      
      // Step 2: Fetch page data
      const pagePath = new URL(request.url).pathname;
      const pageData = await this.pageManager.getPageData(pagePath, user);

      // Step 3: Check for conflicts
      const conflictCheck = this.checkConflicts(layoutData, pageData);
      conflicts.push(...conflictCheck.conflicts);
      warnings.push(...conflictCheck.warnings);

      // Step 4: Resolve conflicts
      const resolvedData = this.resolveConflicts(layoutData, pageData, conflicts);

      // Step 5: Render final HTML
      const html = this.layoutManager.render(resolvedData.layout, resolvedData.page.content, resolvedData.page);

      return {
        html,
        data: {
          layout: resolvedData.layout,
          page: resolvedData.page,
          conflicts,
          warnings
        },
        errors
      };

    } catch (error: any) {
      errors.push(`Combiner error: ${error.message}`);
      
      // Fallback to error page
      const errorPageData = await this.pageManager.getNotFoundPageData(user);
      const errorLayoutData = await this.layoutManager.getLayoutData(request, env, user);
      
      const html = this.layoutManager.render(errorLayoutData, errorPageData.content, errorPageData);

      return {
        html,
        data: {
          layout: errorLayoutData,
          page: errorPageData,
          conflicts: [],
          warnings: []
        },
        errors
      };
    }
  }

  private checkConflicts(layoutData: LayoutData, pageData: PageData): { conflicts: string[]; warnings: string[] } {
    const conflicts: string[] = [];
    const warnings: string[] = [];

    // Check for title conflicts
    if (layoutData.user && pageData.metadata?.requiresAuth && !layoutData.user) {
      conflicts.push('Page requires authentication but user is not logged in');
    }

    // Check for device-specific conflicts
    if (layoutData.deviceType === 'mobile' && pageData.metadata?.requiresDesktop) {
      warnings.push('Page is optimized for desktop but viewed on mobile');
    }

    // Check for script conflicts
    if (pageData.scripts && pageData.scripts.length > 5) {
      warnings.push('Page has many scripts which may affect performance');
    }

    // Check for style conflicts
    if (pageData.styles && pageData.styles.length > 3) {
      warnings.push('Page has many styles which may affect performance');
    }

    return { conflicts, warnings };
  }

  private resolveConflicts(layoutData: LayoutData, pageData: PageData, conflicts: string[]): { layout: LayoutData; page: PageData } {
    const resolvedLayout = { ...layoutData };
    const resolvedPage = { ...pageData };

    // Resolve authentication conflicts
    if (conflicts.some(c => c.includes('requires authentication'))) {
      // Redirect to login page
      resolvedPage.content = this.getAuthRequiredContent();
      resolvedPage.title = 'Authentication Required';
      resolvedPage.metadata = { ...resolvedPage.metadata, requiresAuth: true };
    }

    // Resolve device conflicts
    if (conflicts.some(c => c.includes('optimized for desktop'))) {
      // Add mobile optimization warning
      resolvedPage.content = this.addMobileOptimizationWarning(resolvedPage.content);
    }

    return { layout: resolvedLayout, page: resolvedPage };
  }

  private getAuthRequiredContent(): string {
    return `
      <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8">
          <div class="text-center">
            <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i class="fas fa-lock text-blue-600 text-3xl"></i>
            </div>
            <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Authentication Required
            </h2>
            <p class="mt-2 text-center text-sm text-gray-600">
              Please sign in to access this page.
            </p>
            <div class="mt-8 space-y-4">
              <a href="/login" class="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Sign In
              </a>
              <a href="/register" class="w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Create Account
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private addMobileOptimizationWarning(content: string): string {
    return `
      <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <div class="flex">
          <div class="flex-shrink-0">
            <i class="fas fa-exclamation-triangle text-yellow-400"></i>
          </div>
          <div class="ml-3">
            <p class="text-sm text-yellow-700">
              This page is optimized for desktop. Some features may not work perfectly on mobile.
            </p>
          </div>
        </div>
      </div>
      ${content}
    `;
  }

  // Helper method to get not found page data
  private async getNotFoundPageData(user: any): Promise<PageData> {
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
}
