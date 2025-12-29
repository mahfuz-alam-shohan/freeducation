import { getFrontendHtml } from "./frontend/pages";

export function getHtml(pathname: string) {
  return getFrontendHtml(pathname);
}
