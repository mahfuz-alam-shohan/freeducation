export const themeStyles = `
  :root {
    color-scheme: light;
    --font-body: "Inter", "Segoe UI", Arial, sans-serif;
    --color-bg: #edf2fb;
    --color-surface: #ffffff;
    --color-surface-muted: #e4ecf8;
    --color-text: #1a2332;
    --color-text-muted: #4d5a6b;
    --color-border: #c8d3e3;
    --color-border-strong: #b2bfd2;
    --color-link: #1e5ad7;
    --color-link-hover: #1546ac;
    --color-accent: #2d6ae8;
    --shadow-sm: 0 6px 18px rgba(18, 28, 48, 0.12);
    --radius-sm: 6px;
    --radius-md: 10px;
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
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

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
