import { CSS } from "./ui";

export function renderHome(): Response {
  return new Response(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Freeducation</title>
      <style>
        ${CSS}
        body { padding-bottom: 0; }
        .home-shell { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px 16px; }
        .home-card {
          width: min(920px, 100%);
          background: white;
          border-radius: 28px;
          padding: 28px;
          box-shadow: var(--shadow-soft);
          border: 1px solid rgba(15, 28, 22, 0.06);
        }
        .home-header { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; margin-bottom: 24px; }
        .home-brand { display: flex; align-items: center; gap: 14px; }
        .hero {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          align-items: center;
          gap: 24px;
        }
        .hero h1 { font-size: clamp(2.2rem, 4vw, 3.5rem); margin: 0 0 0.75rem; letter-spacing: -0.6px; }
        .hero p { max-width: 520px; color: var(--text-muted); font-size: 1.1rem; margin-bottom: 1.5rem; }
        .hero-card {
          background: var(--bg-surface);
          border-radius: 22px;
          padding: 22px;
          box-shadow: var(--shadow-card);
          border: 1px solid var(--separator-light);
        }
        .hero-list { display: grid; gap: 12px; margin: 0; padding: 0; list-style: none; }
        .hero-list li {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          background: white;
          border-radius: 14px;
          border: 1px solid var(--separator-light);
          font-weight: 600;
          color: var(--text-secondary);
        }
        .home-footer { margin-top: 20px; color: var(--text-muted); font-size: 13px; }
      </style>
    </head>
    <body>
      <div class="home-shell">
        <div class="home-card">
          <div class="home-header">
            <div class="home-brand">
              <div class="brand-logo">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 6h9a4 4 0 0 1 4 4v10a3 3 0 0 0-3-3H4z"></path>
                  <path d="M20 6h-4a3 3 0 0 0-3 3v11"></path>
                  <path d="M8 4v2"></path>
                  <path d="M12 4v2"></path>
                </svg>
              </div>
              <div>
                <div class="brand-title">Freeducation</div>
                <div class="brand-subtitle">Knowledge for everyone</div>
              </div>
            </div>
            <a href="/admin" class="btn btn-secondary">Admin Access</a>
          </div>
          <div class="hero">
            <div>
              <h1>Learn freely. Grow confidently.</h1>
              <p>Freeducation is building a refined, app-like learning space that feels at home on mobile or desktop. The student portal is in progress, but the admin workspace is ready.</p>
              <div style="display:flex; gap:12px; flex-wrap:wrap;">
                <a href="/admin" class="btn btn-primary">Open Admin Workspace</a>
                <a href="/admin" class="btn btn-secondary">Preview Dashboard</a>
              </div>
            </div>
            <div class="hero-card">
              <h3 style="margin-top:0;">What’s coming</h3>
              <ul class="hero-list">
                <li><span class="badge blue">New</span> App-like mobile layouts</li>
                <li><span class="badge">Live</span> Structured classes and subjects</li>
                <li><span class="badge purple">Next</span> Lessons, quizzes, and progress</li>
              </ul>
            </div>
          </div>
          <div class="home-footer">Freeducation • Built for curious minds</div>
        </div>
      </div>
    </body>
    </html>
  `, { headers: { "Content-Type": "text/html" } });
}
