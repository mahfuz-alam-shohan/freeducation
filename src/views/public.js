import { dashboardShell } from "./layout.js";

function frontPage({ navigation, userProfile, authAction }) {
  return dashboardShell({
    title: "Front Page",
    navItems: navigation.navItems,
    bottomNavItems: navigation.bottomNavItems,
    sidebarTitle: navigation.sidebarTitle,
    userProfile,
    authAction,
    content: "",
  });
}

export { frontPage };
