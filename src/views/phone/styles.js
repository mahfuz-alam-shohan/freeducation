const phoneStyles = `
  .phone-auth-wrapper {
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 12px;
  }

  .phone-auth-card {
    width: min(360px, 100%);
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 14px;
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
  }

  .phone-auth-card h1 {
    margin: 0 0 6px;
    font-size: 17px;
  }

  .phone-auth-card p {
    margin: 0 0 12px;
    color: var(--muted);
    font-size: 13px;
    line-height: 1.4;
  }

  .phone-admin-layout {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .phone-topbar {
    height: 52px;
    border-bottom: 1px solid var(--border);
    background: var(--panel);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 14px;
    font-size: 14px;
  }

  .phone-content {
    padding: 12px 14px 72px;
  }

  .phone-bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 56px;
    background: var(--panel);
    border-top: 1px solid var(--border);
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  .phone-bottom-nav a {
    font-size: 11px;
    color: var(--muted);
  }

  .phone-bottom-nav a.active {
    color: var(--primary);
    font-weight: 600;
  }
`;

export { phoneStyles };
