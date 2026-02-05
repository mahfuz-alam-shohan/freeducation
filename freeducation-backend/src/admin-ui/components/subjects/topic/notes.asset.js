import { renderNotesRows } from './rows.js';

export function renderTopicNotes(detail, mediaUrl) {
  const { topic, chapter, subject, node, notes } = detail;
  const nodeName = node.displayName || node.serverName || '';

  return `
    <div class="card table-card">
      <div class="table-header">
        <div>
          <h3>${topic.name} - Short Notes</h3>
          <p>${subject.name} > ${nodeName} > ${chapter.name}</p>
        </div>
        <div class="table-actions">
          <button class="button" data-action="topic-note-add">Add note</button>
          <button class="button secondary" data-action="topic-edit">Edit topic</button>
          <a class="button ghost" href="#subjects/${subject.id}/chapters/${node.id}/${chapter.id}/topics/${topic.id}">Back</a>
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
