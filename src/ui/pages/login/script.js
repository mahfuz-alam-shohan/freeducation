export const LOGIN_SCRIPT = `
loginForm.addEventListener('submit',async(e)=>{
  e.preventDefault();
  loginMsg.textContent='';
  const submitBtn=loginForm.querySelector('button[type="submit"],button:not([type])');
  if(submitBtn){submitBtn.disabled=true;submitBtn.textContent='Opening account...';}
  try{
    const payload=Object.fromEntries(new FormData(loginForm));
    const r=await fetch('/api/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)});
    const j=await r.json();
    if(!r.ok){loginMsg.textContent=j.error||'Login request failed';return;}
    loginMsg.textContent='Classroom access confirmed. Redirecting...';
    const redirectTo=typeof j.redirectTo==='string'&&j.redirectTo?j.redirectTo:'/admin/dashboard';
    setTimeout(()=>{ if (window.__appNavigate) { window.__appNavigate(redirectTo); } else { location.href=redirectTo; } },240);
  }finally{
    if(submitBtn){submitBtn.disabled=false;submitBtn.textContent='Open account';}
  }
});
`;
