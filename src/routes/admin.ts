import { verifyAdminLogin } from "../features/auth/adminLogin";
import { adminExists, createAdmin } from "../features/auth/adminSetup";
import { renderPageLayout, type DeviceType } from "../layouts/pageLayout";
import { renderAdminSetupPage } from "../pages/admin-setup/content";
import { renderLoginContent } from "../pages/login/content";
import type { AdminSession } from "../services/security/session";
import {
  clearAdminSessionCookie,
  createAdminSessionToken,
  getCookieValue,
  readAdminSessionToken,
  serializeAdminSessionCookie,
} from "../services/security/session";
import { badRequest, htmlResponse, jsonResponse, redirectResponse, type Env } from "./utils";

type AdminRouteContext = {
  adminReady: boolean;
  device: DeviceType;
  session: AdminSession | null;
};

const getAdminSetup = async (env: Env): Promise<Response> =>
  (await adminExists(env.DB)) ? redirectResponse("/") : htmlResponse(renderAdminSetupPage());

const postAdminSetup = async (request: Request, env: Env): Promise<Response> => {
  if (await adminExists(env.DB)) {
    return redirectResponse("/");
  }

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
    return badRequest("Missing required fields.");
  }

  if (!email.endsWith("@gmail.com")) {
    return badRequest("Only Gmail addresses are allowed for the first admin.");
  }

  const trimmedName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();

  await createAdmin(env.DB, {
    name: trimmedName,
    email: normalizedEmail,
    password,
    dateOfBirth,
  });

  const token = await createAdminSessionToken({ name: trimmedName, email: normalizedEmail }, env.JWT_SECRET);

  return redirectResponse("/", {
    "Set-Cookie": serializeAdminSessionCookie(token),
  });
};

const renderLogin = (
  device: DeviceType,
  session: AdminSession | null,
  errorMessage?: string,
): Response => {
  const content = renderLoginContent({ errorMessage });
  return htmlResponse(renderPageLayout({ device, content, session }));
};

export const getAdminSession = async (request: Request, env: Env): Promise<AdminSession | null> => {
  const cookieValue = getCookieValue(request.headers.get("cookie"), "admin_session");
  if (!cookieValue) {
    return null;
  }

  return readAdminSessionToken(cookieValue, env.JWT_SECRET);
};

export const handleAdminRoutes = async (
  request: Request,
  env: Env,
  context: AdminRouteContext,
): Promise<Response | null> => {
  const url = new URL(request.url);

  if (url.pathname === "/setup-admin") {
    if (request.method === "GET") {
      return getAdminSetup(env);
    }

    if (request.method === "POST") {
      return postAdminSetup(request, env);
    }

    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  if (url.pathname === "/logout") {
    return redirectResponse("/", { "Set-Cookie": clearAdminSessionCookie() });
  }

  if (url.pathname === "/login") {
    if (!context.adminReady) {
      return redirectResponse("/setup-admin");
    }

    if (request.method === "GET") {
      if (context.session) {
        return redirectResponse("/");
      }
      return renderLogin(context.device, context.session);
    }

    if (request.method === "POST") {
      const formData = await request.formData();
      const email = formData.get("email");
      const password = formData.get("password");

      if (typeof email !== "string" || typeof password !== "string") {
        return renderLogin(context.device, context.session, "Please enter your email and password.");
      }

      const normalizedEmail = email.trim().toLowerCase();
      if (!normalizedEmail.endsWith("@gmail.com")) {
        return renderLogin(context.device, context.session, "Please use a Gmail address to sign in.");
      }

      const adminSession = await verifyAdminLogin(env.DB, normalizedEmail, password);
      if (!adminSession) {
        return renderLogin(context.device, context.session, "The email or password you entered is incorrect.");
      }

      const token = await createAdminSessionToken(adminSession, env.JWT_SECRET);
      return redirectResponse("/", { "Set-Cookie": serializeAdminSessionCookie(token) });
    }

    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  return null;
};
