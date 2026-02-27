import { renderAdminLayout } from "../../layout/adminLayout.js";
import { profileHtml } from "./html.js";
import { PROFILE_STYLE } from "./style.js";
import { profileScript } from "./script.js";

export function profilePage(admin, options = {}) {
  const apiBase = String(options.apiBase || "/api/admin");
  return renderAdminLayout({
    title: "Profile",
    activeMenu: "profile",
    admin,
    content: profileHtml(admin),
    pageClass: "page-profile",
    pageStyles: PROFILE_STYLE,
    script: profileScript(apiBase),
    ...options,
  });
}
