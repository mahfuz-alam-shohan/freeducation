import { createRateLimitMiddleware, RATE_LIMITS } from './rateLimit';
import { validateFormData, COMMON_VALIDATION_SCHEMAS, ValidationError } from './validation';
import { applySecurityHeaders } from './securityHeaders';
import { extractCSRFToken, getCSRFCookie, validateCSRFToken } from './csrf';
import { jsonResponse } from '../http/response';

export { COMMON_VALIDATION_SCHEMAS, ValidationError } from './validation';

// Generate a secure nonce for CSP
export const generateNonce = (): string => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array));
};

export interface SecurityMiddlewareConfig {
  enableRateLimit?: boolean;
  enableCSRF?: boolean;
  enableSecurityHeaders?: boolean;
  enableValidation?: boolean;
  rateLimitType?: keyof typeof RATE_LIMITS;
}

export const createSecurityMiddleware = (config: SecurityMiddlewareConfig = {}) => {
  const {
    enableRateLimit = true,
    enableCSRF = false, // Disabled by default for GET requests
    enableSecurityHeaders = true,
    enableValidation = false,
    rateLimitType = 'GENERAL',
  } = config;

  const rateLimitMiddleware = enableRateLimit ? createRateLimitMiddleware(RATE_LIMITS[rateLimitType]) : null;

  return async (request: Request, context?: { schema?: any }): Promise<Response | null> => {
    // Rate limiting
    if (rateLimitMiddleware) {
      const rateLimitResponse = rateLimitMiddleware(request);
      if (rateLimitResponse) {
        return rateLimitResponse;
      }
    }

    // CSRF protection (for state-changing requests)
    if (enableCSRF && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
      const csrfToken = await extractCSRFToken(request);
      const csrfCookie = getCSRFCookie(request);

      if (!csrfToken || !csrfCookie) {
        return jsonResponse({ error: 'CSRF token missing' }, 403);
      }

      const isValid = validateCSRFToken(csrfToken, csrfCookie);
      if (!isValid) {
        return jsonResponse({ error: 'Invalid CSRF token' }, 403);
      }
    }

    // Input validation
    if (enableValidation && context?.schema && ['POST', 'PUT', 'PATCH'].includes(request.method)) {
      try {
        const formData = await request.clone().formData().catch(() => null);
        if (formData) {
          const errors = validateFormData(formData, context.schema);
          if (errors.length > 0) {
            return jsonResponse({ 
              error: 'Validation failed', 
              errors: errors.map(e => ({ field: e.field, message: e.message }))
            }, 400);
          }
        }
      } catch (error) {
        // If validation fails due to malformed data, return error
        return jsonResponse({ error: 'Invalid request data' }, 400);
      }
    }

    return null; // No security issues detected
  };
};

// Apply security headers to response
export const applySecurityToResponse = (response: Response): Response => {
  return applySecurityHeaders(response);
};

// Predefined security middleware configurations
export const SECURITY_MIDDLEWARE = {
  // For authentication endpoints
  AUTH: createSecurityMiddleware({
    enableRateLimit: true,
    rateLimitType: 'AUTH',
    enableCSRF: true,
    enableValidation: true,
  }),

  // For general API endpoints
  API: createSecurityMiddleware({
    enableRateLimit: true,
    rateLimitType: 'API',
    enableCSRF: true,
    enableSecurityHeaders: true,
  }),

  // For public endpoints
  PUBLIC: createSecurityMiddleware({
    enableRateLimit: true,
    rateLimitType: 'GENERAL',
    enableSecurityHeaders: true,
  }),

  // For admin endpoints
  ADMIN: createSecurityMiddleware({
    enableRateLimit: true,
    rateLimitType: 'API',
    enableCSRF: true,
    enableSecurityHeaders: true,
    enableValidation: true,
  }),
} as const;
