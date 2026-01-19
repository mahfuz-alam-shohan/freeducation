export const themeStyles = `
  :root {
    color-scheme: light;
    --font-body: "Inter", "Segoe UI", Arial, sans-serif;
    --color-bg: #f5f7fb;
    --color-surface: #ffffff;
    --color-surface-muted: #eef2f8;
    --color-text: #1f2a3a;
    --color-text-muted: #516176;
    --color-border: #d2dae8;
    --color-border-strong: #bcc7db;
    --color-link: #2563eb;
    --color-link-hover: #1d4ed8;
    --color-accent: #2563eb;
    --shadow-sm: 0 8px 24px rgba(15, 23, 42, 0.08);
    --radius-sm: 6px;
    --radius-md: 12px;
  }

  body {
    background: var(--color-bg);
    color: var(--color-text);
    font-family: var(--font-body);
  }

  button,
  input,
  select,
  textarea {
    font: inherit;
    color: inherit;
  }

  button {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    padding: 8px 12px;
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.2s ease, background-color 0.2s ease;
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  button:hover { transform: translateY(-1px); box-shadow: var(--shadow-sm); }
  button:active { transform: translateY(0); box-shadow: none; }

  input,
  select,
  textarea {
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    padding: 8px 10px;
    background: var(--color-surface);
  }

  input:focus,
  select:focus,
  textarea:focus {
    outline: 2px solid var(--color-accent);
    outline-offset: 1px;
    border-color: var(--color-accent);
  }
`;
