import { themeStyles } from "../styles/theme";

export const baseStyles = `
  ${themeStyles}
  * { box-sizing: border-box; }
  html, body { height: 100%; }
  body { margin: 0; overflow: hidden; }
  a { color: var(--color-link); text-decoration: none; }
  a:hover { color: var(--color-link-hover); }
  hr { border: none; border-top: 1px solid var(--color-border); margin: 12px 0; }
  h1, h2, h3, h4 { font-family: var(--font-display); }
  .icon { width: 18px; height: 18px; display: inline-block; }
  .button-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 6px 10px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--color-border);
    background: var(--color-surface);
    color: var(--color-text);
    text-decoration: none;
    transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
  }
  .button-link:hover {
    background: var(--color-surface-muted);
    border-color: var(--color-border-strong);
    transform: translateY(-1px);
    box-shadow: var(--shadow-sm);
  }
  .button-link:active { background: var(--color-surface-elevated); transform: translateY(0); }
  .button-link--primary {
    background: linear-gradient(135deg, var(--color-accent), var(--color-accent-strong));
    color: #fff;
    border-color: transparent;
    box-shadow: var(--shadow-sm);
  }
  .button-link--primary:hover {
    filter: brightness(1.05);
  }
  .button-link--danger {
    background: var(--color-danger-bg);
    color: var(--color-danger);
    border-color: var(--color-border-strong);
  }
  .button-link--danger:hover {
    filter: brightness(1.02);
  }
  .page { max-width: 720px; margin: 0 auto; display: grid; gap: 12px; animation: page-enter 0.35s ease; }
  .page-header { display: grid; gap: 6px; text-align: center; align-items: center; }
  .page-title { margin: 0; font-size: 28px; letter-spacing: 0.3px; font-weight: 600; }
  .page-subtitle { margin: 0; color: var(--color-text-muted); }
  .app-main { transition: opacity 0.2s ease, transform 0.2s ease; }
  body.is-transitioning .app-main { opacity: 0.7; transform: translateY(4px); }
  .app-main__breadcrumb {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 16px;
    border-bottom: 1px solid var(--color-border);
    background: var(--color-surface);
    color: var(--color-text-muted);
    font-size: 13px;
    overflow-x: auto;
    white-space: nowrap;
    scrollbar-width: thin;
    -webkit-overflow-scrolling: touch;
  }
  .app-main__breadcrumb:empty { display: none; }
  .breadcrumb {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .breadcrumb a { color: var(--color-text-muted); }
  .breadcrumb a:hover { color: var(--color-text); }
  .breadcrumb__current { color: var(--color-text); font-weight: 600; }
  .breadcrumb__separator { color: var(--color-text-muted); }
  .page-section { display: grid; gap: 10px; animation: fade-in 0.3s ease; }
  .page-actions { display: flex; justify-content: center; flex-wrap: wrap; gap: 8px; }
  .section-title { margin: 0; font-size: 20px; text-align: center; font-weight: 600; }
  .card-grid { display: grid; gap: 10px; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); }
  .card-link {
    display: grid;
    gap: 4px;
    padding: 10px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--color-border);
    background: var(--color-surface);
    color: var(--color-text);
    text-decoration: none;
    box-shadow: var(--shadow-sm);
    transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
  }
  .card-link:hover {
    background: var(--color-surface-muted);
    border-color: var(--color-border-strong);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }
  .card-link:active { background: var(--color-surface-elevated); transform: translateY(0); }
  .card-link__title {
    font-size: 14px;
    font-weight: 600;
    line-height: 1.4;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .card-link__description {
    font-size: 12px;
    color: var(--color-text-muted);
    line-height: 1.3;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .card-link__meta {
    font-size: 11px;
    color: var(--color-text-muted);
    margin: 0;
  }
  .form-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: 16px;
    box-shadow: var(--shadow-sm);
  }
  .form-grid { display: grid; gap: 12px; }
  .form-field {
    display: grid;
    gap: 6px;
    font-size: 13px;
    color: var(--color-text);
  }
  .form {
    display: grid;
    gap: 12px;
    max-width: 400px;
    margin: 0 auto;
    animation: fade-in 0.3s ease;
  }
  .form-group {
    display: grid;
    gap: 4px;
  }
  .form-label {
    font-size: 13px;
    font-weight: 600;
    color: var(--color-text);
  }
  .form-input {
    padding: 8px 10px;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    background: var(--color-surface);
    color: var(--color-text);
    font-size: 14px;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }
  .form-input:focus {
    outline: none;
    border-color: var(--color-accent);
    box-shadow: 0 0 0 3px rgba(31, 126, 165, 0.18);
  }
  .form-input::placeholder { color: var(--color-text-muted); }
  .form-error {
    font-size: 12px;
    color: var(--color-danger);
    margin: 0;
  }
  .form-success {
    font-size: 12px;
    color: var(--color-success);
    margin: 0;
  }
  .form-actions {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 8px;
  }
  .helper-text { font-size: 13px; color: var(--color-text-muted); margin: 0; }
  .alert {
    padding: 8px 10px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--color-border);
    background: var(--color-surface-elevated);
    color: var(--color-text);
    font-size: 13px;
  }
  .alert--error {
    background: var(--color-danger-bg);
    color: var(--color-danger);
    border-color: var(--color-border-strong);
  }
  .table-responsive {
    overflow-x: auto;
    border-radius: var(--radius-sm);
    border: 1px solid var(--color-border);
    background: var(--color-surface);
  }
  .data-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }
  .data-table th {
    text-align: left;
    padding: 8px 12px;
    border-bottom: 1px solid var(--color-border);
    background: var(--color-surface-elevated);
    font-weight: 600;
    color: var(--color-text);
  }
  .data-table td {
    padding: 8px 12px;
    border-bottom: 1px solid var(--color-border);
    color: var(--color-text);
  }
  .data-table tr:last-child td { border-bottom: none; }
  .data-table a { color: var(--color-link); }
  .data-table a:hover { color: var(--color-link-hover); }
  .app-sidebar { display: flex; flex-direction: column; gap: 12px; }
  .sidebar-footer {
    margin-top: auto;
    padding-top: 12px;
    border-top: 1px solid var(--color-border);
  }
  .theme-toggle {
    width: 100%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 8px 10px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--color-border);
    background: var(--color-surface);
    color: var(--color-text);
    cursor: pointer;
    transition: background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
  }
  .theme-toggle:hover {
    background: var(--color-surface-muted);
    border-color: var(--color-border-strong);
    transform: translateY(-1px);
  }
  .theme-toggle__icon { display: inline-flex; align-items: center; }
  .theme-toggle__icon--moon { display: none; }
  .theme-toggle__label { font-size: 13px; font-weight: 600; }
  :root[data-theme="dark"] .theme-toggle__icon--sun { display: none; }
  :root[data-theme="dark"] .theme-toggle__icon--moon { display: inline-flex; }
  .sidebar-toggle {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }
  .sidebar-toggle__label {
    display: none;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: var(--radius-sm);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    color: var(--color-text);
    cursor: pointer;
    transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
  }
  .sidebar-toggle__label:hover {
    background: var(--color-surface-muted);
    border-color: var(--color-border-strong);
  }
  .sidebar-toggle:checked ~ .app-shell .app-sidebar {
    transform: translateX(-100%);
  }
  .sidebar-toggle:checked ~ .app-shell .app-main {
    margin-left: 0;
  }
  .sidebar-toggle:checked ~ .app-shell .sidebar-toggle__label {
    left: 8px;
  }
  .loader {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--color-overlay);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s ease, visibility 0.2s ease;
  }
  .loader.active {
    opacity: 1;
    visibility: visible;
  }
  .loader__spinner {
    width: 32px;
    height: 32px;
    border: 3px solid var(--color-border);
    border-top-color: var(--color-accent);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  @keyframes page-enter {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @media (max-width: 768px) {
    .sidebar-toggle__label { display: flex; }
    .page { padding: 8px; }
    .page-title { font-size: 24px; }
    .card-grid { grid-template-columns: 1fr; }
    .form { max-width: 100%; padding: 0 8px; }
  }
`;
