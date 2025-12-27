export const baseStyles = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

:root {
  /* --- Core Palette --- */
  --bg-app: #f4f6fb;
  --bg-card: #ffffff;
  --bg-stem: #eef2ff;
  --bg-soft: #f1f5ff;

  --primary: #2563eb;
  --primary-dark: #1d4ed8;
  --accent: #f97316;
  --success: #16a34a;
  --danger: #ef4444;

  --text-main: #0b1222;
  --text-body: #1f2937;
  --text-muted: #64748b;
  --text-sub: #94a3b8;

  --border: #e2e8f0;
  --border-strong: #d6def6;

  /* --- Shadows & Radius --- */
  --shadow-xs: 0 1px 1px 0 rgb(15 23 42 / 0.04);
  --shadow-sm: 0 6px 18px -12px rgb(15 23 42 / 0.2);
  --shadow-md: 0 16px 40px -18px rgb(15 23 42 / 0.28);
  --shadow-lg: 0 24px 60px -22px rgb(15 23 42 / 0.32);

  --radius-lg: 22px;
  --radius-md: 16px;
  --radius-sm: 12px;

  --header-height: 64px;
}

* { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }

body {
  margin: 0;
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  background: linear-gradient(180deg, #ffffff 0%, #f1f4ff 40%, #eef2ff 100%);
  color: var(--text-body);
  font-size: 16px;
  line-height: 1.6;
  min-height: 100vh;
  padding-bottom: env(safe-area-inset-bottom);
}

a { text-decoration: none; color: inherit; transition: all 0.2s ease; }

img { max-width: 100%; display: block; }

/* --- Layout --- */
.container {
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 18px;
}

.page-stack { display: flex; flex-direction: column; gap: 20px; }
.stack-sm { display: flex; flex-direction: column; gap: 12px; }
.stack-lg { display: flex; flex-direction: column; gap: 24px; }
.grid-auto {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}

/* --- Typography --- */
h1, h2, h3, h4 { margin: 0; font-weight: 700; color: var(--text-main); letter-spacing: -0.02em; }
h1 { font-size: 28px; }
h2 { font-size: 22px; }
h3 { font-size: 18px; }
p { margin: 0; }

/* --- Header --- */
.app-header {
  min-height: var(--header-height);
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  box-shadow: var(--shadow-sm);
}

.header-content {
  width: 100%;
  max-width: 1040px;
  margin: 0 auto;
  padding: 0 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.brand {
  font-size: 18px;
  font-weight: 800;
  color: var(--primary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.header-slot {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
}

.header-left { left: 16px; }
.header-right { right: 16px; }

.header-back {
  padding: 8px;
  margin-left: -8px;
  display: flex;
  align-items: center;
  color: var(--text-muted);
}

.header-admin { opacity: 0.4; }

.header-pill {
  background: #fff;
  color: var(--text-muted);
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
  border: 1px solid var(--border);
}

/* --- Hero --- */
.hero {
  background: linear-gradient(135deg, #ffffff 0%, #eff3ff 48%, #dfe8ff 100%);
  border: 1px solid #dbe4ff;
  border-radius: var(--radius-lg);
  padding: 20px;
  box-shadow: var(--shadow-md);
  position: relative;
  overflow: hidden;
}

.hero::after {
  content: "";
  position: absolute;
  inset: auto -20% -60% auto;
  width: 220px;
  height: 220px;
  background: radial-gradient(circle, rgba(37, 99, 235, 0.2), transparent 70%);
}

.hero-title { font-size: 20px; font-weight: 800; color: var(--text-main); }
.hero-sub { color: var(--text-muted); margin-top: 6px; font-size: 14px; }
.hero-meta { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; }

.pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 12px;
  background: #fff;
  border: 1px solid var(--border);
  font-size: 12px;
  font-weight: 600;
  color: var(--text-body);
}

/* --- Cards --- */
.focus-card,
.card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 18px;
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
  position: relative;
  overflow: hidden;
}

.focus-card.clickable:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--primary);
}

.focus-card.clickable:active { transform: scale(0.98); }

.focus-card.featured {
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.94), rgba(30, 64, 175, 0.95));
  color: #fff;
  border: none;
  box-shadow: var(--shadow-lg);
}
.focus-card.featured h3 { color: #fff; }
.focus-card.featured p { color: rgba(255,255,255,0.9); }

.card-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

.class-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px;
  border: 1px solid var(--border-strong);
  background: linear-gradient(140deg, #ffffff 0%, #eef2ff 48%, #f8fafc 100%);
}

.class-card .badge {
  background: var(--bg-soft);
  color: var(--primary);
  width: 42px;
  height: 42px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.class-tag {
  display: inline-flex;
  margin-top: 8px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
  color: #5b21b6;
  background: #f3e8ff;
}

.section-title {
  font-size: 13px;
  font-weight: 800;
  color: var(--text-sub);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

/* --- Tags --- */
.tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
}

.tag-gray { background: #f1f5f9; color: var(--text-muted); }
.tag-accent { background: #fff7e6; color: #b45309; }

.group-picker {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.group-pill {
  padding: 10px 14px;
  border-radius: 14px;
  border: 1px solid var(--border);
  background: #fff;
  font-weight: 600;
  font-size: 13px;
  color: var(--text-body);
  box-shadow: var(--shadow-xs);
}

.group-pill.active {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
  box-shadow: var(--shadow-sm);
}

.group-hint {
  margin-top: 12px;
  font-size: 13px;
  color: var(--text-muted);
}

.group-note {
  margin-top: 8px;
  font-size: 12px;
  color: #6366f1;
  font-weight: 600;
}

.subject-card {
  padding: 16px;
  border: 1px solid var(--border-strong);
  background: #ffffff;
}

.subject-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 12px;
  border-radius: 14px;
  border: 1px solid var(--border);
  background: #ffffff;
  margin-bottom: 10px;
}

.subject-row:last-child { margin-bottom: 0; }

.subject-title {
  font-weight: 700;
  font-size: 16px;
  color: var(--text-main);
}

.subject-meta {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 4px;
}

.subject-row:hover {
  border-color: #c7d2fe;
  box-shadow: var(--shadow-sm);
  transform: translateY(-1px);
}

/* --- Stem Block (Reading Mode) --- */
.stem-block {
  background: var(--bg-stem);
  padding: 24px;
  border-radius: var(--radius-md);
  margin-bottom: 24px;
  border-left: 4px solid var(--primary);
  font-family: 'Georgia', serif;
  font-size: 18px;
  color: #1e293b;
  line-height: 1.8;
  box-shadow: var(--shadow-xs);
}

/* --- Questions --- */
.question-thread {
  position: relative;
  padding-left: 20px;
  margin-left: 10px;
  border-left: 2px solid var(--border);
}

.sub-question {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 16px;
  margin-bottom: 16px;
  position: relative;
  box-shadow: var(--shadow-sm);
}

.sub-question::before {
  content: '';
  position: absolute;
  left: -22px;
  top: 24px;
  width: 20px;
  height: 2px;
  background: var(--border);
}

.q-part-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--bg-stem);
  color: var(--primary);
  font-weight: 700;
  font-size: 14px;
  margin-right: 12px;
  flex-shrink: 0;
  border: 1px solid var(--border);
}

/* --- Buttons --- */
button,
.btn-primary,
.btn-secondary,
.btn-accent,
.btn-ghost,
.btn-sm {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 18px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 15px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.2s ease, opacity 0.2s;
  min-height: 46px;
}

.btn-primary {
  background: var(--primary);
  color: #fff;
  width: 100%;
}
.btn-secondary {
  background: #f8fafc;
  color: #1e293b;
  border-color: var(--border);
}
.btn-accent {
  background: var(--accent);
  color: #fff;
}
.btn-ghost {
  background: #ffffff;
  color: var(--text-body);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-xs);
}
.btn-sm {
  padding: 8px 12px;
  font-size: 13px;
  min-height: 36px;
}
.btn-primary:active,
.btn-secondary:active,
.btn-accent:active { transform: scale(0.98); }

input,
select,
textarea {
  width: 100%;
  padding: 12px 12px;
  border-radius: 12px;
  border: 1px solid var(--border);
  font-size: 14px;
  font-family: inherit;
}

/* --- Admin Shell --- */
.admin-shell {
  display: grid;
  grid-template-columns: 1fr;
  min-height: 100vh;
  background: var(--bg-app);
}

.admin-sidebar {
  background: #0f172a;
  color: #e2e8f0;
  padding: 20px;
  display: none;
  flex-direction: column;
  gap: 16px;
}

.admin-sidebar .brand {
  color: #fff;
}

.admin-nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.admin-nav a {
  padding: 10px 14px;
  border-radius: 12px;
  color: #e2e8f0;
  font-weight: 600;
}

.admin-nav a.active {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
}

.admin-topbar {
  background: #fff;
  border-bottom: 1px solid var(--border);
  padding: 14px 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 90;
  box-shadow: var(--shadow-xs);
}

.admin-main {
  padding: 16px;
}

.nav-scroll {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 8px 16px 12px;
  background: #fff;
  border-bottom: 1px solid var(--border);
}

.nav-pill {
  padding: 8px 12px;
  background: #f8fafc;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
  border: 1px solid transparent;
}

.nav-pill.active {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
}

/* --- Admin Cards --- */
.card-header {
  font-weight: 700;
  font-size: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 12px;
}

.card-body { display: flex; flex-direction: column; gap: 12px; }
.form-stack { display: flex; flex-direction: column; gap: 12px; }
.form-row { display: flex; flex-direction: column; gap: 10px; }
.form-row.align-center { align-items: center; }
.form-row .form-shrink { flex: 0 0 auto; }
.form-row > * { flex: 1; }
.list-row { display: flex; flex-direction: column; align-items: flex-start; justify-content: space-between; gap: 8px; }

.inline-edit summary {
  cursor: pointer;
  list-style: none;
}

.inline-edit summary::-webkit-details-marker { display: none; }

/* --- Empty States --- */
.empty-state {
  text-align: center;
  padding: 40px 20px;
}
.empty-icon { font-size: 48px; margin-bottom: 16px; }

/* --- Error Pages --- */
.error-container {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px 20px;
}
.error-icon { font-size: 64px; margin-bottom: 24px; }
.error-title { font-size: 24px; margin-bottom: 8px; }
.error-msg { color: var(--text-muted); max-width: 400px; margin: 0 auto; }

@media (min-width: 900px) {
  h1 { font-size: 34px; }
  h2 { font-size: 26px; }
  .hero-title { font-size: 24px; }
  .card-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .grid-auto {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
  .list-row {
    flex-direction: row;
    align-items: center;
  }
  .form-row {
    flex-direction: row;
    align-items: center;
  }
  .admin-shell {
    grid-template-columns: 260px 1fr;
  }
  .admin-sidebar {
    display: flex;
  }
  .admin-topbar,
  .nav-scroll { display: none; }
  .admin-main { padding: 32px; }
}

@media (min-width: 1100px) {
  .card-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
`;
