export const styles = `
@import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&family=Inter:wght@400;500;600;700&display=swap');

:root {
  --primary: #4f46e5;
  --primary-dark: #3730a3;
  --secondary: #0ea5e9;
  --accent: #f59e0b;
  --success: #10b981;
  --danger: #ef4444;
  --slate-50: #f8fafc;
  --slate-100: #f1f5f9;
  --slate-200: #e2e8f0;
  --slate-700: #334155;
  --slate-800: #1e293b;
  --slate-900: #0f172a;
  
  --font-bn: 'Hind Siliguri', sans-serif;
  --font-en: 'Inter', sans-serif;
  
  --shadow-card: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.06);
  --shadow-hover: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.05);
}

* { box-sizing: border-box; }
body { margin: 0; font-family: var(--font-en); background: var(--slate-50); color: var(--slate-900); }
a { text-decoration: none; color: inherit; }

/* Layout */
.container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
.admin-layout { display: grid; grid-template-columns: 260px 1fr; min-height: 100vh; }
.sidebar { background: var(--slate-900); color: white; padding: 1.5rem; display: flex; flex-direction: column; gap: 0.5rem; position: sticky; top: 0; height: 100vh; overflow-y: auto; }
.main-content { padding: 2rem; overflow-y: auto; }

/* Components */
.card { background: white; border-radius: 12px; padding: 1.5rem; box-shadow: var(--shadow-card); border: 1px solid var(--slate-200); transition: 0.2s; }
.card:hover { transform: translateY(-2px); box-shadow: var(--shadow-hover); }

.btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.6rem 1.2rem; border-radius: 8px; font-weight: 500; cursor: pointer; border: none; font-size: 0.95rem; transition: 0.2s; }
.btn-primary { background: var(--primary); color: white; }
.btn-primary:hover { background: var(--primary-dark); }
.btn-outline { background: transparent; border: 1px solid var(--slate-200); color: var(--slate-700); }
.btn-outline:hover { border-color: var(--primary); color: var(--primary); background: #eef2ff; }
.btn-danger { background: #fee2e2; color: var(--danger); }
.btn-sm { padding: 0.4rem 0.8rem; font-size: 0.85rem; }

/* Typography */
h1, h2, h3 { font-family: var(--font-bn); margin: 0; }
.text-muted { color: var(--slate-700); font-size: 0.9rem; }
.badge { display: inline-block; padding: 0.25rem 0.75rem; border-radius: 99px; font-size: 0.75rem; font-weight: 600; }
.badge-blue { background: #e0f2fe; color: #0284c7; }
.badge-orange { background: #ffedd5; color: #c2410c; }
.badge-green { background: #dcfce7; color: #15803d; }

/* Admin Nav */
.nav-link { display: block; padding: 0.75rem 1rem; border-radius: 8px; color: #94a3b8; transition: 0.2s; }
.nav-link:hover, .nav-link.active { background: var(--primary); color: white; }
.nav-section { text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; color: #64748b; margin: 1.5rem 0 0.5rem 0.5rem; }

/* Grid Systems */
.grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 1.5rem; }
.grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; }
.stack { display: flex; flex-direction: column; gap: 1rem; }

/* Forms */
input, select, textarea { width: 100%; padding: 0.75rem; border: 1px solid var(--slate-200); border-radius: 8px; font-family: inherit; margin-top: 0.25rem; }
input:focus, textarea:focus { outline: none; border-color: var(--primary); ring: 2px solid #e0e7ff; }
label { display: block; font-size: 0.9rem; font-weight: 500; color: var(--slate-700); margin-bottom: 0.25rem; }

/* Content Blocks */
.content-block { border-left: 4px solid var(--slate-200); padding-left: 1rem; margin-bottom: 1.5rem; }
.content-block.explanation { border-color: var(--primary); }
.content-block.short_qa { border-color: var(--success); background: #f0fdf4; padding: 1rem; border-radius: 0 8px 8px 0; }
.question-item { background: #f8fafc; padding: 1rem; border-radius: 8px; margin-bottom: 0.5rem; border: 1px solid var(--slate-200); }

/* Responsive */
@media (max-width: 768px) {
  .admin-layout { grid-template-columns: 1fr; }
  .sidebar { display: none; } /* Mobile menu logic would go here */
}
`;
