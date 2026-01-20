export const themeStyles = `
  :root {
    color-scheme: light;
    --font-body: "Inter", "Segoe UI", Arial, sans-serif;
    --color-bg: #f6f7fb;
    --color-surface: #ffffff;
    --color-surface-muted: #f0f2f7;
    --color-surface-elevated: #e7eaf3;
    --color-text: #1c2230;
    --color-text-muted: #5d657a;
    --color-border: #d4d9e4;
    --color-border-strong: #b7bfd0;
    --color-link: #2945d0;
    --color-link-hover: #1c35a6;
    --color-accent: #2f5bff;
    --shadow-sm: 0 8px 18px rgba(16, 24, 40, 0.08);
    --radius-sm: 10px;
    --radius-md: 14px;
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
    transition: background-color 0.2s ease, border-color 0.2s ease;
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  button:hover { background: var(--color-surface-muted); border-color: var(--color-border-strong); }
  button:active { background: var(--color-surface-elevated); }

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
