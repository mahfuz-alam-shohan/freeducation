export function renderTopicOverview(detail) {
  const { topic, chapter, subject, node, notes, videos, questions } = detail;
  const nodeName = node.displayName || node.serverName || '';
  const items = [
    {
      label: 'Short Notes',
      description: 'One line notes for this topic.',
      count: (notes || []).length,
      href: `#subjects/${subject.id}/chapters/${node.id}/${chapter.id}/topics/${topic.id}/notes`
    },
    {
      label: 'Videos',
      description: 'Uploads or external links.',
      count: (videos || []).length,
      href: `#subjects/${subject.id}/chapters/${node.id}/${chapter.id}/topics/${topic.id}/videos`
    },
    {
      label: 'Question Bank',
      description: 'CQ and MCQ questions.',
      count: (questions || []).length,
      href: `#subjects/${subject.id}/chapters/${node.id}/${chapter.id}/topics/${topic.id}/questions`
    }
  ];

  const rows = items.map((item) => `
      <tr>
        <td>${item.label}</td>
        <td>${item.description}</td>
        <td class="cell-mono">${item.count}</td>
        <td class="cell-actions">
          <a class="button secondary" href="${item.href}">Open</a>
        </td>
      </tr>
    `).join('');

  return `
    <div class="card table-card">
      <div class="table-header">
        <div>
          <h3>${topic.name}</h3>
          <p>${subject.name} > ${nodeName} > ${chapter.name}</p>
        </div>
        <div class="table-actions">
          <button class="button secondary" data-action="topic-edit">Edit topic</button>
          <button class="button ghost" data-action="chapter-edit">Edit chapter</button>
          <a class="button ghost" href="#subjects/${subject.id}/chapters/${node.id}/${chapter.id}/topics">Back</a>
        </div>
      </div>
      <div class="table-scroll">
        <table class="table">
          <thead>
            <tr>
              <th>Section</th>
              <th>Description</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
