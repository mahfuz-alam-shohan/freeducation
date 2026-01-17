function adminTopbar({ title }) {
  return `
    <div class="phone-topbar">
      <div>${title}</div>
      <div class="small">Admin</div>
    </div>
  `;
}

export { adminTopbar };
