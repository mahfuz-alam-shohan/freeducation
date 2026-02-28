import { APP_NAME } from "../../../config.js";
import { USER_TYPES } from "../../../core/roles.js";
import { ADMIN_NAV_SECTIONS, LOGGED_OUT_NAV_SECTIONS, STUDENT_NAV_SECTIONS, TEACHER_NAV_SECTIONS } from "../../config/navigation.js";
import { renderAdminLayout } from "../../layout/adminLayout.js";
import { SITE_LOGO_CSS, renderSiteLogo } from "../../layout/siteLogo.js";

const HOME_QUOTES = [
  { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
  { text: "Knowledge is power.", author: "Francis Bacon" },
];

const HOME_STYLE = `
${SITE_LOGO_CSS}
.home-cover{position:relative;overflow:hidden;display:grid;align-items:start;padding:8px 10px;min-height:152px;background:linear-gradient(130deg,#142462 0%,#1a2f7a 45%,#22459f 100%);isolation:isolate}
.home-cover::before,.home-cover::after{content:'';position:absolute;inset:auto auto 10% -12%;width:42%;aspect-ratio:1;border-radius:50%;opacity:.26;pointer-events:none;z-index:0;background:radial-gradient(circle at 30% 30%,rgba(255,255,255,.44),rgba(255,255,255,0) 66%);animation:homeCoverFloat 14s ease-in-out infinite}
.home-cover::after{inset:-30% -6% auto auto;width:46%;opacity:.22;animation-duration:17s;animation-delay:-6s}
.home-cover-inner{position:relative;z-index:1;display:grid;gap:8px;max-width:600px;width:min(100%,600px);justify-items:start;text-align:left}
.home-cover-title{margin:0;display:inline-flex;max-width:min(100%,420px);animation:homeCoverRise .85s ease-out both}
.home-cover-title .site-logo{width:100%}
.home-cover-quote{margin:2px 0 0;display:grid;gap:4px;animation:homeCoverRise .95s ease-out both}
.home-cover-quote p{margin:0;max-width:35ch;color:#f7f9ff;font-family:Georgia,'Times New Roman',serif;font-size:clamp(1.02rem,2vw,1.18rem);font-weight:500;line-height:1.42;letter-spacing:.015em;word-break:break-word;overflow-wrap:anywhere;text-shadow:0 1px 0 rgba(10,15,37,.28)}
.home-cover-quote cite{font-style:normal;color:rgba(246,250,255,.88);font-family:'Palatino Linotype','Book Antiqua',Palatino,serif;font-size:.85rem;letter-spacing:.07em;text-transform:uppercase}
.home-cover-accent{position:absolute;right:9px;top:10px;width:min(36vw,220px);height:48px;pointer-events:none;opacity:.45;z-index:0;background:repeating-linear-gradient(110deg,rgba(247,250,255,.46) 0 1px,transparent 1px 12px);mask-image:linear-gradient(to right,transparent,rgba(0,0,0,.75) 30%,rgba(0,0,0,.92));animation:homeCoverGlide 7s linear infinite}
@keyframes homeCoverFloat{0%,100%{transform:translate3d(0,0,0) scale(1)}50%{transform:translate3d(4%,8%,0) scale(1.08)}}
@keyframes homeCoverRise{0%{opacity:0;transform:translate3d(0,6px,0)}100%{opacity:1;transform:translate3d(0,0,0)}}
@keyframes homeCoverGlide{0%{transform:translate3d(8px,0,0)}50%{transform:translate3d(-10px,0,0)}100%{transform:translate3d(8px,0,0)}}
@media (prefers-reduced-motion:reduce){.home-cover::before,.home-cover::after,.home-cover-title,.home-cover-quote,.home-cover-accent{animation:none}}
@media (max-width:760px){.home-cover{padding:7px 6px;justify-items:center;min-height:144px}.home-cover-inner{gap:5px;justify-items:center;text-align:center;max-width:100%}.home-cover-title{display:none}.home-cover-quote{margin-top:0;width:100%;justify-items:center}.home-cover-quote p{font-size:1rem;line-height:1.35;max-width:29ch}.home-cover-accent{right:3px;top:6px;height:38px;width:min(46vw,160px)}}
`;

function navItemsForUser(userType = "") {
  if (userType === USER_TYPES.TEACHER) return TEACHER_NAV_SECTIONS;
  if (userType === USER_TYPES.STUDENT) return STUDENT_NAV_SECTIONS;
  return ADMIN_NAV_SECTIONS;
}

export function homePage({ admin } = {}) {
  const loggedIn = Boolean(admin);
  const staticQuote = HOME_QUOTES[0] || { text: "", author: "" };
  const quoteText = String(staticQuote.text || "");
  const quoteAuthor = staticQuote.author ? `— ${staticQuote.author}` : "";
  return renderAdminLayout({
    title: `${APP_NAME} Home`,
    activeMenu: "home",
    homePath: "/",
    admin,
    navItems: loggedIn ? navItemsForUser(admin?.user_type) : LOGGED_OUT_NAV_SECTIONS,
    pageClass: "page-home",
    pageStyles: HOME_STYLE,
    contentClass: "admin-content-flush",
    content: `<section class="home-cover" aria-label="${APP_NAME} welcome banner"><span class="home-cover-accent" aria-hidden="true"></span><div class="home-cover-inner"><h1 class="home-cover-title">${renderSiteLogo({ className: "site-logo site-logo--block", label: APP_NAME })}</h1><blockquote class="home-cover-quote"><p id="homeQuoteText">${quoteText}</p><cite id="homeQuoteAuthor">${quoteAuthor}</cite></blockquote></div></section>`,
  });
}
