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
    background: linear-gradient(160deg, #ffffff 0%, #fff1e6 100%);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 12px 28px rgba(249, 115, 22, 0.12);
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
    background: linear-gradient(180deg, #fff7ed 0%, #ffffff 70%);
    border-right: 1px solid var(--border);
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    box-shadow: inset -1px 0 0 rgba(249, 115, 22, 0.08);
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
    background: var(--primary-soft);
    color: #b45309;
  }

  .pc-nav-icon svg {
    width: 16px;
    height: 16px;
    stroke: currentColor;
    fill: none;
    stroke-width: 1.6;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .pc-nav-icon.tone-sun {
    background: #ffedd5;
    color: #c2410c;
  }

  .pc-nav-icon.tone-mint {
    background: #dcfce7;
    color: #15803d;
  }

  .pc-nav-icon.tone-coral {
    background: #fee2e2;
    color: #b91c1c;
  }

  .pc-nav-icon.tone-sky {
    background: #e0f2fe;
    color: #0369a1;
  }

  .sidebar-collapsed .pc-nav-text {
    display: none;
  }

  .sidebar-collapsed .pc-nav-link {
    justify-content: center;
    padding: 8px;
  }

  .pc-nav-link:hover {
    background: #fff1e6;
    color: #c2410c;
    transform: translateX(2px);
  }

  .pc-nav-link.active {
    background: #fff1e6;
    color: #c2410c;
    font-weight: 600;
  }

  .pc-topbar {
    height: 52px;
    border-bottom: 1px solid var(--border);
    background: linear-gradient(90deg, #fff7ed 0%, #fff1f2 100%);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 12px;
    font-size: 14px;
    box-shadow: 0 6px 16px rgba(249, 115, 22, 0.08);
  }

  .pc-topbar-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .sidebar-toggle {
    border: 1px solid var(--border);
    background: #fff7ed;
    border-radius: 8px;
    width: 32px;
    height: 32px;
    display: grid;
    place-items: center;
    cursor: pointer;
    font-size: 16px;
    color: #c2410c;
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

  .pc-user-name {
    font-size: 13px;
    font-weight: 600;
  }

  .pc-content {
    padding: 12px;
    display: grid;
    gap: 12px;
    background: linear-gradient(180deg, #fff7ed 0%, #fef3c7 100%);
  }
`;

export { pcStyles };
