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
        <details class="phone-user-menu">
          <summary class="phone-user-summary">
            <span class="user-avatar">${initials}</span>
          </summary>
          <div class="phone-user-panel">
            <div class="phone-user-name">${userProfile?.name ?? "User"}</div>
            <div class="phone-user-email">${userProfile?.email ?? ""}</div>
            <form method="post" action="/logout">
              <button class="secondary" type="submit">Log out</button>
            </form>
          </div>
        </details>
      `
    : `
        <a class="button-link secondary" href="${authAction?.href ?? "/login"}">${
          authAction?.label ?? "Log in"
        }</a>
      `;

  return `
    <header class="phone-topbar">
      <div class="phone-topbar-left">
        <div class="site-brand">
          <span class="site-logo logo-style-${logoStyle}">${logoMarkup}</span>
          <div class="site-name">${brandName}</div>
        </div>
      </div>
      ${authSlot}
    </header>
  `;
}

export { topbar };
