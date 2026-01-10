import { publicRoutes } from './entries/public/routes';
import { adminRoutes } from './entries/users/admin';
import { adminAliasRoutes } from './entries/users/admin-aliases';
import { studentRoutes } from './entries/users/student';
import { teacherRoutes } from './entries/users/teacher';

export type RouteEntry = [string, string];

export const routeEntries: RouteEntry[] = [
  ...publicRoutes,
  ...adminRoutes,
  ...studentRoutes,
  ...teacherRoutes,
];

export const matchEntries: RouteEntry[] = [
  ...adminAliasRoutes,
  ...routeEntries,
].sort((a, b) => b[0].length - a[0].length);

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
