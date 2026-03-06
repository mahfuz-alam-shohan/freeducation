function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function roleLabel(userType = "") {
  const role = String(userType || "").trim().toLowerCase();
  if (role === "administrator") return "Admin";
  if (role === "teacher") return "Teacher";
  if (role === "student") return "Student";
  return "Guest";
}

function sectionLabel(activeMenu = "") {
  const raw = String(activeMenu || "").trim();
  if (!raw) return "Home";
  return raw
    .replaceAll(/[-_]+/g, " ")
    .replaceAll(/\s+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function renderDefaultRightSidebar({ user = null, activeMenu = "" } = {}) {
  const signedIn = Boolean(user);
  const name = String(user?.name || "").trim();
  const label = roleLabel(user?.user_type || "");

  return `
    <aside id="appRightSidebar" class="app-right-sidebar" aria-label="Workspace sidebar">
      <section class="app-right-rail">
        <article class="app-right-card">
          <p class="app-right-eyebrow">Session</p>
          <h2>${signedIn ? escapeHtml(name || "User") : "Visitor mode"}</h2>
          <p>${signedIn ? `${escapeHtml(label)} workspace active.` : "Log in for full tools and shortcuts."}</p>
        </article>
        <article class="app-right-card">
          <p class="app-right-eyebrow">Current page</p>
          <h3>${escapeHtml(sectionLabel(activeMenu))}</h3>
          <p>This panel is fixed and ready for custom widgets.</p>
        </article>
      </section>
    </aside>
  `;
}
