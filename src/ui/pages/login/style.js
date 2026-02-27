export const LOGIN_STYLE = `
.login-page{display:grid;gap:8px;width:min(100%,540px);margin:0 auto}
.auth-header{display:grid;gap:4px;animation:section-in .36s ease both}
.auth-header h1{margin:0;font-size:clamp(1.35rem,3vw,1.6rem);line-height:1.2}
.auth-muted,.login-muted{margin:0;color:var(--text-muted)}
.login-card{background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:8px;width:100%;display:grid;gap:8px;align-self:start;animation:section-in .46s ease both}
.login-form{display:grid;gap:8px}
.login-form label{display:grid;gap:4px;color:var(--text-muted);font-size:.85rem}
.login-form input{height:38px;font-size:16px;background:var(--surface-soft);border:1px solid var(--border);color:var(--text);border-radius:8px;padding:0 10px}
.login-form button{height:38px;font-size:.95rem;border:1px solid var(--border);border-radius:8px;background:var(--surface-soft);color:var(--text);padding:0 10px;font-weight:600;cursor:pointer}
.login-form button:hover{background:var(--surface)}
.auth-footer{color:var(--text-muted);font-size:.82rem;padding:0 1px;animation:section-in .56s ease both}
.login-form input:focus-visible,.login-form button:focus-visible{outline:2px solid var(--accent);outline-offset:1px}
`;
