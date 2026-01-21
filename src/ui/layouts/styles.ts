import { themeStyles } from "../styles/theme";

export const baseStyles = `
  ${themeStyles}
  
  /* Critical performance optimizations */
  * { 
    box-sizing: border-box; 
    will-change: auto; /* Optimize animations */
  }
  
  html, body { 
    height: 100%; 
    scroll-behavior: smooth;
  }
  
  body { 
    margin: 0; 
    overflow: hidden;
    font-display: swap; /* Faster font loading */
    text-rendering: optimizeSpeed; /* Faster text rendering */
    contain: layout style paint; /* Performance optimization */
  }
  
  a { 
    color: var(--color-link); 
    text-decoration: none; 
    transition: color 0.2s ease; /* Hardware accelerated */
  }
  
  a:hover { 
    color: var(--color-link-hover); 
  }
  
  hr { 
    border: none; 
    border-top: 1px solid var(--color-border); 
    margin: 12px 0; 
  }
  
  h1, h2, h3, h4 { 
    font-family: var(--font-display);
    font-display: swap; /* Faster heading rendering */
  }
  
  .icon { 
    width: 18px; 
    height: 18px; 
    display: inline-block; 
    transform: translateZ(0); /* Hardware acceleration */
  }
  .button-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 6px 10px;
    border-radius: 4px;
    border: 1px solid var(--color-border);
    background: transparent;
    color: var(--color-text);
    text-decoration: none;
    transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
  }
  .button-link:hover {
    background: var(--color-surface-muted);
    border-color: var(--color-border-strong);
  }
  .button-link:active { background: var(--color-surface-elevated); }
  .button-link--primary {
    background: var(--color-accent);
    color: #fff;
    border-color: var(--color-accent);
  }
  .button-link--primary:hover {
    background: var(--color-accent-strong);
    border-color: var(--color-accent-strong);
  }
  .button-link--danger {
    background: var(--color-danger);
    color: #fff;
    border-color: var(--color-danger);
  }
  .button-link--danger:hover {
    background: var(--color-danger-bg);
    color: var(--color-danger);
    border-color: var(--color-border-strong);
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
    border-radius: 4px;
    border: 1px solid var(--color-border);
    background: transparent;
    color: var(--color-text);
    text-decoration: none;
    transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
  }
  .card-link:hover {
    background: var(--color-surface-muted);
    border-color: var(--color-border-strong);
  }
  .card-link:active { background: var(--color-surface-elevated); }
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
    background: transparent;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    padding: 16px;
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
    border-radius: 4px;
    border: 1px solid var(--color-border);
    background: var(--color-surface-elevated);
    color: var(--color-text);
    font-size: 13px;
  }
  .alert--error {
    background: var(--color-danger-bg);
    color: var(--color-danger);
    border-color: var(--color-danger);
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
  .user-management-toolbar {
    display: flex;
    flex-direction: column;
    gap: 12px;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    padding: 16px;
    background: transparent;
  }
  .filter-form {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .filter-fields {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 12px;
  }
  .filter-actions {
    display: flex;
    justify-content: flex-start;
    gap: 8px;
    flex-wrap: wrap;
  }
  .toolbar-actions {
    display: flex;
    justify-content: flex-end;
    padding-top: 8px;
    border-top: 1px solid var(--color-border);
  }
  .table-scroll {
    overflow-x: auto;
    border-radius: 4px;
    border: 1px solid var(--color-border);
    background: transparent;
  }
  .filter-field {
    display: grid;
    gap: 6px;
    font-size: 13px;
    color: var(--color-text);
  }
  .filter-field span {
    font-weight: 600;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--color-text-muted);
  }
  .filter-field select,
  .filter-field input {
    padding: 8px 12px;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    background: var(--color-surface);
    color: var(--color-text);
    font-size: 14px;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }
  .filter-field select:focus,
  .filter-field input:focus {
    outline: none;
    border-color: var(--color-accent);
    box-shadow: 0 0 0 3px rgba(31, 126, 165, 0.18);
  }
  .filter-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    flex-wrap: wrap;
  }
  .confirm-delete {
    position: relative;
    display: inline-block;
  }
  .confirm-delete__toggle {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }
  .confirm-delete__modal {
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
    transition: opacity 0.3s ease, visibility 0.3s ease;
  }
  .confirm-delete__toggle:checked ~ .confirm-delete__modal {
    opacity: 1;
    visibility: visible;
  }
  .confirm-delete__panel {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 4px;
    padding: 20px;
    max-width: 400px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    transform: scale(0.9);
    transition: transform 0.3s ease;
  }
  .confirm-delete__toggle:checked ~ .confirm-delete__modal .confirm-delete__panel {
    transform: scale(1);
  }
  .confirm-delete__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
  .confirm-delete__title {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: var(--color-text);
  }
  .confirm-delete__close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 4px;
    background: var(--color-surface-muted);
    color: var(--color-text-muted);
    cursor: pointer;
    font-size: 18px;
    font-weight: 600;
    transition: background-color 0.2s ease, color 0.2s ease;
  }
  .confirm-delete__close:hover {
    background: var(--color-surface-elevated);
    color: var(--color-text);
  }
  .confirm-delete__form {
    display: grid;
    gap: 16px;
  }
  .confirm-delete__field {
    display: grid;
    gap: 6px;
  }
  .confirm-delete__field span {
    font-size: 13px;
    font-weight: 600;
    color: var(--color-text);
  }
  .confirm-delete__field input {
    padding: 10px 12px;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    background: var(--color-surface);
    color: var(--color-text);
    font-size: 14px;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }
  .confirm-delete__field input:focus {
    outline: none;
    border-color: var(--color-accent);
    box-shadow: 0 0 0 3px rgba(31, 126, 165, 0.18);
  }
  .confirm-delete__actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    flex-wrap: wrap;
  }
  .data-table tr {
    transition: background-color 0.2s ease;
  }
  .data-table tbody tr:hover {
    background: var(--color-surface-muted);
    cursor: pointer;
  }
  .data-table tbody tr:hover td {
    color: var(--color-link);
  }
  .table-row-link {
    display: block;
    color: inherit;
    text-decoration: none;
    padding: 8px 12px;
    border: none;
    background: none;
    width: 100%;
    height: 100%;
    text-align: left;
    font: inherit;
  }
  .table-row-link:hover {
    color: var(--color-link);
  }
  .data-table td {
    max-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0;
    border-bottom: 1px solid var(--color-border);
    color: var(--color-text);
    position: relative;
  }
  .data-table td > * {
    padding: 8px 12px;
    display: block;
  }
  .data-table td:nth-child(1) { /* Role */
    max-width: 80px;
    text-align: center;
    font-weight: 600;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .data-table td:nth-child(2) { /* Name */
    max-width: 150px;
    font-weight: 500;
  }
  .data-table td:nth-child(3) { /* Email */
    max-width: 200px;
    font-family: monospace;
    font-size: 12px;
  }
  .data-table td:nth-child(4) { /* Created */
    max-width: 100px;
    font-size: 12px;
    color: var(--color-text-muted);
  }
  .data-table td:nth-child(5) { /* Actions */
    max-width: 80px;
    text-align: center;
  }
  .data-table td.table-actions {
    text-align: center;
    max-width: 120px;
  }
  .table-meta {
    font-size: 11px;
    color: var(--color-text-muted);
    font-weight: 400;
  }
  .table-link {
    color: var(--color-link);
    text-decoration: none;
    font-weight: 500;
  }
  .table-link:hover {
    color: var(--color-link-hover);
    text-decoration: underline;
  }
  
  /* Glassy Profile Dropdown */
  .profile-menu {
    position: relative;
    z-index: 50;
  }
  
  .profile-menu summary {
    list-style: none;
    cursor: pointer;
  }
  
  .profile-menu summary::-webkit-details-marker {
    display: none;
  }
  
  .dropdown {
    position: absolute;
    right: 0;
    top: 40px;
    min-width: 220px;
    padding: 12px;
    background: rgba(255, 255, 255, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: var(--radius-md);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(20px);
    z-index: 60;
    animation: dropdown-fade 0.3s ease;
  }
  
  :root[data-theme="dark"] .dropdown {
    background: rgba(0, 0, 0, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
  }
  
  .dropdown p {
    margin: 0 0 8px 0;
    color: var(--color-text);
  }
  
  .dropdown p strong {
    color: var(--color-text);
  }
  
  .dropdown hr {
    border: none;
    border-top: 1px solid var(--color-border);
    margin: 8px 0;
  }
  
  .dropdown .button-link {
    display: block;
    width: 100%;
    padding: 8px 12px;
    margin: 4px 0 0 0;
    border-radius: var(--radius-sm);
    background: var(--color-surface);
    color: var(--color-text);
    text-decoration: none;
    text-align: center;
    border: 1px solid var(--color-border);
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }
  
  .dropdown .button-link:hover {
    background: var(--color-surface-muted);
    border-color: var(--color-border-strong);
    transform: translateY(-1px) scale(1.02);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .dropdown .button-link--primary {
    background: var(--color-accent);
    color: #fff;
    border-color: var(--color-accent);
  }
  
  .dropdown .button-link--primary:hover {
    background: var(--color-accent-hover);
    transform: translateY(-1px) scale(1.02);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
  
  .profile-notifications {
    display: none;
  }
  
  @keyframes dropdown-fade {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
