import type { Env } from '../../../../shared/types';
import type { ApiModule } from '../../registry';
import { handleAdminUsers } from './controller';
import '../schema';

const handlers = [handleAdminUsers];

export const createAdminModule = (): ApiModule => ({
  id: 'admin-users',
  match: (path) => path.startsWith('/api/users'),
  handle: async (request, env) => {
    const url = new URL(request.url);
    const path = url.pathname;
    for (const handler of handlers) {
      const response = await handler(request, env as Env, path);
      if (response) return response;
    }
    return null;
  },
});
