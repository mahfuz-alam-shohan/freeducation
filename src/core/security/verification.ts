import { hashPassword, verifyPassword } from "./password";

export const createVerificationCode = (): string => {
  const value = crypto.getRandomValues(new Uint32Array(1))[0] ?? 0;
  return String(value % 1_000_000).padStart(6, "0");
};

export const hashVerificationCode = async (code: string): Promise<string> => hashPassword(code);

export const verifyVerificationCode = async (code: string, storedHash: string): Promise<boolean> =>
  verifyPassword(code, storedHash);
