import { readBody, normalizeEmail } from "../core/request.js";
import { validateAdminPayload } from "../core/validation.js";
import { HttpError, mapDatabaseError } from "../core/errors.js";
import { createAdmin, deleteAdminById, findAdminByEmail, findAdminById, listAdmins, updateAdminImageKey, updateAdminPassword } from "../db/admins.js";
import { hashPassword, verifyPassword } from "../security/password.js";

export async function overview(env) {
  const users = await listAdmins(env.DB);
  const sessions = await env.DB.prepare("SELECT COUNT(*) total FROM freeducation_sessions").first();
  return {
    totalAdmins: users.length,
    activeSessions: Number(sessions?.total || 0),
  };
}

export async function listAdminUsers(env) {
  return listAdmins(env.DB);
}

export async function createAdminUser(request, env) {
  const body = await readBody(request);
  const validationError = validateAdminPayload(body);
  if (validationError) throw new HttpError(400, validationError);

  if (await findAdminByEmail(env.DB, normalizeEmail(body.email))) {
    throw new HttpError(409, "Email already in use");
  }

  const { hash, salt } = await hashPassword(body.password);
  try {
    await createAdmin(env.DB, { name: body.name, email: body.email, hash, salt });
  } catch (error) {
    throw mapDatabaseError(error, "Unable to create administrator");
  }
  return { ok: true };
}

export async function deleteAdminUser(userId, env, currentAdminId) {
  const id = Number.parseInt(String(userId || ""), 10);
  if (!Number.isInteger(id) || id <= 0) throw new HttpError(400, "Invalid user id");

  if (id === Number(currentAdminId)) {
    throw new HttpError(409, "You cannot delete the account you are currently using");
  }

  const users = await listAdmins(env.DB);
  const target = users.find((user) => Number(user.id) === id);
  if (!target) throw new HttpError(404, "User not found");
  if (users.length <= 1) throw new HttpError(409, "At least one administrator must remain");

  try {
    await deleteAdminById(env.DB, id);
  } catch (error) {
    throw mapDatabaseError(error, "Unable to delete administrator");
  }

  return { ok: true };
}

export async function getAdminProfile(env, adminId) {
  const profile = await findAdminById(env.DB, adminId);
  if (!profile) throw new HttpError(404, "Profile not found");
  return profile;
}

export async function uploadAdminImage(request, env, adminId) {
  const body = await readBody(request);
  const imageType = String(body?.imageType || "").toLowerCase();
  if (!["avatar", "cover"].includes(imageType)) {
    throw new HttpError(400, "Invalid image type");
  }

  const dataUrl = String(body?.imageData || "").trim();
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,([A-Za-z0-9+/=]+)$/);
  if (!match) throw new HttpError(400, "Invalid image payload");

  const contentType = match[1];
  if (!["image/jpeg", "image/png", "image/webp"].includes(contentType)) {
    throw new HttpError(400, "Unsupported image format");
  }

  const binary = Uint8Array.from(atob(match[2]), (char) => char.charCodeAt(0));
  if (!binary.byteLength) throw new HttpError(400, "Image is empty");
  if (binary.byteLength > 500_000) throw new HttpError(413, "Image is too large");

  const ext = contentType === "image/png" ? "png" : contentType === "image/webp" ? "webp" : "jpg";
  const objectKey = `admin/${adminId}/${imageType}-${Date.now()}.${ext}`;

  await env.BUCKET.put(objectKey, binary, {
    httpMetadata: { contentType, cacheControl: "public, max-age=604800" },
  });

  await updateAdminImageKey(env.DB, {
    adminId,
    keyField: imageType === "avatar" ? "avatar_key" : "cover_key",
    keyValue: objectKey,
  });

  return { ok: true, key: objectKey, url: `/api/admin/profile/image/${imageType}` };
}

export async function getAdminImage(env, adminId, imageType) {
  const profile = await findAdminById(env.DB, adminId);
  if (!profile) throw new HttpError(404, "Profile not found");
  const objectKey = imageType === "avatar" ? profile.avatar_key : profile.cover_key;
  if (!objectKey) throw new HttpError(404, "Image not found");

  const object = await env.BUCKET.get(objectKey);
  if (!object) throw new HttpError(404, "Image not found");

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("cache-control", headers.get("cache-control") || "public, max-age=604800");
  return new Response(object.body, { headers });
}

export async function changeAdminPassword(request, env, adminId) {
  const body = await readBody(request);
  const currentPassword = String(body?.currentPassword || "");
  const nextPassword = String(body?.newPassword || "");

  if (currentPassword.length < 8 || nextPassword.length < 8) {
    throw new HttpError(400, "Passwords must be at least 8 characters");
  }

  const admin = await findAdminById(env.DB, adminId);
  if (!admin) throw new HttpError(404, "Account not found");
  const loginAdmin = await findAdminByEmail(env.DB, admin.email);
  if (!loginAdmin) throw new HttpError(404, "Account not found");

  const validCurrent = await verifyPassword(currentPassword, loginAdmin.password_salt, loginAdmin.password_hash);
  if (!validCurrent) throw new HttpError(401, "Current password is incorrect");

  const { hash, salt } = await hashPassword(nextPassword);
  await updateAdminPassword(env.DB, { adminId, hash, salt });
  return { ok: true };
}
