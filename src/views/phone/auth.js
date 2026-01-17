function authCardPhone({ title, description, body, topbarSlot = "" }) {
  return `
    <div class="phone-auth-shell">
      ${topbarSlot}
      <div class="phone-auth-wrapper">
        <div class="phone-auth-card">
          <h1>${title}</h1>
          <p>${description}</p>
          ${body}
        </div>
      </div>
    </div>
  `;
}

export { authCardPhone };
