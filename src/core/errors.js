export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export function mapDatabaseError(error, fallbackMessage = "Database operation failed") {
  const msg = String(error?.message || "");
  if (msg.includes("UNIQUE constraint failed") || msg.includes("SQLITE_CONSTRAINT_UNIQUE")) {
    return new HttpError(409, "Email already in use");
  }
  if (msg.includes("NOT NULL constraint failed") || msg.includes("SQLITE_CONSTRAINT_NOTNULL")) {
    return new HttpError(400, "Missing required data");
  }
  return new HttpError(500, fallbackMessage);
}
