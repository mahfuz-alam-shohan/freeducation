function contentShell({ content, topbarSlot = "" }) {
  return `
    <main>
      ${topbarSlot}
      <div class="pc-content">
        ${content}
      </div>
    </main>
  `;
}

export { contentShell };
