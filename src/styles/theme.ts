export const themeStyles = `
  :root {
    color-scheme: light;
    --font-body: "Inter", "Segoe UI", Arial, sans-serif;
    --color-bg: #f6f7f9;
    --color-surface: #ffffff;
    --color-surface-muted: #f0f2f5;
    --color-text: #1f2430;
    --color-text-muted: #5d6574;
    --color-border: #e2e6ee;
    --color-border-strong: #cfd6e2;
    --color-link: #1c5bd8;
    --color-link-hover: #144ab0;
    --color-accent: #2a6df4;
    --shadow-sm: 0 6px 16px rgba(20, 24, 32, 0.08);
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
