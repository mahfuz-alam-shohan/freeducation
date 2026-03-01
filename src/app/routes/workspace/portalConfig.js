import { USER_TYPES } from "../../../shared/auth/roles.js";
import { PRIMARY_NAV_SECTIONS, STUDENT_NAV_SECTIONS, TEACHER_NAV_SECTIONS } from "../../../presentation/config/navigation.js";

const PORTAL_CONFIG = [
  {
    role: USER_TYPES.ADMINISTRATOR,
    portalPrefix: "/admin",
    apiPrefixes: ["/api/workspace", "/api/admin"],
    defaultApiBase: "/api/workspace",
    homePath: "/admin/dashboard",
    navItems: PRIMARY_NAV_SECTIONS,
  },
  {
    role: USER_TYPES.TEACHER,
    portalPrefix: "/teacher",
    apiPrefixes: ["/api/teacher"],
    defaultApiBase: "/api/teacher",
    homePath: "/teacher/dashboard",
    navItems: TEACHER_NAV_SECTIONS,
  },
  {
    role: USER_TYPES.STUDENT,
    portalPrefix: "/student",
    apiPrefixes: ["/api/student"],
    defaultApiBase: "/api/student",
    homePath: "/student/dashboard",
    navItems: STUDENT_NAV_SECTIONS,
  },
];

export function detectPortal(pathname) {
  return PORTAL_CONFIG.find((portal) =>
    pathname.startsWith(portal.portalPrefix) || portal.apiPrefixes.some((prefix) => pathname.startsWith(prefix))
  ) || null;
}

export function isPortalApiPath(portal, pathname) {
  return portal.apiPrefixes.some((prefix) => pathname.startsWith(prefix));
}

export function matchApiPath(pathname, portal, suffix) {
  return portal.apiPrefixes.find((prefix) => pathname === `${prefix}${suffix}`) || "";
}
