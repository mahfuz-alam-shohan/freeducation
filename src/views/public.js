import { buildSiteIdentity, dashboardShell } from "./layout.js";

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
    siteIdentity: buildSiteIdentity(siteSettings),
    content: `
      <section class="panel">
        <div class="page-header">
          <div>
            <div class="eyebrow">Learning hub</div>
            <h1 class="page-title">A calm workspace for reading, notes, and progress.</h1>
            <p class="page-subtitle">
              Freeducation keeps lesson materials and reflections in one place so students and teachers stay aligned.
            </p>
          </div>
          ${
            userProfile
              ? ""
              : `<div class="page-actions">
                  <a class="button-link" href="/login">Log in</a>
                </div>`
          }
        </div>
      </section>
      <section class="panel-grid">
        <div class="panel compact">
          <h2 class="section-title">Focused reading flow</h2>
          <p class="small">
            Track readings by week, keep annotations together, and return to key passages without noise.
          </p>
          <div class="chip-group">
            <span class="chip">Reading sets</span>
            <span class="chip">Highlights</span>
            <span class="chip">Reflections</span>
          </div>
        </div>
        <div class="panel compact">
          <h2 class="section-title">Clear roles</h2>
          <p class="small">
            Admins manage the library, teachers guide groups, and students see only what they need today.
          </p>
          <div class="chip-group">
            <span class="chip">Admin</span>
            <span class="chip">Teacher</span>
            <span class="chip">Student</span>
          </div>
        </div>
        <div class="panel compact">
          <h2 class="section-title">Reliable updates</h2>
          <p class="small">
            Live refresh keeps dashboards current without interrupting lessons.
          </p>
          <div class="chip-group">
            <span class="chip">Auto refresh</span>
            <span class="chip">Low distraction</span>
          </div>
        </div>
      </section>
      <section class="panel">
        <h2 class="section-title">Getting started</h2>
        <ul class="list">
          <li>Create your admin account in the setup page.</li>
          <li>Add teachers and students from the user management area.</li>
          <li>Upload reading content and share weekly plans with your classes.</li>
        </ul>
      </section>
    `,
  });
}

export { frontPage };
