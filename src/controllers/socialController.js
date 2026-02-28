import { HttpError } from "../core/errors.js";
import { readBody } from "../core/request.js";
import {
  createSocialComment,
  createSocialPost,
  findSocialPostById,
  getSocialAvatarObject,
  getSocialFeed,
  getSocialPostImageObject,
  toggleSocialReaction,
} from "../db/social.js";

function sanitizePostText(value) {
  return String(value || "").trim();
}

function parseDataImage(payload) {
  const dataUrl = String(payload || "").trim();
  if (!dataUrl) return null;
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,([A-Za-z0-9+/=]+)$/);
  if (!match) throw new HttpError(400, "Invalid image payload");

  const contentType = match[1].toLowerCase();
  if (!["image/jpeg", "image/png", "image/webp"].includes(contentType)) {
    throw new HttpError(400, "Unsupported image format");
  }

  const binary = Uint8Array.from(atob(match[2]), (char) => char.charCodeAt(0));
  if (!binary.byteLength) throw new HttpError(400, "Image is empty");
  if (binary.byteLength > 1_500_000) throw new HttpError(413, "Image is too large");

  const ext = contentType === "image/png" ? "png" : contentType === "image/webp" ? "webp" : "jpg";
  return { binary, contentType, ext };
}

export async function socialFeed(env, viewer) {
  const posts = await getSocialFeed(env.DB, viewer?.id || 0, 25);
  return {
    viewer: viewer
      ? {
        id: Number(viewer.id),
        name: viewer.name || "",
        avatarUrl: viewer.avatar_key ? `/api/social/avatar/${viewer.id}` : "",
      }
      : null,
    canInteract: Boolean(viewer),
    posts,
  };
}

export async function createPost(request, env, viewer) {
  if (!viewer) throw new HttpError(401, "Login required to create posts");
  const body = await readBody(request);
  const postText = sanitizePostText(body?.text);
  const image = parseDataImage(body?.imageData);

  if (!postText && !image) throw new HttpError(400, "Post text or image is required");
  if (postText.length > 1200) throw new HttpError(400, "Post text must be 1200 characters or fewer");

  let imageKey = "";
  if (image) {
    if (!env?.BUCKET || typeof env.BUCKET.put !== "function") {
      throw new HttpError(500, "Image storage is not configured");
    }
    imageKey = `social/posts/${viewer.id}/${Date.now()}.${image.ext}`;
    await env.BUCKET.put(imageKey, image.binary, {
      httpMetadata: { contentType: image.contentType, cacheControl: "public, max-age=604800" },
    });
  }

  const postId = await createSocialPost(env.DB, {
    adminId: viewer.id,
    body: postText,
    imageKey,
  });

  return { ok: true, postId };
}

export async function createComment(request, env, viewer, postId) {
  if (!viewer) throw new HttpError(401, "Login required to comment");
  const id = Number.parseInt(String(postId || ""), 10);
  if (!Number.isInteger(id) || id <= 0) throw new HttpError(400, "Invalid post id");

  const post = await findSocialPostById(env.DB, id);
  if (!post) throw new HttpError(404, "Post not found");

  const body = await readBody(request);
  const text = sanitizePostText(body?.text);
  if (!text) throw new HttpError(400, "Comment text is required");
  if (text.length > 600) throw new HttpError(400, "Comment must be 600 characters or fewer");

  await createSocialComment(env.DB, {
    postId: id,
    adminId: viewer.id,
    body: text,
  });

  return { ok: true };
}

export async function toggleReaction(env, viewer, postId) {
  if (!viewer) throw new HttpError(401, "Login required to react");
  const id = Number.parseInt(String(postId || ""), 10);
  if (!Number.isInteger(id) || id <= 0) throw new HttpError(400, "Invalid post id");

  const post = await findSocialPostById(env.DB, id);
  if (!post) throw new HttpError(404, "Post not found");

  return toggleSocialReaction(env.DB, { postId: id, adminId: viewer.id });
}

export async function socialAvatar(env, adminId) {
  const id = Number.parseInt(String(adminId || ""), 10);
  if (!Number.isInteger(id) || id <= 0) throw new HttpError(400, "Invalid user id");
  const object = await getSocialAvatarObject(env, id);
  if (!object) throw new HttpError(404, "Avatar not found");

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("cache-control", headers.get("cache-control") || "public, max-age=604800");
  return new Response(object.body, { headers });
}

export async function socialPostImage(env, postId) {
  const id = Number.parseInt(String(postId || ""), 10);
  if (!Number.isInteger(id) || id <= 0) throw new HttpError(400, "Invalid post id");
  const object = await getSocialPostImageObject(env, id);
  if (!object) throw new HttpError(404, "Image not found");

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("cache-control", headers.get("cache-control") || "public, max-age=604800");
  return new Response(object.body, { headers });
}
