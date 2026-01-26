import { z } from 'zod';
import type { RequestContext } from '../../../shared/kernel/router';
import { jsonResponse, getCookie, setCookie } from '../../../shared/kernel/http';
import type { AppConfig } from '../../../config/env';
import { AuthService } from '../application/auth.service';

const bootstrapSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(2),
  lastName: z.string().min(2)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export class AuthController {
  constructor(private authService: AuthService, private config: AppConfig) {}

  async bootstrap(ctx: RequestContext): Promise<Response> {
    try {
      const payload = await ctx.request.json();
      const data = bootstrapSchema.parse(payload);
      const secretHeader = ctx.request.headers.get('X-Admin-Setup-Secret') || undefined;

      const user = await this.authService.bootstrapAdmin(data, secretHeader);
      return jsonResponse(201, { success: true, user });
    } catch (error) {
      return jsonResponse(400, {
        success: false,
        error: error instanceof Error ? error.message : 'Invalid request'
      });
    }
  }

  async bootstrapStatus(ctx: RequestContext): Promise<Response> {
    try {
      const canBootstrap = await this.authService.canBootstrap();
      return jsonResponse(200, { success: true, canBootstrap });
    } catch (error) {
      return jsonResponse(500, { success: false, error: 'Failed to check bootstrap status' });
    }
  }

  async login(ctx: RequestContext): Promise<Response> {
    try {
      const payload = await ctx.request.json();
      const data = loginSchema.parse(payload);
      const url = new URL(ctx.request.url);

      const session = await this.authService.login(data.email, data.password, {
        userAgent: ctx.request.headers.get('User-Agent') || undefined,
        ipAddress: ctx.request.headers.get('CF-Connecting-IP') || undefined
      });

      const headers = new Headers({ 'Content-Type': 'application/json' });
      setCookie(headers, this.config.sessionCookieName, session.token, {
        httpOnly: true,
        secure: url.protocol === 'https:',
        sameSite: 'Strict',
        path: '/',
        maxAge: this.config.sessionTtlDays * 24 * 60 * 60
      });

      return new Response(JSON.stringify({
        success: true,
        user: session.user,
        expiresAt: session.expiresAt
      }), { status: 200, headers });
    } catch (error) {
      return jsonResponse(401, {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed'
      });
    }
  }

  async logout(ctx: RequestContext): Promise<Response> {
    const token = getCookie(ctx.request, this.config.sessionCookieName);
    const url = new URL(ctx.request.url);
    if (token) {
      await this.authService.logout(token);
    }

    const headers = new Headers({ 'Content-Type': 'application/json' });
    setCookie(headers, this.config.sessionCookieName, '', {
      httpOnly: true,
      secure: url.protocol === 'https:',
      sameSite: 'Strict',
      path: '/',
      maxAge: 0
    });

    return new Response(JSON.stringify({ success: true }), { status: 200, headers });
  }

  async session(ctx: RequestContext): Promise<Response> {
    const token = getCookie(ctx.request, this.config.sessionCookieName);
    if (!token) {
      return jsonResponse(200, { success: false, error: 'No session' });
    }

    const session = await this.authService.validateSession(token);
    if (!session) {
      return jsonResponse(200, { success: false, error: 'Invalid session' });
    }

    return jsonResponse(200, { success: true, user: session.user, expiresAt: session.expiresAt });
  }
}
