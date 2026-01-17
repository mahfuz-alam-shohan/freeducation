function renderPage({ title, body, extraHead = "" }) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <style>
      :root {
        color-scheme: light;
        --bg: #f7f8fb;
        --panel: #ffffff;
        --border: #d7dbe5;
        --text: #182230;
        --muted: #5f6c7b;
        --primary: #2155cd;
        --primary-soft: #e8efff;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        font-family: "Inter", system-ui, -apple-system, sans-serif;
        color: var(--text);
        background: var(--bg);
      }

      a {
        color: inherit;
        text-decoration: none;
      }

      .auth-wrapper {
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 16px;
      }

      .auth-card {
        width: min(420px, 100%);
        background: var(--panel);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 16px;
        box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
      }

      .auth-card h1 {
        margin: 0 0 6px;
        font-size: 18px;
      }

      .auth-card p {
        margin: 0 0 12px;
        color: var(--muted);
        font-size: 13px;
        line-height: 1.4;
      }

      .form-grid {
        display: grid;
        gap: 10px;
      }

      label {
        font-size: 12px;
        color: var(--muted);
      }

      input {
        width: 100%;
        padding: 8px 10px;
        border: 1px solid var(--border);
        border-radius: 8px;
        font-size: 14px;
        background: #fff;
      }

      button {
        border: none;
        background: var(--primary);
        color: #fff;
        padding: 8px 12px;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
      }

      .secondary {
        background: #fff;
        color: var(--primary);
        border: 1px solid var(--primary);
      }

      .message {
        padding: 8px 10px;
        border-radius: 8px;
        background: var(--primary-soft);
        color: var(--primary);
        font-size: 12px;
      }

      .admin-layout {
        display: grid;
        grid-template-columns: 220px 1fr;
        min-height: 100vh;
      }

      .sidebar {
        background: var(--panel);
        border-right: 1px solid var(--border);
        padding: 14px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .sidebar h2 {
        font-size: 15px;
        margin: 0 0 4px;
      }

      .nav-group {
        display: grid;
        gap: 6px;
      }

      .nav-link {
        padding: 8px 10px;
        border-radius: 8px;
        color: var(--muted);
        font-size: 13px;
      }

      .nav-link.active {
        background: var(--primary-soft);
        color: var(--primary);
        font-weight: 600;
      }

      .topbar {
        height: 52px;
        border-bottom: 1px solid var(--border);
        background: var(--panel);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 16px;
        font-size: 14px;
      }

      .content {
        padding: 12px 16px 72px;
      }

      .card {
        background: var(--panel);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 12px;
        margin-bottom: 12px;
      }

      .section-title {
        font-size: 15px;
        margin: 0 0 6px;
      }

      .small {
        font-size: 12px;
        color: var(--muted);
      }

      .bottom-nav {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 56px;
        background: var(--panel);
        border-top: 1px solid var(--border);
        display: none;
        justify-content: space-around;
        align-items: center;
      }

      .bottom-nav a {
        font-size: 11px;
        color: var(--muted);
      }

      .bottom-nav a.active {
        color: var(--primary);
        font-weight: 600;
      }

      @media (max-width: 900px) {
        .admin-layout {
          grid-template-columns: 1fr;
        }

        .sidebar {
          display: none;
        }

        .bottom-nav {
          display: flex;
        }
      }
    </style>
    ${extraHead}
  </head>
  <body>
    ${body}
  </body>
</html>`;
}

function adminShell({ title, userName, active, content }) {
  return renderPage({
    title,
    body: `
      <div class="admin-layout">
        <aside class="sidebar">
          <div>
            <h2>Freeducation Admin</h2>
            <div class="small">Signed in as ${userName}</div>
          </div>
          <nav class="nav-group">
            <a class="nav-link ${active === "home" ? "active" : ""}" href="/admin">Dashboard</a>
            <a class="nav-link ${active === "users" ? "active" : ""}" href="/admin/users">User Management</a>
            <a class="nav-link" href="#">Teachers (soon)</a>
            <a class="nav-link" href="#">Students (soon)</a>
            <a class="nav-link" href="#">Content (soon)</a>
          </nav>
          <form method="post" action="/logout">
            <button class="secondary" type="submit">Log out</button>
          </form>
        </aside>
        <main>
          <div class="topbar">
            <div>${title}</div>
            <div class="small">Admin controls</div>
          </div>
          <div class="content">
            ${content}
          </div>
        </main>
      </div>
      <nav class="bottom-nav">
        <a class="${active === "home" ? "active" : ""}" href="/admin">Home</a>
        <a class="${active === "users" ? "active" : ""}" href="/admin/users">Users</a>
        <a href="#">Content</a>
        <form method="post" action="/logout">
          <button class="secondary" type="submit">Logout</button>
        </form>
      </nav>
    `,
  });
}

export { adminShell, renderPage };
