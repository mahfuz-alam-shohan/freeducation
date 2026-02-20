import { appShell } from '../templates/shell.js';

export function dashboardPage(user, stats) {
  const content = `
    <section class="section-stack">
      <section class="grid grid-3 kpi-grid">
        <article class="card kpi-card"><p class="muted">Total users</p><p class="kpi">${stats.userCount}</p></article>
        <article class="card kpi-card"><p class="muted">Admins</p><p class="kpi">${stats.adminCount}</p></article>
        <article class="card kpi-card"><p class="muted">Active sessions</p><p class="kpi">${stats.sessionCount}</p></article>
      </section>

      <section class="card">
        <h3 class="card-title">What this dashboard shows</h3>
        <p class="muted">All values on this page come directly from the current database state. Use the users page to review account-level details.</p>
      </section>
    </section>
    `;

  return appShell('dashboard', user, 'Dashboard overview', 'Live system metrics.', content);
}
