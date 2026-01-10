import type { Env } from '../../../../../shared/types';
import type { ApiModule } from '../../..';
import { handleContent, handleVideos } from './controller';

const handlers = [handleContent, handleVideos];

export const createSubjectsModule = (): ApiModule => ({
  id: 'academic-subjects',
  match: (path) => path.startsWith('/api/content') || path.startsWith('/api/videos'),
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
