import { renderBrand } from "./brand";

type HeaderProps = {
  user?: { name: string };
};

export function renderAppHeader({ user }: HeaderProps) {
  const userLabel = user ? user.name : "Admin Console";
  return `
    <header class="app-header">
      ${renderBrand({ title: "Freeducation", subtitle: "Admin Workspace" })}
      <div class="header-actions">
        <span class="user-chip">${userLabel}</span>
      </div>
    </header>
  `;
}
