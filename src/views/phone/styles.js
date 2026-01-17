const phoneStyles = `
  .phone-auth-shell {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--bg);
  }

  .phone-auth-wrapper {
    flex: 1;
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
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.1);
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

  .phone-shell {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--bg);
    padding-bottom: 56px;
    overflow: hidden;
  }

  .phone-topbar {
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

  .phone-topbar-left {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .phone-user-menu {
    position: relative;
  }

  .phone-user-summary {
    list-style: none;
    cursor: pointer;
  }

  .phone-user-summary::-webkit-details-marker {
    display: none;
  }

  .phone-user-panel {
    position: absolute;
    top: calc(100% + 6px);
    right: 0;
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 10px;
    display: grid;
    gap: 6px;
    min-width: 180px;
    box-shadow: 0 6px 18px rgba(15, 23, 42, 0.1);
    z-index: 10;
  }

  .phone-user-panel form {
    margin: 0;
  }

  .phone-user-name {
    font-weight: 600;
    font-size: 13px;
  }

  .phone-content {
    flex: 1;
    overflow-y: auto;
    padding: 12px 12px 72px;
    display: grid;
    gap: 12px;
  }

  .phone-bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 56px;
    background: #ffffff;
    border-top: 1px solid var(--border);
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-shadow: 0 -6px 18px rgba(15, 23, 42, 0.06);
    z-index: 20;
  }

  .phone-bottom-nav a {
    font-size: 11px;
    color: var(--muted);
    transition: color 160ms ease;
  }

  .phone-topbar .button-link {
    padding: 6px 10px;
    font-size: 12px;
    border-radius: 999px;
  }

  .phone-bottom-nav a.active {
    color: var(--primary);
    font-weight: 600;
  }
`;

export { phoneStyles };
