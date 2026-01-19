import { adminExists, createAdmin } from "../features/auth/adminSetup";
import { renderPageLayout, type DeviceType } from "../layouts/pageLayout";
import { renderAdminSetupPage } from "../pages/admin-setup/content";
import { renderHomeContent } from "../pages/home/content";
import {
  clearAdminSessionCookie,
  createAdminSessionToken,
  getCookieValue,
  readAdminSessionToken,
  serializeAdminSessionCookie,
} from "../services/security/session";

export type Env = {
  DB: {
    prepare: (query: string) => {
      all: <T = unknown>() => Promise<{ results: T[] }>;
      run: () => Promise<void>;
      bind: (...values: unknown[]) => { run: () => Promise<void> };
    };
  };
  JWT_SECRET: string;
};

const jsonResponse = (body: Record<string, unknown>, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });

const htmlResponse = (html: string, status = 200, headers?: HeadersInit): Response =>
  new Response(html, {
    status,
    headers: { "content-type": "text/html; charset=utf-8", ...headers },
  });

const redirectResponse = (location: string, headers?: HeadersInit): Response =>
  new Response(null, {
    status: 302,
    headers: { Location: location, ...headers },
  });

const badRequest = (message: string): Response => jsonResponse({ error: message }, 400);

const serviceError = (message: string): Response =>
  new Response(message, { status: 500, headers: { "content-type": "text/plain; charset=utf-8" } });

const getDeviceType = (userAgent: string | null): DeviceType => {
  const agent = userAgent?.toLowerCase() ?? "";
  if (/mobi|android|iphone|ipod/.test(agent)) {
    return "mobile";
  }
  if (/ipad|tablet/.test(agent)) {
    return "tablet";
  }
  return "desktop";
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

const handleLogout = (): Response => redirectResponse("/", { "Set-Cookie": clearAdminSessionCookie() });

const renderHome = (device: DeviceType, session: { name: string; email: string } | null): Response => {
  const content = renderHomeContent();
  return htmlResponse(renderPageLayout({ device, content, session }));
};

export const handleRequest = async (request: Request, env: Env): Promise<Response> => {
  if (!env.DB) {
    return serviceError("Database binding is missing.");
  }

  if (!env.JWT_SECRET) {
    return serviceError("JWT_SECRET is not configured.");
  }

  const url = new URL(request.url);

  if (url.pathname === "/health") {
    return jsonResponse({ status: "ok" });
  }

  const adminReady = await adminExists(env.DB);

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
    return handleLogout();
  }

  if (!adminReady) {
    return redirectResponse("/setup-admin");
  }

  const device = getDeviceType(request.headers.get("user-agent"));
  const cookieValue = getCookieValue(request.headers.get("cookie"), "admin_session");
  const session = cookieValue ? await readAdminSessionToken(cookieValue, env.JWT_SECRET) : null;

  if (url.pathname === "/" || url.pathname === "/home") {
    return renderHome(device, session);
  }

  return redirectResponse("/");
};
