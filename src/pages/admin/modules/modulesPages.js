import { appShell } from "../../templates/shell.js";
import { imageUrlFromKey } from "../../imageUrl.js";
import { modulesStyles } from "./modulesStyles.js";

function h(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function fullTextCell(value, modalId, title = "Full text") {
  const text = value ?? "-";
  return `<button class="table-text-cell table-text-cell-button" type="button" data-content-modal-open="${modalId}" aria-label="View full ${h(title).toLowerCase()}"><span class="table-text-ellipsis" title="${h(text)}">${h(text)}</span></button>
  <dialog class="content-modal" data-content-modal="${modalId}"><div class="modal content-modal-inner"><div class="content-modal-head"><h3 class="card-title">${h(title)}</h3><button type="button" class="btn btn-secondary" data-content-modal-close>Close</button></div><pre class="table-text-full">${h(text)}</pre></div></dialog>`;
}

function yesNo(v) {
  return v ? '<span class="badge badge-success">Yes</span>' : '<span class="badge badge-warn">No</span>';
}

function tableRowsOrEmpty(rows, colSpan, label) {
  return rows || `<tr><td colspan="${colSpan}" class="table-empty">${h(label)}</td></tr>`;
}

function subjectNodeBackHref(subjectId, node) {
  if (!node?.parent_subject_node_id) return `/subjects/${subjectId}`;
  return `/subjects/${subjectId}/nodes/${node.parent_subject_node_id}`;
}

function imageUploadCell({ id, formId, disabled = false }) {
  return `<div class="file-indicator-cell">
    <span class="file-indicator-icon" aria-hidden="true">🖼️</span>
    <input id="${h(id)}" class="input file-indicator-input js-file-indicator-input" type="file" name="image" ${formId ? `form="${h(formId)}"` : ""} accept="image/*" ${disabled ? "disabled" : ""} data-file-indicator-target="${h(id)}-status" />
    <small class="muted file-indicator-status" id="${h(id)}-status" aria-live="polite">No image selected</small>
  </div>`;
}

function imageSlotCell({ id, formId, imageKey, disabled = false }) {
  const imageUrl = imageUrlFromKey(imageKey);
  const hasImage = Boolean(imageUrl);
  const defaultIcon = '<span class="image-slot-icon" aria-hidden="true"><svg viewBox="0 0 20 20" focusable="false"><rect x="2.25" y="3.25" width="15.5" height="13.5" rx="2" /><circle cx="7" cy="8" r="1.6" /><path d="M4.75 14l3.6-3.9 2.35 2.45 2.35-2.95 2.2 4.4" /></svg></span>';
  return `<div class="image-slot" data-image-slot data-image-slot-has-image="${hasImage ? "1" : "0"}" data-image-slot-src="${h(imageUrl || "")}">
    <button class="image-slot-trigger" type="button" data-image-slot-trigger ${disabled ? "disabled" : ""} aria-label="Manage image" data-content-modal-open="${h(id)}-actions">
      ${imageUrl ? `<img src="${h(imageUrl)}" alt="Uploaded image" loading="lazy" decoding="async" />` : defaultIcon}
    </button>
    <input class="image-slot-input" type="file" name="image" ${formId ? `form="${h(formId)}"` : ""} accept="image/*" ${disabled ? "disabled" : ""} data-image-slot-input />
    <input type="hidden" name="removeImage" value="0" ${formId ? `form="${h(formId)}"` : ""} data-image-slot-remove />
    <dialog class="content-modal" data-content-modal="${h(id)}-actions">
      <div class="modal content-modal-inner image-slot-actions-modal">
        <div class="content-modal-head">
          <h3 class="card-title">Manage image</h3>
          <button type="button" class="btn btn-secondary" data-content-modal-close>Close</button>
        </div>
        <div class="image-slot-actions">
          <button class="btn btn-secondary" type="button" data-image-slot-see data-content-modal-open="${h(id)}-preview" ${hasImage ? "" : "hidden"}>See image</button>
          <button class="btn btn-primary" type="button" data-image-slot-upload>${hasImage ? "Change image" : "Upload image"}</button>
          <button class="btn btn-danger" type="button" data-image-slot-remove-action ${hasImage ? "" : "hidden"}>Remove image</button>
        </div>
      </div>
    </dialog>
    <dialog class="content-modal" data-content-modal="${h(id)}-preview">
      <div class="modal content-modal-inner">
        <div class="content-modal-head"><h3 class="card-title">Image preview</h3><button type="button" class="btn btn-secondary" data-content-modal-close>Close</button></div>
        <img class="image-slot-preview-large" src="${h(imageUrl || "")}" alt="Uploaded image preview" loading="lazy" decoding="async" ${hasImage ? "" : "hidden"} />
      </div>
    </dialog>
  </div>`;
}

function structuredAddPanel({ title, description, formAction, hiddenFields, submitLabel, fields }) {
  return `<section class="card flat-card entry-shell">
    <div class="entry-shell-head">
      <h3 class="card-title">${h(title)}</h3>
      ${description ? `<p class="muted">${h(description)}</p>` : ""}
    </div>
    <form method="post" action="${h(formAction)}" enctype="multipart/form-data" class="entry-form-grid">
      ${hiddenFields}
      ${fields}
      <button class="btn btn-primary" type="submit">${h(submitLabel)}</button>
    </form>
  </section>`;
}

export function templatesPage(user, templates) {
  const rows = templates
    .map(
      (t) => `<tr>
      <td class="table-action-open-cell"><a href="/templates/${t.id}" class="btn btn-secondary">Open</a></td>
      <td>${fullTextCell(t.name, `template-name-${t.id}`, "Template name")}</td>
      <td>${fullTextCell(t.code, `template-code-${t.id}`, "Template code")}</td>
      <td>${fullTextCell(t.description || "-", `template-desc-${t.id}`, "Template description")}</td>
      <td>${new Date(t.created_at).toLocaleDateString()}</td>
    </tr>`,
    )
    .join("");

  const content = `<section class="card">
    <div class="table-wrap"><table class="table flat-grid-table table-excel">
      <thead><tr><th>Open</th><th>Template</th><th>Code</th><th>Description</th><th>Created</th></tr></thead>
      <tbody>${tableRowsOrEmpty(rows, 5, "No templates yet.")}</tbody>
    </table></div>
  </section>`;

  return appShell("templates", user, "Subject Templates", "View available subject structures.", content, { pageStyles: modulesStyles });
}

export function templateDetailsPage(user, template, nodes) {
  const byParent = new Map();
  for (const node of nodes) {
    const key = node.parent_id || "root";
    if (!byParent.has(key)) byParent.set(key, []);
    byParent.get(key).push(node);
  }

  function walk(parentId, parentChain = []) {
    const list = byParent.get(parentId || "root") || [];
    return list
      .map((node, index) => {
        const isLast = index === list.length - 1;
        const branch = [...parentChain, isLast ? "end" : "mid"];
        const hierarchy = `<div class="template-tree-row">
            <span class="template-tree-guides" aria-hidden="true">${branch
              .slice(0, -1)
              .map((segment) => `<span class="template-guide ${segment === "end" ? "blank" : ""}"></span>`)
              .join("")}<span class="template-guide template-branch ${isLast ? "end" : "mid"}"></span></span>
            <span class="template-tree-label">${h(node.server_name)}</span>
          </div>`;
        return `<tr>
          <td>${hierarchy}</td>
          <td>${h(node.node_type)}</td>
          <td>${yesNo(node.supports_edit)}</td>
          <td>${yesNo(node.supports_image)}</td>
          <td>${yesNo(node.supports_chapters)}</td>
        </tr>${walk(node.id, branch)}`;
      })
      .join("");
  }

  const content = `${floatingBackButton("/templates", "Back to templates")}
  <section class="card">
    <p class="muted">Template code: <strong>${h(template.code)}</strong></p>
    <div class="table-wrap"><table class="table flat-grid-table table-excel">
      <thead><tr><th>Hierarchy</th><th>Type</th><th>Editable Name</th><th>Image Upload</th><th>Chapter Based</th></tr></thead>
      <tbody>${tableRowsOrEmpty(walk(null), 5, "No hierarchy nodes found.")}</tbody>
    </table></div>
  </section>`;

  return appShell("templates", user, `Template: ${template.name}`, "Hierarchy and capability matrix.", content, {
    pageStyles: modulesStyles,
  });
}

function classSelectOptions(classes) {
  return classes.map((item) => `<option value="${item.id}">${h(item.name)}</option>`).join("");
}

export function classesPage(user, classes) {
  const rows = classes
    .map(
      (item, index) => `<tr data-class-row data-class-id="${item.id}">
      <td>${fullTextCell(item.name, `class-name-${item.id}`, "Class name")}</td>
      <td class="table-action-open-cell"><a href="/classes/manage/${item.id}" class="btn btn-secondary">Subjects</a></td>
      <td>${h(item.sort_order)}</td>
      <td><form id="class-update-${item.id}" method="post" action="/api/classes/${item.id}" enctype="multipart/form-data" data-auto-save="true"><input type="hidden" name="intent" value="update" /><input class="input" name="name" value="${h(item.name)}" required maxlength="120" /></form></td>
      <td><button class="btn btn-secondary" type="button" data-class-move="up" data-class-id="${item.id}" ${index === 0 ? "disabled" : ""}>↑</button></td>
      <td><button class="btn btn-secondary" type="button" data-class-move="down" data-class-id="${item.id}" ${index === classes.length - 1 ? "disabled" : ""}>↓</button></td>
      <td><label><input type="checkbox" name="showOnHome" value="1" form="class-update-${item.id}" ${item.show_on_home ? "checked" : ""} /> Show</label></td>
      <td>${imageSlotCell({ id: `class-image-${item.id}`, formId: `class-update-${item.id}`, imageKey: item.image_key })}</td>
      <td><small class="muted" data-auto-save-status form="class-update-${item.id}">Synced</small></td>
      <td>
        <button class="btn btn-danger" type="button" data-content-modal-open="class-delete-${item.id}">Delete</button>
        <dialog class="content-modal" data-content-modal="class-delete-${item.id}">
          <div class="modal content-modal-inner">
            <div class="content-modal-head">
              <h3 class="card-title">Delete class</h3>
              <button type="button" class="btn btn-secondary" data-content-modal-close>Close</button>
            </div>
            <p>Are you sure you want to delete <strong>${h(item.name)}</strong>?</p>
            <form method="post" action="/api/classes/${item.id}" class="toolbar-group" enctype="multipart/form-data">
              <input type="hidden" name="intent" value="delete" />
              <button class="btn btn-danger" type="submit">Confirm delete</button>
            </form>
          </div>
        </dialog>
      </td>
    </tr>`,
    )
    .join("");

  const content = `<section class="card flat-card">
    <div class="toolbar-group">
      <button class="btn btn-primary" type="button" data-content-modal-open="class-add-modal">Add Class</button>
    </div>
    <dialog class="content-modal" data-content-modal="class-add-modal">
      <div class="modal content-modal-inner">
        <div class="content-modal-head">
          <h3 class="card-title">Add class</h3>
          <button type="button" class="btn btn-secondary" data-content-modal-close>Close</button>
        </div>
        <form method="post" action="/api/classes" class="grid grid-4" enctype="multipart/form-data">
          <label><input type="checkbox" name="showOnHome" value="1" checked /> Show on homepage</label>
          <input class="input" name="name" placeholder="Class name" required />
          ${imageUploadCell({ id: "class-create-upload" })}
          <button class="btn btn-primary" type="submit">Create</button>
        </form>
      </div>
    </dialog>
  </section>
  <section class="card flat-card">
    <div class="table-wrap"><table class="table flat-grid-table table-excel">
      <thead><tr><th>Class</th><th>Subjects</th><th>Order</th><th>Rename</th><th>Up</th><th>Down</th><th>Homepage</th><th>Image</th><th>Sync</th><th>Delete</th></tr></thead>
      <tbody>${tableRowsOrEmpty(rows, 10, "No classes yet.")}</tbody>
    </table></div>
  </section>`;

  return appShell("classes", user, "Classes", "Manage class list and class card thumbnails.", content, { pageStyles: modulesStyles });
}

export function subjectsPage(user, subjects, templates, classes) {
  const rows = subjects
    .map(
      (s) => `<tr>
      <td class="table-action-open-cell"><a href="/subjects/${s.id}" class="btn btn-secondary">Open</a></td>
      <td>${fullTextCell(s.name, `subject-name-${s.id}`, "Subject name")}</td>
      <td>${h(s.class_name || `Class ${s.class_level || "-"}`)}</td>
      <td>${fullTextCell(s.template_name, `subject-template-${s.id}`, "Template name")}</td>
      <td>${new Date(s.created_at).toLocaleDateString()}</td>
      <td><form id="subject-update-${s.id}" method="post" action="/api/subjects/${s.id}" enctype="multipart/form-data" data-auto-save="true"><input type="hidden" name="intent" value="update" /><input class="input" name="name" value="${h(s.name)}" required maxlength="120" /></form></td>
      <td>${imageSlotCell({ id: `subject-image-${s.id}`, formId: `subject-update-${s.id}`, imageKey: s.image_key })}</td>
      <td><small class="muted" data-auto-save-status form="subject-update-${s.id}">Synced</small></td>
      <td>
        <button class="btn btn-danger" type="button" data-content-modal-open="subject-delete-${s.id}">Delete</button>
        <dialog class="content-modal" data-content-modal="subject-delete-${s.id}">
          <div class="modal content-modal-inner">
            <div class="content-modal-head">
              <h3 class="card-title">Delete subject</h3>
              <button type="button" class="btn btn-secondary" data-content-modal-close>Close</button>
            </div>
            <p>Are you sure you want to delete <strong>${h(s.name)}</strong>? This action cannot be undone.</p>
            <form method="post" action="/api/subjects/${s.id}" class="toolbar-group" enctype="multipart/form-data">
              <input type="hidden" name="intent" value="delete" />
              <button class="btn btn-danger" type="submit">Confirm delete</button>
            </form>
          </div>
        </dialog>
      </td>
    </tr>`,
    )
    .join("");

  const templateOptions = templates.map((t) => `<option value="${t.id}">${h(t.name)}</option>`).join("");

  const content = `<section class="card flat-card">
    <div class="toolbar-group">
      <button class="btn btn-primary" type="button" data-content-modal-open="subject-add-modal">Add Subject</button>
    </div>
    <dialog class="content-modal" data-content-modal="subject-add-modal">
      <div class="modal content-modal-inner">
        <div class="content-modal-head">
          <h3 class="card-title">Add subject</h3>
          <button type="button" class="btn btn-secondary" data-content-modal-close>Close</button>
        </div>
        <form method="post" action="/api/subjects" class="grid grid-4" enctype="multipart/form-data">
          <input class="input" name="name" placeholder="Subject name" required />
          <select class="select" name="classId" required>${classSelectOptions(classes)}</select>
          <select class="select" name="templateId" required>${templateOptions}</select>
          <input class="input" type="file" name="image" accept="image/*" />
          <button class="btn btn-primary" type="submit">Create</button>
        </form>
      </div>
    </dialog>
  </section>
  <section class="card flat-card">
    <div class="table-wrap"><table class="table flat-grid-table table-excel">
      <thead><tr><th>Open</th><th>Subject</th><th>Class</th><th>Template</th><th>Created</th><th>Rename</th><th>Image</th><th>Sync</th><th>Delete</th></tr></thead>
      <tbody>${tableRowsOrEmpty(rows, 9, "No subjects yet.")}</tbody>
    </table></div>
  </section>`;

  return appShell("subjects", user, "Subjects", "Create subjects from templates and manage their content.", content, {
    pageStyles: modulesStyles,
  });
}

export function subjectNodeListPage(user, subject, title, subtitle, nodes, backHref) {
  const rows = nodes
    .map(
      (n) => `<tr>
      <td class="table-action-open-cell"><a href="/subjects/${subject.id}/nodes/${n.id}" class="btn btn-secondary">Open</a></td>
      <td class="subject-node-name-cell">${fullTextCell(`${n.display_name} (Server key: ${n.server_name})`, `subject-node-${n.id}`, "Subject node")}</td>
      <td>${yesNo(n.supports_edit)}</td>
      <td>${yesNo(n.supports_image)}</td>
      <td><form id="subject-node-update-${n.id}" method="post" action="/api/subject-nodes/${n.id}" enctype="multipart/form-data" data-auto-save="true"><input type="hidden" name="redirect" value="${h(backHref)}" /><input class="input" name="displayName" value="${h(n.display_name)}" ${n.supports_edit ? "" : "disabled"} maxlength="120" /></form></td>
      <td>${imageSlotCell({ id: `subject-node-image-${n.id}`, formId: `subject-node-update-${n.id}`, imageKey: n.image_key, disabled: !n.supports_image })}</td>
      <td><small class="muted" data-auto-save-status form="subject-node-update-${n.id}">Synced</small></td>
    </tr>`,
    )
    .join("");

  const content = `${floatingBackButton(backHref, "Back to previous page")}
  <section class="card"><div class="table-wrap"><table class="table flat-grid-table table-excel">
    <thead><tr><th>Open</th><th>Name</th><th>Edit</th><th>Image</th><th>Rename</th><th>Image Upload</th><th>Sync</th></tr></thead>
    <tbody>${tableRowsOrEmpty(rows, 7, "No nodes found.")}</tbody>
  </table></div></section>`;

  return appShell("subjects", user, title, subtitle, content, { pageStyles: modulesStyles });
}

export function chaptersPage(user, subject, node, chapters) {
  const rows = chapters
    .map(
      (c) => `<tr>
      <td><a href="/subjects/${subject.id}/nodes/${node.id}/chapters/${c.id}">${c.sort_order}. ${h(c.name)}</a></td>
      <td>${yesNo(c.has_topics)}</td>
      <td><form id="chapter-update-${c.id}" method="post" action="/api/chapters/${c.id}" enctype="multipart/form-data" data-auto-save="true"><input type="hidden" name="subjectId" value="${subject.id}" /><input type="hidden" name="nodeId" value="${node.id}" /><input type="hidden" name="intent" value="update" /><input class="input" name="name" value="${h(c.name)}" required /></form></td>
      <td><label><input type="checkbox" name="hasTopics" value="1" form="chapter-update-${c.id}" ${c.has_topics ? "checked" : ""} /> Enable topics</label></td>
      <td>${imageSlotCell({ id: `chapter-image-${c.id}`, formId: `chapter-update-${c.id}`, imageKey: c.image_key })}</td>
      <td><small class="muted" data-auto-save-status form="chapter-update-${c.id}">Synced</small></td>
      <td><button class="btn btn-danger" form="chapter-update-${c.id}" name="intent" value="delete" type="submit">Delete</button></td>
    </tr>`,
    )
    .join("");

  const addChapterPanel = structuredAddPanel({
    title: "Add chapter",
    description: "",
    formAction: "/api/chapters",
    hiddenFields: `<input type="hidden" name="subjectNodeId" value="${node.id}" />
      <input type="hidden" name="subjectId" value="${subject.id}" />
      <input type="hidden" name="removeImage" value="0" data-inline-image-remove />`,
    submitLabel: "Add chapter",
    fields: `<div>
        <label class="field-label" for="chapter-name">Chapter name</label>
        <input id="chapter-name" class="input" name="name" placeholder="Example: Algebra Basics" required maxlength="140" />
      </div>
      <div class="inline-image-picker chapter-image-picker" data-inline-image-picker data-inline-image-src="" data-inline-image-has="0">
        <label class="chapter-image-upload-btn" for="chapter-image">+ Add thumbnail</label>
        <input id="chapter-image" class="input inline-image-input" type="file" name="image" accept="image/*" data-inline-image-input />
        <div class="inline-image-preview chapter-image-preview" data-inline-image-preview hidden>
          <img src="" alt="Chapter thumbnail preview" loading="lazy" decoding="async" data-inline-image-preview-img />
          <button class="btn btn-icon btn-icon-danger inline-image-remove-btn" type="button" data-inline-image-remove-btn aria-label="Remove thumbnail" title="Remove thumbnail">✕</button>
        </div>
      </div>
      <label class="inline-check"><input type="checkbox" name="hasTopics" value="1" /> Enable topics</label>`,
  });

  const content = `${floatingBackButton(subjectNodeBackHref(subject.id, node), "Back to previous page")}
  ${addChapterPanel}
  <section class="card flat-card"><div class="table-wrap"><table class="table flat-grid-table table-excel">
    <thead><tr><th>Chapter</th><th>Topics Enabled</th><th>Rename</th><th>Topics Toggle</th><th>Image</th><th>Sync</th><th>Delete</th></tr></thead>
    <tbody>${tableRowsOrEmpty(rows, 7, "No chapters yet.")}</tbody>
  </table></div></section>`;

  return appShell("subjects", user, `${subject.name} · ${node.display_name}`, "Manage chapters.", content, { pageStyles: modulesStyles });
}

export function topicsPage(user, subject, node, chapter, topics) {
  const rows = topics
    .map(
      (t) => `<tr>
      <td><a href="/subjects/${subject.id}/nodes/${node.id}/chapters/${chapter.id}/topics/${t.id}">${t.sort_order}. ${h(t.name)}</a></td>
      <td><form id="topic-update-${t.id}" method="post" action="/api/topics/${t.id}" enctype="multipart/form-data" data-auto-save="true"><input type="hidden" name="subjectId" value="${subject.id}" /><input type="hidden" name="nodeId" value="${node.id}" /><input type="hidden" name="chapterId" value="${chapter.id}" /><input type="hidden" name="intent" value="update" /><input class="input" name="name" value="${h(t.name)}" required /></form></td>
      <td>${imageSlotCell({ id: `topic-image-${t.id}`, formId: `topic-update-${t.id}`, imageKey: t.image_key })}</td>
      <td><small class="muted" data-auto-save-status form="topic-update-${t.id}">Synced</small></td>
      <td><button class="btn btn-danger" form="topic-update-${t.id}" name="intent" value="delete" type="submit">Delete</button></td>
    </tr>`,
    )
    .join("");

  const addTopicPanel = structuredAddPanel({
    title: `Add topic in ${chapter.name}`,
    description: "Topics help split long chapters into focused lesson blocks.",
    formAction: "/api/topics",
    hiddenFields: `<input type="hidden" name="chapterId" value="${chapter.id}" />
      <input type="hidden" name="subjectId" value="${subject.id}" />
      <input type="hidden" name="nodeId" value="${node.id}" />`,
    submitLabel: "Add topic",
    fields: `<div>
        <label class="field-label" for="topic-name">Topic name</label>
        <input id="topic-name" class="input" name="name" placeholder="Example: Solving Linear Equations" required maxlength="140" />
      </div>
      <div>
        <label class="field-label" for="topic-image">Thumbnail (optional)</label>
        <input id="topic-image" class="input" type="file" name="image" accept="image/*" />
      </div>`,
  });

  const content = `${floatingBackButton(`/subjects/${subject.id}/nodes/${node.id}`, "Back to previous page")}
  <section class="card flat-card section-summary-row">
    <p><strong>${topics.length}</strong> topics in this chapter.</p>
    <p class="muted">Use short titles so learners can navigate quickly on mobile.</p>
  </section>
  ${addTopicPanel}
  <section class="card flat-card"><div class="table-wrap"><table class="table flat-grid-table table-excel">
    <thead><tr><th>Topic</th><th>Rename</th><th>Image</th><th>Sync</th><th>Delete</th></tr></thead>
    <tbody>${tableRowsOrEmpty(rows, 5, "No topics yet.")}</tbody>
  </table></div></section>`;

  return appShell("subjects", user, `${subject.name} · ${chapter.name}`, "Manage topics for this chapter.", content, {
    pageStyles: modulesStyles,
  });
}

export function contentKindsPage(user, subject, node, chapter, topic, childNodes = []) {
  const disabledKinds = new Set(["CQ Bank", "Videos"]);
  const detectedKinds = childNodes.filter((n) => n.node_type === "content").map((n) => n.content_kind || n.display_name);
  const fallbackKinds = node.content_kind ? [node.content_kind] : ["CQ Bank", "MCQ Bank", "Short Notes", "Videos", "Summary"];
  const kinds = Array.from(new Set([...fallbackKinds, ...detectedKinds].filter(Boolean)));
  const nodeIdByKind = new Map(childNodes.filter((n) => n.node_type === "content").map((n) => [n.content_kind || n.display_name, n.id]));

  const hrefForKind = (kind) => {
    const targetNodeId = nodeIdByKind.get(kind) || node.id;
    if (kind === "Short Notes") return `/subjects/${subject.id}/notes?node=${targetNodeId}&chapter=${chapter?.id || ""}&topic=${topic?.id || ""}`;
    if (kind === "MCQ Bank") return `/subjects/${subject.id}/mcqs?node=${targetNodeId}&chapter=${chapter?.id || ""}&topic=${topic?.id || ""}`;
    if (disabledKinds.has(kind)) return "";
    return `/subjects/${subject.id}/content?node=${targetNodeId}&chapter=${chapter?.id || ""}&topic=${topic?.id || ""}&kind=${encodeURIComponent(kind)}`;
  };

  const rows = kinds
    .map((kind) => {
      const href = hrefForKind(kind);
      return `<tr><td class="table-action-open-cell">${href ? `<a class="btn btn-secondary" href="${href}">Open</a>` : '<span class="muted">—</span>'}</td><td class="content-kind-col">${h(kind)}</td></tr>`;
    })
    .join("");
  const backHref = topic ? `/subjects/${subject.id}/nodes/${node.id}/chapters/${chapter.id}` : node.supports_chapters ? `/subjects/${subject.id}/nodes/${node.id}` : subjectNodeBackHref(subject.id, node);
  const content = `${floatingBackButton(backHref, "Back to previous page")}
  <section class="card flat-card"><div class="table-wrap"><table class="table flat-grid-table table-excel content-kinds-table"><thead><tr><th class="table-action-open-cell">Open</th><th class="content-kind-col">Content Type</th></tr></thead><tbody>${tableRowsOrEmpty(rows, 2, "No content types found.")}</tbody></table></div></section>`;
  return appShell("subjects", user, `${subject.name} · ${topic ? topic.name : chapter ? chapter.name : node.display_name}`, "Choose any content type defined in your template.", content, { pageStyles: modulesStyles });
}

function richTextEditor(fieldName, value, placeholder, required = false) {
  return `<textarea class="input plain-textarea" name="${fieldName}" placeholder="${h(placeholder)}" ${required ? "required" : ""}>${h(value || "")}</textarea>`;
}

function floatingBackButton(backHref, label = "Back") {
  return `<a class="floating-back-btn" href="${backHref}" aria-label="${h(label)}" title="${h(label)}"><span aria-hidden="true">←</span></a>`;
}

function parentAwareNodeId(node) {
  return node?.node_type === "content" && node?.parent_subject_node_id ? node.parent_subject_node_id : node?.id;
}

function noteForm(subjectId, subjectNodeId, chapterId, topicId, note) {
  return `<form method="post" action="/api/notes" enctype="multipart/form-data" class="notes-form" data-note-form>
    <input type="hidden" name="liveRegion" value="notes-page" />
    <input type="hidden" name="subjectId" value="${subjectId}" />
    <input type="hidden" name="subjectNodeId" value="${subjectNodeId}" />
    <input type="hidden" name="chapterId" value="${chapterId || ""}" />
    <input type="hidden" name="topicId" value="${topicId || ""}" />
    <input type="hidden" name="page" value="${note?.page || 1}" />
    <input type="hidden" name="id" value="${note?.id || ""}" />
    <div class="note-form-editor">${richTextEditor("contentHtml", note?.content_html || "", "Write one short line note…", true)}</div>
    <div class="toolbar-group">
      <button class="btn btn-primary" type="submit" data-live-form="true">${note ? "Update note" : "Add note"}</button>
    </div>
  </form>`;
}

function noteDeleteForm(subjectId, subjectNodeId, chapterId, topicId, noteId, page = 1) {
  return `<form method="post" action="/api/notes/delete">
    <input type="hidden" name="liveRegion" value="notes-page" />
    <input type="hidden" name="id" value="${noteId}" />
    <input type="hidden" name="subjectId" value="${subjectId}" />
    <input type="hidden" name="subjectNodeId" value="${subjectNodeId}" />
    <input type="hidden" name="chapterId" value="${chapterId || ""}" />
    <input type="hidden" name="topicId" value="${topicId || ""}" />
    <input type="hidden" name="page" value="${page}" />
    <button class="btn btn-icon btn-icon-danger" type="submit" data-live-form="true" aria-label="Delete note" title="Delete note">🗑</button>
  </form>`;
}

function getPagedItems(items, currentPage, perPage) {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const safePage = Math.min(Math.max(currentPage, 1), totalPages);
  const start = (safePage - 1) * perPage;
  return {
    totalPages,
    safePage,
    pageItems: items.slice(start, start + perPage),
  };
}

function renderPagination(baseHref, page, totalPages) {
  if (totalPages <= 1) return "";
  const pageLinks = Array.from({ length: totalPages }, (_, i) => i + 1)
    .map((value) => (value === page ? `<span class="page-link current" aria-current="page">${value}</span>` : `<a class="page-link" href="${baseHref}&page=${value}">${value}</a>`))
    .join("");
  return `<nav class="pagination" aria-label="Pagination">
    <a class="page-link" href="${baseHref}&page=${Math.max(1, page - 1)}">Prev</a>
    <div class="page-links">${pageLinks}</div>
    <a class="page-link" href="${baseHref}&page=${Math.min(totalPages, page + 1)}">Next</a>
  </nav>`;
}

export function notesPage(user, subject, node, chapter, topic, notes, currentPage = 1) {
  const baseHref = `/subjects/${subject.id}/notes?node=${node.id}&chapter=${chapter?.id || ""}&topic=${topic?.id || ""}`;
  const { totalPages, safePage, pageItems } = getPagedItems(notes, currentPage, 40);
  const leftColumn = pageItems.slice(0, 20);
  const rightColumn = pageItems.slice(20, 40);

  const renderNoteItems = (list, startIndex) =>
    list
      .map((n, index) => {
        const modalId = `note-edit-${n.id}`;
        const itemIndex = (safePage - 1) * 40 + startIndex + index + 1;
        return `<article class="plain-entry" id="note-${n.id}">
      <div class="plain-line-wrap">
        <div class="note-content"><span class="note-index">${itemIndex}.</span> <span>${h(n.content_html)}</span></div>
        <div class="note-actions-inline">
          <button type="button" class="btn btn-icon" data-content-modal-open="${modalId}" aria-label="Edit note" title="Edit note">✎</button>
          ${noteDeleteForm(subject.id, node.id, chapter?.id, topic?.id, n.id, safePage)}
        </div>
      </div>
      <dialog class="content-modal" data-content-modal="${modalId}">
        <div class="modal content-modal-inner">
          <div class="content-modal-head">
            <h3 class="card-title">Edit note</h3>
            <button type="button" class="btn btn-secondary" data-content-modal-close>Close</button>
          </div>
          ${noteForm(subject.id, node.id, chapter?.id, topic?.id, { ...n, page: safePage })}
        </div>
      </dialog>
      </article>`;
      })
      .join("");

  const rootNodeId = parentAwareNodeId(node);
  const backHref = topic ? `/subjects/${subject.id}/nodes/${rootNodeId}/chapters/${chapter.id}/topics/${topic.id}` : chapter ? `/subjects/${subject.id}/nodes/${rootNodeId}/chapters/${chapter.id}` : `/subjects/${subject.id}/nodes/${rootNodeId}`;

  const content = `${floatingBackButton(backHref, "Back to previous page")}
  <section class="card content-form-shell">
    <div class="content-form-head">
      <h3 class="card-title">Short notes</h3>
    </div>
    <div>
      ${noteForm(subject.id, node.id, chapter?.id, topic?.id, { page: safePage })}
    </div>
  </section>
  <section class="content-list plain-two-column" data-live-region="notes-page">
    <div>${renderNoteItems(leftColumn, 0) || ""}</div>
    <div>${renderNoteItems(rightColumn, 20) || ""}</div>
  </section>
  ${!pageItems.length ? '<p class="muted">No notes yet.</p>' : ""}
  ${renderPagination(baseHref, safePage, totalPages)}`;

  return appShell("subjects", user, `${subject.name} · Short Notes`, "Simple short-note slots with no text formatting.", content, {
    pageStyles: modulesStyles,
  });
}

function mcqForm(subjectId, subjectNodeId, chapterId, topicId, mcq) {
  const imageUrl = imageUrlFromKey(mcq?.image_key);
  const hasImage = Boolean(imageUrl);
  const submitLabel = mcq ? "Update MCQ" : "Add MCQ";
  return `<form method="post" action="/api/mcqs" enctype="multipart/form-data" class="grid grid-2">
    <input type="hidden" name="id" value="${mcq?.id || ""}" />
    <input type="hidden" name="subjectId" value="${subjectId}" />
    <input type="hidden" name="subjectNodeId" value="${subjectNodeId}" />
    <input type="hidden" name="chapterId" value="${chapterId || ""}" />
    <input type="hidden" name="topicId" value="${topicId || ""}" />
    <input type="hidden" name="page" value="${mcq?.page || 1}" />
    <input type="hidden" name="removeImage" value="0" data-inline-image-remove />
    ${richTextEditor("questionHtml", mcq?.question_html || "", "Write the MCQ question…", true)}
    <div class="inline-image-picker" data-inline-image-picker data-inline-image-src="${h(imageUrl || "")}" data-inline-image-has="${hasImage ? "1" : "0"}">
      <label class="btn btn-secondary inline-image-upload-btn" for="mcq-image-${h(mcq?.id || "new")}">${hasImage ? "Change image" : "Upload image"}</label>
      <input id="mcq-image-${h(mcq?.id || "new")}" class="input inline-image-input" type="file" name="image" accept="image/*" data-inline-image-input />
      <div class="inline-image-preview" data-inline-image-preview ${hasImage ? "" : "hidden"}>
        <img src="${h(imageUrl || "")}" alt="MCQ image preview" loading="lazy" decoding="async" data-inline-image-preview-img />
        <button class="btn btn-icon btn-icon-danger inline-image-remove-btn" type="button" data-inline-image-remove-btn aria-label="Remove image" title="Remove image">✕</button>
      </div>
    </div>
    <input class="input" name="optionA" placeholder="Option A" value="${h(mcq?.option_a || "")}" required />
    <input class="input" name="optionB" placeholder="Option B" value="${h(mcq?.option_b || "")}" required />
    <input class="input" name="optionC" placeholder="Option C" value="${h(mcq?.option_c || "")}" required />
    <input class="input" name="optionD" placeholder="Option D" value="${h(mcq?.option_d || "")}" required />
    <select class="select" name="correctOption" required>
      ${["A", "B", "C", "D"].map((v) => `<option value="${v}" ${mcq?.correct_option === v ? "selected" : ""}>Correct: ${v}</option>`).join("")}
    </select>
    <div><button class="btn btn-primary" type="submit">${submitLabel}</button></div>
  </form>`;
}

export function contentEntriesPage(user, subject, node, chapter, topic, contentKind, entries, currentPage = 1) {
  const baseHref = `/subjects/${subject.id}/content?node=${node.id}&chapter=${chapter?.id || ""}&topic=${topic?.id || ""}&kind=${encodeURIComponent(contentKind)}`;
  const { totalPages, safePage, pageItems } = getPagedItems(entries, currentPage, 20);
  const rootNodeId = parentAwareNodeId(node);
  const backHref = topic ? `/subjects/${subject.id}/nodes/${rootNodeId}/chapters/${chapter.id}/topics/${topic.id}` : chapter ? `/subjects/${subject.id}/nodes/${rootNodeId}/chapters/${chapter.id}` : `/subjects/${subject.id}/nodes/${rootNodeId}`;

  const isSummary = contentKind === "Summary";
  const entryForm = (entry) => `<form method="post" action="/api/content-entries" enctype="multipart/form-data" class="grid grid-2">
    <input type="hidden" name="id" value="${entry?.id || ""}" />
    <input type="hidden" name="subjectId" value="${subject.id}" />
    <input type="hidden" name="subjectNodeId" value="${node.id}" />
    <input type="hidden" name="chapterId" value="${chapter?.id || ""}" />
    <input type="hidden" name="topicId" value="${topic?.id || ""}" />
    <input type="hidden" name="contentKind" value="${h(contentKind)}" />
    <input type="hidden" name="page" value="${entry?.page || safePage}" />
    ${isSummary ? "" : `<input class="input" name="title" placeholder="Title" value="${h(entry?.title || "")}" maxlength="180" />`}
    ${isSummary ? "" : '<input class="input" type="file" name="image" accept="image/*" />'}
    ${richTextEditor("contentHtml", entry?.content_html || "", `Write ${h(contentKind)} content here…`, true)}
    <div>${entry && !isSummary ? '<label><input type="checkbox" name="removeImage" value="1" /> Remove image</label>' : ""}<button class="btn btn-primary" type="submit">${entry || isSummary ? "Update Entry" : "Add Entry"}</button></div>
  </form>`;

  const items = pageItems
    .map((entry, idx) => {
      const modalId = `content-entry-edit-${entry.id}`;
      const itemIndex = (safePage - 1) * 20 + idx + 1;
      return `<article class="plain-entry" id="content-entry-${entry.id}">
      <div class="plain-line-wrap">
        <div class="mcq-question"><strong>${itemIndex}.</strong> ${h(entry.title || (isSummary ? "Summary" : `${contentKind} entry`))}</div>
        <div class="mcq-actions-inline">
          <button type="button" class="btn btn-icon" data-content-modal-open="${modalId}" aria-label="Edit content" title="Edit content">✎</button>
          <form method="post" action="/api/content-entries/delete"><input type="hidden" name="id" value="${entry.id}" /><input type="hidden" name="subjectId" value="${subject.id}" /><input type="hidden" name="subjectNodeId" value="${node.id}" /><input type="hidden" name="chapterId" value="${chapter?.id || ""}" /><input type="hidden" name="topicId" value="${topic?.id || ""}" /><input type="hidden" name="kind" value="${h(contentKind)}" /><input type="hidden" name="page" value="${safePage}" /><button class="btn btn-icon btn-icon-danger" type="submit" aria-label="Delete content" title="Delete content">🗑</button></form>
        </div>
      </div>
      ${entry.image_key ? `<figure class="entry-media plain-media"><img src="${h(imageUrlFromKey(entry.image_key) || "")}" alt="${h(contentKind)} image ${itemIndex}" loading="lazy" decoding="async" /></figure>` : ""}
      <div>${entry.content_html}</div>
      <dialog class="content-modal" data-content-modal="${modalId}"><div class="modal content-modal-inner"><div class="content-modal-head"><h3 class="card-title">Edit ${h(contentKind)}</h3><button type="button" class="btn btn-secondary" data-content-modal-close>Close</button></div>${entryForm({ ...entry, page: safePage })}</div></dialog>
    </article>`;
    })
    .join("");

  const content = `${floatingBackButton(backHref, "Back to previous page")}
  <section class="card content-form-shell" data-add-form-shell><div class="content-form-head"><h3 class="card-title">${isSummary ? "Summary editor" : `Add ${h(contentKind)} item`}</h3><button type="button" class="btn btn-secondary" data-add-form-toggle data-add-form-label="${h(contentKind)}" aria-expanded="false">${isSummary ? "Edit Summary" : `Add ${h(contentKind)}`}</button></div><div data-add-form-panel>${entryForm(isSummary && entries[0] ? { ...entries[0], page: safePage } : { page: safePage })}</div></section>
  <section class="content-list">${items}</section>
  ${!pageItems.length ? '<p class="muted">No content yet.</p>' : ""}
  ${renderPagination(baseHref, safePage, totalPages)}`;

  return appShell("subjects", user, `${subject.name} · ${h(contentKind)}`, "Flexible content editor for any custom content type.", content, { pageStyles: modulesStyles });
}

export function mcqsPage(user, subject, node, chapter, topic, mcqs, currentPage = 1) {
  const baseHref = `/subjects/${subject.id}/mcqs?node=${node.id}&chapter=${chapter?.id || ""}&topic=${topic?.id || ""}`;
  const { totalPages, safePage, pageItems } = getPagedItems(mcqs, currentPage, 20);
  const leftColumn = pageItems.slice(0, 10);
  const rightColumn = pageItems.slice(10, 20);

  const renderMcqItems = (list, startIndex) =>
    list
      .map((m, index) => {
        const modalId = `mcq-edit-${m.id}`;
        const itemIndex = (safePage - 1) * 20 + startIndex + index + 1;
        return `<article class="plain-entry" id="mcq-${m.id}">
      <div class="plain-line-wrap">
        <div class="mcq-question">${itemIndex}. ${h(m.question_html)}</div>
        <div class="mcq-actions-inline">
          <button type="button" class="btn btn-icon" data-content-modal-open="${modalId}" aria-label="Edit MCQ" title="Edit MCQ">✎</button>
          <form method="post" action="/api/mcqs/delete"><input type="hidden" name="id" value="${m.id}" /><input type="hidden" name="subjectId" value="${subject.id}" /><input type="hidden" name="subjectNodeId" value="${node.id}" /><input type="hidden" name="chapterId" value="${chapter?.id || ""}" /><input type="hidden" name="topicId" value="${topic?.id || ""}" /><input type="hidden" name="page" value="${safePage}" /><button class="btn btn-icon btn-icon-danger" type="submit" aria-label="Delete MCQ" title="Delete MCQ">🗑</button></form>
        </div>
      </div>
      ${m.image_key ? `<figure class="entry-media plain-media"><img src="${h(imageUrlFromKey(m.image_key) || "")}" alt="MCQ image ${itemIndex}" loading="lazy" decoding="async" /></figure>` : ""}
      <div class="mcq-options-grid" role="list" aria-label="Options for MCQ ${index + 1}">
        <p class="mcq-option ${m.correct_option === "A" ? "mcq-option-correct" : ""}" role="listitem"><span class="mcq-option-label">A.</span><span>${h(m.option_a)}</span></p>
        <p class="mcq-option ${m.correct_option === "B" ? "mcq-option-correct" : ""}" role="listitem"><span class="mcq-option-label">B.</span><span>${h(m.option_b)}</span></p>
        <p class="mcq-option ${m.correct_option === "C" ? "mcq-option-correct" : ""}" role="listitem"><span class="mcq-option-label">C.</span><span>${h(m.option_c)}</span></p>
        <p class="mcq-option ${m.correct_option === "D" ? "mcq-option-correct" : ""}" role="listitem"><span class="mcq-option-label">D.</span><span>${h(m.option_d)}</span></p>
      </div>
      <dialog class="content-modal" data-content-modal="${modalId}">
        <div class="modal content-modal-inner">
          <div class="content-modal-head">
            <h3 class="card-title">Edit MCQ</h3>
            <button type="button" class="btn btn-secondary" data-content-modal-close>Close</button>
          </div>
          ${mcqForm(subject.id, node.id, chapter?.id, topic?.id, { ...m, page: safePage })}
        </div>
      </dialog>
      </article>`;
      })
      .join("");

  const rootNodeId = parentAwareNodeId(node);
  const backHref = topic ? `/subjects/${subject.id}/nodes/${rootNodeId}/chapters/${chapter.id}/topics/${topic.id}` : chapter ? `/subjects/${subject.id}/nodes/${rootNodeId}/chapters/${chapter.id}` : `/subjects/${subject.id}/nodes/${rootNodeId}`;

  const content = `${floatingBackButton(backHref, "Back to previous page")}
  <section class="card content-form-shell">
    <div class="content-form-head">
      <h3 class="card-title">MCQ slots</h3>
    </div>
    <div>
      ${mcqForm(subject.id, node.id, chapter?.id, topic?.id, { page: safePage })}
    </div>
  </section>
  <section class="content-list plain-two-column">
    <div>${renderMcqItems(leftColumn, 0) || ""}</div>
    <div>${renderMcqItems(rightColumn, 10) || ""}</div>
  </section>
  ${!pageItems.length ? '<p class="muted">No MCQs yet.</p>' : ""}
  ${renderPagination(baseHref, safePage, totalPages)}`;

  return appShell("subjects", user, `${subject.name} · MCQ Bank`, "Simple MCQ slots with zero text-formatting tools.", content, { pageStyles: modulesStyles });
}

export function classSubjectsPage(user, classItem, subjects) {
  const rows = subjects
    .map(
      (item) => `<tr>
      <td>${h(item.name)}</td>
      <td>${h(item.template_name)}</td>
      <td>${new Date(item.created_at).toLocaleDateString()}</td>
      <td class="table-action-open-cell"><a href="/subjects/${item.id}" class="btn btn-secondary">Manage</a></td>
    </tr>`,
    )
    .join("");

  const content = `${floatingBackButton("/classes/manage", "Back to classes")}
  <section class="card flat-card">
    <div class="table-wrap"><table class="table flat-grid-table table-excel">
      <thead><tr><th>Subject</th><th>Template</th><th>Created</th><th>Open</th></tr></thead>
      <tbody>${tableRowsOrEmpty(rows, 4, "No subjects assigned to this class yet.")}</tbody>
    </table></div>
  </section>`;

  return appShell("classes", user, `${classItem.name} Subjects`, "Open any subject to manage its template content.", content, {
    pageStyles: modulesStyles,
  });
}
