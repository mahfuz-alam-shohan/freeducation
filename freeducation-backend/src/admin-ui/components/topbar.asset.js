export function renderTopbar(title, user) {
  const initials = getInitials(user);
  return `
    <!-- Desktop layout - Full branding and user info -->
    <div class="desktop-layout">
      <div class="branding">
        <h1 class="app-title">FREEDUCATION</h1>
        <span class="app-subtitle">Admin Console</span>
      </div>
      
      <div class="user-section">
        <div class="user-details">
          <div class="user-avatar">${initials}</div>
          <div class="user-info">
            <div class="user-name">${user.firstName} ${user.lastName}</div>
            <div class="user-email">${user.email}</div>
          </div>
        </div>
        <button class="logout-button" data-action="logout">
          <span class="logout-icon">↪</span>
          <span class="logout-text">Sign out</span>
        </button>
      </div>
    </div>
    
    <!-- Mobile layout - Menu left, Site name center, Avatar right -->
    <div class="mobile-layout">
      <div class="mobile-bar">
        <button class="mobile-menu-toggle" data-action="toggle-nav" aria-label="Toggle navigation">
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>

        <div class="mobile-site-name">FREEDUCATION</div>

        <div class="mobile-user-avatar" title="${user.firstName} ${user.lastName}">${initials}</div>
      </div>
    </div>
  `;
}

function getInitials(user) {
  const first = (user.firstName || '').trim();
  const last = (user.lastName || '').trim();
  const firstInitial = first ? first[0] : '';
  const lastInitial = last ? last[0] : '';
  const initials = `${firstInitial}${lastInitial}`.toUpperCase();
  return initials || 'FE';
}
