import type { Env } from '../../../../shared/types';
import { handleCreateUser } from './handlers/create-user';
import { handleDeleteStudent } from './handlers/delete-student';
import { handleListUsers } from './handlers/list-users';
import { handleRevealPassword } from './handlers/reveal-password';
import { handleResetPassword } from './handlers/reset-password';
import { handleUpdateTeacher } from './handlers/update-teacher';
import { handleUserDetailsGet, handleUserDetailsUpdate } from './handlers/user-details';

export const handleAdminUsers = async (request: Request, env: Env, path: string): Promise<Response | null> => {
  if (path === '/api/users' && request.method === 'GET') {
    return handleListUsers(request, env);
  }

  if (path === '/api/users' && request.method === 'POST') {
    return handleCreateUser(request, env);
  }

  if (path === '/api/users' && request.method === 'PUT') {
    return handleUpdateTeacher(request, env);
  }

  if (path === '/api/users/reveal' && request.method === 'POST') {
    return handleRevealPassword(request, env);
  }

  if (path === '/api/users/reset' && request.method === 'POST') {
    return handleResetPassword(request, env);
  }

  if (path === '/api/users/details' && request.method === 'GET') {
    return handleUserDetailsGet(request, env);
  }

  if (path === '/api/users/details' && request.method === 'PUT') {
    return handleUserDetailsUpdate(request, env);
  }

  if (path === '/api/users/delete' && request.method === 'POST') {
    return handleDeleteStudent(request, env);
  }

  return null;
};
