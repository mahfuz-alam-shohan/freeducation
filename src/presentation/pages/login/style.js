export const LOGIN_STYLE = `
.login-page{display:grid;gap:var(--space-2)}
.auth-header{display:grid;gap:4px;animation:section-in .35s ease both}
.auth-kicker{margin:0;color:var(--accent);font-size:.8rem;letter-spacing:.04em;text-transform:uppercase}
.auth-header h1{margin:0;font-size:clamp(1.05rem,2.7vw,1.4rem);line-height:1.28;font-weight:700}
.auth-muted,.login-muted{margin:0;color:var(--text-muted);font-size:.85rem}
.motion-band{height:6px;border-radius:999px;border:1px solid var(--border);overflow:hidden;background:var(--surface-soft);animation:section-in .45s ease both}
.motion-band span{display:block;height:100%;width:42%;background:linear-gradient(90deg,var(--accent),color-mix(in srgb,var(--accent) 55%,transparent));animation:slide-band 2.6s ease-in-out infinite}
.login-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm);padding:var(--space-2);width:100%;display:grid;gap:var(--space-2);align-self:start;animation:section-in .5s ease both}
.login-card h2{margin:0;font-size:1rem;font-weight:650}
.login-form{display:grid;gap:var(--space-2)}
.login-form label{display:grid;gap:4px;color:var(--text-muted);font-size:.85rem}
.login-form input{height:38px;font-size:16px;background:var(--surface-soft);border:1px solid var(--border);color:var(--text);border-radius:8px;padding:0 10px;transition:border-color .2s ease,background .2s ease,transform .2s ease}
.login-form input:hover{border-color:color-mix(in srgb,var(--accent) 38%,var(--border));background:color-mix(in srgb,var(--surface-soft) 75%,var(--surface))}
.login-form button{height:38px;font-size:.95rem;border:1px solid var(--border);border-radius:8px;background:linear-gradient(90deg,color-mix(in srgb,var(--accent) 20%,var(--surface-soft)),var(--surface));color:var(--text);padding:0 10px;font-weight:600;cursor:pointer;transition:transform .2s ease,background .2s ease,border-color .2s ease}
.login-form button:hover{transform:translateY(-1px);border-color:color-mix(in srgb,var(--accent) 45%,var(--border));background:linear-gradient(90deg,color-mix(in srgb,var(--accent) 28%,var(--surface-soft)),var(--surface))}
.login-form input:focus-visible,.login-form button:focus-visible{outline:2px solid var(--accent);outline-offset:1px}
@keyframes slide-band{0%{transform:translateX(-115%)}55%{transform:translateX(165%)}100%{transform:translateX(165%)}}
`;
