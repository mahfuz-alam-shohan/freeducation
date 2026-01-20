// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Session Configuration
export const SESSION_CONFIG = {
  COOKIE_NAME: 'admin_session',
  MAX_AGE: 604800, // 7 days in seconds
  PATH: '/',
} as const;

// Security Configuration
export const SECURITY_CONFIG = {
  PBKDF2_ITERATIONS: 60000,
  SALT_LENGTH: 16,
  DERIVED_KEY_LENGTH: 256,
} as const;

// Email Configuration
export const EMAIL_CONFIG = {
  VERIFICATION_CODE_LENGTH: 6,
  VERIFICATION_CODE_MAX: 1_000_000,
} as const;
