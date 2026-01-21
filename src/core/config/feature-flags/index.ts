// Feature flags for enabling/disabling functionality
export const FEATURE_FLAGS = {
  // Authentication features
  ENABLE_STUDENT_SIGNUP: true,
  ENABLE_EMAIL_VERIFICATION: true,
  
  // UI features
  ENABLE_DARK_MODE: true,
  ENABLE_NOTIFICATIONS: false,
  
  // Development features
  ENABLE_DEBUG_MODE: false,
  ENABLE_LOGGING: true,
} as const;
