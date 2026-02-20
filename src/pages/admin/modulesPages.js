import { appShell } from '../templates/shell.js';

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

export function templatesPage(user, templates) {
  const rows = templates
    .map(
      (t) => `<tr>
      <td><a href="/templates/${t.id}">${h(t.name)}</a></td>
      <td>${h(t.code)}</td>
      <td>${h(t.description || '-')}</td>
      <td>${new Date(t.created_at).toLocaleDateString()}</td>
    </tr>`
    )
    .join('');

  const content = `<section class="card">
    <div class="table-wrap"><table class="table">
      <thead><tr><th>Template</th><th>Code</th><th>Description</th><th>Created</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
  </section>`;

  return appShell('templates', user, 'Subject Templates', 'Reusable skeletons for subject structure.', content);
}

export function templateDetailsPage(user, template, nodes) {
  const byParent = new Map();
  for (const node of nodes) {
    const key = node.parent_id || 'root';
    if (!byParent.has(key)) byParent.set(key, []);
    byParent.get(key).push(node);
  }

  function walk(parentId, depth, parentChain = []) {
    const list = byParent.get(parentId || 'root') || [];
    return list
      .map((node, index) => {
        const isLast = index === list.length - 1;
        const branch = [...parentChain, isLast ? 'end' : 'mid'];
        const hierarchy = `<div class="template-tree-row" style="--depth:${depth};">
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
        </tr>${walk(node.id, depth + 1, branch)}`;
      })
      .join('');
  }

  const content = `<section class="card">
    <p class="muted">Template code: <strong>${h(template.code)}</strong></p>
    <div class="table-wrap"><table class="table">
      <thead><tr><th>Hierarchy</th><th>Type</th><th>Editable Name</th><th>Image Upload</th><th>Chapter Based</th></tr></thead>
      <tbody>${walk(null, 0)}</tbody>
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
      <tbody>${rows}</tbody>
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

  const content = `<section class="card"><a href="${backHref}">← Back</a></section>
  <section class="card"><div class="table-wrap"><table class="table">
    <thead><tr><th>Name</th><th>Edit</th><th>Image</th><th>Current Image</th><th>Actions</th></tr></thead>
    <tbody>${rows}</tbody>
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
    <a href="/subjects/${subject.id}/nodes/${node.parent_subject_node_id}">← Back</a>
    <form method="post" action="/api/chapters" enctype="multipart/form-data" class="toolbar-group" style="margin-top:8px;">
      <input type="hidden" name="subjectNodeId" value="${node.id}" />
      <input type="hidden" name="subjectId" value="${subject.id}" />
      <input class="input" name="name" placeholder="Chapter name" required />
      <input class="input" type="file" name="image" accept="image/*" />
      <button class="btn btn-primary" type="submit">Add Chapter</button>
    </form>
  </section>
  <section class="card"><div class="table-wrap"><table class="table">
    <thead><tr><th>Chapter</th><th>Image</th><th>Actions</th></tr></thead>
    <tbody>${rows}</tbody>
  </table></div></section>`;

  return appShell('subjects', user, `${subject.name} · ${node.display_name}`, 'Manage chapters.', content);
}

export function contentKindsPage(user, subject, node, chapter) {
  const kinds = ['CQ Bank', 'MCQ Bank', 'Short Notes', 'Videos'];
  const rows = kinds
    .map((kind) => {
      const isNote = kind === 'Short Notes';
      const isMcq = kind === 'MCQ Bank';
      const href = isNote
        ? `/subjects/${subject.id}/notes?node=${node.id}&chapter=${chapter?.id || ''}`
        : isMcq
        ? `/subjects/${subject.id}/mcqs?node=${node.id}&chapter=${chapter?.id || ''}`
        : '#';
      return `<tr><td>${kind}</td><td>${isNote || isMcq ? `<a href="${href}">Open</a>` : '<span class="muted">Blank for now</span>'}</td></tr>`;
    })
    .join('');
  const backHref = node.supports_chapters ? `/subjects/${subject.id}/nodes/${node.id}` : `/subjects/${subject.id}/nodes/${node.parent_subject_node_id}`;
  const content = `<section class="card"><a href="${backHref}">← Back</a></section>
  <section class="card"><div class="table-wrap"><table class="table"><thead><tr><th>Content Type</th><th>Action</th></tr></thead><tbody>${rows}</tbody></table></div></section>`;
  return appShell('subjects', user, `${subject.name} · ${chapter ? chapter.name : node.display_name}`, 'Choose a content section.', content);
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
    <input type="hidden" name="id" value="${note?.id || ''}" />
    <input class="input" name="title" placeholder="Optional note heading" value="${h(note?.title || '')}" />
    <input class="input" type="file" name="image" accept="image/*" />
    ${richTextEditor('contentHtml', note?.content_html || '', 'Write your short note here…', true)}
    <div class="toolbar-group">
      ${note ? '<label><input type="checkbox" name="removeImage" value="1" /> Remove image</label>' : ''}
      <button class="btn btn-primary" type="submit" data-live-form="true">${note ? 'Update Note' : 'Add Note'}</button>
    </div>
  </form>`;
}

function noteDeleteForm(subjectId, subjectNodeId, chapterId, noteId) {
  return `<form method="post" action="/api/notes/delete">
    <input type="hidden" name="liveRegion" value="notes-page" />
    <input type="hidden" name="id" value="${noteId}" />
    <input type="hidden" name="subjectId" value="${subjectId}" />
    <input type="hidden" name="subjectNodeId" value="${subjectNodeId}" />
    <input type="hidden" name="chapterId" value="${chapterId || ''}" />
    <button class="btn btn-danger" type="submit" data-live-form="true">Delete</button>
  </form>`;
}

export function notesPage(user, subject, node, chapter, notes) {
  const noteCards = notes
    .map((n, index) => {
      const modalId = `note-edit-${n.id}`;
      return `<article class="card" id="note-${n.id}">
      <div class="note-head">
        <p class="muted">Note ${index + 1}</p>
        <div class="toolbar-group">
          <button type="button" class="btn btn-secondary" data-note-modal-open="${modalId}">Edit</button>
          ${noteDeleteForm(subject.id, node.id, chapter?.id, n.id)}
        </div>
      </div>
      ${n.title ? `<h3 class="card-title">${h(n.title)}</h3>` : ''}
      <p class="muted">${new Date(n.created_at).toLocaleString()}</p>
      <div>${n.content_html}</div>
      ${n.image_key ? `<p><code>${h(n.image_key)}</code></p>` : ''}
      <dialog class="note-modal" data-note-modal="${modalId}">
        <div class="modal note-modal-inner">
          <div class="note-modal-head">
            <h3 class="card-title">Edit note</h3>
            <button type="button" class="btn btn-secondary" data-note-modal-close>Close</button>
          </div>
          ${noteForm(subject.id, node.id, chapter?.id, n)}
        </div>
      </dialog>
      </article>`;
    })
    .join('');

  const numberLinks = notes.length
    ? `<nav class="pagination" aria-label="Notes list numbering">
      <span>${notes.length} note${notes.length > 1 ? 's' : ''}</span>
      <div class="note-numbering">${notes
        .map((n, index) => `<a href="#note-${n.id}" class="note-number-link">${index + 1}</a>`)
        .join('')}</div>
    </nav>`
    : '';

  const backHref = chapter
    ? `/subjects/${subject.id}/nodes/${node.id}/chapters/${chapter.id}`
    : `/subjects/${subject.id}/nodes/${node.id}`;

  const content = `<section class="card"><a href="${backHref}">← Back</a></section>
  <section class="card">${noteForm(subject.id, node.id, chapter?.id)}</section>
  <section class="grid" data-live-region="notes-page">${noteCards || '<p class="muted">No notes yet.</p>'}${numberLinks}</section>`;

  return appShell('subjects', user, `${subject.name} · Short Notes`, 'Create, edit, and delete notes.', content);
}

function mcqForm(subjectId, subjectNodeId, chapterId, mcq) {
  return `<form method="post" action="/api/mcqs" enctype="multipart/form-data" class="grid grid-2">
    <input type="hidden" name="id" value="${mcq?.id || ''}" />
    <input type="hidden" name="subjectId" value="${subjectId}" />
    <input type="hidden" name="subjectNodeId" value="${subjectNodeId}" />
    <input type="hidden" name="chapterId" value="${chapterId || ''}" />
    ${richTextEditor('questionHtml', mcq?.question_html || '', 'Write the MCQ question here…', true)}
    <input class="input" type="file" name="image" accept="image/*" />
    <input class="input" name="optionA" placeholder="Option A" value="${h(mcq?.option_a || '')}" required />
    <input class="input" name="optionB" placeholder="Option B" value="${h(mcq?.option_b || '')}" required />
    <input class="input" name="optionC" placeholder="Option C" value="${h(mcq?.option_c || '')}" required />
    <input class="input" name="optionD" placeholder="Option D" value="${h(mcq?.option_d || '')}" required />
    <select class="select" name="correctOption" required>
      ${['A', 'B', 'C', 'D'].map((v) => `<option value="${v}" ${mcq?.correct_option === v ? 'selected' : ''}>Correct: ${v}</option>`).join('')}
    </select>
    <div>${mcq ? '<label><input type="checkbox" name="removeImage" value="1" /> Remove image</label>' : ''}<button class="btn btn-primary" type="submit">${mcq ? 'Update MCQ' : 'Add MCQ'}</button></div>
  </form>`;
}

export function mcqsPage(user, subject, node, chapter, mcqs) {
  const rows = mcqs
    .map(
      (m) => `<div class="card"><div>${m.question_html}</div><p class="muted">A) ${h(m.option_a)} · B) ${h(m.option_b)} · C) ${h(m.option_c)} · D) ${h(m.option_d)} | Correct: ${h(m.correct_option)}</p>
      ${mcqForm(subject.id, node.id, chapter?.id, m)}
      <form method="post" action="/api/mcqs/delete"><input type="hidden" name="id" value="${m.id}" /><input type="hidden" name="subjectId" value="${subject.id}" /><input type="hidden" name="subjectNodeId" value="${node.id}" /><input type="hidden" name="chapterId" value="${chapter?.id || ''}" /><button class="btn btn-danger" type="submit">Delete</button></form>
      </div>`
    )
    .join('');

  const backHref = chapter
    ? `/subjects/${subject.id}/nodes/${node.id}/chapters/${chapter.id}`
    : `/subjects/${subject.id}/nodes/${node.id}`;

  const content = `<section class="card"><a href="${backHref}">← Back</a></section>
  <section class="card">${mcqForm(subject.id, node.id, chapter?.id)}</section>
  <section class="grid">${rows || '<p class="muted">No MCQs yet.</p>'}</section>`;

  return appShell('subjects', user, `${subject.name} · MCQ Bank`, 'Create, edit, and delete MCQs.', content);
}
