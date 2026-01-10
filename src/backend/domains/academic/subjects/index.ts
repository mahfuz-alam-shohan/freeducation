import type { Env } from '../../../../../shared/types';
import type { ApiModule } from '../../../core/registry';
import { handleContent, handleVideos } from './controller';
import { handleClasses } from '../shared/classes';
import { handleThumbnails } from '../shared/thumbnails';
import { handleFonts } from '../shared/fonts';

const handlers = [handleContent, handleVideos, handleClasses, handleThumbnails, handleFonts];

export const createSubjectsModule = (): ApiModule => ({
  id: 'academic-subjects',
  match: (path) =>
    path.startsWith('/api/content') ||
    path.startsWith('/api/videos') ||
    path.startsWith('/api/classes') ||
    path.startsWith('/api/thumbnails') ||
    path.startsWith('/api/chapter-thumbnails') ||
    path.startsWith('/api/fonts'),
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
