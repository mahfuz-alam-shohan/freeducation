export const themeStyles = `
  @import url("https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;500;600;700&family=Source+Serif+4:wght@400;600;700&display=swap");

  :root {
    color-scheme: light;
    --font-body: "Source Sans 3", "Segoe UI", sans-serif;
    --font-display: "Source Serif 4", "Georgia", serif;
    --color-bg: #f5f3ee;
    --color-bg-alt: #eef3f9;
    --color-surface: #ffffff;
    --color-surface-muted: #f1f4f8;
    --color-surface-elevated: #e7ecf4;
    --color-text: #1b2533;
    --color-text-muted: #5b6676;
    --color-border: #d1d9e6;
    --color-border-strong: #b8c3d6;
    --color-link: #1f5fa5;
    --color-link-hover: #133f6c;
    --color-accent: #1f7ea5;
    --color-accent-strong: #165d7e;
    --color-danger: #8b1f3c;
    --color-danger-bg: #ffe8ed;
    --color-success: #2d5016;
    --color-success-bg: #e7f2dc;
    --color-overlay: rgba(255, 255, 255, 0.88);
    --shadow-sm: 0 10px 22px rgba(15, 23, 42, 0.08);
    --shadow-md: 0 20px 40px rgba(15, 23, 42, 0.12);
    --radius-sm: 10px;
    --radius-md: 14px;
    --radius-lg: 18px;
  }

  :root[data-theme="dark"] {
    color-scheme: dark;
    --color-bg: #0e141b;
    --color-bg-alt: #141c27;
    --color-surface: #18212d;
    --color-surface-muted: #1d2736;
    --color-surface-elevated: #233145;
    --color-text: #e4edf9;
    --color-text-muted: #98a7bb;
    --color-border: #2b374b;
    --color-border-strong: #3a4a63;
    --color-link: #8cc7ff;
    --color-link-hover: #c1e2ff;
    --color-accent: #5fc8ff;
    --color-accent-strong: #2ea9e0;
    --color-danger: #f19cb3;
    --color-danger-bg: #3a1f2a;
    --color-success: #8dd17b;
    --color-success-bg: #1f2c1b;
    --color-overlay: rgba(10, 14, 19, 0.8);
    --shadow-sm: 0 14px 30px rgba(0, 0, 0, 0.45);
    --shadow-md: 0 22px 46px rgba(0, 0, 0, 0.55);
  }

  body {
    background: var(--color-bg);
    background-image:
      radial-gradient(circle at 15% 15%, rgba(31, 126, 165, 0.18), transparent 45%),
      radial-gradient(circle at 80% 10%, rgba(66, 111, 186, 0.12), transparent 40%),
      linear-gradient(180deg, var(--color-bg), var(--color-bg-alt));
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
