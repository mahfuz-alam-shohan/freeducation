import { profileScriptDomState } from "./chunks/domState.js";
import { PROFILE_SCRIPT_INLINE_EDIT } from "./chunks/inlineEdit.js";

export function profileScriptBootstrap(apiBaseLiteral, configLiteral) {
  return `
${profileScriptDomState(apiBaseLiteral, configLiteral)}
${PROFILE_SCRIPT_INLINE_EDIT}
`;
}
