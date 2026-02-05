import { renderNotesRows } from './rows.js';

export function renderChapterNotes(detail, mediaUrl) {
  const { chapter, subject, node, notes } = detail;
  const nodeName = node.displayName || node.serverName || '';

  return `
    <div class="card table-card">
      <div class="table-header">
        <div>
          <h3>${chapter.name} - Short Notes</h3>
          <p>${subject.name} > ${nodeName}</p>
        </div>
        <div class="table-actions">
          <button class="button" data-action="note-add">Add note</button>
          <button class="button secondary" data-action="chapter-edit">Edit chapter</button>
          <a class="button ghost" href="#subjects/${subject.id}/chapters/${node.id}/${chapter.id}">Back</a>
        </div>
      </div>
      <div class="table-scroll">
        <table class="table">
          <thead>
            <tr>
              <th>Note</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${renderNotesRows(notes, mediaUrl)}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
