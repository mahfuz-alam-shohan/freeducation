export const profileStyles = `
.profile-header-flat { display: grid; gap: 6px; }
.profile-cover-shell { position: relative; }
.profile-cover-media { height: clamp(160px, 26vw, 250px); border-radius: 4px; overflow: hidden; background: #e2e8f0; border: 1px solid var(--line); }
.profile-cover-media img { width: 100%; height: 100%; object-fit: cover; }
.profile-cover-placeholder { width: 100%; height: 100%; display: grid; place-items: center; color: #475569; font-weight: 600; }

.profile-photo-control { position: absolute; z-index: 4; }
.profile-cover-control { right: 8px; bottom: 8px; }
.profile-avatar-row { position: absolute; left: 14px; bottom: -44px; }
.profile-avatar-control { right: 2px; bottom: 2px; }

.profile-avatar-shell { width: 116px; height: 116px; border-radius: 999px; border: 2px solid #fff; background: #e2e8f0; overflow: hidden; display: grid; place-items: center; font-size: 26px; font-weight: 700; }
.profile-avatar-shell img { width: 100%; height: 100%; object-fit: cover; }

.profile-photo-icon-btn { width: 36px; height: 36px; min-width: 36px; border-radius: 999px; display: grid; place-items: center; padding: 0; border: 1px solid var(--line); background: #fff; color: #5b6c8f; }
.profile-photo-icon-btn .icon { width: 18px; height: 18px; display: grid; place-items: center; }
.profile-photo-icon-btn .icon svg { width: 18px; height: 18px; stroke: currentColor; fill: none; }

.profile-photo-actions { position: absolute; right: 0; top: calc(100% + 6px); min-width: 164px; max-width: min(220px, calc(100vw - 16px)); background: #fff; border: 1px solid var(--line); border-radius: 4px; padding: 4px; display: none; }
.profile-avatar-control .profile-photo-actions { left: 0; right: auto; }
.profile-photo-control.menu-open .profile-photo-actions { display: grid; gap: 3px; }
.profile-photo-action { border: 0; background: #f8fafc; border-radius: 4px; text-align: left; padding: 7px 9px; font-size: 13px; color: #0f172a; cursor: pointer; }
.profile-photo-action:hover:enabled { background: #eef2ff; }
.profile-photo-action:disabled { cursor: not-allowed; color: #94a3b8; }
.profile-file-input { display: none; }

.profile-name-row { margin-top: 36px; }
.profile-name-row h2 { margin: 0; font-size: clamp(24px, 4vw, 32px); line-height: 1.1; }

.profile-bio { display: grid; gap: 6px; }
.profile-panel-title { margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: .04em; color: #64748b; font-weight: 700; }
.profile-field-head { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: 8px; }
.profile-inline-edit-btn { width: 20px; height: 20px; border-radius: 999px; border: 1px solid var(--line); background: #fff; color: #5f7194; display: grid; place-items: center; cursor: pointer; padding: 0; }
.profile-inline-edit-btn .icon,.profile-inline-edit-btn .icon svg { width: 11px; height: 11px; }
.profile-inline-edit-btn.is-open { color: #1d4ed8; }
.profile-bio-label { margin: 0; color: #475569; font-size: 16px; font-weight: 500; }
.profile-inline-input { max-width: 560px; margin-top: 0; min-width: 0; }
.profile-dob-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px; max-width: 560px; }
.profile-field-label { font-size: 12px; color: #64748b; margin-top: 2px; }
.profile-inline-editor { display: grid; gap: 6px; margin: 2px 0 0 84px; max-width: 560px; }
.profile-inline-editor[hidden] { display: none; }
.profile-inline-actions { display: flex; gap: 6px; align-items: center; }
.profile-form-grid { display: grid; gap: 8px; max-width: 520px; }

.profile-body-flat { display: grid; gap: 8px; margin-top: 4px; }
.profile-snapshot { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px; }
.profile-snapshot-item { border: 1px solid var(--line); border-radius: 4px; padding: 6px; background: #fff; display: grid; gap: 2px; }
.profile-snapshot-label { margin: 0; font-size: 11px; letter-spacing: .02em; text-transform: uppercase; color: #64748b; font-weight: 700; }
.profile-snapshot-value { margin: 0; font-size: 14px; line-height: 1.25; color: #0f172a; font-weight: 600; word-break: break-word; }

.profile-tabs { display: flex; gap: 10px; border-bottom: 1px solid var(--line); }
.profile-tab { border: 0; background: transparent; padding: 7px 2px; color: #475569; font-size: 14px; font-weight: 600; border-bottom: 2px solid transparent; cursor: pointer; }
.profile-tab.is-active { color: #1d4ed8; border-bottom-color: #1d4ed8; }
.profile-tab-panel[hidden] { display: none; }
.profile-upload-status,.profile-inline-status { margin: 0; font-size: 12px; min-height: 16px; }
.profile-upload-status[data-tone="error"],.profile-inline-status[data-tone="error"] { color: #991b1b; }

.profile-grid-flat { display: grid; gap: 10px; }
.profile-form-actions { display: flex; justify-content: flex-end; gap: 6px; }
.profile-fixed-value { margin: 0; color: #0f172a; font-size: 16px; line-height: 1.25; font-weight: 600; }
.profile-readonly-row { display: grid; gap: 2px; border-bottom: 1px solid #e2e8f0; padding: 2px 0 8px; }
.profile-readonly-row .muted { margin: 0; }

.profile-photo-modal-card { max-width: min(860px, 96vw); }
.profile-photo-modal-image { border-radius: 6px; overflow: hidden; background: #0f172a0d; max-height: 75vh; }
.profile-photo-modal-image img { width: 100%; height: auto; display: block; }

@media (max-width: 840px) {
  .profile-avatar-row { left: 8px; bottom: -34px; }
  .profile-avatar-shell { width: 94px; height: 94px; font-size: 22px; }
  .profile-name-row { margin-top: 26px; }
  .profile-photo-actions { min-width: 170px; }
  .profile-grid-flat { gap: 8px; }
  .profile-dob-grid,.profile-snapshot { grid-template-columns: 1fr; }
  .profile-inline-editor { margin-left: 0; }
  .profile-field-head { display: flex; align-items: center; gap: 4px; flex-wrap: nowrap; }
  .profile-bio-label,.profile-fixed-value { font-size: 14px; line-height: 1.15; white-space: nowrap; }
  .profile-inline-edit-btn { width: 18px; height: 18px; flex: 0 0 auto; }
  .profile-inline-edit-btn .icon,.profile-inline-edit-btn .icon svg { width: 10px; height: 10px; }
  .profile-fixed-value { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
}
`;
