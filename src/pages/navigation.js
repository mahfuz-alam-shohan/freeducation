import { iconClasses, iconDashboard, iconFiles, iconHome, iconManagement, iconProfile, iconSubjects, iconTemplates, iconUsers } from "./templates/icons.js";

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
        { key: "results", href: "/results", label: "Results", icon: iconDashboard },
      ],
    });

  } else if (role === "teacher") {
    nav.push({
      title: "Workspace",
      items: [{ key: "profile", href: "/profile", label: "Profile", icon: iconProfile }, { key: "results", href: "/results", label: "Results", icon: iconDashboard }],
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
      expandedKeys: ["users", "file-manager"],
      key: "management",
      icon: iconManagement,
      items: [{ key: "users", href: "/users", label: "Users", icon: iconUsers }, { key: "file-manager", href: "/admin/file-manager", label: "File manager", icon: iconFiles }],
    });
  }

  return nav;
}
