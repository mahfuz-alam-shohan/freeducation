function authCardPc({ title, description, body, topbarSlot = "", sidebarSlot = "" }) {
  const cardSlot = `
    <div class="pc-auth-card">
      <h1>${title}</h1>
      <p>${description}</p>
      ${body}
    </div>
  `;

  if (sidebarSlot) {
    return `
      <div class="pc-admin-layout pc-auth-shell">
        ${topbarSlot}
        <div class="pc-admin-body">
          ${sidebarSlot}
          <div class="pc-auth-wrapper">
            ${cardSlot}
          </div>
        </div>
      </div>
    `;
  }

  return `
    <div class="pc-auth-shell">
      ${topbarSlot}
      <div class="pc-auth-wrapper">
        ${cardSlot}
      </div>
    </div>
  `;
}

export { authCardPc };
