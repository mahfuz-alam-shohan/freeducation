import { renderAppShellLayout } from "../../layout/appShell/index.js";
import { fileManagerHtml } from "./html.js";
import { FILE_MANAGER_STYLE } from "./style.js";
import { fileManagerScript } from "./script.js";

export function fileManagerPage(user, options = {}) {
  return renderAppShellLayout({
    title: "File manager",
    activeMenu: "file-manager",
    user,
    apiBase: String(options.apiBase || ""),
    content: fileManagerHtml(),
    pageClass: "page-file-manager",
    pageStyles: FILE_MANAGER_STYLE,
    script: fileManagerScript(),
  });
}
