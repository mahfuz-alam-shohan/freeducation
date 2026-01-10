import type { Env } from '../../../shared/types';
import type { ApiModule } from '..';
import { handleAuth } from './auth';
import { handleSettings } from './settings';
import { handleSetup } from './setup';
import { handleSystemSync } from './sync';
import { handleProfile } from '../users/shared/profile';
import '../users/schema';
import '../education/shared/schema';

const handlers = [handleAuth, handleSettings, handleSetup, handleSystemSync, handleProfile];

export const createSystemModule = (): ApiModule => ({
  id: 'system',
  match: (path) => path.startsWith('/api'),
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
