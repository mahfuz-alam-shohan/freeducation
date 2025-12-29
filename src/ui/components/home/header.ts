import { renderBrand } from "../brand";

export function renderHomeHeader() {
  return `
    <div class="home-header">
      ${renderBrand({ title: "Freeducation", subtitle: "Admin workspace", className: "home-brand" })}
      <a href="/admin" class="btn btn-secondary">Admin Access</a>
    </div>
  `;
}
