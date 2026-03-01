import { APP_NAME } from "../../config/index.js";

export const SITE_LOGO_CSS = `
.site-logo{display:inline-flex;align-items:center;justify-content:center;line-height:0;color:var(--accent,#b28a58)}
.site-logo--block{width:min(100%,260px)}
.site-logo--inline{width:128px;max-width:100%;vertical-align:middle;margin:0 .08em 0 0}
.site-logo-svg{width:100%;height:auto;display:block;overflow:visible}
.site-logo-word{font-family:'Inter','Segoe UI','Avenir Next','Helvetica Neue',Arial,sans-serif;font-size:26px;font-weight:800;letter-spacing:.22px;fill:url(#siteLogoWordGradient)}
.site-logo-word-stroke{font-family:'Inter','Segoe UI','Avenir Next','Helvetica Neue',Arial,sans-serif;font-size:26px;font-weight:800;letter-spacing:.22px;fill:none;stroke:color-mix(in srgb,var(--accent,#b28a58) 68%,#2e1f12);stroke-width:.45;paint-order:stroke fill;opacity:.9}
.site-logo-accent{fill:none;stroke:color-mix(in srgb,var(--accent,#b28a58) 62%,#2e1f12);stroke-width:1.35;stroke-linecap:round;opacity:.82}
`;

const SITE_LOGO_SVG = `<svg class="site-logo-svg" viewBox="0 0 184 52" aria-hidden="true" focusable="false"><defs><linearGradient id="siteLogoWordGradient" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="color-mix(in srgb,var(--accent,#b28a58) 90%,#fff)"/><stop offset="100%" stop-color="color-mix(in srgb,var(--accent,#b28a58) 58%,#392516)"/></linearGradient></defs><text class="site-logo-word-stroke" x="8" y="34.5">Freeducation</text><text class="site-logo-word" x="8" y="34.5">Freeducation</text><path class="site-logo-accent" d="M9.2 40.2h164.6"/></svg>`;

export function renderSiteLogo({ className = "site-logo site-logo--block", label = APP_NAME } = {}) {
  return `<span class="${className}" role="img" aria-label="${label}">${SITE_LOGO_SVG}</span>`;
}
