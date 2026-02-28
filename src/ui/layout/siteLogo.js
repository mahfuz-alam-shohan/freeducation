import { APP_NAME } from "../../config.js";

export const SITE_LOGO_CSS = `
.site-logo{display:inline-flex;align-items:center;justify-content:center;line-height:0;color:var(--accent,#b28a58)}
.site-logo--block{width:min(100%,260px)}
.site-logo--inline{width:128px;max-width:100%;vertical-align:middle;margin:0 .2em .08em}
.site-logo-svg{width:100%;height:auto;display:block;overflow:visible}
.site-logo-mark-ring{fill:url(#siteLogoMarkGradient)}
.site-logo-mark-core{fill:#fff;opacity:.95}
.site-logo-mark-letter{font-family:'Inter','Segoe UI','Avenir Next','Helvetica Neue',Arial,sans-serif;font-size:11.5px;font-weight:800;fill:color-mix(in srgb,var(--accent,#b28a58) 72%,#2f2012)}
.site-logo-word{font-family:'Inter','Segoe UI','Avenir Next','Helvetica Neue',Arial,sans-serif;font-weight:700;letter-spacing:.15px;fill:color-mix(in srgb,var(--accent,#b28a58) 72%,#26180d)}
.site-logo-tagline{font-family:'Inter','Segoe UI','Avenir Next','Helvetica Neue',Arial,sans-serif;font-size:6.2px;font-weight:500;letter-spacing:1.35px;text-transform:uppercase;fill:color-mix(in srgb,var(--accent,#b28a58) 38%,#2d1d10);opacity:.92}
`;

const SITE_LOGO_SVG = `<svg class="site-logo-svg" viewBox="0 0 248 52" aria-hidden="true" focusable="false"><defs><linearGradient id="siteLogoMarkGradient" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="color-mix(in srgb,var(--accent,#b28a58) 88%,#fff)"/><stop offset="100%" stop-color="color-mix(in srgb,var(--accent,#b28a58) 58%,#3b2817)"/></linearGradient></defs><circle class="site-logo-mark-ring" cx="23" cy="26" r="14"/><circle class="site-logo-mark-core" cx="23" cy="26" r="9.4"/><text class="site-logo-mark-letter" x="19.6" y="30">F</text><text class="site-logo-word" x="43" y="30.5" font-size="19">Freeducation</text><text class="site-logo-tagline" x="43" y="40.7">Learn • Grow • Share</text></svg>`;

export function renderSiteLogo({ className = "site-logo site-logo--block", label = APP_NAME } = {}) {
  return `<span class="${className}" role="img" aria-label="${label}">${SITE_LOGO_SVG}</span>`;
}
