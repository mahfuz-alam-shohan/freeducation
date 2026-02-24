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

function dateLabel(value) {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleDateString();
  } catch {
    return "-";
  }
}

function pageIntro(title, subtitle, actions = "") {
  return `<section class="flow-head"><div><h1>${h(title)}</h1><p>${h(subtitle)}</p></div>${actions ? `<div class="flow-head-actions">${actions}</div>` : ""}</section>`;
}

function shell(key, user, title, subtitle, body) {
  return appShell(key, user, title, subtitle, body, { hidePageHead: true, pageStyles: modulesStyles });
}

function classSelectOptions(classes) {
  return classes.map((item) => `<option value="${item.id}">${h(item.name || `Class ${item.level}`)}</option>`).join("");
}

function cover(key) {
  const url = imageUrlFromKey(key);
  return url ? `<img src="${h(url)}" alt="" loading="lazy" decoding="async" />` : '<span class="cover-empty">No image</span>';
}

function flowBack(href, label = "Back") {
  return `<a class="flow-back" href="${h(href)}">← ${h(label)}</a>`;
}

export function templatesPage(user, templates) {
  const rows = templates
    .map(
      (item) => `<article class="flow-item">
      <div class="flow-item-main"><h3>${h(item.name)}</h3><p>${h(item.description || "No description")}</p></div>
      <div class="flow-item-meta"><span>${dateLabel(item.created_at)}</span><a class="btn btn-secondary" href="/templates/${item.id}">Open</a></div>
    </article>`,
    )
    .join("");

  return shell(
    "templates",
    user,
    "Templates",
    "Simple list for template structures.",
    `${pageIntro("Templates", "Open a template to manage structure.")}
    <section class="flow-list">${rows || '<p class="muted">No templates found.</p>'}</section>`,
  );
}

export function templateDetailsPage(user, template, nodes) {
  const items = nodes
    .map(
      (item) => `<article class="flow-item">
      <div class="flow-item-main">
        <h3>${h(item.display_name)}</h3>
        <p>Server key: ${h(item.server_name)}</p>
      </div>
      <div class="flow-item-meta">
        <span>${item.is_required ? "Required" : "Optional"}</span>
        <span>${item.allows_children ? "Folder" : "Leaf"}</span>
      </div>
    </article>`,
    )
    .join("");

  return shell(
    "templates",
    user,
    template.name,
    "Template structure",
    `${flowBack("/templates", "Back to templates")}${pageIntro(template.name, template.description || "Template structure")}
    <section class="flow-list">${items || '<p class="muted">No nodes in this template.</p>'}</section>`,
  );
}

export function classesPage(user, classes) {
  const cards = classes
    .map(
      (item) => `<article class="manage-card">
      <div class="manage-cover">${cover(item.image_key)}</div>
      <div class="manage-content">
        <p class="muted">Level ${h(item.level)}</p>
        <form method="post" action="/api/classes/${item.id}" enctype="multipart/form-data" class="stack-xs">
          <input type="hidden" name="intent" value="update" />
          <input class="input" name="name" value="${h(item.name)}" required maxlength="120" />
          <div class="inline-row">
            <input class="input" type="file" name="image" accept="image/*" />
            <label class="inline-check"><input type="checkbox" name="removeImage" value="1" /> Remove image</label>
          </div>
          <div class="inline-row">
            <button class="btn btn-primary" type="submit">Save</button>
          </div>
        </form>
      </div>
      <form method="post" action="/api/classes/${item.id}" enctype="multipart/form-data" onsubmit="return confirm('Delete class?')">
        <input type="hidden" name="intent" value="delete" />
        <button class="btn btn-danger" type="submit">Delete</button>
      </form>
    </article>`,
    )
    .join("");

  const addForm = `<form method="post" action="/api/classes" enctype="multipart/form-data" class="panel-form">
    <input class="input" name="name" placeholder="Class name" required />
    <input class="input" type="number" name="level" placeholder="Level" required min="1" max="12" />
    <input class="input" type="file" name="image" accept="image/*" />
    <button class="btn btn-primary" type="submit">Add class</button>
  </form>`;

  return shell("classes", user, "Classes", "Manage classes in a phone-first layout.", `${pageIntro("Classes", "Edit or delete quickly.")}${addForm}<section class="manage-grid">${cards || '<p class="muted">No classes yet.</p>'}</section>`);
}

export function subjectsPage(user, subjects, templates, classes) {
  const templateOptions = templates.map((t) => `<option value="${t.id}">${h(t.name)}</option>`).join("");
  const cards = subjects
    .map(
      (item) => `<article class="manage-card">
      <div class="manage-cover">${cover(item.image_key)}</div>
      <div class="manage-content">
        <h3>${h(item.name)}</h3>
        <p class="muted">${h(item.class_name || `Class ${item.class_level}`)} · ${h(item.template_name)}</p>
        <form method="post" action="/api/subjects/${item.id}" enctype="multipart/form-data" class="stack-xs">
          <input type="hidden" name="intent" value="update" />
          <input class="input" name="name" value="${h(item.name)}" required maxlength="120" />
          <div class="inline-row">
            <input class="input" type="file" name="image" accept="image/*" />
            <label class="inline-check"><input type="checkbox" name="removeImage" value="1" /> Remove image</label>
          </div>
          <div class="inline-row">
            <a class="btn btn-secondary" href="/subjects/${item.id}">Open</a>
            <button class="btn btn-primary" type="submit">Save</button>
          </div>
        </form>
      </div>
      <form method="post" action="/api/subjects/${item.id}" enctype="multipart/form-data" onsubmit="return confirm('Delete subject?')">
        <input type="hidden" name="intent" value="delete" />
        <button class="btn btn-danger" type="submit">Delete</button>
      </form>
    </article>`,
    )
    .join("");

  const addForm = `<form method="post" action="/api/subjects" enctype="multipart/form-data" class="panel-form">
    <input class="input" name="name" placeholder="Subject name" required />
    <select class="select" name="classId" required>${classSelectOptions(classes)}</select>
    <select class="select" name="templateId" required>${templateOptions}</select>
    <input class="input" type="file" name="image" accept="image/*" />
    <button class="btn btn-primary" type="submit">Add subject</button>
  </form>`;

  return shell("subjects", user, "Subjects", "Responsive and easier for small screens.", `${pageIntro("Subjects", "Create and manage subjects.")}${addForm}<section class="manage-grid">${cards || '<p class="muted">No subjects yet.</p>'}</section>`);
}

export function subjectNodeListPage(user, subject, title, subtitle, nodes, backHref) {
  const items = nodes
    .map(
      (item) => `<article class="flow-item">
      <div class="flow-item-main">
        <h3>${h(item.display_name)}</h3>
        <p>${h(item.server_name)}</p>
      </div>
      <form method="post" action="/api/subject-nodes/${item.id}" enctype="multipart/form-data" class="flow-inline-form">
        <input type="hidden" name="redirect" value="${h(backHref)}" />
        <input class="input" name="displayName" value="${h(item.display_name)}" ${item.supports_edit ? "" : "disabled"} maxlength="120" />
        <input class="input" type="file" name="image" accept="image/*" ${item.supports_image ? "" : "disabled"} />
        <label class="inline-check"><input type="checkbox" name="removeImage" value="1" ${item.supports_image ? "" : "disabled"} /> Remove image</label>
        <div class="inline-row"><a class="btn btn-secondary" href="/subjects/${subject.id}/nodes/${item.id}">Open</a><button class="btn btn-primary" type="submit">Save</button></div>
      </form>
    </article>`,
    )
    .join("");

  return shell("subjects", user, title, subtitle, `${flowBack(backHref, "Back")}${pageIntro(title, subtitle)}<section class="flow-list">${items || '<p class="muted">No nodes found.</p>'}</section>`);
}

export function chaptersPage(user, subject, node, chapters) {
  const list = chapters
    .map(
      (item) => `<article class="flow-item">
      <form method="post" action="/api/chapters/${item.id}" enctype="multipart/form-data" class="flow-inline-form">
        <input type="hidden" name="subjectId" value="${subject.id}" /><input type="hidden" name="subjectNodeId" value="${node.id}" />
        <input class="input" name="title" value="${h(item.title)}" required />
        <input class="input" type="number" name="position" value="${item.position}" min="1" />
        <input class="input" type="file" name="image" accept="image/*" />
        <label class="inline-check"><input type="checkbox" name="removeImage" value="1" /> Remove image</label>
        <div class="inline-row"><a class="btn btn-secondary" href="/subjects/${subject.id}/nodes/${node.id}/chapters/${item.id}/topics">Topics</a><button class="btn btn-primary" type="submit" name="intent" value="update">Save</button><button class="btn btn-danger" type="submit" name="intent" value="delete" onclick="return confirm('Delete chapter?')">Delete</button></div>
      </form>
    </article>`,
    )
    .join("");

  const create = `<form method="post" action="/api/chapters" enctype="multipart/form-data" class="panel-form">
    <input type="hidden" name="subjectId" value="${subject.id}" /><input type="hidden" name="subjectNodeId" value="${node.id}" />
    <input class="input" name="title" placeholder="Chapter title" required />
    <input class="input" type="number" name="position" placeholder="Position" min="1" />
    <input class="input" type="file" name="image" accept="image/*" />
    <button class="btn btn-primary" type="submit">Add chapter</button>
  </form>`;

  return shell("subjects", user, "Chapters", `${subject.name} · ${node.display_name}`, `${flowBack(`/subjects/${subject.id}/nodes/${node.parent_subject_node_id || ""}`.replace(/\/nodes\/$/, ""), "Back")}${pageIntro("Chapters", `${subject.name} · ${node.display_name}`)}${create}<section class="flow-list">${list || '<p class="muted">No chapters yet.</p>'}</section>`);
}

export function topicsPage(user, subject, node, chapter, topics) {
  const list = topics
    .map(
      (item) => `<article class="flow-item">
      <form method="post" action="/api/topics/${item.id}" enctype="multipart/form-data" class="flow-inline-form">
        <input type="hidden" name="subjectId" value="${subject.id}" /><input type="hidden" name="subjectNodeId" value="${node.id}" /><input type="hidden" name="chapterId" value="${chapter.id}" />
        <input class="input" name="title" value="${h(item.title)}" required />
        <input class="input" type="number" name="position" value="${item.position}" min="1" />
        <input class="input" type="file" name="image" accept="image/*" />
        <label class="inline-check"><input type="checkbox" name="removeImage" value="1" /> Remove image</label>
        <div class="inline-row"><a class="btn btn-secondary" href="/subjects/${subject.id}/nodes/${node.id}/chapters/${chapter.id}/topics/${item.id}/content">Content</a><button class="btn btn-primary" type="submit" name="intent" value="update">Save</button><button class="btn btn-danger" type="submit" name="intent" value="delete" onclick="return confirm('Delete topic?')">Delete</button></div>
      </form>
    </article>`,
    )
    .join("");

  const create = `<form method="post" action="/api/topics" enctype="multipart/form-data" class="panel-form">
    <input type="hidden" name="subjectId" value="${subject.id}" /><input type="hidden" name="subjectNodeId" value="${node.id}" /><input type="hidden" name="chapterId" value="${chapter.id}" />
    <input class="input" name="title" placeholder="Topic title" required />
    <input class="input" type="number" name="position" placeholder="Position" min="1" />
    <input class="input" type="file" name="image" accept="image/*" />
    <button class="btn btn-primary" type="submit">Add topic</button>
  </form>`;

  return shell("subjects", user, "Topics", chapter.title, `${flowBack(`/subjects/${subject.id}/nodes/${node.id}/chapters`, "Back to chapters")}${pageIntro("Topics", chapter.title)}${create}<section class="flow-list">${list || '<p class="muted">No topics yet.</p>'}</section>`);
}

function pageBaseFields(subject, node, chapter, topic, page = 1) {
  return `<input type="hidden" name="subjectId" value="${subject.id}" /><input type="hidden" name="subjectNodeId" value="${node.id}" /><input type="hidden" name="chapterId" value="${chapter?.id || ""}" /><input type="hidden" name="topicId" value="${topic?.id || ""}" /><input type="hidden" name="page" value="${page}" />`;
}

export function contentKindsPage(user, subject, node, chapter, topic, childNodes = [], tabState = null) {
  const tabs = childNodes
    .map((item) => `<a class="chip ${tabState?.selectedTab === item.display_name ? "is-active" : ""}" href="${tabState?.buildTabHref?.(item.display_name) || "#"}">${h(item.display_name)}</a>`)
    .join("");

  const parent = topic ? `/subjects/${subject.id}/nodes/${node.id}/chapters/${chapter.id}/topics` : `/subjects/${subject.id}/nodes/${node.id}/chapters`;

  return shell("subjects", user, "Content", "Choose a section", `${flowBack(parent, "Back")}${pageIntro("Content tabs", "Quick switch between content kinds.")}
  <section class="chip-row">${tabs || '<p class="muted">No content kinds available.</p>'}</section>`);
}

export function notesPage(user, subject, node, chapter, topic, notes, currentPage = 1) {
  const rows = notes
    .map(
      (item, idx) => `<article class="flow-item"><form method="post" action="/api/notes" enctype="multipart/form-data" class="panel-form">
      ${pageBaseFields(subject, node, chapter, topic, currentPage)}<input type="hidden" name="id" value="${item.id}" />
      <textarea class="textarea" name="content" required>${h(item.content)}</textarea>
      <div class="inline-row"><input class="input" type="file" name="image" accept="image/*" /><label class="inline-check"><input type="checkbox" name="removeImage" value="1" /> Remove image</label></div>
      <div class="inline-row"><button class="btn btn-primary" type="submit">Save #${idx + 1}</button></div>
      </form><form method="post" action="/api/notes/delete" onsubmit="return confirm('Delete note?')">${pageBaseFields(subject, node, chapter, topic, currentPage)}<input type="hidden" name="id" value="${item.id}" /><button class="btn btn-danger" type="submit">Delete</button></form></article>`,
    )
    .join("");

  const create = `<form method="post" action="/api/notes" enctype="multipart/form-data" class="panel-form">${pageBaseFields(subject, node, chapter, topic, currentPage)}<textarea class="textarea" name="content" placeholder="Write note" required></textarea><input class="input" type="file" name="image" accept="image/*" /><button class="btn btn-primary" type="submit">Add note</button></form>`;
  const back = topic ? `/subjects/${subject.id}/nodes/${node.id}/chapters/${chapter.id}/topics/${topic.id}/content?tab=Short+Notes` : `/subjects/${subject.id}/nodes/${node.id}/chapters/${chapter.id}/content?tab=Short+Notes`;
  return shell("subjects", user, "Short Notes", "Flat editor", `${flowBack(back, "Back to content")}${pageIntro("Short Notes", "Add and edit notes quickly.")}${create}<section class="flow-list">${rows || '<p class="muted">No notes yet.</p>'}</section>`);
}

export function contentEntriesPage(user, subject, node, chapter, topic, contentKind, entries, currentPage = 1) {
  const rows = entries
    .map(
      (item) => `<article class="flow-item"><form method="post" action="/api/content-entries" enctype="multipart/form-data" class="panel-form">${pageBaseFields(subject, node, chapter, topic, currentPage)}<input type="hidden" name="id" value="${item.id}" /><input type="hidden" name="kind" value="${h(contentKind)}" /><textarea class="textarea" name="content" required>${h(item.content)}</textarea><div class="inline-row"><input class="input" type="file" name="image" accept="image/*" /><label class="inline-check"><input type="checkbox" name="removeImage" value="1" /> Remove image</label></div><button class="btn btn-primary" type="submit">Save</button></form><form method="post" action="/api/content-entries/delete" onsubmit="return confirm('Delete entry?')">${pageBaseFields(subject, node, chapter, topic, currentPage)}<input type="hidden" name="id" value="${item.id}" /><input type="hidden" name="kind" value="${h(contentKind)}" /><button class="btn btn-danger" type="submit">Delete</button></form></article>`,
    )
    .join("");

  const create = `<form method="post" action="/api/content-entries" enctype="multipart/form-data" class="panel-form">${pageBaseFields(subject, node, chapter, topic, currentPage)}<input type="hidden" name="kind" value="${h(contentKind)}" /><textarea class="textarea" name="content" placeholder="Write ${h(contentKind)}" required></textarea><input class="input" type="file" name="image" accept="image/*" /><button class="btn btn-primary" type="submit">Add ${h(contentKind)}</button></form>`;
  const back = topic ? `/subjects/${subject.id}/nodes/${node.id}/chapters/${chapter.id}/topics/${topic.id}/content?tab=${encodeURIComponent(contentKind)}` : `/subjects/${subject.id}/nodes/${node.id}/chapters/${chapter.id}/content?tab=${encodeURIComponent(contentKind)}`;
  return shell("subjects", user, contentKind, "Content editor", `${flowBack(back, "Back to content")}${pageIntro(contentKind, "Simple writing-focused editor.")}${create}<section class="flow-list">${rows || '<p class="muted">No entries yet.</p>'}</section>`);
}

export function mcqsPage(user, subject, node, chapter, topic, mcqs, currentPage = 1) {
  const rows = mcqs
    .map(
      (item) => `<article class="flow-item"><form method="post" action="/api/mcqs" enctype="multipart/form-data" class="panel-form">${pageBaseFields(subject, node, chapter, topic, currentPage)}<input type="hidden" name="id" value="${item.id}" /><textarea class="textarea" name="question" required>${h(item.question)}</textarea><input class="input" name="optionA" value="${h(item.option_a)}" placeholder="Option A" required /><input class="input" name="optionB" value="${h(item.option_b)}" placeholder="Option B" required /><input class="input" name="optionC" value="${h(item.option_c)}" placeholder="Option C" required /><input class="input" name="optionD" value="${h(item.option_d)}" placeholder="Option D" required /><input class="input" name="correctOption" value="${h(item.correct_option)}" placeholder="Correct option (A/B/C/D)" required /><button class="btn btn-primary" type="submit">Save MCQ</button></form><form method="post" action="/api/mcqs/delete" onsubmit="return confirm('Delete MCQ?')">${pageBaseFields(subject, node, chapter, topic, currentPage)}<input type="hidden" name="id" value="${item.id}" /><button class="btn btn-danger" type="submit">Delete</button></form></article>`,
    )
    .join("");

  const create = `<form method="post" action="/api/mcqs" enctype="multipart/form-data" class="panel-form">${pageBaseFields(subject, node, chapter, topic, currentPage)}<textarea class="textarea" name="question" placeholder="Question" required></textarea><input class="input" name="optionA" placeholder="Option A" required /><input class="input" name="optionB" placeholder="Option B" required /><input class="input" name="optionC" placeholder="Option C" required /><input class="input" name="optionD" placeholder="Option D" required /><input class="input" name="correctOption" placeholder="Correct option (A/B/C/D)" required /><button class="btn btn-primary" type="submit">Add MCQ</button></form>`;
  const back = topic ? `/subjects/${subject.id}/nodes/${node.id}/chapters/${chapter.id}/topics/${topic.id}/content?tab=MCQ+Bank` : `/subjects/${subject.id}/nodes/${node.id}/chapters/${chapter.id}/content?tab=MCQ+Bank`;
  return shell("subjects", user, "MCQ Bank", "Simple MCQ editor", `${flowBack(back, "Back to content")}${pageIntro("MCQ Bank", "Compact editing flow.")}${create}<section class="flow-list">${rows || '<p class="muted">No MCQs yet.</p>'}</section>`);
}

export function classSubjectsPage(user, classItem, subjects) {
  const cards = subjects
    .map(
      (item) => `<article class="flow-item"><div class="flow-item-main"><h3>${h(item.name)}</h3><p>${h(item.template_name || "No template")}</p></div><div class="flow-item-meta"><a class="btn btn-secondary" href="/subjects/${item.id}">Open subject</a></div></article>`,
    )
    .join("");

  return shell("classes", user, classItem.name, "Subjects under selected class", `${flowBack("/classes/manage", "Back to classes")}${pageIntro(classItem.name, "Subjects")}
  <section class="flow-list">${cards || '<p class="muted">No subjects in this class yet.</p>'}</section>`);
}
