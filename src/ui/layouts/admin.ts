import { renderDocument } from "./document";
import { baseStyles } from "../styles/base";
import { renderAppHeader } from "../components/header";
import { renderBottomNav } from "../components/navigation";
import { renderBreadcrumbs } from "../components/breadcrumbs";
import { SCRIPTS } from "../scripts";

type AdminPageOptions = {
  title: string;
  content: string;
  activeTab: string;
  user?: { name: string };
  breadcrumbs?: string;
};

export function renderPage(title: string, content: string, activeTab: string, user?: { name: string }, breadcrumbs?: string): Response {
  return renderAdminPage({ title, content, activeTab, user, breadcrumbs });
}

export function renderAdminPage({ title, content, activeTab, user, breadcrumbs }: AdminPageOptions): Response {
  const nav = user ? renderBottomNav(activeTab) : "";
  const crumbs = renderBreadcrumbs(breadcrumbs);
  const body = `
    <div class="app-shell">
      <div class="app-frame">
        ${renderAppHeader({ user })}
        <div class="app-body">
          <main class="container">
            ${crumbs}
            ${content}
          </main>
        </div>
        ${nav}
      </div>
    </div>
  `;

  return renderDocument({
    title: `${title} | Admin`,
    styles: [baseStyles],
    body,
    scripts: SCRIPTS
  });
}
