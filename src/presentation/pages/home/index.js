import { APP_NAME } from "../../../config/index.js";
import { USER_TYPES } from "../../../shared/auth/roles.js";
import { PRIMARY_NAV_SECTIONS, LOGGED_OUT_NAV_SECTIONS, STUDENT_NAV_SECTIONS, TEACHER_NAV_SECTIONS } from "../../config/navigation.js";
import { renderAppShellLayout } from "../../layout/appShell/index.js";
import { SITE_LOGO_CSS, renderSiteLogo } from "../../layout/siteLogo.js";

const HOME_QUOTE_SEEDS = [
  { text: "Education is the most powerful weapon to change the world.", author: "Nelson Mandela" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
  { text: "The roots of education are bitter, but the fruit is sweet.", author: "Aristotle" },
  { text: "Study the past if you would define the future.", author: "Confucius" },
  { text: "Wisdom begins in wonder.", author: "Socrates" },
  { text: "The mind is not a vessel to be filled, but a fire to be ignited.", author: "Plutarch" },
  { text: "Knowledge is power.", author: "Francis Bacon" },
];

const HOME_QUOTE_COMPONENTS = {
  topics: [
    "Strong learning",
    "Deep understanding",
    "Clear thinking",
    "Creative problem-solving",
    "Real confidence",
    "Academic excellence",
    "Long-term success",
    "Personal growth",
    "Community leadership",
    "Focused discipline",
    "Practical intelligence",
    "Independent learning",
    "Career readiness",
    "Scientific curiosity",
    "Mathematical clarity",
    "Language mastery",
    "Digital literacy",
    "Critical reasoning",
    "Moral strength",
    "Collaborative spirit",
  ],
  actions: [
    "practice consistently",
    "review small lessons daily",
    "ask better questions",
    "teach what you learn",
    "take notes with intention",
    "solve one more problem",
    "learn from mistakes quickly",
    "stay curious under pressure",
    "build concepts before speed",
    "reflect after every study session",
    "connect ideas across subjects",
    "protect focused study time",
    "read beyond the syllabus",
    "test yourself regularly",
    "return to weak chapters early",
  ],
  outcomes: [
    "progress becomes visible",
    "difficult chapters become manageable",
    "confidence replaces doubt",
    "results improve steadily",
    "memory becomes stronger",
    "exam pressure becomes lighter",
    "clarity grows faster",
    "skills become reliable",
    "decisions become smarter",
    "learning becomes enjoyable",
    "discipline becomes natural",
    "goals feel achievable",
    "mistakes turn into momentum",
    "your foundation becomes stronger",
    "consistency starts compounding",
  ],
  reflections: [
    "one page at a time",
    "one concept at a time",
    "one day at a time",
    "one honest effort at a time",
    "one focused session at a time",
    "one better habit at a time",
  ],
  authors: [
    "Freeducation",
    "Learning Desk",
    "Study Coach",
    "Academic Mentor",
    "Classroom Insight",
    "Daily Revision",
    "Exam Guide",
    "Focus Notebook",
    "Concept Lab",
    "Practice Planner",
    "Scholar Journal",
    "Learning Compass",
  ],
};

function buildHomeQuotes(limit = 1200) {
  const maxCount = Math.max(1000, Number(limit) || 1200);
  const output = [...HOME_QUOTE_SEEDS];
  const uniqueTexts = new Set(output.map((entry) => String(entry?.text || "").trim()).filter(Boolean));
  const { topics, actions, outcomes, reflections, authors } = HOME_QUOTE_COMPONENTS;

  outer:
  for (let i = 0; i < topics.length; i += 1) {
    for (let j = 0; j < actions.length; j += 1) {
      for (let k = 0; k < outcomes.length; k += 1) {
        for (let m = 0; m < reflections.length; m += 1) {
          const text = `${topics[i]} grows when you ${actions[j]}; ${outcomes[k]}, ${reflections[m]}.`;
          if (uniqueTexts.has(text)) continue;
          uniqueTexts.add(text);
          output.push({ text, author: authors[(output.length - 1) % authors.length] });
          if (output.length >= maxCount) break outer;
        }
      }
    }
  }

  return output;
}

const HOME_QUOTES = buildHomeQuotes(1200);

const HOME_STYLE = `
${SITE_LOGO_CSS}
.home-cover{position:relative;overflow:hidden;display:grid;align-items:center;padding:12px 14px;min-height:148px;background:linear-gradient(145deg,color-mix(in srgb,var(--surface) 86%,var(--accent) 14%),color-mix(in srgb,var(--surface-strong) 94%,#000 6%));border-bottom:1px solid var(--border);isolation:isolate}
body[data-theme='light'] .home-cover{background:linear-gradient(145deg,color-mix(in srgb,var(--surface) 93%,#fff 7%),color-mix(in srgb,var(--surface-soft) 84%,var(--accent) 16%))}
.home-cover::before{content:'';position:absolute;right:-72px;top:-64px;width:210px;height:210px;border-radius:999px;pointer-events:none;opacity:.25;background:radial-gradient(circle,color-mix(in srgb,var(--accent) 55%,#fff 45%) 0%,transparent 68%);z-index:0}
.home-cover::after{content:'';position:absolute;left:-56px;bottom:-74px;width:180px;height:180px;border-radius:999px;pointer-events:none;opacity:.14;background:radial-gradient(circle,color-mix(in srgb,var(--accent) 62%,#fff 38%) 0%,transparent 70%);z-index:0}
.home-cover-inner{position:relative;z-index:1;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.2fr);align-items:center;gap:12px;width:100%}
.home-cover-title{margin:0;display:inline-flex;justify-self:start;max-width:min(100%,310px)}
.home-cover-title .site-logo{width:100%}
.home-cover-quote{margin:0;display:grid;gap:8px;padding:10px 12px;border:1px solid color-mix(in srgb,var(--border) 70%,var(--accent) 30%);border-radius:12px;background:color-mix(in srgb,var(--surface) 84%,transparent);min-height:94px;align-content:space-between}
.home-cover-quote p{margin:0;color:var(--text);font-family:Georgia,'Times New Roman',serif;font-size:clamp(.96rem,1.6vw,1.08rem);font-weight:500;line-height:1.35;letter-spacing:.01em;word-break:break-word;overflow-wrap:anywhere}
.home-cover-quote-foot{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}
.home-cover-quote cite{font-style:normal;color:var(--text-muted);font-size:.78rem;letter-spacing:.05em;text-transform:uppercase}
.home-cover-accent{display:none}
.home-academics{display:grid;gap:14px;padding:14px var(--space-2) var(--space-3);background:var(--surface)}
.home-academics-head{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap}
.home-academics-head h2{margin:0;font-size:1.05rem;letter-spacing:.01em}
.home-academics-all{height:34px;border:1px solid var(--border);border-radius:999px;padding:0 12px;display:inline-flex;align-items:center;gap:6px;background:var(--surface-soft);color:var(--text);text-decoration:none;font-weight:700}
.home-class-rail{display:grid;grid-auto-flow:column;grid-auto-columns:clamp(130px,14vw,182px);gap:12px;overflow:auto;padding:2px 0 6px;scrollbar-width:thin}
.home-class-rail::-webkit-scrollbar{height:8px}
.home-class-rail::-webkit-scrollbar-thumb{background:color-mix(in srgb,var(--border) 78%,transparent);border-radius:999px}
.home-class-card{display:grid;gap:0;min-width:0}
.home-class-link{display:grid;gap:0;text-decoration:none;color:inherit}
.home-class-poster{position:relative;aspect-ratio:2/3;border-radius:12px;overflow:hidden;background:linear-gradient(145deg,color-mix(in srgb,var(--surface-strong) 28%,#d8e3f3),color-mix(in srgb,var(--accent) 34%,#8799b6))}
.home-class-poster img{display:block;width:100%;height:100%;object-fit:cover}
.home-class-poster-fallback{position:absolute;inset:0;display:grid;place-items:center;font-size:1rem;font-weight:800;letter-spacing:.03em;color:#f4f8ff;background:linear-gradient(145deg,color-mix(in srgb,var(--accent) 38%,#4b658b),color-mix(in srgb,var(--accent) 62%,#233a60))}
.home-class-name{margin:0;padding:8px 2px 0;font-size:.9rem;line-height:1.15;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.home-class-empty{margin:0;padding:14px;border:1px dashed var(--border);border-radius:10px;color:var(--text-muted)}
.home-all-page{display:grid;gap:14px;padding:14px var(--space-2) var(--space-3)}
.home-all-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(132px,1fr));gap:14px}
@media (max-width:900px){
  .home-cover{padding:10px 12px;min-height:138px}
  .home-cover-inner{grid-template-columns:1fr;gap:9px}
  .home-cover-title{max-width:min(100%,248px)}
  .home-cover-quote{min-height:86px;padding:9px 10px}
}
@media (max-width:760px){
  .home-cover{padding:10px;min-height:132px}
  .home-cover-title{max-width:min(100%,210px)}
  .home-cover-quote{min-height:82px;padding:8px 9px;border-radius:10px}
  .home-cover-quote p{font-size:.95rem;line-height:1.33}
  .home-class-rail{grid-auto-columns:44vw;gap:10px}
  .home-all-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
}
`;

const HOME_SCRIPT = `
(() => {
  const quoteText = document.getElementById('homeQuoteText');
  const quoteAuthor = document.getElementById('homeQuoteAuthor');
  if (!(quoteText instanceof HTMLElement) || !(quoteAuthor instanceof HTMLElement)) return;

  const seeds = ${JSON.stringify(HOME_QUOTE_SEEDS)};
  const components = ${JSON.stringify(HOME_QUOTE_COMPONENTS)};
  const limit = 1200;

  const buildQuotes = () => {
    const quotes = Array.isArray(seeds) ? [...seeds] : [];
    const topics = Array.isArray(components?.topics) ? components.topics : [];
    const actions = Array.isArray(components?.actions) ? components.actions : [];
    const outcomes = Array.isArray(components?.outcomes) ? components.outcomes : [];
    const reflections = Array.isArray(components?.reflections) ? components.reflections : [];
    const authors = Array.isArray(components?.authors) ? components.authors : ['Freeducation'];
    const unique = new Set(quotes.map((entry) => String(entry?.text || '').trim()).filter(Boolean));

    outer:
    for (let i = 0; i < topics.length; i += 1) {
      for (let j = 0; j < actions.length; j += 1) {
        for (let k = 0; k < outcomes.length; k += 1) {
          for (let m = 0; m < reflections.length; m += 1) {
            const text = topics[i] + ' grows when you ' + actions[j] + '; ' + outcomes[k] + ', ' + reflections[m] + '.';
            if (unique.has(text)) continue;
            unique.add(text);
            quotes.push({ text, author: authors[(quotes.length - 1) % authors.length] });
            if (quotes.length >= limit) break outer;
          }
        }
      }
    }

    return quotes;
  };

  const quotes = buildQuotes();
  if (!quotes.length) return;

  let index = Math.floor(Math.random() * quotes.length);
  let timer = 0;

  const show = () => {
    const entry = quotes[index] || {};
    quoteText.textContent = String(entry.text || '');
    quoteAuthor.textContent = entry.author ? ('- ' + String(entry.author)) : '';
  };

  const next = () => {
    index = (index + 1) % quotes.length;
    show();
  };

  show();
  timer = window.setInterval(next, 5600);

  if (typeof window.__registerCleanup === 'function') {
    window.__registerCleanup(() => {
      if (timer) window.clearInterval(timer);
      timer = 0;
    });
  }
})();
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
  return `<section class="home-academics" aria-label="Academic classes"><header class="home-academics-head"><h2>Academic</h2><a class="home-academics-all" href="/classes">See all <span aria-hidden="true">&rsaquo;</span></a></header>${rows.length ? `<div class="home-class-rail">${rows.map((item) => classCardMarkup(item)).join("")}</div>` : `<p class="home-class-empty">No classes are marked for homepage yet.</p>`}</section>`;
}

function allClassesMarkup(classes = []) {
  const rows = Array.isArray(classes) ? classes : [];
  return `<section class="home-all-page" aria-label="All classes"><header class="home-academics-head"><h2>All Classes</h2><a class="home-academics-all" href="/">Back home <span aria-hidden="true">&lsaquo;</span></a></header>${rows.length ? `<div class="home-all-grid">${rows.map((item) => classCardMarkup(item)).join("")}</div>` : `<p class="home-class-empty">No classes found.</p>`}</section>`;
}

export function homePage({ user, featuredClasses = [], allClasses = [], showAllClasses = false } = {}) {
  const currentUser = user || null;
  const loggedIn = Boolean(currentUser);
  const staticQuote = HOME_QUOTES[0] || { text: "", author: "" };
  const quoteText = String(staticQuote.text || "");
  const quoteAuthor = staticQuote.author ? `- ${staticQuote.author}` : "";
  const coverMarkup = `<section class="home-cover" aria-label="${APP_NAME} welcome banner"><span class="home-cover-accent" aria-hidden="true"></span><div class="home-cover-inner"><h1 class="home-cover-title">${renderSiteLogo({ className: "site-logo site-logo--block", label: APP_NAME })}</h1><blockquote class="home-cover-quote" aria-live="polite"><p id="homeQuoteText">${escapeHtml(quoteText)}</p><footer class="home-cover-quote-foot"><cite id="homeQuoteAuthor">${escapeHtml(quoteAuthor)}</cite></footer></blockquote></div></section>`;
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
    script: HOME_SCRIPT,
    contentClass: "app-content-flush",
    content: bodyContent,
  });
}
