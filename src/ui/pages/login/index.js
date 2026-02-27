import { LOGGED_OUT_NAV_SECTIONS } from "../../config/navigation.js";
import { renderAdminLayout } from "../../layout/adminLayout.js";
import { loginHtml } from "./html.js";
import { LOGIN_STYLE } from "./style.js";
import { LOGIN_SCRIPT } from "./script.js";

export function loginPage() {
  return renderAdminLayout({
    title: "Campus login",
    activeMenu: "login",
    navItems: LOGGED_OUT_NAV_SECTIONS,
    content: loginHtml(),
    pageClass: "page-login",
    pageStyles: LOGIN_STYLE,
    script: LOGIN_SCRIPT,
  });
}
