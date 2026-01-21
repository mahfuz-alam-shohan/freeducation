import { ValidationSchema, ValidationRule } from "../../core/middleware/validation";

// User validation schemas
export const userRegistrationSchema: ValidationSchema = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 100,
    sanitize: true,
  },
  email: {
    required: true,
    minLength: 5,
    maxLength: 255,
    sanitize: true,
  },
  password: {
    required: true,
    minLength: 8,
    maxLength: 128,
  },
  dateOfBirth: {
    required: true,
    minLength: 10,
    maxLength: 10,
  },
};

export const userLoginSchema: ValidationSchema = {
  email: {
    required: true,
    minLength: 5,
    maxLength: 255,
    sanitize: true,
  },
  password: {
    required: true,
    minLength: 1,
    maxLength: 128,
  },
};

export const emailVerificationSchema: ValidationSchema = {
  email: {
    required: true,
    minLength: 5,
    maxLength: 255,
    sanitize: true,
  },
  code: {
    required: true,
    minLength: 6,
    maxLength: 6,
    sanitize: true,
  },
};

// Subject management validation schemas
export const chapterSchema: ValidationSchema = {
  title: {
    required: true,
    minLength: 1,
    maxLength: 200,
    sanitize: true,
  },
  slug: {
    required: true,
    minLength: 1,
    maxLength: 200,
    sanitize: true,
  },
  position: {
    required: false,
    sanitize: true,
  },
  summary: {
    required: false,
    maxLength: 1000,
    sanitize: true,
  },
  classSubjectId: {
    required: true,
    sanitize: true,
  },
};

export const topicSchema: ValidationSchema = {
  title: {
    required: true,
    minLength: 1,
    maxLength: 200,
    sanitize: true,
  },
  slug: {
    required: true,
    minLength: 1,
    maxLength: 200,
    sanitize: true,
  },
  position: {
    required: false,
    sanitize: true,
  },
  chapterId: {
    required: true,
    sanitize: true,
  },
};

export const contentSchema: ValidationSchema = {
  title: {
    required: true,
    minLength: 1,
    maxLength: 200,
    sanitize: true,
  },
  contentType: {
    required: true,
    minLength: 1,
    maxLength: 50,
    sanitize: true,
  },
  body: {
    required: false,
    maxLength: 10000,
    sanitize: true,
  },
  resourceUrl: {
    required: false,
    maxLength: 500,
    sanitize: true,
  },
  position: {
    required: false,
    sanitize: true,
  },
  chapterId: {
    required: false,
    sanitize: true,
  },
  topicId: {
    required: false,
    sanitize: true,
  },
};

// Admin setup validation schema
export const adminSetupSchema: ValidationSchema = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 100,
    sanitize: true,
  },
  email: {
    required: true,
    minLength: 5,
    maxLength: 255,
    sanitize: true,
  },
  password: {
    required: true,
    minLength: 8,
    maxLength: 128,
  },
  dateOfBirth: {
    required: true,
    minLength: 10,
    maxLength: 10,
  },
  setupToken: {
    required: false,
    minLength: 1,
    maxLength: 100,
    sanitize: true,
  },
};

// User management validation schemas
export const userDeleteSchema: ValidationSchema = {
  role: {
    required: true,
    minLength: 1,
    maxLength: 20,
    sanitize: true,
  },
  email: {
    required: true,
    minLength: 5,
    maxLength: 255,
    sanitize: true,
  },
  adminPassword: {
    required: true,
    minLength: 1,
    maxLength: 128,
  },
};

// Export all schemas for easy import
export const validationSchemas = {
  userRegistration: userRegistrationSchema,
  userLogin: userLoginSchema,
  emailVerification: emailVerificationSchema,
  chapter: chapterSchema,
  topic: topicSchema,
  content: contentSchema,
  adminSetup: adminSetupSchema,
  userDelete: userDeleteSchema,
} as const;
