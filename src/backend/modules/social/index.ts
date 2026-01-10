import type { Env } from '../../../shared/types';
import type { ApiModule } from '..';

export const createSocialModule = (): ApiModule => ({
  id: 'social',
  match: (path) => path.startsWith('/api/social'),
  handle: async (_request: Request, _env: Env) => null,
});
