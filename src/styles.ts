export const baseStyles = `
:root {
  --primary: #0f172a;       /* Deep professional blue-black */
  --primary-light: #334155;
  --accent: #2563eb;        /* Brand Blue */
  --accent-hover: #1d4ed8;
  --bg-body: #f8fafc;
  --bg-card: #ffffff;
  --text-main: #0f172a;
  --text-muted: #64748b;
  --border: #e2e8f0;
  --success: #10b981;
  --danger: #ef4444;
  --radius: 6px;            /* Tighter radius for professional look */
  --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --nav-height: 60px;
}

* { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }

body {
  margin: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background: var(--bg-body);
  color: var(--text-main);
  font-size: 14px; /* Tighter base font size */
  line-height: 1.5;
}

a { color: inherit; text-decoration: none; transition: color 0.2s; }
h1, h2, h3, h4 { margin: 0; font-weight: 600; letter-spacing: -0.025em; }

/* --- Utility --- */
.container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
.flex { display: flex; align-items: center; }
.flex-col { display: flex; flex-direction: column; }
.justify-between { justify-content: space-between; }
.gap-2 { gap: 0.5rem; }
.gap-4 { gap: 1rem; }
.text-sm { font-size: 0.875rem; }
.text-xs { font-size: 0.75rem; }
.font-bold { font-weight: 600; }
.text-accent { color: var(--accent); }
.text-muted { color: var(--text-muted); }

/* --- Header (Public) --- */
.site-header {
  background: var(--bg-card);
  border-bottom: 1px solid var(--border);
  height: var(--nav-height);
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  align-items: center;
}

.logo { font-weight: 700; font-size: 1.1rem; color: var(--primary); display: flex; align-items: center; gap: 8px; }
.admin-link { padding: 8px; border-radius: var(--radius); color: var(--text-muted); }
.admin-link:hover { background: var(--bg-body); color: var(--primary); }

/* --- Admin Layout (Grid for Desktop, Stack for Mobile) --- */
.admin-layout {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - var(--nav-height));
}

/* --- Admin Navigation (Scrollable Tabs on Mobile) --- */
.admin-nav {
  background: var(--primary);
  color: #fff;
  position: sticky;
  top: 0; /* Sticky on mobile */
  z-index: 40;
  overflow-x: auto; /* Horizontal scroll */
  white-space: nowrap;
  display: flex;
  scrollbar-width: none; /* Hide scrollbar Firefox */
  border-bottom: 1px solid var(--primary-light);
}
.admin-nav::-webkit-scrollbar { display: none; }

.nav-item {
  display: inline-flex;
  align-items: center;
  padding: 1rem 1.25rem;
  color: #94a3b8;
  font-size: 0.9rem;
  font-weight: 500;
  border-bottom: 3px solid transparent;
  transition: all 0.2s;
}

.nav-item:hover { color: #fff; }
.nav-item.active { color: #fff; border-bottom-color: var(--accent); background: rgba(255,255,255,0.05); }

/* --- Admin Content Area --- */
.admin-content {
  flex: 1;
  padding: 1.5rem;
  max-width: 100%;
}

/* --- Cards & Forms --- */
.card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.25rem;
  box-shadow: var(--shadow);
  margin-bottom: 1rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--border);
}

.form-grid {
  display: grid;
  gap: 1rem;
}

.input-group {
  margin-bottom: 0.75rem;
}

label {
  display: block;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--text-main);
  margin-bottom: 0.25rem;
}

input, select, textarea {
  width: 100%;
  padding: 0.6rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  font-size: 0.9rem;
  background: #fff;
  color: var(--text-main);
  transition: border-color 0.15s;
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
}

button {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 0.6rem 1rem;
  background: var(--primary);
  color: #fff;
  font-weight: 500;
  font-size: 0.9rem;
  border: none;
  border-radius: var(--radius);
  cursor: pointer;
  transition: background 0.2s;
}
button:hover { background: var(--primary-light); }
button.secondary { background: #fff; border: 1px solid var(--border); color: var(--text-main); }
button.secondary:hover { background: var(--bg-body); }
button.danger { background: var(--danger); color: #fff; }
button.accent { background: var(--accent); }
button.accent:hover { background: var(--accent-hover); }

/* --- Data Tables --- */
.table-wrapper {
  overflow-x: auto;
  border: 1px solid var(--border);
  border-radius: var(--radius);
}
table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
th { background: #f1f5f9; text-align: left; padding: 0.75rem; font-weight: 600; color: var(--text-muted); border-bottom: 1px solid var(--border); }
td { padding: 0.75rem; border-bottom: 1px solid var(--border); color: var(--text-main); }
tr:last-child td { border-bottom: none; }

/* --- Badges --- */
.badge {
  display: inline-flex;
  padding: 2px 8px;
  border-radius: 99px;
  font-size: 0.7rem;
  font-weight: 600;
  background: #e2e8f0;
  color: #475569;
}
.badge.blue { background: #dbeafe; color: #1e40af; }
.badge.green { background: #dcfce7; color: #166534; }

/* --- Responsive Desktop --- */
@media (min-width: 768px) {
  .admin-layout { flex-direction: row; }
  .admin-nav {
    flex-direction: column;
    width: 240px;
    height: 100vh;
    border-right: 1px solid var(--border);
    border-bottom: none;
    position: sticky;
    top: 0;
  }
  .nav-item { width: 100%; border-bottom: none; border-left: 3px solid transparent; }
  .nav-item.active { border-left-color: var(--accent); border-bottom-color: transparent; }
  
  .form-grid-2 { grid-template-columns: 1fr 1fr; }
  .form-grid-3 { grid-template-columns: 1fr 1fr 1fr; }
}

/* --- Student/Public Specific --- */
.hero-section {
  text-align: center;
  padding: 3rem 1rem;
  background: linear-gradient(to bottom, #fff, #f1f5f9);
  border-bottom: 1px solid var(--border);
}
.class-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
}
.class-card {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.5rem;
  text-align: center;
  transition: all 0.2s;
}
.class-card:hover {
  border-color: var(--accent);
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}
`;


