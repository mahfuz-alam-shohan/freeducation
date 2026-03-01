import { readBody } from "../../shared/http/request.js";
import { HttpError } from "../../shared/http/errors.js";
import { findUserByEmail, findUserById, updateUserPassword } from "../../infrastructure/db/usersRepository.js";
import { hashPassword, verifyPassword } from "../../shared/security/password.js";

export async function changeUserPassword(request, env, userId) {
  const body = await readBody(request);
  const currentPassword = String(body?.currentPassword || "");
  const nextPassword = String(body?.newPassword || "");

  if (currentPassword.length < 8 || nextPassword.length < 8) {
    throw new HttpError(400, "Passwords must be at least 8 characters");
  }

  const user = await findUserById(env.DB, userId);
  if (!user) throw new HttpError(404, "Account not found");
  const loginUser = await findUserByEmail(env.DB, user.email);
  if (!loginUser) throw new HttpError(404, "Account not found");

  const validCurrent = await verifyPassword(currentPassword, loginUser.password_salt, loginUser.password_hash);
  if (!validCurrent) throw new HttpError(401, "Current password is incorrect");

  const { hash, salt } = await hashPassword(nextPassword);
  await updateUserPassword(env.DB, { userId, hash, salt });
  return { ok: true };
}
