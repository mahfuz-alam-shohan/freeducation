import { dashboardShell } from "./layout.js";
import { getRoleNavigation } from "../lib/navigation.js";

function studentDashboardPage(userProfile) {
  const navigation = getRoleNavigation("student", "home");

  return dashboardShell({
    title: "Student Dashboard",
    sidebarTitle: navigation.sidebarTitle,
    userProfile,
    navItems: navigation.navItems,
    bottomNavItems: navigation.bottomNavItems,
    content: `
      <div class="card">
        <h3 class="section-title">Student space</h3>
        <p class="small">Continue lessons, review notes, and track reading progress.</p>
      </div>
      <div class="info-grid">
        <div class="info-card">
          <strong>Today’s reading</strong>
          <p class="small">Finish the assigned chapter and add two reflections.</p>
        </div>
        <div class="info-card">
          <strong>Assignments</strong>
          <p class="small">Submit your response essay by Friday afternoon.</p>
        </div>
        <div class="info-card">
          <strong>Progress</strong>
          <p class="small">You have completed 3 of 5 readings this week.</p>
        </div>
      </div>
      <div class="accent-band">
        <h3 class="section-title">Study checklist</h3>
        <ul class="timeline">
          <li>Review annotation highlights from the teacher.</li>
          <li>Mark key definitions in your notes.</li>
          <li>Prepare one discussion question.</li>
        </ul>
      </div>
    `,
  });
}

export { studentDashboardPage };
