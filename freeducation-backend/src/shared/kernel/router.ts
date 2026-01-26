import type { Env } from '../types/env';
import type { AuthSession } from '../types/auth';

export interface RequestContext {
  request: Request;
  env: Env;
  params: Record<string, string>;
  query: URLSearchParams;
  auth?: AuthSession;
}

export type Handler = (ctx: RequestContext) => Promise<Response>;

interface Route {
  method: string;
  path: string;
  segments: string[];
  handler: Handler;
}

export class Router {
  private routes: Route[] = [];

  add(method: string, path: string, handler: Handler): void {
    const normalized = path.endsWith('/') && path.length > 1 ? path.slice(0, -1) : path;
    const segments = normalized.split('/').filter((segment) => segment.length > 0);
    this.routes.push({ method: method.toUpperCase(), path: normalized, segments, handler });
  }

  async handle(request: Request, env: Env): Promise<Response | null> {
    const url = new URL(request.url);
    const path = url.pathname.endsWith('/') && url.pathname.length > 1 ? url.pathname.slice(0, -1) : url.pathname;
    const method = request.method.toUpperCase();
    const pathSegments = path.split('/').filter((segment) => segment.length > 0);

    for (const route of this.routes) {
      if (route.method !== method) {
        continue;
      }

      if (route.segments.length !== pathSegments.length) {
        continue;
      }

      const params: Record<string, string> = {};
      let match = true;

      for (let i = 0; i < route.segments.length; i += 1) {
        const routeSegment = route.segments[i];
        const pathSegment = pathSegments[i];

        if (routeSegment.startsWith(':')) {
          params[routeSegment.slice(1)] = decodeURIComponent(pathSegment);
        } else if (routeSegment !== pathSegment) {
          match = false;
          break;
        }
      }

      if (!match) {
        continue;
      }

      const ctx: RequestContext = {
        request,
        env,
        params,
        query: url.searchParams
      };

      return await route.handler(ctx);
    }

    return null;
  }
}
