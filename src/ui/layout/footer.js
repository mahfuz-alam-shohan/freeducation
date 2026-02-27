import { APP_NAME } from "../../config.js";

export function globalFooterText() {
  return `© ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.`;
}
