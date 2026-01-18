function topbar({ siteName, siteIdentity, userProfile, authAction }) {
  const brandName = siteIdentity?.name || siteName;
  const logoSource = siteIdentity?.logoSource || "text";
  const logoStyle = siteIdentity?.logoStyle || "badge";
  const logoText = siteIdentity?.logoText || brandName || "Site";
  const logoUrl = siteIdentity?.logoUrl || "";
  const logoLabel = (logoText || brandName || "Site").trim();
  const shortLogo = logoLabel
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
  const showImage = logoSource === "upload" && logoUrl;
  const logoMarkup = showImage
    ? `<img src="${logoUrl}" alt="${brandName || "Site"} logo" />`
    : shortLogo || "S";
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
          <div class="pc-user-meta">
            <div class="pc-user-name">${userProfile?.name ?? "User"}</div>
            <div class="pc-user-email">${userProfile?.email ?? ""}</div>
          </div>
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
          <div class="site-brand">
            <span class="site-logo logo-style-${logoStyle}">${logoMarkup}</span>
            <div class="site-name">${brandName}</div>
          </div>
        </div>
      </div>
      ${authSlot}
    </header>
  `;
}

export { topbar };
