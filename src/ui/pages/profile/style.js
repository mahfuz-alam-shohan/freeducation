export const PROFILE_STYLE = `
.profile-page{position:relative;display:grid;gap:10px}
.profile-page.is-loading{pointer-events:none}
.profile-page-loader{position:absolute;inset:0;z-index:5;display:grid;align-content:start;gap:10px;padding:0;opacity:0;pointer-events:none;transition:opacity .2s ease}
.profile-page.is-loading .profile-page-loader{opacity:1;pointer-events:auto}
.profile-loader-shimmer{position:relative;overflow:hidden;background:color-mix(in srgb,var(--surface-soft) 74%,var(--surface));border:1px solid var(--border);border-radius:10px}
.profile-loader-shimmer::after{content:'';position:absolute;inset:0;transform:translateX(-100%);background:linear-gradient(90deg,transparent,color-mix(in srgb,#fff 22%,transparent),transparent);animation:profileShimmer 1s linear infinite}
.profile-loader-block{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:10px}
.profile-loader-block-hero{padding:0;overflow:hidden}
.profile-loader-shimmer-cover{height:210px;border:none;border-radius:0}
.profile-loader-head{display:flex;align-items:flex-end;gap:12px;padding:0 12px 10px;margin-top:-42px}
.profile-loader-shimmer-avatar{width:108px;height:108px;border-radius:50%}
.profile-loader-lines{display:grid;gap:8px;padding-bottom:8px;flex:1}
.profile-loader-shimmer-line{height:14px;border-radius:6px}
.profile-loader-shimmer-line-title{max-width:170px}
.profile-loader-shimmer-line-subtitle{max-width:120px}
.profile-loader-block-tabs{display:grid;gap:8px}
.profile-loader-tabs-row{display:flex;gap:10px;padding-bottom:8px;border-bottom:1px solid var(--border)}
.profile-loader-shimmer-tab{height:30px;width:94px;border-radius:8px}
.profile-loader-shimmer-row{height:34px;border-radius:8px}
.profile-hero{background:var(--surface);border:1px solid var(--border);border-radius:10px;overflow:hidden;animation:fadeUp .32s ease}
.profile-cover{position:relative;height:210px;background:var(--surface-soft)}
.profile-cover-image{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.profile-head{position:relative;display:flex;align-items:flex-end;gap:12px;padding:0 12px 10px;margin-top:-42px;z-index:2}
.profile-avatar-wrap{position:relative;width:108px;height:108px;border-radius:50%;background:var(--surface-strong);border:3px solid var(--surface);display:grid;place-items:center;overflow:visible}
.profile-avatar-image{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:inherit}
.profile-avatar-fallback{font-size:1.5rem;font-weight:700}
.profile-inline-icon{width:18px;height:18px;display:block}
.profile-image-action{position:absolute;z-index:3;border:1px solid rgba(255,255,255,.65);background:rgba(20,20,20,.45);backdrop-filter:blur(2px);color:#fff;width:34px;height:34px;padding:0;cursor:pointer;display:grid;place-items:center;border-radius:999px;box-shadow:0 4px 10px rgba(0,0,0,.24);transition:transform .18s ease,background .18s ease}
.profile-image-action:hover{transform:scale(1.05)}
.profile-image-action:focus-visible{outline:2px solid var(--accent);outline-offset:2px;border-radius:6px}
.profile-image-action-cover{top:10px;right:10px}
.profile-image-action-cover:hover{background:rgba(20,20,20,.62)}
.profile-image-action-avatar{right:-2px;bottom:-2px;border-color:var(--surface);background:var(--surface-strong);color:var(--text)}
.profile-image-action-avatar:hover{background:var(--surface-soft)}
.profile-title h1{margin:0;font-size:1.3rem}
.profile-title p{margin:2px 0 0;color:var(--text-muted)}
.profile-tabs-card{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:10px;animation:fadeUp .4s ease}
.profile-tabs{position:relative;display:flex;gap:2px;border-bottom:1px solid var(--border);padding-bottom:0;margin-bottom:8px}
.profile-tab{position:relative;z-index:2;border:none;background:transparent;color:var(--text-muted);padding:7px 10px 9px;border-radius:0;cursor:pointer;font-weight:600;transition:color .18s ease}
.profile-tab:hover{color:var(--text)}
.profile-tab.is-active{color:var(--text)}
.profile-tab-indicator{position:absolute;left:0;bottom:-1px;height:2px;width:50%;background:var(--accent);border-radius:999px;transform:translateX(calc(var(--tab-index,0) * 100%));transition:transform .22s cubic-bezier(.22,.61,.36,1)}
.profile-panel{display:none;animation:panelIn .26s cubic-bezier(.22,.61,.36,1)}
.profile-panel.is-active{display:block}
.profile-panel[hidden]{display:none!important}
.profile-panel.is-leaving{display:block;animation:panelOut .16s ease forwards}
.profile-row{display:flex;justify-content:space-between;gap:8px;padding:8px 0;border-bottom:1px solid var(--border)}
.profile-row:last-child{border-bottom:0}
.profile-row span{color:var(--text-muted)}
.profile-open-password{border:1px solid var(--border);background:var(--surface-soft);padding:6px 10px;border-radius:6px;cursor:pointer}
.profile-password-form{display:grid;gap:8px;max-width:360px;margin-top:10px;animation:fadeUp .24s ease}
.profile-password-form[hidden]{display:none!important}
.profile-password-form label{display:grid;gap:4px;font-size:.92rem}
.profile-password-form input{background:var(--surface-strong);border:1px solid var(--border);border-radius:6px;padding:7px 8px;color:var(--text)}
.profile-password-form button,.profile-modal-card button{border:1px solid var(--border);background:var(--surface-soft);padding:7px 10px;border-radius:6px;color:var(--text);cursor:pointer}
.profile-msg{min-height:1.2em;color:var(--text-muted);margin:8px 0 0}
.profile-modal{border:none;padding:0;background:transparent}
.profile-modal::backdrop{background:var(--overlay)}
.profile-modal-card{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:12px;min-width:min(92vw,380px);display:grid;gap:8px}
.profile-modal-large{min-width:min(92vw,720px)}
.profile-modal-preview{width:100%;max-height:180px;object-fit:cover;border-radius:8px;border:1px solid var(--border);cursor:zoom-in}
.profile-upload-input{display:inline-flex;align-items:center;gap:6px;border:1px dashed var(--border);padding:7px;border-radius:8px;cursor:pointer}
.profile-upload-input input{display:none}
.profile-upload-progress{display:grid;gap:4px}
.profile-upload-progress[hidden]{display:none!important}
.profile-upload-progress p{margin:0;font-size:.88rem;color:var(--text-muted)}
.profile-upload-progress progress{width:100%;height:8px}
.profile-modal-actions{display:flex;justify-content:flex-end;gap:6px}
.profile-big-preview{width:100%;max-height:72vh;object-fit:contain;background:var(--surface-strong);border-radius:8px}
@keyframes fadeUp{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}
@keyframes panelIn{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}
@keyframes panelOut{from{opacity:1;transform:none}to{opacity:0;transform:translateY(-4px)}}
@keyframes profileShimmer{100%{transform:translateX(100%)}}
`;
