import { normalizeEmail } from "./request.js";

export function validateAdminPayload(payload) {
  const name = String(payload.name || "").trim();
  const email = normalizeEmail(payload.email);
  const password = String(payload.password || "");

  if (name.length < 2 || name.length > 120) {
    return "Name must be between 2 and 120 characters";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 190) {
    return "A valid email is required";
  }
  if (password.length < 12 || password.length > 200) {
    return "Password must be between 12 and 200 characters";
  }
  return null;
}
