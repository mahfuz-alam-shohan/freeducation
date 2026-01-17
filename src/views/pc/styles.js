const pcStyles = `
  .pc-auth-wrapper {
    min-height: 100vh;
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
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
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

  .pc-sidebar {
    background: linear-gradient(180deg, #ffffff 0%, #f4f6ff 100%);
    border-right: 1px solid var(--border);
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .pc-nav-group {
    display: grid;
    gap: 6px;
  }

  .pc-nav-link {
    padding: 8px 10px;
    border-radius: 8px;
    color: var(--muted);
    font-size: 13px;
    transition: background 160ms ease, color 160ms ease;
  }

  .pc-nav-link:hover {
    background: var(--primary-soft);
    color: var(--primary);
  }

  .pc-nav-link.active {
    background: var(--primary-soft);
    color: var(--primary);
    font-weight: 600;
  }

  .pc-topbar {
    height: 52px;
    border-bottom: 1px solid var(--border);
    background: linear-gradient(90deg, #ffffff 0%, #eef2ff 100%);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    font-size: 14px;
    box-shadow: 0 6px 14px rgba(15, 23, 42, 0.05);
  }

  .pc-topbar-left {
    display: flex;
    align-items: center;
    gap: 10px;
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
    padding: 12px 16px 72px;
  }
`;

export { pcStyles };
