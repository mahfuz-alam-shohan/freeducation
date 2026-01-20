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
} from "../features/admin/modules";
import { renderPageLayout, type DeviceType } from "../layouts/pageLayout";
import { renderAdminSetupPage } from "../pages/admin-setup/content";
import { renderLoginContent } from "../pages/login/content";
import { renderModulesContent } from "../pages/modules/content";
import { renderSubjectDetailContent } from "../pages/modules/subjects/detail";
import { renderSubjectsModuleContent } from "../pages/modules/subjects/content";
import { renderUserManagementContent } from "../pages/user-management/content";
import { renderCreateUserContent } from "../pages/user-management/create/content";
import type { AdminSession } from "../services/security/session";
import { getSubjectTemplate, listSubjectTemplates } from "../modules/subjects/registry";
import { handleBanglaNineTenRoutes } from "../modules/subjects/bangla/9-10/routes";
import { handleBanglaElevenTwelveRoutes } from "../modules/subjects/bangla/11-12/routes";
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
  errorMessage?: string,
): Promise<Response> => {
  const users = await listUsers(env.DB, { role, query: query ?? undefined });
  const content = renderUserManagementContent({
    users,
    filters: { role, query: query ?? undefined },
    successMessage,
    errorMessage,
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
  return htmlResponse(renderPageLayout({ device: context.device, content, session: context.session }));
};

const renderSubjectsModule = async (
  env: Env,
  context: AdminRouteContext,
  successMessage?: string,
  errorMessage?: string,
): Promise<Response> => {
  await ensureDefaultClassGroups(env.DB);
  await syncSubjectTemplates(env.DB, listSubjectTemplates());
  const subjects = await listSubjects(env.DB);
  const subjectBySlug = new Map(subjects.map((subject) => [subject.slug, subject]));
  const subjectTemplates = listSubjectTemplates().map((template) => {
    const subject = subjectBySlug.get(template.slug);
    return {
      name: template.name,
      manageUrl: subject ? `/admin/modules/subjects/${subject.id}` : "/admin/modules/subjects",
      manageLabel: subject ? "Manage" : "Sync pending",
    };
  });
  const content = renderSubjectsModuleContent({ subjects: subjectTemplates, successMessage, errorMessage });
  return htmlResponse(renderPageLayout({ device: context.device, content, session: context.session }));
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
    selectedClassSubjectId: classSubjectId ?? undefined,
    successMessage,
    errorMessage,
  });

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

  const banglaNineTenResponse = await handleBanglaNineTenRoutes(request, env, context);
  if (banglaNineTenResponse) {
    return banglaNineTenResponse;
  }

  const banglaElevenTwelveResponse = await handleBanglaElevenTwelveRoutes(request, env, context);
  if (banglaElevenTwelveResponse) {
    return banglaElevenTwelveResponse;
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
