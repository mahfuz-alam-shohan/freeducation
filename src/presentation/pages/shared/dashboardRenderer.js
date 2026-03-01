import { renderAppShellLayout } from "../../layout/appShell/index.js";

const ROLE_DASHBOARD_STYLE = `
.role-dashboard{display:grid;gap:var(--space-2)}
.role-dashboard-card{border:1px solid var(--border);background:var(--surface);border-radius:var(--radius-md);padding:var(--space-2);display:grid;gap:var(--space-2)}
.role-dashboard-card h2{margin:0;font-size:1.02rem}
.role-dashboard-table{width:100%;border-collapse:collapse;font-size:.93rem}
.role-dashboard-table th,.role-dashboard-table td{border:1px solid var(--border);padding:var(--space-2) var(--space-3);text-align:left;vertical-align:top}
.role-dashboard-table th{background:var(--surface-soft);font-weight:600;width:180px}
.role-dashboard-actions{display:grid;gap:var(--space-2)}
.role-dashboard-link{display:block;border:1px solid var(--border);background:var(--surface-soft);border-radius:var(--radius-sm);padding:var(--space-2) var(--space-3);color:var(--text)}
`;

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatIsoDate(isoValue) {
  if (!isoValue) return "Not available";
  const parsed = new Date(isoValue);
  if (Number.isNaN(parsed.getTime())) return "Not available";
  return parsed.toLocaleString(undefined, { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function renderDashboardPage({
  title = "Dashboard",
  activeMenu = "",
  homePath = "/",
  navItems,
  user,
  apiBase = "",
  content = "",
  rightSidebar = "",
  pageClass = "",
  pageStyles = "",
  script = "",
  headerCenter = "",
}) {
  return renderAppShellLayout({
    title,
    activeMenu,
    homePath,
    navItems,
    user,
    apiBase,
    content,
    rightSidebar,
    pageClass,
    pageStyles,
    script,
    headerCenter,
  });
}

export function renderSimpleRoleDashboard({ roleName, homePath, navItems, user, currentDeviceLabel = "", loginAt = "", apiBase = "" }) {
  const roleLabel = String(roleName || "User").trim() || "User";
  const rolePath = roleLabel.toLowerCase();

  return renderDashboardPage({
    title: `${roleLabel} dashboard`,
    activeMenu: "",
    homePath,
    navItems,
    user,
    apiBase,
    pageClass: `page-${rolePath}-dashboard`,
    pageStyles: ROLE_DASHBOARD_STYLE,
    content: `
      <section class="role-dashboard">
        <article class="role-dashboard-card">
          <h2>Device list</h2>
          <table class="role-dashboard-table" aria-label="Logged in device list">
            <tbody>
              <tr><th scope="row">Device</th><td>${escapeHtml(currentDeviceLabel || "Not available")}</td></tr>
              <tr><th scope="row">Login time</th><td>${escapeHtml(formatIsoDate(loginAt))}</td></tr>
            </tbody>
          </table>
        </article>
        <article class="role-dashboard-card">
          <h2>Account actions</h2>
          <div class="role-dashboard-actions">
            <a class="role-dashboard-link" href="/${rolePath}/profile?tab=security&openPassword=1#security">Change password</a>
            <a class="role-dashboard-link" href="/${rolePath}/profile">Profile settings</a>
          </div>
        </article>
      </section>
    `,
  });
}

export function renderTeacherDashboard({ user, navItems, homePath, currentDeviceLabel = "", loginAt = "", apiBase = "" }) {
  return renderSimpleRoleDashboard({
    roleName: "Teacher",
    homePath,
    navItems,
    user,
    currentDeviceLabel,
    loginAt,
    apiBase,
  });
}
