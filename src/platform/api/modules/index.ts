import type { Env } from '../../shared/types';
import { createStudentModule } from './student';
import { createLegacyModule } from './legacy';

export type ApiModule = {
  id: string;
  match: (path: string) => boolean;
  handle: (request: Request, env: Env) => Promise<Response | null>;
};

export const apiModules: ApiModule[] = [createStudentModule(), createLegacyModule()];
