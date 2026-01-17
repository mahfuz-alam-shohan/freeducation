function topbar({ siteName, userProfile, authAction }) {
  const initials = userProfile?.name
    ? userProfile.name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase()
    : "U";

  const authSlot = userProfile
    ? `
        <div class="pc-user-area">
          <div class="user-avatar">${initials}</div>
          <div class="pc-user-name">${userProfile?.name ?? "User"}</div>
          <form method="post" action="/logout">
            <button class="secondary" type="submit">Log out</button>
          </form>
        </div>
      `
    : `
        <div class="pc-user-area">
          <a class="button-link secondary" href="${authAction?.href ?? "/login"}">${
            authAction?.label ?? "Log in"
          }</a>
        </div>
      `;

  return `
    <header class="pc-topbar">
      <div class="pc-topbar-left">
        <button class="sidebar-toggle" type="button" aria-label="Toggle sidebar" title="Toggle sidebar">
          ☰
        </button>
        <div class="pc-topbar-titles">
          <div class="site-name">${siteName}</div>
        </div>
      </div>
      ${authSlot}
    </header>
  `;
}

export { topbar };
