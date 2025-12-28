import { createHtmlResponse, renderLogo } from "./ui";

export function renderPublicHome(): Response {
  return createHtmlResponse(
    `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Freeducation</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #4f46e5;
      --primary-hover: #4338ca;
      --text-main: #1f2937;
      --text-muted: #6b7280;
      --bg-page: #f9fafb;
      --bg-card: #ffffff;
      --border: #e5e7eb;
    }
    body {
      margin: 0;
      font-family: "Inter", sans-serif;
      background: var(--bg-page);
      color: var(--text-main);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 1.5rem;
    }
    .hero {
      background: var(--bg-card);
      max-width: 600px;
      width: 100%;
      text-align: center;
      padding: 3rem 2rem;
      border-radius: 1.5rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    .logo-container {
      display: inline-flex;
      justify-content: center;
      margin-bottom: 1.5rem;
    }
    h1 {
      font-size: 1.875rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 1rem;
      letter-spacing: -0.025em;
    }
    p {
      color: var(--text-muted);
      line-height: 1.6;
      font-size: 1.125rem;
      margin: 0;
    }
    .cta {
      display: inline-block;
      margin-top: 2rem;
      padding: 0.75rem 1.5rem;
      background: var(--primary);
      color: white;
      text-decoration: none;
      border-radius: 9999px;
      font-weight: 500;
      transition: background 0.2s;
    }
    .cta:hover {
      background: var(--primary-hover);
    }
  </style>
</head>
<body>
  <div class="hero">
    <div class="logo-container">${renderLogo(64)}</div>
    <h1>Freeducation</h1>
    <p>
      We are building the future of accessible learning. <br/>
      Student portal, course library, and community spaces coming soon.
    </p>
    <a href="/admin" class="cta">Admin Access</a>
  </div>
</body>
</html>`
  );
}
