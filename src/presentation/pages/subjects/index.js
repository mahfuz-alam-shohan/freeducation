import { renderAppShellLayout } from "../../layout/appShell/index.js";
import { subjectsHtml } from "./html.js";
import { SUBJECTS_STYLE } from "./style.js";
import { subjectsScript } from "./script.js";

export function subjectsPage(user, options = {}) {
  const apiBase = String(options.apiBase || "/api/workspace");
  return renderAppShellLayout({
    title: "Subjects",
    activeMenu: "subjects",
    user,
    apiBase,
    content: subjectsHtml(),
    pageClass: "page-subjects",
    pageStyles: SUBJECTS_STYLE,
    script: subjectsScript(apiBase),
  });
}
