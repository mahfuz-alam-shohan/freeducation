export const SETUP_STYLE = `
:root{color-scheme:dark}
*{box-sizing:border-box}
body{margin:0;background:#0a1221;color:#e9eef8;font:16px/1.5 Inter,system-ui,sans-serif}
.setup-page{min-height:100vh;display:grid;grid-template-rows:auto 1fr auto;gap:8px;padding:8px 8px max(8px,env(safe-area-inset-bottom))}
.auth-header{display:grid;gap:4px;animation:section-in .36s ease both}
.auth-header h1{margin:0;font-size:clamp(1.4rem,4vw,1.7rem);line-height:1.25}
.auth-muted,.setup-muted{margin:0;color:#a8b5ca}
.setup-card{background:#101b30;border:1px solid #24344f;border-radius:8px;padding:10px;max-width:none;width:100%;display:grid;align-self:start;animation:section-in .46s ease both}
.setup-form{display:grid;gap:10px}
.setup-form label{display:grid;gap:4px;color:#b2bfd3;font-size:.85rem}
.setup-form input{height:40px;font-size:16px;background:#0d1628;border:1px solid #253650;color:#e9eef8;border-radius:8px;padding:0 11px}
.setup-form button{height:40px;font-size:1rem;border:0;border-radius:8px;background:#69abff;color:#041427;padding:0 10px;font-weight:600;cursor:pointer}
.setup-form button:hover{filter:brightness(1.03)}
.auth-footer{color:#8f9fb8;font-size:.82rem;padding:0 1px;animation:section-in .56s ease both}
.setup-form input:focus-visible,.setup-form button:focus-visible{outline:2px solid #69abff;outline-offset:1px}
@keyframes section-in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@media (min-width:720px){
  .setup-page{padding:10px}
}
`;
