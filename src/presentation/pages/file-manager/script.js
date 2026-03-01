import { FILE_MANAGER_SCRIPT_ACTIONS } from "./script/actions.js";
import { FILE_MANAGER_SCRIPT_BOOTSTRAP } from "./script/bootstrap.js";
import { FILE_MANAGER_SCRIPT_RENDER_AND_API } from "./script/renderAndApi.js";

export function fileManagerScript() {
  return `
${FILE_MANAGER_SCRIPT_BOOTSTRAP}
${FILE_MANAGER_SCRIPT_RENDER_AND_API}
${FILE_MANAGER_SCRIPT_ACTIONS}
`;
}
