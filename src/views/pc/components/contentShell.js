function contentShell({ content }) {
  return `
    <main class="pc-content">
      <div class="content-frame">
        ${content}
      </div>
    </main>
  `;
}

export { contentShell };
