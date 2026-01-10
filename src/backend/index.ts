import type { Env } from '../shared/types';
import { apiModules } from './core/registry';

export const handleApiRequest = async (request: Request, env: Env) => {
  const url = new URL(request.url);
  const path = url.pathname;

  if (!path.startsWith('/api')) {
    return null;
  }

  for (const module of apiModules) {
    if (!module.match(path)) {
      continue;
    }
    const response = await module.handle(request, env);
    if (response) {
      return response;
    }
  }

  return null;
};
