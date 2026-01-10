import type { Env } from '../../../shared/types';
import { apiHeaders } from '../users/shared/utils';
import { syncDatabaseSchema } from '../db/migrator';

const isAuthorized = (request: Request, env: Env) => {
  const adminKey = env.ADMIN_KEY;
  if (!adminKey) return false;
  const headerKey = request.headers.get('x-admin-key');
  return headerKey === adminKey;
};

export const handleMigrate = async (request: Request, env: Env, path: string): Promise<Response | null> => {
  if (path !== '/api/system/migrate' || request.method !== 'GET') return null;

  if (!isAuthorized(request, env)) {
    return Response.json({ success: false, error: 'Unauthorized' }, { status: 401, headers: apiHeaders });
  }

  const report = await syncDatabaseSchema(env);
  return Response.json({ success: true, report }, { headers: apiHeaders });
};
