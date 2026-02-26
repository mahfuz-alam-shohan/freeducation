export function dashboardHtml() {
  return `
    <section class="dash-grid">
      <article class="dash-card">
        <div class="dash-bg-icon dash-bg-icon-admins" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
            <path d="M12 12.1a3.4 3.4 0 1 0 0-6.8 3.4 3.4 0 0 0 0 6.8z" />
            <path d="M5.8 11.4a2.8 2.8 0 1 0 0-5.6 2.8 2.8 0 0 0 0 5.6z" />
            <path d="M18.2 11.4a2.8 2.8 0 1 0 0-5.6 2.8 2.8 0 0 0 0 5.6z" />
            <path d="M4 18c.2-2.2 2.2-3.7 4.8-3.7s4.5 1.4 4.8 3.7" />
            <path d="M10.3 18c.3-2.6 2.7-4.3 5.7-4.3s5.4 1.7 5.7 4.3" />
          </svg>
        </div>
        <div class="dash-label">Total administrators</div>
        <div id="totalAdmins" class="dash-kpi">-</div>
        <div class="dash-note">Accounts with dashboard access</div>
      </article>
      <article class="dash-card">
        <div class="dash-bg-icon dash-bg-icon-sessions" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
            <path d="M5 7.2h14" />
            <path d="M9.3 4.7v2.5" />
            <path d="M14.7 4.7v2.5" />
            <rect x="4.2" y="6.5" width="15.6" height="12.8" rx="2.6" />
            <path d="M12 10.3v3.2l2.4 1.4" />
          </svg>
        </div>
        <div class="dash-label">Active sessions</div>
        <div id="activeSessions" class="dash-kpi">-</div>
        <div class="dash-note">Users currently signed in</div>
      </article>
    </section>
  `;
}
