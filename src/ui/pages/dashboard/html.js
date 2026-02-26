export function dashboardHtml() {
  return `
    <section class="dash-grid">
      <article class="dash-card">
        <div class="dash-card-head">
          <div class="dash-label">Total administrators</div>
          <div class="dash-icon" aria-hidden="true">👥</div>
        </div>
        <div id="totalAdmins" class="dash-kpi">-</div>
        <div class="dash-note">Accounts with dashboard access</div>
      </article>
      <article class="dash-card">
        <div class="dash-card-head">
          <div class="dash-label">Active sessions</div>
          <div class="dash-icon" aria-hidden="true">⚡</div>
        </div>
        <div id="activeSessions" class="dash-kpi">-</div>
        <div class="dash-note">Users currently signed in</div>
      </article>
    </section>
  `;
}
