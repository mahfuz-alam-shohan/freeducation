import { renderHomeHeader } from "./header";
import { renderHomeHero } from "./hero";

export function renderHomeCard() {
  return `
    <div class="home-card">
      ${renderHomeHeader()}
      ${renderHomeHero()}
    </div>
  `;
}
