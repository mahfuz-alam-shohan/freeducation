export const baseStyles = `
:root {
  color-scheme: light;
  --primary: #2563eb;
  --primary-dark: #1e40af;
  --primary-soft: #eff6ff;
  --accent: #f59e0b;
  --text: #1f2937;
  --text-light: #6b7280;
  --border: #e5e7eb;
  --background: #f3f4f6;
  --card: #ffffff;
  --success: #10b981;
  --danger: #ef4444;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  font-family: "Inter", "Segoe UI", system-ui, -apple-system, sans-serif;
  background: var(--background);
  color: var(--text);
  line-height: 1.5;
  min-height: 100vh;
}

a { color: inherit; text-decoration: none; }

/* --- Layout --- */
header {
  padding: 1rem 1.25rem;
  background: var(--card);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 10;
}

main {
  padding: 2rem 1.25rem;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
}

/* --- Typography & Elements --- */
h1, h2, h3, h4 { margin: 0; font-weight: 700; color: #111827; }
h1 { font-size: 2.25rem; line-height: 2.5rem; }
h2 { font-size: 1.5rem; }
h3 { font-size: 1.25rem; }

p { margin: 0 0 1rem; color: var(--text-light); }

.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  background: var(--primary-soft);
  color: var(--primary-dark);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.025em;
}

/* --- Auth / Login Layout --- */
.auth-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
}

.auth-card {
  width: 100%;
  max-width: 420px;
  background: var(--card);
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255,255,255,0.5);
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-logo {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  display: block;
}

.auth-title {
  font-size: 1.5rem;
  color: var(--text);
  margin-bottom: 0.5rem;
}

.auth-subtitle {
  font-size: 0.875rem;
  color: var(--text-light);
}

/* --- Forms --- */
form {
  display: grid;
  gap: 1.25rem;
}

label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text);
  margin-bottom: 0.35rem;
}

input, select, textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: #fff;
  font-size: 0.95rem;
  transition: all 0.2s;
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-soft);
}

button {
  width: 100%;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  background: var(--primary);
  color: #fff;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background-color 0.2s;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

button:hover {
  background: var(--primary-dark);
}

button.secondary {
  background: #fff;
  border: 1px solid var(--border);
  color: var(--text);
}

button.secondary:hover {
  background: #f9fafb;
}

/* --- Dashboard & Components --- */
.hero {
  display: grid;
  gap: 2rem;
  margin-bottom: 3rem;
  padding: 2rem;
  background: var(--card);
  border-radius: 16px;
  border: 1px solid var(--border);
}

.card-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}

.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.5rem;
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.dashboard {
  display: grid;
  gap: 2rem;
}

.alert {
  padding: 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.alert-info { background: var(--primary-soft); color: var(--primary-dark); }
.alert-error { background: #fef2f2; color: var(--danger); border: 1px solid #fecaca; }

.table-container {
  overflow-x: auto;
  border: 1px solid var(--border);
  border-radius: 8px;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
  background: var(--card);
}

.table th {
  background: #f9fafb;
  font-weight: 600;
  text-align: left;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border);
}

.table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border);
}

.table tr:last-child td { border-bottom: none; }

@media (min-width: 900px) {
  .hero {
    grid-template-columns: 1fr 1fr;
    align-items: center;
  }
}
`;

