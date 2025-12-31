import { renderAppHtml } from "./layout";

const viewByPath = new Map<string, string>([
  ["/", "landing"],
  ["/login", "login"],
  ["/register", "register"],
  ["/dashboard", "dashboard"],
  ["/dashboard/ssc", "admin-groups-ssc"],
  ["/dashboard/hsc", "admin-groups-hsc"],
]);

export function getFrontendHtml(pathname: string) {
  if (pathname.startsWith("/login")) {
    return renderAppHtml("login");
  }
  if (pathname.startsWith("/register")) {
    return renderAppHtml("register");
  }
  if (pathname.startsWith("/dashboard")) {
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
