import { hashPassword, verifyPassword } from "../../services/security/password";

type D1Database = {
  prepare: (query: string) => {
    all: <T = unknown>() => Promise<{ results: T[] }>;
    run: () => Promise<void>;
    bind: (...values: unknown[]) => { run: () => Promise<void> };
  };
};

type StudentRecord = {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  dateOfBirth: string;
  verifiedAt: string | null;
};

type StudentVerificationRecord = {
  id: number;
  studentId: number;
  codeHash: string;
  attempts: number;
  expiresAt: string;
  usedAt: string | null;
};

const selectStudentByEmail = async (db: D1Database, email: string): Promise<StudentRecord | null> => {
  const result = await db
    .prepare(
      "SELECT id, name, email, password_hash as passwordHash, date_of_birth as dateOfBirth, verified_at as verifiedAt FROM students WHERE email = ? LIMIT 1",
    )
    .bind(email)
    .all<StudentRecord>();

  return result.results[0] ?? null;
};

const insertStudent = async (
  db: D1Database,
  payload: { name: string; email: string; password: string; dateOfBirth: string },
): Promise<StudentRecord> => {
  const passwordHash = await hashPassword(payload.password);
  const createdAt = new Date().toISOString();

  await db
    .prepare(
      "INSERT INTO students (name, email, password_hash, date_of_birth, created_at) VALUES (?, ?, ?, ?, ?)",
    )
    .bind(payload.name, payload.email, passwordHash, payload.dateOfBirth, createdAt)
    .run();

  const record = await selectStudentByEmail(db, payload.email);
  if (!record) {
    throw new Error("Unable to create student.");
  }

  return record;
};

const updateStudent = async (
  db: D1Database,
  studentId: number,
  payload: { name: string; password: string; dateOfBirth: string },
): Promise<void> => {
  const passwordHash = await hashPassword(payload.password);

  await db
    .prepare("UPDATE students SET name = ?, password_hash = ?, date_of_birth = ? WHERE id = ?")
    .bind(payload.name, passwordHash, payload.dateOfBirth, studentId)
    .run();
};

const clearStudentVerifications = async (db: D1Database, studentId: number): Promise<void> => {
  await db.prepare("DELETE FROM student_verifications WHERE student_id = ?").bind(studentId).run();
};

const insertStudentVerification = async (
  db: D1Database,
  payload: { studentId: number; codeHash: string; expiresAt: string },
): Promise<void> => {
  const createdAt = new Date().toISOString();

  await db
    .prepare(
      "INSERT INTO student_verifications (student_id, code_hash, attempts, expires_at, created_at) VALUES (?, ?, ?, ?, ?)",
    )
    .bind(payload.studentId, payload.codeHash, 0, payload.expiresAt, createdAt)
    .run();
};

const selectLatestVerification = async (db: D1Database, studentId: number): Promise<StudentVerificationRecord | null> => {
  const result = await db
    .prepare(
      "SELECT id, student_id as studentId, code_hash as codeHash, attempts, expires_at as expiresAt, used_at as usedAt FROM student_verifications WHERE student_id = ? ORDER BY created_at DESC LIMIT 1",
    )
    .bind(studentId)
    .all<StudentVerificationRecord>();

  return result.results[0] ?? null;
};

const updateVerificationAttempts = async (
  db: D1Database,
  verificationId: number,
  attempts: number,
): Promise<void> => {
  await db
    .prepare("UPDATE student_verifications SET attempts = ? WHERE id = ?")
    .bind(attempts, verificationId)
    .run();
};

const markVerificationUsed = async (db: D1Database, verificationId: number): Promise<void> => {
  await db
    .prepare("UPDATE student_verifications SET used_at = ? WHERE id = ?")
    .bind(new Date().toISOString(), verificationId)
    .run();
};

const markStudentVerified = async (db: D1Database, studentId: number): Promise<void> => {
  await db.prepare("UPDATE students SET verified_at = ? WHERE id = ?").bind(new Date().toISOString(), studentId).run();
};

export const createOrRefreshStudentSignup = async (
  db: D1Database,
  payload: { name: string; email: string; password: string; dateOfBirth: string; codeHash: string; expiresAt: string },
): Promise<{ student: StudentRecord }> => {
  const existing = await selectStudentByEmail(db, payload.email);

  if (existing?.verifiedAt) {
    throw new Error("An account with this email already exists.");
  }

  let student = existing;

  if (student) {
    await updateStudent(db, student.id, {
      name: payload.name,
      password: payload.password,
      dateOfBirth: payload.dateOfBirth,
    });
  } else {
    student = await insertStudent(db, {
      name: payload.name,
      email: payload.email,
      password: payload.password,
      dateOfBirth: payload.dateOfBirth,
    });
  }

  await clearStudentVerifications(db, student.id);
  await insertStudentVerification(db, {
    studentId: student.id,
    codeHash: payload.codeHash,
    expiresAt: payload.expiresAt,
  });

  return { student };
};

export const verifyStudentSignup = async (
  db: D1Database,
  payload: { email: string; code: string },
): Promise<{ student: StudentRecord }> => {
  const student = await selectStudentByEmail(db, payload.email);
  if (!student) {
    throw new Error("No account was found for that email.");
  }

  if (student.verifiedAt) {
    return { student };
  }

  const verification = await selectLatestVerification(db, student.id);
  if (!verification) {
    throw new Error("No verification request was found. Please request a new code.");
  }

  if (verification.usedAt) {
    throw new Error("This verification code has already been used.");
  }

  const now = Date.now();
  if (Date.parse(verification.expiresAt) <= now) {
    throw new Error("Your verification code has expired. Please request a new one.");
  }

  if (verification.attempts >= 5) {
    throw new Error("Too many attempts. Please request a new verification code.");
  }

  const matches = await verifyPassword(payload.code, verification.codeHash);
  if (!matches) {
    await updateVerificationAttempts(db, verification.id, verification.attempts + 1);
    throw new Error("The verification code is incorrect.");
  }

  await markVerificationUsed(db, verification.id);
  await markStudentVerified(db, student.id);

  return { student };
};
