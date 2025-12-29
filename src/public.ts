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
        .hero h1 { font-size: clamp(2.1rem, 4vw, 3rem); margin: 0 0 0.5rem; letter-spacing: -0.6px; }
        .hero p { max-width: 520px; color: var(--text-muted); font-size: 1rem; margin: 0 0 1.2rem; }
        .home-actions { display: flex; gap: 12px; flex-wrap: wrap; }
      </style>
    </head>
    <body>
      <div class="home-shell">
        <div class="home-card">
          <div class="home-header">
            <div class="home-brand">
              <div class="brand-logo">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 8l8-4 8 4-8 4-8-4z"></path>
                  <path d="M8 12v4.5c0 .9 3.2 2.5 4 2.5s4-1.6 4-2.5V12"></path>
                  <path d="M4 8v5c0 2.5 4 4.5 8 4.5"></path>
                </svg>
              </div>
              <div>
                <div class="brand-title">Freeducation</div>
                <div class="brand-subtitle">Admin workspace</div>
              </div>
            </div>
            <a href="/admin" class="btn btn-secondary">Admin Access</a>
          </div>
          <div class="hero">
            <h1>Manage content with clarity.</h1>
            <p>Jump straight into classes, chapters, and topics.</p>
            <div class="home-actions">
              <a href="/admin" class="btn btn-primary">Open Admin</a>
              <a href="/admin" class="btn btn-secondary">View Dashboard</a>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `, { headers: { "Content-Type": "text/html" } });
}
