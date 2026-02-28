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
.home-cover{display:grid;align-items:start;padding:8px 10px;min-height:152px;background:#1a2f7a}
.home-cover-inner{display:grid;gap:8px;max-width:600px;width:min(100%,600px);justify-items:start;text-align:left}
.home-cover-title{margin:0;display:inline-flex;max-width:min(100%,420px)}
.home-cover-title .site-logo{width:100%}
.home-cover-quote{margin:2px 0 0;display:grid;gap:4px}
.home-cover-quote p{margin:0;max-width:35ch;color:#f7f9ff;font-family:Georgia,'Times New Roman',serif;font-size:clamp(1.02rem,2vw,1.18rem);font-weight:500;line-height:1.42;letter-spacing:.015em;word-break:break-word;overflow-wrap:anywhere}
.home-cover-quote cite{font-style:normal;color:rgba(246,250,255,.86);font-family:'Palatino Linotype','Book Antiqua',Palatino,serif;font-size:.85rem;letter-spacing:.07em;text-transform:uppercase}
@media (max-width:760px){.home-cover{padding:7px 6px;justify-items:center;min-height:144px}.home-cover-inner{gap:5px;justify-items:center;text-align:center;max-width:100%}.home-cover-title{display:none}.home-cover-quote{margin-top:0;width:100%;justify-items:center}.home-cover-quote p{font-size:1rem;line-height:1.35;max-width:29ch}}
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
    content: `<section class="home-cover" aria-label="${APP_NAME} welcome banner"><div class="home-cover-inner"><h1 class="home-cover-title">${renderSiteLogo({ className: "site-logo site-logo--block", label: APP_NAME })}</h1><blockquote class="home-cover-quote"><p id="homeQuoteText">${quoteText}</p><cite id="homeQuoteAuthor">${quoteAuthor}</cite></blockquote></div></section>`,
  });
}
