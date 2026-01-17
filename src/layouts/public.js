import { baseStyles } from "./styles.js";
import { escapeHtml } from "../utils/format.js";

export function renderPublicLayout({ title, heading, subtitle, body }) {
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
        <main class="public-shell">
          <div class="brand">
            <div class="logo">Freeducation</div>
            <div class="tagline">Learning + community, built for focus.</div>
          </div>
          <section class="public-card">
            <header>
              <h1>${escapeHtml(heading)}</h1>
              <p class="muted">${escapeHtml(subtitle)}</p>
            </header>
            ${body}
          </section>
        </main>
      </body>
    </html>
  `;
}

export function renderNotFound() {
  return renderPublicLayout({
    title: "Page not found",
    heading: "Page not found",
    subtitle: "The page you requested does not exist.",
    body: `<a class="button" href="/">Go home</a>`,
  });
}
