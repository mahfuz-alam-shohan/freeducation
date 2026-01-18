import { buildSiteIdentity, dashboardShell } from "./layout.js";
import { getRoleNavigation } from "../lib/navigation.js";

function teacherDashboardPage(userProfile, siteSettings, theme) {
  const navigation = getRoleNavigation("teacher", "home");

  return dashboardShell({
    title: "Teacher Dashboard",
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
            <div class="eyebrow">Teacher dashboard</div>
            <h1 class="page-title">Plan readings and support your class.</h1>
            <p class="page-subtitle">Keep lesson notes clear and easy for students to follow.</p>
          </div>
        </div>
      </section>
      <section class="panel-grid">
        <div class="panel compact">
          <h2 class="section-title">Upcoming sessions</h2>
          <ul class="list">
            <li>Monday: Socratic discussion on civic responsibility.</li>
            <li>Wednesday: Essay workshop and peer review.</li>
          </ul>
        </div>
        <div class="panel compact">
          <h2 class="section-title">Reading focus</h2>
          <p class="small">Highlight primary texts and share notes before class.</p>
          <div class="chip-group">
            <span class="chip">Primary text</span>
            <span class="chip">Annotations</span>
            <span class="chip">Guiding questions</span>
          </div>
        </div>
        <div class="panel compact">
          <h2 class="section-title">Quick actions</h2>
          <ul class="list">
            <li>Assign this week’s reading.</li>
            <li>Publish lesson notes.</li>
            <li>Open classroom feedback.</li>
          </ul>
        </div>
      </section>
      <section class="panel">
        <h2 class="section-title">Teacher notes</h2>
        <p class="small">Keep feedback concise so students can read with clarity and confidence.</p>
      </section>
    `,
  });
}

export { teacherDashboardPage };
