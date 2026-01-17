function contentShell({ content, topbarSlot = "" }) {
  return `
    <div class="phone-admin-layout">
      ${topbarSlot}
      <div class="phone-content">
        ${content}
      </div>
    </div>
  `;
}

export { contentShell };
