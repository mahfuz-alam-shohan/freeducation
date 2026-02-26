export const DASHBOARD_STYLE = `
.dash-grid{display:grid;gap:10px;grid-template-columns:1fr}
.dash-card{background:#121b2d;border:1px solid #24344f;border-radius:12px;padding:12px}
.dash-label{color:#a8b5ca}
.dash-kpi{font-size:24px;font-weight:700;line-height:1.2}
@media (min-width:700px){.dash-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
`;
