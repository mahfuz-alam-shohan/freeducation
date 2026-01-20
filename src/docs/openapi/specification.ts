import type { OpenAPIDocument } from './types';

export const createOpenAPIDocument = (): OpenAPIDocument => ({
  openapi: '3.0.0',
  info: {
    title: 'FreeEducation API',
    version: '1.0.0',
    description: 'Educational platform API for managing students, teachers, content, and assessments',
    contact: {
      name: 'FreeEducation Team',
      email: 'support@freeducation.org',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: 'https://freeducation.org',
      description: 'Production server',
    },
    {
      url: 'https://dev.freeducation.org',
      description: 'Development server',
    },
    {
      url: 'http://localhost:8787',
      description: 'Local development',
    },
  ],
  tags: [
    {
      name: 'Authentication',
      description: 'User authentication and session management',
    },
    {
      name: 'Users',
      description: 'User management (students, teachers, admins)',
    },
    {
      name: 'Subjects',
      description: 'Educational subjects and curriculum management',
    },
    {
      name: 'Content',
      description: 'Educational content (chapters, topics, materials)',
    },
    {
      name: 'Assessments',
      description: 'Exams, quizzes, and assessments',
    },
  ],
  paths: {
    // Authentication endpoints
    '/login': {
      post: {
        tags: ['Authentication'],
        summary: 'User login',
        description: 'Authenticate user and create session',
        requestBody: {
          required: true,
          content: {
            'application/x-www-form-urlencoded': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: {
                    type: 'string',
                    format: 'email',
                    description: 'User email address (Gmail only)',
                  },
                  password: {
                    type: 'string',
                    minLength: 8,
                    description: 'User password',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Login successful',
            headers: {
              'Set-Cookie': {
                description: 'Session cookie',
                schema: { type: 'string' },
              },
            },
          },
          '400': {
            description: 'Invalid credentials',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/logout': {
      get: {
        tags: ['Authentication'],
        summary: 'User logout',
        description: 'Clear user session',
        responses: {
          '302': {
            description: 'Redirect to home',
          },
        },
      },
    },

    // Student signup endpoints
    '/signup': {
      post: {
        tags: ['Authentication'],
        summary: 'Student registration',
        description: 'Register new student account',
        requestBody: {
          required: true,
          content: {
            'application/x-www-form-urlencoded': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password', 'dateOfBirth'],
                properties: {
                  name: {
                    type: 'string',
                    minLength: 2,
                    maxLength: 100,
                    description: 'Student full name',
                  },
                  email: {
                    type: 'string',
                    format: 'email',
                    description: 'Gmail address only',
                  },
                  password: {
                    type: 'string',
                    minLength: 8,
                    description: 'Password with upper, lower, and number',
                  },
                  dateOfBirth: {
                    type: 'string',
                    format: 'date',
                    description: 'Date of birth (YYYY-MM-DD)',
                  },
                },
              },
            },
          },
        },
        responses: {
          '302': {
            description: 'Redirect to verification page',
          },
          '400': {
            description: 'Validation error',
          },
        },
      },
    },

    '/signup/verify': {
      post: {
        tags: ['Authentication'],
        summary: 'Email verification',
        description: 'Verify student email with verification code',
        requestBody: {
          required: true,
          content: {
            'application/x-www-form-urlencoded': {
              schema: {
                type: 'object',
                required: ['email', 'code'],
                properties: {
                  email: {
                    type: 'string',
                    format: 'email',
                    description: 'Student email address',
                  },
                  code: {
                    type: 'string',
                    pattern: '^\\d{6}$',
                    description: '6-digit verification code',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Email verified successfully',
          },
          '400': {
            description: 'Invalid verification code',
          },
        },
      },
    },

    // Admin setup
    '/setup-admin': {
      post: {
        tags: ['Authentication'],
        summary: 'Create first admin',
        description: 'Setup initial admin account (only if no admin exists)',
        requestBody: {
          required: true,
          content: {
            'application/x-www-form-urlencoded': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password', 'dateOfBirth'],
                properties: {
                  name: { type: 'string', minLength: 2 },
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', minLength: 8 },
                  dateOfBirth: { type: 'string', format: 'date' },
                },
              },
            },
          },
        },
        responses: {
          '302': {
            description: 'Admin created and redirected to home',
          },
          '400': {
            description: 'Admin already exists or validation error',
          },
        },
      },
    },

    // Health check
    '/health': {
      get: {
        tags: ['System'],
        summary: 'Health check',
        description: 'Check API health status',
        responses: {
          '200': {
            description: 'API is healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' },
                  },
                },
              },
            },
          },
        },
      },
    },

    // Admin user management
    '/admin/users': {
      get: {
        tags: ['Users'],
        summary: 'List users',
        description: 'Get list of all users with optional filtering',
        parameters: [
          {
            name: 'role',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['admin', 'student', 'teacher'],
            },
            description: 'Filter by user role',
          },
          {
            name: 'q',
            in: 'query',
            schema: { type: 'string' },
            description: 'Search query',
          },
        ],
        responses: {
          '200': {
            description: 'List of users',
            content: {
              'text/html': {
                schema: { type: 'string' },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
          },
        },
        security: [{ adminSession: [] }],
      },
    },

    '/admin/users/new': {
      post: {
        tags: ['Users'],
        summary: 'Create user',
        description: 'Create new user account',
        requestBody: {
          required: true,
          content: {
            'application/x-www-form-urlencoded': {
              schema: {
                type: 'object',
                required: ['role', 'name', 'email', 'password', 'dateOfBirth'],
                properties: {
                  role: {
                    type: 'string',
                    enum: ['admin', 'student', 'teacher'],
                  },
                  name: { type: 'string', minLength: 2 },
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', minLength: 8 },
                  dateOfBirth: { type: 'string', format: 'date' },
                },
              },
            },
          },
        },
        responses: {
          '302': {
            description: 'User created and redirected to user list',
          },
          '400': {
            description: 'Validation error',
          },
          '401': {
            description: 'Unauthorized',
          },
        },
        security: [{ adminSession: [] }],
      },
    },

    // Subject management
    '/admin/modules/subjects': {
      get: {
        tags: ['Subjects'],
        summary: 'List subjects',
        description: 'Get list of all subjects',
        responses: {
          '200': {
            description: 'List of subjects',
            content: {
              'text/html': {
                schema: { type: 'string' },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
          },
        },
        security: [{ adminSession: [] }],
      },
    },

    '/admin/modules/subjects/{subjectId}': {
      get: {
        tags: ['Subjects'],
        summary: 'Get subject details',
        description: 'Get detailed information about a subject',
        parameters: [
          {
            name: 'subjectId',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          '200': {
            description: 'Subject details',
            content: {
              'text/html': {
                schema: { type: 'string' },
              },
            },
          },
          '404': {
            description: 'Subject not found',
          },
          '401': {
            description: 'Unauthorized',
          },
        },
        security: [{ adminSession: [] }],
      },
    },
  },
  components: {
    securitySchemes: {
      adminSession: {
        type: 'apiKey',
        in: 'cookie',
        name: 'admin_session',
        description: 'Admin session cookie for authentication',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          role: { type: 'string', enum: ['admin', 'student', 'teacher'] },
          dateOfBirth: { type: 'string', format: 'date' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Subject: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' },
          slug: { type: 'string' },
          description: { type: 'string' },
          isTwoPaper: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Chapter: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          title: { type: 'string' },
          slug: { type: 'string' },
          summary: { type: 'string' },
          position: { type: 'integer' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string' },
          message: { type: 'string' },
        },
      },
    },
  },
});
