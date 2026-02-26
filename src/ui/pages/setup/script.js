export const SETUP_SCRIPT = `
setupForm.addEventListener('submit',async(e)=>{
  e.preventDefault();
  setupMsg.textContent='';
  const payload=Object.fromEntries(new FormData(setupForm));
  const r=await fetch('/api/setup',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)});
  const j=await r.json();
  if(!r.ok){
    const detail=j.detail?`\nDetails: \${j.detail}`:'';
    const code=j.code?` [\${j.code}]`:'';
    setupMsg.textContent=`\${j.error||'Request failed'}\${code}\${detail}`;
    return;
  }
  setupMsg.textContent='Administrator created. Redirecting to login...';
  setTimeout(()=>location.href='/admin/login',600);
});
`;
