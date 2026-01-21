import { handleAdminRoutes } from './admin';
import { handlePublicRoutes } from './public';
import { handleStudentRoutes } from './student';
import type { Env } from '../app/env';
import type { DeviceType } from '../core/types/layout';
import type { AdminSession } from '../core/security/session';

export type ApiContext = {
  adminReady: boolean;
  device: DeviceType;
  session: AdminSession | null;
};

export const handleApiRoutes = async (
  request: Request,
  env: Env,
  context: ApiContext,
): Promise<Response | null> => {
  // Try student routes first (signup, verification)
  const studentResponse = await handleStudentRoutes(request, env, context);
  if (studentResponse) {
    return studentResponse;
  }

  // Try public routes (home, health, api-docs)
  const publicResponse = await handlePublicRoutes(request, context);
  if (publicResponse) {
    return publicResponse;
  }

  // Try admin routes (admin panel, setup, login)
  const adminResponse = await handleAdminRoutes(request, env, context);
  if (adminResponse) {
    return adminResponse;
  }

  return null;
};
