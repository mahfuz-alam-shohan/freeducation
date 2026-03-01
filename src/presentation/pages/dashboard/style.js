export const DASHBOARD_STYLE = `
.dash-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:var(--space-2);align-content:start}
.dash-card{position:relative;overflow:hidden;display:grid;grid-template-rows:auto 1fr auto;gap:var(--space-2);min-height:112px;padding:var(--space-3);background:linear-gradient(180deg,color-mix(in srgb,var(--surface) 94%,var(--accent) 6%),var(--surface));border:1px solid color-mix(in srgb,var(--border) 84%,var(--accent) 16%);border-radius:12px;animation:panel-in .28s cubic-bezier(.22,.61,.36,1) both;transform:translate3d(var(--mx,0px),var(--my,0px),0) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg));transform-origin:center;transition:box-shadow .24s ease,border-color .24s ease}
.dash-card::after{content:'';position:absolute;inset:0;border-radius:inherit;background:radial-gradient(150px circle at var(--gx,50%) var(--gy,50%),color-mix(in srgb,var(--accent) 16%,transparent),transparent 72%);opacity:var(--glow,0);transition:opacity .22s ease;pointer-events:none}
.dash-card.is-interactive{will-change:transform}
.dash-card.is-interactive:hover{border-color:color-mix(in srgb,var(--accent) 32%,var(--border));box-shadow:0 12px 30px -22px color-mix(in srgb,var(--accent) 46%,transparent)}
.dash-card:nth-child(2){animation-delay:.04s}
.dash-bg-icon{position:absolute;top:-14px;right:-10px;width:76px;height:76px;opacity:.14;pointer-events:none}
.dash-bg-icon svg{width:100%;height:100%;fill:none;stroke:var(--accent);stroke-width:1.2;stroke-linecap:round;stroke-linejoin:round}
.dash-bg-icon-users svg path:first-child{fill:color-mix(in srgb,var(--accent) 25%,transparent)}
.dash-bg-icon-sessions svg rect{fill:color-mix(in srgb,var(--accent) 18%,transparent)}
.dash-label{position:relative;z-index:1;margin:0;color:var(--text-muted);font-size:.73rem;text-transform:uppercase;letter-spacing:.08em;line-height:1.35;font-weight:600;max-width:14ch}
.dash-kpi{position:relative;z-index:1;align-self:end;margin:0;font-size:clamp(1.5rem,6.2vw,1.95rem);font-weight:700;line-height:1.08;color:var(--text)}
.dash-note{position:relative;z-index:1;margin:0;color:var(--text-muted);font-size:.79rem;line-height:1.3;max-width:22ch}
.dash-grid.is-loading .dash-kpi{color:transparent;user-select:none}
.dash-grid.is-loading .dash-kpi::after{content:'';display:block;height:24px;width:70%;border-radius:6px;background:linear-gradient(90deg,var(--surface-soft),color-mix(in srgb,var(--accent) 26%,var(--surface-soft)),var(--surface-soft));background-size:200% 100%;animation:dash-skeleton 1s linear infinite}
@keyframes dash-skeleton{0%{background-position:200% 0}100%{background-position:-200% 0}}
@keyframes panel-in{from{opacity:.92}to{opacity:1}}
@media (min-width:700px){
  .dash-grid{gap:var(--space-3)}
  .dash-card{min-height:124px;padding:var(--space-3);gap:var(--space-2)}
  .dash-bg-icon{top:-18px;right:-12px;width:86px;height:86px}
  .dash-label{font-size:.77rem}
  .dash-kpi{font-size:clamp(1.62rem,2.8vw,2.08rem)}
  .dash-note{font-size:.83rem}
}
@media (prefers-reduced-motion:reduce){
  .dash-card{animation:none;transform:none!important;transition:none}
  .dash-card::after{display:none}
}
`;
