import { hashPassword } from "../../services/security/password";

const ADMIN_COUNT_QUERY = "SELECT COUNT(*) as count FROM admins";

export type AdminPayload = {
  name: string;
  email: string;
  password: string;
  dateOfBirth: string;
};

type D1Database = {
  prepare: (query: string) => {
    all: <T = unknown>() => Promise<{ results: T[] }>;
    run: () => Promise<void>;
    bind: (...values: unknown[]) => { run: () => Promise<void> };
  };
};

export const adminExists = async (db: D1Database): Promise<boolean> => {
  const result = await db.prepare(ADMIN_COUNT_QUERY).all<{ count: number }>();
  const count = result.results[0]?.count ?? 0;
  return count > 0;
};

export const createAdmin = async (db: D1Database, payload: AdminPayload): Promise<void> => {
  const passwordHash = await hashPassword(payload.password);
  const createdAt = new Date().toISOString();

  await db
    .prepare(
      "INSERT INTO admins (name, email, password_hash, date_of_birth, created_at) VALUES (?, ?, ?, ?, ?)",
    )
    .bind(payload.name, payload.email, passwordHash, payload.dateOfBirth, createdAt)
    .run();
};
