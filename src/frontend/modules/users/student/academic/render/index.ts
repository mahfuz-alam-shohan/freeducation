import { renderStart } from "./start";
import { renderPublic } from "./public";
import { renderAdmin } from "./admin";
import { renderEnd } from "./end";

export const appRender = `${renderStart}${renderPublic}${renderAdmin}${renderEnd}`;
