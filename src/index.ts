import { appConfig } from "./config";
import {
  createAdmin,
  createSession,
  deleteItem, // Import delete
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
  setupDatabase,
} from "./db";
import { renderDashboard, renderLogin } from "./admin";
import { renderSmartFilter, renderStudentHome } from "./student";
import { createPasswordHash, randomToken, sha256, verifyPassword } from "./security";

const htmlResponse = (body: string, status = 200, headers?: HeadersInit) =>
  new Response(body, { status, headers: { "Content-Type": "text/html; charset=utf-8", ...headers } });

const redirectResponse = (location: string, headers?: HeadersInit) =>
  new Response(null, { status: 302, headers: { Location: location, ...headers } });

const errorResponse = (error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error("Critical Error:", error);
  // Returns to previous page logic often requires JS, so we just link back to dashboard
  return htmlResponse(`
    <div style="font-family:-apple-system, sans-serif; padding:2rem; max-width:500px; margin:2rem auto; border:1px solid #fee2e2; background:#fff; border-radius:12px; box-shadow:0 4px 6px rgba(0,0,0,0.05); text-align:center;">
      <div style="font-size:40px; margin-bottom:1rem;">⚠️</div>
      <h3 style="margin-top:0; color:#111;">Action Failed</h3>
      <p style="color:#666;">${message}</p>
      <button onclick="history.back()" style="margin-top:1rem; padding:10px 20px; background:#111; color:#fff; border:none; border-radius:6px; cursor:pointer;">Go Back</button>
    </div>
  `, 400);
}

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

const buildSessionCookie = (token: string) => {
  const hours = (appConfig && appConfig.sessionDurationHours) ? appConfig.sessionDurationHours : 8;
  return `freeducation_session=${token}; HttpOnly; Secure; Path=/; SameSite=Strict; Max-Age=${hours * 3600}`;
};

const clearSessionCookie = () => "freeducation_session=; HttpOnly; Secure; Path=/; SameSite=Strict; Max-Age=0";

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
    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // --- Public Routes ---
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

      // --- Admin Routes ---
      if (path.startsWith("/admin")) {
        const adminCount = await getAdminCount(env.DB);

        if (path === "/admin/login") {
          if (request.method === "POST") {
            const form = await getFormData(request);
            const email = form.email?.trim().toLowerCase();
            const password = form.password ?? "";

            if (!email || password.length < 8) return htmlResponse(renderLogin({ isFirstAdmin: adminCount === 0, error: "Invalid input." }), 400);

            if (adminCount === 0) {
              const passwordHash = await createPasswordHash(password);
              const user = await createAdmin(env.DB, email, passwordHash);
              const sessionToken = randomToken(32);
              await createSession(env.DB, user.id, await sha256(sessionToken));
              return redirectResponse("/admin", { "Set-Cookie": buildSessionCookie(sessionToken) });
            }

            const user = await getUserByEmail(env.DB, email);
            if (!user || !(await verifyPassword(password, user.passwordHash))) {
              return htmlResponse(renderLogin({ isFirstAdmin: false, error: "Invalid credentials." }), 401);
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
        if (!adminUser) return redirectResponse("/admin/login");

        const currentView = url.searchParams.get("view") || "overview";

        // --- DELETE HANDLER ---
        // Format: /admin/delete/{table}/{id}
        // HTML Forms don't support DELETE method, so we listen for a specific path pattern or a _method field.
        // We'll use a path convention: /admin/delete
        if (path === "/admin/delete" && request.method === "POST") {
          const form = await getFormData(request);
          const table = form.table;
          const id = form.id;
          const returnView = form.view || 'overview';
          
          if(table && id) {
            await deleteItem(env.DB, table, id);
          }
          return redirectResponse(`/admin?view=${returnView}`);
        }


        // --- CREATE HANDLERS ---
        if (request.method === "POST") {
          try {
            const form = await getFormData(request);

            if (path === "/admin/classes") {
              // Simplified Class Creation
              await insertClass(env.DB, form.name, form.hasGroups === "true");
              return redirectResponse("/admin?view=structure");
            }
            if (path === "/admin/groups") {
              await insertGroup(env.DB, form.classId, form.name);
              return redirectResponse("/admin?view=structure");
            }
            if (path === "/admin/subjects") {
              const groupId = form.groupId ? form.groupId : null;
              await insertSubject(env.DB, form.classId, groupId, form.name);
              return redirectResponse("/admin?view=structure");
            }
            if (path === "/admin/chapters") {
              await insertChapter(env.DB, form.subjectId, form.name, Number(form.position));
              return redirectResponse("/admin?view=questions");
            }
            if (path === "/admin/subchapters") {
              await insertSubChapter(env.DB, form.chapterId, form.name, Number(form.position));
              return redirectResponse("/admin?view=materials");
            }
            if (path === "/admin/question-types") {
              await insertQuestionType(env.DB, form.chapterId, form.name);
              return redirectResponse("/admin?view=questions");
            }
            if (path === "/admin/source-entities") {
              await insertSourceEntity(env.DB, form.categoryId, form.name);
              return redirectResponse("/admin?view=settings");
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
              return redirectResponse("/admin?view=questions");
            }
            if (path === "/admin/learning-materials") {
              await insertLearningMaterial(env.DB, {
                subchapterId: form.subchapterId,
                title: form.title,
                materialType: form.materialType,
                url: form.url,
                notes: form.notes || null,
              });
              return redirectResponse("/admin?view=materials");
            }
          } catch (err) {
            return errorResponse(err);
          }
          return htmlResponse("Unknown action", 400);
        }

        // --- DASHBOARD RENDER ---
        const [hierarchy, questionTypes, sources, questions, learningMaterials] = await Promise.all([
          getHierarchy(env.DB),
          getQuestionTypes(env.DB),
          getSources(env.DB),
          listQuestions(env.DB),
          listLearningMaterials(env.DB),
        ]);

        return htmlResponse(renderDashboard({
          hierarchy, questionTypes, sources, questions, learningMaterials
        }, currentView));
      }

      return htmlResponse("Not found", 404);

    } catch (e: any) {
      if (e.message && (e.message.includes("no such table") || e.message.includes("SQLITE_ERROR"))) {
        await setupDatabase(env.DB);
        return htmlResponse(`<meta http-equiv="refresh" content="2"><div>Initializing Database...</div>`);
      }
      return errorResponse(e);
    }
  },
};


