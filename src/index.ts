import { COOKIE_NAME } from "./config";
import {
  createAdmin,
  createChapter,
  createClass,
  createGroup,
  createQuestion,
  createQuestionType,
  createSource,
  createSubject,
  createSubChapter,
  getAdminByUsername,
  getAdminCount,
  getBoolean,
  normalizeId,
  safeNumber,
  Env,
} from "./db";
import {
  clearSession,
  createSessionCookie,
  decodeBase64,
  generateSalt,
  getSessionFromRequest,
  hashPassword,
  encodeBase64,
} from "./auth";
import {
  renderDashboard,
  renderLoginPage,
} from "./admin";
import {
  renderChapter,
  renderClass,
  renderHome,
  renderQuestions,
  renderSubject,
} from "./student";

function redirect(location: string) {
  return new Response(null, {
    status: 302,
    headers: { Location: location },
  });
}

function htmlResponse(html: string, status = 200) {
  return new Response(html, {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

async function requireSession(env: Env, request: Request) {
  const session = await getSessionFromRequest(env, request);
  if (!session) return null;
  return session;
}

async function handleLogin(env: Env, request: Request) {
  const form = await request.formData();
  const username = String(form.get("username") ?? "").trim();
  const password = String(form.get("password") ?? "");
  if (!username || !password) {
    const html = await renderLoginPage(true, "Username and password are required.");
    return htmlResponse(html, 400);
  }

  const adminCount = await getAdminCount(env);
  if (adminCount === 0) {
    const salt = generateSalt();
    const hash = await hashPassword(password, salt);
    await createAdmin(env, username, hash, encodeBase64(salt));
    const admin = await getAdminByUsername(env, username);
    const cookie = await createSessionCookie(env, Number(admin?.id));
    return new Response(null, {
      status: 302,
      headers: { Location: "/admin", "Set-Cookie": cookie },
    });
  }

  const admin = await getAdminByUsername(env, username);
  if (!admin) {
    const html = await renderLoginPage(true, "Invalid credentials.");
    return htmlResponse(html, 401);
  }
  const salt = decodeBase64(String(admin.password_salt));
  const hash = await hashPassword(password, salt);
  if (hash !== admin.password_hash) {
    const html = await renderLoginPage(true, "Invalid credentials.");
    return htmlResponse(html, 401);
  }
  const cookie = await createSessionCookie(env, Number(admin.id));
  return new Response(null, {
    status: 302,
    headers: { Location: "/admin", "Set-Cookie": cookie },
  });
}

async function handleLogout(env: Env, request: Request) {
  const cookie = await clearSession(env, request);
  return new Response(null, {
    status: 302,
    headers: { Location: "/login", "Set-Cookie": cookie },
  });
}

async function handleAdminPost(env: Env, request: Request, action: string) {
  const form = await request.formData();
  if (action === "class") {
    await createClass(
      env,
      String(form.get("name") ?? ""),
      getBoolean(String(form.get("has_groups") ?? "")),
      safeNumber(String(form.get("sort_order") ?? "")),
      String(form.get("merged_label") ?? "") || null
    );
  }
  if (action === "group") {
    await createGroup(
      env,
      Number(form.get("class_id")),
      String(form.get("name") ?? ""),
      safeNumber(String(form.get("sort_order") ?? ""))
    );
  }
  if (action === "subject") {
    await createSubject(
      env,
      Number(form.get("class_id")),
      normalizeId(String(form.get("group_id") ?? "")),
      String(form.get("name") ?? ""),
      safeNumber(String(form.get("sort_order") ?? ""))
    );
  }
  if (action === "chapter") {
    await createChapter(
      env,
      Number(form.get("subject_id")),
      String(form.get("name") ?? ""),
      safeNumber(String(form.get("sort_order") ?? ""))
    );
  }
  if (action === "sub-chapter") {
    await createSubChapter(
      env,
      Number(form.get("chapter_id")),
      String(form.get("name") ?? ""),
      safeNumber(String(form.get("sort_order") ?? ""))
    );
  }
  if (action === "question-type") {
    await createQuestionType(
      env,
      Number(form.get("chapter_id")),
      String(form.get("name") ?? ""),
      safeNumber(String(form.get("sort_order") ?? ""))
    );
  }
  if (action === "source") {
    await createSource(
      env,
      String(form.get("category") ?? ""),
      String(form.get("entity") ?? ""),
      String(form.get("year") ?? "")
    );
  }
  if (action === "question") {
    await createQuestion(
      env,
      Number(form.get("chapter_id")),
      normalizeId(String(form.get("question_type_id") ?? "")),
      normalizeId(String(form.get("source_id") ?? "")),
      String(form.get("image_url") ?? ""),
      String(form.get("description") ?? "") || null
    );
  }
  return redirect("/admin");
}

export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path === "/") {
      return htmlResponse(await renderHome(env));
    }

    if (path.startsWith("/class/")) {
      const classId = Number(path.split("/")[2]);
      return htmlResponse(await renderClass(env, classId));
    }

    if (path.startsWith("/subject/")) {
      const subjectId = Number(path.split("/")[2]);
      return htmlResponse(await renderSubject(env, subjectId));
    }

    if (path.startsWith("/chapter/")) {
      const chapterId = Number(path.split("/")[2]);
      return htmlResponse(await renderChapter(env, chapterId));
    }

    if (path === "/questions") {
      const chapterId = Number(url.searchParams.get("chapter_id"));
      const typeId = normalizeId(url.searchParams.get("type_id"));
      const sourceId = normalizeId(url.searchParams.get("source_id"));
      return htmlResponse(await renderQuestions(env, chapterId, typeId, sourceId));
    }

    if (path === "/login" && request.method === "GET") {
      const adminCount = await getAdminCount(env);
      return htmlResponse(await renderLoginPage(adminCount > 0));
    }

    if (path === "/login" && request.method === "POST") {
      return handleLogin(env, request);
    }

    if (path === "/logout" && request.method === "POST") {
      return handleLogout(env, request);
    }

    if (path === "/admin" && request.method === "GET") {
      const session = await requireSession(env, request);
      if (!session) return redirect("/login");
      return htmlResponse(await renderDashboard(env, session.username));
    }

    if (path.startsWith("/admin/") && request.method === "POST") {
      const session = await requireSession(env, request);
      if (!session) return redirect("/login");
      const action = path.replace("/admin/", "");
      return handleAdminPost(env, request, action);
    }

    return new Response("Not Found", { status: 404 });
  },
};
