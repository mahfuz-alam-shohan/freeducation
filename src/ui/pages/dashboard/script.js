export const DASHBOARD_SCRIPT = `
totalAdmins.textContent='...';
activeSessions.textContent='...';

fetch('/api/admin/overview')
  .then(r=>r.json())
  .then(d=>{
    totalAdmins.textContent=d.totalAdmins;
    activeSessions.textContent=d.activeSessions;
  })
  .catch(()=>{
    totalAdmins.textContent='-';
    activeSessions.textContent='-';
  });

document.getElementById('logout').onclick=async()=>{
  document.body.classList.add('app-navigating');
  await fetch('/api/logout',{method:'POST'});
  location.href='/admin/login';
};
`;
