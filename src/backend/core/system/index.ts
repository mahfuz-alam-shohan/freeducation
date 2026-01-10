import type { Env } from '../../../shared/types';
import type { ApiModule } from '../registry';
import { handleAuth } from './auth';
import { handleSettings } from './settings';
import { handleSetup } from './setup';
import { handleMigrate } from './migrate';
import { handleProfile } from '../users/shared/profile';
import '../users/schema';
import '../../domains/academic/shared/schema';
import '../../domains/social/schema';

const handlers = [handleAuth, handleSettings, handleSetup, handleProfile, handleMigrate];

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
