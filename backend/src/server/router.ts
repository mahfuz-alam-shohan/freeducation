/**
 * ===================================
   SERVER ROUTER
   ===================================
 */

import { DatabaseManager } from '../core/database/database_manager';
import { AdminSetupService } from '../api/v1/admin/setup';
import { PageController } from '../core/PageController';
import { corsHeaders, handleCORS } from '../api/middleware/cors';

interface ServerConfig {
  env: any;
}

export class ServerRouter {
  private db: DatabaseManager;
  private adminService: AdminSetupService;
  private pageController: PageController;
  private env: any;

  constructor(config: ServerConfig) {
    this.env = config.env;
    this.db = new DatabaseManager(this.env.DB);
    this.adminService = new AdminSetupService(this.db);
    this.pageController = new PageController({ env: this.env });
  }

  /**
   * Initialize the server router
   */
  async initialize(): Promise<void> {
    await this.db.initialize();
    await this.pageController.initialize();
  }

  /**
   * Handle incoming requests
   */
  async handleRequest(request: Request): Promise<Response> {
    // Handle CORS preflight
    const corsResponse = handleCORS(request);
    if (corsResponse) return corsResponse;

    try {
      const url = new URL(request.url);
      const path = url.pathname;
      const method = request.method;

      // API Routes
      if (path === '/api/v1/admin/setup/check' && method === 'GET') {
        return this.handleSetupCheck();
      }

      if (path === '/api/v1/admin/setup' && method === 'POST') {
        return this.handleAdminSetup(request);
      }

      // Frontend Routes
      if (path === '/' || path.startsWith('/static/') || path.startsWith('/components/')) {
        return this.pageController.handleRequest(path);
      }

      // Default response
      return new Response('Not Found', { status: 404 });

    } catch (error) {
      console.error('Server error:', error);
      return new Response('Internal Server Error', { 
        status: 500,
        headers: corsHeaders()
      });
    }
  }

  /**
   * Handle setup check
   */
  private async handleSetupCheck(): Promise<Response> {
    try {
      const result = await this.adminService.checkAdminSetup();
      
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders()
        }
      });
    } catch (error) {
      console.error('Setup check error:', error);
      return new Response(JSON.stringify({ error: 'Failed to check setup status' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders()
        }
      });
    }
  }

  /**
   * Handle admin setup
   */
  private async handleAdminSetup(request: Request): Promise<Response> {
    try {
      const body = await request.json();
      const result = await this.adminService.createFirstAdmin(body);
      
      return new Response(JSON.stringify(result), {
        status: result.success ? 200 : 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders()
        }
      });
    } catch (error) {
      console.error('Admin setup error:', error);
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Failed to create admin account' 
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders()
        }
      });
    }
  }
}
