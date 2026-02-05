import { renderVideoRows } from './rows.js';

export function renderTopicVideos(detail, mediaUrl) {
  const { topic, chapter, subject, node, videos } = detail;
  const nodeName = node.displayName || node.serverName || '';

  return `
    <div class="card table-card">
      <div class="table-header">
        <div>
          <h3>${topic.name} - Videos</h3>
          <p>${subject.name} > ${nodeName} > ${chapter.name}</p>
        </div>
        <div class="table-actions">
          <button class="button" data-action="topic-video-add">Add video</button>
          <button class="button secondary" data-action="topic-edit">Edit topic</button>
          <a class="button ghost" href="#subjects/${subject.id}/chapters/${node.id}/${chapter.id}/topics/${topic.id}">Back</a>
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
