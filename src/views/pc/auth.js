function authCardPc({ title, description, body, topbarSlot = "" }) {
  return `
    <div class="pc-auth-shell">
      ${topbarSlot}
      <div class="pc-auth-wrapper">
        <div class="pc-auth-card">
          <h1>${title}</h1>
          <p>${description}</p>
          ${body}
        </div>
      </div>
    </div>
  `;
}

export { authCardPc };
