export interface SecurityHeadersConfig {
  enableCSP: boolean;
  enableHSTS: boolean;
  enableXFrameOptions: boolean;
  enableXContentTypeOptions: boolean;
  enableReferrerPolicy: boolean;
  enablePermissionsPolicy: boolean;
}

export const SECURITY_HEADERS_CONFIG: SecurityHeadersConfig = {
  enableCSP: true,
  enableHSTS: true,
  enableXFrameOptions: true,
  enableXContentTypeOptions: true,
  enableReferrerPolicy: true,
  enablePermissionsPolicy: true,
};

export const getSecurityHeaders = (config: SecurityHeadersConfig = SECURITY_HEADERS_CONFIG): Record<string, string> => {
  const headers: Record<string, string> = {};

  // Content Security Policy
  if (config.enableCSP) {
    headers['Content-Security-Policy'] = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Adjust based on needs
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ');
  }

  // HTTP Strict Transport Security
  if (config.enableHSTS) {
    headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload';
  }

  // X-Frame-Options
  if (config.enableXFrameOptions) {
    headers['X-Frame-Options'] = 'DENY';
  }

  // X-Content-Type-Options
  if (config.enableXContentTypeOptions) {
    headers['X-Content-Type-Options'] = 'nosniff';
  }

  // Referrer Policy
  if (config.enableReferrerPolicy) {
    headers['Referrer-Policy'] = 'strict-origin-when-cross-origin';
  }

  // Permissions Policy
  if (config.enablePermissionsPolicy) {
    headers['Permissions-Policy'] = [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'payment=()',
      'usb=()',
      'magnetometer=()',
      'gyroscope=()',
      'accelerometer=()',
    ].join(', ');
  }

  // Additional security headers
  headers['X-XSS-Protection'] = '1; mode=block';
  headers['X-Permitted-Cross-Domain-Policies'] = 'none';
  headers['Cross-Origin-Embedder-Policy'] = 'require-corp';
  headers['Cross-Origin-Opener-Policy'] = 'same-origin';
  headers['Cross-Origin-Resource-Policy'] = 'same-origin';

  return headers;
};

export const applySecurityHeaders = (response: Response, config?: SecurityHeadersConfig): Response => {
  const headers = getSecurityHeaders(config);
  
  // Create new headers object to avoid mutation
  const newHeaders = new Headers(response.headers);
  
  // Add security headers
  Object.entries(headers).forEach(([key, value]) => {
    newHeaders.set(key, value);
  });

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
};
