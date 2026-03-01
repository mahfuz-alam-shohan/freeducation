import { APP_NAME } from "../../config/index.js";
import { renderSiteLogo } from "./siteLogo.js";

export function globalFooterText() {
  return `&copy; ${new Date().getFullYear()} ${renderSiteLogo({ className: "site-logo site-logo--inline", label: APP_NAME })}. All rights reserved.`;
}
