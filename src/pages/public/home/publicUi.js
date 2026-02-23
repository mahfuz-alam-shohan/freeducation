import { imageUrlFromKey } from "../../imageUrl.js";

export function h(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderPoster(item, name) {
  if (item?.image_key) {
    return `<img class="class-card-poster" src="${imageUrlFromKey(item.image_key)}" alt="${h(name)}" loading="lazy" decoding="async" />`;
  }
  return '<div class="class-card-poster class-card-poster-empty">No image</div>';
}

export function renderCardGrid(items = [], hrefBuilder, options = {}) {
  const { metaBuilder = null } = options;
  return items
    .map((item) => {
      const name = item.display_name || item.name || "Untitled";
      const meta = typeof metaBuilder === "function" ? metaBuilder(item) : "";
      return `<article class="class-card"><a class="public-card-link" href="${h(hrefBuilder(item))}">
        <div class="class-card-poster-wrap">${renderPoster(item, name)}</div>
        <p class="class-card-name">${h(name)}</p>
        ${meta ? `<p class="class-card-meta">${h(meta)}</p>` : ""}
      </a></article>`;
    })
    .join("");
}

export function renderFlatPage({ title, subtitle = "", content }) {
  return `<section class="public-stack public-stack-flat">
    <header class="public-stack-head">
      <h1 class="public-stack-title">${h(title)}</h1>
      ${subtitle ? `<p class="public-stack-subtitle">${h(subtitle)}</p>` : ""}
    </header>
    ${content}
  </section>`;
}
