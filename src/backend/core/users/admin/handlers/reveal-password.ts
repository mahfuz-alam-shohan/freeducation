import type { Env } from '../../../../../shared/types';
import { apiHeaders, ensureAdmin, getAuthPayload } from '../../shared/utils';
import { hashPassword } from '../../../../../shared/auth';

export const handleRevealPassword = async (request: Request, env: Env): Promise<Response> => {
  const payload = await getAuthPayload(request, env);
  if (!ensureAdmin(payload)) {
    return Response.json({ success: false, error: 'Unauthorized' }, { status: 401, headers: apiHeaders });
  }

  const { adminPassword, targetId } = (await request.json()) as any;

  const admin = await env.DB.prepare('SELECT password_hash FROM users WHERE id = ?').bind(payload.id).first();
  if (!admin) {
    return Response.json({ success: false, error: 'Admin not found' }, { status: 401, headers: apiHeaders });
  }

  const [saltHex, originalHash] = (admin.password_hash as string).split(':');
  const hashCheck = await hashPassword(adminPassword, saltHex);
  if (hashCheck !== originalHash) {
    return Response.json({ success: false, error: 'Incorrect Admin Password' }, { status: 401, headers: apiHeaders });
  }

  const target = await env.DB.prepare('SELECT password_hash FROM users WHERE id = ?').bind(targetId).first();
  if (!target) {
    return Response.json({ success: false, error: 'User not found' }, { status: 404, headers: apiHeaders });
  }

  return Response.json({ success: true, hash: target.password_hash }, { headers: apiHeaders });
};
