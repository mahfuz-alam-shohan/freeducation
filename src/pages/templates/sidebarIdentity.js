function formatRole(role) {
  if (!role) return "user";
  return String(role).replace(/[_-]+/g, " ").trim().replace(/\s+/g, " ").toLowerCase();
}

export function sidebarIdentityMarkup(user) {
  if (!user) return "";
  const name = user.name ? String(user.name) : "User";
  const role = formatRole(user.role);
  return `<p class="muted sidebar-login-note">Logged in as <strong class="login-name">${name}</strong> (${role})</p>`;
}
