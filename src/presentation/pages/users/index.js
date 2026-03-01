import { renderAppShellLayout } from "../../layout/appShell/index.js";
import { usersHtml } from "./html.js";
import { USERS_STYLE } from "./style.js";
import { usersScript } from "./script.js";

export function usersPage(user, options = {}) {
  return renderAppShellLayout({
    title: "User management",
    activeMenu: "users",
    user,
    apiBase: String(options.apiBase || ""),
    content: usersHtml(),
    pageClass: "page-users",
    pageStyles: USERS_STYLE,
    script: usersScript(user?.id),
  });
}
