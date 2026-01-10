import type { Env } from '../../../shared/types';
import { syncDatabaseSchema } from '../../../shared/db/migrator';
import { apiHeaders } from '../users/shared/utils';

export const handleSystemSync = async (request: Request, env: Env, path: string): Promise<Response | null> => {
  if (path === '/api/system/sync' && request.method === 'GET') {
    await syncDatabaseSchema(env);
    return Response.json({ success: true }, { headers: apiHeaders });
  }

  return null;
};
