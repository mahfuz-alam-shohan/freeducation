import { imageCompressionModule } from "./imageCompression.js";
import { profileScriptBootstrap } from "./script/bootstrap.js";
import { PROFILE_SCRIPT_IMAGES } from "./script/images.js";
import { PROFILE_SCRIPT_PASSWORD_AND_LOAD } from "./script/passwordAndLoad.js";
import { PROFILE_SCRIPT_TABS_AND_EDITS } from "./script/tabsAndEdits.js";

export function profileScript(apiBase = "", options = {}) {
  const apiBaseLiteral = JSON.stringify(String(apiBase || ""));
  const configLiteral = JSON.stringify({
    readOnly: Boolean(options.readOnly),
    profileUserId: Number.parseInt(String(options.profileUserId || 0), 10) || 0,
    viewerUserId: Number.parseInt(String(options.viewerUserId || 0), 10) || 0,
    canInteract: options.canInteract !== false,
  });

  return `
(() => {
${imageCompressionModule()}
${profileScriptBootstrap(apiBaseLiteral, configLiteral)}
${PROFILE_SCRIPT_TABS_AND_EDITS}
${PROFILE_SCRIPT_IMAGES}
${PROFILE_SCRIPT_PASSWORD_AND_LOAD}
})();
`;
}
