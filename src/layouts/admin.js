import { baseStyles } from "./styles.js";
import { escapeHtml } from "../utils/format.js";

export function renderAdminLayout({ title, user, active, content }) {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${escapeHtml(title)}</title>
        ${baseStyles()}
      </head>
      <body>
        <div class="app-shell">
          <header class="top-bar">
            <div class="logo">Freeducation</div>
            <div class="top-bar-actions">
              <span class="muted">Signed in as ${escapeHtml(user.full_name)}</span>
              <a class="text-link" href="/logout">Logout</a>
            </div>
          </header>
          <aside class="side-bar desktop-only">
            ${renderNav(active)}
          </aside>
          <main class="content-shell">
            ${content}
          </main>
          <nav class="bottom-nav mobile-only">
            ${renderNav(active)}
          </nav>
        </div>
      </body>
    </html>
  `;
}

export function renderNav(active) {
  return `
    <a class="nav-item ${active === "dashboard" ? "active" : ""}" href="/admin">Dashboard</a>
    <a class="nav-item ${active === "users" ? "active" : ""}" href="/admin/users">User management</a>
  `;
}
