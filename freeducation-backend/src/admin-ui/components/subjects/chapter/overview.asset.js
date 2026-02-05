export function renderChapterOverview(detail) {
  const { chapter, subject, node, notes, videos, questions } = detail;
  const nodeName = node.displayName || node.serverName || '';
  const items = [
    {
      label: 'Short Notes',
      description: 'One line notes for this chapter.',
      count: (notes || []).length,
      href: `#subjects/${subject.id}/chapters/${node.id}/${chapter.id}/notes`
    },
    {
      label: 'Videos',
      description: 'Uploads or external links.',
      count: (videos || []).length,
      href: `#subjects/${subject.id}/chapters/${node.id}/${chapter.id}/videos`
    },
    {
      label: 'Question Bank',
      description: 'CQ and MCQ questions.',
      count: (questions || []).length,
      href: `#subjects/${subject.id}/chapters/${node.id}/${chapter.id}/questions`
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
          <h3>${chapter.name}</h3>
          <p>${subject.name} > ${nodeName}</p>
        </div>
        <div class="table-actions">
          <button class="button secondary" data-action="chapter-edit">Edit chapter</button>
          <a class="button ghost" href="#subjects/${subject.id}/chapters/${node.id}">Back</a>
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
