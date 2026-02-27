import { renderAdminLayout } from "../../layout/adminLayout.js";

const ROLE_DASHBOARD_STYLE = `
.role-dashboard{display:grid;gap:8px;max-width:860px;margin:0 auto}
.role-dashboard-card{border:1px solid var(--border);background:var(--surface);border-radius:10px;padding:8px;display:grid;gap:8px}
.role-dashboard-card h2{margin:0;font-size:1.02rem}
.role-dashboard-table{width:100%;border-collapse:collapse;font-size:.93rem}
.role-dashboard-table th,.role-dashboard-table td{border:1px solid var(--border);padding:6px 8px;text-align:left;vertical-align:top}
.role-dashboard-table th{background:var(--surface-soft);font-weight:600;width:180px}
.role-dashboard-actions{display:grid;gap:6px}
.role-dashboard-link{display:block;border:1px solid var(--border);background:var(--surface-soft);border-radius:8px;padding:6px 8px;color:var(--text)}
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

export function renderSimpleRoleDashboard({ roleName, homePath, navItems, admin, currentDeviceLabel = "", loginAt = "" }) {
  const roleLabel = String(roleName || "User").trim() || "User";
  const rolePath = roleLabel.toLowerCase();

  return renderDashboardPage({
    title: `${roleLabel} dashboard`,
    activeMenu: "",
    homePath,
    navItems,
    admin,
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

export function renderTeacherDashboard({ admin, navItems, homePath, currentDeviceLabel = "", loginAt = "" }) {
  return renderSimpleRoleDashboard({
    roleName: "Teacher",
    homePath,
    navItems,
    admin,
    currentDeviceLabel,
    loginAt,
  });
}
