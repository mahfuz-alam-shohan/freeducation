import { renderAppShellLayout } from "../../layout/appShell/index.js";
import { templateDetailHtml } from "./html.js";
import { TEMPLATE_DETAIL_STYLE } from "./style.js";
import { templateDetailScript } from "./script.js";

export function templateDetailPage(user, options = {}) {
  const templateId = Number(options.templateId || 0);
  const apiBase = String(options.apiBase || "/api/workspace");

  return renderAppShellLayout({
    title: "Template hierarchy",
    activeMenu: "templates",
    user,
    apiBase,
    content: templateDetailHtml(templateId),
    pageClass: "page-template-detail",
    pageStyles: TEMPLATE_DETAIL_STYLE,
    script: templateDetailScript(templateId, apiBase),
  });
}
