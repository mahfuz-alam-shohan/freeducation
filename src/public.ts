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
        .hero { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 2rem; }
        .hero h1 { font-size: 3rem; background: linear-gradient(to right, var(--primary), var(--primary-dark)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0 0 1rem; }
        .hero p { max-width: 600px; color: var(--text-muted); font-size: 1.25rem; margin-bottom: 2rem; }
      </style>
    </head>
    <body>
      <div class="hero">
        <h1>Freeducation</h1>
        <p>Free educational resources, accessible to everyone. The student portal is currently under construction.</p>
        <a href="/admin" class="btn btn-primary">Admin Access</a>
      </div>
    </body>
    </html>
  `, { headers: { "Content-Type": "text/html" } });
}
