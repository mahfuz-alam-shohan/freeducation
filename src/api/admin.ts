import { verifyAdminLogin } from "../domains/auth/adminLogin";
import { adminExists, createAdmin } from "../domains/auth/adminSetup";
import {
  createUserAccount,
  deleteUserAccount,
  findUserRoleByEmail,
  listUsers,
  normalizeUserRole,
  type UserRole,
} from "../domains/admin/userManagement";
import {
  createChapter,
  createContentItem,
  createTopic,
  deleteChapter,
  deleteContentItem,
  deleteSubject,
  deleteTopic,
  ensureDefaultClassGroups,
  ensureModulesSeed,
  getSubjectById,
  listModules,
  listSubjectClassGroups,
  listSubjects,
  syncSubjectTemplates,
} from "../domains/admin/modules";
import { renderPageLayout } from "../ui/layouts/pageLayout";
import type { DeviceType, PageLayoutProps } from "../core/types/layout";
import { renderAdminSetupPage } from "../ui/pages/admin-setup/content";
import { renderLoginContent } from "../ui/pages/login/content";
import { renderModulesContent } from "../ui/pages/modules/content";
import { renderSubjectDetailContent } from "../ui/pages/modules/subjects/detail";
import { renderSubjectsModuleContent } from "../ui/pages/modules/subjects/content";
import { renderUserManagementContent } from "../ui/pages/user-management/content";
import { renderCreateUserContent } from "../ui/pages/user-management/create/content";
import type { AdminSession } from "../core/security/session";
import { createCSRFToken, setCSRFCookie } from "../core/middleware/csrf";
import { getSubjectTemplate, handleSubjectAdminRoutes, listSubjectTemplates } from "../modules/subjects/registry";
import {
  clearAdminSessionCookie,
  createAdminSessionToken,
  getCookieValue,
  readAdminSessionToken,
  serializeAdminSessionCookie,
} from "../core/security/session";
import { SESSION_CONFIG } from "../core/config/constants";
import { badRequest, htmlResponse, jsonResponse, redirectResponse } from "../core/http";
import type { Env } from "../app/env";
import type { ApiContext } from "./index";

type AdminRouteContext = ApiContext;

const isValidPassword = (password: string): boolean =>
  password.length >= 8 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password);

const renderAdminPage = (context: AdminRouteContext, content: string): Response => {
  const csrfToken = createCSRFToken();
  const layoutProps: PageLayoutProps = { device: context.device, content, session: context.session, csrfToken };
  if (context.nonce) {
    layoutProps.nonce = context.nonce;
  }
  return htmlResponse(renderPageLayout(layoutProps), 200, {
    "Set-Cookie": setCSRFCookie(csrfToken),
    "Cache-Control": "no-store",
  });
};

const getAdminSetup = async (env: Env): Promise<Response> => {
  if (await adminExists(env.DB)) {
    return redirectResponse("/");
  }

  const csrfToken = createCSRFToken();
  const requiresSetupToken = Boolean(env.ADMIN_SETUP_TOKEN);
  return htmlResponse(renderAdminSetupPage(csrfToken, requiresSetupToken), 200, {
    "Set-Cookie": setCSRFCookie(csrfToken),
    "Cache-Control": "no-store",
  });
};

const postAdminSetup = async (request: Request, env: Env): Promise<Response> => {
  if (await adminExists(env.DB)) {
    return redirectResponse("/");
  }

  const formData = await request.formData();
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  const dateOfBirth = formData.get("dateOfBirth");
  const setupToken = formData.get("setupToken");

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

  if (env.ADMIN_SETUP_TOKEN) {
    if (typeof setupToken !== "string" || setupToken !== env.ADMIN_SETUP_TOKEN) {
      return badRequest("Invalid setup key.");
    }
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

const renderLogin = (context: AdminRouteContext, errorMessage?: string): Response => {
  const csrfToken = createCSRFToken();
  const content = renderLoginContent(errorMessage ? { errorMessage, csrfToken } : { csrfToken });
  const layoutProps: PageLayoutProps = { device: context.device, content, session: context.session, csrfToken };
  if (context.nonce) {
    layoutProps.nonce = context.nonce;
  }
  return htmlResponse(renderPageLayout(layoutProps), 200, {
    "Set-Cookie": setCSRFCookie(csrfToken),
    "Cache-Control": "no-store",
  });
};

const renderUserList = async (
  env: Env,
  context: AdminRouteContext,
  role: UserRole | null,
  query: string | null,
  successMessage?: string,
  errorMessage?: string,
): Promise<Response> => {
  const users = await listUsers(env.DB, { role, ...(query ? { query } : {}) });
  const content = renderUserManagementContent({
    users,
    filters: { role: role ?? null, ...(query ? { query } : {}) },
    ...(successMessage ? { successMessage } : {}),
    ...(errorMessage ? { errorMessage } : {}),
  });
  return renderAdminPage(context, content);
};

const renderCreateUser = (
  context: AdminRouteContext,
  role: UserRole | null,
  errorMessage?: string,
  values?: { name?: string; email?: string; dateOfBirth?: string },
): Response => {
  const content = renderCreateUserContent({
    role,
    ...(values ? { values } : {}),
    ...(errorMessage ? { errorMessage } : {}),
  });
  return renderAdminPage(context, content);
};

const parseNumberParam = (value: string | null): number | null => {
  if (!value) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const renderModules = async (env: Env, context: AdminRouteContext): Promise<Response> => {
  await ensureModulesSeed(env.DB);
  let modules = await listModules(env.DB);
  if (!modules.length) {
    modules = [
      {
        id: 0,
        name: "Subjects",
        slug: "subjects",
        description: "Manage class subjects, chapters, and content.",
        isActive: 1,
        createdAt: new Date().toISOString(),
      },
    ];
  }

  const content = renderModulesContent({ modules });
  return renderAdminPage(context, content);
};

const renderSubjectsModule = async (
  env: Env,
  context: AdminRouteContext,
  successMessage?: string,
  errorMessage?: string,
): Promise<Response> => {
  await ensureDefaultClassGroups(env.DB);
  const subjectTemplates = listSubjectTemplates();
  let subjects = await listSubjects(env.DB);
  const existingSlugs = new Set(subjects.map((subject) => subject.slug));
  const missingTemplates = subjectTemplates.filter((template) => !existingSlugs.has(template.slug));
  if (missingTemplates.length) {
    await syncSubjectTemplates(env.DB, missingTemplates);
    subjects = await listSubjects(env.DB);
  }
  const subjectBySlug = new Map(subjects.map((subject) => [subject.slug, subject]));
  const subjectTemplateRows = subjectTemplates.map((template) => {
    const subject = subjectBySlug.get(template.slug);
    const customManageUrl =
      template.slug === "mathematics"
        ? "/admin/modules/subjects/mathematics"
        : template.slug === "higher-mathematics"
          ? "/admin/modules/subjects/higher-mathematics"
          : null;
    return {
      name: template.name,
      manageUrl: subject ? customManageUrl ?? `/admin/modules/subjects/${subject.id}` : "/admin/modules/subjects",
      manageLabel: subject ? "Manage" : "Sync pending",
    };
  });
  const content = renderSubjectsModuleContent({
    subjects: subjectTemplateRows,
    ...(successMessage ? { successMessage } : {}),
    ...(errorMessage ? { errorMessage } : {}),
  });
  return renderAdminPage(context, content);
};

const renderSubjectDetail = async (
  env: Env,
  context: AdminRouteContext,
  subjectId: number,
  classSubjectId: number | null,
  successMessage?: string,
  errorMessage?: string,
): Promise<Response> => {
  const subject = await getSubjectById(env.DB, subjectId);
  if (!subject) {
    return redirectResponse("/admin/modules/subjects");
  }

  const classGroups = await listSubjectClassGroups(env.DB, subjectId);

  const content = renderSubjectDetailContent({
    subject,
    classGroups,
    ...(classSubjectId !== null ? { selectedClassSubjectId: classSubjectId } : {}),
    ...(successMessage ? { successMessage } : {}),
    ...(errorMessage ? { errorMessage } : {}),
  });

  return renderAdminPage(context, content);
};

export const getAdminSession = async (request: Request, env: Env): Promise<AdminSession | null> => {
  const cookieValue = getCookieValue(request.headers.get("cookie"), SESSION_CONFIG.COOKIE_NAME);
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
      return renderLogin(context);
    }

    if (request.method === "POST") {
      const formData = await request.formData();
      const email = formData.get("email");
      const password = formData.get("password");

      if (typeof email !== "string" || typeof password !== "string") {
        return renderLogin(context, "Please enter your email and password.");
      }

      const normalizedEmail = email.trim().toLowerCase();
      if (!normalizedEmail.endsWith("@gmail.com")) {
        return renderLogin(context, "Please use a Gmail address to sign in.");
      }

      const adminSession = await verifyAdminLogin(env.DB, normalizedEmail, password);
      if (!adminSession) {
        return renderLogin(context, "The email or password you entered is incorrect.");
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
      const errorMessage =
        url.searchParams.get("error") === "invalid-password"
          ? "Admin password did not match. Please try again."
          : url.searchParams.get("error") === "missing-password"
            ? "Enter your admin password to delete a user."
            : undefined;
      return renderUserList(env, context, role, query, successMessage, errorMessage);
    }

    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  if (url.pathname === "/admin/modules") {
    if (!context.session) {
      return redirectResponse("/login");
    }

    if (request.method === "GET") {
      return renderModules(env, context);
    }

    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  if (url.pathname === "/admin/modules/subjects") {
    if (!context.session) {
      return redirectResponse("/login");
    }

    if (request.method === "GET") {
      const successMessage =
        url.searchParams.get("deleted") === "1"
          ? "Subject deleted."
          : url.searchParams.get("updated") === "1"
            ? "Subject updated."
            : undefined;
      const errorMessage = url.searchParams.get("error") === "invalid" ? "Please complete all fields." : undefined;
      return renderSubjectsModule(env, context, successMessage, errorMessage);
    }

    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  if (url.pathname === "/admin/modules/subjects/class-groups") {
    if (!context.session) {
      return redirectResponse("/login");
    }

    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const subjectRouteResponse = await handleSubjectAdminRoutes(request, env, context);
  if (subjectRouteResponse) {
    return subjectRouteResponse;
  }

  const subjectDetailMatch = url.pathname.match(/^\/admin\/modules\/subjects\/(\d+)$/);
  if (subjectDetailMatch) {
    if (!context.session) {
      return redirectResponse("/login");
    }

    const subjectId = Number(subjectDetailMatch[1]);
    const classSubjectId = parseNumberParam(url.searchParams.get("classSubjectId"));

    if (request.method === "GET") {
      const successMessage = url.searchParams.get("updated") === "1" ? "Update saved." : undefined;
      const errorMessage = url.searchParams.get("error") === "invalid" ? "Please complete all fields." : undefined;
      return renderSubjectDetail(
        env,
        context,
        subjectId,
        classSubjectId,
        successMessage,
        errorMessage,
      );
    }

    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const subjectActionMatch = url.pathname.match(
    /^\/admin\/modules\/subjects\/(\d+)\/(delete|chapters|chapters\/delete|topics|topics\/delete|content)$/,
  );
  if (subjectActionMatch) {
    if (!context.session) {
      return redirectResponse("/login");
    }

    const subjectId = Number(subjectActionMatch[1]);
    const action = subjectActionMatch[2];
    const subject = await getSubjectById(env.DB, subjectId);
    const template = getSubjectTemplate(subject?.templateSlug ?? subject?.slug ?? null);

    if (request.method !== "POST") {
      return jsonResponse({ error: "Method not allowed" }, 405);
    }

    const formData = await request.formData();
    const classSubjectId = parseNumberParam(formData.get("classSubjectId")?.toString() ?? null);
    const chapterId = parseNumberParam(formData.get("chapterId")?.toString() ?? null);
    const topicId = parseNumberParam(formData.get("topicId")?.toString() ?? null);

    try {
      if (action === "delete") {
        await deleteSubject(env.DB, subjectId);
        return redirectResponse("/admin/modules/subjects?deleted=1");
      }

      if (action === "chapters") {
        const title = formData.get("title");
        const slug = formData.get("slug");
        const position = parseNumberParam(formData.get("position")?.toString() ?? null) ?? 0;
        const summary = formData.get("summary");

        if (!classSubjectId || typeof title !== "string" || typeof slug !== "string") {
          return redirectResponse(`/admin/modules/subjects/${subjectId}?error=invalid`);
        }

        await createChapter(env.DB, {
          classSubjectId,
          title: title.trim(),
          slug: slug.trim().toLowerCase(),
          position,
          summary: typeof summary === "string" ? summary.trim() : undefined,
        });

        return redirectResponse(`/admin/modules/subjects/${subjectId}?classSubjectId=${classSubjectId}&updated=1`);
      }

      if (action === "chapters/delete") {
        if (!classSubjectId || !chapterId) {
          return redirectResponse(`/admin/modules/subjects/${subjectId}?error=invalid`);
        }

        await deleteChapter(env.DB, chapterId);
        return redirectResponse(`/admin/modules/subjects/${subjectId}?classSubjectId=${classSubjectId}&updated=1`);
      }

      if (action === "topics") {
        if (template && !template.structure.hasTopics) {
          return redirectResponse(`/admin/modules/subjects/${subjectId}?error=invalid`);
        }
        const title = formData.get("title");
        const slug = formData.get("slug");
        const position = parseNumberParam(formData.get("position")?.toString() ?? null) ?? 0;

        if (!classSubjectId || !chapterId || typeof title !== "string" || typeof slug !== "string") {
          return redirectResponse(`/admin/modules/subjects/${subjectId}?error=invalid`);
        }

        await createTopic(env.DB, {
          chapterId,
          title: title.trim(),
          slug: slug.trim().toLowerCase(),
          position,
        });

        return redirectResponse(
          `/admin/modules/subjects/${subjectId}?classSubjectId=${classSubjectId}&chapterId=${chapterId}&updated=1`,
        );
      }

      if (action === "topics/delete") {
        if (template && !template.structure.hasTopics) {
          return redirectResponse(`/admin/modules/subjects/${subjectId}?error=invalid`);
        }
        if (!classSubjectId || !chapterId || !topicId) {
          return redirectResponse(`/admin/modules/subjects/${subjectId}?error=invalid`);
        }

        await deleteTopic(env.DB, topicId);
        return redirectResponse(
          `/admin/modules/subjects/${subjectId}?classSubjectId=${classSubjectId}&chapterId=${chapterId}&updated=1`,
        );
      }

      if (action === "content") {
        const contentType = formData.get("contentType");
        const title = formData.get("title");
        const body = formData.get("body");
        const resourceUrl = formData.get("resourceUrl");
        const position = parseNumberParam(formData.get("position")?.toString() ?? null) ?? 0;

        const requiresTopic = template?.structure.hasTopics ?? true;
        if (
          !classSubjectId ||
          !chapterId ||
          (requiresTopic && !topicId) ||
          typeof contentType !== "string" ||
          typeof title !== "string"
        ) {
          return redirectResponse(`/admin/modules/subjects/${subjectId}?error=invalid`);
        }

        await createContentItem(env.DB, {
          chapterId: requiresTopic ? undefined : chapterId,
          topicId,
          contentType: contentType.trim(),
          title: title.trim(),
          body: typeof body === "string" ? body.trim() : undefined,
          resourceUrl: typeof resourceUrl === "string" ? resourceUrl.trim() : undefined,
          position,
        });

        return redirectResponse(
          requiresTopic
            ? `/admin/modules/subjects/${subjectId}?classSubjectId=${classSubjectId}&chapterId=${chapterId}&topicId=${topicId}&updated=1`
            : `/admin/modules/subjects/${subjectId}?classSubjectId=${classSubjectId}&chapterId=${chapterId}&updated=1`,
        );
      }
    } catch {
      return redirectResponse(`/admin/modules/subjects/${subjectId}?error=invalid`);
    }

    return redirectResponse(`/admin/modules/subjects/${subjectId}?error=invalid`);
  }

  if (url.pathname === "/admin/modules/subjects/content/delete") {
    if (!context.session) {
      return redirectResponse("/login");
    }

    if (request.method === "POST") {
      const formData = await request.formData();
      const contentItemId = parseNumberParam(formData.get("contentItemId")?.toString() ?? null);
      const subjectId = parseNumberParam(formData.get("subjectId")?.toString() ?? null);
      const classSubjectId = parseNumberParam(formData.get("classSubjectId")?.toString() ?? null);
      const chapterId = parseNumberParam(formData.get("chapterId")?.toString() ?? null);
      const topicId = parseNumberParam(formData.get("topicId")?.toString() ?? null);
      if (!contentItemId) {
        return redirectResponse("/admin/modules/subjects?error=invalid");
      }

      await deleteContentItem(env.DB, contentItemId);
      if (subjectId && classSubjectId && chapterId && topicId) {
        return redirectResponse(
          `/admin/modules/subjects/${subjectId}?classSubjectId=${classSubjectId}&chapterId=${chapterId}&topicId=${topicId}&updated=1`,
        );
      }
      if (subjectId && classSubjectId && chapterId) {
        return redirectResponse(
          `/admin/modules/subjects/${subjectId}?classSubjectId=${classSubjectId}&chapterId=${chapterId}&updated=1`,
        );
      }
      return redirectResponse("/admin/modules/subjects?updated=1");
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
      const adminPassword = formData.get("adminPassword");

      if (!role || typeof email !== "string") {
        return redirectResponse("/admin/users");
      }

      const normalizedEmail = email.trim().toLowerCase();
      if (!normalizedEmail) {
        return redirectResponse("/admin/users");
      }

      if (typeof adminPassword !== "string" || !adminPassword.trim()) {
        return redirectResponse("/admin/users?error=missing-password");
      }

      const adminSession = await verifyAdminLogin(env.DB, context.session.email, adminPassword);
      if (!adminSession) {
        return redirectResponse("/admin/users?error=invalid-password");
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
