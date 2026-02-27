import { readBody, normalizeEmail } from "../core/request.js";
import { validateAdminPayload, validateProfileFieldUpdate } from "../core/validation.js";
import { HttpError, mapDatabaseError } from "../core/errors.js";
import { createAdmin, deleteAdminById, findAdminByEmail, findAdminById, listAdmins, updateAdminImageKey, updateAdminPassword, updateAdminProfileField } from "../db/admins.js";
import { hashPassword, verifyPassword } from "../security/password.js";
import { USER_TYPES } from "../core/roles.js";

const FILE_TYPE_EXTENSIONS = {
  image: ["jpg", "jpeg", "png", "webp", "gif", "bmp", "svg", "avif"],
  pdf: ["pdf"],
  video: ["mp4", "webm", "mov", "m4v", "avi", "mkv"],
};

const FILE_USAGE_PREFIX = {
  "profile-pic": "admin/",
  "cover-pic": "admin/",
  other: "",
};

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
    await createAdmin(env.DB, { name: body.name, email: body.email, hash, salt, userType: body.user_type || USER_TYPES.ADMINISTRATOR });
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
  const adminUsers = users.filter((user) => user.user_type === USER_TYPES.ADMINISTRATOR);
  if (target.user_type === USER_TYPES.ADMINISTRATOR && adminUsers.length <= 1) {
    throw new HttpError(409, "At least one administrator must remain");
  }

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

export async function listAdminFiles(env, options = {}) {
  const typeFilter = normalizeType(options.type);
  const usageFilter = normalizeUsage(options.usage);
  const cursor = String(options.cursor || "").trim();
  const limit = Math.max(1, Math.min(120, Number.parseInt(String(options.limit || ""), 10) || 45));
  const search = String(options.search || "").trim().toLowerCase();

  const prefix = usageFilter && FILE_USAGE_PREFIX[usageFilter] !== undefined ? FILE_USAGE_PREFIX[usageFilter] : "";
  const listed = await env.BUCKET.list({ prefix, cursor: cursor || undefined, limit });

  const files = listed.objects
    .map((item) => normalizeObjectInfo(item))
    .filter((file) => {
      if (typeFilter && file.type !== typeFilter) return false;
      if (usageFilter && file.usage !== usageFilter) return false;
      if (search && !file.key.toLowerCase().includes(search)) return false;
      return true;
    });

  return {
    files,
    cursor: listed.truncated ? listed.cursor || "" : "",
    truncated: Boolean(listed.truncated),
  };
}

export async function getAdminFileObject(env, key) {
  const objectKey = String(key || "").trim();
  if (!objectKey || objectKey.length > 350 || objectKey.includes("..")) {
    throw new HttpError(400, "Invalid object key");
  }

  const object = await env.BUCKET.get(objectKey);
  if (!object) throw new HttpError(404, "File not found");

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("cache-control", headers.get("cache-control") || "public, max-age=86400");
  headers.set("content-disposition", `inline; filename=\"${objectKey.split("/").pop() || "file"}\"`);
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

export async function updateAdminProfile(request, env, adminId) {
  const body = await readBody(request);
  const field = String(body?.field || "").trim();
  const value = String(body?.value || "").trim();
  const validationError = validateProfileFieldUpdate({ field, value });
  if (validationError) throw new HttpError(400, validationError);

  try {
    await updateAdminProfileField(env.DB, { adminId, field, value });
  } catch (error) {
    throw mapDatabaseError(error, "Unable to update profile");
  }

  const profile = await findAdminById(env.DB, adminId);
  return { ok: true, profile };
}

function normalizeType(type) {
  const next = String(type || "").toLowerCase();
  if (["image", "pdf", "video", "other"].includes(next)) return next;
  return "";
}

function normalizeUsage(usage) {
  const next = String(usage || "").toLowerCase();
  if (["profile-pic", "cover-pic", "other"].includes(next)) return next;
  return "";
}

function normalizeObjectInfo(item) {
  const key = String(item?.key || "");
  const extension = key.includes(".") ? key.split(".").pop().toLowerCase() : "";
  const type = detectFileType(extension, String(item?.httpMetadata?.contentType || ""));
  const usage = detectUsageFromKey(key);
  return {
    key,
    type,
    usage,
    extension,
    size: Number(item?.size || 0),
    uploadedAt: item?.uploaded ? new Date(item.uploaded).toISOString() : "",
    etag: item?.etag || "",
    contentType: item?.httpMetadata?.contentType || "",
    previewUrl: `/api/admin/files/object?key=${encodeURIComponent(key)}`,
  };
}

function detectFileType(extension, contentType) {
  const lowered = String(contentType || "").toLowerCase();
  if (lowered.startsWith("image/")) return "image";
  if (lowered.startsWith("video/")) return "video";
  if (lowered === "application/pdf") return "pdf";
  for (const [type, extensions] of Object.entries(FILE_TYPE_EXTENSIONS)) {
    if (extensions.includes(extension)) return type;
  }
  return "other";
}

function detectUsageFromKey(key) {
  const lower = String(key || "").toLowerCase();
  if (lower.includes("avatar")) return "profile-pic";
  if (lower.includes("cover")) return "cover-pic";
  return "other";
}
