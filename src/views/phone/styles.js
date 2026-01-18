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
    padding: 18px 12px;
  }

  .phone-auth-card {
    width: min(360px, 100%);
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 14px;
    display: grid;
    gap: 10px;
  }

  .phone-auth-card h1 {
    margin: 0;
    font-size: 18px;
  }

  .phone-auth-card p {
    margin: 0;
    color: var(--muted);
    font-size: 13px;
    line-height: 1.5;
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
    height: 48px;
    border-bottom: 1px solid var(--border);
    background: var(--panel);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 12px;
    font-size: 14px;
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
    border-radius: 8px;
    padding: 10px;
    display: grid;
    gap: 6px;
    min-width: 180px;
    z-index: 10;
  }

  .phone-user-panel form {
    margin: 0;
  }

  .phone-user-name {
    font-weight: 600;
    font-size: 13px;
  }

  .phone-user-email {
    font-size: 11px;
    color: var(--muted);
  }

  .phone-content {
    flex: 1;
    overflow-y: auto;
    padding: 12px 12px 72px;
    display: grid;
    background: var(--bg);
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
    z-index: 20;
  }

  .phone-bottom-link {
    font-size: 11px;
    color: var(--muted);
    transition: color 160ms ease;
    display: grid;
    gap: 4px;
    justify-items: center;
  }

  .phone-topbar .button-link {
    padding: 6px 10px;
    font-size: 12px;
    border-radius: 999px;
  }

  .phone-nav-icon {
    width: 22px;
    height: 22px;
    border-radius: 6px;
    display: grid;
    place-items: center;
    background: var(--primary-soft);
    color: var(--primary);
  }

  .phone-nav-icon svg {
    width: 14px;
    height: 14px;
    stroke: currentColor;
    fill: none;
    stroke-width: 1.6;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .phone-nav-icon.tone-sun {
    background: var(--sunrise);
    color: var(--primary);
  }

  .phone-nav-icon.tone-mint {
    background: var(--mint);
    color: var(--text);
  }

  .phone-nav-icon.tone-coral {
    background: var(--coral);
    color: var(--text);
  }

  .phone-nav-icon.tone-sky {
    background: var(--sky);
    color: var(--text);
  }

  .phone-bottom-link.active {
    color: var(--text);
    font-weight: 600;
  }

  .content-frame {
    display: grid;
    gap: 12px;
  }
`;

export { phoneStyles };
