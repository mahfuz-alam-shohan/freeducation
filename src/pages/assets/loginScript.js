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
