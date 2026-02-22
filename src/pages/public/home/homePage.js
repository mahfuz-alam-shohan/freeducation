import { publicShell } from "../../templates/publicShell.js";
import { siteLogo } from "../../templates/icons.js";
import { imageUrlFromKey } from "../../imageUrl.js";
import { publicHomeStyles } from "./homeStyles.js";

function h(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function pathBar(items = []) {
  if (!items.length) return "";
  const links = items
    .map((item, index) => {
      const label = h(item.label);
      if (!item.href || index === items.length - 1) return `<span class="public-path-current">${label}</span>`;
      return `<a href="${h(item.href)}">${label}</a>`;
    })
    .join('<span class="public-path-sep" aria-hidden="true">/</span>');
  return `<nav class="public-path-bar" aria-label="Breadcrumb">${links}</nav>`;
}

function classCardsMarkup(classes = [], makeHref = (item) => `/classes/${item.id}`) {
  return classes
    .map(
      (item) => `<article class="class-card">
        <a class="public-card-link" href="${h(makeHref(item))}">
          <div class="class-card-poster-wrap">${item.image_key ? `<img class="class-card-poster" src="${imageUrlFromKey(item.image_key)}" alt="${h(item.name)}" loading="lazy" decoding="async" />` : '<div class="class-card-poster class-card-poster-empty">No image</div>'}</div>
          <p class="class-card-name">${h(item.name)}</p>
          <p class="class-card-meta">Tap to start lessons</p>
        </a>
      </article>`,
    )
    .join("");
}

function subjectCardsMarkup(subjects = []) {
  return subjects
    .map(
      (subject) => `<article class="class-card">
        <a class="public-card-link" href="/learn/subjects/${subject.id}">
          <div class="class-card-poster-wrap">${subject.image_key ? `<img class="class-card-poster" src="${imageUrlFromKey(subject.image_key)}" alt="${h(subject.name)}" loading="lazy" decoding="async" />` : '<div class="class-card-poster class-card-poster-empty">No image</div>'}</div>
          <p class="class-card-name">${h(subject.name)}</p>
        </a>
      </article>`,
    )
    .join("");
}

const quoteScript = `
(() => {
  const quotes = [
    'Education is the most powerful weapon which you can use to change the world. — Nelson Mandela',
    'The roots of education are bitter, but the fruit is sweet. — Aristotle',
    'An investment in knowledge pays the best interest. — Benjamin Franklin',
    'Live as if you were to die tomorrow. Learn as if you were to live forever. — Mahatma Gandhi'
  ];

  const quoteElement = document.querySelector('[data-education-quote]');
  if (!quoteElement) return;

  let index = 0;
  quoteElement.textContent = quotes[index];
  setInterval(() => {
    index = (index + 1) % quotes.length;
    quoteElement.textContent = quotes[index];
  }, 3600);
})();
`;

export function publicHomePage(user = null, classes = []) {
  return publicShell(
    "home",
    user,
    "Freeducation",
    `<section class="public-home-cover">
      <div class="public-cover-brand-row">
        <span class="public-cover-logo" aria-hidden="true">${siteLogo}</span>
        <h1 class="public-cover-name">freeducation</h1>
      </div>
      <div class="public-cover-quote-wrap">
        <p class="public-cover-quote" data-education-quote></p>
      </div>
    </section>
    <section class="public-class-strip">
      <div class="public-class-strip-head">
        <h2 class="public-class-strip-title">Academic Classes</h2>
        <a class="public-class-see-all" href="/classes">See all</a>
      </div>
      <div class="public-class-row">${classCardsMarkup(classes)}</div>
    </section>`,
    quoteScript,
    publicHomeStyles,
  );
}

export function publicClassesPage(user = null, classes = []) {
  return publicShell(
    "home",
    user,
    "All Classes",
    `${pathBar([{ label: "Home", href: "/" }, { label: "Classes" }])}<section class="public-class-strip public-class-page">
      <div class="public-class-strip-head">
        <h1 class="public-class-strip-title">All Classes</h1>
      </div>
      <div class="public-class-grid">${classCardsMarkup(classes)}</div>
    </section>`,
    "",
    publicHomeStyles,
  );
}

export function publicClassSubjectsPage(user = null, classItem, subjects = []) {
  return publicShell(
    "home",
    user,
    `${classItem.name} Subjects`,
    `${pathBar([{ label: "Home", href: "/" }, { label: "Classes", href: "/classes" }, { label: classItem.name }])}<section class="public-stack">
      <h1 class="public-stack-title">${h(classItem.name)}</h1>
      <p class="public-stack-subtitle">Select a subject.</p>
      <div class="public-flat-grid">${subjectCardsMarkup(subjects)}</div>
    </section>`,
    "",
    publicHomeStyles,
  );
}
