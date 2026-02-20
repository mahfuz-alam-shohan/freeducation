export const styles = `
:root { color-scheme: light; --bg:#f4f5f7; --surface:#fff; --line:#e3e5ea; --text:#202226; --muted:#6f7682; --accent:#3c6df0; }
*{box-sizing:border-box}
body{margin:0;background:var(--bg);font-family:Inter,system-ui,sans-serif;color:var(--text)}

.app-shell{display:grid;grid-template-columns:230px 1fr;min-height:100vh}
.sidebar{background:var(--surface);border-right:1px solid var(--line);padding:14px 10px}
.logo{font-weight:700;font-size:15px;margin-bottom:14px}
.nav-caption{margin:0 8px 8px;font-size:12px}
.menu a{display:block;padding:8px 10px;border-radius:8px;text-decoration:none;color:var(--text);margin-bottom:4px;font-size:14px}
.menu a.active,.menu a:hover{background:#eef2ff;color:#1f3f9c}

.main{padding:14px}
.topbar{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:10px;background:var(--surface);border:1px solid var(--line);border-radius:10px;padding:12px}
.page-title{margin:0 0 2px;font-size:18px}
.account-card{display:flex;align-items:center;gap:9px;border:1px solid var(--line);padding:7px 9px;border-radius:9px;min-width:220px}
.avatar{width:30px;height:30px;border-radius:50%;background:#edf2ff;color:#2a4ab3;display:grid;place-items:center;font-size:12px;font-weight:700}
.account-name{margin:0;font-weight:600;font-size:13px}
.account-email{margin:0;color:var(--muted);font-size:12px}
.mobile-menu{display:none}

.card{background:var(--surface);border:1px solid var(--line);border-radius:10px;padding:12px}
.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
.kpi{font-size:28px;font-weight:700;line-height:1.2}
.muted{color:var(--muted);font-size:13px}

.table-card{padding:0;overflow:hidden}
.table{width:100%;border-collapse:collapse}
.table th,.table td{font-size:13px;padding:10px 12px;border-bottom:1px solid var(--line);text-align:left;white-space:nowrap}
.table td{white-space:normal}

.center-wrap{min-height:100vh;display:grid;place-items:center;padding:16px}
.panel{width:min(520px,100%);background:var(--surface);border:1px solid var(--line);border-radius:10px;padding:16px}
label{font-size:13px;display:block;margin-bottom:6px;color:#3d4552}
input{width:100%;padding:9px 10px;border:1px solid #d4d8df;border-radius:8px;background:#fff;margin-bottom:10px}
button{width:100%;padding:10px;border:none;background:var(--accent);color:#fff;border-radius:8px;font-weight:600;cursor:pointer}
.error{color:#b3261e;font-size:13px;margin:0 0 8px}

@media (max-width:900px){
  .app-shell{grid-template-columns:1fr}
  .sidebar{display:none}
  .main{padding:10px}
  .topbar{display:block;padding:10px}
  .page-title{font-size:16px}
  .account-card{margin-top:8px;width:100%;min-width:0}
  .mobile-menu{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:10px}
  .mobile-menu a{text-decoration:none;color:var(--text);background:var(--surface);border:1px solid var(--line);padding:8px 6px;border-radius:8px;text-align:center;font-size:13px}
  .mobile-menu a.active{background:#eef2ff;color:#1f3f9c}
  .grid{grid-template-columns:1fr}
  .table-card{overflow:auto}
  .table{min-width:620px}
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
