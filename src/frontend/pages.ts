import { renderAppHtml } from "./layout";
import { getInitialView } from "./routing";

export function getFrontendHtml(pathname: string) {
  const view = getInitialView(pathname);
  return renderAppHtml(view);
}
