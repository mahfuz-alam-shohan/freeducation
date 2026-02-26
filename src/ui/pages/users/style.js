export const USERS_STYLE = `
.users-card{background:#121b2d;border:1px solid #24344f;border-radius:10px;padding:9px;display:grid;gap:8px;animation:section-in .44s ease both}
.users-card.users-stack{animation-delay:.08s}
.users-head{display:grid;gap:2px}
.users-card h2{margin:0;font-size:1rem}
.users-table-wrap{overflow:auto;border:1px solid #1e2f4a;border-radius:8px}
.users-table{width:100%;border-collapse:collapse;min-width:500px;font-size:.9rem}
.users-table th,.users-table td{padding:8px;border-bottom:1px solid #24344f;text-align:left;vertical-align:top}
.users-table th{color:#a8b5ca;font-weight:600;background:#101a2c;position:sticky;top:0}
.users-form{display:grid;gap:8px;max-width:420px}
.users-form label{display:grid;gap:4px;color:#a8b5ca;font-size:.85rem}
.users-form input{height:40px;font-size:16px;background:#0d1628;border:1px solid #253650;color:#e9eef8;border-radius:8px;padding:0 11px}
.users-form button{height:40px;font-size:1rem;border:0;border-radius:8px;background:#69abff;color:#041427;padding:0 10px;font-weight:600;cursor:pointer}
.users-form button:hover{filter:brightness(1.03)}
.users-form input:focus-visible,.users-form button:focus-visible{outline:2px solid #69abff;outline-offset:1px}
.users-muted{margin:0;color:#a8b5ca;font-size:.82rem}
.users-msg{margin:0;color:#a8b5ca;min-height:20px;font-size:.82rem}
@keyframes section-in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
`;
