export const DASHBOARD_STYLE = `
.dash-grid{display:grid;gap:8px;grid-template-columns:1fr}
.dash-card{background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:9px;display:grid;gap:4px;min-height:90px;animation:panel-in .28s ease both}
.dash-card:nth-child(2){animation-delay:.04s}
.dash-label{color:var(--text-muted);font-size:.8rem;text-transform:uppercase;letter-spacing:.06em}
.dash-kpi{font-size:clamp(1.5rem,5vw,2.05rem);font-weight:700;line-height:1.2;color:var(--text)}
@keyframes panel-in{from{opacity:0}to{opacity:1}}
@media (min-width:700px){.dash-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
`;
