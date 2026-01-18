const baseStyles = `
  :root {
    color-scheme: light;
    --bg: #fff7ed;
    --panel: #ffffff;
    --border: #f1d5b8;
    --border-strong: #e7c39f;
    --text: #1f2933;
    --muted: #6b7280;
    --primary: #f97316;
    --primary-soft: #fff1e6;
    --accent: #2563eb;
    --accent-soft: #e0f2fe;
    --accent-strong: #db2777;
    --sunrise: #fde68a;
    --mint: #d1fae5;
    --coral: #fecaca;
    --sky: #e0f2fe;
    --site-name-font: "Playfair Display";
  }

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: "Inter", system-ui, -apple-system, sans-serif;
    color: var(--text);
    background: linear-gradient(180deg, var(--bg) 0%, var(--primary-soft) 100%);
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
    background: var(--primary-soft);
  }

  select {
    width: 100%;
    padding: 8px 10px;
    border: 1px solid var(--border);
    border-radius: 8px;
    font-size: 14px;
    background: var(--primary-soft);
  }

  input:focus,
  select:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.2);
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
    background: linear-gradient(180deg, var(--panel) 0%, var(--primary-soft) 100%);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 10px;
    margin-bottom: 12px;
    border-left: 3px solid var(--primary);
    box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);
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
    overflow: hidden;
  }

  .site-logo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .site-name {
    font-family: var(--site-name-font, "Playfair Display"), "Georgia", serif;
    font-size: 16px;
    letter-spacing: 0.03em;
    font-weight: 700;
    color: var(--text);
    word-break: break-word;
  }

  .site-brand {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
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
    background: linear-gradient(160deg, var(--panel) 0%, var(--primary-soft) 100%);
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
    background: linear-gradient(135deg, var(--panel) 0%, var(--accent-soft) 100%);
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
    background: var(--primary-soft);
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

  .settings-list {
    display: grid;
    gap: 10px;
  }

  .settings-item {
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 10px;
    background: var(--panel);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    color: inherit;
    text-decoration: none;
    transition: border-color 160ms ease, background 160ms ease;
  }

  .settings-item:hover {
    background: var(--primary-soft);
    border-color: var(--border-strong);
  }

  .settings-action {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 600;
    color: var(--primary);
  }

  .settings-chevron {
    font-size: 16px;
    line-height: 1;
  }

  .settings-meta {
    display: grid;
    gap: 4px;
  }

  .settings-meta h4 {
    margin: 0;
    font-size: 14px;
  }

  .settings-meta p {
    margin: 0;
    font-size: 12px;
    color: var(--muted);
  }

  .theme-grid {
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }

  .theme-option {
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 10px;
    background: #fff;
    display: grid;
    gap: 8px;
  }

  .theme-option label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 600;
    color: var(--text);
    flex-wrap: wrap;
  }

  .theme-swatches {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 6px;
  }

  .theme-swatch {
    height: 20px;
    border-radius: 6px;
    border: 1px solid rgba(0, 0, 0, 0.06);
  }

  .theme-preview {
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 10px;
    background: var(--bg);
    display: grid;
    gap: 8px;
    overflow: hidden;
  }

  .theme-preview-card {
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 8px;
    background: var(--panel);
    display: grid;
    gap: 4px;
  }

  .theme-preview .preview-title {
    margin: 0;
    font-size: 14px;
  }

  .theme-preview .preview-text {
    margin: 0;
    font-size: 12px;
    color: var(--muted);
  }

  .theme-preview .preview-button {
    border: none;
    padding: 6px 10px;
    border-radius: 8px;
    background: var(--primary);
    color: #fff;
    font-size: 12px;
    font-weight: 600;
    width: fit-content;
  }

  .identity-preview {
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 10px;
    display: grid;
    gap: 8px;
    background: var(--panel);
    overflow: hidden;
  }

  .identity-site-name {
    font-size: 16px;
    font-weight: 700;
    color: var(--text);
  }

  .identity-row {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .logo-preview {
    width: 64px;
    height: 64px;
    border-radius: 12px;
    border: 1px dashed var(--border-strong);
    display: grid;
    place-items: center;
    font-weight: 700;
    font-size: 16px;
    background: var(--primary-soft);
    color: var(--primary);
    text-align: center;
    padding: 6px;
  }

  .logo-preview img {
    max-width: 100%;
    max-height: 100%;
    border-radius: 10px;
  }

  .logo-style-grid {
    display: grid;
    gap: 8px;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  }

  .logo-style-option {
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 8px;
    text-align: center;
    font-size: 12px;
    display: grid;
    gap: 6px;
    background: #fff;
    cursor: pointer;
  }

  .logo-style-option input {
    margin: 0 auto;
  }

  .logo-chip {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    padding: 4px 8px;
    border: 1px solid var(--border);
    font-size: 11px;
    font-weight: 600;
  }

  .logo-style-badge {
    background: var(--primary-soft);
    color: var(--primary);
  }

  .logo-style-stamp {
    background: var(--accent-soft);
    color: var(--accent);
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .logo-style-block {
    border-radius: 6px;
    background: var(--text);
    color: var(--panel);
  }

  .logo-style-script {
    background: var(--primary-soft);
    color: var(--text);
    font-family: "Playfair Display", "Georgia", serif;
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

    .settings-item {
      align-items: flex-start;
      flex-direction: column;
    }

    .theme-grid {
      grid-template-columns: 1fr;
    }

    .logo-style-grid {
      grid-template-columns: 1fr 1fr;
    }
  }
`;

export { baseStyles };
