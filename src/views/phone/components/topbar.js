function topbar({ title, contextLabel }) {
  return `
    <div class="phone-topbar">
      <div>${title}</div>
      ${contextLabel ? `<div class="small">${contextLabel}</div>` : ""}
    </div>
  `;
}

export { topbar };
