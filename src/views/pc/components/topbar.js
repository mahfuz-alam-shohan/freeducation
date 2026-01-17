function topbar({ siteName, pageTitle, contextLabel, userProfile }) {
  const subtitle = contextLabel ? `${pageTitle} • ${contextLabel}` : pageTitle;
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
    <header class="pc-topbar">
      <div class="pc-topbar-left">
        <div class="site-logo">${siteInitial}</div>
        <div class="pc-topbar-titles">
          <div class="site-name">${siteName}</div>
          <div class="small">${subtitle}</div>
        </div>
      </div>
      <div class="pc-user-area">
        <div class="user-avatar">${initials}</div>
        <div class="pc-user-name">${userProfile?.name ?? "User"}</div>
        <form method="post" action="/logout">
          <button class="secondary" type="submit">Log out</button>
        </form>
      </div>
    </header>
  `;
}

export { topbar };
