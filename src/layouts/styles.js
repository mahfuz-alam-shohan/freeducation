export function baseStyles() {
  return `
    <style>
      :root {
        color-scheme: light;
        --bg: #f7f7f8;
        --card: #ffffff;
        --text: #1c1c1c;
        --muted: #6a6a6a;
        --line: #e2e2e2;
        --accent: #1b4fe0;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        font-family: "Inter", "Segoe UI", sans-serif;
        color: var(--text);
        background: var(--bg);
      }

      h1, h2, h3 {
        margin: 0 0 8px;
        font-weight: 600;
      }

      p {
        margin: 0 0 8px;
      }

      .muted {
        color: var(--muted);
      }

      .button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: var(--accent);
        color: #fff;
        text-decoration: none;
        border: none;
        padding: 10px 16px;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
      }

      .text-link {
        color: var(--accent);
        text-decoration: none;
        font-weight: 600;
      }

      .alert {
        padding: 10px 12px;
        background: #fff1e8;
        border: 1px solid #ffd2b8;
        border-radius: 8px;
        color: #9e3d1f;
        margin-bottom: 12px;
      }

      .card {
        background: var(--card);
        border: 1px solid var(--line);
        border-radius: 10px;
        padding: 16px;
      }

      .form {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      label {
        display: flex;
        flex-direction: column;
        gap: 6px;
        font-size: 14px;
      }

      input {
        padding: 8px 10px;
        border: 1px solid var(--line);
        border-radius: 6px;
        font-size: 14px;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 14px;
      }

      th, td {
        text-align: left;
        padding: 8px 6px;
        border-bottom: 1px solid var(--line);
      }

      .public-shell {
        max-width: 900px;
        margin: 0 auto;
        padding: 24px 16px 32px;
        display: grid;
        gap: 20px;
      }

      .public-card {
        background: var(--card);
        border: 1px solid var(--line);
        border-radius: 12px;
        padding: 20px;
        display: grid;
        gap: 16px;
      }

      .brand {
        display: grid;
        gap: 6px;
      }

      .logo {
        font-size: 20px;
        font-weight: 700;
      }

      .tagline {
        color: var(--muted);
        font-size: 14px;
      }

      .app-shell {
        min-height: 100vh;
        display: grid;
        grid-template-columns: 220px 1fr;
        grid-template-rows: 56px 1fr;
        grid-template-areas:
          "top-bar top-bar"
          "side-bar content";
      }

      .top-bar {
        grid-area: top-bar;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 16px;
        border-bottom: 1px solid var(--line);
        background: var(--card);
      }

      .top-bar-actions {
        display: flex;
        gap: 12px;
        align-items: center;
        font-size: 14px;
      }

      .side-bar {
        grid-area: side-bar;
        border-right: 1px solid var(--line);
        background: var(--card);
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .content-shell {
        grid-area: content;
        padding: 20px;
      }

      .panel {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .card-grid {
        display: grid;
        gap: 12px;
      }

      .chip-row {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-top: 8px;
      }

      .chip {
        background: #eef2ff;
        color: #1b4fe0;
        padding: 4px 8px;
        border-radius: 999px;
        font-size: 12px;
      }

      .split {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 12px;
      }

      .nav-item {
        display: flex;
        padding: 10px 12px;
        border-radius: 8px;
        text-decoration: none;
        color: var(--text);
        font-weight: 600;
        border: 1px solid transparent;
      }

      .nav-item.active {
        background: #eef2ff;
        border-color: #d6defe;
        color: #1b4fe0;
      }

      .bottom-nav {
        display: none;
      }

      .mobile-only {
        display: none;
      }

      .desktop-only {
        display: block;
      }

      @media (max-width: 900px) {
        .app-shell {
          grid-template-columns: 1fr;
          grid-template-rows: 56px 1fr 56px;
          grid-template-areas:
            "top-bar"
            "content"
            "bottom";
        }

        .side-bar {
          display: none;
        }

        .content-shell {
          padding: 16px;
        }

        .bottom-nav {
          grid-area: bottom;
          display: flex;
          gap: 8px;
          align-items: center;
          justify-content: space-around;
          background: var(--card);
          border-top: 1px solid var(--line);
          padding: 6px;
        }

        .mobile-only {
          display: flex;
        }

        .desktop-only {
          display: none;
        }
      }
    </style>
  `;
}
