// Base reset and typography styles
export const baseStyles = `
  @import url("../assets/fonts/fonts.css");

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
    --shadow-sm: 0 1px 3px rgba(15, 23, 42, 0.05);
    --shadow-md: 0 2px 6px rgba(15, 23, 42, 0.08);
    --radius-sm: 4px;
    --radius-md: 4px;
    --radius-lg: 4px;
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
    --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.15);
    --shadow-md: 0 2px 6px rgba(0, 0, 0, 0.2);
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
`;
