import { publicShell } from "../../templates/publicShell.js";
import { siteLogo } from "../../templates/icons.js";
import { homePageStyles } from "./homePageStyles.js";
import { renderCardGrid, renderFlatPage } from "./publicUi.js";

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
      <div class="public-cover-brand-block">
        <div class="public-cover-brand-row">
          <span class="public-cover-logo" aria-hidden="true">${siteLogo}</span>
          <h1 class="public-cover-name">freeducation</h1>
        </div>
        <p class="public-cover-subtitle">Learn by class, continue by subject, and keep your study flow simple on every device.</p>
      </div>
      <div class="public-cover-quote-wrap">
        <span class="public-cover-quote-label">Daily quote</span>
        <p class="public-cover-quote" data-education-quote></p>
      </div>
    </section>
    <section class="public-class-strip">
      <div class="public-class-strip-head">
        <h2 class="public-class-strip-title">Academic Classes</h2>
        <a class="public-class-see-all" href="/classes">See all</a>
      </div>
      <div class="public-class-row">${renderCardGrid(classes, (item) => `/classes/${item.id}`, { metaBuilder: () => "Open" })}</div>
    </section>`,
    quoteScript,
    homePageStyles,
  );
}

export function publicClassesPage(user = null, classes = []) {
  return publicShell(
    "home",
    user,
    "All Classes",
    renderFlatPage({
      title: "All Classes",
      subtitle: "Choose your class to continue.",
      content: `<div class="public-class-grid">${renderCardGrid(classes, (item) => `/classes/${item.id}`)}</div>`,
    }),
    "",
    homePageStyles,
  );
}

export function publicClassSubjectsPage(user = null, classItem, subjects = []) {
  return publicShell(
    "home",
    user,
    `${classItem.name} Subjects`,
    renderFlatPage({
      title: classItem.name,
      subtitle: "Select a subject.",
      content: `<div class="public-flat-grid">${renderCardGrid(subjects, (subject) => `/learn/subjects/${subject.id}`)}</div>`,
    }),
    "",
    homePageStyles,
  );
}
