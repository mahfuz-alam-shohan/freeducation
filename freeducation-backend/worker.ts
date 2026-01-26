import { bootstrap } from './src/app/bootstrap';
import { logger } from './src/shared/utils/logger';
import type { Env } from './src/shared/types/env';

let appPromise: Promise<{ handle: (request: Request) => Promise<Response> }> | null = null;

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    try {
      if (!appPromise) {
        appPromise = bootstrap(env);
      }
      const app = await appPromise;
      return await app.handle(request);
    } catch (error) {
      logger.error('Worker error', { error });
      return new Response(JSON.stringify({
        success: false,
        error: 'Service unavailable'
      }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};
