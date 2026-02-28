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
.home-cover{position:relative;min-height:clamp(280px,56vh,480px);display:grid;align-items:center;overflow:hidden;padding:clamp(12px,2.6vw,24px)}
.home-cover::before{content:'';position:absolute;inset:0;background:linear-gradient(140deg,#532d95,#1a7fa9 34%,#1a2f7a 72%,#8f3f63);opacity:.95}
.home-cover::after{content:'';position:absolute;inset:0;background:radial-gradient(circle at 18% 20%,rgba(255,232,170,.46),transparent 45%),radial-gradient(circle at 80% 8%,rgba(145,255,232,.28),transparent 42%),radial-gradient(circle at 70% 82%,rgba(255,137,172,.24),transparent 47%);mix-blend-mode:screen}
.home-cover-inner{position:relative;z-index:2;display:grid;gap:12px;max-width:760px;width:min(100%,760px);justify-items:start;text-align:left}
.home-cover-title{margin:0;display:inline-flex;max-width:min(100%,420px)}
.home-cover-title .site-logo{width:100%}
.home-cover-title .site-logo-svg{filter:drop-shadow(0 6px 14px rgba(5,10,20,.45))}
.home-cover-sub{margin:0;max-width:52ch;color:rgba(247,250,255,.92);font-size:clamp(.98rem,2.1vw,1.15rem)}
.home-cover-quote{margin:6px 0 0;display:grid;gap:6px;position:relative;isolation:isolate}
.home-cover-quote::before{content:'“';position:absolute;left:-.32em;top:-.34em;font-size:clamp(2rem,5vw,2.8rem);font-weight:700;line-height:1;color:rgba(255,255,255,.35);animation:quoteGlow 5s ease-in-out infinite}
.home-cover-quote p{margin:0;max-width:34ch;color:#fff;font-size:clamp(1rem,2.4vw,1.25rem);line-height:1.48;text-wrap:balance;transform-origin:left center;animation:quoteTextIn .65s cubic-bezier(.25,.84,.34,1) both}
.home-cover-quote cite{font-style:normal;color:rgba(234,240,255,.9);font-size:.92rem;letter-spacing:.01em;opacity:.95;transform-origin:left center;animation:quoteAuthorIn .75s cubic-bezier(.24,.78,.3,1) both}
.home-cover-quote.is-animating p,.home-cover-quote.is-animating cite{animation:quoteTextOut .35s ease forwards}
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
@keyframes quoteTextIn{0%{opacity:0;transform:translateY(12px) scale(.98);filter:blur(4px)}100%{opacity:1;transform:translateY(0) scale(1);filter:none}}
@keyframes quoteAuthorIn{0%{opacity:0;transform:translateX(-10px)}100%{opacity:.95;transform:translateX(0)}}
@keyframes quoteTextOut{to{opacity:0;transform:translateY(-8px) scale(.985);filter:blur(3px)}}
@keyframes quoteGlow{0%,100%{opacity:.28;transform:translateY(0)}50%{opacity:.5;transform:translateY(-2px)}}
@media (max-width:760px){.home-cover{padding:12px 10px;justify-items:stretch}.home-cover-inner{gap:9px;justify-items:start;text-align:left}.home-cover-title{max-width:min(88vw,340px)}.home-cover-sub{font-size:1rem;line-height:1.45}.home-cover-quote{margin-top:2px;width:100%}.home-cover-quote p{font-size:1.02rem;line-height:1.43}.home-orbit{opacity:.45;right:-18vmin;top:auto;bottom:-8vmin;width:62vmin;height:62vmin}}
`;

const HOME_SCRIPT = `
(() => {
  const quote = document.getElementById('homeQuoteText');
  const author = document.getElementById('homeQuoteAuthor');
  if (!quote || !author) return;
  const quoteWrap = quote.closest('.home-cover-quote');
  const entries = JSON.parse(quote.dataset.quotes || '[]');
  if (!Array.isArray(entries) || entries.length < 2) return;
  let index = 0;
  window.setInterval(() => {
    if (quoteWrap) quoteWrap.classList.add('is-animating');
    window.setTimeout(() => {
      index = (index + 1) % entries.length;
      const next = entries[index] || {};
      quote.textContent = next.text || '';
      author.textContent = next.author ? '— ' + next.author : '';
      quote.style.animation = 'none';
      author.style.animation = 'none';
      void quote.offsetWidth;
      quote.style.animation = '';
      author.style.animation = '';
      if (quoteWrap) {
        quoteWrap.classList.remove('is-animating');
      }
    }, 260);
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
    content: `<section class="home-cover" aria-label="${APP_NAME} welcome banner"><div class="home-orbit" aria-hidden="true"></div><div class="home-shape home-shape-a" aria-hidden="true"></div><div class="home-shape home-shape-b" aria-hidden="true"></div><div class="home-shape home-shape-c" aria-hidden="true"></div><div class="home-cover-inner"><h1 class="home-cover-title">${renderSiteLogo({ className: "site-logo site-logo--block", label: APP_NAME })}</h1><p class="home-cover-sub">Learn without limits and build strong knowledge with focused, readable learning spaces.</p><blockquote class="home-cover-quote"><p id="homeQuoteText" data-quotes='${quotesJson.replaceAll("'", "&#39;")}'>${HOME_QUOTES[0].text}</p><cite id="homeQuoteAuthor">— ${HOME_QUOTES[0].author}</cite></blockquote></div></section>`,
    script: HOME_SCRIPT,
  });
}
