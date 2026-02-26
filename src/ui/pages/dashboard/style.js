export const DASHBOARD_STYLE = `
.dash-grid{--dash-card-w:140px;--dash-card-h:84px;display:grid;gap:8px;grid-template-columns:repeat(auto-fit,minmax(var(--dash-card-w),var(--dash-card-w)));justify-content:center;align-content:start}
.dash-card{width:var(--dash-card-w);height:var(--dash-card-h);background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:7px 8px;display:grid;gap:3px;align-content:start;animation:panel-in .2s ease both}
.dash-card:nth-child(2){animation-delay:.04s}
.dash-label{color:var(--text-muted);font-size:.72rem;text-transform:uppercase;letter-spacing:.05em;line-height:1.25}
.dash-kpi{font-size:clamp(1.15rem,4.1vw,1.5rem);font-weight:700;line-height:1.15;color:var(--text)}
.dash-grid.is-loading .dash-card{position:relative;overflow:hidden}
.dash-grid.is-loading .dash-kpi{color:transparent;user-select:none}
.dash-grid.is-loading .dash-kpi::after{content:'';display:block;height:24px;width:70%;border-radius:6px;background:linear-gradient(90deg,var(--surface-soft),color-mix(in srgb,var(--accent) 26%,var(--surface-soft)),var(--surface-soft));background-size:200% 100%;animation:dash-skeleton 1s linear infinite}
@keyframes dash-skeleton{0%{background-position:200% 0}100%{background-position:-200% 0}}
@keyframes panel-in{from{opacity:.92}to{opacity:1}}
@media (min-width:700px){
  .dash-grid{--dash-card-w:auto;--dash-card-h:90px;grid-template-columns:repeat(2,minmax(0,1fr));justify-content:stretch}
  .dash-card{width:auto;height:var(--dash-card-h);padding:9px}
  .dash-label{font-size:.8rem;letter-spacing:.06em}
  .dash-kpi{font-size:clamp(1.4rem,3vw,2.05rem)}
}
`;
