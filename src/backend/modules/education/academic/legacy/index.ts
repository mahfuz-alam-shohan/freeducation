import type { Env } from '../../../../../shared/types';
import type { ApiModule } from '../../..';
import * as auth from './auth';
import * as users from './users';
import * as classes from './classes';
import * as content from './content';
import * as videos from './videos';
import * as thumbnails from './thumbnails';
import * as settings from './settings';
import * as setup from './setup';
import * as profile from './profile';
import * as fonts from './fonts';

const findLegacyHandler = (mod: Record<string, unknown>) => {
  return Object.values(mod).find((item) => typeof item === 'function') as
    | ((request: Request, env: Env, path: string) => Promise<Response | null>)
    | undefined;
};

export const createLegacyModule = (): ApiModule => ({
  id: 'legacy-api',
  match: (path) => path.startsWith('/api'),
  handle: async (request, env) => {
    const url = new URL(request.url);
    const path = url.pathname;
    const legacyModules = [auth, users, classes, content, videos, thumbnails, settings, setup, profile, fonts];

    for (const mod of legacyModules) {
      const handler = findLegacyHandler(mod as Record<string, unknown>);
      if (handler) {
        const response = await handler(request, env, path);
        if (response) return response;
      }
    }

    return null;
  },
});
