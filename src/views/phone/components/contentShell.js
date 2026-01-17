function contentShell({ content, topbarSlot = "" }) {
  return `
    <div class="phone-shell">
      ${topbarSlot}
      <div class="phone-content">
        ${content}
      </div>
    </div>
  `;
}

export { contentShell };
