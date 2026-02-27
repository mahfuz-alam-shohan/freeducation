import { renderAdminLayout } from "../../layout/adminLayout.js";

const SIMPLE_ROLE_DASHBOARD_STYLE = `
.role-dash{max-width:720px;margin:0 auto;padding:8px;border:1px solid var(--border);background:var(--surface);border-radius:10px}
.role-dash h2{margin:0 0 8px;font-size:1.2rem}
.role-dash p{margin:0;color:var(--text-muted)}
`;

const SIMPLE_ROLE_DASHBOARD_SCRIPT = `
(() => {
  const logoutButton = document.getElementById('logout');
  if (!logoutButton) return;
  const controller = new AbortController();
  const { signal } = controller;
  if (typeof window.__registerCleanup === 'function') {
    window.__registerCleanup(() => controller.abort());
  }
  logoutButton.addEventListener('click', async () => {
    await fetch('/api/logout', { method: 'POST', signal });
    if (window.__appNavigate) window.__appNavigate('/admin/login');
    else window.location.href = '/admin/login';
  }, { signal });
})();
`;

export function renderDashboardPage({
  title = "Dashboard",
  activeMenu = "",
  homePath = "/admin/dashboard",
  navItems,
  admin,
  content = "",
  pageClass = "",
  pageStyles = "",
  script = "",
}) {
  return renderAdminLayout({
    title,
    activeMenu,
    homePath,
    navItems,
    admin,
    content,
    pageClass,
    pageStyles,
    script,
  });
}

export function renderSimpleRoleDashboard({ roleName, homePath, navItems, admin }) {
  const roleLabel = String(roleName || "User").trim() || "User";

  return renderDashboardPage({
    title: `${roleLabel} dashboard`,
    activeMenu: "",
    homePath,
    navItems,
    admin,
    content: `
      <section class="role-dash">
        <h2>${roleLabel} dashboard</h2>
        <p>This dashboard is ready. Only the profile menu is enabled for now.</p>
      </section>
    `,
    pageClass: `page-${roleLabel.toLowerCase()}-dashboard`,
    pageStyles: SIMPLE_ROLE_DASHBOARD_STYLE,
    script: SIMPLE_ROLE_DASHBOARD_SCRIPT,
  });
}
