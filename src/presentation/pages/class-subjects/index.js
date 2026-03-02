import { renderAppShellLayout } from "../../layout/appShell/index.js";
import { classSubjectsHtml } from "./html.js";
import { CLASS_SUBJECTS_STYLE } from "./style.js";
import { classSubjectsScript } from "./script.js";

export function classSubjectsPage(user, options = {}) {
  const apiBase = String(options.apiBase || "/api/workspace");
  const classId = Number(options.classId || 0);
  return renderAppShellLayout({
    title: "Class Subjects",
    activeMenu: "classes",
    user,
    apiBase,
    content: classSubjectsHtml(),
    pageClass: "page-class-subjects",
    pageStyles: CLASS_SUBJECTS_STYLE,
    script: classSubjectsScript(classId, apiBase),
  });
}

