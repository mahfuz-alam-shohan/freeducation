export const COOKIE_NAME = "freeducation_admin";
export const SESSION_DAYS = 7;
export const HASH_ITERATIONS = 100_000;

// Centralized error messages
export const ERRORS = {
  DB_MISSING: "Database binding (DB) is missing in wrangler.toml.",
  AUTH_REQUIRED: "You must be logged in to view this page.",
  INVALID_LOGIN: "Invalid email or password.",
  GENERIC: "Something went wrong. Please try again.",
};
