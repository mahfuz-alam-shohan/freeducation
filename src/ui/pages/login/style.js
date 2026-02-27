export const LOGIN_STYLE = `
.login-page{display:grid;gap:8px;width:min(100%,560px);margin:0 auto}
.auth-header{display:grid;gap:4px;animation:section-in .36s ease both}
.auth-header h1{margin:0;font-size:clamp(1.35rem,3vw,1.6rem);line-height:1.2}
.auth-muted,.login-muted{margin:0;color:var(--text-muted)}
.learning-strip{display:flex;flex-wrap:wrap;gap:6px;animation:section-in .4s ease both}
.learning-strip span{border:1px dashed var(--border);border-radius:999px;padding:2px 8px;font-size:.8rem;color:var(--text-muted);background:var(--surface-soft)}
.login-card{background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:8px;width:100%;display:grid;gap:8px;align-self:start;animation:section-in .46s ease both}
.login-card h2{margin:0;font-size:1rem;font-weight:650}
.login-form{display:grid;gap:8px}
.login-form label{display:grid;gap:4px;color:var(--text-muted);font-size:.85rem}
.login-form input{height:38px;font-size:16px;background:var(--surface-soft);border:1px solid var(--border);color:var(--text);border-radius:8px;padding:0 10px}
.login-form button{height:38px;font-size:.95rem;border:1px solid var(--border);border-radius:8px;background:linear-gradient(90deg,var(--surface-soft),var(--surface));color:var(--text);padding:0 10px;font-weight:600;cursor:pointer}
.login-form button:hover{background:linear-gradient(90deg,var(--surface),var(--surface-soft))}
.auth-footer{color:var(--text-muted);font-size:.82rem;padding:0 1px;animation:section-in .56s ease both}
.login-form input:focus-visible,.login-form button:focus-visible{outline:2px solid var(--accent);outline-offset:1px}
`;
