import { renderAppHtml } from './layout';
import { matchViewFromPath } from './routing/routes';

export function getFrontendHtml(pathname: string) {
  const view = matchViewFromPath(pathname);
  return renderAppHtml(view);
}
