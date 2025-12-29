export const styles = `
:root {
  color-scheme: light;
  --primary: #1d4ed8;
  --primary-dark: #1e40af;
  --surface: #f8fafc;
  --surface-strong: #f1f5f9;
  --card: #ffffff;
  --border: #e2e8f0;
  --text: #0f172a;
  --muted: #64748b;
  --accent: #0f766e;
  --accent-soft: rgba(15, 118, 110, 0.12);
  --shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
  --shadow-soft: 0 10px 24px rgba(15, 23, 42, 0.08);
}
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
  color: var(--text);
  background: var(--surface);
  letter-spacing: 0.01em;
  line-height: 1.6;
}
.bg-surface {
  background: var(--surface);
}
.container {
  width: min(1120px, 92vw);
  margin: 0 auto;
}
.topbar {
  background: rgba(255, 255, 255, 0.95);
  border-bottom: 1px solid var(--border);
  padding: 1rem 0;
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.06);
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: blur(8px);
}
.topbar .container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}
.topbar .brand {
  font-weight: 700;
  color: var(--text);
  letter-spacing: 0.03em;
  text-transform: uppercase;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
.brand-mark {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--primary), #38bdf8);
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
}
.topnav a {
  margin-left: 1rem;
  color: var(--primary-dark);
  text-decoration: none;
  font-weight: 500;
  padding: 0.4rem 0.6rem;
  border-radius: 999px;
  transition: background 0.2s ease, color 0.2s ease;
}
.topnav a:hover,
.topnav a:focus {
  background: var(--accent-soft);
  color: var(--primary);
}
.page {
  padding: 2.5rem 0 4rem;
  display: grid;
  gap: 2rem;
}
.page-header {
  display: grid;
  gap: 0.4rem;
}
.page-header h1,
.page-header h2 {
  margin: 0;
  font-size: clamp(1.8rem, 2vw + 1rem, 2.6rem);
}
.page-subtitle {
  margin: 0;
  color: var(--muted);
  max-width: 640px;
}
.hero {
  background: var(--card);
  border-radius: 24px;
  padding: 2.5rem;
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
}
.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.5rem;
}
.card {
  background: var(--card);
  border-radius: 18px;
  padding: 1.5rem;
  box-shadow: var(--shadow-soft);
  border: 1px solid var(--border);
}
.card.compact {
  padding: 1.25rem;
}
.card h3 {
  margin-top: 0;
}
.grid {
  display: grid;
  gap: 1rem;
}
@media (min-width: 720px) {
  .grid.two {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .grid.three {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
.list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.list-item {
  display: grid;
  gap: 0.25rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--border);
}
.list-item:last-child {
  border-bottom: none;
}
.list-item .meta {
  color: var(--muted);
  font-size: 0.9rem;
}
.list-item .actions {
  margin-top: 0.5rem;
}
.stack {
  display: grid;
  gap: 0.75rem;
}
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.65rem 1.2rem;
  border-radius: 999px;
  border: none;
  background: var(--primary);
  color: white;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  box-shadow: 0 10px 20px rgba(29, 78, 216, 0.2);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.button.small {
  padding: 0.45rem 0.9rem;
  font-size: 0.9rem;
}
.button:hover,
.button:focus {
  transform: translateY(-1px);
  box-shadow: 0 14px 26px rgba(29, 78, 216, 0.25);
}
.button.secondary {
  background: var(--accent);
}
.button.outline {
  background: transparent;
  border: 1px solid var(--primary);
  color: var(--primary);
  box-shadow: none;
}
.form {
  display: grid;
  gap: 0.75rem;
}
input, select, textarea {
  width: 100%;
  padding: 0.6rem 0.75rem;
  border-radius: 14px;
  border: 1px solid var(--border);
  font: inherit;
  background: #fff;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(29, 78, 216, 0.15);
}
textarea {
  min-height: 120px;
}
.muted {
  color: var(--muted);
}
.footer {
  padding: 2rem 0;
  color: var(--muted);
  font-size: 0.9rem;
  border-top: 1px solid var(--border);
  background: var(--surface-strong);
}

.app-shell {
  display: grid;
  grid-template-columns: 1fr;
  min-height: 100vh;
}
.sidebar {
  background: var(--card);
  padding: 1.5rem;
  border-bottom: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1.5rem;
}
.sidebar .brand {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--primary);
}
.nav-links {
  display: grid;
  gap: 0.75rem;
}
.nav-links a {
  text-decoration: none;
  font-weight: 500;
  color: var(--text);
  padding: 0.5rem 0.75rem;
  border-radius: 12px;
  transition: background 0.2s ease, color 0.2s ease;
}
.nav-links a:hover,
.nav-links a:focus {
  background: var(--accent-soft);
  color: var(--primary-dark);
}
.sidebar-footer {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.content {
  padding: 1.5rem;
  background: var(--surface);
}
.content-header h1 {
  margin-top: 0;
  font-size: 1.8rem;
  letter-spacing: 0.01em;
}
.content-body {
  display: grid;
  gap: 1.5rem;
}

@media (min-width: 960px) {
  .app-shell {
    grid-template-columns: 260px 1fr;
  }
  .sidebar {
    border-bottom: none;
    border-right: 1px solid var(--border);
    min-height: 100vh;
  }
  .content {
    padding: 2.75rem;
  }
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
  background: var(--card);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--border);
}
.table th,
.table td {
  text-align: left;
  padding: 0.75rem;
  border-bottom: 1px solid var(--border);
}
.table th {
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-size: 0.75rem;
  color: var(--muted);
}
.badge {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  background: #e2e8f0;
  font-size: 0.75rem;
}
.alert {
  padding: 0.75rem 1rem;
  background: #fef3c7;
  border: 1px solid #fde68a;
  border-radius: 12px;
  color: #92400e;
}
`;
