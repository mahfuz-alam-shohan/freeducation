import { adminExists } from "../features/auth/adminSetup";
import { handleAdminRoutes, getAdminSession } from "./admin";
import { handlePublicRoutes } from "./public";
import { handleStudentRoutes } from "./student";
import { getDeviceType, redirectResponse, serviceError } from "../utils";
import type { Env } from "./utils";

export const handleRequest = async (request: Request, env: Env): Promise<Response> => {
  if (!env.DB) {
    return serviceError("Database binding is missing.");
  }

  if (!env.JWT_SECRET) {
    return serviceError("JWT_SECRET is not configured.");
  }

  const adminReady = await adminExists(env.DB);
  const device = getDeviceType(request.headers.get("user-agent"));
  const session = await getAdminSession(request, env);

  const studentResponse = await handleStudentRoutes(request, env, { device, session });
  if (studentResponse) {
    return studentResponse;
  }

  const publicResponse = await handlePublicRoutes(request, { adminReady, device, session });
  if (publicResponse) {
    return publicResponse;
  }

  const adminResponse = await handleAdminRoutes(request, env, { adminReady, device, session });
  if (adminResponse) {
    return adminResponse;
  }

  if (!adminReady) {
    return redirectResponse("/setup-admin");
  }

  return redirectResponse("/");
};
