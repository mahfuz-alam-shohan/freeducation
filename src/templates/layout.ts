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
    <title>${escapeHtml(title)} | Freeducation BD</title>
    <link rel="stylesheet" href="/styles.css" />
    <meta name="theme-color" content="#6366f1">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  </head>
`;

export const publicLayout = (title: string, body: string) => `<!doctype html>
<html lang="bn">
  ${commonHead(title)}
  <body>
    <nav class="nav-bar">
      <div class="container flex-between">
        <a href="/" class="logo-area">
          <div class="logo-box">F</div>
          <span style="font-weight: 700; font-size: 1.1rem; color: var(--primary-dark);">Freeducation</span>
        </a>
        <div style="display: flex; gap: 1rem;">
          <a href="/admin" class="btn btn-soft" style="padding: 0.5rem 1rem; border-radius: 12px; font-size: 0.9rem;">Instructor Mode</a>
        </div>
      </div>
    </nav>
    
    <main>
      ${body}
    </main>

    <footer style="text-align: center; padding: 4rem 0; color: #64748b; font-size: 0.9rem;">
      <p>Made with ❤️ for the students of Bangladesh 🇧🇩</p>
      <p style="opacity: 0.7;">Providing free access to NCTB curriculum, Board Questions, and Solutions.</p>
    </footer>
  </body>
</html>`;

export const adminLayout = (title: string, body: string, adminName?: string) => `<!doctype html>
<html lang="en">
  ${commonHead(title)}
  <body style="background: #f8fafc;">
    <div class="container" style="padding-top: 2rem; padding-bottom: 4rem;">
      <div class="glass-card mb-4" style="background: #1e293b; color: white;">
        <div class="flex-between">
          <div>
            <h1 style="color: white; font-family: var(--font-en);">Admin Console</h1>
            <p style="opacity: 0.7;">${adminName ? `Welcome, ${escapeHtml(adminName)}` : 'Manage Content'}</p>
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <a href="/admin/dashboard" class="btn btn-soft" style="background: rgba(255,255,255,0.1); color: white;">Dashboard</a>
            <a href="/admin/classes" class="btn btn-soft" style="background: rgba(255,255,255,0.1); color: white;">Classes</a>
            <a href="/admin/logout" class="btn btn-soft" style="background: #ef4444; color: white;">Logout</a>
          </div>
        </div>
      </div>
      
      <div class="glass-card">
        <h2 class="mb-4" style="border-bottom: 1px solid #e2e8f0; padding-bottom: 1rem;">${escapeHtml(title)}</h2>
        ${body}
      </div>
    </div>
  </body>
</html>`;
