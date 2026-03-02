import { APP_NAME } from "../../../config/index.js";
import { USER_TYPES } from "../../../shared/auth/roles.js";
import { PRIMARY_NAV_SECTIONS, LOGGED_OUT_NAV_SECTIONS, STUDENT_NAV_SECTIONS, TEACHER_NAV_SECTIONS } from "../../config/navigation.js";
import { renderAppShellLayout } from "../../layout/appShell/index.js";
import { SITE_LOGO_CSS, renderSiteLogo } from "../../layout/siteLogo.js";

const HOME_QUOTES = [
  { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
  { text: "Knowledge is power.", author: "Francis Bacon" },
];

const HOME_STYLE = `
${SITE_LOGO_CSS}
.home-cover{position:relative;overflow:hidden;display:grid;align-items:start;padding:var(--space-2) var(--space-3);min-height:144px;background:linear-gradient(130deg,#142462 0%,#1a2f7a 45%,#22459f 100%);isolation:isolate}
.home-cover::before,.home-cover::after{content:'';position:absolute;inset:auto auto 10% -12%;width:42%;aspect-ratio:1;border-radius:50%;opacity:.26;pointer-events:none;z-index:0;background:radial-gradient(circle at 30% 30%,rgba(255,255,255,.44),rgba(255,255,255,0) 66%);animation:homeCoverFloat 14s ease-in-out infinite}
.home-cover::after{inset:-30% -6% auto auto;width:46%;opacity:.22;animation-duration:17s;animation-delay:-6s}
.home-cover-inner{position:relative;z-index:1;display:grid;gap:var(--space-2);max-width:600px;width:min(100%,600px);justify-items:start;text-align:left}
.home-cover-title{margin:0;display:inline-flex;max-width:min(100%,420px);animation:homeCoverRise .85s ease-out both}
.home-cover-title .site-logo{width:100%}
.home-cover-quote{margin:2px 0 0;display:grid;gap:var(--space-1);animation:homeCoverRise .95s ease-out both}
.home-cover-quote p{margin:0;max-width:35ch;color:#f7f9ff;font-family:Georgia,'Times New Roman',serif;font-size:clamp(1.02rem,2vw,1.18rem);font-weight:500;line-height:1.42;letter-spacing:.015em;word-break:break-word;overflow-wrap:anywhere;text-shadow:0 1px 0 rgba(10,15,37,.28)}
.home-cover-quote cite{font-style:normal;color:rgba(246,250,255,.88);font-family:'Palatino Linotype','Book Antiqua',Palatino,serif;font-size:.85rem;letter-spacing:.07em;text-transform:uppercase}
.home-cover-accent{position:absolute;right:9px;top:10px;width:min(36vw,220px);height:48px;pointer-events:none;opacity:.45;z-index:0;background:repeating-linear-gradient(110deg,rgba(247,250,255,.46) 0 1px,transparent 1px 12px);mask-image:linear-gradient(to right,transparent,rgba(0,0,0,.75) 30%,rgba(0,0,0,.92));animation:homeCoverGlide 7s linear infinite}
@keyframes homeCoverFloat{0%,100%{transform:translate3d(0,0,0) scale(1)}50%{transform:translate3d(4%,8%,0) scale(1.08)}}
@keyframes homeCoverRise{0%{opacity:0;transform:translate3d(0,6px,0)}100%{opacity:1;transform:translate3d(0,0,0)}}
@keyframes homeCoverGlide{0%{transform:translate3d(8px,0,0)}50%{transform:translate3d(-10px,0,0)}100%{transform:translate3d(8px,0,0)}}
.home-academics{display:grid;gap:14px;padding:14px var(--space-2) var(--space-3);background:var(--surface)}
.home-academics-head{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap}
.home-academics-head h2{margin:0;font-size:1.05rem;letter-spacing:.01em}
.home-academics-all{height:34px;border:1px solid var(--border);border-radius:999px;padding:0 12px;display:inline-flex;align-items:center;gap:6px;background:var(--surface-soft);color:var(--text);text-decoration:none;font-weight:700}
.home-academics-all:hover{border-color:color-mix(in srgb,var(--accent) 55%,var(--border))}
.home-class-rail{display:grid;grid-auto-flow:column;grid-auto-columns:clamp(130px,14vw,182px);gap:12px;overflow:auto;padding:2px 0 6px;scrollbar-width:thin}
.home-class-rail::-webkit-scrollbar{height:8px}
.home-class-rail::-webkit-scrollbar-thumb{background:color-mix(in srgb,var(--border) 78%,transparent);border-radius:999px}
.home-class-card{display:grid;gap:0;min-width:0}
.home-class-link{display:grid;gap:0;text-decoration:none;color:inherit}
.home-class-poster{position:relative;aspect-ratio:2/3;border-radius:12px;overflow:hidden;background:linear-gradient(145deg,#cfd7e8,#8e9ab6)}
.home-class-poster img{display:block;width:100%;height:100%;object-fit:cover}
.home-class-poster-fallback{position:absolute;inset:0;display:grid;place-items:center;font-size:1rem;font-weight:800;letter-spacing:.03em;color:#f4f7ff;background:linear-gradient(145deg,#6d7ba0,#3e4f76)}
.home-class-name{margin:0;padding:8px 2px 0;font-size:.9rem;line-height:1.15;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.home-class-empty{margin:0;padding:14px;border:1px dashed var(--border);border-radius:10px;color:var(--text-muted)}
.home-all-page{display:grid;gap:14px;padding:14px var(--space-2) var(--space-3)}
.home-all-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(132px,1fr));gap:14px}
@media (prefers-reduced-motion:reduce){.home-cover::before,.home-cover::after,.home-cover-title,.home-cover-quote,.home-cover-accent{animation:none}}
@media (max-width:760px){.home-cover{padding:var(--space-2);justify-items:center;min-height:136px}.home-cover-inner{gap:var(--space-1);justify-items:center;text-align:center;max-width:100%}.home-cover-title{display:none}.home-cover-quote{margin-top:0;width:100%;justify-items:center}.home-cover-quote p{font-size:1rem;line-height:1.35;max-width:29ch}.home-cover-accent{right:3px;top:6px;height:38px;width:min(46vw,160px)}.home-class-rail{grid-auto-columns:44vw;gap:10px}.home-all-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}}
`;

function navItemsForUser(userType = "") {
  if (userType === USER_TYPES.TEACHER) return TEACHER_NAV_SECTIONS;
  if (userType === USER_TYPES.STUDENT) return STUDENT_NAV_SECTIONS;
  return PRIMARY_NAV_SECTIONS;
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function classCardMarkup(item = {}) {
  const classId = Number(item?.id || 0);
  const name = String(item?.name || "").trim() || "Class";
  const initials = name.split(/\s+/).map((part) => part.slice(0, 1).toUpperCase()).join("").slice(0, 3) || "CL";
  const imageUrl = String(item?.publicImageUrl || item?.imageUrl || "").trim();
  const href = classId > 0 ? `/classes/${classId}` : "/classes";
  return `<article class="home-class-card"><a class="home-class-link" href="${escapeHtml(href)}"><div class="home-class-poster">${imageUrl ? `<img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(name)}" loading="lazy" decoding="async" />` : `<span class="home-class-poster-fallback">${escapeHtml(initials)}</span>`}</div><p class="home-class-name">${escapeHtml(name)}</p></a></article>`;
}

function homeAcademicsMarkup(classes = []) {
  const rows = Array.isArray(classes) ? classes : [];
  return `<section class="home-academics" aria-label="Academic classes"><header class="home-academics-head"><h2>Academic</h2><a class="home-academics-all" href="/classes">See all <span aria-hidden="true">›</span></a></header>${rows.length ? `<div class="home-class-rail">${rows.map((item) => classCardMarkup(item)).join("")}</div>` : `<p class="home-class-empty">No classes are marked for homepage yet.</p>`}</section>`;
}

function allClassesMarkup(classes = []) {
  const rows = Array.isArray(classes) ? classes : [];
  return `<section class="home-all-page" aria-label="All classes"><header class="home-academics-head"><h2>All Classes</h2><a class="home-academics-all" href="/">Back home <span aria-hidden="true">‹</span></a></header>${rows.length ? `<div class="home-all-grid">${rows.map((item) => classCardMarkup(item)).join("")}</div>` : `<p class="home-class-empty">No classes found.</p>`}</section>`;
}

export function homePage({ user, featuredClasses = [], allClasses = [], showAllClasses = false } = {}) {
  const currentUser = user || null;
  const loggedIn = Boolean(currentUser);
  const staticQuote = HOME_QUOTES[0] || { text: "", author: "" };
  const quoteText = String(staticQuote.text || "");
  const quoteAuthor = staticQuote.author ? `- ${staticQuote.author}` : "";
  const coverMarkup = `<section class="home-cover" aria-label="${APP_NAME} welcome banner"><span class="home-cover-accent" aria-hidden="true"></span><div class="home-cover-inner"><h1 class="home-cover-title">${renderSiteLogo({ className: "site-logo site-logo--block", label: APP_NAME })}</h1><blockquote class="home-cover-quote"><p id="homeQuoteText">${escapeHtml(quoteText)}</p><cite id="homeQuoteAuthor">${escapeHtml(quoteAuthor)}</cite></blockquote></div></section>`;
  const bodyContent = showAllClasses
    ? `${coverMarkup}${allClassesMarkup(allClasses)}`
    : `${coverMarkup}${homeAcademicsMarkup(featuredClasses)}`;
  return renderAppShellLayout({
    title: showAllClasses ? "All Classes" : `${APP_NAME} Home`,
    activeMenu: "home",
    homePath: "/",
    user: currentUser,
    navItems: loggedIn ? navItemsForUser(currentUser?.user_type) : LOGGED_OUT_NAV_SECTIONS,
    pageClass: "page-home",
    pageStyles: HOME_STYLE,
    contentClass: "app-content-flush",
    content: bodyContent,
  });
}
