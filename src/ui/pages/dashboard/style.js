export const DASHBOARD_STYLE = `
.dash-grid{display:grid;gap:10px;grid-template-columns:1fr}
.dash-card{background:#121b2d;border:1px solid #24344f;border-radius:12px;padding:11px;display:grid;gap:6px;min-height:100px;animation:section-in .45s ease both}
.dash-card:nth-child(2){animation-delay:.09s}
.dash-label{color:#a8b5ca;font-size:.8rem;text-transform:uppercase;letter-spacing:.03em}
.dash-kpi{font-size:clamp(1.65rem,5vw,2.2rem);font-weight:700;line-height:1.2}
@keyframes section-in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@media (min-width:700px){.dash-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
`;
