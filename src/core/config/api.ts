// API Endpoints
export const API_ENDPOINTS = {
  GOOGLE_OAUTH: {
    TOKEN: 'https://oauth2.googleapis.com/token',
    GMAIL_SEND: 'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
  },
} as const;

// Content Types
export const CONTENT_TYPES = {
  JSON: 'application/json',
  HTML: 'text/html; charset=utf-8',
  PLAIN: 'text/plain; charset=utf-8',
  FORM: 'application/x-www-form-urlencoded',
} as const;
