export const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const commonHead = (title: string) => `
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)} | Freeducation</title>
    <link rel="stylesheet" href="/styles.css" />
    <meta name="theme-color" content="#4f46e5">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  </head>
`;

export const publicLayout = (title: string, body: string) => `<!doctype html>
<html lang="bn"> <!-- Set to Bengali for proper font rendering context -->
  ${commonHead(title)}
  <body>
    <header class="topbar">
      <div class="container flex-between">
        <a href="/" class="brand">
          <div class="brand-icon">F</div>
          Freeducation
        </a>
        <nav class="flex-wrap">
          <a href="/" class="btn btn-outline btn-sm">Home</a>
          <a href="/admin" class="btn btn-primary btn-sm">Instructor Login</a>
        </nav>
      </div>
    </header>
    
    <main>
      ${body}
    </main>

    <footer class="footer">
      <div class="container">
        <p class="text-sm">Built for the students of Bangladesh 🇧🇩</p>
        <p class="text-sm" style="margin-top: 0.5rem; opacity: 0.7;">Open Source Learning Management System</p>
      </div>
    </footer>
  </body>
</html>`;

export const adminLayout = (title: string, body: string, adminName?: string) => `<!doctype html>
<html lang="en">
  ${commonHead(title)}
  <body>
    <div class="container" style="padding-top: 2rem; padding-bottom: 4rem;">
      <div class="flex-between" style="margin-bottom: 2rem;">
        <div>
          <a href="/admin/dashboard" class="brand" style="font-size: 1.5rem;">Admin Console</a>
          <p class="text-sm">Managing: ${adminName ? escapeHtml(adminName) : 'Guest'}</p>
        </div>
        <div class="flex-wrap">
          <a href="/admin/dashboard" class="btn btn-outline btn-sm">Dashboard</a>
          <a href="/admin/classes" class="btn btn-outline btn-sm">All Classes</a>
          <a href="/admin/logout" class="btn btn-primary btn-sm" style="background: #ef4444; border:none;">Logout</a>
        </div>
      </div>
      
      <div class="card">
        <h1 style="margin-bottom: 1.5rem; font-size: 1.8rem; border-bottom: 1px solid var(--border); padding-bottom: 1rem;">${escapeHtml(title)}</h1>
        ${body}
      </div>
    </div>
  </body>
</html>`;
