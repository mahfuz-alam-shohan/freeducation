import { renderVideoRows } from './rows.js';

export function renderChapterVideos(detail, mediaUrl) {
  const { chapter, subject, node, videos } = detail;
  const nodeName = node.displayName || node.serverName || '';

  return `
    <div class="card table-card">
      <div class="table-header">
        <div>
          <h3>${chapter.name} - Videos</h3>
          <p>${subject.name} > ${nodeName}</p>
        </div>
        <div class="table-actions">
          <button class="button" data-action="video-add">Add video</button>
          <button class="button secondary" data-action="chapter-edit">Edit chapter</button>
          <a class="button ghost" href="#subjects/${subject.id}/chapters/${node.id}/${chapter.id}">Back</a>
        </div>
      </div>
      <div class="table-scroll">
        <table class="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Mode</th>
              <th>Source</th>
              <th>Author</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${renderVideoRows(videos, mediaUrl)}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
