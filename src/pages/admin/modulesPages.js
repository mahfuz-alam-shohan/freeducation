import { appShell } from '../templates/shell.js';
import { imageUrlFromKey } from '../imageUrl.js';

function h(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function yesNo(v) {
  return v ? '<span class="badge badge-success">Yes</span>' : '<span class="badge badge-warn">No</span>';
}

function classOptions() {
  return Array.from({ length: 12 }, (_, i) => `<option value="${i + 1}">Class ${i + 1}</option>`).join('');
}

function imageCell(imageKey) {
  return imageKey ? `<code>${h(imageKey)}</code>` : '<span class="muted">No image</span>';
}

function tableRowsOrEmpty(rows, colSpan, label) {
  return rows || `<tr><td colspan="${colSpan}" class="table-empty">${h(label)}</td></tr>`;
}

function serializeBuilderNodes(nodes = []) {
  return JSON.stringify(
    nodes.map((node, index) => ({
      clientId: node.id || `node_${index + 1}`,
      parentClientId: node.parent_id || null,
      serverName: node.server_name,
      nodeKey: node.node_key,
      nodeType: node.node_type,
      contentKind: node.content_kind || '',
      supportsEdit: Boolean(node.supports_edit),
      supportsImage: Boolean(node.supports_image),
      supportsChapters: Boolean(node.supports_chapters),
      sortOrder: index + 1,
    }))
  );
}

function templateBuilderForm({ action, submitLabel, template = null, nodes = [] }) {
  const initialNodesJson = h(serializeBuilderNodes(nodes));
  return `<form method="post" action="${action}" class="template-builder" data-template-builder data-template-builder-initial="${initialNodesJson}">
    <div class="grid grid-3">
      <input class="input" name="name" placeholder="Template name" maxlength="120" value="${h(template?.name || '')}" required />
      <input class="input" name="code" placeholder="Template code (ex: SCIENCE-6)" maxlength="120" value="${h(template?.code || '')}" required />
      <input class="input" name="description" placeholder="Description (optional)" maxlength="180" value="${h(template?.description || '')}" />
    </div>
    <div class="toolbar-group section-gap-sm">
      <select class="select" data-template-builder-preset>
        <option value="">Load quick starter…</option>
        <option value="exam">Exam-heavy subject</option>
        <option value="concept">Concept + activities</option>
        <option value="language">Language + literature</option>
      </select>
      <button class="btn btn-secondary" type="button" data-template-builder-add>Add Node</button>
      <button class="btn btn-primary" type="submit">${submitLabel}</button>
    </div>
    <input type="hidden" name="nodesJson" data-template-builder-storage />
    <div class="table-wrap section-gap-sm"><table class="table">
      <thead><tr><th>Node Name</th><th>Node Key</th><th>Parent</th><th>Type</th><th>Content Kind</th><th>Options</th><th></th></tr></thead>
      <tbody data-template-builder-rows></tbody>
    </table></div>
    <div class="template-live-hierarchy">
      <div class="muted">Live hierarchy preview</div>
      <ol data-template-builder-tree class="template-live-tree"></ol>
    </div>
    <section class="template-content-studio section-gap-sm">
      <div class="muted">Content type studio (drag any type into a node)</div>
      <div class="toolbar-group section-gap-sm">
        <input class="input" data-template-content-input maxlength="80" placeholder="Create content/question type (ex: Assertion Reason)" />
        <button class="btn btn-secondary" type="button" data-template-content-add>Add Type</button>
      </div>
      <ul class="template-content-list" data-template-content-list></ul>
    </section>
    <p class="muted">Raw designer: fully manual, fully custom. Create any nested structure, define your own content types, and drag those types into any level.</p>
  </form>`;
}

export function templatesPage(user, templates) {
  const rows = templates
    .map(
      (t) => `<tr>
      <td><a href="/templates/${t.id}">${h(t.name)}</a></td>
      <td>${h(t.code)}</td>
      <td>${h(t.description || '-')}</td>
      <td>${new Date(t.created_at).toLocaleDateString()}</td>
      <td>
        <div class="toolbar-group">
          <a class="btn btn-secondary" href="/templates/${t.id}/edit">Edit</a>
          <form method="post" action="/api/templates/${t.id}" onsubmit="return confirm('Delete this template?');">
            <input type="hidden" name="intent" value="delete" />
            <button class="btn btn-danger" type="submit">Delete</button>
          </form>
        </div>
      </td>
    </tr>`
    )
    .join('');

  const content = `<section class="card">
    <div class="toolbar-group">
      <a class="btn btn-primary" href="/templates/designer">Open Template Designer</a>
    </div>
  </section>
  <section class="card">
    <div class="table-wrap"><table class="table">
      <thead><tr><th>Template</th><th>Code</th><th>Description</th><th>Created</th><th>Actions</th></tr></thead>
      <tbody>${tableRowsOrEmpty(rows, 5, 'No templates yet.')}</tbody>
    </table></div>
  </section>`;

  return appShell('templates', user, 'Subject Templates', 'Create, edit, and delete reusable structures for any subject.', content);
}

export function templateDesignerPage(user, template = null, nodes = []) {
  const editing = Boolean(template?.id);
  const title = editing ? `Edit Template: ${template.name}` : 'Template Designer';
  const subtitle = editing
    ? 'Update template details, hierarchy, and node capabilities.'
    : 'Design any subject template with a guided UI and live hierarchy preview.';
  const action = editing ? `/api/templates/${template.id}` : '/api/templates';
  const submitLabel = editing ? 'Save Template' : 'Create Template';

  const content = `<section class="card">
    <a class="back-link" href="/templates">← Back to templates</a>
    ${templateBuilderForm({ action, submitLabel, template, nodes })}
  </section>`;

  return appShell('templates', user, title, subtitle, content);
}

export function templateDetailsPage(user, template, nodes) {
  const byParent = new Map();
  for (const node of nodes) {
    const key = node.parent_id || 'root';
    if (!byParent.has(key)) byParent.set(key, []);
    byParent.get(key).push(node);
  }

  function walk(parentId, parentChain = []) {
    const list = byParent.get(parentId || 'root') || [];
    return list
      .map((node, index) => {
        const isLast = index === list.length - 1;
        const branch = [...parentChain, isLast ? 'end' : 'mid'];
        const hierarchy = `<div class="template-tree-row">
            <span class="template-tree-guides" aria-hidden="true">${branch
              .slice(0, -1)
              .map((segment) => `<span class="template-guide ${segment === 'end' ? 'blank' : ''}"></span>`)
              .join('')}<span class="template-guide template-branch ${isLast ? 'end' : 'mid'}"></span></span>
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
      .join('');
  }

  const content = `<section class="card">
    <div class="toolbar-group section-gap-sm">
      <a class="btn btn-secondary" href="/templates/${template.id}/edit">Edit Template</a>
      <form method="post" action="/api/templates/${template.id}" onsubmit="return confirm('Delete this template?');">
        <input type="hidden" name="intent" value="delete" />
        <button class="btn btn-danger" type="submit">Delete Template</button>
      </form>
    </div>
    <p class="muted">Template code: <strong>${h(template.code)}</strong></p>
    <div class="table-wrap"><table class="table">
      <thead><tr><th>Hierarchy</th><th>Type</th><th>Editable Name</th><th>Image Upload</th><th>Chapter Based</th></tr></thead>
      <tbody>${tableRowsOrEmpty(walk(null), 5, 'No hierarchy nodes found.')}</tbody>
    </table></div>
  </section>`;

  return appShell('templates', user, `Template: ${template.name}`, 'Hierarchy and capability matrix.', content);
}

export function subjectsPage(user, subjects, templates) {
  const rows = subjects
    .map(
      (s) => `<tr>
      <td><a href="/subjects/${s.id}">${h(s.name)}</a></td>
      <td>Class ${s.class_level}</td>
      <td>${h(s.template_name)}</td>
      <td>${new Date(s.created_at).toLocaleDateString()}</td>
    </tr>`
    )
    .join('');

  const templateOptions = templates.map((t) => `<option value="${t.id}">${h(t.name)}</option>`).join('');

  const content = `<section class="card">
    <form method="post" action="/api/subjects" class="grid grid-4" enctype="multipart/form-data">
      <input class="input" name="name" placeholder="Subject name" required />
      <select class="select" name="classLevel" required>${classOptions()}</select>
      <select class="select" name="templateId" required>${templateOptions}</select>
      <button class="btn btn-primary" type="submit">Add Subject</button>
    </form>
  </section>
  <section class="card">
    <div class="table-wrap"><table class="table">
      <thead><tr><th>Subject</th><th>Class</th><th>Template</th><th>Created</th></tr></thead>
      <tbody>${tableRowsOrEmpty(rows, 4, 'No subjects yet.')}</tbody>
    </table></div>
  </section>`;

  return appShell('subjects', user, 'Subjects', 'Create subjects from templates and manage their content.', content);
}

export function subjectNodeListPage(user, subject, title, subtitle, nodes, backHref) {
  const rows = nodes
    .map(
      (n) => `<tr>
      <td class="subject-node-name-cell"><a href="/subjects/${subject.id}/nodes/${n.id}" class="truncate-one-line">${h(n.display_name)}</a><div class="muted truncate-one-line">Server key: ${h(n.server_name)}</div></td>
      <td>${yesNo(n.supports_edit)}</td>
      <td>${yesNo(n.supports_image)}</td>
      <td>${imageCell(n.image_key)}</td>
      <td class="subject-node-actions-cell">
        <form method="post" action="/api/subject-nodes/${n.id}" enctype="multipart/form-data" class="subject-node-actions-row">
          <input type="hidden" name="redirect" value="${h(backHref)}" />
          <input class="input" name="displayName" value="${h(n.display_name)}" ${n.supports_edit ? '' : 'disabled'} maxlength="120" />
          <input class="input" name="image" type="file" accept="image/*" ${n.supports_image ? '' : 'disabled'} />
          <label class="subject-node-checkbox"><input type="checkbox" name="removeImage" value="1" ${n.supports_image ? '' : 'disabled'} /> Remove image</label>
          <button class="btn btn-secondary" type="submit">Save</button>
        </form>
      </td>
    </tr>`
    )
    .join('');

  const content = `<section class="card"><a class="back-link" href="${backHref}">← Back</a></section>
  <section class="card"><div class="table-wrap"><table class="table">
    <thead><tr><th>Name</th><th>Edit</th><th>Image</th><th>Current Image</th><th>Actions</th></tr></thead>
    <tbody>${tableRowsOrEmpty(rows, 5, 'No nodes found.')}</tbody>
  </table></div></section>`;

  return appShell('subjects', user, title, subtitle, content);
}

export function chaptersPage(user, subject, node, chapters) {
  const rows = chapters
    .map(
      (c) => `<tr>
      <td><a href="/subjects/${subject.id}/nodes/${node.id}/chapters/${c.id}">${h(c.name)}</a></td>
      <td>${imageCell(c.image_key)}</td>
      <td>
        <form method="post" action="/api/chapters/${c.id}" enctype="multipart/form-data" class="toolbar-group">
          <input type="hidden" name="subjectId" value="${subject.id}" />
          <input type="hidden" name="nodeId" value="${node.id}" />
          <input class="input" name="name" value="${h(c.name)}" required />
          <input class="input" type="file" name="image" accept="image/*" />
          <label><input type="checkbox" name="removeImage" value="1" /> Remove image</label>
          <button class="btn btn-secondary" name="intent" value="update" type="submit">Update</button>
          <button class="btn btn-danger" name="intent" value="delete" type="submit">Delete</button>
        </form>
      </td>
    </tr>`
    )
    .join('');

  const content = `<section class="card">
    <a class="back-link" href="/subjects/${subject.id}/nodes/${node.parent_subject_node_id}">← Back</a>
    <form method="post" action="/api/chapters" enctype="multipart/form-data" class="toolbar-group section-gap-sm">
      <input type="hidden" name="subjectNodeId" value="${node.id}" />
      <input type="hidden" name="subjectId" value="${subject.id}" />
      <input class="input" name="name" placeholder="Chapter name" required />
      <input class="input" type="file" name="image" accept="image/*" />
      <button class="btn btn-primary" type="submit">Add Chapter</button>
    </form>
  </section>
  <section class="card"><div class="table-wrap"><table class="table">
    <thead><tr><th>Chapter</th><th>Image</th><th>Actions</th></tr></thead>
    <tbody>${tableRowsOrEmpty(rows, 3, 'No chapters yet.')}</tbody>
  </table></div></section>`;

  return appShell('subjects', user, `${subject.name} · ${node.display_name}`, 'Manage chapters.', content);
}

export function contentKindsPage(user, subject, node, chapter, childNodes = []) {
  const detectedKinds = childNodes.filter((n) => n.node_type === 'content').map((n) => n.content_kind || n.display_name);
  const fallbackKinds = node.content_kind ? [node.content_kind] : ['CQ Bank', 'MCQ Bank', 'Short Notes', 'Videos'];
  const kinds = Array.from(new Set((detectedKinds.length ? detectedKinds : fallbackKinds).filter(Boolean)));

  const hrefForKind = (kind) => {
    if (kind === 'Short Notes') return `/subjects/${subject.id}/notes?node=${node.id}&chapter=${chapter?.id || ''}`;
    if (kind === 'MCQ Bank') return `/subjects/${subject.id}/mcqs?node=${node.id}&chapter=${chapter?.id || ''}`;
    return `/subjects/${subject.id}/content?node=${node.id}&chapter=${chapter?.id || ''}&kind=${encodeURIComponent(kind)}`;
  };

  const rows = kinds.map((kind) => `<tr><td>${h(kind)}</td><td><a href="${hrefForKind(kind)}">Open</a></td></tr>`).join('');
  const backHref = node.supports_chapters ? `/subjects/${subject.id}/nodes/${node.id}` : `/subjects/${subject.id}/nodes/${node.parent_subject_node_id}`;
  const content = `<section class="card"><a class="back-link" href="${backHref}">← Back</a></section>
  <section class="card"><div class="table-wrap"><table class="table"><thead><tr><th>Content Type</th><th>Action</th></tr></thead><tbody>${rows}</tbody></table></div></section>`;
  return appShell('subjects', user, `${subject.name} · ${chapter ? chapter.name : node.display_name}`, 'Choose any content type defined in your template.', content);
}

function richTextEditor(fieldName, value, placeholder, required = false) {
  return `<div class="rich-editor" data-rich-editor>
      <div class="editor-header">
        <div class="editor-mode-tabs" role="tablist" aria-label="Editor view mode">
          <button type="button" class="editor-mode-tab active" data-editor-tab="write" role="tab" aria-selected="true">Write</button>
          <button type="button" class="editor-mode-tab" data-editor-tab="preview" role="tab" aria-selected="false">Preview</button>
        </div>
      </div>
      <div class="editor-tools">
        <button type="button" class="btn btn-secondary" data-editor-command="bold" title="Bold"><strong>B</strong></button>
        <button type="button" class="btn btn-secondary" data-editor-command="italic" title="Italic"><em>I</em></button>
        <button type="button" class="btn btn-secondary" data-editor-command="underline" title="Underline"><u>U</u></button>
        <button type="button" class="btn btn-secondary" data-editor-command="formatBlock" data-editor-value="h2">H2</button>
        <button type="button" class="btn btn-secondary" data-editor-command="formatBlock" data-editor-value="blockquote">Quote</button>
        <button type="button" class="btn btn-secondary" data-editor-command="insertUnorderedList">• List</button>
        <button type="button" class="btn btn-secondary" data-editor-command="insertOrderedList">1. List</button>
        <button type="button" class="btn btn-secondary" data-editor-command="createLink" data-editor-prompt="Enter URL">Link</button>
        <button type="button" class="btn btn-secondary" data-editor-command="removeFormat">Clear</button>
      </div>
      <div class="rich-editor-input" data-editor-input data-editor-placeholder="${h(placeholder)}" contenteditable="true">${value || ''}</div>
      <div class="rich-editor-preview" data-editor-preview hidden></div>
      <textarea class="input" name="${fieldName}" data-editor-storage hidden ${required ? 'required' : ''}>${h(value || '')}</textarea>
    </div>`;
}

function noteForm(subjectId, subjectNodeId, chapterId, note) {
  return `<form method="post" action="/api/notes" enctype="multipart/form-data" class="grid grid-2">
    <input type="hidden" name="liveRegion" value="notes-page" />
    <input type="hidden" name="subjectId" value="${subjectId}" />
    <input type="hidden" name="subjectNodeId" value="${subjectNodeId}" />
    <input type="hidden" name="chapterId" value="${chapterId || ''}" />
    <input type="hidden" name="page" value="${note?.page || 1}" />
    <input type="hidden" name="id" value="${note?.id || ''}" />
    <input class="input" type="file" name="image" accept="image/*" />
    ${richTextEditor('contentHtml', note?.content_html || '', 'Write your short note here…', true)}
    <div class="toolbar-group">
      ${note ? '<label><input type="checkbox" name="removeImage" value="1" /> Remove image</label>' : ''}
      <button class="btn btn-primary" type="submit" data-live-form="true">${note ? 'Update Note' : 'Add Note'}</button>
    </div>
  </form>`;
}

function noteDeleteForm(subjectId, subjectNodeId, chapterId, noteId, page = 1) {
  return `<form method="post" action="/api/notes/delete">
    <input type="hidden" name="liveRegion" value="notes-page" />
    <input type="hidden" name="id" value="${noteId}" />
    <input type="hidden" name="subjectId" value="${subjectId}" />
    <input type="hidden" name="subjectNodeId" value="${subjectNodeId}" />
    <input type="hidden" name="chapterId" value="${chapterId || ''}" />
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
  if (totalPages <= 1) return '';
  const pageLinks = Array.from({ length: totalPages }, (_, i) => i + 1)
    .map((value) =>
      value === page
        ? `<span class="page-link current" aria-current="page">${value}</span>`
        : `<a class="page-link" href="${baseHref}&page=${value}">${value}</a>`
    )
    .join('');
  return `<nav class="pagination" aria-label="Pagination">
    <a class="page-link" href="${baseHref}&page=${Math.max(1, page - 1)}">Prev</a>
    <div class="page-links">${pageLinks}</div>
    <a class="page-link" href="${baseHref}&page=${Math.min(totalPages, page + 1)}">Next</a>
  </nav>`;
}

export function notesPage(user, subject, node, chapter, notes, currentPage = 1) {
  const baseHref = `/subjects/${subject.id}/notes?node=${node.id}&chapter=${chapter?.id || ''}`;
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
        <div class="note-content">${itemIndex}. ${n.content_html}</div>
        <div class="note-actions-inline">
          <button type="button" class="btn btn-icon" data-content-modal-open="${modalId}" aria-label="Edit note" title="Edit note">✎</button>
          ${noteDeleteForm(subject.id, node.id, chapter?.id, n.id, safePage)}
        </div>
      </div>
      ${n.image_key ? `<figure class="entry-media plain-media"><img src="${h(imageUrlFromKey(n.image_key) || '')}" alt="Note image ${itemIndex}" loading="lazy" /></figure>` : ''}
      <dialog class="content-modal" data-content-modal="${modalId}">
        <div class="modal content-modal-inner">
          <div class="content-modal-head">
            <h3 class="card-title">Edit note</h3>
            <button type="button" class="btn btn-secondary" data-content-modal-close>Close</button>
          </div>
          ${noteForm(subject.id, node.id, chapter?.id, { ...n, page: safePage })}
        </div>
      </dialog>
      </article>`;
    })
    .join('');

  const backHref = chapter
    ? `/subjects/${subject.id}/nodes/${node.id}/chapters/${chapter.id}`
    : `/subjects/${subject.id}/nodes/${node.id}`;

  const content = `<section class="card"><a class="back-link" href="${backHref}">← Back</a></section>
  <section class="card content-form-shell" data-add-form-shell>
    <div class="content-form-head">
      <h3 class="card-title">Add notes</h3>
      <button type="button" class="btn btn-secondary" data-add-form-toggle data-add-form-label="notes" aria-expanded="false">Add Notes</button>
    </div>
    <div data-add-form-panel>
      ${noteForm(subject.id, node.id, chapter?.id, { page: safePage })}
    </div>
  </section>
  <section class="content-list plain-two-column" data-live-region="notes-page">
    <div>${renderNoteItems(leftColumn, 0) || ''}</div>
    <div>${renderNoteItems(rightColumn, 20) || ''}</div>
  </section>
  ${!pageItems.length ? '<p class="muted">No notes yet.</p>' : ''}
  ${renderPagination(baseHref, safePage, totalPages)}`;

  return appShell('subjects', user, `${subject.name} · Short Notes`, 'Create, edit, and delete notes.', content);
}

function mcqForm(subjectId, subjectNodeId, chapterId, mcq) {
  const submitLabel = mcq ? 'Update Question' : 'Add Question';
  return `<form method="post" action="/api/mcqs" enctype="multipart/form-data" class="grid grid-2">
    <input type="hidden" name="id" value="${mcq?.id || ''}" />
    <input type="hidden" name="subjectId" value="${subjectId}" />
    <input type="hidden" name="subjectNodeId" value="${subjectNodeId}" />
    <input type="hidden" name="chapterId" value="${chapterId || ''}" />
    <input type="hidden" name="page" value="${mcq?.page || 1}" />
    ${richTextEditor('questionHtml', mcq?.question_html || '', 'Write the MCQ question here…', true)}
    <input class="input" type="file" name="image" accept="image/*" />
    <input class="input" name="optionA" placeholder="Option A" value="${h(mcq?.option_a || '')}" required />
    <input class="input" name="optionB" placeholder="Option B" value="${h(mcq?.option_b || '')}" required />
    <input class="input" name="optionC" placeholder="Option C" value="${h(mcq?.option_c || '')}" required />
    <input class="input" name="optionD" placeholder="Option D" value="${h(mcq?.option_d || '')}" required />
    <select class="select" name="correctOption" required>
      ${['A', 'B', 'C', 'D'].map((v) => `<option value="${v}" ${mcq?.correct_option === v ? 'selected' : ''}>Correct: ${v}</option>`).join('')}
    </select>
    <div>${mcq ? '<label><input type="checkbox" name="removeImage" value="1" /> Remove image</label>' : ''}<button class="btn btn-primary" type="submit">${submitLabel}</button></div>
  </form>`;
}



export function contentEntriesPage(user, subject, node, chapter, contentKind, entries, currentPage = 1) {
  const baseHref = `/subjects/${subject.id}/content?node=${node.id}&chapter=${chapter?.id || ''}&kind=${encodeURIComponent(contentKind)}`;
  const { totalPages, safePage, pageItems } = getPagedItems(entries, currentPage, 20);
  const backHref = chapter
    ? `/subjects/${subject.id}/nodes/${node.id}/chapters/${chapter.id}`
    : `/subjects/${subject.id}/nodes/${node.id}`;

  const entryForm = (entry) => `<form method="post" action="/api/content-entries" enctype="multipart/form-data" class="grid grid-2">
    <input type="hidden" name="id" value="${entry?.id || ''}" />
    <input type="hidden" name="subjectId" value="${subject.id}" />
    <input type="hidden" name="subjectNodeId" value="${node.id}" />
    <input type="hidden" name="chapterId" value="${chapter?.id || ''}" />
    <input type="hidden" name="contentKind" value="${h(contentKind)}" />
    <input type="hidden" name="page" value="${entry?.page || safePage}" />
    <input class="input" name="title" placeholder="Title" value="${h(entry?.title || '')}" maxlength="180" />
    <input class="input" type="file" name="image" accept="image/*" />
    ${richTextEditor('contentHtml', entry?.content_html || '', `Write ${h(contentKind)} content here…`, true)}
    <div>${entry ? '<label><input type="checkbox" name="removeImage" value="1" /> Remove image</label>' : ''}<button class="btn btn-primary" type="submit">${entry ? 'Update Entry' : 'Add Entry'}</button></div>
  </form>`;

  const items = pageItems.map((entry, idx) => {
    const modalId = `content-entry-edit-${entry.id}`;
    const itemIndex = (safePage - 1) * 20 + idx + 1;
    return `<article class="plain-entry" id="content-entry-${entry.id}">
      <div class="plain-line-wrap">
        <div class="mcq-question"><strong>${itemIndex}.</strong> ${h(entry.title || `${contentKind} entry`)}</div>
        <div class="mcq-actions-inline">
          <button type="button" class="btn btn-icon" data-content-modal-open="${modalId}" aria-label="Edit content" title="Edit content">✎</button>
          <form method="post" action="/api/content-entries/delete"><input type="hidden" name="id" value="${entry.id}" /><input type="hidden" name="subjectId" value="${subject.id}" /><input type="hidden" name="subjectNodeId" value="${node.id}" /><input type="hidden" name="chapterId" value="${chapter?.id || ''}" /><input type="hidden" name="kind" value="${h(contentKind)}" /><input type="hidden" name="page" value="${safePage}" /><button class="btn btn-icon btn-icon-danger" type="submit" aria-label="Delete content" title="Delete content">🗑</button></form>
        </div>
      </div>
      ${entry.image_key ? `<figure class="entry-media plain-media"><img src="${h(imageUrlFromKey(entry.image_key) || '')}" alt="${h(contentKind)} image ${itemIndex}" loading="lazy" /></figure>` : ''}
      <div>${entry.content_html}</div>
      <dialog class="content-modal" data-content-modal="${modalId}"><div class="modal content-modal-inner"><div class="content-modal-head"><h3 class="card-title">Edit ${h(contentKind)}</h3><button type="button" class="btn btn-secondary" data-content-modal-close>Close</button></div>${entryForm({ ...entry, page: safePage })}</div></dialog>
    </article>`;
  }).join('');

  const content = `<section class="card"><a class="back-link" href="${backHref}">← Back</a></section>
  <section class="card content-form-shell" data-add-form-shell><div class="content-form-head"><h3 class="card-title">Add ${h(contentKind)} item</h3><button type="button" class="btn btn-secondary" data-add-form-toggle data-add-form-label="${h(contentKind)}" aria-expanded="false">Add ${h(contentKind)}</button></div><div data-add-form-panel>${entryForm({ page: safePage })}</div></section>
  <section class="content-list">${items}</section>
  ${!pageItems.length ? '<p class="muted">No content yet.</p>' : ''}
  ${renderPagination(baseHref, safePage, totalPages)}`;

  return appShell('subjects', user, `${subject.name} · ${h(contentKind)}`, 'Flexible content editor for any custom content type.', content);
}

export function mcqsPage(user, subject, node, chapter, mcqs, currentPage = 1) {
  const baseHref = `/subjects/${subject.id}/mcqs?node=${node.id}&chapter=${chapter?.id || ''}`;
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
        <div class="mcq-question">${itemIndex}. ${m.question_html}</div>
        <div class="mcq-actions-inline">
          <button type="button" class="btn btn-icon" data-content-modal-open="${modalId}" aria-label="Edit MCQ" title="Edit MCQ">✎</button>
          <form method="post" action="/api/mcqs/delete"><input type="hidden" name="id" value="${m.id}" /><input type="hidden" name="subjectId" value="${subject.id}" /><input type="hidden" name="subjectNodeId" value="${node.id}" /><input type="hidden" name="chapterId" value="${chapter?.id || ''}" /><input type="hidden" name="page" value="${safePage}" /><button class="btn btn-icon btn-icon-danger" type="submit" aria-label="Delete MCQ" title="Delete MCQ">🗑</button></form>
        </div>
      </div>
      ${m.image_key ? `<figure class="entry-media plain-media"><img src="${h(imageUrlFromKey(m.image_key) || '')}" alt="MCQ image ${itemIndex}" loading="lazy" /></figure>` : ''}
      <div class="mcq-options-grid" role="list" aria-label="Options for MCQ ${index + 1}">
        <p class="mcq-option ${m.correct_option === 'A' ? 'mcq-option-correct' : ''}" role="listitem"><span class="mcq-option-label">A.</span><span>${h(m.option_a)}</span></p>
        <p class="mcq-option ${m.correct_option === 'B' ? 'mcq-option-correct' : ''}" role="listitem"><span class="mcq-option-label">B.</span><span>${h(m.option_b)}</span></p>
        <p class="mcq-option ${m.correct_option === 'C' ? 'mcq-option-correct' : ''}" role="listitem"><span class="mcq-option-label">C.</span><span>${h(m.option_c)}</span></p>
        <p class="mcq-option ${m.correct_option === 'D' ? 'mcq-option-correct' : ''}" role="listitem"><span class="mcq-option-label">D.</span><span>${h(m.option_d)}</span></p>
      </div>
      <dialog class="content-modal" data-content-modal="${modalId}">
        <div class="modal content-modal-inner">
          <div class="content-modal-head">
            <h3 class="card-title">Edit MCQ</h3>
            <button type="button" class="btn btn-secondary" data-content-modal-close>Close</button>
          </div>
          ${mcqForm(subject.id, node.id, chapter?.id, { ...m, page: safePage })}
        </div>
      </dialog>
      </article>`;
    })
    .join('');

  const backHref = chapter
    ? `/subjects/${subject.id}/nodes/${node.id}/chapters/${chapter.id}`
    : `/subjects/${subject.id}/nodes/${node.id}`;

  const content = `<section class="card"><a class="back-link" href="${backHref}">← Back</a></section>
  <section class="card content-form-shell" data-add-form-shell>
    <div class="content-form-head">
      <h3 class="card-title">Add question</h3>
      <button type="button" class="btn btn-secondary" data-add-form-toggle data-add-form-label="question" aria-expanded="false">Add Question</button>
    </div>
    <div data-add-form-panel>
      ${mcqForm(subject.id, node.id, chapter?.id, { page: safePage })}
    </div>
  </section>
  <section class="content-list plain-two-column">
    <div>${renderMcqItems(leftColumn, 0) || ''}</div>
    <div>${renderMcqItems(rightColumn, 10) || ''}</div>
  </section>
  ${!pageItems.length ? '<p class="muted">No MCQs yet.</p>' : ''}
  ${renderPagination(baseHref, safePage, totalPages)}`;

  return appShell('subjects', user, `${subject.name} · MCQ Bank`, 'Create, edit, and delete MCQs.', content);
}
