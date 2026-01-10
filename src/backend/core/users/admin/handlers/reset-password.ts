import type { Env } from '../../../../../shared/types';
import { apiHeaders, buildPasswordHash, ensureAdmin, getAuthPayload } from '../../shared/utils';
import { hashPassword } from '../../../../../shared/auth';

export const handleResetPassword = async (request: Request, env: Env): Promise<Response> => {
  const payload = await getAuthPayload(request, env);
  if (!ensureAdmin(payload)) {
    return Response.json({ success: false, error: 'Unauthorized' }, { status: 401, headers: apiHeaders });
  }

  const { adminPassword, targetId, newPassword } = (await request.json()) as any;

  const admin = await env.DB.prepare('SELECT password_hash FROM users WHERE id = ?').bind(payload.id).first();
  if (!admin) {
    return Response.json({ success: false, error: 'Admin not found' }, { status: 401, headers: apiHeaders });
  }

  const [saltHex, originalHash] = (admin.password_hash as string).split(':');
  const hashCheck = await hashPassword(adminPassword, saltHex);
  if (hashCheck !== originalHash) {
    return Response.json({ success: false, error: 'Incorrect Admin Password' }, { status: 401, headers: apiHeaders });
  }

  if (newPassword.length < 8) {
    return Response.json({ success: false, error: 'New password too short' }, { status: 400, headers: apiHeaders });
  }

  const { passwordHash } = await buildPasswordHash(newPassword);
  await env.DB.prepare('UPDATE users SET password_hash = ? WHERE id = ?').bind(passwordHash, targetId).run();

  return Response.json({ success: true }, { headers: apiHeaders });
};
