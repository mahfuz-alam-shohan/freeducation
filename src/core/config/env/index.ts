// Environment-specific configuration
export const ENV_CONFIG = {
  IS_DEVELOPMENT: typeof globalThis !== 'undefined' && globalThis.process?.env?.NODE_ENV === 'development',
  IS_PRODUCTION: typeof globalThis !== 'undefined' && globalThis.process?.env?.NODE_ENV === 'production',
} as const;
