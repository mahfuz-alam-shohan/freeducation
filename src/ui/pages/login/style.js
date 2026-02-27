export const LOGIN_STYLE = `
.login-page{display:grid;gap:8px;width:min(100%,560px);margin:0 auto}
.auth-header{display:grid;gap:4px;animation:section-in .36s ease both}
.icon-row{display:flex;gap:6px}
.icon-chip{width:30px;height:30px;border:1px solid var(--border);border-radius:8px;display:grid;place-items:center;background:var(--surface-soft);color:var(--text-muted)}
.icon-chip svg{width:16px;height:16px}
.auth-quote{margin:0;font-size:clamp(1rem,2.4vw,1.14rem);line-height:1.35;max-width:48ch}
.auth-muted,.login-muted{margin:0;color:var(--text-muted);font-size:.85rem}
.shape-stage{position:relative;height:54px;overflow:hidden;border:1px solid var(--border);border-radius:8px;background:linear-gradient(90deg,var(--surface-soft),var(--surface));animation:section-in .42s ease both}
.shape{position:absolute;display:block;opacity:.45}
.shape-circle{width:20px;height:20px;border-radius:50%;background:var(--accent);left:8%;top:17px;animation:float-x 8s linear infinite}
.shape-diamond{width:14px;height:14px;border:2px solid var(--text-muted);transform:rotate(45deg);left:50%;top:18px;animation:float-y 5s ease-in-out infinite}
.shape-ring{width:24px;height:24px;border:2px solid var(--border);border-radius:50%;right:12%;top:15px;animation:pulse-ring 4.6s ease-in-out infinite}
.login-card{background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:8px;width:100%;display:grid;gap:8px;align-self:start;animation:section-in .46s ease both}
.login-card h2{margin:0;font-size:1rem;font-weight:650}
.login-form{display:grid;gap:8px}
.login-form label{display:grid;gap:4px;color:var(--text-muted);font-size:.85rem}
.login-form input{height:38px;font-size:16px;background:var(--surface-soft);border:1px solid var(--border);color:var(--text);border-radius:8px;padding:0 10px}
.login-form button{height:38px;font-size:.95rem;border:1px solid var(--border);border-radius:8px;background:linear-gradient(90deg,var(--surface-soft),var(--surface));color:var(--text);padding:0 10px;font-weight:600;cursor:pointer}
.login-form button:hover{background:linear-gradient(90deg,var(--surface),var(--surface-soft))}
.login-form input:focus-visible,.login-form button:focus-visible{outline:2px solid var(--accent);outline-offset:1px}
@keyframes float-x{0%{transform:translateX(0)}50%{transform:translateX(16px)}100%{transform:translateX(0)}}
@keyframes float-y{0%,100%{transform:translateY(0) rotate(45deg)}50%{transform:translateY(-8px) rotate(45deg)}}
@keyframes pulse-ring{0%,100%{transform:scale(1);opacity:.35}50%{transform:scale(1.18);opacity:.55}}
`;
