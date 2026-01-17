import { dashboardShell } from "./layout.js";
import { getRoleNavigation } from "../lib/navigation.js";

function teacherDashboardPage(userProfile) {
  const navigation = getRoleNavigation("teacher", "home");

  return dashboardShell({
    title: "Teacher Dashboard",
    sidebarTitle: navigation.sidebarTitle,
    userProfile,
    navItems: navigation.navItems,
    bottomNavItems: navigation.bottomNavItems,
    content: `
      <div class="card">
        <h3 class="section-title">Teacher space</h3>
        <p class="small">Review lesson plans, track student notes, and prepare weekly reading guidance.</p>
      </div>
      <div class="info-grid">
        <div class="info-card">
          <strong>Upcoming sessions</strong>
          <p class="small">Mon • Socratic discussion on civic responsibility.</p>
          <p class="small">Wed • Essay workshop and peer review.</p>
        </div>
        <div class="info-card">
          <strong>Reading focus</strong>
          <p class="small">Highlight the primary texts and share annotations with your class.</p>
        </div>
        <div class="info-card">
          <strong>Quick actions</strong>
          <p class="small">Assign reading, publish notes, and open classroom feedback.</p>
        </div>
      </div>
      <div class="highlight-surface">
        <h3 class="section-title">Teacher notes</h3>
        <p class="small">Keep feedback concise and direct so students can read with clarity and confidence.</p>
      </div>
    `,
  });
}

export { teacherDashboardPage };
