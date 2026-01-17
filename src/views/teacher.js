import { dashboardShell } from "./layout.js";
import { getRoleNavigation } from "../lib/navigation.js";

function teacherDashboardPage() {
  const navigation = getRoleNavigation("teacher", "home");

  return dashboardShell({
    title: "Teacher Dashboard",
    contextLabel: navigation.contextLabel,
    sidebarTitle: navigation.sidebarTitle,
    userProfile: navigation.userProfile,
    navItems: navigation.navItems,
    bottomNavItems: navigation.bottomNavItems,
    content: `
      <div class="card">
        <h3 class="section-title">Teacher space</h3>
        <p class="small">Manage classes, assignments, and learning plans here.</p>
      </div>
    `,
  });
}

export { teacherDashboardPage };
