import { findUserRoleByEmail } from "../../domains/admin/userManagement";
import { createOrRefreshStudentSignup, deleteStudentSignup, verifyStudentSignup } from "../../domains/auth/studentSignup";
import { renderPageLayout } from "../../ui/layouts/pageLayout";
import type { DeviceType } from "../../core/types/layout";
import {
  renderSignupConfirmationContent,
  renderSignupContent,
  renderSignupVerificationContent,
} from "../../ui/pages/signup/content";
import { sendStudentVerificationEmail } from "../../integrations/email/gmail";
import type { AdminSession } from "../../core/security/session";
import { createVerificationCode, hashVerificationCode } from "../../core/security/verification";
import { createCSRFToken, setCSRFCookie } from "../../core/middleware/csrf";
import { htmlResponse, jsonResponse } from "../../core/http";
import type { Env } from "../env";

const isValidPassword = (password: string): boolean =>
  password.length >= 8 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password);

const renderStudentPage = (device: DeviceType, session: AdminSession | null, content: string): Response => {
  const csrfToken = createCSRFToken();
  return htmlResponse(renderPageLayout({ device, content, session, csrfToken }), 200, {
    "Set-Cookie": setCSRFCookie(csrfToken),
    "Cache-Control": "no-store",
  });
};

const renderSignup = (
  device: DeviceType,
  session: AdminSession | null,
  errorMessage?: string,
  values?: { name?: string; email?: string; dateOfBirth?: string },
): Response => {
  const content = renderSignupContent({
    ...(errorMessage ? { errorMessage } : {}),
    ...(values ? { values } : {}),
  });
  return renderStudentPage(device, session, content);
};

const renderVerification = (
  device: DeviceType,
  session: AdminSession | null,
  email?: string,
  errorMessage?: string,
): Response => {
  const content = renderSignupVerificationContent({
    ...(errorMessage ? { errorMessage } : {}),
    ...(email ? { email } : {}),
  });
  return renderStudentPage(device, session, content);
};

const renderConfirmation = (device: DeviceType, session: AdminSession | null): Response => {
  const content = renderSignupConfirmationContent();
  return renderStudentPage(device, session, content);
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

      const existingRole = await findUserRoleByEmail(env.DB, normalizedEmail);
      if (existingRole) {
        return renderSignup(
          context.device,
          context.session,
          `This email already belongs to a ${existingRole} account. Please log in instead.`,
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
        const { student } = await createOrRefreshStudentSignup(env.DB, {
          name: trimmedName,
          email: normalizedEmail,
          password,
          dateOfBirth: trimmedDob,
          codeHash,
          expiresAt,
        });
        try {
          await sendStudentVerificationEmail(env, { to: normalizedEmail, name: trimmedName, code });
        } catch (error) {
          await deleteStudentSignup(env.DB, student.id);
          throw error;
        }
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
