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
    padding: 16px;
  }

  .pc-auth-card {
    width: min(420px, 100%);
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 10px 28px rgba(15, 23, 42, 0.1);
  }

  .pc-auth-card h1 {
    margin: 0 0 6px;
    font-size: 18px;
  }

  .pc-auth-card p {
    margin: 0 0 12px;
    color: var(--muted);
    font-size: 13px;
    line-height: 1.4;
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
    background: #ffffff;
    border-right: 1px solid var(--border);
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    box-shadow: inset -1px 0 0 rgba(15, 23, 42, 0.03);
  }

  .sidebar-collapsed .pc-sidebar {
    padding: 10px;
  }

  .pc-nav-group {
    display: grid;
    gap: 6px;
  }

  .pc-nav-link {
    padding: 8px 10px;
    border-radius: 10px;
    color: var(--muted);
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: background 160ms ease, color 160ms ease, transform 160ms ease;
  }

  .pc-nav-icon {
    width: 26px;
    height: 26px;
    border-radius: 8px;
    display: grid;
    place-items: center;
    font-size: 12px;
    background: rgba(59, 130, 246, 0.12);
    color: var(--primary);
    font-weight: 600;
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
    color: var(--primary);
    transform: translateX(2px);
  }

  .pc-nav-link.active {
    background: var(--primary-soft);
    color: var(--primary);
    font-weight: 600;
  }

  .pc-topbar {
    height: 52px;
    border-bottom: 1px solid var(--border);
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 12px;
    font-size: 14px;
    box-shadow: 0 6px 16px rgba(15, 23, 42, 0.04);
  }

  .pc-topbar-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .sidebar-toggle {
    border: 1px solid var(--border);
    background: #fff;
    border-radius: 8px;
    width: 32px;
    height: 32px;
    display: grid;
    place-items: center;
    cursor: pointer;
    font-size: 16px;
    color: var(--primary);
    padding: 0;
  }

  .pc-topbar-titles {
    display: grid;
    gap: 2px;
  }

  .site-name {
    font-size: 14px;
    font-weight: 600;
  }

  .pc-user-area {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .pc-user-area form {
    margin: 0;
  }

  .pc-user-name {
    font-size: 13px;
    font-weight: 600;
  }

  .pc-content {
    padding: 12px;
    display: grid;
    gap: 12px;
    background: var(--bg);
  }
`;

export { pcStyles };
