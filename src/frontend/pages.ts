import { renderAppHtml } from "./layout";

const viewByPath = new Map<string, string>([
  ["/", "landing"],
  ["/login", "login"],
  ["/register", "register"],
  ["/dashboard", "dashboard"],
  ["/dashboard/ssc", "admin-groups-ssc"],
  ["/dashboard/hsc", "admin-groups-hsc"],
  ["/dashboard/ssc/science", "admin-ssc-science"],
  ["/dashboard/ssc/humanities", "admin-ssc-humanities"],
  ["/dashboard/ssc/business-studies", "admin-ssc-business-studies"],
  ["/dashboard/hsc/science", "admin-hsc-science"],
  ["/dashboard/hsc/humanities", "admin-hsc-humanities"],
  ["/dashboard/hsc/business-studies", "admin-hsc-business-studies"],
  ["/dashboard/settings", "admin-settings"],
]);

export function getFrontendHtml(pathname: string) {
  if (pathname.startsWith("/login")) {
    return renderAppHtml("login");
  }
  if (pathname.startsWith("/register")) {
    return renderAppHtml("register");
  }
  if (pathname.startsWith("/dashboard")) {
    if (pathname.startsWith("/dashboard/settings")) {
      return renderAppHtml("admin-settings");
    }
    if (pathname.startsWith("/dashboard/ssc/science")) {
      return renderAppHtml("admin-ssc-science");
    }
    if (pathname.startsWith("/dashboard/ssc/humanities")) {
      return renderAppHtml("admin-ssc-humanities");
    }
    if (pathname.startsWith("/dashboard/ssc/business-studies")) {
      return renderAppHtml("admin-ssc-business-studies");
    }
    if (pathname.startsWith("/dashboard/hsc/science")) {
      return renderAppHtml("admin-hsc-science");
    }
    if (pathname.startsWith("/dashboard/hsc/humanities")) {
      return renderAppHtml("admin-hsc-humanities");
    }
    if (pathname.startsWith("/dashboard/hsc/business-studies")) {
      return renderAppHtml("admin-hsc-business-studies");
    }
    if (pathname.startsWith("/dashboard/ssc")) {
      return renderAppHtml("admin-groups-ssc");
    }
    if (pathname.startsWith("/dashboard/hsc")) {
      return renderAppHtml("admin-groups-hsc");
    }
    return renderAppHtml("dashboard");
  }
  const view = viewByPath.get(pathname) ?? "landing";
  return renderAppHtml(view);
}
