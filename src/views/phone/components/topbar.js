function topbar({ siteName, userProfile }) {
  const siteInitial = siteName ? siteName[0].toUpperCase() : "F";
  const initials = userProfile?.name
    ? userProfile.name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase()
    : "U";

  return `
    <header class="phone-topbar">
      <div class="phone-topbar-left">
        <div class="site-logo">${siteInitial}</div>
        <div class="site-name">${siteName}</div>
      </div>
      <details class="phone-user-menu">
        <summary class="phone-user-summary">
          <span class="user-avatar">${initials}</span>
        </summary>
        <div class="phone-user-panel">
          <div class="phone-user-name">${userProfile?.name ?? "User"}</div>
          <div class="small">${userProfile?.email ?? ""}</div>
          <form method="post" action="/logout">
            <button class="secondary" type="submit">Log out</button>
          </form>
        </div>
      </details>
    </header>
  `;
}

export { topbar };
