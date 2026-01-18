const iconMap = {
  home: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 11.5 12 5l8 6.5V20a1 1 0 0 1-1 1h-4.5v-5h-5v5H5a1 1 0 0 1-1-1z" />
    </svg>
  `,
  users: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7.5 12a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
      <path d="M3.5 20v-1.2c0-2.1 1.9-3.8 4.2-3.8h0.4c2.3 0 4.2 1.7 4.2 3.8V20" />
      <path d="M15 11.5a2.8 2.8 0 1 0-2.7-3.5" />
      <path d="M20.5 20v-1c0-1.8-1.3-3.3-3-3.7" />
    </svg>
  `,
  content: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 5h10a4 4 0 0 1 4 4v10H9a4 4 0 0 0-4 4z" />
      <path d="M9 5v14" />
    </svg>
  `,
  classes: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 6h16v9H4z" />
      <path d="M8 18h8" />
      <path d="M12 15v3" />
    </svg>
  `,
  assignments: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 4h7l3 3v13H7z" />
      <path d="M10 12h5" />
      <path d="M10 16h5" />
      <path d="M14 4v3h3" />
    </svg>
  `,
  tasks: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 12l2.2 2.2L13 9.5" />
      <path d="M6 18l2.2 2.2L13 15.5" />
      <path d="M15 6h3" />
      <path d="M15 12h3" />
      <path d="M15 18h3" />
    </svg>
  `,
  lessons: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 6h6c1.7 0 3 1.3 3 3v10H7a3 3 0 0 0-3 3z" />
      <path d="M20 6h-6c-1.7 0-3 1.3-3 3v10h6a3 3 0 0 1 3 3z" />
    </svg>
  `,
  progress: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <path d="M8 15l3-4 3 2 4-6" />
    </svg>
  `,
  browse: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l3 3" />
    </svg>
  `,
  settings: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2v3" />
      <path d="M12 19v3" />
      <path d="M4.2 4.2l2.1 2.1" />
      <path d="M17.7 17.7l2.1 2.1" />
      <path d="M2 12h3" />
      <path d="M19 12h3" />
      <path d="M4.2 19.8l2.1-2.1" />
      <path d="M17.7 6.3l2.1-2.1" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  `,
};

const toneMap = {
  home: "sun",
  users: "mint",
  content: "sky",
  classes: "sun",
  assignments: "coral",
  tasks: "mint",
  lessons: "sky",
  progress: "coral",
  browse: "sun",
  settings: "coral",
};

const roleNavConfig = {
  admin: {
    contextLabel: "Admin",
    sidebarTitle: "Freeducation",
    sidebarSubtitle: "Admin",
    navItems: [
      { label: "Dashboard", href: "/admin", key: "home" },
      { label: "User Management", href: "/admin/users", key: "users" },
      { label: "Site Settings", href: "/admin/settings", key: "settings" },
      { label: "Content", href: "#", key: "content" },
    ],
    bottomNavItems: [
      { label: "Home", href: "/admin", key: "home" },
      { label: "Users", href: "/admin/users", key: "users" },
      { label: "Settings", href: "/admin/settings", key: "settings" },
      { label: "Content", href: "#", key: "content" },
    ],
  },
  teacher: {
    contextLabel: "Teacher",
    sidebarTitle: "Freeducation",
    sidebarSubtitle: "Teacher",
    navItems: [
      { label: "Overview", href: "/teacher", key: "home" },
      { label: "Classes", href: "#", key: "classes" },
      { label: "Assignments", href: "#", key: "assignments" },
    ],
    bottomNavItems: [
      { label: "Home", href: "/teacher", key: "home" },
      { label: "Classes", href: "#", key: "classes" },
      { label: "Tasks", href: "#", key: "tasks" },
    ],
  },
  student: {
    contextLabel: "Student",
    sidebarTitle: "Freeducation",
    sidebarSubtitle: "Student",
    navItems: [
      { label: "Overview", href: "/student", key: "home" },
      { label: "Lessons", href: "#", key: "lessons" },
      { label: "Progress", href: "#", key: "progress" },
    ],
    bottomNavItems: [
      { label: "Home", href: "/student", key: "home" },
      { label: "Lessons", href: "#", key: "lessons" },
      { label: "Progress", href: "#", key: "progress" },
    ],
  },
  public: {
    contextLabel: "Public Library",
    sidebarTitle: "Freeducation",
    sidebarSubtitle: "Public",
    navItems: [{ label: "Browse", href: "/", key: "browse" }],
    bottomNavItems: [{ label: "Browse", href: "/", key: "browse" }],
  },
};

function buildNavItems(items, activeKey) {
  return items.map((item) => ({
    label: item.label,
    href: item.href,
    active: item.key === activeKey,
    icon: iconMap[item.key],
    tone: toneMap[item.key] ?? "sun",
  }));
}

function getRoleNavigation(role, activeKey) {
  const config = roleNavConfig[role];
  if (!config) {
    return null;
  }

  return {
    contextLabel: config.contextLabel,
    sidebarTitle: config.sidebarTitle,
    sidebarSubtitle: config.sidebarSubtitle,
    navItems: buildNavItems(config.navItems, activeKey),
    bottomNavItems: buildNavItems(config.bottomNavItems, activeKey),
  };
}

export { getRoleNavigation };
