import type { AdminSession, Env } from "../types";
import { escapeHtml } from "../ui";
import { renderAdminShell } from "./render";

interface ClassRow {
  id: number;
  name: string;
  has_groups: number;
  created_at: string;
  link_id?: number | null;
  link_name?: string | null;
}

interface GroupRow {
  id: number;
  name: string;
  class_id?: number | null;
  link_id?: number | null;
}

interface LinkMemberRow {
  link_id: number;
  class_name: string;
}

export async function renderClassManagement(options: {
  admin: AdminSession;
  env: Env;
  error?: string;
  info?: string;
}): Promise<Response> {
  const { admin, env, error, info } = options;
  const classes = await getClassList(env);
  const groups = await getClassGroups(env);
  const linkMembers = await getLinkMembers(env);

  const groupsByClassId = new Map<number, GroupRow[]>();
  const groupsByLinkId = new Map<number, GroupRow[]>();
  for (const group of groups) {
    if (group.link_id) {
      const entry = groupsByLinkId.get(group.link_id) ?? [];
      entry.push(group);
      groupsByLinkId.set(group.link_id, entry);
      continue;
    }
    if (group.class_id) {
      const entry = groupsByClassId.get(group.class_id) ?? [];
      entry.push(group);
      groupsByClassId.set(group.class_id, entry);
    }
  }

  const linkedClassMap = new Map<number, string[]>();
  for (const member of linkMembers) {
    const entry = linkedClassMap.get(member.link_id) ?? [];
    entry.push(member.class_name);
    linkedClassMap.set(member.link_id, entry);
  }

  const availableClasses = classes.filter((item) => !item.link_id);

  const contentHtml = `
    <div class="page-header">
      <div>
        <h1 class="page-title">Class Management</h1>
        <p class="page-subtitle">Create classes, manage groups, and link classes that share content.</p>
      </div>
      <div class="flex" style="gap: 0.75rem; flex-wrap: wrap;">
        <label for="class-modal-toggle" class="btn btn-primary">
          <span class="icon-plus">+</span> Add Class
        </label>
        <label for="link-modal-toggle" class="btn btn-ghost">
          <span class="icon-plus">+</span> Link Classes
        </label>
      </div>
    </div>

    ${error ? `<div class="alert alert-error mb-6">${escapeHtml(error)}</div>` : ""}
    ${info ? `<div class="alert alert-info mb-6">${escapeHtml(info)}</div>` : ""}

    ${classes.length === 0 ? `
      <div class="card p-6 text-center text-muted">No classes created yet. Use “Add Class” to get started.</div>
    ` : `
      <div class="class-grid">
        ${classes
          .map((item) => {
            const groupList = item.link_id
              ? groupsByLinkId.get(item.link_id) ?? []
              : groupsByClassId.get(item.id) ?? [];
            const linkedNames = item.link_id ? linkedClassMap.get(item.link_id) ?? [] : [];
            const linkedOthers = linkedNames.filter((name) => name !== item.name);
            const hasLinkedGroups = item.link_id ? (groupsByLinkId.get(item.link_id)?.length ?? 0) > 0 : false;
            const showGroups = item.has_groups === 1 || hasLinkedGroups;
            return `
              <div class="card class-card">
                <div>
                  <h3 class="class-title">${escapeHtml(item.name)}</h3>
                  <div class="class-meta">
                    ${item.link_id ? `<span class="badge badge-info">Linked: ${escapeHtml(item.link_name ?? "")}</span>` : `<span class="badge badge-muted">Standalone</span>`}
                    ${showGroups ? `<span class="badge badge-success">Groups Enabled</span>` : `<span class="badge badge-muted">Groups Off</span>`}
                  </div>
                </div>
                ${item.link_id ? `
                  <div class="link-summary">
                    Linked with: ${linkedOthers.length > 0 ? linkedOthers.map((name) => escapeHtml(name)).join(", ") : "No other classes yet."}
                  </div>
                ` : ""}
                ${showGroups ? `
                  <div>
                    <p class="text-sm text-muted" style="margin: 0 0 0.5rem;">Groups</p>
                    <div class="class-groups">
                      ${groupList.length > 0
                        ? groupList.map((group) => `<span class="badge badge-info">${escapeHtml(group.name)}</span>`).join("")
                        : `<span class="text-sm text-muted">No groups yet.</span>`}
                    </div>
                  </div>
                ` : ""}
                ${showGroups ? `
                  <div class="class-actions">
                    <form method="post" action="/admin/class-groups" class="group-form">
                      <input type="hidden" name="class_id" value="${item.id}" />
                      <input name="group_name" type="text" placeholder="Add group (e.g. Science)" class="form-input" required />
                      <button class="btn btn-primary" type="submit">Add Group</button>
                    </form>
                  </div>
                ` : ""}
              </div>
            `;
          })
          .join("")}
      </div>
    `}

    <input type="checkbox" id="class-modal-toggle" class="modal-toggle" />
    <div class="modal">
      <label for="class-modal-toggle" class="modal-backdrop"></label>
      <div class="modal-box">
        <div class="modal-header">
          <h3>Add New Class</h3>
          <label for="class-modal-toggle" class="btn-close">&times;</label>
        </div>
        <form method="post" action="/admin/classes" class="modal-body space-y-4">
          <div class="form-group">
            <label>Class Name</label>
            <input name="name" type="text" placeholder="e.g. SSC Batch 2025" required class="form-input" />
          </div>
          <label class="form-check">
            <input type="checkbox" name="has_groups" value="1" />
            Enable groups (Science, Humanities, Business Studies)
          </label>
          <div class="modal-actions">
            <label for="class-modal-toggle" class="btn btn-ghost">Cancel</label>
            <button type="submit" class="btn btn-primary">Create Class</button>
          </div>
        </form>
      </div>
    </div>

    <input type="checkbox" id="link-modal-toggle" class="modal-toggle" />
    <div class="modal">
      <label for="link-modal-toggle" class="modal-backdrop"></label>
      <div class="modal-box">
        <div class="modal-header">
          <h3>Link Classes</h3>
          <label for="link-modal-toggle" class="btn-close">&times;</label>
        </div>
        <form method="post" action="/admin/class-links" class="modal-body space-y-4">
          <div class="form-group">
            <label>Linked Class Name</label>
            <input name="link_name" type="text" placeholder="e.g. SSC + HSC Shared Books" required class="form-input" />
          </div>
          <div class="form-group">
            <label>Select Classes (choose at least two)</label>
            ${availableClasses.length > 0 ? `
              <div class="checkbox-list">
                ${availableClasses
                  .map(
                    (item) => `
                    <label class="form-check">
                      <input type="checkbox" name="class_ids" value="${item.id}" />
                      ${escapeHtml(item.name)}
                    </label>
                  `
                  )
                  .join("")}
              </div>
            ` : `<div class="text-sm text-muted">All classes are already linked.</div>`}
          </div>
          <div class="modal-actions">
            <label for="link-modal-toggle" class="btn btn-ghost">Cancel</label>
            <button type="submit" class="btn btn-primary">Create Link</button>
          </div>
        </form>
      </div>
    </div>
  `;

  return renderAdminShell({
    title: "Class Management",
    currentTab: "classes",
    adminName: admin.name,
    adminEmail: admin.email,
    content: contentHtml,
  });
}

export async function handleAddClass(request: Request, env: Env, admin: AdminSession): Promise<Response> {
  const formData = await request.formData();
  const name = (formData.get("name") || "").toString().trim();
  const hasGroups = formData.get("has_groups") ? 1 : 0;

  if (!name) {
    return renderClassManagement({
      admin,
      env,
      error: "Please provide a class name.",
    });
  }

  const createdAt = new Date().toISOString();
  const result = await env.DB.prepare(
    "INSERT INTO classes (name, has_groups, created_at) VALUES (?, ?, ?)"
  )
    .bind(name, hasGroups, createdAt)
    .run();

  if (!result.success) {
    return renderClassManagement({
      admin,
      env,
      error: "Unable to create the class. Please try again.",
    });
  }

  return Response.redirect(new URL("/admin?tab=classes", request.url), 303);
}

export async function handleAddGroup(request: Request, env: Env, admin: AdminSession): Promise<Response> {
  const formData = await request.formData();
  const classId = Number(formData.get("class_id"));
  const groupName = (formData.get("group_name") || "").toString().trim();

  if (!classId || !groupName) {
    return renderClassManagement({
      admin,
      env,
      error: "Please provide a group name.",
    });
  }

  const classRow = await env.DB.prepare(
    "SELECT id, has_groups FROM classes WHERE id = ?"
  )
    .bind(classId)
    .first<{ id: number; has_groups: number }>();

  if (!classRow) {
    return renderClassManagement({
      admin,
      env,
      error: "Class not found.",
    });
  }

  const linkRow = await env.DB.prepare(
    "SELECT link_id FROM class_link_members WHERE class_id = ?"
  )
    .bind(classId)
    .first<{ link_id: number }>();

  const createdAt = new Date().toISOString();
  const result = await env.DB.prepare(
    "INSERT INTO class_groups (name, class_id, link_id, created_at) VALUES (?, ?, ?, ?)"
  )
    .bind(groupName, linkRow ? null : classId, linkRow ? linkRow.link_id : null, createdAt)
    .run();

  if (!result.success) {
    return renderClassManagement({
      admin,
      env,
      error: "Unable to add the group. Please try again.",
    });
  }

  if (linkRow) {
    await env.DB.prepare(
      "UPDATE classes SET has_groups = 1 WHERE id IN (SELECT class_id FROM class_link_members WHERE link_id = ?)"
    )
      .bind(linkRow.link_id)
      .run();
  } else if (classRow.has_groups === 0) {
    await env.DB.prepare("UPDATE classes SET has_groups = 1 WHERE id = ?").bind(classId).run();
  }

  return Response.redirect(new URL("/admin?tab=classes", request.url), 303);
}

export async function handleLinkClasses(request: Request, env: Env, admin: AdminSession): Promise<Response> {
  const formData = await request.formData();
  const linkName = (formData.get("link_name") || "").toString().trim();
  const classIds = formData
    .getAll("class_ids")
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value));

  if (!linkName) {
    return renderClassManagement({
      admin,
      env,
      error: "Please provide a name for the linked classes.",
    });
  }

  if (classIds.length < 2) {
    return renderClassManagement({
      admin,
      env,
      error: "Please select at least two classes to link.",
    });
  }

  const placeholders = classIds.map(() => "?").join(", ");
  const existingLinks = await env.DB.prepare(
    `SELECT class_id FROM class_link_members WHERE class_id IN (${placeholders})`
  )
    .bind(...classIds)
    .all<{ class_id: number }>();

  if ((existingLinks.results ?? []).length > 0) {
    return renderClassManagement({
      admin,
      env,
      error: "One or more selected classes are already linked. Please pick unlinked classes.",
    });
  }

  const createdAt = new Date().toISOString();
  const insertLink = await env.DB.prepare(
    "INSERT INTO class_links (name, created_at) VALUES (?, ?)"
  )
    .bind(linkName, createdAt)
    .run();

  if (!insertLink.success) {
    return renderClassManagement({
      admin,
      env,
      error: "Unable to create the link. Please try again.",
    });
  }

  const linkId = insertLink.meta.last_row_id as number;
  const memberStatements = classIds.map((id) =>
    env.DB.prepare("INSERT INTO class_link_members (link_id, class_id) VALUES (?, ?)").bind(linkId, id)
  );
  const memberResult = await env.DB.batch(memberStatements);
  if (!memberResult.every((entry) => entry.success)) {
    return renderClassManagement({
      admin,
      env,
      error: "Unable to link the selected classes. Please try again.",
    });
  }

  const groupsCount = await env.DB.prepare(
    `SELECT COUNT(*) as count FROM class_groups WHERE class_id IN (${placeholders})`
  )
    .bind(...classIds)
    .first<{ count: number }>();

  await env.DB.prepare(
    `UPDATE class_groups SET link_id = ?, class_id = NULL WHERE class_id IN (${placeholders})`
  )
    .bind(linkId, ...classIds)
    .run();

  const classesWithGroups = await env.DB.prepare(
    `SELECT COUNT(*) as count FROM classes WHERE id IN (${placeholders}) AND has_groups = 1`
  )
    .bind(...classIds)
    .first<{ count: number }>();

  if ((classesWithGroups?.count ?? 0) > 0 || (groupsCount?.count ?? 0) > 0) {
    await env.DB.prepare(`UPDATE classes SET has_groups = 1 WHERE id IN (${placeholders})`)
      .bind(...classIds)
      .run();
  }

  return Response.redirect(new URL("/admin?tab=classes", request.url), 303);
}

async function getClassList(env: Env): Promise<ClassRow[]> {
  const result = await env.DB.prepare(
    `SELECT classes.id as id,
      classes.name as name,
      classes.has_groups as has_groups,
      classes.created_at as created_at,
      class_links.id as link_id,
      class_links.name as link_name
    FROM classes
    LEFT JOIN class_link_members ON class_link_members.class_id = classes.id
    LEFT JOIN class_links ON class_links.id = class_link_members.link_id
    ORDER BY classes.created_at DESC`
  ).all<ClassRow>();
  return result.results ?? [];
}

async function getClassGroups(env: Env): Promise<GroupRow[]> {
  const result = await env.DB.prepare(
    "SELECT id, name, class_id, link_id FROM class_groups ORDER BY name ASC"
  ).all<GroupRow>();
  return result.results ?? [];
}

async function getLinkMembers(env: Env): Promise<LinkMemberRow[]> {
  const result = await env.DB.prepare(
    `SELECT class_link_members.link_id as link_id, classes.name as class_name
     FROM class_link_members
     JOIN classes ON classes.id = class_link_members.class_id`
  ).all<LinkMemberRow>();
  return result.results ?? [];
}
