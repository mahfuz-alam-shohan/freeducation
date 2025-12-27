export const css = `
  /* --- RESET & VARIABLES --- */
  :root {
    --primary: #2563eb;       /* Academic Blue */
    --primary-hover: #1d4ed8;
    --bg: #f8fafc;           /* Light Slate Background */
    --surface: #ffffff;
    --text: #0f172a;         /* Dark Slate Text */
    --muted: #64748b;
    --border: #e2e8f0;
    --danger: #ef4444;
    --success: #10b981;
    --radius: 12px;
    --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  
  body { 
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; 
    background: var(--bg); 
    color: var(--text); 
    line-height: 1.5; 
    -webkit-font-smoothing: antialiased;
  }

  a { text-decoration: none; color: inherit; transition: 0.2s; }
  ul { list-style: none; }

  /* --- LAYOUT UTILITIES --- */
  .container { width: 100%; max-width: 1000px; margin: 0 auto; padding: 0 1.5rem; }
  .flex { display: flex; }
  .items-center { align-items: center; }
  .justify-between { justify-content: space-between; }
  .gap-2 { gap: 0.5rem; }
  .gap-4 { gap: 1rem; }
  .mt-4 { margin-top: 1rem; }
  .mb-4 { margin-bottom: 1rem; }
  .grid { display: grid; gap: 1.5rem; }
  .grid-cols-2 { grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); }

  /* --- COMPONENTS --- */
  .btn {
    display: inline-flex; justify-content: center; align-items: center;
    padding: 0.6rem 1.2rem; border-radius: 8px; font-weight: 500; font-size: 0.95rem;
    cursor: pointer; border: 1px solid transparent; gap: 0.5rem;
  }
  .btn-primary { background: var(--primary); color: white; }
  .btn-primary:hover { background: var(--primary-hover); }
  .btn-outline { background: white; border-color: var(--border); color: var(--text); }
  .btn-outline:hover { background: #f1f5f9; }
  .btn-danger { background: #fef2f2; color: var(--danger); }
  
  .card { 
    background: var(--surface); 
    border-radius: var(--radius); 
    border: 1px solid var(--border); 
    padding: 1.5rem; 
    box-shadow: var(--shadow-sm);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  /* Inputs */
  .input-group label { display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.4rem; color: var(--muted); }
  .input-group input, .input-group select, .input-group textarea {
    width: 100%; padding: 0.75rem; border-radius: 8px; border: 1px solid var(--border);
    font-size: 1rem; background: #fff; transition: border-color 0.2s;
  }
  .input-group input:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }

  /* Badges */
  .badge { padding: 0.2rem 0.6rem; border-radius: 99px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
  .badge-blue { background: #eff6ff; color: var(--primary); }
  .badge-purple { background: #f5f3ff; color: #7c3aed; }
  .badge-orange { background: #fff7ed; color: #c2410c; }

  /* --- STUDENT SPECIFIC --- */
  .hero { text-align: center; padding: 4rem 1rem 3rem; }
  .hero h1 { font-size: 2.5rem; font-weight: 800; letter-spacing: -0.03em; color: #1e293b; margin-bottom: 0.5rem; }
  .hero p { color: var(--muted); font-size: 1.1rem; max-width: 600px; margin: 0 auto 2rem; }
  
  .search-bar { 
    position: relative; max-width: 500px; margin: 0 auto; 
  }
  .search-input {
    width: 100%; padding: 1rem 1.5rem; border-radius: 99px; border: 1px solid var(--border);
    box-shadow: var(--shadow-md); font-size: 1rem; padding-left: 3rem;
  }
  .search-icon { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--muted); }

  /* --- ADMIN SPECIFIC --- */
  .admin-layout { display: grid; grid-template-columns: 240px 1fr; min-height: 100vh; }
  .sidebar { background: #1e293b; color: white; padding: 1.5rem; }
  .sidebar-link { display: block; padding: 0.75rem 1rem; color: #94a3b8; border-radius: 6px; margin-bottom: 0.25rem; }
  .sidebar-link:hover, .sidebar-link.active { background: #334155; color: white; }
  .sidebar-brand { font-size: 1.25rem; font-weight: bold; color: white; margin-bottom: 2rem; display: block; }
  
  .admin-main { padding: 2rem; }
  
  /* Mobile Responsive */
  @media (max-width: 768px) {
    .admin-layout { display: block; }
    .sidebar { display: none; } /* Simplified for mobile admin */
    .hero h1 { font-size: 2rem; }
    .grid-cols-2 { grid-template-columns: 1fr; }
  }
`;
