import { APP_SHELL_CLIENT_BOOTSTRAP } from "./client/bootstrap.js";
import { APP_SHELL_CLIENT_THEME } from "./client/themeController.js";
import { APP_SHELL_CLIENT_AVATAR } from "./client/avatarController.js";
import { APP_SHELL_CLIENT_UX } from "./client/uxController.js";
import { APP_SHELL_CLIENT_NOTIFICATIONS } from "./client/notificationsController.js";
import { APP_SHELL_CLIENT_NAVIGATION } from "./client/navigationController.js";

export const APP_SHELL_SCRIPT = `
${APP_SHELL_CLIENT_BOOTSTRAP}
${APP_SHELL_CLIENT_THEME}
${APP_SHELL_CLIENT_AVATAR}
${APP_SHELL_CLIENT_UX}
${APP_SHELL_CLIENT_NOTIFICATIONS}
${APP_SHELL_CLIENT_NAVIGATION}
`;
