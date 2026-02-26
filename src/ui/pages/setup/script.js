export const SETUP_SCRIPT = `
(()=>{
  const setupForm=document.getElementById('setupForm');
  const setupMsg=document.getElementById('setupMsg');
  if(!setupForm||!setupMsg) return;

  setupForm.addEventListener('submit',async(e)=>{
    e.preventDefault();
    setupMsg.textContent='';

    const submitBtn=setupForm.querySelector('button[type="submit"],button:not([type])');
    if(submitBtn){submitBtn.disabled=true;submitBtn.textContent='Creating...';}

    try{
      const payload=Object.fromEntries(new FormData(setupForm));
      const r=await fetch('/api/setup',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)});

      let j={};
      try{
        j=await r.json();
      }catch{
        const raw=await r.text();
        j={error:raw||'Unexpected server response'};
      }

      if(!r.ok){
        const detail=j.detail?'\nDetails: '+j.detail:'';
        const code=j.code?' ['+j.code+']':'';
        setupMsg.textContent=(j.error||'Request failed')+code+detail;
        return;
      }

      setupMsg.textContent='Administrator created. Redirecting to login...';
      setTimeout(()=>{ if (window.__appNavigate) { window.__appNavigate('/admin/login'); } else { location.href='/admin/login'; } },600);
    }catch(error){
      setupMsg.textContent='Network or server error: '+(error?.message||'Unknown error');
    }finally{
      if(submitBtn){submitBtn.disabled=false;submitBtn.textContent='Create first admin';}
    }
  });
})();
`;
