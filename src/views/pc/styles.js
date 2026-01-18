const pcStyles = `
  .pc-auth-shell {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--bg);
  }

  .pc-auth-wrapper {
    flex: 1;
    display: grid;
    place-items: center;
    padding: 20px 16px;
  }

  .pc-auth-card {
    width: min(440px, 100%);
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 16px;
    display: grid;
    gap: 12px;
  }

  .pc-auth-card h1 {
    margin: 0;
    font-size: 20px;
  }

  .pc-auth-card p {
    margin: 0;
    color: var(--muted);
    font-size: 13px;
    line-height: 1.5;
  }

  .pc-admin-layout {
    display: grid;
    grid-template-rows: auto 1fr;
    min-height: 100vh;
  }

  .pc-admin-body {
    display: grid;
    grid-template-columns: 220px 1fr;
    min-height: 0;
  }

  .sidebar-collapsed .pc-admin-body {
    grid-template-columns: 72px 1fr;
  }

  .pc-sidebar {
    background: var(--panel);
    border-right: 1px solid var(--border);
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .sidebar-collapsed .pc-sidebar {
    padding: 10px;
  }

  .pc-nav-title {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--muted);
  }

  .pc-nav-group {
    display: grid;
    gap: 6px;
  }

  .pc-nav-link {
    padding: 7px 8px;
    border-radius: 6px;
    color: var(--muted);
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: background 160ms ease, color 160ms ease, transform 160ms ease;
  }

  .pc-nav-icon {
    width: 24px;
    height: 24px;
    border-radius: 6px;
    display: grid;
    place-items: center;
    background: var(--primary-soft);
    color: var(--primary);
  }

  .pc-nav-icon svg {
    width: 14px;
    height: 14px;
    stroke: currentColor;
    fill: none;
    stroke-width: 1.6;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .pc-nav-icon.tone-sun {
    background: var(--sunrise);
    color: var(--primary);
  }

  .pc-nav-icon.tone-mint {
    background: var(--mint);
    color: var(--text);
  }

  .pc-nav-icon.tone-coral {
    background: var(--coral);
    color: var(--text);
  }

  .pc-nav-icon.tone-sky {
    background: var(--sky);
    color: var(--text);
  }

  .sidebar-collapsed .pc-nav-text {
    display: none;
  }

  .sidebar-collapsed .pc-nav-link {
    justify-content: center;
    padding: 8px;
  }

  .pc-nav-link:hover {
    background: var(--primary-soft);
    color: var(--text);
    transform: translateX(2px);
  }

  .pc-nav-link.active {
    background: var(--primary-soft);
    color: var(--text);
    font-weight: 600;
  }

  .pc-topbar {
    height: 48px;
    border-bottom: 1px solid var(--border);
    background: var(--panel);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 12px;
    font-size: 14px;
  }

  .pc-topbar-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .sidebar-toggle {
    border: 1px solid var(--border);
    background: #fff;
    border-radius: 6px;
    width: 32px;
    height: 32px;
    display: grid;
    place-items: center;
    cursor: pointer;
    font-size: 16px;
    color: var(--text);
    padding: 0;
  }

  .pc-topbar-titles {
    display: grid;
    gap: 2px;
  }

  .pc-user-area {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .pc-user-area form {
    margin: 0;
  }

  .pc-user-meta {
    display: grid;
    gap: 2px;
  }

  .pc-user-name {
    font-size: 13px;
    font-weight: 600;
  }

  .pc-user-email {
    font-size: 11px;
    color: var(--muted);
  }

  .pc-content {
    padding: 12px 14px;
    display: grid;
    background: var(--bg);
  }

  .content-frame {
    max-width: 1100px;
    width: 100%;
    display: grid;
    gap: 12px;
  }
`;

export { pcStyles };
