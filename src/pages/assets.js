export const styles = `
:root {
  color-scheme: light;
  --bg: #eef4ff;
  --surface: #ffffff;
  --surface-soft: #f8fbff;
  --surface-muted: #f8fafc;
  --line: #e2e8f0;
  --line-strong: #cbd5e1;
  --text: #0f172a;
  --muted: #64748b;
  --primary: #334155;
  --primary-strong: #1e293b;
  --danger: #dc2626;
  --shadow-soft: 0 10px 30px -22px rgba(15, 23, 42, 0.5);
  --radius-lg: 16px;
  --radius-md: 12px;
  --radius-sm: 10px;
  --sidebar-open: 272px;
  --sidebar-collapse: 80px;
}

* { box-sizing: border-box; }
html, body { margin: 0; min-height: 100%; }
body {
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
  background: radial-gradient(circle at 20% 0%, #f8fbff 0%, #edf3ff 45%, #eaf1ff 100%);
  color: var(--text);
}
a { color: inherit; }

.app-shell {
  display: grid;
  grid-template-columns: var(--sidebar-open) 1fr;
  min-height: 100vh;
}
.app-shell.collapsed { grid-template-columns: var(--sidebar-collapse) 1fr; }

.sidebar {
  position: fixed;
  inset: 0 auto 0 0;
  width: var(--sidebar-open);
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  border-right: 1px solid #d9e3f3;
  display: flex;
  flex-direction: column;
  transition: width 160ms ease;
  z-index: 35;
}
.app-shell.collapsed .sidebar { width: var(--sidebar-collapse); }

.sidebar-head {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid var(--line);
  position: relative;
}
.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  white-space: nowrap;
}
.brand-logo {
  width: 26px;
  height: 26px;
  display: inline-grid;
  place-items: center;
}
.brand-logo svg { width: 100%; height: 100%; }
.brand-name {
  font-size: 19px;
  font-weight: 700;
  font-family: "Georgia", "Times New Roman", serif;
  letter-spacing: 0.01em;
  color: #0f172a;
  text-transform: lowercase;
}
.sidebar-toggle {
  border: 1px solid #cbd5e1;
  background: #ffffff;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  cursor: pointer;
  display: inline-grid;
  place-items: center;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.12);
}
.sidebar-toggle .toggle-icon { width: 16px; height: 16px; color: #0f172a; display: inline-grid; }
.sidebar-toggle .toggle-icon svg { width: 100%; height: 100%; stroke: currentColor; stroke-width: 2; fill: none; stroke-linecap: round; stroke-linejoin: round; }
.app-shell.collapsed .sidebar-toggle { display: none; }

.sidebar-scroll {
  overflow: auto;
  padding: 14px 10px;
  min-height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
}
.nav-group-title {
  font-size: 11px;
  font-weight: 700;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin: 10px 10px 8px;
}
.menu-item,
.submenu-item,
.menu-expand {
  border-radius: 10px;
  min-height: 40px;
  display: flex;
  align-items: center;
  text-decoration: none;
  gap: 10px;
  padding: 8px 12px;
  color: #334155;
  font-size: 14px;
  margin-bottom: 4px;
}
.menu-expand {
  width: 100%;
  border: 0;
  background: transparent;
  cursor: pointer;
  justify-content: space-between;
}
.menu-expand > span:first-child { display: inline-flex; align-items: center; gap: 10px; }
.menu-item:hover,
.menu-expand:hover,
.submenu-item:hover { background: #f1f5f9; }
.menu-item.active,
.submenu-item.active { background: #e6eeff; color: #1e3a8a; font-weight: 600; }
.logout-item {
  margin-top: auto;
  border: 1px solid #fecaca;
  color: #991b1b;
  background: #fff5f5;
}
.logout-item .icon { color: #b91c1c; }
.logout-item:hover { background: #fee2e2; }
.icon {
  width: 18px;
  height: 18px;
  flex: none;
  display: inline-grid;
  place-items: center;
  color: #64748b;
}
.icon svg { width: 100%; height: 100%; stroke: currentColor; fill: none; stroke-width: 1.9; stroke-linecap: round; stroke-linejoin: round; }
.icon svg rect, .icon svg circle { fill: none; }
.menu-item.active .icon,
.submenu-item.active .icon { color: #4f46e5; }
.label { overflow: hidden; white-space: nowrap; }
.app-shell.collapsed .brand-name,
.app-shell.collapsed .label,
.app-shell.collapsed .nav-group-title,
.app-shell.collapsed .chevron { opacity: 0; width: 0; display: none; }
.app-shell.collapsed .brand { justify-content: center; width: 100%; }
.app-shell.collapsed .brand-logo { width: 28px; height: 28px; }
.app-shell.collapsed .menu-item,
.app-shell.collapsed .submenu-item,
.app-shell.collapsed .menu-expand { justify-content: center; padding: 8px; }
.app-shell.collapsed .submenu { padding-left: 0; }
.app-shell.collapsed.hover-expanded { grid-template-columns: var(--sidebar-open) 1fr; }
.app-shell.collapsed.hover-expanded .sidebar { width: var(--sidebar-open); }
.app-shell.collapsed.hover-expanded .sidebar-toggle { display: inline-grid; }
.app-shell.collapsed.hover-expanded .brand-name,
.app-shell.collapsed.hover-expanded .label,
.app-shell.collapsed.hover-expanded .nav-group-title,
.app-shell.collapsed.hover-expanded .chevron { display: initial; opacity: 1; width: auto; }
.app-shell.collapsed.hover-expanded .brand { justify-content: initial; width: auto; }
.app-shell.collapsed.hover-expanded .menu-item,
.app-shell.collapsed.hover-expanded .submenu-item,
.app-shell.collapsed.hover-expanded .menu-expand { justify-content: flex-start; padding: 8px 12px; }
.app-shell.collapsed.hover-expanded .submenu { padding-left: 14px; }
.chevron { width: 16px; height: 16px; color: var(--muted); display: inline-grid; transition: transform 150ms ease; }
.chevron svg { width: 100%; height: 100%; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

.submenu-wrap { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 160ms ease; }
.submenu { overflow: hidden; padding-left: 14px; }
.menu-block.open .submenu-wrap { grid-template-rows: 1fr; }
.menu-block.open .chevron { transform: rotate(180deg); }

.main-shell {
  grid-column: 2;
  margin-left: 0;
  min-width: 0;
}
.topbar {
  position: sticky;
  top: 0;
  z-index: 30;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 0 24px;
  border-bottom: 1px solid var(--line);
  background: rgba(241, 246, 255, 0.92);
  backdrop-filter: blur(8px);
}
.topbar-left,
.topbar-right { display: flex; align-items: center; gap: 12px; }
.login-note { color: #475569; }
.login-name { color: #0f172a; font-weight: 700; }
.icon-btn {
  border: 1px solid #cbd5e1;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 12px;
  width: 36px;
  height: 36px;
  cursor: pointer;
  display: inline-grid;
  place-items: center;
}
.mobile-menu-btn {
  width: 40px;
  height: 40px;
  border-radius: 14px;
  border-color: #94a3b8;
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.12), inset 0 1px 0 rgba(255,255,255,0.8);
}
.mobile-icon {
  width: 19px;
  height: 19px;
  color: #0f172a;
  display: inline-grid;
}
.mobile-icon svg {
  width: 100%;
  height: 100%;
  stroke: currentColor;
  fill: none;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.mobile-icon-close { display: none; }
.app-shell.mobile-open .mobile-icon-menu { display: none; }
.app-shell.mobile-open .mobile-icon-close { display: inline-grid; }
.avatar {
  width: 36px;
  height: 36px;
  aspect-ratio: 1 / 1;
  border-radius: 999px;
  background: #dbeafe;
  color: #1e3a8a;
  display: inline-grid;
  place-items: center;
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
  flex: 0 0 36px;
}

.container {
  width: min(1440px, 100%);
  margin: 0 auto;
  padding: 16px 18px;
}
.page-head { margin-bottom: 14px; }
.page-title { margin: 0; font-size: 28px; line-height: 1.2; letter-spacing: -0.03em; }
.page-subtitle { margin: 8px 0 0; color: var(--muted); font-size: 14px; }

.grid { display: grid; gap: 16px; }
.grid-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.grid-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.grid-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }

.card {
  background: var(--surface);
  border: 1px solid #d8e3f2;
  border-radius: 14px;
  box-shadow: 0 8px 20px -22px rgba(37, 99, 235, 0.45);
  padding: 10px 14px;
}
.card-title { margin: 0 0 6px; font-size: 16px; }
.kpi-grid .kpi-card:nth-child(1) { background: linear-gradient(180deg, #ffffff 0%, #f3f8ff 100%); }
.kpi-grid .kpi-card:nth-child(2) { background: linear-gradient(180deg, #ffffff 0%, #f3fff7 100%); }
.kpi-grid .kpi-card:nth-child(3) { background: linear-gradient(180deg, #ffffff 0%, #fff9f2 100%); }
.muted { margin: 0; font-size: 13px; color: var(--muted); line-height: 1.5; }
.kpi { margin-top: 8px; font-size: 42px; font-weight: 700; letter-spacing: -0.03em; line-height: 1.05; }

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}
.toolbar-group { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }

.btn {
  border-radius: 10px;
  border: 1px solid transparent;
  min-height: 36px;
  padding: 0 14px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 120ms ease;
}
.btn-primary { background: var(--primary); color: #fff; }
.btn-primary:hover { background: var(--primary-strong); }
.btn-secondary { background: #eef2ff; color: #312e81; border-color: #c7d2fe; }
.btn-danger { background: #fef2f2; color: var(--danger); border-color: #fecaca; }
.btn-ghost { background: var(--surface); color: #334155; border-color: var(--line); }

.input,
.select {
  height: 38px;
  border: 1px solid var(--line);
  background: var(--surface);
  border-radius: 10px;
  padding: 0 12px;
  font-size: 14px;
}
.badge {
  display: inline-flex;
  border-radius: 999px;
  padding: 3px 10px;
  font-size: 12px;
  font-weight: 600;
}
.badge-success { background: #ecfdf5; color: #047857; }
.badge-info { background: #eff6ff; color: #1d4ed8; }
.badge-warn { background: #fffbeb; color: #b45309; }

.tabs {
  display: inline-flex;
  border-radius: 11px;
  border: 1px solid var(--line);
  padding: 4px;
  background: #f8fafc;
}
.tab-btn {
  border: 0;
  background: transparent;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--muted);
  cursor: pointer;
}
.tab-btn.active { background: var(--surface); color: var(--text); box-shadow: var(--shadow-soft); }

.table-wrap {
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  overflow: auto;
}
.table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  min-width: 860px;
}
.table thead th {
  position: sticky;
  top: 0;
  z-index: 1;
  background: #f8fafc;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-size: 11px;
  font-weight: 700;
  padding: 10px 14px;
  border-bottom: 1px solid var(--line);
  text-align: left;
}
.table tbody td {
  padding: 10px 14px;
  border-bottom: 1px solid var(--line);
  font-size: 14px;
}
.table tbody tr:hover { background: #f8fafc; }

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  color: var(--muted);
  font-size: 13px;
}

.dropdown,
.modal,
.toast {
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--surface);
  box-shadow: var(--shadow-soft);
}
.dropdown { padding: 8px; min-width: 200px; }
.modal { padding: 20px; max-width: 460px; }
.toast { padding: 12px 14px; position: fixed; right: 24px; bottom: 24px; display: none; }
.toast.show { display: block; animation: toast-in 180ms ease; }
@keyframes toast-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

.center-wrap { min-height: 100vh; display: grid; place-items: center; padding: 24px; }
.auth-card {
  width: min(500px, 100%);
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 20px;
  box-shadow: var(--shadow-soft);
  padding: 32px;
}
.form-grid { display: grid; gap: 8px; margin-top: 16px; }
label { font-size: 13px; color: #334155; font-weight: 600; }
.error { color: #b91c1c; min-height: 19px; font-size: 13px; margin: 0 0 8px; }

.mobile-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.38);
  opacity: 0;
  pointer-events: none;
  transition: opacity 150ms ease;
  z-index: 30;
}
.mobile-overlay.show,
.app-shell.mobile-open .mobile-overlay { opacity: 1; pointer-events: auto; }
.mobile-only { display: none; }

@media (max-width: 1024px) {
  .grid-4,
  .grid-3 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 840px) {
  .app-shell,
  .app-shell.collapsed,
  .app-shell.collapsed.hover-expanded { grid-template-columns: 1fr; }
  .sidebar {
    transform: translateX(-100%);
    transition: transform 170ms ease;
    width: min(84vw, 310px);
  }
  .app-shell.mobile-open .sidebar { transform: translateX(0); }
  .main-shell { grid-column: 1; }
  .container { padding: 16px; }
  .topbar { padding: 0 16px; }
  .desktop-only { display: none !important; }
  .mobile-only { display: inline-flex; }
  .topbar-left { flex: 1; min-width: 0; }
  .login-note { font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .grid-4,
  .grid-3,
  .grid-2 { grid-template-columns: 1fr; }
  .card { padding: 12px 14px; border-radius: 12px; }
  .kpi { font-size: 36px; }
  .page-title { font-size: 24px; }
  .auth-card { padding: 24px; }
}
`;

export const setupScript = `
const form = document.getElementById('setup-form');
const err = document.getElementById('error');
const imageInput = document.getElementById('image');

async function downscale(file){
  const bmp = await createImageBitmap(file);
  const max=320;
  const scale = Math.min(1, max / Math.max(bmp.width,bmp.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1,Math.round(bmp.width*scale));
  canvas.height = Math.max(1,Math.round(bmp.height*scale));
  const ctx = canvas.getContext('2d');
  ctx.drawImage(bmp,0,0,canvas.width,canvas.height);
  const blob = await new Promise((resolve)=>canvas.toBlob(resolve,'image/webp',0.82));
  return new File([blob], 'profile.webp', { type: 'image/webp' });
}

form.addEventListener('submit', async (e)=>{
  e.preventDefault();
  err.textContent='';
  const fd = new FormData(form);
  const file = imageInput.files?.[0];
  if(file){
    try { fd.set('image', await downscale(file)); }
    catch { err.textContent='Image could not be processed.'; return; }
  }
  const res = await fetch('/api/bootstrap', { method:'POST', body: fd });
  const data = await res.json();
  if(!res.ok){ err.textContent=data.error || 'Unable to create admin.'; return; }
  window.location.href='/dashboard';
});
`;

export const loginScript = `
const form = document.getElementById('login-form');
const err = document.getElementById('error');
form.addEventListener('submit', async (e)=>{
  e.preventDefault(); err.textContent='';
  const body = Object.fromEntries(new FormData(form).entries());
  const res = await fetch('/api/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});
  const data = await res.json();
  if(!res.ok){ err.textContent = data.error || 'Login failed'; return; }
  window.location.href='/dashboard';
});
`;

export const appScript = `
const shell = document.querySelector('[data-shell]');
const sidebar = document.querySelector('.sidebar');
const sidebarToggle = document.querySelector('[data-sidebar-toggle]');
const mobileToggle = document.querySelector('[data-mobile-toggle]');
const overlay = document.querySelector('[data-overlay]');

if (!shell) {
  // no-op when app shell is not present
} else {
  let hoverExpanded = false;

  if(sidebarToggle){
    sidebarToggle.addEventListener('click', ()=>{
      shell.classList.toggle('collapsed');
      shell.classList.remove('hover-expanded');
      hoverExpanded = false;
      const expanded = !shell.classList.contains('collapsed');
      sidebarToggle.setAttribute('aria-expanded', String(expanded));
      sidebarToggle.setAttribute('aria-label', expanded ? 'Collapse sidebar' : 'Collapsed sidebar, hover over sidebar to expand');
    });
  }

  if(sidebar){
    sidebar.addEventListener('mouseenter', ()=>{
      if (window.innerWidth <= 840) return;
      if (shell.classList.contains('collapsed')) {
        shell.classList.add('hover-expanded');
        hoverExpanded = true;
      }
    });

    sidebar.addEventListener('mouseleave', ()=>{
      if (window.innerWidth <= 840) return;
      if (hoverExpanded) {
        shell.classList.remove('hover-expanded');
        hoverExpanded = false;
      }
    });
  }

  if(mobileToggle){
    mobileToggle.addEventListener('click', ()=>{
      shell.classList.toggle('mobile-open');
      const open = shell.classList.contains('mobile-open');
      mobileToggle.setAttribute('aria-expanded', String(open));
      mobileToggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    });
  }

  if(overlay){
    overlay.addEventListener('click', ()=>{
      shell.classList.remove('mobile-open');
      if (mobileToggle) {
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.setAttribute('aria-label', 'Open navigation menu');
      }
    });
  }

  document.querySelectorAll('[data-expand]').forEach((el)=>{
    el.addEventListener('click', ()=>{
      const block = el.closest('.menu-block');
      block?.classList.toggle('open');
      el.setAttribute('aria-expanded', String(block?.classList.contains('open')));
    });
  });

  document.querySelectorAll('.sidebar a').forEach((link)=>{
    link.addEventListener('click', ()=>{
      shell.classList.remove('mobile-open');
      if (mobileToggle) {
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.setAttribute('aria-label', 'Open navigation menu');
      }
    });
  });
}
`
