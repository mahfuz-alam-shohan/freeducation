export const SETUP_STYLE = `
:root{color-scheme:dark}
*{box-sizing:border-box}
body{margin:0;background:#0a1221;color:#e9eef8;font:14px/1.45 Inter,system-ui,sans-serif}
.setup-page{min-height:100vh;display:grid;grid-template-rows:auto 1fr auto;gap:8px;padding:10px}
.auth-header{display:grid;gap:4px}
.auth-header h1{margin:0;font-size:20px;line-height:1.3}
.auth-muted,.setup-muted{margin:0;color:#a8b5ca}
.setup-card{background:#101b30;border:1px solid #24344f;border-radius:10px;padding:10px;max-width:460px;width:100%;display:grid;align-self:start}
.setup-form{display:grid;gap:8px}
.setup-form label{display:grid;gap:4px;color:#b2bfd3;font-size:12px}
.setup-form input{height:35px;background:#0d1628;border:1px solid #253650;color:#e9eef8;border-radius:8px;padding:0 10px}
.setup-form button{height:35px;border:0;border-radius:8px;background:#69abff;color:#041427;padding:0 10px;font-weight:600;cursor:pointer}
.setup-form button:hover{filter:brightness(1.03)}
.auth-footer{color:#8f9fb8;font-size:12px;padding:0 1px}
.setup-form input:focus-visible,.setup-form button:focus-visible{outline:2px solid #69abff;outline-offset:1px}
@media (min-width:720px){
  .setup-page{justify-content:center;align-content:center;padding:14px}
  .auth-header,.auth-footer{max-width:460px}
}
`;
