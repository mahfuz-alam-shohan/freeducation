import { adminRoutes } from './entries/admin';
import { aliasRoutes } from './entries/aliases';
import { publicRoutes } from './entries/public';

export type RouteEntry = [string, string];

export const routeEntries: RouteEntry[] = [...publicRoutes, ...adminRoutes];

export const matchEntries: RouteEntry[] = [...aliasRoutes, ...routeEntries].sort(
  (a, b) => b[0].length - a[0].length,
);

export const viewToPath = routeEntries.reduce<Record<string, string>>(
  (acc, [path, view]) => {
    acc[view] = path;
    return acc;
  },
  {},
);

export const matchViewFromPath = (path: string) => {
  for (const [routePath, view] of matchEntries) {
    if (path.startsWith(routePath)) {
      return view;
    }
  }
  return 'landing';
};
