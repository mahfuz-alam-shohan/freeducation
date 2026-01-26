import { z } from 'zod';
import type { RequestContext } from '../../../shared/kernel/router';
import { jsonResponse } from '../../../shared/kernel/http';
import { UserService } from '../application/user.service';

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['admin', 'teacher', 'student']),
  firstName: z.string().min(2),
  lastName: z.string().min(2)
});

const updateUserSchema = z.object({
  email: z.string().email().optional(),
  role: z.enum(['admin', 'teacher', 'student']).optional(),
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  isActive: z.boolean().optional()
});

export class UserController {
  constructor(private userService: UserService) {}

  async list(ctx: RequestContext): Promise<Response> {
    const limit = Number(ctx.query.get('limit') || 20);
    const offset = Number(ctx.query.get('offset') || 0);
    const search = ctx.query.get('q') || undefined;
    const includeInactive = ctx.query.get('includeInactive') === 'true';

    const result = await this.userService.listUsers(limit, offset, search, includeInactive);

    return jsonResponse(200, {
      success: true,
      data: result.users,
      pagination: {
        limit,
        offset,
        total: result.total
      }
    });
  }

  async create(ctx: RequestContext): Promise<Response> {
    try {
      const payload = await ctx.request.json();
      const data = createUserSchema.parse(payload);

      const user = await this.userService.createUser(data);
      return jsonResponse(201, { success: true, data: user });
    } catch (error) {
      return jsonResponse(400, { success: false, error: error instanceof Error ? error.message : 'Invalid request' });
    }
  }

  async get(ctx: RequestContext): Promise<Response> {
    const id = Number(ctx.params.id);
    if (!Number.isFinite(id)) {
      return jsonResponse(400, { success: false, error: 'Invalid user id' });
    }

    const user = await this.userService.getUser(id);
    if (!user) {
      return jsonResponse(404, { success: false, error: 'User not found' });
    }

    return jsonResponse(200, { success: true, data: user });
  }

  async update(ctx: RequestContext): Promise<Response> {
    const id = Number(ctx.params.id);
    if (!Number.isFinite(id)) {
      return jsonResponse(400, { success: false, error: 'Invalid user id' });
    }

    try {
      const payload = await ctx.request.json();
      const data = updateUserSchema.parse(payload);
      const user = await this.userService.updateUser(id, data);

      if (!user) {
        return jsonResponse(404, { success: false, error: 'User not found' });
      }

      return jsonResponse(200, { success: true, data: user });
    } catch (error) {
      return jsonResponse(400, { success: false, error: error instanceof Error ? error.message : 'Invalid request' });
    }
  }
}
