function adminContent({ content, topbar }) {
  return `
    <main>
      ${topbar}
      <div class="pc-content">
        ${content}
      </div>
    </main>
  `;
}

export { adminContent };
