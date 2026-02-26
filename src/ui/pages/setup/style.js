export const SETUP_STYLE = `
*{box-sizing:border-box}
body{margin:0;background:#0a1221;color:#e9eef8;font:14px/1.45 Inter,system-ui,sans-serif}
.setup-page{min-height:100vh;display:grid;place-items:start center;padding:24px 12px}
.setup-shell{width:100%}
.setup-card{width:min(460px,100%);background:#101b30;border:1px solid #24344f;border-radius:12px;padding:14px;display:grid;gap:10px}
.setup-card h1{margin:0;font-size:20px}
.setup-muted{margin:0;color:#a8b5ca}
.setup-form{display:grid;gap:8px}
.setup-form label{display:grid;gap:4px;color:#a8b5ca;font-size:12px}
.setup-form input{background:#0d1628;border:1px solid #253650;color:#e9eef8;border-radius:8px;padding:8px}
.setup-form button{border:0;border-radius:8px;background:#69abff;color:#041427;padding:8px 10px;font-weight:600;cursor:pointer}
.setup-form button:hover{filter:brightness(1.03)}
.setup-form input:focus-visible,.setup-form button:focus-visible{outline:2px solid #69abff;outline-offset:1px}
@media (min-width:900px){.setup-page{place-items:center}}
`;
