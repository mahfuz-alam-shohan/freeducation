export const styles = `
:root {
  color-scheme: light;
  --bg: #f8fafc;
  --surface: #ffffff;
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
  background: var(--bg);
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
  background: var(--surface);
  border-right: 1px solid var(--line);
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
}
.brand {
  font-size: 20px;
  font-weight: 700;
  font-family: "Georgia", "Times New Roman", serif;
  letter-spacing: 0.01em;
  color: #0f172a;
  white-space: nowrap;
  text-transform: lowercase;
}
.sidebar-toggle {
  border: 1px solid var(--line);
  background: var(--surface);
  width: 32px;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
}

.sidebar-scroll {
  overflow: auto;
  padding: 12px 10px;
  min-height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.sidebar-nav {
  display: grid;
  gap: 6px;
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
  padding: 7px 12px;
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
.menu-item:hover,
.menu-expand:hover,
.submenu-item:hover { background: #f1f5f9; }
.menu-item.active,
.submenu-item.active { background: #e2e8f0; color: #0f172a; font-weight: 600; }
.logout-item {
  margin-top: auto;
  border: 1px solid #fecaca;
  color: #991b1b;
  background: #fff5f5;
}
.logout-item:hover { background: #fee2e2; }
.icon {
  width: 18px;
  height: 18px;
  flex: none;
  display: inline-grid;
  place-items: center;
  color: #64748b;
}
.menu-item.active .icon,
.submenu-item.active .icon { color: #4f46e5; }
.label { overflow: hidden; white-space: nowrap; }
.chevron { font-size: 12px; color: var(--muted); transition: transform 150ms ease; }

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
  background: rgba(248, 250, 252, 0.94);
  backdrop-filter: blur(8px);
}
.topbar-left,
.topbar-right { display: flex; align-items: center; gap: 12px; }
.login-note { color: #475569; }
.login-name { color: #0f172a; font-weight: 700; }
.icon-btn {
  border: 1px solid var(--line);
  background: var(--surface);
  border-radius: 10px;
  width: 36px;
  height: 36px;
  cursor: pointer;
}
.search-wrap {
  min-width: min(520px, 55vw);
  position: relative;
}
.search-wrap input {
  width: 100%;
  height: 38px;
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 0 12px 0 38px;
  background: var(--surface);
  font-size: 14px;
}
.search-wrap .icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
}
.workspace-pill {
  border: 1px solid var(--line);
  background: var(--surface);
  border-radius: 999px;
  padding: 7px 12px;
  font-size: 13px;
}
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
  padding: 24px;
}
.page-head { margin-bottom: 24px; }
.page-title { margin: 0; font-size: 28px; line-height: 1.2; letter-spacing: -0.03em; }
.page-subtitle { margin: 8px 0 0; color: var(--muted); font-size: 14px; }

.grid { display: grid; gap: 16px; }
.grid-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.grid-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }

.card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-soft);
  padding: 24px;
}
.card-title { margin: 0 0 6px; font-size: 16px; }
.muted { margin: 0; font-size: 13px; color: var(--muted); line-height: 1.5; }
.kpi { margin-top: 16px; font-size: 34px; font-weight: 700; letter-spacing: -0.03em; }

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
  padding: 12px 16px;
  border-bottom: 1px solid var(--line);
  text-align: left;
}
.table tbody td {
  padding: 14px 16px;
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
  .grid-4 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .search-wrap { min-width: min(360px, 50vw); }
}

@media (max-width: 840px) {
  .app-shell,
  .app-shell.collapsed { grid-template-columns: 1fr; }
  .sidebar {
    transform: translateX(-100%);
    transition: transform 170ms ease;
    width: min(84vw, 310px);
  }
  .app-shell.mobile-open .sidebar { transform: translateX(0); }
  .main-shell { grid-column: 1; }
  .container { padding: 16px; }
  .topbar { padding: 0 16px; }
  .search-wrap { min-width: auto; width: 100%; }
  .desktop-only { display: none !important; }
  .mobile-only { display: inline-flex; }
  .topbar-left { flex: 1; }
  .grid-4,
  .grid-2 { grid-template-columns: 1fr; }
  .card { padding: 16px; border-radius: 14px; }
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
const sidebarToggle = document.querySelector('[data-sidebar-toggle]');
const mobileToggle = document.querySelector('[data-mobile-toggle]');
const overlay = document.querySelector('[data-overlay]');
if(sidebarToggle){
  sidebarToggle.addEventListener('click', ()=> shell.classList.toggle('collapsed'));
}
if(mobileToggle){
  mobileToggle.addEventListener('click', ()=> shell.classList.toggle('mobile-open'));
}
if(overlay){
  overlay.addEventListener('click', ()=> shell.classList.remove('mobile-open'));
}

`;
