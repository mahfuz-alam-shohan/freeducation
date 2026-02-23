import { iconClasses, iconDashboard, iconHome, iconManagement, iconProfile, iconSubjects, iconTemplates, iconUsers } from "./templates/icons.js";

export function getNavigation(role) {
  const nav = [
    {
      title: "Public",
      items: [{ key: "home", href: "/", label: "Home", icon: iconHome }],
    },
  ];

  if (!role) return nav;

  if (role === "admin") {
    nav.push({
      title: "Workspace",
      items: [
        { key: "dashboard", href: "/dashboard", label: "Dashboard", icon: iconDashboard },
        { key: "profile", href: "/profile", label: "Profile", icon: iconProfile },
      ],
    });

  } else if (role === "teacher") {
    nav.push({
      title: "Workspace",
      items: [{ key: "profile", href: "/profile", label: "Profile", icon: iconProfile }],
    });
  }

  if (role === "admin") {
    nav.push({
      title: "Modules",
      collapsible: true,
      expandedKeys: ["templates", "classes", "subjects"],
      key: "modules",
      icon: iconManagement,
      items: [
        { key: "templates", href: "/templates", label: "Templates", icon: iconTemplates },
        { key: "classes", href: "/classes/manage", label: "Classes", icon: iconClasses },
        { key: "subjects", href: "/subjects", label: "Subjects", icon: iconSubjects },
      ],
    });

    nav.push({
      title: "Management",
      collapsible: true,
      expandedKeys: ["users"],
      key: "management",
      icon: iconManagement,
      items: [{ key: "users", href: "/users", label: "Users", icon: iconUsers }],
    });
  }

  return nav;
}
