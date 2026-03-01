export class HttpError extends Error {
  constructor(status, message, options = {}) {
    super(message);
    this.status = status;
    this.code = options.code;
    this.detail = options.detail;
  }
}

function databaseDetail(error) {
  if (!error) return "Unknown database error";
  const message = String(error?.message || "").trim();
  if (message) return message;
  try {
    return JSON.stringify(error);
  } catch {
    return "Unserializable database error";
  }
}

export function mapDatabaseError(error, fallbackMessage = "Database operation failed") {
  const detail = databaseDetail(error);
  if (detail.includes("UNIQUE constraint failed") || detail.includes("SQLITE_CONSTRAINT_UNIQUE")) {
    return new HttpError(409, "Email already in use", { code: "UNIQUE_CONSTRAINT", detail });
  }
  if (detail.includes("NOT NULL constraint failed") || detail.includes("SQLITE_CONSTRAINT_NOTNULL")) {
    return new HttpError(400, "Missing required data", { code: "NOT_NULL_CONSTRAINT", detail });
  }
  if (detail.includes("no such table") || detail.includes("no such column")) {
    return new HttpError(500, "Database schema is out of date", { code: "SCHEMA_MISMATCH", detail });
  }
  if (detail.includes("SQLITE_BUSY") || detail.includes("database is locked")) {
    return new HttpError(503, "Database is temporarily busy", { code: "DB_BUSY", detail });
  }

  return new HttpError(500, fallbackMessage, { code: "DB_ERROR", detail });
}
