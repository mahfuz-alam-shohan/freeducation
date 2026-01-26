export function renderTopbar(title, user) {
  return `
    <header class="topbar">
      <div class="topbar-title">
        <button class="icon-button mobile-only" data-action="toggle-nav" aria-label="Toggle navigation">
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <div class="topbar-brand">FREEDUCATION</div>
        <h1>${title}</h1>
      </div>
      <div class="user">
        <div>
          <strong>${user.firstName} ${user.lastName}</strong>
          <span>${user.email}</span>
        </div>
        <button class="button secondary" data-action="logout">Sign out</button>
      </div>
    </header>
  `;
}
