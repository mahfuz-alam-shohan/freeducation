export const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export const publicLayout = (title: string, body: string) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <link rel="stylesheet" href="/styles.css" />
  </head>
  <body class="bg-surface">
    <header class="topbar">
      <div class="container">
        <div class="brand">Freeducation LMS</div>
        <nav class="topnav">
          <a href="/">Home</a>
          <a href="/admin">Admin</a>
        </nav>
      </div>
    </header>
    <main class="container page">${body}</main>
    <footer class="footer">
      <div class="container">
        <p>Powered by the Bangladeshi education structure · Free learning resources for everyone.</p>
      </div>
    </footer>
  </body>
</html>`;

export const adminLayout = (title: string, body: string, adminName?: string) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <link rel="stylesheet" href="/styles.css" />
  </head>
  <body class="app-shell">
    <div class="sidebar">
      <div>
        <div class="brand">Admin Console</div>
        <p class="muted">Manage classes, subjects, chapters, topics, and files.</p>
      </div>
      <nav class="nav-links">
        <a href="/admin/dashboard">Dashboard</a>
        <a href="/admin/classes">Classes</a>
      </nav>
      <div class="sidebar-footer">
        <span class="muted">${adminName ? `Signed in as ${escapeHtml(adminName)}` : ''}</span>
        <a href="/admin/logout">Sign out</a>
      </div>
    </div>
    <div class="content">
      <header class="content-header">
        <h1>${escapeHtml(title)}</h1>
      </header>
      <main class="content-body">
        ${body}
      </main>
    </div>
  </body>
</html>`;
