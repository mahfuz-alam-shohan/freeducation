import { ensureSchema } from "./db/schema.js";
import { createSession, createUser, deleteSession, findUserByEmail, findUserById, listUsers, updateUserCoverImage, updateUserImage, updateUserName, updateUserPassword, updateUserDateOfBirth } from "./db/adminRepo.js";
import { createChapter, createClass, createContentEntry, createMcq, createNote, createSubject, createTopic, deleteChapter, deleteClass, deleteContentEntry, deleteMcq, deleteNote, deleteSubject, deleteTopic, ensureDefaultClasses, ensureDefaultTemplate, ensurePhyChemBioTemplate, getChapter, getClassById, getSubject, getSubjectNode, getTemplate, getTopic, listChapters, listClasses, listContentEntries, listMcqs, listNotes, listSubjectNodesByParent, listSubjects, listSubjectsByClass, listTemplateNodes, listTemplates, listTopics, moveClass, updateChapter, updateClass, updateContentEntry, updateMcq, updateNote, updateSubject, updateSubjectNode, updateTopic, upsertSummaryEntry } from "./db/modulesRepo.js";
import { hashPassword, verifyPassword } from "./security/password.js";
import { buildSessionCookie, clearSessionCookie, createSignedToken } from "./security/session.js";
import { html, json, redirect } from "./http/response.js";
import { methodNotAllowed } from "./http/request.js";
import { requireAuth } from "./api/auth.js";
import { chaptersPage, classSubjectsPage, classesPage, contentEntriesPage, contentKindsPage, dashboardPage, forbiddenPage, loginPage, mcqsPage, mediaManagerPage, notesPage, profilePage, publicChapterContentPage, publicClassesPage, publicClassSubjectsPage, publicContentEntriesPage, publicHomePage, publicMcqEntriesPage, publicSubjectNodePage, subjectNodeListPage, subjectsPage, templateDetailsPage, templatesPage, topicsPage, usersPage } from "./pages/layout.js";
import { MAX_IMAGE_BYTES, SESSION_COOKIE } from "./env.js";

const ACCESS = {
  PUBLIC: "public",
  AUTHENTICATED: "authenticated",
};
let appReadyPromise = null;

function hasSessionCookie(request) {
  const cookie = request.headers.get("cookie") || "";
  return cookie.includes(`${SESSION_COOKIE}=`);
}

function shouldResolveUser(request, route, pathname) {
  if (hasSessionCookie(request)) return true;
  if (route?.access === ACCESS.AUTHENTICATED) return true;
  if (pathname.startsWith("/api/") || pathname.startsWith("/media/")) return true;
  if (pathname.startsWith("/subjects") || pathname.startsWith("/templates") || pathname.startsWith("/classes/manage")) return true;
  return false;
}

function mergeUniqueById(items) {
  const map = new Map();
  for (const item of items) {
    if (!item?.id || map.has(item.id)) continue;
    map.set(item.id, item);
  }
  return Array.from(map.values());
}

function sortByCreatedAtDesc(items) {
  return mergeUniqueById(items).sort((a, b) => String(b.created_at || "").localeCompare(String(a.created_at || "")));
}

function resolvePublicContentNodeIds(contentNodes, fallbackNodeId, contentKind) {
  const targetNode = contentKind ? contentNodes.find((item) => item.content_kind === contentKind) : null;
  return Array.from(new Set([targetNode?.id, fallbackNodeId].filter(Boolean)));
}

async function collectPublicNotes(db, contentNodes, fallbackNodeId, chapterId, topicId = null) {
  const nodeIds = resolvePublicContentNodeIds(contentNodes, fallbackNodeId, "Short Notes");
  const notes = [];
  for (const nodeId of nodeIds) {
    notes.push(...(await listNotes(db, nodeId, chapterId, topicId)));
  }
  return sortByCreatedAtDesc(notes);
}

async function collectPublicContent(db, contentNodes, fallbackNodeId, chapterId, topicId, contentKind) {
  const nodeIds = resolvePublicContentNodeIds(contentNodes, fallbackNodeId, contentKind);

  if (contentKind === "MCQ Bank") {
    const mcqs = [];
    for (const nodeId of nodeIds) {
      mcqs.push(...(await listMcqs(db, nodeId, chapterId, topicId || null)));
    }
    return { type: "mcq", items: sortByCreatedAtDesc(mcqs) };
  }

  const entries = [];
  for (const nodeId of nodeIds) {
    entries.push(...(await listContentEntries(db, nodeId, chapterId, topicId || null, contentKind)));
  }
  return { type: "content", items: sortByCreatedAtDesc(entries) };
}

async function resolveScopedNodeIds(db, subjectId, node) {
  const ids = new Set([node?.id].filter(Boolean));
  if (!node?.parent_subject_node_id) return Array.from(ids);

  ids.add(node.parent_subject_node_id);
  if (!node.content_kind) return Array.from(ids);

  const siblings = await listSubjectNodesByParent(db, subjectId, node.parent_subject_node_id);
  for (const sibling of siblings) {
    if (sibling?.content_kind === node.content_kind) ids.add(sibling.id);
  }
  return Array.from(ids);
}

function id() {
  return crypto.randomUUID();
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isSupportedRole(role) {
  return role === "admin" || role === "teacher";
}


function inferMediaTypeFromKey(key) {
  const ext = String(key.split(".").pop() || "").toLowerCase();
  const imageExt = new Set(["jpg", "jpeg", "png", "gif", "webp", "svg", "avif", "bmp"]);
  const videoExt = new Set(["mp4", "webm", "mov", "m4v", "avi", "mkv", "wmv", "3gp", "m3u8"]);
  if (imageExt.has(ext)) return { mediaType: "image", ext };
  if (videoExt.has(ext)) return { mediaType: "video", ext };
  return { mediaType: "other", ext };
}

function inferSourceFromKey(key) {
  const firstSegment = String(key || "").split("/").filter(Boolean)[0] || "root";
  return firstSegment;
}

async function listBucketObjectsPage(bucket, options = {}) {
  const requestedLimit = Number(options.limit || 24);
  const limit = Number.isFinite(requestedLimit) ? Math.max(1, Math.min(48, requestedLimit)) : 24;
  const cursor = options.cursor ? String(options.cursor) : undefined;
  const listing = await bucket.list({ limit, cursor });

  const rows = (listing.objects || []).map((object) => {
    const typeInfo = inferMediaTypeFromKey(object.key);
    return {
      key: object.key,
      size: Number(object.size || 0),
      uploaded: object.uploaded || null,
      mediaType: typeInfo.mediaType,
      ext: typeInfo.ext,
      source: inferSourceFromKey(object.key),
    };
  });

  return {
    rows: rows.sort((a, b) => String(b.uploaded || "").localeCompare(String(a.uploaded || ""))),
    nextCursor: listing.truncated ? listing.cursor : null,
  };
}

function filterMediaRows(rows, filters) {
  const type = filters.type === "image" || filters.type === "video" || filters.type === "other" ? filters.type : "all";
  const source = String(filters.source || "all").trim();
  const search = String(filters.search || "").trim().toLowerCase();

  return rows.filter((row) => {
    if (type !== "all" && row.mediaType !== type) return false;
    if (source !== "all" && row.source !== source) return false;
    if (search && !row.key.toLowerCase().includes(search)) return false;
    return true;
  });
}

async function uploadImage(env, folder, file) {
  if (!file || file.size === 0 || typeof file.arrayBuffer !== "function") return null;
  if (file.size > MAX_IMAGE_BYTES) throw new Error("Image too large (max 5MB).");
  const ext = file.type === "image/webp" ? "webp" : file.type === "image/png" ? "png" : file.type === "image/jpeg" ? "jpg" : "bin";
  const key = `${folder}/${id()}.${ext}`;
  await env.BUCKET.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type || "application/octet-stream" },
  });
  return key;
}

async function createAndSetSession(env, userId) {
  const session = {
    id: id(),
    userId,
    expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 14,
    createdAt: new Date().toISOString(),
  };
  await createSession(env.DB, session);
  const token = await createSignedToken(env.AUTH_SECRET, session.id);
  return buildSessionCookie(token);
}

async function ensureAppReady(env) {
  if (!appReadyPromise) {
    appReadyPromise = (async () => {
      await ensureSchema(env.DB, { cleanUnknownTables: env.CLEAN_UNKNOWN_TABLES === "true" });
      await ensureDefaultTemplate(env.DB);
      await ensurePhyChemBioTemplate(env.DB);
      await ensureDefaultClasses(env.DB);
    })();
  }

  try {
    await appReadyPromise;
  } catch (error) {
    appReadyPromise = null;
    throw error;
  }
}

async function apiLogin(request, env) {
  if (request.method !== "POST") return methodNotAllowed();
  const body = await request.json().catch(() => null);
  if (!body) return json({ error: "Invalid request." }, 400);
  const email = String(body.email || "")
    .trim()
    .toLowerCase();
  const password = String(body.password || "");

  const user = await findUserByEmail(env.DB, email);
  if (!user) return json({ error: "Invalid credentials." }, 401);

  const valid = await verifyPassword(password, {
    salt: user.password_salt,
    hash: user.password_hash,
    iterations: user.password_iterations,
  });
  if (!valid) return json({ error: "Invalid credentials." }, 401);

  const cookie = await createAndSetSession(env, user.id);
  return json({ ok: true }, 200, { "Set-Cookie": cookie });
}

async function apiLogout(env, user) {
  await deleteSession(env.DB, user.sessionId);
  return redirect("/login", { "Set-Cookie": clearSessionCookie() });
}

async function getStats(db) {
  const [userCount, adminCount, sessionCount] = await Promise.all([db.prepare("SELECT COUNT(*) count FROM users").first(), db.prepare("SELECT COUNT(*) count FROM users WHERE role = 'admin'").first(), db.prepare("SELECT COUNT(*) count FROM sessions WHERE expires_at > ?1").bind(Date.now()).first()]);
  return {
    userCount: Number(userCount.count ?? 0),
    adminCount: Number(adminCount.count ?? 0),
    sessionCount: Number(sessionCount.count ?? 0),
  };
}

function routeRequiresRole(route, user) {
  return Array.isArray(route.roles) && !route.roles.includes(user.role);
}

const pageRoutes = [
  {
    path: "/",
    access: ACCESS.PUBLIC,
    handle: async ({ env, user }) => html(publicHomePage(user, await listClasses(env.DB, { homepageOnly: true }))),
  },
  {
    path: "/classes",
    access: ACCESS.PUBLIC,
    handle: async ({ env, user }) => html(publicClassesPage(user, await listClasses(env.DB))),
  },
  { path: "/login", access: ACCESS.PUBLIC, handle: () => html(loginPage()) },
  {
    path: "/dashboard",
    access: ACCESS.AUTHENTICATED,
    roles: ["admin"],
    handle: async ({ env, user }) => html(dashboardPage(user, await getStats(env.DB))),
  },
  { path: "/profile", access: ACCESS.AUTHENTICATED, handle: ({ user }) => html(profilePage(user)) },
  {
    path: "/users",
    access: ACCESS.AUTHENTICATED,
    roles: ["admin"],
    handle: async ({ env, user }) => html(usersPage(user, await listUsers(env.DB))),
  },
  {
    path: "/admin/file-manager",
    access: ACCESS.AUTHENTICATED,
    roles: ["admin"],
    handle: async ({ env, user, url }) => {
      const filters = {
        type: String(url.searchParams.get("type") || "all"),
        source: String(url.searchParams.get("source") || "all"),
        search: String(url.searchParams.get("search") || ""),
      };
      const cursor = String(url.searchParams.get("cursor") || "").trim();
      const { rows, nextCursor } = await listBucketObjectsPage(env.BUCKET, { cursor, limit: 24 });
      const filteredRows = filterMediaRows(rows, filters);

      return html(
        mediaManagerPage(user, {
          rows: filteredRows,
          filters,
          nextCursor,
          loadedCount: filteredRows.length,
          pageSize: rows.length,
        }),
      );
    },
  },
  {
    path: "/templates",
    access: ACCESS.AUTHENTICATED,
    roles: ["admin"],
    handle: async ({ env, user }) => html(templatesPage(user, await listTemplates(env.DB))),
  },
  {
    path: "/classes/manage",
    access: ACCESS.AUTHENTICATED,
    roles: ["admin"],
    handle: async ({ env, user }) => html(classesPage(user, await listClasses(env.DB))),
  },
  {
    path: "/learn",
    access: ACCESS.PUBLIC,
    handle: () => redirect("/"),
  },
  {
    path: "/subjects",
    access: ACCESS.AUTHENTICATED,
    roles: ["admin"],
    handle: async ({ env, user }) => {
      const [subjects, templates, classes] = await Promise.all([listSubjects(env.DB), listTemplates(env.DB), listClasses(env.DB)]);
      return html(subjectsPage(user, subjects, templates, classes));
    },
  },
];

async function handleProfilePost(request, env, url, user) {
  if (request.method !== "POST") return null;

  if (url.pathname === "/api/profile/name") {
    const form = await request.formData();
    const name = String(form.get("name") || "").trim();
    if (!name || name.length > 100) return redirect("/profile");
    await updateUserName(env.DB, user.id, name);
    return redirect("/profile");
  }

  if (url.pathname === "/api/profile/avatar") {
    const form = await request.formData();
    const imageKey = await uploadImage(env, "profiles", form.get("avatar"));
    if (imageKey) await updateUserImage(env.DB, user.id, imageKey);

    const wantsJson = request.headers.get("accept")?.includes("application/json");
    if (wantsJson) {
      return json({ ok: true, imageKey, imageUrl: imageKey ? `/media/${encodeURIComponent(imageKey)}` : null });
    }

    return redirect("/profile");
  }

  if (url.pathname === "/api/profile/cover") {
    const form = await request.formData();
    const imageKey = await uploadImage(env, "profile-covers", form.get("cover"));
    if (imageKey) await updateUserCoverImage(env.DB, user.id, imageKey);

    const wantsJson = request.headers.get("accept")?.includes("application/json");
    if (wantsJson) {
      return json({ ok: true, imageKey, imageUrl: imageKey ? `/media/${encodeURIComponent(imageKey)}` : null });
    }

    return redirect("/profile");
  }

  if (url.pathname === "/api/profile/password") {
    const form = await request.formData();
    const currentPassword = String(form.get("currentPassword") || "");
    const newPassword = String(form.get("newPassword") || "");

    if (newPassword.length < 8 || newPassword.length > 120) return redirect("/profile");
    const currentUser = await findUserById(env.DB, user.id);
    if (!currentUser) return redirect("/profile");

    const valid = await verifyPassword(currentPassword, {
      salt: currentUser.password_salt,
      hash: currentUser.password_hash,
      iterations: currentUser.password_iterations,
    });
    if (!valid) return redirect("/profile");

    const hashed = await hashPassword(newPassword);
    await updateUserPassword(env.DB, user.id, hashed.hash, hashed.salt, hashed.iterations);
    return redirect("/profile");
  }

  if (url.pathname === "/api/profile/dob") {
    const form = await request.formData();
    let dateOfBirthRaw = String(form.get("dateOfBirth") || "").trim();

    if (!dateOfBirthRaw) {
      const day = String(form.get("dobDay") || "").trim();
      const month = String(form.get("dobMonth") || "").trim();
      const year = String(form.get("dobYear") || "").trim();
      if (!day && !month && !year) {
        await updateUserDateOfBirth(env.DB, user.id, null);
        return redirect("/profile");
      }
      if (day && month && year) {
        dateOfBirthRaw = `${year.padStart(4, "0")}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      }
    }

    if (!dateOfBirthRaw) return redirect("/profile");

    const dobMatch = /^\d{4}-\d{2}-\d{2}$/.test(dateOfBirthRaw);
    const dobDate = new Date(`${dateOfBirthRaw}T00:00:00.000Z`);
    const isValidDate = Number.isFinite(dobDate.getTime()) && dobDate.toISOString().slice(0, 10) === dateOfBirthRaw;
    const earliest = new Date(Date.UTC(1900, 0, 1));
    const today = new Date();
    const latest = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
    if (!dobMatch || !isValidDate || dobDate < earliest || dobDate > latest) return redirect("/profile");

    await updateUserDateOfBirth(env.DB, user.id, dateOfBirthRaw);
    return redirect("/profile");
  }

  return null;
}

async function handleAdminPost(request, env, url) {
  if (url.pathname === "/api/users" && request.method === "POST") {
    const form = await request.formData();
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "")
      .trim()
      .toLowerCase();
    const password = String(form.get("password") || "");
    const role = String(form.get("role") || "").trim().toLowerCase();

    if (!name || name.length > 100 || !isEmail(email) || password.length < 8 || password.length > 120 || !isSupportedRole(role)) {
      return redirect("/users");
    }

    const existing = await findUserByEmail(env.DB, email);
    if (existing) return redirect("/users");

    const hashed = await hashPassword(password);
    await createUser(env.DB, {
      id: id(),
      email,
      name,
      role,
      passwordHash: hashed.hash,
      passwordSalt: hashed.salt,
      passwordIterations: hashed.iterations,
      createdAt: new Date().toISOString(),
    });
    return redirect("/users");
  }

  if (url.pathname === "/api/classes" && request.method === "POST") {
    const form = await request.formData();
    const name = String(form.get("name") || "").trim();
    const showOnHome = form.get("showOnHome") === "1";
    if (!name) return redirect("/classes/manage");
    const imageKey = await uploadImage(env, "classes", form.get("image"));
    await createClass(env.DB, { name, imageKey, showOnHome });
    return redirect("/classes/manage");
  }

  if (url.pathname.startsWith("/api/classes/") && request.method === "POST") {
    const classId = url.pathname.split("/").pop();
    const current = await getClassById(env.DB, classId);
    if (!current) return new Response("Not found", { status: 404 });
    const form = await request.formData();
    const intent = String(form.get("intent") || "update");
    if (intent === "delete") {
      await deleteClass(env.DB, classId);
      return redirect("/classes/manage");
    }
    if (intent === "move-up" || intent === "move-down") {
      await moveClass(env.DB, classId, intent === "move-up" ? "up" : "down");
      return redirect("/classes/manage");
    }

    const name = String(form.get("name") || "").trim();
    if (!name) return redirect("/classes/manage");
    const showOnHome = form.get("showOnHome") === "1";
    const removeImage = form.get("removeImage") === "1";
    const uploaded = await uploadImage(env, "classes", form.get("image"));
    const imageKey = removeImage ? null : uploaded || current.image_key;
    await updateClass(env.DB, classId, {
      name,
      imageKey,
      showOnHome,
    });
    return redirect("/classes/manage");
  }

  if (url.pathname === "/api/subjects" && request.method === "POST") {
    const form = await request.formData();
    const name = String(form.get("name") || "").trim();
    const classId = String(form.get("classId") || "");
    const templateId = String(form.get("templateId") || "");
    if (!name || !templateId || !classId) return redirect("/subjects");
    const selectedClass = await getClassById(env.DB, classId);
    if (!selectedClass) return redirect("/subjects");
    const classLevelMatch = String(selectedClass.name).match(/(\d+)/);
    const classLevel = classLevelMatch ? Number(classLevelMatch[1]) : 0;
    const imageKey = await uploadImage(env, "subjects", form.get("image"));
    await createSubject(env.DB, { name, classId, classLevel, templateId, imageKey });
    return redirect("/subjects");
  }

  if (url.pathname.startsWith("/api/subjects/") && request.method === "POST") {
    const subjectId = url.pathname.split("/").pop();
    const form = await request.formData();
    const intent = String(form.get("intent") || "update");
    const current = await getSubject(env.DB, subjectId);
    if (!current) return new Response("Not found", { status: 404 });
    if (intent === "delete") {
      await deleteSubject(env.DB, subjectId);
      return redirect("/subjects");
    }
    const name = String(form.get("name") || "").trim();
    if (!name) return redirect("/subjects");
    const removeImage = form.get("removeImage") === "1";
    const uploaded = await uploadImage(env, "subjects", form.get("image"));
    const imageKey = removeImage ? null : uploaded || current.image_key;
    await updateSubject(env.DB, subjectId, name, imageKey);
    return redirect("/subjects");
  }

  if (url.pathname.startsWith("/api/subject-nodes/") && request.method === "POST") {
    const nodeId = url.pathname.split("/").pop();
    const node = await getSubjectNode(env.DB, nodeId);
    if (!node) return new Response("Not found", { status: 404 });
    const form = await request.formData();
    const displayName = node.supports_edit ? String(form.get("displayName") || node.display_name).trim() : node.display_name;
    const removeImage = form.get("removeImage") === "1";
    const image = form.get("image");
    const uploaded = node.supports_image ? await uploadImage(env, "subject-nodes", image) : null;
    const imageKey = removeImage ? null : uploaded || node.image_key;
    await updateSubjectNode(env.DB, nodeId, displayName || node.display_name, imageKey);
    return redirect(String(form.get("redirect") || "/subjects"));
  }

  if (url.pathname === "/api/chapters" && request.method === "POST") {
    const form = await request.formData();
    const subjectNodeId = String(form.get("subjectNodeId") || "");
    const subjectId = String(form.get("subjectId") || "");
    const name = String(form.get("name") || "").trim();
    if (!subjectNodeId || !name) return redirect("/subjects");
    const imageKey = await uploadImage(env, "chapters", form.get("image"));
    const hasTopics = form.get("hasTopics") === "1" ? 1 : 0;
    await createChapter(env.DB, subjectNodeId, name, imageKey, hasTopics);
    return redirect(`/subjects/${subjectId}/nodes/${subjectNodeId}`);
  }

  if (url.pathname.startsWith("/api/chapters/") && request.method === "POST") {
    const chapterId = url.pathname.split("/").pop();
    const current = await getChapter(env.DB, chapterId);
    if (!current) return new Response("Not found", { status: 404 });
    const form = await request.formData();
    const intent = String(form.get("intent") || "update");
    const subjectId = String(form.get("subjectId") || "");
    const nodeId = String(form.get("nodeId") || current.subject_node_id);
    if (intent === "delete") {
      await deleteChapter(env.DB, chapterId);
    } else {
      const uploaded = await uploadImage(env, "chapters", form.get("image"));
      const removeImage = form.get("removeImage") === "1";
      const imageKey = removeImage ? null : uploaded || current.image_key;
      const hasTopics = form.get("hasTopics") === "1" ? 1 : 0;
      await updateChapter(env.DB, chapterId, String(form.get("name") || current.name), imageKey, hasTopics);
    }
    return redirect(`/subjects/${subjectId}/nodes/${nodeId}`);
  }

  if (url.pathname === "/api/topics" && request.method === "POST") {
    const form = await request.formData();
    const chapterId = String(form.get("chapterId") || "");
    const subjectId = String(form.get("subjectId") || "");
    const nodeId = String(form.get("nodeId") || "");
    const name = String(form.get("name") || "").trim();
    if (!chapterId || !name) return redirect("/subjects");
    const imageKey = await uploadImage(env, "topics", form.get("image"));
    await createTopic(env.DB, chapterId, name, imageKey);
    return redirect(`/subjects/${subjectId}/nodes/${nodeId}/chapters/${chapterId}`);
  }

  if (url.pathname.startsWith("/api/topics/") && request.method === "POST") {
    const topicId = url.pathname.split("/").pop();
    const current = await getTopic(env.DB, topicId);
    if (!current) return new Response("Not found", { status: 404 });
    const form = await request.formData();
    const intent = String(form.get("intent") || "update");
    const subjectId = String(form.get("subjectId") || "");
    const nodeId = String(form.get("nodeId") || "");
    const chapterId = String(form.get("chapterId") || current.chapter_id);
    if (intent === "delete") {
      await deleteTopic(env.DB, topicId);
    } else {
      const uploaded = await uploadImage(env, "topics", form.get("image"));
      const removeImage = form.get("removeImage") === "1";
      const imageKey = removeImage ? null : uploaded || current.image_key;
      await updateTopic(env.DB, topicId, String(form.get("name") || current.name), imageKey);
    }
    return redirect(`/subjects/${subjectId}/nodes/${nodeId}/chapters/${chapterId}`);
  }

  if (url.pathname === "/api/notes" && request.method === "POST") {
    const form = await request.formData();
    const idVal = String(form.get("id") || "");
    const subjectId = String(form.get("subjectId") || "");
    const subjectNodeId = String(form.get("subjectNodeId") || "");
    const chapterId = String(form.get("chapterId") || "");
    const topicId = String(form.get("topicId") || "");
    const page = Number.parseInt(String(form.get("page") || "1"), 10);
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    const contentHtml = String(form.get("contentHtml") || "").trim();
    const redirectUrl = `/subjects/${subjectId}/notes?node=${subjectNodeId}&chapter=${chapterId}&topic=${topicId}&page=${safePage}`;
    if (!contentHtml) return redirect(redirectUrl);
    if (!idVal) {
      await createNote(env.DB, { subjectId, subjectNodeId, chapterId, topicId, contentHtml, imageKey: null });
    } else {
      await updateNote(env.DB, { id: idVal, contentHtml, imageKey: null });
    }
    return redirect(redirectUrl);
  }

  if (url.pathname === "/api/notes/delete" && request.method === "POST") {
    const form = await request.formData();
    const idVal = String(form.get("id") || "");
    const subjectId = String(form.get("subjectId") || "");
    const subjectNodeId = String(form.get("subjectNodeId") || "");
    const chapterId = String(form.get("chapterId") || "");
    const topicId = String(form.get("topicId") || "");
    const page = Number.parseInt(String(form.get("page") || "1"), 10);
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    if (idVal) await deleteNote(env.DB, idVal);
    return redirect(`/subjects/${subjectId}/notes?node=${subjectNodeId}&chapter=${chapterId}&topic=${topicId}&page=${safePage}`);
  }

  if (url.pathname === "/api/mcqs" && request.method === "POST") {
    const form = await request.formData();
    const idVal = String(form.get("id") || "");
    const subjectId = String(form.get("subjectId") || "");
    const subjectNodeId = String(form.get("subjectNodeId") || "");
    const chapterId = String(form.get("chapterId") || "");
    const topicId = String(form.get("topicId") || "");
    const page = Number.parseInt(String(form.get("page") || "1"), 10);
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    const payload = {
      id: idVal,
      subjectId,
      subjectNodeId,
      chapterId,
      topicId,
      questionHtml: String(form.get("questionHtml") || "").trim(),
      optionA: String(form.get("optionA") || "").trim(),
      optionB: String(form.get("optionB") || "").trim(),
      optionC: String(form.get("optionC") || "").trim(),
      optionD: String(form.get("optionD") || "").trim(),
      correctOption: String(form.get("correctOption") || "A"),
    };
    const redirectUrl = `/subjects/${subjectId}/mcqs?node=${subjectNodeId}&chapter=${chapterId}&topic=${topicId}&page=${safePage}`;
    if (!payload.questionHtml || !payload.optionA || !payload.optionB || !payload.optionC || !payload.optionD) return redirect(redirectUrl);
    if (!idVal) {
      payload.imageKey = await uploadImage(env, "mcq", form.get("image"));
      await createMcq(env.DB, payload);
    } else {
      const existing = (await listMcqs(env.DB, subjectNodeId, chapterId, topicId)).find((m) => m.id === idVal);
      const uploaded = await uploadImage(env, "mcq", form.get("image"));
      payload.imageKey = form.get("removeImage") === "1" ? null : uploaded || existing?.image_key || null;
      await updateMcq(env.DB, payload);
    }
    return redirect(redirectUrl);
  }

  if (url.pathname === "/api/mcqs/delete" && request.method === "POST") {
    const form = await request.formData();
    const idVal = String(form.get("id") || "");
    const subjectId = String(form.get("subjectId") || "");
    const subjectNodeId = String(form.get("subjectNodeId") || "");
    const chapterId = String(form.get("chapterId") || "");
    const topicId = String(form.get("topicId") || "");
    const page = Number.parseInt(String(form.get("page") || "1"), 10);
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    if (idVal) await deleteMcq(env.DB, idVal);
    return redirect(`/subjects/${subjectId}/mcqs?node=${subjectNodeId}&chapter=${chapterId}&topic=${topicId}&page=${safePage}`);
  }

  if (url.pathname === "/api/content-entries" && request.method === "POST") {
    const form = await request.formData();
    const idVal = String(form.get("id") || "");
    const subjectId = String(form.get("subjectId") || "");
    const subjectNodeId = String(form.get("subjectNodeId") || "");
    const chapterId = String(form.get("chapterId") || "");
    const topicId = String(form.get("topicId") || "");
    const contentKind = String(form.get("contentKind") || "").trim();
    const page = Number.parseInt(String(form.get("page") || "1"), 10);
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    const title = String(form.get("title") || "").trim();
    const contentHtml = String(form.get("contentHtml") || "").trim();
    const redirectUrl = `/subjects/${subjectId}/content?node=${subjectNodeId}&chapter=${chapterId}&topic=${topicId}&kind=${encodeURIComponent(contentKind)}&page=${safePage}`;
    if (!contentKind || !contentHtml) return redirect(redirectUrl);

    if (!idVal) {
      if (contentKind === "Summary") {
        await upsertSummaryEntry(env.DB, { subjectId, subjectNodeId, chapterId, topicId, contentHtml });
      } else {
        const imageKey = await uploadImage(env, "content", form.get("image"));
        await createContentEntry(env.DB, { subjectId, subjectNodeId, chapterId, topicId, contentKind, title, contentHtml, imageKey });
      }
    } else {
      if (contentKind === "Summary") {
        await upsertSummaryEntry(env.DB, { subjectId, subjectNodeId, chapterId, topicId, contentHtml });
      } else {
        const existing = (await listContentEntries(env.DB, subjectNodeId, chapterId, topicId, contentKind)).find((entry) => entry.id === idVal);
        const uploaded = await uploadImage(env, "content", form.get("image"));
        const imageKey = form.get("removeImage") === "1" ? null : uploaded || existing?.image_key || null;
        await updateContentEntry(env.DB, { id: idVal, title, contentHtml, imageKey });
      }
    }

    return redirect(redirectUrl);
  }

  if (url.pathname === "/api/media/delete" && request.method === "POST") {
    const form = await request.formData();
    const key = String(form.get("key") || "").trim();
    const redirectTo = String(form.get("redirect") || "/admin/file-manager");
    if (!key || key.includes("..")) return redirect(redirectTo || "/admin/file-manager");
    await env.BUCKET.delete(key);
    return redirect(redirectTo || "/admin/file-manager");
  }

  if (url.pathname === "/api/content-entries/delete" && request.method === "POST") {
    const form = await request.formData();
    const idVal = String(form.get("id") || "");
    const subjectId = String(form.get("subjectId") || "");
    const subjectNodeId = String(form.get("subjectNodeId") || "");
    const chapterId = String(form.get("chapterId") || "");
    const topicId = String(form.get("topicId") || "");
    const kind = String(form.get("kind") || "").trim();
    const page = Number.parseInt(String(form.get("page") || "1"), 10);
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    if (idVal) await deleteContentEntry(env.DB, idVal);
    return redirect(`/subjects/${subjectId}/content?node=${subjectNodeId}&chapter=${chapterId}&topic=${topicId}&kind=${encodeURIComponent(kind)}&page=${safePage}`);
  }
  return null;
}

async function serveMedia(request, url, env, user, ctx) {
  const encodedKey = url.pathname.slice("/media/".length);
  if (!encodedKey) return new Response("Not Found", { status: 404 });

  let key;
  try {
    key = decodeURIComponent(encodedKey);
  } catch {
    return new Response("Not Found", { status: 404 });
  }

  if (!key || key.includes("..")) return new Response("Not Found", { status: 404 });

  const isUserSpecificMedia = key.startsWith("profiles/");
  if (isUserSpecificMedia && !user) return redirect("/login");

  const method = request.method.toUpperCase();
  const canUseCache = method === "GET";
  const cacheKey = new Request(`https://media-cache.local/${encodeURIComponent(key)}`, { method: "GET" });
  if (canUseCache) {
    const cached = await caches.default.match(cacheKey);
    if (cached) return cached;
  }

  const object = await env.BUCKET.get(key);
  if (!object) return new Response("Not Found", { status: 404 });

  const etag = object.httpEtag;
  const ifNoneMatch = request.headers.get("if-none-match");
  if (etag && ifNoneMatch && ifNoneMatch === etag) {
    return new Response(null, {
      status: 304,
      headers: {
        etag,
        "cache-control": `${isUserSpecificMedia ? "private" : "public"}, max-age=2592000, stale-while-revalidate=86400`,
      },
    });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  if (etag) headers.set("etag", etag);
  headers.set("cache-control", `${isUserSpecificMedia ? "private" : "public"}, max-age=2592000, stale-while-revalidate=86400`);
  headers.set("accept-ranges", "bytes");

  if (method === "HEAD") return new Response(null, { headers });
  const response = new Response(object.body, { headers });
  if (canUseCache) {
    ctx.waitUntil(caches.default.put(cacheKey, response.clone()));
  }
  return response;
}

async function handleDynamicPages(url, env, user) {
  const adminClassMatch = url.pathname.match(/^\/classes\/manage\/([^/]+)$/);
  if (adminClassMatch) {
    const classItem = await getClassById(env.DB, adminClassMatch[1]);
    if (!classItem) return new Response("Not Found", { status: 404 });
    if (!user || user.role !== "admin") return html(forbiddenPage(), 403);
    const subjects = await listSubjectsByClass(env.DB, classItem.id);
    return html(classSubjectsPage(user, classItem, subjects));
  }

  const publicClassMatch = url.pathname.match(/^\/classes\/([^/]+)$/);
  if (publicClassMatch) {
    const classItem = await getClassById(env.DB, publicClassMatch[1]);
    if (!classItem) return new Response("Not Found", { status: 404 });
    const subjects = await listSubjectsByClass(env.DB, classItem.id);
    return html(publicClassSubjectsPage(user, classItem, subjects));
  }

  const publicSubjectRootMatch = url.pathname.match(/^\/learn\/subjects\/([^/]+)$/);
  if (publicSubjectRootMatch) {
    const subject = await getSubject(env.DB, publicSubjectRootMatch[1]);
    if (!subject) return new Response("Not Found", { status: 404 });
    const nodes = await listSubjectNodesByParent(env.DB, subject.id, null);
    if (nodes.length === 1 && nodes[0].supports_chapters) {
      const rootNode = nodes[0];
      const chapters = await listChapters(env.DB, rootNode.id);
      return html(publicSubjectNodePage(user, subject, subject.name, "Choose a chapter.", chapters, (chapter) => `/learn/subjects/${subject.id}/nodes/${rootNode.id}/chapters/${chapter.id}`));
    }
    return html(publicSubjectNodePage(user, subject, subject.name, "Select a book.", nodes, (node) => `/learn/subjects/${subject.id}/nodes/${node.id}`));
  }

  const publicSubjectNodeMatch = url.pathname.match(/^\/learn\/subjects\/([^/]+)\/nodes\/([^/]+)$/);
  if (publicSubjectNodeMatch) {
    const [subject, node] = await Promise.all([getSubject(env.DB, publicSubjectNodeMatch[1]), getSubjectNode(env.DB, publicSubjectNodeMatch[2])]);
    if (!subject || !node) return new Response("Not Found", { status: 404 });

    if (node.supports_chapters) {
      const chapters = await listChapters(env.DB, node.id);
      return html(publicSubjectNodePage(user, subject, node.display_name, "Choose a chapter.", chapters, (chapter) => `/learn/subjects/${subject.id}/nodes/${node.id}/chapters/${chapter.id}`));
    }

    const children = await listSubjectNodesByParent(env.DB, subject.id, node.id);
    const sectionChildren = children.filter((child) => child.node_type !== "content");
    if (sectionChildren.length > 0) {
      return html(publicSubjectNodePage(user, subject, node.display_name, "Choose a section.", sectionChildren, (child) => `/learn/subjects/${subject.id}/nodes/${child.id}`));
    }

    return new Response("Not Found", { status: 404 });
  }

  const publicChapterMatch = url.pathname.match(/^\/learn\/subjects\/([^/]+)\/nodes\/([^/]+)\/chapters\/([^/]+)$/);
  if (publicChapterMatch) {
    const [subject, node, chapter] = await Promise.all([getSubject(env.DB, publicChapterMatch[1]), getSubjectNode(env.DB, publicChapterMatch[2]), getChapter(env.DB, publicChapterMatch[3])]);
    if (!subject || !node || !chapter) return new Response("Not Found", { status: 404 });

    if (chapter.has_topics) {
      const topics = await listTopics(env.DB, chapter.id);
      return html(publicSubjectNodePage(user, subject, chapter.name, "Choose a topic.", topics, (topic) => `/learn/subjects/${subject.id}/nodes/${node.id}/chapters/${chapter.id}/topics/${topic.id}`));
    }

    const contentNodes = await listSubjectNodesByParent(env.DB, subject.id, node.id);
    const notes = await collectPublicNotes(env.DB, contentNodes, node.id, chapter.id);
    return html(publicChapterContentPage(user, subject, node, chapter, notes, contentNodes));
  }

  const publicTopicMatch = url.pathname.match(/^\/learn\/subjects\/([^/]+)\/nodes\/([^/]+)\/chapters\/([^/]+)\/topics\/([^/]+)$/);
  if (publicTopicMatch) {
    const [subject, node, chapter, topic] = await Promise.all([getSubject(env.DB, publicTopicMatch[1]), getSubjectNode(env.DB, publicTopicMatch[2]), getChapter(env.DB, publicTopicMatch[3]), getTopic(env.DB, publicTopicMatch[4])]);
    if (!subject || !node || !chapter || !topic) return new Response("Not Found", { status: 404 });

    const contentNodes = await listSubjectNodesByParent(env.DB, subject.id, node.id);
    const notes = await collectPublicNotes(env.DB, contentNodes, node.id, chapter.id, topic.id);
    return html(publicChapterContentPage(user, subject, node, topic, notes, contentNodes, topic.id));
  }

  const publicContentMatch = url.pathname.match(/^\/learn\/subjects\/([^/]+)\/nodes\/([^/]+)\/chapters\/([^/]+)\/content\/([^/]+)$/);
  if (publicContentMatch) {
    const contentKind = decodeURIComponent(publicContentMatch[4]);
    const topicId = url.searchParams.get("topic");
    const [subject, node, chapter] = await Promise.all([getSubject(env.DB, publicContentMatch[1]), getSubjectNode(env.DB, publicContentMatch[2]), getChapter(env.DB, publicContentMatch[3])]);
    if (!subject || !node || !chapter || !contentKind) return new Response("Not Found", { status: 404 });

    const contentNodes = await listSubjectNodesByParent(env.DB, subject.id, node.id);
    const contentResult = await collectPublicContent(env.DB, contentNodes, node.id, chapter.id, topicId, contentKind);

    if (contentResult.type === "mcq") {
      return html(publicMcqEntriesPage(user, subject, chapter, contentResult.items));
    }

    return html(publicContentEntriesPage(user, subject, chapter, contentKind, contentResult.items));
  }

  const templateMatch = url.pathname.match(/^\/templates\/([^/]+)$/);
  if (templateMatch) {
    const template = await getTemplate(env.DB, templateMatch[1]);
    if (!template) return new Response("Not Found", { status: 404 });
    const nodes = await listTemplateNodes(env.DB, template.id);
    return html(templateDetailsPage(user, template, nodes));
  }

  const subjectRootMatch = url.pathname.match(/^\/subjects\/([^/]+)$/);
  if (subjectRootMatch) {
    const subject = await getSubject(env.DB, subjectRootMatch[1]);
    if (!subject) return new Response("Not Found", { status: 404 });
    const nodes = await listSubjectNodesByParent(env.DB, subject.id, null);
    if (nodes.length === 1 && nodes[0].supports_chapters) {
      const rootNode = nodes[0];
      return html(chaptersPage(user, subject, rootNode, await listChapters(env.DB, rootNode.id)));
    }
    return html(subjectNodeListPage(user, subject, `${subject.name} · Top Categories`, "Manage Main Book and Assisting Book.", nodes, "/subjects"));
  }

  const subjectNodeMatch = url.pathname.match(/^\/subjects\/([^/]+)\/nodes\/([^/]+)$/);
  if (subjectNodeMatch) {
    const [subject, node] = await Promise.all([getSubject(env.DB, subjectNodeMatch[1]), getSubjectNode(env.DB, subjectNodeMatch[2])]);
    if (!subject || !node) return new Response("Not Found", { status: 404 });

    if (node.supports_chapters) {
      return html(chaptersPage(user, subject, node, await listChapters(env.DB, node.id)));
    }

    const children = await listSubjectNodesByParent(env.DB, subject.id, node.id);
    const contentChildren = children.filter((child) => child.node_type === "content");
    const sectionChildren = children.filter((child) => child.node_type !== "content");
    if (sectionChildren.length > 0) {
      return html(subjectNodeListPage(user, subject, `${subject.name} · ${node.display_name}`, "Rename items and upload template images.", sectionChildren, `/subjects/${subject.id}`));
    }

    return html(contentKindsPage(user, subject, node, null, null, contentChildren));
  }

  const chapterPageMatch = url.pathname.match(/^\/subjects\/([^/]+)\/nodes\/([^/]+)\/chapters\/([^/]+)$/);
  if (chapterPageMatch) {
    const [subject, node, chapter] = await Promise.all([getSubject(env.DB, chapterPageMatch[1]), getSubjectNode(env.DB, chapterPageMatch[2]), getChapter(env.DB, chapterPageMatch[3])]);
    if (!subject || !node || !chapter) return new Response("Not Found", { status: 404 });
    if (chapter.has_topics) {
      return html(topicsPage(user, subject, node, chapter, await listTopics(env.DB, chapter.id)));
    }
    const contentChildren = await listSubjectNodesByParent(env.DB, subject.id, node.id);
    return html(contentKindsPage(user, subject, node, chapter, null, contentChildren));
  }

  const topicPageMatch = url.pathname.match(/^\/subjects\/([^/]+)\/nodes\/([^/]+)\/chapters\/([^/]+)\/topics\/([^/]+)$/);
  if (topicPageMatch) {
    const [subject, node, chapter, topic] = await Promise.all([getSubject(env.DB, topicPageMatch[1]), getSubjectNode(env.DB, topicPageMatch[2]), getChapter(env.DB, topicPageMatch[3]), getTopic(env.DB, topicPageMatch[4])]);
    if (!subject || !node || !chapter || !topic) return new Response("Not Found", { status: 404 });
    const contentChildren = await listSubjectNodesByParent(env.DB, subject.id, node.id);
    return html(contentKindsPage(user, subject, node, chapter, topic, contentChildren));
  }

  if (url.pathname.match(/^\/subjects\/([^/]+)\/content$/)) {
    const subjectId = url.pathname.split("/")[2];
    const nodeId = url.searchParams.get("node");
    const chapterId = url.searchParams.get("chapter");
    const topicId = url.searchParams.get("topic");
    const contentKind = String(url.searchParams.get("kind") || "").trim();
    const page = Number.parseInt(url.searchParams.get("page") || "1", 10);
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    const [subject, node, chapter, topic] = await Promise.all([getSubject(env.DB, subjectId), getSubjectNode(env.DB, nodeId), chapterId ? getChapter(env.DB, chapterId) : Promise.resolve(null), topicId ? getTopic(env.DB, topicId) : Promise.resolve(null)]);
    if (!subject || !node || !contentKind) return new Response("Not Found", { status: 404 });
    const scopedNodeIds = await resolveScopedNodeIds(env.DB, subject.id, node);
    const entries = [];
    for (const scopedNodeId of scopedNodeIds) {
      const scopedEntries = await listContentEntries(env.DB, scopedNodeId, chapter?.id, topic?.id, contentKind);
      entries.push(...scopedEntries);
    }
    const uniqueEntries = mergeUniqueById(entries).sort((a, b) => String(b.created_at || "").localeCompare(String(a.created_at || "")));
    return html(contentEntriesPage(user, subject, node, chapter, topic, contentKind, uniqueEntries, safePage));
  }

  if (url.pathname.match(/^\/subjects\/([^/]+)\/notes$/)) {
    const subjectId = url.pathname.split("/")[2];
    const nodeId = url.searchParams.get("node");
    const chapterId = url.searchParams.get("chapter");
    const topicId = url.searchParams.get("topic");
    const page = Number.parseInt(url.searchParams.get("page") || "1", 10);
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    const [subject, node, chapter, topic] = await Promise.all([getSubject(env.DB, subjectId), getSubjectNode(env.DB, nodeId), chapterId ? getChapter(env.DB, chapterId) : Promise.resolve(null), topicId ? getTopic(env.DB, topicId) : Promise.resolve(null)]);
    if (!subject || !node) return new Response("Not Found", { status: 404 });
    const scopedNodeIds = await resolveScopedNodeIds(env.DB, subject.id, node);
    const notes = [];
    for (const scopedNodeId of scopedNodeIds) {
      const scopedNotes = await listNotes(env.DB, scopedNodeId, chapter?.id, topic?.id);
      notes.push(...scopedNotes);
    }
    const uniqueNotes = mergeUniqueById(notes).sort((a, b) => String(b.created_at || "").localeCompare(String(a.created_at || "")));
    return html(notesPage(user, subject, node, chapter, topic, uniqueNotes, safePage));
  }

  if (url.pathname.match(/^\/subjects\/([^/]+)\/mcqs$/)) {
    const subjectId = url.pathname.split("/")[2];
    const nodeId = url.searchParams.get("node");
    const chapterId = url.searchParams.get("chapter");
    const topicId = url.searchParams.get("topic");
    const page = Number.parseInt(url.searchParams.get("page") || "1", 10);
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    const [subject, node, chapter, topic] = await Promise.all([getSubject(env.DB, subjectId), getSubjectNode(env.DB, nodeId), chapterId ? getChapter(env.DB, chapterId) : Promise.resolve(null), topicId ? getTopic(env.DB, topicId) : Promise.resolve(null)]);
    if (!subject || !node) return new Response("Not Found", { status: 404 });
    const scopedNodeIds = await resolveScopedNodeIds(env.DB, subject.id, node);
    const mcqs = [];
    for (const scopedNodeId of scopedNodeIds) {
      const scopedMcqs = await listMcqs(env.DB, scopedNodeId, chapter?.id, topic?.id);
      mcqs.push(...scopedMcqs);
    }
    const uniqueMcqs = mergeUniqueById(mcqs).sort((a, b) => String(b.created_at || "").localeCompare(String(a.created_at || "")));
    return html(mcqsPage(user, subject, node, chapter, topic, uniqueMcqs, safePage));
  }

  return null;
}

export default {
  async fetch(request, env, ctx) {
    if (!env.AUTH_SECRET) return new Response("AUTH_SECRET is required", { status: 500 });

    try {
      await ensureAppReady(env);
    } catch (error) {
      return json({ error: error instanceof Error ? error.message : "Schema initialization failed." }, 500);
    }

    const url = new URL(request.url);

    if (url.pathname === "/api/login") return apiLogin(request, env);


    const route = pageRoutes.find((item) => item.path === url.pathname);
    const user = shouldResolveUser(request, route, url.pathname) ? await requireAuth(request, env) : null;

    if (url.pathname.startsWith("/media/")) return serveMedia(request, url, env, user, ctx);

    if (url.pathname === "/api/logout") {
      if (!user) return redirect("/login");
      return apiLogout(env, user);
    }

    if (url.pathname.startsWith("/api/") && request.method === "POST" && url.pathname !== "/api/login") {
      if (!user) return redirect("/login");
      const profilePost = await handleProfilePost(request, env, url, user);
      if (profilePost) return profilePost;
      if (user.role !== "admin") return html(forbiddenPage(), 403);
      const protectedPost = await handleAdminPost(request, env, url);
      if (protectedPost) return protectedPost;
    }

    if (!route) {
      const isAdminDynamicPath = url.pathname.startsWith("/subjects") || url.pathname.startsWith("/templates") || url.pathname.startsWith("/classes/manage");

      if (isAdminDynamicPath) {
        if (!user) return redirect("/login");
        if (user.role !== "admin") return html(forbiddenPage(), 403);
      }

      const dynamic = await handleDynamicPages(url, env, user);
      if (dynamic) return dynamic;
      return new Response("Not Found", { status: 404 });
    }

    if (route.access === ACCESS.AUTHENTICATED && !user) {
      if (url.pathname.startsWith("/api/")) return json({ error: "Unauthorized" }, 401);
      return redirect("/login");
    }

    if (route.access === ACCESS.AUTHENTICATED && routeRequiresRole(route, user)) return html(forbiddenPage(), 403);
    return route.handle({ request, env, user, url });
  },
};
