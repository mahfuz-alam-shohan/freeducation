export const styles = `
:root { color-scheme: light; --bg:#f7f7f8; --surface:#fff; --line:#e7e7ea; --text:#202226; --muted:#6f7682; --accent:#3c6df0; }
*{box-sizing:border-box} body{margin:0;background:var(--bg);font-family:Inter,system-ui,sans-serif;color:var(--text)}
.app{display:grid;grid-template-columns:220px 1fr;min-height:100vh}.sidebar{background:#fff;border-right:1px solid var(--line);padding:18px 12px}
.logo{font-weight:700;font-size:15px;margin-bottom:16px}.menu a{display:block;padding:9px 10px;border-radius:8px;text-decoration:none;color:var(--text);margin-bottom:4px}
.menu a.active,.menu a:hover{background:#eef2ff;color:#1f3f9c}.main{padding:16px}.card{background:var(--surface);border:1px solid var(--line);border-radius:10px;padding:14px}
.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.kpi{font-size:28px;font-weight:700}.muted{color:var(--muted);font-size:13px}
.table{width:100%;border-collapse:collapse}.table th,.table td{font-size:13px;padding:9px;border-bottom:1px solid var(--line);text-align:left}
.center-wrap{min-height:100vh;display:grid;place-items:center;padding:16px}.panel{width:min(520px,100%);background:#fff;border:1px solid var(--line);border-radius:10px;padding:16px}
label{font-size:13px;display:block;margin-bottom:6px;color:#3d4552}input{width:100%;padding:9px 10px;border:1px solid #d4d8df;border-radius:8px;background:#fff;margin-bottom:10px}
button{width:100%;padding:10px;border:none;background:var(--accent);color:#fff;border-radius:8px;font-weight:600;cursor:pointer}.error{color:#b3261e;font-size:13px;margin:0 0 8px}
.topbar{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}.badge{font-size:12px;background:#edf2ff;color:#2a4ab3;padding:5px 8px;border-radius:999px}
@media (max-width:900px){.app{grid-template-columns:1fr}.sidebar{display:flex;gap:8px;align-items:center}.menu{display:flex;gap:4px}.grid{grid-template-columns:1fr}}
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
