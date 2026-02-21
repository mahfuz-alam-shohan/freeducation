export const profileStyles = `
.profile-header-flat { display: grid; gap: 10px; }
.profile-cover-shell { position: relative; }
.profile-cover-media { height: clamp(180px, 32vw, 320px); border-radius: 10px; overflow: hidden; background: #dbeafe; }
.profile-cover-media img { width: 100%; height: 100%; object-fit: cover; }
.profile-cover-placeholder { width: 100%; height: 100%; display: grid; place-items: center; color: #475569; font-weight: 600; }

.profile-photo-control { position: absolute; z-index: 4; }
.profile-cover-control { right: 12px; bottom: 12px; }
.profile-avatar-row { position: absolute; left: 20px; bottom: -52px; }
.profile-avatar-control { right: 4px; bottom: 6px; }

.profile-avatar-shell {
  width: 148px;
  height: 148px;
  border-radius: 999px;
  border: 4px solid #fff;
  background: #e2e8f0;
  overflow: hidden;
  display: grid;
  place-items: center;
  font-size: 34px;
  font-weight: 700;
}
.profile-avatar-shell img { width: 100%; height: 100%; object-fit: cover; }

.profile-photo-icon-btn {
  width: 42px;
  height: 42px;
  min-width: 42px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  padding: 0;
  border: 1px solid #b4c3e8;
  background: #eaf0ff;
  color: #5b6c8f;
}
.profile-photo-icon-btn .icon { width: 20px; height: 20px; display: grid; place-items: center; }
.profile-photo-icon-btn .icon svg { width: 20px; height: 20px; stroke: currentColor; fill: none; }

.profile-photo-actions {
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  min-width: 180px;
  max-width: min(220px, calc(100vw - 16px));
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 6px;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.14);
  display: none;
}
.profile-avatar-control .profile-photo-actions { left: 0; right: auto; }
.profile-photo-control.menu-open .profile-photo-actions { display: grid; gap: 4px; }
.profile-photo-action {
  border: 0;
  background: #f8fafc;
  border-radius: 8px;
  text-align: left;
  padding: 8px 10px;
  font-size: 14px;
  color: #0f172a;
  cursor: pointer;
}
.profile-photo-action:hover:enabled { background: #eef2ff; }
.profile-photo-action:disabled { cursor: not-allowed; color: #94a3b8; }
.profile-file-input { display: none; }

.profile-name-row { margin-top: 56px; }
.profile-name-row h2 { margin: 0; font-size: clamp(28px, 4.5vw, 40px); line-height: 1.1; }

.profile-bio { display: grid; gap: 14px; font-family: Inter, "Noto Sans Bengali", "Hind Siliguri", "Nirmala UI", sans-serif; }
.profile-field-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.profile-inline-edit-btn {
  width: 32px;
  height: 32px;
  border-radius: 999px;
  border: 1px solid #bfd0ef;
  background: #eaf0ff;
  color: #5f7194;
  display: grid;
  place-items: center;
  cursor: pointer;
  padding: 0;
}
.profile-inline-edit-btn .icon,
.profile-inline-edit-btn .icon svg { width: 16px; height: 16px; }
.profile-inline-edit-btn.is-open { color: #1d4ed8; border-color: #9bb6ee; }
.profile-bio-label { margin: 0; color: #64748b; font-size: 18px; font-weight: 500; }
.profile-inline-input { max-width: 560px; margin-top: 6px; min-width: 0; }
.profile-dob-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; max-width: 560px; }
.profile-field-label { font-size: 13px; color: #64748b; margin-top: 2px; }
.profile-inline-editor { display: grid; gap: 8px; margin-top: 4px; max-width: 560px; }
.profile-inline-editor[hidden] { display: none; }
.profile-inline-actions { display: flex; gap: 8px; align-items: center; }
.profile-form-grid { display: grid; gap: 10px; max-width: 520px; }

.profile-body-flat { display: grid; gap: 8px; margin-top: 0; }
.profile-tabs { display: flex; gap: 10px; border-bottom: 1px solid var(--line); }
.profile-tab { border: 0; background: transparent; padding: 8px 2px; color: #475569; font-size: 15px; font-weight: 600; border-bottom: 2px solid transparent; cursor: pointer; }
.profile-tab.is-active { color: #1d4ed8; border-bottom-color: #1d4ed8; }
.profile-tab-panel[hidden] { display: none; }
.profile-upload-status,.profile-inline-status { margin: 0; font-size: 13px; min-height: 18px; }
.profile-upload-status[data-tone="error"],.profile-inline-status[data-tone="error"] { color: #991b1b; }

.profile-grid-flat { display: grid; gap: 14px; }
.profile-form-actions { display: flex; justify-content: flex-end; gap: 8px; }
.profile-fixed-value { margin: 0; color: #0f172a; font-size: 18px; line-height: 1.25; font-weight: 700; font-feature-settings: "kern" 1; }
.profile-readonly-row { display: grid; gap: 2px; }
.profile-readonly-row .muted { margin: 0; }

.profile-photo-modal-card { max-width: min(860px, 96vw); }
.profile-photo-modal-image { border-radius: 10px; overflow: hidden; background: #0f172a0d; max-height: 75vh; }
.profile-photo-modal-image img { width: 100%; height: auto; display: block; }

@media (max-width: 840px) {
  .profile-tab { font-size: 15px; }
  .profile-fixed-value { font-size: 16px; }
  .profile-bio-label { font-size: 17px; }
  .profile-avatar-row { left: 10px; bottom: -40px; }
  .profile-avatar-shell { width: 108px; height: 108px; font-size: 26px; }
  .profile-name-row { margin-top: 36px; }
  .profile-photo-actions { min-width: 182px; }
  .profile-grid-flat { gap: 12px; }
  .profile-dob-grid { grid-template-columns: 1fr; }
}
`;
