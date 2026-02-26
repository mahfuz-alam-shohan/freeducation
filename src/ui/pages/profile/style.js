export const PROFILE_STYLE = `
.profile-page{display:grid;gap:12px}
.profile-hero{background:var(--surface);border:1px solid var(--border);border-radius:10px;overflow:hidden;animation:fadeUp .32s ease}
.profile-cover{position:relative;height:210px;background:var(--surface-soft);display:flex;align-items:flex-start;justify-content:flex-end;padding:8px;cursor:pointer}
.profile-cover-image{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.profile-head{position:relative;display:flex;align-items:flex-end;gap:12px;padding:0 12px 10px;margin-top:-42px;z-index:2}
.profile-avatar-wrap{position:relative;width:108px;height:108px;border-radius:50%;background:var(--surface-strong);border:3px solid var(--surface);display:grid;place-items:center;overflow:hidden;cursor:pointer}
.profile-avatar-image{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.profile-avatar-fallback{font-size:1.5rem;font-weight:700}
.profile-image-action{position:relative;z-index:2;border:1px solid var(--border);background:var(--surface);padding:4px 8px;border-radius:6px;cursor:pointer}
.profile-image-action-avatar{position:absolute;right:2px;bottom:2px;padding:4px 6px}
.profile-title h1{margin:0;font-size:1.3rem}
.profile-title p{margin:2px 0 0;color:var(--text-muted)}
.profile-tabs-card{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:10px;animation:fadeUp .4s ease}
.profile-tabs{display:flex;gap:6px;border-bottom:1px solid var(--border);padding-bottom:8px;margin-bottom:8px}
.profile-tab{border:1px solid var(--border);background:var(--surface-soft);padding:5px 10px;border-radius:6px;cursor:pointer}
.profile-tab.is-active{background:color-mix(in srgb,var(--accent) 30%,var(--surface-soft));border-color:color-mix(in srgb,var(--accent) 55%,var(--border))}
.profile-panel{display:none;animation:slideIn .28s ease}
.profile-panel.is-active{display:block}
.profile-row{display:flex;justify-content:space-between;gap:8px;padding:8px 0;border-bottom:1px solid var(--border)}
.profile-row:last-child{border-bottom:0}
.profile-row span{color:var(--text-muted)}
.profile-open-password{border:1px solid var(--border);background:var(--surface-soft);padding:6px 10px;border-radius:6px;cursor:pointer}
.profile-password-form{display:grid;gap:8px;max-width:360px;margin-top:10px;animation:fadeUp .24s ease}
.profile-password-form label{display:grid;gap:4px;font-size:.92rem}
.profile-password-form input{background:var(--surface-strong);border:1px solid var(--border);border-radius:6px;padding:7px 8px;color:var(--text)}
.profile-password-form button,.profile-modal-card button{border:1px solid var(--border);background:var(--surface-soft);padding:7px 10px;border-radius:6px;color:var(--text);cursor:pointer}
.profile-msg{min-height:1.2em;color:var(--text-muted);margin:8px 0 0}
.profile-modal{border:none;padding:0;background:transparent}
.profile-modal::backdrop{background:var(--overlay)}
.profile-modal-card{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:12px;min-width:min(92vw,380px);display:grid;gap:8px}
.profile-modal-large{min-width:min(92vw,720px)}
.profile-modal-preview{width:100%;max-height:180px;object-fit:cover;border-radius:8px;border:1px solid var(--border)}
.profile-upload-input{display:inline-flex;align-items:center;gap:6px;border:1px dashed var(--border);padding:7px;border-radius:8px;cursor:pointer}
.profile-upload-input input{display:none}
.profile-modal-actions{display:flex;justify-content:flex-end;gap:6px}
.profile-big-preview{width:100%;max-height:72vh;object-fit:contain;background:var(--surface-strong);border-radius:8px}
@keyframes fadeUp{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}
@keyframes slideIn{from{opacity:0;transform:translateX(8px)}to{opacity:1;transform:none}}
`;
