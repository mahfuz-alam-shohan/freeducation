export const DASHBOARD_SCRIPT = `
fetch('/api/admin/overview').then(r=>r.json()).then(d=>{totalAdmins.textContent=d.totalAdmins;activeSessions.textContent=d.activeSessions;});
document.getElementById('logout').onclick=async()=>{await fetch('/api/logout',{method:'POST'});location.href='/admin/login';};
`;
