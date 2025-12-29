import { renderAppHtml } from "./layout";

const viewByPath = new Map<string, string>([
  ["/", "landing"],
  ["/login", "login"],
  ["/register", "register"],
  ["/admin", "admin"],
]);

export function getFrontendHtml(pathname: string) {
  const view = viewByPath.get(pathname) ?? "landing";
  return renderAppHtml(view);
}
