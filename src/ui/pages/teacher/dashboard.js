import { renderDashboardPage } from "../shared/dashboardRenderer.js";

const TEACHER_DASHBOARD_STYLE = `
.teacher-dashboard{display:grid;gap:10px;max-width:860px;margin:0 auto}
.teacher-dashboard-card{border:1px solid var(--border);background:var(--surface);border-radius:10px;padding:8px;display:grid;gap:7px}
.teacher-dashboard-card h2{margin:0;font-size:1.05rem}
.teacher-dashboard-muted{margin:0;color:var(--text-muted);font-size:.92rem}
.teacher-device-row{display:flex;justify-content:space-between;gap:10px;padding:7px 0;border-top:1px solid var(--border)}
.teacher-device-row:first-of-type{border-top:0;padding-top:0}
.teacher-device-row strong{font-size:.92rem}
.teacher-device-row span{color:var(--text-muted);text-align:right;font-size:.9rem}
.teacher-links{display:grid;gap:6px}
.teacher-link{display:flex;justify-content:space-between;align-items:center;text-decoration:none;color:var(--text);border:1px solid var(--border);background:var(--surface-soft);border-radius:8px;padding:6px 8px}
.teacher-link span{color:var(--text-muted);font-size:.88rem}
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
  if (!isoValue) return "-";
  const parsed = new Date(isoValue);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleString(undefined, { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function teacherDashboardPage({ admin, navItems, homePath, currentDeviceLabel = "Unknown device", loginAt = "" }) {
  return renderDashboardPage({
    title: "Teacher dashboard",
    activeMenu: "",
    homePath,
    navItems,
    admin,
    pageClass: "page-teacher-dashboard",
    pageStyles: TEACHER_DASHBOARD_STYLE,
    content: `
      <section class="teacher-dashboard">
        <article class="teacher-dashboard-card">
          <h2>Logged in device</h2>
          <p class="teacher-dashboard-muted">This is the device information from your active teacher session.</p>
          <div class="teacher-device-row"><strong>Device</strong><span>${escapeHtml(currentDeviceLabel)}</span></div>
          <div class="teacher-device-row"><strong>Login time</strong><span>${escapeHtml(formatIsoDate(loginAt))}</span></div>
        </article>

        <article class="teacher-dashboard-card">
          <h2>Quick links</h2>
          <div class="teacher-links">
            <a class="teacher-link" href="/teacher/profile?tab=security&openPassword=1">Change password <span>Open security tab</span></a>
            <a class="teacher-link" href="/teacher/profile">Profile <span>Update name, date of birth, gender</span></a>
          </div>
        </article>
      </section>
    `,
  });
}
