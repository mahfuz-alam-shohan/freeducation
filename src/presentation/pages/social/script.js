import { SOCIAL_SCRIPT_ACTIONS } from "./script/actions.js";
import { SOCIAL_SCRIPT_BOOTSTRAP } from "./script/bootstrap.js";
import { SOCIAL_SCRIPT_RENDER } from "./script/render.js";
import { SOCIAL_POST_UI_SCRIPT } from "../../modules/posts/ui.js";

export const SOCIAL_SCRIPT = `
${SOCIAL_POST_UI_SCRIPT}
${SOCIAL_SCRIPT_BOOTSTRAP}
${SOCIAL_SCRIPT_RENDER}
${SOCIAL_SCRIPT_ACTIONS}
`;
