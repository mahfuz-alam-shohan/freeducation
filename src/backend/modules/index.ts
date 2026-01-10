import type { Env } from '../../shared/types';
import { createStudentModule } from './users/student';
import { createSubjectsModule } from './education/academic/subjects';
import { createLegacyModule } from './education/academic/legacy';

export type ApiModule = {
  id: string;
  match: (path: string) => boolean;
  handle: (request: Request, env: Env) => Promise<Response | null>;
};

export const apiModules: ApiModule[] = [createStudentModule(), createSubjectsModule(), createLegacyModule()];
