import { renderAdminLayout } from "../../../layout/adminLayout.js";
import { profileHtml } from "../../profile/html.js";
import { PROFILE_STYLE } from "../../profile/style.js";
import { profileScript } from "../../profile/script.js";

export function sharedProfilePage(admin, options = {}) {
  return renderAdminLayout({
    title: "Profile",
    activeMenu: "profile",
    admin,
    content: profileHtml(admin),
    pageClass: "page-profile",
    pageStyles: PROFILE_STYLE,
    script: profileScript(),
    ...options,
  });
}
