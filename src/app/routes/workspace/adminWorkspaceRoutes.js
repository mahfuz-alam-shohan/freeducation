import { html, json } from "../../../shared/http/response.js";
import { fileManagerPage } from "../../../presentation/pages/file-manager/index.js";
import { usersPage } from "../../../presentation/pages/users/index.js";
import { templatesPage } from "../../../presentation/pages/templates/index.js";
import { templateDetailPage } from "../../../presentation/pages/template-detail/index.js";
import { subjectsPage } from "../../../presentation/pages/subjects/index.js";
import { subjectPage } from "../../../presentation/pages/subject/index.js";
import { classesPage } from "../../../presentation/pages/classes/index.js";
import { classSubjectsPage } from "../../../presentation/pages/class-subjects/index.js";
import { getWorkspaceMetrics } from "../../../features/workspace/metricsService.js";
import { deleteWorkspaceResource, getWorkspaceResourceObject, listWorkspaceResources } from "../../../features/workspace/resourceService.js";
import { listUsersForWorkspace, registerUser, removeUser } from "../../../features/user/userDirectoryService.js";
import {
  createModuleChapter,
  createModuleClassEntry,
  createModuleContentItem,
  createModuleSubject,
  createModuleTopic,
  deleteModuleChapter,
  deleteModuleClassEntry,
  deleteModuleSubject,
  deleteModuleContentItem,
  deleteModuleTopic,
  getModuleChapterView,
  getModuleClassSubjects,
  getModuleContentContext,
  getModuleSubjectNodeView,
  getModuleSubjectOverview,
  getModuleTopicView,
  getModuleTemplateDetail,
  listModuleClassesForAdmin,
  listModuleContentItems,
  listModuleSubjects,
  listModuleTemplates,
  moveModuleChapter,
  moveModuleTopic,
  updateModuleChapter,
  updateModuleContentItem,
  updateModuleSubject,
  updateModuleSubjectNode,
  updateModuleTopic,
  updateModuleClassEntry,
} from "../../../features/modules/modulesService.js";

export async function handleAdminWorkspaceRoute({ request, env, url, user }) {
  const templatePageMatch = url.pathname.match(/^\/admin\/templates\/(\d+)$/);
  const subjectPageMatch = url.pathname.match(/^\/admin\/subjects\/(\d+)$/);
  const classSubjectsPageMatch = url.pathname.match(/^\/admin\/classes\/(\d+)$/);
  const apiClassMatch = url.pathname.match(/^\/api\/(?:workspace|admin)\/classes\/(\d+)$/);
  const apiTemplateDetailMatch = url.pathname.match(/^\/api\/(?:workspace|admin)\/templates\/(\d+)$/);
  const apiSubjectDetailMatch = url.pathname.match(/^\/api\/(?:workspace|admin)\/subjects\/(\d+)$/);
  const apiSubjectNodeMatch = url.pathname.match(/^\/api\/(?:workspace|admin)\/subjects\/(\d+)\/nodes\/(\d+)$/);
  const apiSubjectChaptersCollectionMatch = url.pathname.match(/^\/api\/(?:workspace|admin)\/subjects\/(\d+)\/chapters$/);
  const apiSubjectChapterMatch = url.pathname.match(/^\/api\/(?:workspace|admin)\/subjects\/(\d+)\/chapters\/(\d+)$/);
  const apiSubjectChapterReorderMatch = url.pathname.match(/^\/api\/(?:workspace|admin)\/subjects\/(\d+)\/chapters\/(\d+)\/reorder$/);
  const apiSubjectTopicsCollectionMatch = url.pathname.match(/^\/api\/(?:workspace|admin)\/subjects\/(\d+)\/topics$/);
  const apiSubjectTopicMatch = url.pathname.match(/^\/api\/(?:workspace|admin)\/subjects\/(\d+)\/topics\/(\d+)$/);
  const apiSubjectTopicReorderMatch = url.pathname.match(/^\/api\/(?:workspace|admin)\/subjects\/(\d+)\/topics\/(\d+)\/reorder$/);
  const apiContentContextMatch = url.pathname.match(/^\/api\/(?:workspace|admin)\/subjects\/(\d+)\/content-context$/);
  const apiContentItemsCollectionMatch = url.pathname.match(/^\/api\/(?:workspace|admin)\/subjects\/(\d+)\/content-items$/);
  const apiContentItemMatch = url.pathname.match(/^\/api\/(?:workspace|admin)\/subjects\/(\d+)\/content-items\/(\d+)$/);

  if (request.method === "GET" && url.pathname === "/admin/users") {
    return html(usersPage(user, { apiBase: "/api/workspace" }));
  }

  if (request.method === "GET" && url.pathname === "/admin/file-manager") {
    return html(fileManagerPage(user, { apiBase: "/api/workspace" }));
  }

  if (request.method === "GET" && url.pathname === "/admin/templates") {
    return html(templatesPage(user, { apiBase: "/api/workspace" }));
  }

  if (request.method === "GET" && templatePageMatch) {
    return html(templateDetailPage(user, {
      apiBase: "/api/workspace",
      templateId: templatePageMatch[1],
    }));
  }

  if (request.method === "GET" && url.pathname === "/admin/subjects") {
    return html(subjectsPage(user, { apiBase: "/api/workspace" }));
  }

  if (request.method === "GET" && url.pathname === "/admin/classes") {
    return html(classesPage(user, { apiBase: "/api/workspace" }));
  }

  if (request.method === "GET" && classSubjectsPageMatch) {
    return html(classSubjectsPage(user, {
      apiBase: "/api/workspace",
      classId: classSubjectsPageMatch[1],
    }));
  }

  if (request.method === "GET" && subjectPageMatch) {
    return html(subjectPage(user, {
      apiBase: "/api/workspace",
      subjectId: subjectPageMatch[1],
    }));
  }

  if (request.method === "GET" && (url.pathname === "/api/workspace/overview" || url.pathname === "/api/admin/overview")) {
    return json(await getWorkspaceMetrics(env));
  }

  if (request.method === "GET" && (url.pathname === "/api/workspace/users" || url.pathname === "/api/admin/users")) {
    return json({ users: await listUsersForWorkspace(env) });
  }

  if (request.method === "POST" && (url.pathname === "/api/workspace/users" || url.pathname === "/api/admin/users")) {
    const result = await registerUser(request, env);
    return json(result, 201);
  }

  if (request.method === "DELETE" && (url.pathname.startsWith("/api/workspace/users/") || url.pathname.startsWith("/api/admin/users/"))) {
    const userId = url.pathname.startsWith("/api/workspace/users/")
      ? url.pathname.slice("/api/workspace/users/".length)
      : url.pathname.slice("/api/admin/users/".length);
    const result = await removeUser(userId, env, user.id);
    return json(result);
  }

  if (request.method === "GET" && (url.pathname === "/api/workspace/files" || url.pathname === "/api/admin/files")) {
    const apiBase = url.pathname.startsWith("/api/workspace") ? "/api/workspace" : "/api/admin";
    return json(await listWorkspaceResources(env, {
      type: url.searchParams.get("type"),
      usage: url.searchParams.get("usage"),
      search: url.searchParams.get("search"),
      cursor: url.searchParams.get("cursor"),
      limit: url.searchParams.get("limit"),
      apiBase,
    }));
  }

  if (request.method === "GET" && (url.pathname === "/api/workspace/files/object" || url.pathname === "/api/admin/files/object")) {
    return getWorkspaceResourceObject(env, url.searchParams.get("key"));
  }

  if (request.method === "DELETE" && (url.pathname === "/api/workspace/files/object" || url.pathname === "/api/admin/files/object")) {
    return json(await deleteWorkspaceResource(env, url.searchParams.get("key")));
  }

  if (request.method === "GET" && (url.pathname === "/api/workspace/templates" || url.pathname === "/api/admin/templates")) {
    return json(await listModuleTemplates(env));
  }

  if (request.method === "GET" && apiTemplateDetailMatch) {
    return json(await getModuleTemplateDetail(env, apiTemplateDetailMatch[1]));
  }

  if (request.method === "GET" && (url.pathname === "/api/workspace/subjects" || url.pathname === "/api/admin/subjects")) {
    return json(await listModuleSubjects(env));
  }

  if (request.method === "GET" && (url.pathname === "/api/workspace/classes" || url.pathname === "/api/admin/classes")) {
    return json(await listModuleClassesForAdmin(env));
  }

  if (request.method === "POST" && (url.pathname === "/api/workspace/classes" || url.pathname === "/api/admin/classes")) {
    return json(await createModuleClassEntry(request, env), 201);
  }

  if (request.method === "PATCH" && apiClassMatch) {
    return json(await updateModuleClassEntry(request, env, apiClassMatch[1]));
  }

  if (request.method === "DELETE" && apiClassMatch) {
    return json(await deleteModuleClassEntry(env, apiClassMatch[1]));
  }

  if (request.method === "GET" && apiClassMatch) {
    return json(await getModuleClassSubjects(env, apiClassMatch[1]));
  }

  if (request.method === "POST" && (url.pathname === "/api/workspace/subjects" || url.pathname === "/api/admin/subjects")) {
    return json(await createModuleSubject(request, env, user?.id), 201);
  }

  if (request.method === "GET" && apiSubjectDetailMatch) {
    return json(await getModuleSubjectOverview(env, apiSubjectDetailMatch[1]));
  }

  if (request.method === "PATCH" && apiSubjectDetailMatch) {
    return json(await updateModuleSubject(request, env, apiSubjectDetailMatch[1]));
  }

  if (request.method === "DELETE" && apiSubjectDetailMatch) {
    return json(await deleteModuleSubject(env, apiSubjectDetailMatch[1]));
  }

  if (request.method === "GET" && apiSubjectNodeMatch) {
    return json(await getModuleSubjectNodeView(env, apiSubjectNodeMatch[1], apiSubjectNodeMatch[2]));
  }

  if (request.method === "PATCH" && apiSubjectNodeMatch) {
    return json(await updateModuleSubjectNode(request, env, apiSubjectNodeMatch[1], apiSubjectNodeMatch[2]));
  }

  if (request.method === "POST" && apiSubjectChaptersCollectionMatch) {
    return json(await createModuleChapter(request, env, apiSubjectChaptersCollectionMatch[1]), 201);
  }

  if (request.method === "POST" && apiSubjectChapterReorderMatch) {
    return json(await moveModuleChapter(request, env, apiSubjectChapterReorderMatch[1], apiSubjectChapterReorderMatch[2]));
  }

  if (request.method === "GET" && apiSubjectChapterMatch) {
    return json(await getModuleChapterView(env, apiSubjectChapterMatch[1], apiSubjectChapterMatch[2]));
  }

  if (request.method === "PATCH" && apiSubjectChapterMatch) {
    return json(await updateModuleChapter(request, env, apiSubjectChapterMatch[1], apiSubjectChapterMatch[2]));
  }

  if (request.method === "DELETE" && apiSubjectChapterMatch) {
    return json(await deleteModuleChapter(env, apiSubjectChapterMatch[1], apiSubjectChapterMatch[2]));
  }

  if (request.method === "POST" && apiSubjectTopicsCollectionMatch) {
    return json(await createModuleTopic(request, env, apiSubjectTopicsCollectionMatch[1]), 201);
  }

  if (request.method === "POST" && apiSubjectTopicReorderMatch) {
    return json(await moveModuleTopic(request, env, apiSubjectTopicReorderMatch[1], apiSubjectTopicReorderMatch[2]));
  }

  if (request.method === "GET" && apiSubjectTopicMatch) {
    return json(await getModuleTopicView(env, apiSubjectTopicMatch[1], apiSubjectTopicMatch[2]));
  }

  if (request.method === "PATCH" && apiSubjectTopicMatch) {
    return json(await updateModuleTopic(request, env, apiSubjectTopicMatch[1], apiSubjectTopicMatch[2]));
  }

  if (request.method === "DELETE" && apiSubjectTopicMatch) {
    return json(await deleteModuleTopic(env, apiSubjectTopicMatch[1], apiSubjectTopicMatch[2]));
  }

  if (request.method === "GET" && apiContentContextMatch) {
    return json(await getModuleContentContext(env, apiContentContextMatch[1], {
      contextType: url.searchParams.get("contextType"),
      contextId: url.searchParams.get("contextId"),
    }));
  }

  if (request.method === "GET" && apiContentItemsCollectionMatch) {
    return json(await listModuleContentItems(env, apiContentItemsCollectionMatch[1], {
      contextType: url.searchParams.get("contextType"),
      contextId: url.searchParams.get("contextId"),
      contentType: url.searchParams.get("contentType"),
    }));
  }

  if (request.method === "POST" && apiContentItemsCollectionMatch) {
    return json(await createModuleContentItem(request, env, apiContentItemsCollectionMatch[1], user?.id), 201);
  }

  if (request.method === "PATCH" && apiContentItemMatch) {
    return json(await updateModuleContentItem(request, env, apiContentItemMatch[1], apiContentItemMatch[2]));
  }

  if (request.method === "DELETE" && apiContentItemMatch) {
    return json(await deleteModuleContentItem(env, apiContentItemMatch[1], apiContentItemMatch[2]));
  }

  return undefined;
}
