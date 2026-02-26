export const USERS_STYLE = `
.users-card{background:#121b2d;border:1px solid #24344f;border-radius:10px;padding:10px;display:grid;gap:10px;animation:section-in .44s ease both}
.users-layout{overflow:hidden}
.users-toolbar{display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap}
.users-toolbar h2{margin:0;font-size:1rem}
.users-primary,.users-ghost,.users-form button{height:38px;font-size:.93rem;border-radius:8px;padding:0 12px;cursor:pointer;font-weight:600}
.users-primary{border:0;background:#69abff;color:#041427;transition:transform .2s ease,filter .2s ease}
.users-primary:hover{filter:brightness(1.04);transform:translateY(-1px)}
.users-ghost{border:1px solid #2a3f5f;background:#111b2c;color:#d8e2f2;transition:background .2s ease,border-color .2s ease}
.users-ghost:hover{background:#152339;border-color:#365276}
.users-panel{display:grid;gap:8px;border:1px solid #1f324d;border-radius:8px;padding:0 8px;max-height:0;opacity:0;transform:translateY(-8px);overflow:hidden;transition:max-height .3s ease,opacity .25s ease,transform .25s ease,padding .25s ease}
.users-panel.is-open{max-height:340px;opacity:1;transform:translateY(0);padding:8px}
.users-panel-head{display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap}
.users-panel-head h3{margin:0;font-size:.95rem}
.users-search-wrap{display:grid;gap:4px}
.users-search-label{font-size:.83rem;color:#a8b5ca}
.users-search{height:38px;font-size:.95rem;background:#0d1628;border:1px solid #253650;color:#e9eef8;border-radius:8px;padding:0 10px;transition:border-color .25s ease,box-shadow .25s ease}
.users-search:focus{border-color:#69abff;box-shadow:0 0 0 2px rgba(105,171,255,.22)}
.users-table-wrap{overflow:auto;border:1px solid #1e2f4a;border-radius:8px;scroll-behavior:smooth}
.users-table{width:100%;border-collapse:collapse;min-width:640px;font-size:.89rem}
.users-table th,.users-table td{padding:8px;border-bottom:1px solid #24344f;text-align:left;vertical-align:top}
.users-table th{color:#a8b5ca;font-weight:600;background:#101a2c;position:sticky;top:0}
.users-form{display:grid;gap:8px;max-width:500px}
.users-form label{display:grid;gap:4px;color:#a8b5ca;font-size:.85rem}
.users-form input{height:38px;font-size:16px;background:#0d1628;border:1px solid #253650;color:#e9eef8;border-radius:8px;padding:0 10px;transition:border-color .25s ease,box-shadow .25s ease}
.users-form button{border:0;background:#69abff;color:#041427;transition:filter .2s ease}
.users-form button:hover{filter:brightness(1.03)}
.users-form input:focus-visible,.users-form button:focus-visible,.users-primary:focus-visible,.users-ghost:focus-visible,.users-search:focus-visible{outline:2px solid #69abff;outline-offset:1px}
.users-msg{margin:0;color:#a8b5ca;min-height:20px;font-size:.82rem}
@media (max-width:700px){.users-card{padding:8px}.users-panel.is-open{max-height:420px}.users-table{min-width:560px}}
@keyframes section-in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
`;
