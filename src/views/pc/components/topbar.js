function topbar({ title, contextLabel }) {
  return `
    <div class="pc-topbar">
      <div>${title}</div>
      ${contextLabel ? `<div class="small">${contextLabel}</div>` : ""}
    </div>
  `;
}

export { topbar };
