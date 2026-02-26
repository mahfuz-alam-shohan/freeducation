const navIcon = (path) => `<svg class="admin-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;

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
    key: "profile",
    href: "/admin/profile",
    label: "Profile",
    icon: navIcon("<path d='M12 13.2a4.2 4.2 0 1 0 0-8.4 4.2 4.2 0 0 0 0 8.4z'/><path d='M4 21c.35-3.6 3.4-6.1 8-6.1s7.65 2.5 8 6.1' />"),
  },
];
