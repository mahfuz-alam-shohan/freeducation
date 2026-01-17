const roleNavConfig = {
  admin: {
    contextLabel: "Admin",
    sidebarTitle: "Freeducation",
    sidebarSubtitle: "Admin",
    navItems: [
      { label: "Dashboard", href: "/admin", key: "home" },
      { label: "User Management", href: "/admin/users", key: "users" },
      { label: "Teachers (soon)", href: "#", key: "teachers" },
      { label: "Students (soon)", href: "#", key: "students" },
      { label: "Content (soon)", href: "#", key: "content" },
    ],
    bottomNavItems: [
      { label: "Home", href: "/admin", key: "home" },
      { label: "Users", href: "/admin/users", key: "users" },
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
};

function buildNavItems(items, activeKey) {
  return items.map((item) => ({
    label: item.label,
    href: item.href,
    active: item.key === activeKey,
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
