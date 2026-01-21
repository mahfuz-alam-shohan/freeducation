// Security Configuration
export const SECURITY_CONFIG = {
  PBKDF2_ITERATIONS: 60000,
  SALT_LENGTH: 16,
  DERIVED_KEY_LENGTH: 256,
} as const;
