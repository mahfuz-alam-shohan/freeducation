export const LOGIN_SCRIPT = `
loginForm.addEventListener('submit',async(e)=>{
  e.preventDefault();
  loginMsg.textContent='';
  const submitBtn=loginForm.querySelector('button[type="submit"],button:not([type])');
  if(submitBtn){submitBtn.disabled=true;submitBtn.textContent='Signing in...';}
  try{
    const payload=Object.fromEntries(new FormData(loginForm));
    const r=await fetch('/api/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)});
    const j=await r.json();
    if(!r.ok){loginMsg.textContent=j.error||'Request failed';return;}
    loginMsg.textContent='Login successful. Redirecting...';
    setTimeout(()=>location.href='/admin/dashboard',240);
  }finally{
    if(submitBtn){submitBtn.disabled=false;submitBtn.textContent='Login';}
  }
});
`;
