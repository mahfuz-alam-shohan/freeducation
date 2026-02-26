export function dashboardHtml() {
  return `
    <section class="dash-grid">
      <article class="dash-card"><div class="dash-label">Total administrators</div><div id="totalAdmins" class="dash-kpi">-</div></article>
      <article class="dash-card"><div class="dash-label">Active sessions</div><div id="activeSessions" class="dash-kpi">-</div></article>
    </section>
  `;
}
