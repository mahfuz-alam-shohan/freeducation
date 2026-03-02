import { renderAppShellLayout } from "../../layout/appShell/index.js";
import { classesHtml } from "./html.js";
import { CLASSES_STYLE } from "./style.js";
import { classesScript } from "./script.js";

export function classesPage(user, options = {}) {
  const apiBase = String(options.apiBase || "/api/workspace");
  return renderAppShellLayout({
    title: "Classes",
    activeMenu: "classes",
    user,
    apiBase,
    content: classesHtml(),
    pageClass: "page-classes",
    pageStyles: CLASSES_STYLE,
    script: classesScript(apiBase),
  });
}

