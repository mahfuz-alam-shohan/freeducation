function adminContent({ content, topbar }) {
  return `
    <div class="phone-admin-layout">
      ${topbar}
      <div class="phone-content">
        ${content}
      </div>
    </div>
  `;
}

export { adminContent };
