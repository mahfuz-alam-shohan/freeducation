import { renderDocument } from "../layouts/document";
import { baseStyles } from "../styles/base";
import { homeStyles } from "../styles/home";
import { renderHomeCard } from "../components/home/card";

export function renderHomePage(): Response {
  const body = `
    <div class="home-shell">
      ${renderHomeCard()}
    </div>
  `;

  return renderDocument({
    title: "Freeducation",
    styles: [baseStyles, homeStyles],
    body
  });
}
