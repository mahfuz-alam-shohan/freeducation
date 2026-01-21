import { adminExists } from "../domains/auth/adminSetup";
import { getAdminSession } from "../api/admin";
import { handleApiRoutes } from "../api";
import { getDeviceType, redirectResponse, serviceError } from "../core/http";
import { SECURITY_MIDDLEWARE, applySecurityToResponse, COMMON_VALIDATION_SCHEMAS } from "../core/middleware";
import type { Env } from "./env";

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

  // Apply security middleware based on route type
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  // Determine security context
  let securityMiddleware = SECURITY_MIDDLEWARE.PUBLIC;
  let securityContext = {};
  
  if (pathname.startsWith('/admin')) {
    securityMiddleware = SECURITY_MIDDLEWARE.ADMIN;
  } else if (pathname.startsWith('/signup') || pathname === '/login' || pathname === '/setup-admin') {
    securityMiddleware = SECURITY_MIDDLEWARE.AUTH;
    if (pathname === '/signup') {
      securityContext = { schema: COMMON_VALIDATION_SCHEMAS.USER_REGISTRATION };
    } else if (pathname === '/signup/verify') {
      securityContext = { schema: COMMON_VALIDATION_SCHEMAS.EMAIL_VERIFICATION };
    } else if (pathname === '/setup-admin') {
      securityContext = { schema: COMMON_VALIDATION_SCHEMAS.USER_REGISTRATION };
    } else if (pathname === '/login') {
      securityContext = { schema: COMMON_VALIDATION_SCHEMAS.USER_LOGIN };
    }
  } else if (pathname.startsWith('/api')) {
    securityMiddleware = SECURITY_MIDDLEWARE.API;
  }

  // Apply security checks
  const securityResponse = await securityMiddleware(request, securityContext);
  if (securityResponse) {
    return applySecurityToResponse(securityResponse);
  }

  const apiResponse = await handleApiRoutes(request, env, { adminReady, device, session });
  if (apiResponse) {
    return applySecurityToResponse(apiResponse);
  }

  if (!adminReady) {
    return applySecurityToResponse(redirectResponse("/setup-admin"));
  }

  return applySecurityToResponse(redirectResponse("/"));
};
