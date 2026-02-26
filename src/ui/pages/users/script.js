export const USERS_SCRIPT = `
const renderUsers=()=>fetch('/api/admin/users').then(r=>r.json()).then(d=>rows.innerHTML=d.users.map(u=>'<tr><td>'+u.name+'</td><td>'+u.email+'</td><td>'+new Date(u.created_at).toLocaleString()+'</td></tr>').join(''));
renderUsers();
addUserForm.addEventListener('submit',async(e)=>{
  e.preventDefault();
  usersMsg.textContent='';
  const payload=Object.fromEntries(new FormData(addUserForm));
  const r=await fetch('/api/admin/users',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)});
  const j=await r.json();
  if(!r.ok){usersMsg.textContent=j.error||'Request failed';return;}
  usersMsg.textContent='Administrator added.';
  addUserForm.reset();
  renderUsers();
});
document.getElementById('logout').onclick=async()=>{await fetch('/api/logout',{method:'POST'});location.href='/admin/login';};
`;
