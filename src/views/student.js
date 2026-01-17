import { dashboardShell } from "./layout.js";
import { getRoleNavigation } from "../lib/navigation.js";

function studentDashboardPage() {
  const navigation = getRoleNavigation("student", "home");

  return dashboardShell({
    title: "Student Dashboard",
    contextLabel: navigation.contextLabel,
    sidebarTitle: navigation.sidebarTitle,
    userProfile: navigation.userProfile,
    navItems: navigation.navItems,
    bottomNavItems: navigation.bottomNavItems,
    content: `
      <div class="card">
        <h3 class="section-title">Student space</h3>
        <p class="small">Continue lessons, review progress, and see assignments.</p>
      </div>
    `,
  });
}

export { studentDashboardPage };
