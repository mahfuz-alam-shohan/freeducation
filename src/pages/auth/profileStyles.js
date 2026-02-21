export const profileStyles = `
.profile-header-flat { display: grid; gap: 10px; }
.profile-cover-shell { position: relative; }
.profile-cover-media { height: clamp(180px, 32vw, 320px); border-radius: 10px; overflow: hidden; background: #dbeafe; }
.profile-cover-media img { width: 100%; height: 100%; object-fit: cover; }
.profile-avatar-row { position: absolute; left: 20px; bottom: -52px; }
.profile-avatar-shell { width: 148px; height: 148px; border-radius: 999px; border: 4px solid #fff; background: #e2e8f0; overflow: hidden; display: grid; place-items: center; font-size: 34px; font-weight: 700; }
.profile-avatar-shell img { width: 100%; height: 100%; object-fit: cover; }
.profile-body-flat { display: grid; gap: 8px; margin-top: 8px; }
.profile-tabs { display: flex; gap: 10px; border-bottom: 1px solid var(--line); }
.profile-tab { border: 0; background: transparent; padding: 8px 2px; color: #475569; font-size: 15px; font-weight: 600; border-bottom: 2px solid transparent; cursor: pointer; }
.profile-tab.is-active { color: #1d4ed8; border-bottom-color: #1d4ed8; }
.profile-tab-panel[hidden] { display: none; }
.profile-upload-status,.profile-autosave-status { margin: 0; font-size: 13px; min-height: 18px; }
.profile-upload-status[data-tone="error"],.profile-autosave-status[data-tone="error"] { color: #991b1b; }
@media (max-width: 840px) {
  .profile-avatar-row { left: 10px; bottom: -40px; }
  .profile-avatar-shell { width: 108px; height: 108px; }
}
`;
