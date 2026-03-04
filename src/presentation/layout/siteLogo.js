import { APP_NAME } from "../../config/index.js";

export const SITE_LOGO_CSS = `
.site-logo{display:inline-flex;align-items:center;justify-content:center;line-height:0;color:var(--accent,#b28a58)}
.site-logo--block{width:min(100%,216px)}
.site-logo--inline{width:114px;max-width:100%;vertical-align:middle;margin:0 .08em 0 0}
.site-logo-svg{width:100%;height:auto;display:block;overflow:visible}
.site-logo-word{font-family:'Segoe Script','Bradley Hand','Lucida Handwriting','Comic Sans MS',cursive;font-size:24px;font-weight:500;letter-spacing:.28px;fill:color-mix(in srgb,var(--accent,#2f8cff) 78%,#133764)}
.site-logo-word-stroke{display:none}
.site-logo-accent{display:none}
`;

const SITE_LOGO_SVG = `<svg class="site-logo-svg" viewBox="0 0 184 52" aria-hidden="true" focusable="false"><text class="site-logo-word" x="8" y="34">Freeducation</text></svg>`;

export function renderSiteLogo({ className = "site-logo site-logo--block", label = APP_NAME } = {}) {
  return `<span class="${className}" role="img" aria-label="${label}">${SITE_LOGO_SVG}</span>`;
}
