import { hashPassword } from "../../services/security/password";

export type UserRole = "admin" | "teacher" | "student";

export type UserListItem = {
  role: UserRole;
  name: string;
  email: string;
  createdAt: string;
};

type D1Database = {
  prepare: (query: string) => {
    all: <T = unknown>() => Promise<{ results: T[] }>;
    run: () => Promise<void>;
    bind: (...values: unknown[]) => { all: <T = unknown>() => Promise<{ results: T[] }>; run: () => Promise<void> };
  };
};

const roleTables: Record<UserRole, string> = {
  admin: "admins",
  teacher: "teachers",
  student: "students",
};

export const normalizeUserRole = (value: string | null): UserRole | null => {
  if (value === "admin" || value === "teacher" || value === "student") {
    return value;
  }

  return null;
};

const buildSearchFilter = (query?: string): { clause: string; params: string[] } => {
  const trimmed = query?.trim();
  if (!trimmed) {
    return { clause: "", params: [] };
  }

  const like = `%${trimmed}%`;
  return { clause: "WHERE (name LIKE ? OR email LIKE ?)", params: [like, like] };
};

const runAllQuery = async <T>(db: D1Database, query: string, params: string[]): Promise<T[]> => {
  if (params.length === 0) {
    const result = await db.prepare(query).all<T>();
    return result.results;
  }

  const result = await db.prepare(query).bind(...params).all<T>();
  return result.results;
};

const selectUserSql = (table: string, role: UserRole, searchClause: string): string =>
  `SELECT '${role}' as role, name, email, created_at as createdAt FROM ${table} ${searchClause}`;

export const listUsers = async (
  db: D1Database,
  options: { role?: UserRole | null; query?: string },
): Promise<UserListItem[]> => {
  const search = buildSearchFilter(options.query);

  if (options.role) {
    const table = roleTables[options.role];
    const query = `${selectUserSql(table, options.role, search.clause)} ORDER BY createdAt DESC`;
    return runAllQuery<UserListItem>(db, query, search.params);
  }

  const selects = (Object.entries(roleTables) as [UserRole, string][])
    .map(([role, table]) => selectUserSql(table, role, search.clause));
  const unionQuery = `${selects.join(" UNION ALL ")} ORDER BY createdAt DESC`;
  const params = selects.flatMap(() => search.params);
  return runAllQuery<UserListItem>(db, unionQuery, params);
};

export const findUserRoleByEmail = async (db: D1Database, email: string): Promise<UserRole | null> => {
  const query = `
    SELECT 'admin' as role FROM admins WHERE email = ?
    UNION ALL
    SELECT 'teacher' as role FROM teachers WHERE email = ?
    UNION ALL
    SELECT 'student' as role FROM students WHERE email = ?
    LIMIT 1
  `;

  const result = await db.prepare(query).bind(email, email, email).all<{ role: UserRole }>();
  return result.results[0]?.role ?? null;
};

export const createUserAccount = async (
  db: D1Database,
  payload: {
    role: UserRole;
    name: string;
    email: string;
    password: string;
    dateOfBirth: string;
  },
): Promise<void> => {
  const passwordHash = await hashPassword(payload.password);
  const createdAt = new Date().toISOString();

  if (payload.role === "student") {
    await db
      .prepare(
        "INSERT INTO students (name, email, password_hash, date_of_birth, created_at, verified_at) VALUES (?, ?, ?, ?, ?, ?)",
      )
      .bind(payload.name, payload.email, passwordHash, payload.dateOfBirth, createdAt, createdAt)
      .run();
    return;
  }

  if (payload.role === "teacher") {
    await db
      .prepare(
        "INSERT INTO teachers (name, email, password_hash, date_of_birth, created_at) VALUES (?, ?, ?, ?, ?)",
      )
      .bind(payload.name, payload.email, passwordHash, payload.dateOfBirth, createdAt)
      .run();
    return;
  }

  await db
    .prepare("INSERT INTO admins (name, email, password_hash, date_of_birth, created_at) VALUES (?, ?, ?, ?, ?)")
    .bind(payload.name, payload.email, passwordHash, payload.dateOfBirth, createdAt)
    .run();
};
