import type { Env } from '../../shared/types';
import { createSystemModule } from './system';
import { createAdminModule } from './users/admin';
import { createStudentModule } from './users/student';
import { createTeacherModule } from './users/teacher';
import { createSubjectsModule } from './education/academic/subjects';

export type ApiModule = {
  id: string;
  match: (path: string) => boolean;
  handle: (request: Request, env: Env) => Promise<Response | null>;
};

export const apiModules: ApiModule[] = [
  createSystemModule(),
  createAdminModule(),
  createTeacherModule(),
  createStudentModule(),
  createSubjectsModule(),
];
