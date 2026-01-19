import { createOrRefreshStudentSignup, verifyStudentSignup } from "../features/auth/studentSignup";
import { renderPageLayout, type DeviceType } from "../layouts/pageLayout";
import {
  renderSignupConfirmationContent,
  renderSignupContent,
  renderSignupVerificationContent,
} from "../pages/signup/content";
import { sendStudentVerificationEmail } from "../services/email/gmail";
import type { AdminSession } from "../services/security/session";
import { createVerificationCode, hashVerificationCode } from "../services/security/verification";
import { htmlResponse, jsonResponse, type Env } from "./utils";

const isValidPassword = (password: string): boolean =>
  password.length >= 8 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password);

const renderSignup = (
  device: DeviceType,
  session: AdminSession | null,
  errorMessage?: string,
  values?: { name?: string; email?: string; dateOfBirth?: string },
): Response => {
  const content = renderSignupContent({ errorMessage, values });
  return htmlResponse(renderPageLayout({ device, content, session }));
};

const renderVerification = (
  device: DeviceType,
  session: AdminSession | null,
  email?: string,
  errorMessage?: string,
): Response => {
  const content = renderSignupVerificationContent({ errorMessage, email });
  return htmlResponse(renderPageLayout({ device, content, session }));
};

const renderConfirmation = (device: DeviceType, session: AdminSession | null): Response => {
  const content = renderSignupConfirmationContent();
  return htmlResponse(renderPageLayout({ device, content, session }));
};

export const handleStudentRoutes = async (
  request: Request,
  env: Env,
  context: { device: DeviceType; session: AdminSession | null },
): Promise<Response | null> => {
  const url = new URL(request.url);

  if (url.pathname === "/signup") {
    if (request.method === "GET") {
      return renderSignup(context.device, context.session);
    }

    if (request.method === "POST") {
      const formData = await request.formData();
      const name = formData.get("name");
      const email = formData.get("email");
      const password = formData.get("password");
      const dateOfBirth = formData.get("dateOfBirth");

      if (
        typeof name !== "string" ||
        typeof email !== "string" ||
        typeof password !== "string" ||
        typeof dateOfBirth !== "string"
      ) {
        return renderSignup(context.device, context.session, "Please complete all required fields.");
      }

      const trimmedName = name.trim();
      const normalizedEmail = email.trim().toLowerCase();
      const trimmedDob = dateOfBirth.trim();

      if (!trimmedName) {
        return renderSignup(context.device, context.session, "Please enter your full name.");
      }

      if (!normalizedEmail.endsWith("@gmail.com")) {
        return renderSignup(context.device, context.session, "Please use a Gmail address to sign up.", {
          name: trimmedName,
          email: normalizedEmail,
          dateOfBirth: trimmedDob,
        });
      }

      if (!isValidPassword(password)) {
        return renderSignup(
          context.device,
          context.session,
          "Your password must be at least 8 characters and include upper, lower, and number.",
          {
            name: trimmedName,
            email: normalizedEmail,
            dateOfBirth: trimmedDob,
          },
        );
      }

      const code = createVerificationCode();
      const codeHash = await hashVerificationCode(code);
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

      try {
        await createOrRefreshStudentSignup(env.DB, {
          name: trimmedName,
          email: normalizedEmail,
          password,
          dateOfBirth: trimmedDob,
          codeHash,
          expiresAt,
        });
        await sendStudentVerificationEmail(env, { to: normalizedEmail, name: trimmedName, code });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to start signup.";
        return renderSignup(context.device, context.session, message, {
          name: trimmedName,
          email: normalizedEmail,
          dateOfBirth: trimmedDob,
        });
      }

      return renderVerification(context.device, context.session, normalizedEmail);
    }

    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  if (url.pathname === "/signup/verify") {
    if (request.method === "GET") {
      const email = url.searchParams.get("email")?.trim().toLowerCase();
      return renderVerification(context.device, context.session, email, email ? undefined : "Please enter your email.");
    }

    if (request.method === "POST") {
      const formData = await request.formData();
      const email = formData.get("email");
      const code = formData.get("code");

      if (typeof email !== "string" || typeof code !== "string") {
        return renderVerification(context.device, context.session, undefined, "Please enter the email and code.");
      }

      const normalizedEmail = email.trim().toLowerCase();
      const trimmedCode = code.trim();

      if (!normalizedEmail.endsWith("@gmail.com")) {
        return renderVerification(context.device, context.session, normalizedEmail, "Please use a Gmail address.");
      }

      if (!/^\d{6}$/.test(trimmedCode)) {
        return renderVerification(context.device, context.session, normalizedEmail, "Enter the 6-digit code we sent.");
      }

      try {
        await verifyStudentSignup(env.DB, { email: normalizedEmail, code: trimmedCode });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to verify this code.";
        return renderVerification(context.device, context.session, normalizedEmail, message);
      }

      return renderConfirmation(context.device, context.session);
    }

    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  return null;
};
