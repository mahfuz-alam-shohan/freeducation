/**
 * ===================================
   REQUEST ROUTER
   ===================================
 */

import { DatabaseManager } from './database/database_manager';
import { AdminSetupService } from '../api/v1/admin/setup';
import { FrontendRenderer } from './FrontendRenderer';
import { corsHeaders, handleCORS } from '../api/middleware/cors';

interface RequestRouterConfig {
  env: any;
}

export class RequestRouter {
  private db: DatabaseManager;
  private adminService: AdminSetupService;
  private frontendRenderer: FrontendRenderer;
  private env: any;

  constructor(config: RequestRouterConfig) {
    this.env = config.env;
    this.db = new DatabaseManager(this.env.DB);
    this.adminService = new AdminSetupService(this.db);
    this.frontendRenderer = new FrontendRenderer({ env: this.env });
  }

  /**
   * Initialize the request router
   */
  async initialize(): Promise<void> {
    await this.db.initialize();
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

      // Frontend Routes - delegate to frontend renderer
      if (path === '/' || path.startsWith('/static/') || path.startsWith('/components/')) {
        return this.frontendRenderer.handleRequest(path);
      }

      // Default response
      return new Response('Not Found', { status: 404 });

    } catch (error) {
      console.error('Request router error:', error);
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
