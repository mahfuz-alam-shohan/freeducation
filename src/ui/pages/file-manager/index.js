import { renderAdminLayout } from "../../layout/adminLayout.js";
import { fileManagerHtml } from "./html.js";
import { FILE_MANAGER_STYLE } from "./style.js";
import { fileManagerScript } from "./script.js";

export function fileManagerPage(admin) {
  return renderAdminLayout({
    title: "File manager",
    activeMenu: "file-manager",
    admin,
    content: fileManagerHtml(),
    pageClass: "page-file-manager",
    pageStyles: FILE_MANAGER_STYLE,
    script: fileManagerScript(),
  });
}
