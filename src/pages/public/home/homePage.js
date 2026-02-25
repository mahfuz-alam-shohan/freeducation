import { publicShell } from "../../templates/publicShell.js";
import { siteLogo } from "../../templates/icons.js";
import { homePageStyles } from "./homePageStyles.js";

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
  quoteElement.classList.add('is-visible');
  setInterval(() => {
    quoteElement.classList.remove('is-visible');
    index = (index + 1) % quotes.length;
    setTimeout(() => {
      quoteElement.textContent = quotes[index];
      quoteElement.classList.add('is-visible');
    }, 170);
  }, 3600);
})();
`;

export function publicHomePage(user = null) {
  return publicShell(
    "home",
    user,
    "Freeducation",
    `<section class="public-home-cover">
      <span class="public-cover-orb public-cover-orb-left" aria-hidden="true"></span>
      <span class="public-cover-orb public-cover-orb-right" aria-hidden="true"></span>
      <div class="public-cover-brand-block">
        <div class="public-cover-brand-row">
          <span class="public-cover-logo" aria-hidden="true">${siteLogo}</span>
          <h1 class="public-cover-name">freeducation</h1>
        </div>
        <p class="public-cover-subtitle">Learn clearly. Move steadily. Succeed daily.</p>
      </div>
      <div class="public-cover-quote-wrap">
        <span class="public-cover-quote-label">Daily quote</span>
        <p class="public-cover-quote" data-education-quote></p>
      </div>
    </section>`,
    quoteScript,
    homePageStyles,
  );
}
