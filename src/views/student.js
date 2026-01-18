import { buildSiteIdentity, dashboardShell } from "./layout.js";
import { getRoleNavigation } from "../lib/navigation.js";

function studentDashboardPage(userProfile, siteSettings, theme) {
  const navigation = getRoleNavigation("student", "home");

  return dashboardShell({
    title: "Student Dashboard",
    sidebarTitle: siteSettings?.site_name || navigation.sidebarTitle,
    userProfile,
    navItems: navigation.navItems,
    bottomNavItems: navigation.bottomNavItems,
    theme,
    siteNameFont: siteSettings?.site_name_font,
    siteIdentity: buildSiteIdentity(siteSettings),
    content: `
      <section class="panel">
        <div class="page-header">
          <div>
            <div class="eyebrow">Student dashboard</div>
            <h1 class="page-title">Your reading plan and reflections.</h1>
            <p class="page-subtitle">Stay focused on today’s reading and keep notes organized.</p>
          </div>
        </div>
      </section>
      <section class="panel-grid">
        <div class="panel compact">
          <h2 class="section-title">Today’s reading</h2>
          <p class="small">Complete the assigned chapter and add two reflections in your notes.</p>
          <div class="chip-group">
            <span class="chip">Chapter 4</span>
            <span class="chip">Reflections</span>
          </div>
        </div>
        <div class="panel compact">
          <h2 class="section-title">Assignments</h2>
          <ul class="list">
            <li>Submit the response essay by Friday.</li>
            <li>Review teacher feedback in the notes tab.</li>
          </ul>
        </div>
        <div class="panel compact">
          <h2 class="section-title">Progress</h2>
          <p class="small">You have completed 3 of 5 readings this week.</p>
          <div class="note">Aim to finish one reading per day for steady progress.</div>
        </div>
      </section>
      <section class="panel">
        <h2 class="section-title">Study checklist</h2>
        <ul class="list">
          <li>Review highlighted passages from the teacher.</li>
          <li>Mark definitions that are new to you.</li>
          <li>Prepare one discussion question for class.</li>
        </ul>
      </section>
    `,
  });
}

export { studentDashboardPage };
