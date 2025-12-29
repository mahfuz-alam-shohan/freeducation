export const styles = `
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

:root {
  /* Modern EdTech Palette */
  --primary: #4f46e5;       /* Indigo 600 */
  --primary-hover: #4338ca; /* Indigo 700 */
  --primary-light: #e0e7ff; /* Indigo 100 */
  
  --secondary: #0d9488;     /* Teal 600 */
  --accent: #f59e0b;        /* Amber 500 */
  
  --bg-body: #f8fafc;       /* Slate 50 */
  --bg-card: #ffffff;
  --bg-glass: rgba(255, 255, 255, 0.9);
  
  --text-main: #0f172a;     /* Slate 900 */
  --text-muted: #64748b;    /* Slate 500 */
  --text-light: #94a3b8;    /* Slate 400 */
  
  --border: #e2e8f0;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-hover: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  
  --font-main: 'Plus Jakarta Sans', 'Noto Sans Bengali', sans-serif;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  font-family: var(--font-main);
  background-color: var(--bg-body);
  color: var(--text-main);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

/* Layout Utilities */
.container {
  width: min(1200px, 92vw);
  margin: 0 auto;
}

.grid {
  display: grid;
  gap: 1.5rem;
}

@media (min-width: 640px) { .grid.two { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 768px) { .grid.three { grid-template-columns: repeat(3, 1fr); } }
@media (min-width: 1024px) { .grid.four { grid-template-columns: repeat(4, 1fr); } }

.stack { display: flex; flex-direction: column; gap: 1rem; }
.flex-between { display: flex; justify-content: space-between; align-items: center; }
.flex-wrap { display: flex; flex-wrap: wrap; gap: 0.5rem; }

/* Typography */
h1, h2, h3, h4, h5, h6 {
  margin: 0;
  font-weight: 700;
  color: var(--text-main);
  line-height: 1.2;
}

h1 { font-size: clamp(2rem, 5vw, 3rem); letter-spacing: -0.02em; }
h2 { font-size: 1.75rem; letter-spacing: -0.01em; }
h3 { font-size: 1.25rem; }

p { margin: 0; color: var(--text-muted); }
.text-sm { font-size: 0.875rem; }
.text-center { text-align: center; }

/* Components */
.topbar {
  background: var(--bg-glass);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 50;
  padding: 1rem 0;
}

.brand {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--primary);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.brand-icon {
  width: 32px;
  height: 32px;
  background: var(--primary);
  color: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-md);
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.95rem;
}

.btn-primary {
  background: var(--primary);
  color: white;
  box-shadow: var(--shadow-md);
}
.btn-primary:hover {
  background: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.btn-outline {
  background: transparent;
  border: 2px solid var(--primary-light);
  color: var(--primary);
}
.btn-outline:hover {
  border-color: var(--primary);
  background: var(--primary-light);
}

.btn-sm { padding: 0.5rem 1rem; font-size: 0.85rem; border-radius: 8px; }

/* Cards */
.card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  padding: 1.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
  overflow: hidden;
}

.card:hover {
  border-color: var(--primary-light);
  box-shadow: var(--shadow-hover);
  transform: translateY(-4px);
}

.card-decoration {
  position: absolute;
  top: -20px;
  right: -20px;
  width: 100px;
  height: 100px;
  background: var(--primary-light);
  border-radius: 50%;
  opacity: 0.5;
  z-index: 0;
}

.card-content { position: relative; z-index: 1; display: flex; flex-direction: column; gap: 0.5rem; height: 100%; }

.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: var(--primary-light);
  color: var(--primary);
  border-radius: 99px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

/* Sections */
.hero {
  padding: 4rem 0;
  text-align: center;
  background: linear-gradient(180deg, #fff 0%, var(--bg-body) 100%);
  border-bottom: 1px solid var(--border);
  margin-bottom: 3rem;
}

.hero h1 { margin-bottom: 1rem; color: var(--text-main); }
.hero p { max-width: 600px; margin: 0 auto 2rem; font-size: 1.1rem; }

.section-header { margin-bottom: 2rem; }
.section-header h2 { font-size: 1.5rem; }

/* Lists & Tables (Admin & Public) */
.list-group {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  overflow: hidden;
}

.list-item {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.2s;
}
.list-item:last-child { border-bottom: none; }
.list-item:hover { background: #f8fafc; }

/* Forms */
input, textarea, select {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  font-family: inherit;
  transition: border 0.2s;
}
input:focus { outline: none; border-color: var(--primary); ring: 2px solid var(--primary-light); }

/* Footer */
.footer {
  margin-top: 4rem;
  padding: 3rem 0;
  background: white;
  border-top: 1px solid var(--border);
  text-align: center;
}
`;
