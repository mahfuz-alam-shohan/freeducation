export const SESSION_COOKIE = "freeducation_session";
export const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 14;
export const MAX_IMAGE_BYTES = 1024 * 1024 * 5;
export const IMAGE_MAX_SIZE = 320;

export function getBaseUrl(request) {
  const url = new URL(request.url);
  return `${url.protocol}//${url.host}`;
}
