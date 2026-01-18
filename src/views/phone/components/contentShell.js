function contentShell({ content, topbarSlot = "" }) {
  return `
    <div class="phone-shell">
      ${topbarSlot}
      <div class="phone-content">
        <div class="content-frame">
          ${content}
        </div>
      </div>
    </div>
  `;
}

export { contentShell };
