import { iconFiles, iconHome, iconManagement, iconProfile, iconUsers } from "./templates/icons.js";

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
      items: [{ key: "profile", href: "/profile", label: "Profile", icon: iconProfile }],
    });

  } else if (role === "teacher") {
    nav.push({
      title: "Workspace",
      items: [{ key: "profile", href: "/profile", label: "Profile", icon: iconProfile }],
    });
  }

  if (role === "admin") {
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
