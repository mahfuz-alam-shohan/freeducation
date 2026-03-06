import { renderAppShellLayout } from "../../layout/appShell/index.js";
import { profileHtml } from "./html.js";
import { PROFILE_STYLE } from "./style.js";
import { profileScript } from "./script.js";

export function profilePage(user, options = {}) {
  const apiBase = String(options.apiBase || "/api/workspace");
  const profileUser = options.profileUser || user || null;
  const readOnly = Boolean(options.readOnly);
  const profileUserId = Number.parseInt(String(options.profileUserId || profileUser?.id || 0), 10) || 0;
  const canInteract = options.canInteract !== false;
  const showBackToFeed = Boolean(options.showBackToFeed);
  const backToFeedHref = String(options.backToFeedHref || "/social");
  const backToFeedLabel = String(options.backToFeedLabel || "Back to feed");
  const extraPageClass = String(options.pageClass || "").trim();
  const extraPageStyles = String(options.pageStyles || "");
  const mergedPageClass = ["page-profile", extraPageClass].filter(Boolean).join(" ");
  const mergedPageStyles = [PROFILE_STYLE, extraPageStyles].filter(Boolean).join("\n");
  const shellOptions = { ...options };
  delete shellOptions.pageClass;
  delete shellOptions.pageStyles;
  delete shellOptions.showBackToFeed;
  delete shellOptions.backToFeedHref;
  delete shellOptions.backToFeedLabel;

  return renderAppShellLayout({
    ...shellOptions,
    title: "Profile",
    activeMenu: "profile",
    user,
    content: profileHtml(profileUser, {
      readOnly,
      profileUserId,
      viewerUserId: Number.parseInt(String(user?.id || 0), 10) || 0,
      canInteract,
      showBackToFeed,
      backToFeedHref,
      backToFeedLabel,
    }),
    pageClass: mergedPageClass,
    pageStyles: mergedPageStyles,
    script: profileScript(apiBase, {
      readOnly,
      profileUserId,
      viewerUserId: Number.parseInt(String(user?.id || 0), 10) || 0,
      canInteract,
    }),
  });
}
