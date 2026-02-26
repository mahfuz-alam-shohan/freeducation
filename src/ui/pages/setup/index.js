import { renderDocument } from "../../layout/document.js";
import { setupHtml } from "./html.js";
import { SETUP_STYLE } from "./style.js";
import { SETUP_SCRIPT } from "./script.js";

export function setupPage() {
  return renderDocument({
    title: "Initial admin setup",
    body: setupHtml(),
    pageStyles: SETUP_STYLE,
    script: SETUP_SCRIPT,
  });
}
