import { renderAppShellLayout } from "../../layout/appShell/index.js";
import { CONTENT_MODULES } from "../../../shared/modules/contentModules.js";
import { subjectHtml } from "./html.js";
import { SUBJECT_STYLE } from "./style.js";
import { subjectScript } from "./script.js";

export function subjectPage(user, options = {}) {
  const subjectId = Number(options.subjectId || 0);
  const apiBase = String(options.apiBase || "/api/workspace");
  const contentModules = CONTENT_MODULES.map((item) => ({
    key: item.key,
    label: item.label,
    editable: Boolean(item.editable),
  }));

  return renderAppShellLayout({
    title: "Subject",
    activeMenu: "subjects",
    user,
    apiBase,
    content: subjectHtml(subjectId),
    pageClass: "page-subject",
    pageStyles: SUBJECT_STYLE,
    script: subjectScript(subjectId, apiBase, contentModules),
  });
}
