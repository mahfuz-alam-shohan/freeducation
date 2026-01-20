import { verifyPassword } from "../../core/security/password";

export type AdminRecord = {
  name: string;
  email: string;
  passwordHash: string;
};

type D1Database = {
  prepare: (query: string) => {
    all: <T = unknown>() => Promise<{ results: T[] }>;
    run: () => Promise<void>;
    bind: (...values: unknown[]) => { run: () => Promise<void> };
  };
};

export const getAdminByEmail = async (db: D1Database, email: string): Promise<AdminRecord | null> => {
  const result = await db
    .prepare("SELECT name, email, password_hash as passwordHash FROM admins WHERE email = ? LIMIT 1")
    .bind(email)
    .all<AdminRecord>();
  const admin = result.results[0];
  return admin ?? null;
};

export const verifyAdminLogin = async (
  db: D1Database,
  email: string,
  password: string,
): Promise<{ name: string; email: string } | null> => {
  const admin = await getAdminByEmail(db, email);
  if (!admin) {
    return null;
  }

  const valid = await verifyPassword(password, admin.passwordHash);
  if (!valid) {
    return null;
  }

  return { name: admin.name, email: admin.email };
};
