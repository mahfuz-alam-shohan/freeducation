import { APP_NAME } from "../../config.js";

export const SITE_LOGO_CSS = `
.site-logo{display:inline-flex;align-items:center;justify-content:center;line-height:0;color:var(--accent,#b28a58)}
.site-logo--block{width:min(100%,260px)}
.site-logo--inline{width:128px;max-width:100%;vertical-align:middle;margin:0 .2em .08em}
.site-logo-svg{width:100%;height:auto;display:block;overflow:visible;filter:drop-shadow(0 2px 6px color-mix(in srgb,var(--accent,#b28a58) 35%,transparent))}
.site-logo-word{font-family:'Comic Sans MS','Trebuchet MS','Segoe Print','Avenir Next','Segoe UI',sans-serif;font-weight:800;letter-spacing:.75px}
.site-logo-word-shadow{fill:color-mix(in srgb,var(--accent,#b28a58) 24%,#000)}
.site-logo-word-extrude{fill:color-mix(in srgb,var(--accent,#b28a58) 62%,#2f2012)}
.site-logo-word-front{fill:url(#siteLogoWordGradient);stroke:color-mix(in srgb,var(--accent,#b28a58) 62%,#fff);stroke-width:.45;paint-order:stroke fill}
.site-logo-doodle{fill:none;stroke:color-mix(in srgb,var(--accent,#b28a58) 78%,#fff);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;opacity:.88}
.site-logo-doodle-secondary{fill:none;stroke:color-mix(in srgb,var(--accent,#b28a58) 66%,#fff);stroke-width:1.05;stroke-linecap:round;stroke-linejoin:round;opacity:.74}
.site-logo-doodle-guide{fill:none;stroke:color-mix(in srgb,var(--accent,#b28a58) 52%,#fff);stroke-width:.85;stroke-linecap:round;stroke-linejoin:round;opacity:.6;stroke-dasharray:1.2 3.2}
.site-logo-spark{fill:color-mix(in srgb,var(--accent,#b28a58) 84%,#fff);opacity:.86}
`;

const SITE_LOGO_SVG = `<svg class="site-logo-svg" viewBox="0 0 248 52" aria-hidden="true" focusable="false"><defs><linearGradient id="siteLogoWordGradient" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="color-mix(in srgb,var(--accent,#b28a58) 95%,#fff)"/><stop offset="100%" stop-color="color-mix(in srgb,var(--accent,#b28a58) 56%,#3a2514)"/></linearGradient><radialGradient id="siteLogoSparkGradient" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="color-mix(in srgb,var(--accent,#b28a58) 94%,#fff)"/><stop offset="100%" stop-color="color-mix(in srgb,var(--accent,#b28a58) 62%,transparent)"/></radialGradient></defs><text class="site-logo-word site-logo-word-shadow" x="14.6" y="36.4" font-size="28">Freeducation</text><text class="site-logo-word site-logo-word-extrude" x="13.2" y="35" font-size="28">Freeducation</text><text class="site-logo-word site-logo-word-front" x="12" y="33.8" font-size="28">Freeducation</text><path class="site-logo-doodle" d="M10 39.2c10.2 4.2 20.8 4.5 31.4 1.4 10.4-3 20.7-3.2 31 .4 10.2 3.6 20.5 3.8 30.9.8 10.2-2.9 20.4-3.1 30.7.2 10.1 3.3 20.3 3.4 30.5.5 10.1-2.8 20.1-2.9 30.1.2 10.2 3.2 20.1 3 30-.3"/><path class="site-logo-doodle-secondary" d="M10.4 42.1c10.1 3.8 20.4 4 30.8 1.1 10.3-2.9 20.6-3.1 30.9.3 10.2 3.4 20.3 3.6 30.6.7 10.1-2.8 20.2-3 30.4.1 10 3.1 20.1 3.3 30.2.5 10-2.7 20.1-2.9 30 .2 10 3 19.9 2.9 29.7-.2"/><path class="site-logo-doodle-guide" d="M10.2 36.4c10.2 3.2 20.4 3.4 30.7 1 10.4-2.5 20.8-2.6 31.2.2 10.4 2.8 20.7 2.9 31.1.5 10.3-2.4 20.6-2.5 31 .1 10.2 2.6 20.4 2.8 30.6.4 10.1-2.3 20.2-2.4 30.2.1 10 2.5 20 2.4 30-.2"/><path class="site-logo-doodle-secondary" d="M27.2 17.2c8.2-4.2 16.8-4.6 25.6-1.8 8.6 2.7 17.3 2.8 25.9.3m16.2.4c7.8-3.8 15.9-4.1 24.3-1.5 8.2 2.5 16.4 2.6 24.6.3m15.5.5c7.8-3.7 15.8-3.9 24.1-1.4 8 2.4 16 2.5 24 .3"/><circle class="site-logo-spark" cx="40.8" cy="12.6" r="1.05"/><circle class="site-logo-spark" cx="95.1" cy="11.4" r="1.05"/><circle class="site-logo-spark" cx="149.4" cy="10.9" r="1.05"/><circle class="site-logo-spark" cx="203.7" cy="11.8" r="1.05"/><circle cx="122.5" cy="8.9" r="2" fill="url(#siteLogoSparkGradient)" opacity=".62"/></svg>`;

export function renderSiteLogo({ className = "site-logo site-logo--block", label = APP_NAME } = {}) {
  return `<span class="${className}" role="img" aria-label="${label}">${SITE_LOGO_SVG}</span>`;
}
