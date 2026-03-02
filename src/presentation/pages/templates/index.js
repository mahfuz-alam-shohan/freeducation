import { renderAppShellLayout } from "../../layout/appShell/index.js";
import { templatesHtml } from "./html.js";
import { TEMPLATES_STYLE } from "./style.js";
import { templatesScript } from "./script.js";

export function templatesPage(user, options = {}) {
  const apiBase = String(options.apiBase || "/api/workspace");
  return renderAppShellLayout({
    title: "Templates",
    activeMenu: "templates",
    user,
    apiBase,
    content: templatesHtml(),
    pageClass: "page-templates",
    pageStyles: TEMPLATES_STYLE,
    script: templatesScript(apiBase),
  });
}
