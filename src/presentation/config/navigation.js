const navIcon = (path) => `<svg class="app-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;

const HOME_ITEM = {
  key: "home",
  href: "/",
  label: "Home",
  icon: navIcon("<path d='M3 10.5 12 3l9 7.5'/><path d='M5.5 9.7V21h13V9.7'/>")
};

const LOGIN_ITEM = {
  key: "login",
  href: "/login",
  label: "Login",
  kind: "highlight",
  icon: navIcon("<path d='M10 17l5-5-5-5'/><path d='M15 12H3'/><path d='M21 21V3'/>")
};


const SOCIAL_ITEM = {
  key: "social",
  href: "/social",
  label: "Social",
  icon: navIcon("<path d='M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'/><path d='M16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'/><path d='M3.5 19a4.5 4.5 0 0 1 9 0'/><path d='M11.5 19a4.5 4.5 0 0 1 9 0'/><path d='M10 8h4' />")
};

const RESULTS_ITEM = {
  key: "results",
  href: "/results",
  label: "Results",
  icon: navIcon("<path d='M4 20.5h16'/><path d='M7 17V9'/><path d='M12 17V5'/><path d='M17 17v-6' />"),
};

const PUBLIC_SECTION = { title: "Public", items: [HOME_ITEM, SOCIAL_ITEM, RESULTS_ITEM] };

export const LOGGED_OUT_NAV_SECTIONS = [
  { title: "Public", items: [HOME_ITEM, SOCIAL_ITEM, LOGIN_ITEM] },
];

const PRIMARY_NAV_ITEMS = [
  {
    key: "dashboard",
    href: "/admin/dashboard",
    label: "Dashboard",
    icon: navIcon("<rect x='3' y='3' width='8' height='8' rx='1.2' /><rect x='13' y='3' width='8' height='5' rx='1.2' /><rect x='13' y='10' width='8' height='11' rx='1.2' /><rect x='3' y='13' width='8' height='8' rx='1.2' />"),
  },
  {
    key: "users",
    href: "/admin/users",
    label: "User management",
    icon: navIcon("<path d='M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2'/><circle cx='8.5' cy='7' r='3.5'/><path d='M22 21v-2a4 4 0 0 0-3-3.87'/><path d='M16 3.13a3.5 3.5 0 0 1 0 6.74' />"),
  },
  {
    key: "file-manager",
    href: "/admin/file-manager",
    label: "File manager",
    icon: navIcon("<path d='M3 7.5A1.5 1.5 0 0 1 4.5 6h5.2l1.9 2H19.5A1.5 1.5 0 0 1 21 9.5v8A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5z'/><path d='M3 10h18' />"),
  },
];

const MODULE_NAV_ITEMS = [
  {
    key: "templates",
    href: "/admin/templates",
    label: "Templates",
    icon: navIcon("<path d='M4 4h16v16H4z'/><path d='M4 9h16M9 4v16' />"),
  },
  {
    key: "subjects",
    href: "/admin/subjects",
    label: "Subjects",
    icon: navIcon("<path d='M5 5.5A2.5 2.5 0 0 1 7.5 3h9A2.5 2.5 0 0 1 19 5.5v13A2.5 2.5 0 0 1 16.5 21h-9A2.5 2.5 0 0 1 5 18.5z'/><path d='M8 7.5h8M8 11h8M8 14.5h5'/>"),
  },
  {
    key: "classes",
    href: "/admin/classes",
    label: "Classes",
    icon: navIcon("<path d='M4 5.5A2.5 2.5 0 0 1 6.5 3H12a2 2 0 0 1 1.4.57l6.03 6.03A2 2 0 0 1 20 11v7.5A2.5 2.5 0 0 1 17.5 21h-11A2.5 2.5 0 0 1 4 18.5z'/><path d='M13 3v6h6'/><path d='M8 16h8M8 12h4'/>"),
  },
];

export const PRIMARY_NAV_SECTIONS = [
  PUBLIC_SECTION,
  { title: "Workspace", items: PRIMARY_NAV_ITEMS },
  { title: "Modules", items: MODULE_NAV_ITEMS },
];

export const TEACHER_NAV_SECTIONS = [
  PUBLIC_SECTION,
];

export const STUDENT_NAV_SECTIONS = [
  PUBLIC_SECTION,
];
