import { PROFILE_SCRIPT_PASSWORD_AND_PROFILE_LOAD } from "./chunks/passwordAndProfileLoad.js";
import { PROFILE_SCRIPT_POSTS_FEED_AND_MODAL } from "../../../modules/posts/profile/feedAndModal.js";

export const PROFILE_SCRIPT_PASSWORD_AND_LOAD = `
${PROFILE_SCRIPT_POSTS_FEED_AND_MODAL}
${PROFILE_SCRIPT_PASSWORD_AND_PROFILE_LOAD}
`;
