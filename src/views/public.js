import { dashboardShell } from "./layout.js";

function frontPage({ navigation, userProfile, authAction, siteSettings, theme }) {
  return dashboardShell({
    title: "Front Page",
    navItems: navigation.navItems,
    bottomNavItems: navigation.bottomNavItems,
    sidebarTitle: siteSettings?.site_name || navigation.sidebarTitle,
    userProfile,
    authAction,
    theme,
    siteNameFont: siteSettings?.site_name_font,
    content: "",
  });
}

export { frontPage };
