export function renderBreadcrumbs(breadcrumbs?: string) {
  if (!breadcrumbs) return "";
  return `<div class="breadcrumbs">${breadcrumbs}</div>`;
}
