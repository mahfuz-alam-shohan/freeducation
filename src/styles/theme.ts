export const themeStyles = `
  :root {
    color-scheme: light;
    --font-body: "Inter", "Segoe UI", Arial, sans-serif;
    --color-bg: #0f132f;
    --color-surface: #151a3f;
    --color-surface-muted: #1b2254;
    --color-surface-elevated: #202862;
    --color-text: #f2f4ff;
    --color-text-muted: #c0c7f2;
    --color-border: #2f3570;
    --color-border-strong: #3c4591;
    --color-link: #8ea0ff;
    --color-link-hover: #b1c0ff;
    --color-accent: #5b6dff;
    --shadow-sm: 0 12px 24px rgba(9, 12, 32, 0.35);
    --radius-sm: 0;
    --radius-md: 0;
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
