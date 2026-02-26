export const DASHBOARD_STYLE = `
.dash-grid{--dash-card-w:160px;--dash-card-h:114px;display:grid;gap:8px;grid-template-columns:repeat(auto-fit,minmax(var(--dash-card-w),var(--dash-card-w)));justify-content:center;align-content:start}
.dash-card{width:var(--dash-card-w);height:var(--dash-card-h);background:linear-gradient(180deg,color-mix(in srgb,var(--surface) 94%,var(--accent) 6%),var(--surface));border:1px solid color-mix(in srgb,var(--border) 86%,var(--accent) 14%);border-radius:8px;padding:8px;display:grid;grid-template-rows:auto 1fr auto;gap:5px;align-content:start;animation:panel-in .2s ease both}
.dash-card:nth-child(2){animation-delay:.04s}
.dash-card-head{display:flex;align-items:flex-start;justify-content:space-between;gap:6px}
.dash-icon{height:20px;min-width:20px;display:grid;place-items:center;border:1px solid color-mix(in srgb,var(--border) 78%,var(--accent) 22%);border-radius:6px;font-size:.7rem;line-height:1;background:var(--surface-soft)}
.dash-label{color:var(--text-muted);font-size:.69rem;text-transform:uppercase;letter-spacing:.04em;line-height:1.25}
.dash-kpi{font-size:clamp(1.15rem,4.1vw,1.55rem);font-weight:700;line-height:1.1;color:var(--text);align-self:end}
.dash-note{font-size:.7rem;line-height:1.2;color:var(--text-muted)}
.dash-grid.is-loading .dash-card{position:relative;overflow:hidden}
.dash-grid.is-loading .dash-kpi{color:transparent;user-select:none}
.dash-grid.is-loading .dash-kpi::after{content:'';display:block;height:24px;width:70%;border-radius:6px;background:linear-gradient(90deg,var(--surface-soft),color-mix(in srgb,var(--accent) 26%,var(--surface-soft)),var(--surface-soft));background-size:200% 100%;animation:dash-skeleton 1s linear infinite}
@keyframes dash-skeleton{0%{background-position:200% 0}100%{background-position:-200% 0}}
@keyframes panel-in{from{opacity:.92}to{opacity:1}}
@media (min-width:700px){
  .dash-grid{--dash-card-w:250px;--dash-card-h:126px;grid-template-columns:repeat(auto-fit,minmax(var(--dash-card-w),var(--dash-card-w)))}
  .dash-card{padding:9px}
  .dash-label{font-size:.73rem;letter-spacing:.05em}
  .dash-kpi{font-size:clamp(1.45rem,2.3vw,1.9rem)}
  .dash-note{font-size:.74rem}
}
`;
