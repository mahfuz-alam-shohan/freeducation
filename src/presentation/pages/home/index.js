import { APP_NAME } from "../../../config/index.js";
import { USER_TYPES } from "../../../shared/auth/roles.js";
import { PRIMARY_NAV_SECTIONS, LOGGED_OUT_NAV_SECTIONS, STUDENT_NAV_SECTIONS, TEACHER_NAV_SECTIONS } from "../../config/navigation.js";
import { renderAppShellLayout } from "../../layout/appShell/index.js";
import { SITE_LOGO_CSS, renderSiteLogo } from "../../layout/siteLogo.js";

const HOME_QUOTES = [
  { text: "Education is the most powerful weapon to change the world.", author: "Nelson Mandela" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
  { text: "The roots of education are bitter, but the fruit is sweet.", author: "Aristotle" },
  { text: "Study the past if you would define the future.", author: "Confucius" },
  { text: "The only true wisdom is in knowing you know nothing.", author: "Socrates" },
  { text: "The mind is not a vessel to be filled, but a fire to be ignited.", author: "Plutarch" },
  { text: "Knowledge is power.", author: "Francis Bacon" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { text: "Education is not preparation for life; education is life itself.", author: "John Dewey" },
  { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
  { text: "The future belongs to those who prepare for it today.", author: "Malcolm X" },
  { text: "He who opens a school door, closes a prison.", author: "Victor Hugo" },
  { text: "The whole purpose of education is to turn mirrors into windows.", author: "Sydney J. Harris" },
  { text: "Education is what remains after one has forgotten what one has learned in school.", author: "Albert Einstein" },
  { text: "I never teach my pupils. I only attempt to provide the conditions in which they can learn.", author: "Albert Einstein" },
  { text: "The important thing is not to stop questioning.", author: "Albert Einstein" },
  { text: "Anyone who has never made a mistake has never tried anything new.", author: "Albert Einstein" },
  { text: "It is not that I'm so smart. But I stay with the questions much longer.", author: "Albert Einstein" },
  { text: "Education is a progressive discovery of our own ignorance.", author: "Will Durant" },
  { text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.", author: "Dr. Seuss" },
  { text: "Never let formal education get in the way of your learning.", author: "Mark Twain" },
  { text: "A person who won't read has no advantage over one who can't read.", author: "Mark Twain" },
  { text: "Reading is to the mind what exercise is to the body.", author: "Joseph Addison" },
  { text: "A room without books is like a body without a soul.", author: "Cicero" },
  { text: "I am still learning.", author: "Michelangelo" },
  { text: "The mind once enlightened cannot again become dark.", author: "Thomas Paine" },
  { text: "You cannot teach a man anything; you can only help him find it within himself.", author: "Galileo Galilei" },
  { text: "The purpose of education is to replace an empty mind with an open one.", author: "Malcolm Forbes" },
  { text: "Change is the end result of all true learning.", author: "Leo Buscaglia" },
  { text: "Study hard what interests you the most in the most undisciplined, irreverent and original manner possible.", author: "Richard Feynman" },
  { text: "Knowledge speaks, but wisdom listens.", author: "Jimi Hendrix" },
  { text: "Educating the mind without educating the heart is no education at all.", author: "Aristotle" },
  { text: "The function of education is to teach one to think intensively and to think critically. Intelligence plus character - that is the goal of true education.", author: "Martin Luther King Jr." },
  { text: "Knowledge will bring you the opportunity to make a difference.", author: "Claire Fagin" },
  { text: "Learning is not attained by chance, it must be sought for with ardor and attended to with diligence.", author: "Abigail Adams" },
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { text: "Genius is one percent inspiration and ninety-nine percent perspiration.", author: "Thomas Edison" },
  { text: "Knowing is not enough; we must apply. Willing is not enough; we must do.", author: "Johann Wolfgang von Goethe" },
  { text: "Quality is not an act, it is a habit.", author: "Aristotle" },
  { text: "If you want to lift yourself up, lift up someone else.", author: "Booker T. Washington" },
  { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "Act as if what you do makes a difference. It does.", author: "William James" },
  { text: "The journey of a thousand miles begins with one step.", author: "Lao Tzu" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Our greatest glory is not in never falling, but in rising every time we fall.", author: "Confucius" },
  { text: "Happiness depends upon ourselves.", author: "Aristotle" },
  { text: "The unexamined life is not worth living.", author: "Socrates" },
  { text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson" },
  { text: "You must be the change you wish to see in the world.", author: "Mahatma Gandhi" },
  { text: "It always seems impossible until it is done.", author: "Nelson Mandela" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "The best way to predict the future is to create it.", author: "Peter Drucker" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
  { text: "When you know better, you do better.", author: "Maya Angelou" },
  { text: "Turn your wounds into wisdom.", author: "Oprah Winfrey" },
  { text: "Well done is better than well said.", author: "Benjamin Franklin" },
  { text: "Tell me and I forget. Teach me and I remember. Involve me and I learn.", author: "Benjamin Franklin" },
  { text: "Develop a passion for learning. If you do, you will never cease to grow.", author: "Anthony J. D'Angelo" },
  { text: "Education does not change the world. Education changes people. People change the world.", author: "Paulo Freire" },
  { text: "Try not to become a man of success, but rather try to become a man of value.", author: "Albert Einstein" },
  { text: "The measure of intelligence is the ability to change.", author: "Albert Einstein" },
  { text: "Life is really simple, but we insist on making it complicated.", author: "Confucius" },
  { text: "Knowing yourself is the beginning of all wisdom.", author: "Aristotle" },
  { text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde" },
  { text: "What we think, we become.", author: "Buddha" },
  { text: "The only source of knowledge is experience.", author: "Albert Einstein" },
  { text: "The greatest enemy of knowledge is not ignorance, it is the illusion of knowledge.", author: "Stephen Hawking" },
  { text: "Dream, dream, dream. Dreams transform into thoughts and thoughts result in action.", author: "A. P. J. Abdul Kalam" },
  { text: "Small aim is a crime; have great aim.", author: "A. P. J. Abdul Kalam" },
  { text: "Arise, awake, and stop not till the goal is reached.", author: "Swami Vivekananda" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
  { text: "Formal education will make you a living; self-education will make you a fortune.", author: "Jim Rohn" },
];

const HOME_STYLE = `
${SITE_LOGO_CSS}
.page-home .app-content{
  background:var(--page-bg);
}
.home-cover{position:relative;overflow:hidden;display:grid;align-items:center;padding:18px 18px 14px;min-height:218px;background:linear-gradient(145deg,color-mix(in srgb,var(--surface) 82%,var(--accent) 18%),color-mix(in srgb,var(--surface-strong) 90%,var(--page-bg) 10%));border-bottom:1px solid color-mix(in srgb,var(--border) 78%,var(--accent) 22%);isolation:isolate}
body[data-theme='light'] .home-cover{background:linear-gradient(145deg,color-mix(in srgb,var(--surface) 92%,var(--page-bg) 8%),color-mix(in srgb,var(--surface-soft) 82%,var(--accent) 18%))}
.home-cover::before{content:'';position:absolute;right:-92px;top:-76px;width:300px;height:300px;border-radius:999px;pointer-events:none;opacity:.3;background:radial-gradient(circle,color-mix(in srgb,var(--accent) 58%,var(--surface) 42%) 0%,transparent 68%);z-index:0}
.home-cover::after{content:'';position:absolute;left:-86px;bottom:-112px;width:260px;height:260px;border-radius:999px;pointer-events:none;opacity:.18;background:radial-gradient(circle,color-mix(in srgb,var(--accent) 64%,var(--surface) 36%) 0%,transparent 70%);z-index:0}
.home-cover-inner{position:relative;z-index:1;display:grid;grid-template-columns:minmax(0,1.6fr) minmax(0,1fr);align-items:center;gap:18px;width:100%}
.home-cover-title{margin:0;display:inline-flex;justify-self:start;max-width:min(100%,980px)}
.home-cover-title .site-logo{width:auto;max-width:100%}
.home-cover-title .site-logo-wordmark{font-size:clamp(2.7rem,5.8vw,5rem);line-height:1.01;letter-spacing:.01em;color:color-mix(in srgb,var(--accent) 72%,#0f325f)}
.home-cover-quote{margin:0;display:grid;gap:8px;padding:12px 14px;border:1px solid color-mix(in srgb,var(--border) 66%,var(--accent) 34%);border-radius:12px;background:color-mix(in srgb,var(--surface) 80%,transparent);min-height:94px;align-content:space-between}
.home-cover-quote p{margin:0;color:var(--text);font-family:Georgia,'Times New Roman',serif;font-size:clamp(.96rem,1.6vw,1.08rem);font-weight:500;line-height:1.35;letter-spacing:.01em;word-break:break-word;overflow-wrap:anywhere}
.home-cover-quote-foot{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}
.home-cover-quote cite{font-style:normal;color:var(--text-muted);font-size:.78rem;letter-spacing:.05em;text-transform:uppercase}
.home-cover-accent{display:none}
.home-academics{display:grid;gap:14px;padding:14px var(--space-2) var(--space-3);background:transparent}
.home-academics-head{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap}
.home-academics-head h2{margin:0;font-size:1.05rem;letter-spacing:.01em}
.home-academics-all{height:34px;border:1px solid var(--border);border-radius:999px;padding:0 12px;display:inline-flex;align-items:center;gap:6px;background:var(--surface-soft);color:var(--text);text-decoration:none;font-weight:700}
.home-class-rail{display:grid;grid-auto-flow:column;grid-auto-columns:clamp(130px,14vw,182px);gap:12px;overflow:auto;padding:2px 0 6px;scrollbar-width:thin}
.home-class-rail::-webkit-scrollbar{height:8px}
.home-class-rail::-webkit-scrollbar-thumb{background:color-mix(in srgb,var(--border) 78%,transparent);border-radius:999px}
.home-class-card{display:grid;gap:0;min-width:0}
.home-class-link{display:grid;gap:0;text-decoration:none;color:inherit}
.home-class-poster{position:relative;aspect-ratio:2/3;border-radius:12px;overflow:hidden;border:1px solid var(--border);background:linear-gradient(145deg,color-mix(in srgb,var(--surface-strong) 82%,var(--surface-soft) 18%),color-mix(in srgb,var(--accent) 20%,var(--surface-soft) 80%))}
.home-class-poster img{display:block;width:100%;height:100%;object-fit:cover}
.home-class-poster-fallback{position:absolute;inset:0;display:grid;place-items:center;font-size:1rem;font-weight:800;letter-spacing:.03em;color:var(--accent-contrast);background:linear-gradient(145deg,color-mix(in srgb,var(--accent) 70%,var(--surface) 30%),color-mix(in srgb,var(--accent) 48%,var(--surface-strong) 52%))}
.home-class-name{margin:0;padding:8px 2px 0;font-size:.9rem;line-height:1.15;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.home-class-empty{margin:0;padding:14px;border:1px dashed var(--border);border-radius:10px;color:var(--text-muted)}
.home-all-page{display:grid;gap:14px;padding:14px var(--space-2) var(--space-3);background:transparent}
.home-all-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(132px,1fr));gap:14px}
@media (max-width:900px){
  .home-cover{padding:14px 12px;min-height:178px}
  .home-cover-inner{grid-template-columns:1fr;gap:9px}
  .home-cover-title{max-width:min(100%,620px);justify-self:center}
  .home-cover-title .site-logo-wordmark{font-size:clamp(2.2rem,9.8vw,3.5rem)}
  .home-cover-quote{min-height:86px;padding:9px 10px}
}
@media (max-width:760px){
  .home-cover{padding:12px 10px;min-height:152px}
  .home-cover-title{max-width:min(100%,420px);justify-self:center}
  .home-cover-title .site-logo-wordmark{font-size:clamp(1.9rem,11vw,2.75rem)}
  .home-cover-quote{width:100%;min-height:82px;padding:8px 9px;border-radius:10px}
  .home-cover-quote p{font-size:.95rem;line-height:1.33}
  .home-class-rail{grid-auto-columns:38vw;gap:8px}
  .home-class-name{font-size:.82rem}
  .home-all-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
}
@media (max-width:430px){
  .home-class-rail{grid-auto-columns:42vw}
  .home-all-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@media (max-width:760px) and (orientation:portrait){
  .home-class-rail{grid-auto-columns:32vw;gap:7px}
  .home-all-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:7px}
  .home-class-poster{border-radius:10px}
  .home-class-name{font-size:.76rem;padding-top:5px}
}
`;
const HOME_SCRIPT = `
(() => {
  const quoteText = document.getElementById('homeQuoteText');
  const quoteAuthor = document.getElementById('homeQuoteAuthor');
  if (!(quoteText instanceof HTMLElement) || !(quoteAuthor instanceof HTMLElement)) return;

  const quotes = ${JSON.stringify(HOME_QUOTES)};
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
    shellScope: "public",
    content: bodyContent,
  });
}

