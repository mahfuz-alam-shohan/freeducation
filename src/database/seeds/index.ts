// Export all seed data for easy importing
export * from './subjects';
export * from './users';

// Re-export commonly used seed data
export { 
  DEFAULT_SUBJECTS, 
  SUBJECT_CATEGORIES, 
  CLASS_LEVELS, 
  SUBJECT_GROUPS 
} from './subjects';

export { 
  DEFAULT_ADMIN, 
  SAMPLE_USERS, 
  USER_ROLES 
} from './users';
