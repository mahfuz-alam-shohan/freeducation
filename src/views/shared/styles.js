const baseStyles = `
  :root {
    color-scheme: light;
    --bg: #f7f8fb;
    --bg-glow: #eef2ff;
    --panel: #ffffff;
    --border: #d7dbe5;
    --text: #182230;
    --muted: #5f6c7b;
    --primary: #2155cd;
    --primary-soft: #e8efff;
    --accent: #7c3aed;
    --accent-soft: #f1eafe;
    --accent-strong: #1d4ed8;
  }

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: "Inter", system-ui, -apple-system, sans-serif;
    color: var(--text);
    background: linear-gradient(180deg, var(--bg-glow) 0%, var(--bg) 35%, var(--bg) 100%);
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
    transition: transform 160ms ease, box-shadow 160ms ease;
  }

  button:hover {
    box-shadow: 0 8px 16px rgba(33, 85, 205, 0.2);
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
    padding: 12px;
    margin-bottom: 12px;
    box-shadow: 0 8px 20px rgba(15, 23, 42, 0.05);
    border-left: 3px solid var(--accent);
    transition: transform 160ms ease, box-shadow 160ms ease;
  }

  .card:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 26px rgba(15, 23, 42, 0.08);
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

    .card,
    button {
      transition: none;
    }
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
