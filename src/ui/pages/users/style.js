export const USERS_STYLE = `
.users-card{background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:8px;display:grid;gap:8px;animation:section-in .28s ease both}
.users-layout{overflow:hidden}
.users-toolbar{display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap}
.users-toolbar h2{margin:0;font-size:1rem}
.users-primary,.users-form button{height:34px;font-size:.9rem;border-radius:8px;padding:0 10px;cursor:pointer;font-weight:600}
.users-primary{border:1px solid var(--border);background:var(--accent);color:var(--accent-ink);transition:filter .2s ease}
.users-primary:hover{filter:brightness(1.03)}
.users-toggle{display:inline-flex;align-items:center;justify-content:center;gap:6px;min-width:96px}
.users-toggle-label{line-height:1;transition:opacity .18s ease}
.users-toggle-icon{position:relative;display:inline-block;width:12px;height:12px;opacity:0;transform:scale(.8);transition:opacity .2s ease,transform .2s ease}
.users-toggle-icon::before,.users-toggle-icon::after{content:'';position:absolute;left:50%;top:50%;width:12px;height:2px;background:var(--accent-ink);border-radius:99px;transform:translate(-50%,-50%) rotate(0deg);transition:transform .2s ease}
.users-toggle-icon::after{transform:translate(-50%,-50%) rotate(90deg)}
.users-toggle.is-open{width:34px;min-width:34px;padding:0;gap:0}
.users-toggle.is-open .users-toggle-label{opacity:0;width:0;overflow:hidden}
.users-toggle.is-open .users-toggle-icon{opacity:1;transform:scale(1)}
.users-toggle.is-open .users-toggle-icon::before{transform:translate(-50%,-50%) rotate(45deg)}
.users-toggle.is-open .users-toggle-icon::after{transform:translate(-50%,-50%) rotate(-45deg)}
.users-panel{display:grid;gap:8px;border:1px solid var(--border);border-radius:8px;padding:0 8px;max-height:0;opacity:0;overflow:hidden;transition:max-height .28s ease,opacity .2s ease,padding .2s ease}
.users-panel.is-open{max-height:340px;opacity:1;padding:8px}
.users-panel-title{margin:0;font-size:.95rem}
.users-search-wrap{display:grid;gap:4px}
.users-search-label{font-size:.83rem;color:var(--text-muted)}
.users-search{height:36px;font-size:.95rem;background:var(--surface-soft);border:1px solid var(--border);color:var(--text);border-radius:8px;padding:0 10px;transition:border-color .2s ease,box-shadow .2s ease}
.users-search:focus{border-color:var(--accent);box-shadow:0 0 0 2px color-mix(in srgb,var(--accent) 20%,transparent)}
.users-table-wrap{overflow:auto;border:1px solid var(--border);border-radius:8px;scroll-behavior:smooth}
.users-table{width:100%;border-collapse:collapse;min-width:640px;font-size:.89rem;table-layout:fixed}
.users-table th,.users-table td{padding:8px;border-bottom:1px solid var(--border);text-align:left;vertical-align:top;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:1.3}
.users-table th{color:var(--text-muted);font-weight:600;background:var(--surface-strong);position:sticky;top:0}
.users-form{display:grid;gap:8px;max-width:500px;position:relative}
.users-form.is-submitting::after{content:'';position:absolute;inset:0;border-radius:8px;background:linear-gradient(90deg,transparent,color-mix(in srgb,var(--accent) 22%,transparent),transparent);animation:user-submit-pulse 1.1s linear infinite;pointer-events:none}
.users-form label{display:grid;gap:4px;color:var(--text-muted);font-size:.85rem}
.users-form input{height:36px;font-size:16px;background:var(--surface-soft);border:1px solid var(--border);color:var(--text);border-radius:8px;padding:0 10px;transition:border-color .2s ease,box-shadow .2s ease}
.users-form button{border:1px solid var(--border);background:var(--accent);color:var(--accent-ink);transition:filter .2s ease}
.users-form button:hover{filter:brightness(1.03)}
.users-form input:focus-visible,.users-form button:focus-visible,.users-primary:focus-visible,.users-search:focus-visible{outline:2px solid var(--accent);outline-offset:1px}
.users-msg{margin:0;color:var(--text-muted);min-height:20px;font-size:.82rem}
@media (max-width:700px){.users-card{padding:8px}.users-panel.is-open{max-height:420px}.users-table{min-width:560px}}
@keyframes section-in{from{opacity:0}to{opacity:1}}
@keyframes user-submit-pulse{0%{transform:translateX(-80%)}100%{transform:translateX(90%)}}
`;
