import { renderDocument } from "../../layout/document.js";
import { loginHtml } from "./html.js";
import { LOGIN_STYLE } from "./style.js";
import { LOGIN_SCRIPT } from "./script.js";

export function loginPage() {
  return renderDocument({
    title: "Admin login",
    body: loginHtml(),
    pageStyles: LOGIN_STYLE,
    script: LOGIN_SCRIPT,
  });
}
