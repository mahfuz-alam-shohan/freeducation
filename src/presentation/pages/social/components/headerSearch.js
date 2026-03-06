import { APP_NAME } from "../../../../config/index.js";
import { renderSiteLogo } from "../../../layout/siteLogo.js";

const SEARCH_ICON = `<svg class="app-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.4-3.4"></path></svg>`;

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function renderSocialHeaderSearch(query = "") {
  const safeQuery = escapeHtml(query);
  return `
    <div id="socialHeaderSearchRoot" class="social-header-search" role="search" aria-label="Search profiles" data-open="0">
      <a class="social-header-brand" href="/social" aria-label="${APP_NAME} social home">
        ${renderSiteLogo({ className: "site-logo site-logo--block social-header-brand-logo", label: APP_NAME })}
      </a>
      <button id="socialHeaderSearchToggle" class="social-header-search-toggle" type="button" aria-label="Open search" aria-expanded="false">
        ${SEARCH_ICON}
      </button>
      <div class="social-header-search-panel">
        <form id="socialHeaderSearchForm" class="social-header-search-form" action="/social/search" method="get" autocomplete="off">
          <span class="social-header-search-icon" aria-hidden="true">${SEARCH_ICON}</span>
          <input id="socialHeaderSearchInput" name="q" type="search" maxlength="120" value="${safeQuery}" placeholder="Search profiles" aria-label="Search profiles by name, email, or role">
          <button id="socialHeaderSearchClear" class="social-header-search-clear" type="button" aria-label="Clear search" hidden>&times;</button>
        </form>
        <div id="socialHeaderSearchDropdown" class="social-header-search-dropdown" hidden></div>
      </div>
    </div>
  `;
}
