const navIcon = (path) => `<svg class="admin-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;

const HOME_ITEM = {
  key: "home",
  href: "/",
  label: "Home",
  icon: navIcon("<path d='M3 10.5 12 3l9 7.5'/><path d='M5.5 9.7V21h13V9.7'/>")
};

const LOGIN_ITEM = {
  key: "login",
  href: "/admin/login",
  label: "Login",
  kind: "highlight",
  icon: navIcon("<path d='M10 17l5-5-5-5'/><path d='M15 12H3'/><path d='M21 21V3'/>")
};


const SOCIAL_ITEM = {
  key: "social",
  href: "/social",
  label: "Social",
  icon: navIcon("<path d='M4 7.5a2.5 2.5 0 0 1 2.5-2.5h11A2.5 2.5 0 0 1 20 7.5v7A2.5 2.5 0 0 1 17.5 17h-6.2L7 20v-3H6.5A2.5 2.5 0 0 1 4 14.5z'/><path d='M8 9.5h8M8 12.5h5' />")
};

const PROFILE_ITEM = {
  key: "profile",
  label: "Profile",
  icon: navIcon("<path d='M12 13.2a4.2 4.2 0 1 0 0-8.4 4.2 4.2 0 0 0 0 8.4z'/><path d='M4 21c.35-3.6 3.4-6.1 8-6.1s7.65 2.5 8 6.1' />"),
};

const PUBLIC_SECTION = { title: "Public", items: [HOME_ITEM, SOCIAL_ITEM] };

export const LOGGED_OUT_NAV_SECTIONS = [
  { title: "Public", items: [HOME_ITEM, SOCIAL_ITEM, LOGIN_ITEM] },
];

export const ADMIN_NAV_ITEMS = [
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
  {
    ...PROFILE_ITEM,
    href: "/admin/profile",
  },
];

export const ADMIN_NAV_SECTIONS = [
  PUBLIC_SECTION,
  { title: "Admin", items: ADMIN_NAV_ITEMS },
];

export const TEACHER_NAV_ITEMS = [{ ...PROFILE_ITEM, href: "/teacher/profile" }];

export const STUDENT_NAV_ITEMS = [{ ...PROFILE_ITEM, href: "/student/profile" }];

export const TEACHER_NAV_SECTIONS = [
  PUBLIC_SECTION,
  { title: "My Dashboard", items: TEACHER_NAV_ITEMS },
];

export const STUDENT_NAV_SECTIONS = [
  PUBLIC_SECTION,
  { title: "My Dashboard", items: STUDENT_NAV_ITEMS },
];
