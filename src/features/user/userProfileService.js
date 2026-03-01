import { readBody } from "../../shared/http/request.js";
import { validateProfileFieldUpdate } from "../../shared/validation/validation.js";
import { HttpError, mapDatabaseError } from "../../shared/http/errors.js";
import { findUserById, updateUserImageKey, updateUserProfileField } from "../../infrastructure/db/usersRepository.js";
import { normalizeImageType, parseProfileImagePayload } from "./profile/imagePayload.js";
import { imageResponse, putProfileImageToStorage } from "./profile/storage.js";

export async function getUserProfile(env, userId) {
  const profile = await findUserById(env.DB, userId);
  if (!profile) throw new HttpError(404, "Profile not found");
  return profile;
}

export async function uploadUserImage(request, env, userId, options = {}) {
  const apiBase = String(options.apiBase || "/api/admin");
  const storagePrefix = String(options.storagePrefix || "users");

  const body = await readBody(request);
  const imageType = normalizeImageType(body?.imageType);
  const parsedImage = parseProfileImagePayload(body?.imageData);

  const objectKey = `${storagePrefix}/${userId}/${imageType}-${Date.now()}.${parsedImage.ext}`;
  await putProfileImageToStorage(env, {
    binary: parsedImage.binary,
    contentType: parsedImage.contentType,
    objectKey,
  });

  await updateUserImageKey(env.DB, {
    userId,
    keyField: imageType === "avatar" ? "avatar_key" : "cover_key",
    keyValue: objectKey,
  });

  return { ok: true, key: objectKey, url: `${apiBase}/profile/image/${imageType}` };
}

export async function getUserImage(env, userId, imageType) {
  const profile = await findUserById(env.DB, userId);
  if (!profile) throw new HttpError(404, "Profile not found");

  const objectKey = imageType === "avatar" ? profile.avatar_key : profile.cover_key;
  if (!objectKey) throw new HttpError(404, "Image not found");

  const object = await env.BUCKET.get(objectKey);
  if (!object) throw new HttpError(404, "Image not found");

  return imageResponse(object);
}

export async function updateUserProfile(request, env, userId) {
  const body = await readBody(request);
  const field = String(body?.field || "").trim();
  const value = String(body?.value || "").trim();
  const validationError = validateProfileFieldUpdate({ field, value });
  if (validationError) throw new HttpError(400, validationError);

  try {
    await updateUserProfileField(env.DB, { userId, field, value });
  } catch (error) {
    throw mapDatabaseError(error, "Unable to update profile");
  }

  const profile = await findUserById(env.DB, userId);
  return { ok: true, profile };
}
