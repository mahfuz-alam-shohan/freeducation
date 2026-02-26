export const DASHBOARD_STYLE = `
.page-dashboard{background:#0b1220;color:#e9eef8;font:14px/1.45 Inter,system-ui,sans-serif}
.page-dashboard *{box-sizing:border-box}
.admin-shell{min-height:100vh;display:grid;grid-template-columns:1fr}
.admin-sidebar{background:#0f1728;border-bottom:1px solid #24344f;padding:10px;display:grid;gap:8px}
.admin-brand{font-weight:700}
.admin-nav{display:flex;gap:6px;flex-wrap:wrap}
.admin-nav a{padding:7px 9px;border-radius:8px;color:#a8b5ca;text-decoration:none}
.admin-nav a.active,.admin-nav a:hover{background:#172741;color:#e9eef8}
.admin-main{display:grid;grid-template-rows:auto 1fr auto}
.admin-header,.admin-footer{padding:10px;border-bottom:1px solid #24344f}.admin-footer{border-top:1px solid #24344f;border-bottom:0;color:#a8b5ca}
.admin-content{padding:10px;display:grid;gap:10px}
.admin-logout{float:right;border:0;border-radius:8px;background:#1c2941;color:#e9eef8;padding:7px 9px;cursor:pointer}
.dash-grid{display:grid;gap:10px;grid-template-columns:1fr}
.dash-card{background:#121b2d;border:1px solid #24344f;border-radius:12px;padding:12px}
.dash-label{color:#a8b5ca}
.dash-kpi{font-size:24px;font-weight:700}
@media (min-width:900px){.admin-shell{grid-template-columns:220px 1fr}.admin-sidebar{border-right:1px solid #24344f;border-bottom:0;align-content:start}.admin-nav{display:grid;gap:4px}}
`;
