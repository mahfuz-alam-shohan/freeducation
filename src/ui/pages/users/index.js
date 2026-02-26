import { renderAdminLayout } from "../../layout/adminLayout.js";
import { usersHtml } from "./html.js";
import { USERS_STYLE } from "./style.js";
import { USERS_SCRIPT } from "./script.js";

export function usersPage(admin) {
  return renderAdminLayout({
    title: "User management",
    activeMenu: "users",
    admin,
    content: usersHtml(),
    pageClass: "page-users",
    pageStyles: USERS_STYLE,
    script: USERS_SCRIPT,
  });
}
