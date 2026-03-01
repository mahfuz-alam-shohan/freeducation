import { APP_SHELL_STYLE_TOKENS } from "./style/tokensAndBase.js";
import { APP_SHELL_STYLE_HEADER } from "./style/headerAndSidebar.js";
import { APP_SHELL_STYLE_NAV_THEME } from "./style/navAndTheme.js";
import { APP_SHELL_STYLE_CONTENT } from "./style/contentAndProfile.js";
import { APP_SHELL_STYLE_MOTION } from "./style/motionAndResponsive.js";

export const APP_SHELL_BASE_STYLE = `
${APP_SHELL_STYLE_TOKENS}
${APP_SHELL_STYLE_HEADER}
${APP_SHELL_STYLE_NAV_THEME}
${APP_SHELL_STYLE_CONTENT}
${APP_SHELL_STYLE_MOTION}
`;
