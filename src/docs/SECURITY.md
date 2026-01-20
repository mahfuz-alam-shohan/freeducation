# Security & API Documentation

This document outlines the security features and API documentation implemented for the FreeEducation platform.

## Security Features

### 1. Rate Limiting
- **Purpose**: Prevent brute force attacks and API abuse
- **Implementation**: In-memory rate limiting store (use KV in production)
- **Configurations**:
  - `AUTH`: 5 requests per 15 minutes
  - `GENERAL`: 100 requests per 15 minutes  
  - `API`: 30 requests per minute

### 2. CSRF Protection
- **Purpose**: Prevent Cross-Site Request Forgery attacks
- **Implementation**: Double-submit token (cookie + header or hidden form field)
- **Features**:
  - Secure, HttpOnly cookies
  - Per-page token issuance
  - Automatic token validation for state-changing requests

### 3. Security Headers
- **Purpose**: Protect against various web vulnerabilities
- **Headers Applied**:
  - `Content-Security-Policy`: Restricts resource loading
  - `Strict-Transport-Security`: Enforces HTTPS
  - `X-Frame-Options`: Prevents clickjacking
  - `X-Content-Type-Options`: Prevents MIME sniffing
  - `Referrer-Policy`: Controls referrer information
  - `Permissions-Policy`: Restricts browser features
  - `X-XSS-Protection`: Enables XSS filtering
  - `Cross-Origin-*` headers: Controls cross-origin access

### 4. Input Validation
- **Purpose**: Prevent injection attacks and data corruption
- **Features**:
  - Schema-based validation
  - Type checking and sanitization
  - Common validation schemas for frequent use cases
  - Automatic error handling

### 5. Security Middleware
- **Purpose**: Centralized security enforcement
- **Configurations**:
  - `PUBLIC`: Basic security for public endpoints
  - `AUTH`: Enhanced security for authentication endpoints
  - `API`: Full security for API endpoints
  - `ADMIN`: Maximum security for admin endpoints

## API Documentation

### OpenAPI Specification
The platform provides comprehensive API documentation using OpenAPI 3.0 specification.

### Access Endpoints
- **JSON Format**: `GET /api-docs?format=json`
- **YAML Format**: `GET /api-docs?format=yaml`
- **Default**: Returns JSON format

### Documentation Features
- **Complete API Coverage**: All endpoints documented
- **Request/Response Schemas**: Detailed data structures
- **Authentication Methods**: Security scheme documentation
- **Error Responses**: Standardized error format
- **Examples**: Request/response examples

### API Categories
1. **Authentication**: Login, logout, signup, verification
2. **Users**: User management (CRUD operations)
3. **Subjects**: Educational content management
4. **Content**: Chapters, topics, materials
5. **Assessments**: Exams and evaluations
6. **System**: Health checks and utilities

## Security Best Practices Implemented

### 1. Defense in Depth
- Multiple layers of security controls
- Independent security mechanisms
- Fail-safe defaults

### 2. Principle of Least Privilege
- Role-based access control
- Minimal required permissions
- Secure session management

### 3. Secure by Default
- Security headers applied to all responses
- Input validation on all endpoints
- Rate limiting enabled globally

### 4. Monitoring & Logging
- Rate limit violations logged
- Validation errors tracked
- Security events monitored

## Usage Examples

### Applying Security Middleware
```typescript
import { SECURITY_MIDDLEWARE } from '../core/middleware';

// For admin routes
const securityResponse = await SECURITY_MIDDLEWARE.ADMIN(request, context);
if (securityResponse) {
  return securityResponse; // Block request
}

// Continue with route handling...
```

### Input Validation
```typescript
import { validateFormData, COMMON_VALIDATION_SCHEMAS } from '../core/middleware';

const errors = validateFormData(formData, COMMON_VALIDATION_SCHEMAS.USER_REGISTRATION);
if (errors.length > 0) {
  return jsonResponse({ error: 'Validation failed', errors }, 400);
}
```

### Accessing API Documentation
```bash
# Get JSON specification
curl https://your-domain.com/api-docs

# Get YAML specification  
curl https://your-domain.com/api-docs?format=yaml
```

## Security Configuration

### Environment Variables
- `JWT_SECRET`: Required for session security
- `GMAIL_*`: Used for email verification (OAuth)

### Rate Limiting
- Configurable per endpoint type
- In-memory storage (upgrade to KV for production)
- Automatic cleanup of expired entries

### CSRF Configuration
- Token expiration: 1 hour
- Secure, HttpOnly cookies
- SameSite=Strict policy

## Production Recommendations

### 1. Upgrade Rate Limiting Storage
Replace in-memory store with Cloudflare KV for distributed rate limiting.

### 2. Enable CSRF Globally
Enable CSRF protection for all state-changing requests.

### 3. Add Monitoring
Implement security event monitoring and alerting.

### 4. Regular Security Audits
Schedule regular security assessments and penetration testing.

### 5. Keep Dependencies Updated
Regularly update all dependencies and security patches.

## Security Headers Details

### Content Security Policy
```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'
```

### Strict Transport Security
```http
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

### Additional Headers
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-XSS-Protection: 1; mode=block`

## Testing Security Features

### Rate Limiting Test
```bash
# Test rate limiting (should fail after 5 attempts)
for i in {1..6}; do
  curl -X POST https://your-domain.com/login -d "email=test@example.com&password=wrong"
done
```

### CSRF Protection Test
```bash
# Test CSRF protection (should fail without token)
curl -X POST https://your-domain.com/admin/users -H "Content-Type: application/json" -d '{"name":"test"}'
```

### Security Headers Test
```bash
# Check security headers
curl -I https://your-domain.com
```

This security implementation provides comprehensive protection against common web vulnerabilities while maintaining good developer experience through clear documentation and easy-to-use middleware.
