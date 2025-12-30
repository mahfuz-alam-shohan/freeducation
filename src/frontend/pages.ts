import { renderAppHtml } from "./layout";

const viewByPath = new Map<string, string>([
  ["/", "landing"],
  ["/login", "login"],
  ["/register", "register"],
  ["/admin", "admin"],
]);

export function getFrontendHtml(pathname: string) {
  if (pathname.startsWith("/admin")) {
    return renderAppHtml("admin");
  }
  if (pathname.startsWith("/login")) {
    return renderAppHtml("login");
  }
  if (pathname.startsWith("/register")) {
    return renderAppHtml("register");
  }
  const view = viewByPath.get(pathname) ?? "landing";
  return renderAppHtml(view);
}
