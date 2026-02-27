import { APP_NAME } from "../../../config.js";
import { USER_TYPES } from "../../../core/roles.js";
import { ADMIN_NAV_SECTIONS, LOGGED_OUT_NAV_SECTIONS, STUDENT_NAV_SECTIONS, TEACHER_NAV_SECTIONS } from "../../config/navigation.js";
import { renderAdminLayout } from "../../layout/adminLayout.js";

const HOME_QUOTES = [
  { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
  { text: "Knowledge is power.", author: "Francis Bacon" },
];

const HOME_STYLE = `
.home-cover{position:relative;min-height:clamp(360px,72vh,640px);display:grid;align-items:center;overflow:hidden;padding:clamp(18px,4vw,44px)}
.home-cover::before{content:'';position:absolute;inset:0;background:linear-gradient(140deg,#532d95,#1a7fa9 34%,#1a2f7a 72%,#8f3f63);opacity:.95}
.home-cover::after{content:'';position:absolute;inset:0;background:radial-gradient(circle at 18% 20%,rgba(255,232,170,.46),transparent 45%),radial-gradient(circle at 80% 8%,rgba(145,255,232,.28),transparent 42%),radial-gradient(circle at 70% 82%,rgba(255,137,172,.24),transparent 47%);mix-blend-mode:screen}
.home-cover-inner{position:relative;z-index:2;display:grid;gap:12px;max-width:760px;width:min(100%,760px);justify-items:start;text-align:left}
.home-cover-title{margin:0;font-size:clamp(2rem,6vw,4rem);line-height:1.04;letter-spacing:.04em;color:#fff;text-transform:uppercase}
.home-cover-sub{margin:0;max-width:52ch;color:rgba(247,250,255,.92);font-size:clamp(.98rem,2.1vw,1.15rem)}
.home-cover-quote{margin:4px 0 0;padding:14px;border-radius:12px;background:rgba(10,14,26,.3);backdrop-filter:blur(4px);border:1px solid rgba(255,255,255,.22);display:grid;gap:6px}
.home-cover-quote p{margin:0;color:#fff;font-size:clamp(1rem,2.4vw,1.25rem)}
.home-cover-quote cite{font-style:normal;color:rgba(234,240,255,.9);font-size:.92rem}
.home-orbit,.home-orbit::before,.home-orbit::after{position:absolute;border-radius:999px;pointer-events:none}
.home-orbit{width:42vmin;height:42vmin;min-width:220px;min-height:220px;right:-8vmin;top:10%;border:1px solid rgba(255,255,255,.3);animation:spin 26s linear infinite}
.home-orbit::before{content:'';width:14px;height:14px;background:#fff;top:50%;left:-7px;transform:translateY(-50%)}
.home-orbit::after{content:'';inset:15%;border:1px dashed rgba(255,255,255,.34);animation:spinReverse 18s linear infinite}
.home-shape{position:absolute;filter:blur(.2px);opacity:.88;pointer-events:none;animation:float 6s ease-in-out infinite}
.home-shape-a{width:120px;height:120px;left:6%;bottom:9%;background:rgba(255,200,120,.42);clip-path:polygon(50% 0%,100% 50%,50% 100%,0% 50%)}
.home-shape-b{width:150px;height:150px;right:18%;bottom:-38px;background:rgba(126,232,255,.33);border-radius:31% 69% 58% 42%/53% 44% 56% 47%;animation-duration:8s}
.home-shape-c{width:80px;height:80px;right:42%;top:13%;background:rgba(231,163,255,.35);clip-path:polygon(25% 6%,100% 0,75% 100%,0 80%);animation-duration:7s}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes spinReverse{to{transform:rotate(-360deg)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
@media (max-width:760px){.home-cover{justify-items:center}.home-cover-inner{justify-items:center;text-align:center}.home-cover-quote{width:100%}.home-orbit{opacity:.55;right:-18vmin;top:auto;bottom:-6vmin;width:58vmin;height:58vmin}}
`;

const HOME_SCRIPT = `
(() => {
  const quote = document.getElementById('homeQuoteText');
  const author = document.getElementById('homeQuoteAuthor');
  if (!quote || !author) return;
  const entries = JSON.parse(quote.dataset.quotes || '[]');
  if (!Array.isArray(entries) || entries.length < 2) return;
  let index = 0;
  window.setInterval(() => {
    index = (index + 1) % entries.length;
    const next = entries[index] || {};
    quote.textContent = next.text || '';
    author.textContent = next.author ? '— ' + next.author : '';
  }, 5200);
})();
`;

function navItemsForUser(userType = "") {
  if (userType === USER_TYPES.TEACHER) return TEACHER_NAV_SECTIONS;
  if (userType === USER_TYPES.STUDENT) return STUDENT_NAV_SECTIONS;
  return ADMIN_NAV_SECTIONS;
}

export function homePage({ admin } = {}) {
  const loggedIn = Boolean(admin);
  const quotesJson = JSON.stringify(HOME_QUOTES);
  return renderAdminLayout({
    title: `${APP_NAME} Home`,
    activeMenu: "home",
    homePath: "/",
    admin,
    navItems: loggedIn ? navItemsForUser(admin?.user_type) : LOGGED_OUT_NAV_SECTIONS,
    pageClass: "page-home",
    pageStyles: HOME_STYLE,
    contentClass: "admin-content-flush",
    content: `<section class="home-cover" aria-label="${APP_NAME} welcome banner"><div class="home-orbit" aria-hidden="true"></div><div class="home-shape home-shape-a" aria-hidden="true"></div><div class="home-shape home-shape-b" aria-hidden="true"></div><div class="home-shape home-shape-c" aria-hidden="true"></div><div class="home-cover-inner"><h1 class="home-cover-title">${APP_NAME}</h1><p class="home-cover-sub">Learn without limits and build strong knowledge with focused, readable learning spaces.</p><blockquote class="home-cover-quote"><p id="homeQuoteText" data-quotes='${quotesJson.replaceAll("'", "&#39;")}'>${HOME_QUOTES[0].text}</p><cite id="homeQuoteAuthor">— ${HOME_QUOTES[0].author}</cite></blockquote></div></section>`,
    script: HOME_SCRIPT,
  });
}
