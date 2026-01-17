function adminTopbar({ title }) {
  return `
    <div class="pc-topbar">
      <div>${title}</div>
      <div class="small">Admin controls</div>
    </div>
  `;
}

export { adminTopbar };
