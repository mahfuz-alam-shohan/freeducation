export const baseStyles = `
:root {
  /* Professional Color Palette */
  --app-bg: #f2f4f6;
  --card-bg: #ffffff;
  --primary: #111827;       /* Nearly Black */
  --primary-active: #374151;
  --accent: #2563eb;        /* iOS Blue */
  --accent-light: #eff6ff;
  --text-main: #111827;
  --text-sub: #6b7280;
  --border: #e5e7eb;
  --danger: #ef4444;
  
  /* Metrics */
  --nav-height: 56px;
  --radius: 8px;
  --space-xs: 4px;
  --space-s: 8px;
  --space-m: 16px;
  --space-l: 24px;
}

* { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background: var(--app-bg);
  color: var(--text-main);
  font-size: 15px;
  line-height: 1.4;
  padding-bottom: env(safe-area-inset-bottom);
}

a { text-decoration: none; color: inherit; }
h1, h2, h3, h4 { margin: 0; font-weight: 600; letter-spacing: -0.02em; }

/* --- Mobile-First Container --- */
.container {
  max-width: 600px; /* Constrained width for app-like feel on desktop */
  margin: 0 auto;
  padding: 0 var(--space-m);
}

/* --- App Header (Sticky) --- */
.app-header {
  background: var(--card-bg);
  height: var(--nav-height);
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center; /* Center Title */
  border-bottom: 1px solid var(--border);
  box-shadow: 0 1px 2px rgba(0,0,0,0.02);
}

.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 18px;
  color: var(--primary);
}

.header-action-right {
  position: absolute;
  right: var(--space-m);
  top: 50%;
  transform: translateY(-50%);
}

/* --- Admin Nav (Segmented Control) --- */
.admin-nav-scroll {
  background: var(--card-bg);
  border-bottom: 1px solid var(--border);
  overflow-x: auto;
  white-space: nowrap;
  display: flex;
  padding: 0 var(--space-s);
  position: sticky;
  top: var(--nav-height);
  z-index: 90;
  scrollbar-width: none;
}
.admin-nav-scroll::-webkit-scrollbar { display: none; }

.nav-tab {
  display: inline-block;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-sub);
  position: relative;
}

.nav-tab.active {
  color: var(--accent);
  font-weight: 600;
}
.nav-tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 16px;
  right: 16px;
  height: 2px;
  background: var(--accent);
  border-radius: 2px 2px 0 0;
}

/* --- Card Styles --- */
.card {
  background: var(--card-bg);
  border-radius: var(--radius);
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  margin-bottom: var(--space-m);
  border: 1px solid var(--border);
  overflow: hidden;
}

.card-header {
  padding: var(--space-m);
  border-bottom: 1px solid var(--border);
  background: #f9fafb;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-sub);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.card-body {
  padding: var(--space-m);
}

/* --- Forms (Touch Optimized) --- */
.form-stack {
  display: flex;
  flex-direction: column;
  gap: var(--space-m);
}

.input-group label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-sub);
  margin-bottom: 6px;
}

input, select, textarea {
  appearance: none;
  width: 100%;
  height: 44px; /* Touch friendly height */
  padding: 0 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--card-bg);
  font-size: 16px; /* Prevents iOS zoom */
  color: var(--text-main);
}

textarea { height: auto; padding-top: 10px; }

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 2px var(--accent-light);
}

/* --- Buttons --- */
button {
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 600;
  border-radius: var(--radius);
  border: none;
  cursor: pointer;
  width: 100%;
}

.btn-primary { background: var(--primary); color: #fff; }
.btn-primary:active { background: var(--primary-active); }

.btn-accent { background: var(--accent); color: #fff; }
.btn-accent:active { background: #1d4ed8; }

.btn-secondary { background: #fff; border: 1px solid var(--border); color: var(--text-main); }
.btn-secondary:active { background: #f3f4f6; }

.btn-small { height: 32px; font-size: 13px; padding: 0 12px; width: auto; }

/* --- Lists & Tables --- */
.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px var(--space-m);
  border-bottom: 1px solid var(--border);
}
.list-item:last-child { border-bottom: none; }

.badge {
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 12px;
  text-transform: uppercase;
}
.badge-blue { background: var(--accent-light); color: var(--accent); }
.badge-gray { background: #f3f4f6; color: var(--text-sub); }

/* --- Student Grid --- */
.class-list {
  display: grid;
  gap: var(--space-m);
  padding: var(--space-m) 0;
}
.class-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--card-bg);
  padding: 16px;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  box-shadow: 0 1px 2px rgba(0,0,0,0.02);
}

/* --- Auth Page Specific --- */
.auth-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-m);
}
`;


