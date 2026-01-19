import { verifyAdminLogin } from "../features/auth/adminLogin";
import { adminExists, createAdmin } from "../features/auth/adminSetup";
import {
  createUserAccount,
  deleteUserAccount,
  findUserRoleByEmail,
  listUsers,
  normalizeUserRole,
  type UserRole,
} from "../features/admin/userManagement";
import { renderPageLayout, type DeviceType } from "../layouts/pageLayout";
import { renderAdminSetupPage } from "../pages/admin-setup/content";
import { renderLoginContent } from "../pages/login/content";
import { renderUserManagementContent } from "../pages/user-management/content";
import { renderCreateUserContent } from "../pages/user-management/create/content";
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

const isValidPassword = (password: string): boolean =>
  password.length >= 8 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password);

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

const renderUserList = async (
  env: Env,
  context: AdminRouteContext,
  role: UserRole | null,
  query: string | null,
  successMessage?: string,
): Promise<Response> => {
  const users = await listUsers(env.DB, { role, query: query ?? undefined });
  const content = renderUserManagementContent({
    users,
    filters: { role, query: query ?? undefined },
    successMessage,
  });
  return htmlResponse(renderPageLayout({ device: context.device, content, session: context.session }));
};

const renderCreateUser = (
  context: AdminRouteContext,
  role: UserRole | null,
  errorMessage?: string,
  values?: { name?: string; email?: string; dateOfBirth?: string },
): Response => {
  const content = renderCreateUserContent({ role, errorMessage, values });
  return htmlResponse(renderPageLayout({ device: context.device, content, session: context.session }));
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

  if (url.pathname === "/admin/users") {
    if (!context.session) {
      return redirectResponse("/login");
    }

    if (request.method === "GET") {
      const role = normalizeUserRole(url.searchParams.get("role"));
      const query = url.searchParams.get("q")?.trim() ?? null;
      const successMessage =
        url.searchParams.get("created") === "1"
          ? "User account created."
          : url.searchParams.get("deleted") === "1"
            ? "User account deleted."
            : undefined;
      return renderUserList(env, context, role, query, successMessage);
    }

    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  if (url.pathname === "/admin/users/new") {
    if (!context.session) {
      return redirectResponse("/login");
    }

    if (request.method === "GET") {
      const role = normalizeUserRole(url.searchParams.get("role"));
      return renderCreateUser(context, role);
    }

    if (request.method === "POST") {
      const formData = await request.formData();
      const role = normalizeUserRole(formData.get("role")?.toString() ?? null);
      const name = formData.get("name");
      const email = formData.get("email");
      const password = formData.get("password");
      const dateOfBirth = formData.get("dateOfBirth");

      if (
        !role ||
        typeof name !== "string" ||
        typeof email !== "string" ||
        typeof password !== "string" ||
        typeof dateOfBirth !== "string"
      ) {
        return renderCreateUser(context, role, "Please complete all required fields.");
      }

      const trimmedName = name.trim();
      const normalizedEmail = email.trim().toLowerCase();
      const trimmedDob = dateOfBirth.trim();

      if (!trimmedName) {
        return renderCreateUser(context, role, "Please enter a full name.", {
          name: trimmedName,
          email: normalizedEmail,
          dateOfBirth: trimmedDob,
        });
      }

      if (!normalizedEmail.endsWith("@gmail.com")) {
        return renderCreateUser(context, role, "Please use a Gmail address.", {
          name: trimmedName,
          email: normalizedEmail,
          dateOfBirth: trimmedDob,
        });
      }

      if (!isValidPassword(password)) {
        return renderCreateUser(
          context,
          role,
          "Password must be at least 8 characters with upper, lower, and number.",
          {
            name: trimmedName,
            email: normalizedEmail,
            dateOfBirth: trimmedDob,
          },
        );
      }

      const existingRole = await findUserRoleByEmail(env.DB, normalizedEmail);
      if (existingRole) {
        return renderCreateUser(context, role, `Email already belongs to a ${existingRole} account.`, {
          name: trimmedName,
          email: normalizedEmail,
          dateOfBirth: trimmedDob,
        });
      }

      try {
        await createUserAccount(env.DB, {
          role,
          name: trimmedName,
          email: normalizedEmail,
          password,
          dateOfBirth: trimmedDob,
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to create account.";
        return renderCreateUser(context, role, message, {
          name: trimmedName,
          email: normalizedEmail,
          dateOfBirth: trimmedDob,
        });
      }

      return redirectResponse("/admin/users?created=1");
    }

    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  if (url.pathname === "/admin/users/delete") {
    if (!context.session) {
      return redirectResponse("/login");
    }

    if (request.method === "POST") {
      const formData = await request.formData();
      const role = normalizeUserRole(formData.get("role")?.toString() ?? null);
      const email = formData.get("email");

      if (!role || typeof email !== "string") {
        return redirectResponse("/admin/users");
      }

      const normalizedEmail = email.trim().toLowerCase();
      if (!normalizedEmail) {
        return redirectResponse("/admin/users");
      }

      try {
        await deleteUserAccount(env.DB, { role, email: normalizedEmail });
      } catch {
        return redirectResponse("/admin/users");
      }

      return redirectResponse("/admin/users?deleted=1");
    }

    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  return null;
};
