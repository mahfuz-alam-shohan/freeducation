// Main database exports
export { Database, getDatabase } from './Database';

// Model exports
export * from './models';

// Seed data exports
export * from './seeds';

// Migration exports
export * from './migrations';

// Re-export commonly used types and functions
export type {
  User,
  Subject,
  Assignment,
  Submission,
  SocialPost,
  Comment,
  Notification
} from './models';

export {
  DEFAULT_SUBJECTS,
  DEFAULT_ADMIN,
  USER_ROLES,
  SUBJECT_CATEGORIES,
  CLASS_LEVELS
} from './seeds';
