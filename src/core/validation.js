import { normalizeEmail } from "./request.js";

export function validateAdminPayload(payload) {
  const name = String(payload.name || "").trim();
  const email = normalizeEmail(payload.email);
  const password = String(payload.password || "");
  const userType = String(payload.user_type || "Administrator").trim();

  if (name.length < 2 || name.length > 120) {
    return "Name must be between 2 and 120 characters";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 190) {
    return "A valid email is required";
  }
  if (password.length < 8 || password.length > 200) {
    return "Password must be between 8 and 200 characters";
  }
  if (!["Administrator", "Teacher", "Student"].includes(userType)) {
    return "Select a valid user type";
  }
  return null;
}

export function validateProfileFieldUpdate(payload) {
  const field = String(payload?.field || "").trim();
  const value = String(payload?.value || "").trim();

  if (!field) return "Field is required";

  if (field === "name") {
    if (value.length < 2 || value.length > 120) return "Name must be between 2 and 120 characters";
    return null;
  }

  if (field === "date_of_birth") {
    if (!value) return "Date of birth is required";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return "Date of birth must be in YYYY-MM-DD format";
    const parsed = new Date(value + "T00:00:00Z");
    if (Number.isNaN(parsed.getTime())) return "Date of birth is invalid";
    const now = new Date();
    if (parsed.getTime() > now.getTime()) return "Date of birth cannot be in the future";
    return null;
  }

  if (field === "gender") {
    const allowed = ["Male", "Female", "Other", "Prefer not to say"];
    if (!allowed.includes(value)) return "Select a valid gender";
    return null;
  }

  return "Field is not editable";
}
