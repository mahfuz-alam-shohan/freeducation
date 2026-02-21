import { publicShell } from '../templates/publicShell.js';
import { siteLogo } from '../templates/icons.js';

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

export function publicHomePage(user = null) {
  return publicShell(
    'home',
    user,
    'Freeducation',
    `<section class="public-home-cover">
      <div class="public-cover-brand-row">
        <span class="public-cover-logo" aria-hidden="true">${siteLogo}</span>
        <h1 class="public-cover-name">freeducation</h1>
      </div>
      <p class="public-cover-quote" data-education-quote></p>
    </section>`,
    quoteScript
  );
}
