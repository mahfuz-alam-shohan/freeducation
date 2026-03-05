import { APP_NAME } from "../../config/index.js";

export const SITE_LOGO_CSS = `
.site-logo{display:inline-flex;align-items:center;justify-content:flex-start;line-height:1;color:var(--accent,#2f8cff);white-space:nowrap}
.site-logo--block{width:auto;max-width:100%}
.site-logo--inline{width:auto;max-width:100%;vertical-align:middle;margin:0 .08em 0 0}
.site-logo-wordmark{display:inline-block;font-family:'Segoe Script','Bradley Hand','Lucida Handwriting','Comic Sans MS',cursive;font-size:clamp(1.38rem,2vw,1.62rem);font-weight:500;letter-spacing:.02em;line-height:1.05;color:color-mix(in srgb,var(--accent,#2f8cff) 78%,#133764);text-rendering:optimizeLegibility}
`;

const SITE_LOGO_MARKUP = `<span class="site-logo-wordmark">Freeducation</span>`;

export function renderSiteLogo({ className = "site-logo site-logo--block", label = APP_NAME } = {}) {
  return `<span class="${className}" role="img" aria-label="${label}">${SITE_LOGO_MARKUP}</span>`;
}
