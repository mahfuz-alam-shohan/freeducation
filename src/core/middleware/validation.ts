export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  email?: boolean;
  numeric?: boolean;
  alphanumeric?: boolean;
  sanitize?: boolean;
}

export interface ValidationSchema {
  [fieldName: string]: ValidationRule;
}

export interface FieldValidationError {
  field: string;
  message: string;
  value?: any;
}

export class ValidationError extends Error {
  public errors: FieldValidationError[];

  constructor(errors: FieldValidationError[]) {
    super('Validation failed');
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const sanitizeString = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, ''); // Remove event handlers
};

export const validateField = (fieldName: string, value: any, rule: ValidationRule): FieldValidationError | null => {
  const errors: string[] = [];

  // Required validation
  if (rule.required && (value === undefined || value === null || value === '')) {
    errors.push(`${fieldName} is required`);
  }

  // Skip other validations if field is empty and not required
  if (!rule.required && (value === undefined || value === null || value === '')) {
    return null;
  }

  // Type validation
  if (typeof value !== 'string') {
    errors.push(`${fieldName} must be a string`);
  } else {
    const strValue = value as string;

    // Length validation
    if (rule.minLength && strValue.length < rule.minLength) {
      errors.push(`${fieldName} must be at least ${rule.minLength} characters long`);
    }

    if (rule.maxLength && strValue.length > rule.maxLength) {
      errors.push(`${fieldName} must not exceed ${rule.maxLength} characters`);
    }

    // Pattern validation
    if (rule.pattern && !rule.pattern.test(strValue)) {
      errors.push(`${fieldName} format is invalid`);
    }

    // Email validation
    if (rule.email && !validateEmail(strValue)) {
      errors.push(`${fieldName} must be a valid email address`);
    }

    // Numeric validation
    if (rule.numeric && !/^\d+$/.test(strValue)) {
      errors.push(`${fieldName} must contain only numbers`);
    }

    // Alphanumeric validation
    if (rule.alphanumeric && !/^[a-zA-Z0-9]+$/.test(strValue)) {
      errors.push(`${fieldName} must contain only letters and numbers`);
    }

    // Sanitization
    if (rule.sanitize) {
      const sanitized = sanitizeString(strValue);
      if (sanitized !== strValue) {
        errors.push(`${fieldName} contains invalid characters`);
      }
    }
  }

  return errors.length > 0 ? { field: fieldName, message: errors[0], value } : null;
};

export const validateFormData = (formData: FormData | Record<string, any>, schema: ValidationSchema): FieldValidationError[] => {
  const errors: FieldValidationError[] = [];

  // Convert FormData to object if needed
  const data: Record<string, any> = formData instanceof FormData 
    ? Array.from(formData.entries()).reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {} as Record<string, any>)
    : formData;

  // Validate each field
  Object.entries(schema).forEach(([fieldName, rule]) => {
    const error = validateField(fieldName, data[fieldName], rule);
    if (error) {
      errors.push(error);
    }
  });

  return errors;
};

// Common validation schemas
export const COMMON_VALIDATION_SCHEMAS = {
  USER_REGISTRATION: {
    name: { required: true, minLength: 2, maxLength: 100, sanitize: true },
    email: { required: true, email: true, maxLength: 255 },
    password: { required: true, minLength: 8, maxLength: 128 },
    dateOfBirth: { required: true, pattern: /^\d{4}-\d{2}-\d{2}$/ },
  },

  USER_LOGIN: {
    email: { required: true, email: true, maxLength: 255 },
    password: { required: true, minLength: 1 },
  },

  EMAIL_VERIFICATION: {
    email: { required: true, email: true, maxLength: 255 },
    code: { required: true, numeric: true, minLength: 6, maxLength: 6 },
  },

  SUBJECT_CREATION: {
    name: { required: true, minLength: 2, maxLength: 200, sanitize: true },
    slug: { required: true, minLength: 2, maxLength: 100, pattern: /^[a-z0-9-]+$/, alphanumeric: false },
    description: { maxLength: 1000, sanitize: true },
  },

  CHAPTER_CREATION: {
    title: { required: true, minLength: 2, maxLength: 200, sanitize: true },
    slug: { required: true, minLength: 2, maxLength: 100, pattern: /^[a-z0-9-]+$/, alphanumeric: false },
    summary: { maxLength: 1000, sanitize: true },
    position: { required: true, numeric: true },
  },
} as const;
