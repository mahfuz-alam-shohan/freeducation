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
