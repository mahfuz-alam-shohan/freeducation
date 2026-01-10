import { contentKeys } from './data';

export const pickContentSlice = (content: Record<string, unknown>) =>
  Object.fromEntries(contentKeys.map((key) => [key, content[key]]));

export const applyContentSlice = (content: Record<string, unknown>, update: Record<string, unknown>) => {
  const next = { ...content };
  for (const key of contentKeys) {
    if (key in update) {
      next[key] = update[key];
    }
  }
  return next;
};
