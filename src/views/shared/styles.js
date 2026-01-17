const baseStyles = `
  :root {
    color-scheme: light;
    --bg: #f4f5f8;
    --panel: #ffffff;
    --border: #d7dbe5;
    --border-strong: #c1c7d6;
    --text: #182230;
    --muted: #5f6c7b;
    --primary: #2155cd;
    --primary-soft: #e8efff;
    --accent: #7c3aed;
    --accent-soft: #f1eafe;
    --accent-strong: #1d4ed8;
    --sunrise: #fef3c7;
    --mint: #e1f3ed;
    --coral: #fee2e2;
  }

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: "Inter", system-ui, -apple-system, sans-serif;
    color: var(--text);
    background: var(--bg);
    opacity: 0;
    transform: translateY(4px);
    transition: opacity 220ms ease, transform 220ms ease;
  }

  body.page-ready {
    opacity: 1;
    transform: translateY(0);
  }

  body.page-leave {
    opacity: 0;
    transform: translateY(-4px);
  }

  a {
    color: inherit;
    text-decoration: none;
    transition: color 160ms ease;
  }

  h1,
  h2,
  h3 {
    letter-spacing: -0.01em;
  }

  .form-grid {
    display: grid;
    gap: 10px;
  }

  label {
    font-size: 12px;
    color: var(--muted);
  }

  input {
    width: 100%;
    padding: 8px 10px;
    border: 1px solid var(--border);
    border-radius: 8px;
    font-size: 14px;
    background: #fff;
  }

  select {
    width: 100%;
    padding: 8px 10px;
    border: 1px solid var(--border);
    border-radius: 8px;
    font-size: 14px;
    background: #fff;
  }

  button {
    border: none;
    background: linear-gradient(135deg, var(--primary) 0%, var(--accent-strong) 100%);
    color: #fff;
    padding: 8px 12px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 160ms ease;
  }

  button:hover {
    transform: translateY(-1px);
  }

  .secondary {
    background: #fff;
    color: var(--primary);
    border: 1px solid var(--primary);
  }

  .message {
    padding: 8px 10px;
    border-radius: 8px;
    background: var(--accent-soft);
    color: var(--primary);
    font-size: 12px;
    display: inline-block;
  }

  .card {
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 10px;
    margin-bottom: 12px;
    border-left: 3px solid var(--accent);
    box-shadow: 0 6px 18px rgba(15, 23, 42, 0.06);
  }

  .section-title {
    font-size: 15px;
    margin: 0 0 6px;
  }

  .small {
    font-size: 12px;
    color: var(--muted);
  }

  .site-logo,
  .user-avatar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: var(--primary-soft);
    color: var(--primary);
    font-weight: 700;
    font-size: 12px;
    flex-shrink: 0;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: flex-start;
    margin-bottom: 10px;
    flex-wrap: wrap;
  }

  .button-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 8px 12px;
    border-radius: 8px;
    font-weight: 600;
    border: 1px solid var(--primary);
    background: linear-gradient(135deg, var(--primary) 0%, var(--accent-strong) 100%);
    color: #fff;
    font-size: 13px;
    line-height: 1;
    white-space: nowrap;
  }

  .button-link.secondary {
    background: #fff;
    color: var(--primary);
  }

  .filters-bar {
    display: flex;
    gap: 10px;
    align-items: flex-end;
    flex-wrap: wrap;
    margin-bottom: 10px;
  }

  .filters-bar .field {
    display: grid;
    gap: 6px;
    min-width: 150px;
  }

  .filters-bar .field.grow {
    flex: 1;
    min-width: 220px;
  }

  .table-wrap {
    width: 100%;
  }

  .data-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }

  .data-table th,
  .data-table td {
    text-align: left;
    padding: 8px 6px;
    border-bottom: 1px solid var(--border);
    vertical-align: top;
    word-break: break-word;
  }

  .data-table thead th {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--muted);
  }

  .data-table tbody tr:hover {
    background: rgba(124, 58, 237, 0.06);
  }

  @media (prefers-reduced-motion: reduce) {
    body {
      transition: none;
      transform: none;
    }

    button {
      transition: none;
    }
  }

  .frontpage-layout {
    display: grid;
    gap: 14px;
  }

  .frontpage-hero {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 12px;
    box-shadow: 0 10px 30px rgba(24, 34, 48, 0.05);
  }

  .frontpage-intro {
    display: grid;
    gap: 8px;
  }

  .frontpage-eyebrow {
    text-transform: uppercase;
    letter-spacing: 0.14em;
    font-size: 11px;
    color: var(--muted);
  }

  .frontpage-title {
    font-size: 22px;
    margin: 0;
  }

  .frontpage-subtitle {
    font-size: 13px;
    margin: 0;
    color: var(--muted);
    line-height: 1.4;
  }

  .frontpage-actions {
    display: flex;
    gap: 8px;
    align-items: center;
    flex-wrap: wrap;
  }

  .frontpage-panels {
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  .frontpage-panel {
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 10px;
    background: var(--panel);
    display: grid;
    gap: 6px;
    box-shadow: 0 6px 16px rgba(15, 23, 42, 0.05);
  }

  .frontpage-panel-title {
    font-size: 14px;
    font-weight: 600;
  }

  .quote-cover {
    border: 1px solid var(--border);
    border-radius: 12px;
    background: #f6f4ff;
    padding: 10px;
    min-height: 180px;
    display: grid;
    align-content: center;
  }

  .quote-rotator {
    display: grid;
    gap: 8px;
  }

  .quote-text {
    font-size: 16px;
    line-height: 1.5;
    font-weight: 600;
  }

  .quote-author {
    font-size: 12px;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }

  .frontpage-strip {
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 10px;
    background: var(--panel);
    display: flex;
    flex-wrap: wrap;
    gap: 8px 14px;
    font-size: 12px;
    color: var(--muted);
  }

  .info-grid {
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  .info-card {
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 10px;
    background: var(--panel);
    display: grid;
    gap: 6px;
  }

  .info-card strong {
    font-size: 13px;
  }

  .info-card .small {
    margin: 0;
  }

  .accent-band {
    border-radius: 12px;
    padding: 10px;
    border: 1px solid var(--border);
    display: grid;
    gap: 8px;
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  }

  .chip-group {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .chip {
    padding: 4px 8px;
    border-radius: 999px;
    border: 1px solid var(--border);
    font-size: 11px;
    color: var(--muted);
    background: #fff;
  }

  .timeline {
    display: grid;
    gap: 6px;
    margin: 0;
    padding-left: 16px;
  }

  .timeline li {
    font-size: 12px;
    color: var(--muted);
  }

  .highlight-surface {
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 10px;
    background: var(--mint);
    display: grid;
    gap: 6px;
  }

  .frontpage-strip strong {
    color: var(--text);
  }

  .form-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  @media (max-width: 600px) {
    .filters-bar {
      align-items: stretch;
    }

    .filters-bar button {
      width: 100%;
    }

    .section-header {
      align-items: flex-start;
    }

    .button-link {
      width: 100%;
    }
  }
`;

export { baseStyles };
