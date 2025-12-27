export const baseStyles = `
:root {
  /* --- High-Focus Palette --- */
  --bg-app: #f8fafc;        /* Cool light gray */
  --bg-card: #ffffff;
  --bg-stem: #f1f5f9;       /* Distinct bg for reading passages */
  
  --primary: #0f172a;       /* Deepest Navy/Black for headings */
  --text-body: #334155;     /* Slate 700 for reading */
  --text-muted: #64748b;    /* Slate 500 for metadata */
  
  --accent: #2563eb;        /* Professional Blue */
  --accent-light: #eff6ff;
  
  --border: #e2e8f0;
  --border-focus: #cbd5e1;
  
  /* --- Metrics --- */
  --radius-lg: 16px;
  --radius-md: 12px;
  --radius-sm: 8px;
  
  --space-unit: 4px;
  --space-xs: 8px;  /* 2 units */
  --space-s: 16px;  /* 4 units */
  --space-m: 24px;  /* 6 units */
  --space-l: 32px;  /* 8 units */
  
  --header-height: 64px;
}

* { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }

body {
  margin: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background: var(--bg-app);
  color: var(--text-body);
  font-size: 16px; /* Base size for readability */
  line-height: 1.6;
  padding-bottom: env(safe-area-inset-bottom);
}

a { text-decoration: none; color: inherit; transition: opacity 0.2s; }
a:active { opacity: 0.7; }

h1, h2, h3, h4 { margin: 0; font-weight: 700; color: var(--primary); letter-spacing: -0.02em; }
h1 { font-size: 28px; line-height: 1.2; }
h2 { font-size: 22px; }
h3 { font-size: 18px; }

.container {
  max-width: 720px; /* Reading optimized width */
  margin: 0 auto;
  padding: 0 var(--space-s);
}

/* --- Focused Header --- */
.app-header {
  height: var(--header-height);
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-content {
  width: 100%;
  max-width: 720px;
  padding: 0 var(--space-s);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand {
  font-size: 20px;
  font-weight: 800;
  color: var(--primary);
  display: flex;
  align-items: center;
  gap: 8px;
}

/* --- Focus Cards (The Core UI Element) --- */
.focus-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-m);
  margin-bottom: var(--space-s);
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
  overflow: hidden;
}

.focus-card.clickable:active {
  transform: scale(0.98);
  background: var(--bg-app);
}

.focus-card.featured {
  background: linear-gradient(135deg, var(--primary) 0%, #1e293b 100%);
  color: #fff;
  border: none;
}
.focus-card.featured h3 { color: #fff; }
.focus-card.featured p { color: #cbd5e1; }

/* --- Stem / Scenario Block --- */
.stem-block {
  background: var(--bg-stem);
  padding: var(--space-m);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-m);
  border-left: 4px solid var(--accent);
  font-family: 'Georgia', serif; /* Serif for reading passages */
  font-size: 17px;
  color: #1e293b;
}

/* --- Question Threading --- */
.question-thread {
  position: relative;
  padding-left: 16px;
  margin-left: 8px;
  border-left: 2px solid var(--border);
}

.sub-question {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: var(--space-s);
  margin-bottom: var(--space-s);
  position: relative;
}

.sub-question::before {
  content: '';
  position: absolute;
  left: -18px; /* Connect to thread line */
  top: 24px;
  width: 16px;
  height: 2px;
  background: var(--border);
}

.q-part-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--accent-light);
  color: var(--accent);
  font-weight: 700;
  font-size: 14px;
  margin-right: 12px;
  flex-shrink: 0;
}

/* --- Navigation Pills --- */
.nav-scroller {
  background: var(--bg-card);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: var(--header-height);
  z-index: 90;
  padding: 12px 0;
  margin-bottom: var(--space-m);
}
.pill-list {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding: 0 var(--space-s);
  scrollbar-width: none;
}
.pill-list::-webkit-scrollbar { display: none; }

.nav-pill {
  padding: 8px 16px;
  border-radius: 99px;
  background: var(--bg-app);
  border: 1px solid var(--border);
  color: var(--text-muted);
  font-weight: 600;
  font-size: 14px;
  white-space: nowrap;
}
.nav-pill.active {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
}

/* --- Buttons --- */
.action-btn {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 16px;
  border: none;
  cursor: pointer;
}
.btn-primary { background: var(--primary); color: #fff; }
.btn-outline { background: transparent; border: 2px solid var(--border); color: var(--text-main); }
.btn-text { background: transparent; color: var(--text-muted); font-size: 14px; }

/* --- Empty States --- */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-muted);
}
.empty-icon { font-size: 48px; margin-bottom: 16px; opacity: 0.5; }

/* --- Admin Specific Adjustments --- */
/* (Keeping Admin functional but cleaner) */
.admin-nav-scroll { top: var(--header-height); }
.form-stack input { height: 48px; }
`;


