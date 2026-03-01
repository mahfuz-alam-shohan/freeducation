import { findUserById } from "../usersRepository.js";
import { findSocialPostById } from "./queries.js";
import { decodePostImageKeys } from "../../../shared/social/postImages.js";

export async function getSocialAvatarObject(env, userId) {
  const profile = await findUserById(env.DB, userId);
  if (!profile?.avatar_key) return null;
  return env.BUCKET.get(profile.avatar_key);
}

export async function getSocialPostImageObject(env, postId, imageIndex = 0) {
  const post = await findSocialPostById(env.DB, postId);
  const imageKeys = decodePostImageKeys(post?.image_key || "");
  if (!imageKeys.length) return null;
  const index = Math.max(0, Math.min(imageKeys.length - 1, Number.parseInt(String(imageIndex || 0), 10) || 0));
  return env.BUCKET.get(imageKeys[index]);
}
