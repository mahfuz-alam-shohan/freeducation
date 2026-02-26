export const LOGIN_STYLE = `
:root{color-scheme:dark}
*{box-sizing:border-box}
body{margin:0;background:#0a1221;color:#e9eef8;font:14px/1.45 Inter,system-ui,sans-serif}
.login-page{min-height:100vh;display:grid;grid-template-rows:auto 1fr auto;gap:10px;padding:12px}
.auth-header{display:grid;gap:4px}
.auth-header h1{margin:0;font-size:20px;line-height:1.3}
.auth-muted,.login-muted{margin:0;color:#a8b5ca}
.login-card{background:#101b30;border:1px solid #24344f;border-radius:12px;padding:12px;max-width:420px;width:100%;display:grid;align-self:start}
.login-form{display:grid;gap:9px}
.login-form label{display:grid;gap:4px;color:#b2bfd3;font-size:12px}
.login-form input{height:36px;background:#0d1628;border:1px solid #253650;color:#e9eef8;border-radius:8px;padding:0 10px}
.login-form button{height:36px;border:0;border-radius:8px;background:#69abff;color:#041427;padding:0 10px;font-weight:600;cursor:pointer}
.login-form button:hover{filter:brightness(1.03)}
.auth-footer{color:#8f9fb8;font-size:12px;padding:0 2px}
.login-form input:focus-visible,.login-form button:focus-visible{outline:2px solid #69abff;outline-offset:1px}
@media (min-width:720px){
  .login-page{justify-content:center;align-content:center;padding:20px}
  .auth-header,.auth-footer{max-width:420px}
}
`;
