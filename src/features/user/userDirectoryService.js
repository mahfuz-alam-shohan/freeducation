import { readBody, normalizeEmail } from "../../shared/http/request.js";
import { validateUserPayload } from "../../shared/validation/validation.js";
import { HttpError, mapDatabaseError } from "../../shared/http/errors.js";
import { createUser, deleteUserById, findUserByEmail, listUsers, searchUsersForSocial } from "../../infrastructure/db/usersRepository.js";
import { hashPassword } from "../../shared/security/password.js";
import { USER_TYPES } from "../../shared/auth/roles.js";

export async function listUsersForWorkspace(env) {
  return listUsers(env.DB);
}

export async function registerUser(request, env) {
  const body = await readBody(request);
  const validationError = validateUserPayload(body);
  if (validationError) throw new HttpError(400, validationError);

  if (await findUserByEmail(env.DB, normalizeEmail(body.email))) {
    throw new HttpError(409, "Email already in use");
  }

  const { hash, salt } = await hashPassword(body.password);
  try {
    await createUser(env.DB, {
      name: body.name,
      email: body.email,
      hash,
      salt,
      userType: body.user_type || USER_TYPES.ADMINISTRATOR,
    });
  } catch (error) {
    throw mapDatabaseError(error, "Unable to create user");
  }
  return { ok: true };
}

export async function removeUser(userId, env, currentUserId) {
  const id = Number.parseInt(String(userId || ""), 10);
  if (!Number.isInteger(id) || id <= 0) throw new HttpError(400, "Invalid user id");

  if (id === Number(currentUserId)) {
    throw new HttpError(409, "You cannot delete the account you are currently using");
  }

  const users = await listUsers(env.DB);
  const target = users.find((user) => Number(user.id) === id);
  if (!target) throw new HttpError(404, "User not found");
  const administratorUsers = users.filter((user) => user.user_type === USER_TYPES.ADMINISTRATOR);
  if (target.user_type === USER_TYPES.ADMINISTRATOR && administratorUsers.length <= 1) {
    throw new HttpError(409, "At least one administrator must remain");
  }

  try {
    await deleteUserById(env.DB, id);
  } catch (error) {
    throw mapDatabaseError(error, "Unable to delete user");
  }

  return { ok: true };
}

export async function searchProfilesForSocial(env, options = {}) {
  const query = String(options?.query || "").trim();
  const limit = Number.parseInt(String(options?.limit || 12), 10) || 12;
  const rows = await searchUsersForSocial(env.DB, { query, limit });
  return rows.map((user) => {
    const id = Number(user?.id || 0);
    return {
      id,
      name: String(user?.name || ""),
      email: String(user?.email || ""),
      userType: String(user?.user_type || ""),
      createdAt: String(user?.created_at || ""),
      avatarUrl: user?.avatar_key ? `/api/social/avatar/${id}` : "",
      profileUrl: `/profile/${id}?from=social`,
    };
  }).filter((user) => user.id > 0);
}
