import { appConfig } from "./config";
import {
  createAdmin,
  createSession,
  Env,
  getAdminCount,
  getHierarchy,
  getQuestionTypes,
  getSources,
  getUserByEmail,
  getUserFromSession,
  insertChapter,
  insertClass,
  insertGroup,
  insertLearningMaterial,
  insertQuestion,
  insertQuestionType,
  insertSourceEntity,
  insertSubChapter,
  insertSubject,
  listLearningMaterials,
  listQuestions,
  listQuestionsFiltered,
} from "./db";
import { renderDashboard, renderLogin } from "./admin";
import { renderSmartFilter, renderStudentHome } from "./student";
import { createPasswordHash, randomToken, sha256, verifyPassword } from "./security";

const htmlResponse = (body: string, status = 200, headers?: HeadersInit) =>
  new Response(body, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      ...headers,
    },
  });

const redirectResponse = (location: string, headers?: HeadersInit) =>
  new Response(null, {
    status: 302,
    headers: {
      Location: location,
      ...headers,
    },
  });

const parseCookies = (cookieHeader: string | null) => {
  const cookies: Record<string, string> = {};
  if (!cookieHeader) return cookies;
  cookieHeader.split(";").forEach((cookie) => {
    const [key, ...valueParts] = cookie.trim().split("=");
    if (!key) return;
    cookies[key] = valueParts.join("=");
  });
  return cookies;
};

const getSessionCookie = (request: Request) => {
  const cookies = parseCookies(request.headers.get("Cookie"));
  return cookies["freeducation_session"] ?? "";
};

const buildSessionCookie = (token: string) =>
  `freeducation_session=${token}; HttpOnly; Secure; Path=/; SameSite=Strict; Max-Age=${
    appConfig.sessionDurationHours * 3600
  }`;

const clearSessionCookie = () =>
  "freeducation_session=; HttpOnly; Secure; Path=/; SameSite=Strict; Max-Age=0";

const requireAdmin = async (db: D1Database, request: Request) => {
  const token = getSessionCookie(request);
  if (!token) return null;
  const tokenHash = await sha256(token);
  return getUserFromSession(db, tokenHash);
};

const getFormData = async (request: Request) => {
  const formData = await request.formData();
  const data: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    data[key] = String(value);
  }
  return data;
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      const url = new URL(request.url);
      const path = url.pathname;

      if (path === "/") {
        const hierarchy = await getHierarchy(env.DB);
        return htmlResponse(renderStudentHome(hierarchy));
      }

      if (path === "/smart-filter") {
        const query = Object.fromEntries(url.searchParams.entries());
        const [hierarchy, questionTypes, questions] = await Promise.all([
          getHierarchy(env.DB),
          getQuestionTypes(env.DB),
          listQuestionsFiltered(env.DB, {
            classId: query.classId,
            subjectId: query.subjectId,
            chapterId: query.chapterId,
            questionTypeId: query.questionTypeId,
          }),
        ]);
        return htmlResponse(renderSmartFilter(hierarchy, questionTypes, questions, query));
      }

      if (path.startsWith("/admin")) {
        const adminCount = await getAdminCount(env.DB);

        if (path === "/admin/login") {
          if (request.method === "POST") {
            const form = await getFormData(request);
            const email = form.email?.trim().toLowerCase();
            const password = form.password ?? "";

            if (!email || password.length < 8) {
              return htmlResponse(
                renderLogin({
                  isFirstAdmin: adminCount === 0,
                  error: "Provide a valid email and a password with at least 8 characters.",
                }),
                400
              );
            }

            if (adminCount === 0) {
              const passwordHash = await createPasswordHash(password);
              const user = await createAdmin(env.DB, email, passwordHash);
              const sessionToken = randomToken(32);
              await createSession(env.DB, user.id, await sha256(sessionToken));
              return redirectResponse("/admin", { "Set-Cookie": buildSessionCookie(sessionToken) });
            }

            const user = await getUserByEmail(env.DB, email);
            if (!user || !(await verifyPassword(password, user.passwordHash))) {
              return htmlResponse(
                renderLogin({
                  isFirstAdmin: false,
                  error: "Invalid credentials.",
                }),
                401
              );
            }

            const sessionToken = randomToken(32);
            await createSession(env.DB, user.id, await sha256(sessionToken));
            return redirectResponse("/admin", { "Set-Cookie": buildSessionCookie(sessionToken) });
          }

          return htmlResponse(renderLogin({ isFirstAdmin: adminCount === 0 }));
        }

        if (path === "/admin/logout") {
          return redirectResponse("/", { "Set-Cookie": clearSessionCookie() });
        }

        const adminUser = await requireAdmin(env.DB, request);
        if (!adminUser) {
          return redirectResponse("/admin/login");
        }

        if (request.method === "POST") {
          const form = await getFormData(request);

          if (path === "/admin/classes") {
            await insertClass(env.DB, form.name, form.hasGroups === "true", form.isMerged === "true");
            return redirectResponse("/admin");
          }

          if (path === "/admin/groups") {
            await insertGroup(env.DB, form.classId, form.name);
            return redirectResponse("/admin");
          }

          if (path === "/admin/subjects") {
            const groupId = form.groupId ? form.groupId : null;
            await insertSubject(env.DB, form.classId, groupId, form.name);
            return redirectResponse("/admin");
          }

          if (path === "/admin/chapters") {
            await insertChapter(env.DB, form.subjectId, form.name, Number(form.position));
            return redirectResponse("/admin");
          }

          if (path === "/admin/subchapters") {
            await insertSubChapter(env.DB, form.chapterId, form.name, Number(form.position));
            return redirectResponse("/admin");
          }

          if (path === "/admin/question-types") {
            await insertQuestionType(env.DB, form.chapterId, form.name);
            return redirectResponse("/admin");
          }

          if (path === "/admin/source-entities") {
            await insertSourceEntity(env.DB, form.categoryId, form.name);
            return redirectResponse("/admin");
          }

          if (path === "/admin/questions") {
            await insertQuestion(env.DB, {
              chapterId: form.chapterId,
              questionTypeId: form.questionTypeId,
              sourceEntityId: form.sourceEntityId,
              sourceYear: form.sourceYear,
              prompt: form.prompt,
              imageUrl: form.imageUrl || null,
            });
            return redirectResponse("/admin");
          }

          if (path === "/admin/learning-materials") {
            await insertLearningMaterial(env.DB, {
              subchapterId: form.subchapterId,
              title: form.title,
              materialType: form.materialType,
              url: form.url,
              notes: form.notes || null,
            });
            return redirectResponse("/admin");
          }

          return htmlResponse("Unknown action", 400);
        }

        const [hierarchy, questionTypes, sources, questions, learningMaterials] = await Promise.all([
          getHierarchy(env.DB),
          getQuestionTypes(env.DB),
          getSources(env.DB),
          listQuestions(env.DB),
          listLearningMaterials(env.DB),
        ]);
        return htmlResponse(
          renderDashboard({
            hierarchy,
            questionTypes,
            sources,
            questions,
            learningMaterials,
          })
        );
      }

      return htmlResponse("Not found", 404);
    } catch (err) {
      // Return a visible error page instead of a generic 500 crash
      return new Response(`Error: ${err instanceof Error ? err.message : String(err)}`, {
        status: 500,
        headers: { "Content-Type": "text/plain" },
      });
    }
  },
};