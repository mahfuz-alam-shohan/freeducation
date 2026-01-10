import type { Env } from '../../../shared/types';
import type { ApiModule } from '..';

export const createResearchModule = (): ApiModule => ({
  id: 'research',
  match: (path) => path.startsWith('/api/research'),
  handle: async (_request: Request, _env: Env) => null,
});
