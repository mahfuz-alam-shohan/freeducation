export function imageUrlFromKey(imageKey) {
  if (!imageKey) return null;
  return `/media/${encodeURIComponent(imageKey)}`;
}

