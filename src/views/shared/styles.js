const baseStyles = `
  :root {
    color-scheme: light;
    --bg: #f7f4ee;
    --panel: #ffffff;
    --border: #ded8cc;
    --border-strong: #c8c0b2;
    --text: #1f1c17;
    --muted: #6f675c;
    --primary: #2f4a6d;
    --primary-soft: #eef1f4;
    --accent: #8a4b2f;
    --accent-soft: #f7efe7;
    --sunrise: #f5e8c7;
    --mint: #e6f1e8;
    --coral: #f7d7c9;
    --sky: #e4edf6;
    --site-name-font: "Playfair Display";
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

  a:hover {
    color: var(--primary);
  }

  h1,
  h2,
  h3,
  h4 {
    letter-spacing: -0.01em;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .page-title {
    font-size: 22px;
    margin: 0 0 6px;
  }

  .page-subtitle {
    margin: 0;
    font-size: 13px;
    color: var(--muted);
    line-height: 1.45;
  }

  .eyebrow {
    text-transform: uppercase;
    letter-spacing: 0.12em;
    font-size: 11px;
    color: var(--muted);
    margin-bottom: 6px;
  }

  .page-actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .form-grid {
    display: grid;
    gap: 10px;
  }

  label {
    font-size: 12px;
    color: var(--muted);
  }

  input,
  select,
  textarea {
    width: 100%;
    padding: 7px 9px;
    border: 1px solid var(--border);
    border-radius: 6px;
    font-size: 14px;
    background: #fff;
    color: var(--text);
  }

  textarea {
    min-height: 90px;
    resize: vertical;
  }

  input:focus,
  select:focus,
  textarea:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(47, 74, 109, 0.2);
  }

  button {
    border: 1px solid var(--text);
    background: var(--text);
    color: #fff;
    padding: 7px 12px;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 160ms ease, background 160ms ease;
  }

  button:hover {
    transform: translateY(-1px);
  }

  .secondary {
    background: #fff;
    color: var(--text);
  }

  .message {
    padding: 6px 8px;
    border-radius: 6px;
    background: var(--primary-soft);
    color: var(--primary);
    font-size: 12px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .panel {
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 10px;
    display: grid;
    gap: 8px;
  }

  .panel.compact {
    gap: 6px;
    padding: 8px;
  }

  .panel-grid {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }

  .tile-grid {
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  .tile {
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 8px;
    background: #fff;
    display: grid;
    gap: 6px;
  }

  .section-title {
    font-size: 15px;
    margin: 0;
  }

  .small {
    font-size: 12px;
    color: var(--muted);
    margin: 0;
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
    font-size: 15px;
    letter-spacing: 0.02em;
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
    flex-wrap: wrap;
  }

  .button-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 7px 12px;
    border-radius: 6px;
    font-weight: 600;
    border: 1px solid var(--text);
    background: var(--text);
    color: #fff;
    font-size: 13px;
    line-height: 1;
    white-space: nowrap;
  }

  .button-link.secondary {
    background: #fff;
    color: var(--text);
  }

  .filters-bar {
    display: flex;
    gap: 10px;
    align-items: flex-end;
    flex-wrap: wrap;
    margin-top: 6px;
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
    overflow-x: auto;
  }

  .data-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }

  .data-table th,
  .data-table td {
    text-align: left;
    padding: 7px 6px;
    border-bottom: 1px solid var(--border);
    vertical-align: top;
    word-break: break-word;
  }

  .data-table thead th {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--muted);
  }

  .data-table tbody tr:hover {
    background: var(--primary-soft);
  }

  .list {
    margin: 0;
    padding-left: 18px;
    display: grid;
    gap: 6px;
    color: var(--muted);
    font-size: 12px;
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

  .note {
    border-left: 3px solid var(--text);
    padding-left: 10px;
    color: var(--muted);
    font-size: 12px;
    line-height: 1.5;
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
    border-radius: 8px;
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
    color: var(--text);
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
    border-radius: 8px;
    padding: 8px;
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
    height: 18px;
    border-radius: 6px;
    border: 1px solid rgba(0, 0, 0, 0.08);
  }

  .theme-preview {
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 10px;
    background: var(--bg);
    display: grid;
    gap: 8px;
    overflow: hidden;
  }

  .theme-preview-card {
    border: 1px solid var(--border);
    border-radius: 8px;
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
    border: 1px solid var(--text);
    padding: 6px 10px;
    border-radius: 6px;
    background: var(--text);
    color: #fff;
    font-size: 12px;
    font-weight: 600;
    width: fit-content;
  }

  .identity-preview {
    border: 1px solid var(--border);
    border-radius: 8px;
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
    border-radius: 8px;
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
    border-radius: 8px;
  }

  .logo-style-grid {
    display: grid;
    gap: 8px;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  }

  .logo-style-option {
    border: 1px solid var(--border);
    border-radius: 8px;
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

  @media (prefers-reduced-motion: reduce) {
    body {
      transition: none;
      transform: none;
    }

    button {
      transition: none;
    }
  }
`;

export { baseStyles };
