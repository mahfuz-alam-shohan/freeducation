export const styles = `
:root {
  color-scheme: light;
  --primary: #1f4b99;
  --primary-dark: #163571;
  --surface: #f6f7fb;
  --card: #ffffff;
  --border: #e1e4ee;
  --text: #0f172a;
  --muted: #64748b;
  --accent: #0f766e;
}
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  color: var(--text);
  background: var(--surface);
}
.bg-surface {
  background: var(--surface);
}
.container {
  width: min(960px, 92vw);
  margin: 0 auto;
}
.topbar {
  background: var(--card);
  border-bottom: 1px solid var(--border);
  padding: 0.75rem 0;
}
.topbar .brand {
  font-weight: 700;
  color: var(--primary);
}
.topnav a {
  margin-left: 1rem;
  color: var(--primary-dark);
  text-decoration: none;
  font-weight: 500;
}
.page {
  padding: 2rem 0 3rem;
}
.card {
  background: var(--card);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
  border: 1px solid var(--border);
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
.list li {
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--border);
}
.list li:last-child {
  border-bottom: none;
}
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.6rem 1rem;
  border-radius: 999px;
  border: none;
  background: var(--primary);
  color: white;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
}
.button.secondary {
  background: var(--accent);
}
.button.outline {
  background: transparent;
  border: 1px solid var(--primary);
  color: var(--primary);
}
.form {
  display: grid;
  gap: 0.75rem;
}
input, select, textarea {
  width: 100%;
  padding: 0.6rem 0.75rem;
  border-radius: 12px;
  border: 1px solid var(--border);
  font: inherit;
  background: #fff;
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
}
.sidebar-footer {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.content {
  padding: 1.5rem;
}
.content-header h1 {
  margin-top: 0;
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
    padding: 2.5rem;
  }
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}
.table th,
.table td {
  text-align: left;
  padding: 0.75rem;
  border-bottom: 1px solid var(--border);
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
