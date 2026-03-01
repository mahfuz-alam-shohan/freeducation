import { USERS_SCRIPT_ACTIONS } from "./script/actions.js";
import { USERS_SCRIPT_API } from "./script/api.js";
import { usersScriptBootstrap } from "./script/bootstrap.js";

export function usersScript(userId = 0) {
  return `
${usersScriptBootstrap(Number(userId) || 0)}
${USERS_SCRIPT_API}
${USERS_SCRIPT_ACTIONS}
`;
}
