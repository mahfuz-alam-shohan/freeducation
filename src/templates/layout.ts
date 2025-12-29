export const escapeHtml = (str: string) => str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const head = (title: string) => `
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)} | Freeducation BD</title>
  <link rel="stylesheet" href="/styles.css">
</head>
`;

export const publicLayout = (title: string, body: string) => `<!doctype html>
<html>
${head(title)}
<body>
  <nav style="background:white; border-bottom:1px solid var(--slate-200); position:sticky; top:0; z-index:50;">
    <div class="container" style="display:flex; justify-content:space-between; align-items:center; height:60px;">
      <a href="/" style="font-weight:700; font-size:1.2rem; color:var(--primary);">Freeducation<span style="color:var(--accent);">.BD</span></a>
      <div style="display:flex; gap:1rem;">
        <a href="/" class="btn btn-sm btn-outline">Home</a>
        <a href="/admin" class="btn btn-sm btn-primary">Instructor Login</a>
      </div>
    </div>
  </nav>
  <main>${body}</main>
  <footer style="background:var(--slate-800); color:white; padding:3rem 0; margin-top:4rem;">
    <div class="container text-center">
      <p>&copy; 2025 Freeducation Bangladesh. All rights reserved.</p>
      <p style="font-size:0.8rem; opacity:0.7;">Empowering students with free, high-quality resources.</p>
    </div>
  </footer>
</body>
</html>
`;

export const adminLayout = (title: string, body: string, adminName: string, section: string) => `<!doctype html>
<html>
${head(title)}
<body>
  <div class="admin-layout">
    <aside class="sidebar">
      <div style="font-weight:700; font-size:1.2rem; margin-bottom:2rem; padding-left:1rem;">Freeducation<br><span style="font-size:0.8rem; font-weight:400; opacity:0.7;">Instructor Panel</span></div>
      
      <div class="nav-section">Main</div>
      <a href="/admin/dashboard" class="nav-link ${section==='dashboard'?'active':''}">Dashboard</a>
      
      <div class="nav-section">Curriculum</div>
      <a href="/admin/classes" class="nav-link ${section==='classes'?'active':''}">Manage Syllabus</a>
      
      <div class="nav-section">System</div>
      <a href="/admin/logout" class="nav-link">Logout</a>
      
      <div style="margin-top:auto; font-size:0.8rem; opacity:0.5; padding-left:1rem;">
        Logged in as<br><strong>${adminName}</strong>
      </div>
    </aside>
    <main class="main-content">
      ${body}
    </main>
  </div>
</body>
</html>
`;


