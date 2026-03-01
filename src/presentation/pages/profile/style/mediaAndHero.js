export const PROFILE_STYLE_MEDIA = `
.profile-hero{position:relative;background:var(--surface);border:1px solid var(--border);border-radius:10px;overflow:visible;animation:fadeUp calc(.42s * var(--profile-motion-scale)) cubic-bezier(.22,.61,.36,1);transform-origin:50% 0}
.profile-viewing-badge{position:absolute;top:10px;left:10px;z-index:4;margin:0;padding:5px 10px;border:1px solid color-mix(in srgb,var(--accent) 36%,var(--border));border-radius:999px;background:color-mix(in srgb,var(--surface) 84%,transparent);backdrop-filter:blur(3px);font-size:.78rem;font-weight:600;color:var(--text)}
.profile-cover{position:relative;height:170px;background:var(--surface-soft);border-radius:10px 10px 0 0;overflow:hidden}
.profile-cover::after,.profile-avatar-wrap::after{content:'';position:absolute;inset:0;background:linear-gradient(110deg,transparent 20%,color-mix(in srgb,#fff 24%,transparent) 45%,transparent 70%);transform:translateX(-130%);opacity:0;pointer-events:none}
.profile-cover.is-loading-media::after,.profile-avatar-wrap.is-loading-media::after{opacity:1;animation:profileMediaSweep 1.05s linear infinite}
.profile-cover-image{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.profile-cover-image,.profile-avatar-image{opacity:0;transform:scale(1.025);filter:blur(1.5px);transition:opacity calc(.52s * var(--profile-motion-scale)) ease,transform calc(.54s * var(--profile-motion-scale)) cubic-bezier(.2,.9,.3,1),filter calc(.4s * var(--profile-motion-scale)) ease}
.profile-cover-image.is-ready,.profile-avatar-image.is-ready{opacity:1;transform:scale(1);filter:blur(0)}
.profile-head{position:relative;display:flex;align-items:flex-end;gap:var(--space-3);padding:0 var(--space-3) var(--space-2);margin-top:-42px;z-index:2}
.profile-avatar-wrap{position:relative;width:108px;height:108px;border-radius:50%;background:var(--surface-strong);border:3px solid var(--surface);display:grid;place-items:center;overflow:visible;transition:transform calc(.42s * var(--profile-motion-scale)) cubic-bezier(.22,.82,.31,1),box-shadow calc(.3s * var(--profile-motion-scale)) ease}
.profile-avatar-image{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:inherit}
.profile-avatar-fallback{font-size:1.5rem;font-weight:700}
.profile-avatar-wrap:hover{transform:translateY(-1px) scale(1.01);box-shadow:0 8px 20px color-mix(in srgb,var(--accent) 14%,transparent)}
.profile-inline-icon{width:18px;height:18px;display:block}
.profile-image-action{position:absolute;z-index:3;border:1px solid rgba(255,255,255,.65);background:rgba(20,20,20,.45);backdrop-filter:blur(2px);color:#fff;width:34px;height:34px;padding:0;cursor:pointer;display:grid;place-items:center;border-radius:999px;box-shadow:0 4px 10px rgba(0,0,0,.24);transition:transform calc(.26s * var(--profile-motion-scale)) cubic-bezier(.22,.82,.31,1),background calc(.18s * var(--profile-motion-scale)) ease}
.profile-image-action:hover{transform:scale(1.05)}
.profile-image-action:focus-visible{outline:2px solid var(--accent);outline-offset:2px;border-radius:6px}
.profile-image-action-cover{top:10px;right:10px}
.profile-image-action-cover:hover{background:rgba(20,20,20,.62)}
.profile-image-action-avatar{right:-2px;bottom:-2px;border-color:var(--surface);background:var(--surface-strong);color:var(--text)}
.profile-image-action-avatar:hover{background:var(--surface-soft)}
.profile-page[data-read-only='1'] .profile-image-action,.profile-page[data-read-only='1'] .profile-image-menu,.profile-page[data-read-only='1'] .profile-media-progress{display:none!important}
.profile-image-menu{position:absolute;z-index:12;min-width:176px;display:grid;gap:var(--space-1);padding:var(--space-2);border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--surface);box-shadow:0 10px 24px rgba(0,0,0,.18);transform-origin:100% 0;opacity:0;transform:translateY(-8px) scale(.92);transition:opacity calc(.3s * var(--profile-motion-scale)) ease,transform calc(.42s * var(--profile-motion-scale)) cubic-bezier(.22,1.22,.33,1)}
.profile-image-menu[hidden]{display:none!important}
.profile-media-progress{position:absolute;left:10px;right:10px;bottom:10px;z-index:4;display:grid;gap:var(--space-1);background:color-mix(in srgb,var(--surface) 82%,transparent);border:1px solid var(--border);border-radius:var(--radius-sm);padding:var(--space-2) var(--space-3);backdrop-filter:blur(2px)}
.profile-media-progress[hidden]{display:none!important}
.profile-media-progress p{margin:0;font-size:.78rem;color:var(--text);line-height:1.2}
.profile-media-progress-track{height:8px;border-radius:999px;background:color-mix(in srgb,var(--surface-soft) 88%,var(--surface));overflow:hidden;border:1px solid var(--border)}
.profile-media-progress-track span{display:block;height:100%;width:0%;background:linear-gradient(90deg,var(--accent),color-mix(in srgb,var(--accent) 35%,#fff));transition:width .24s ease}
.profile-media-progress-avatar{left:-4px;right:-4px;bottom:-34px}
.profile-image-menu.is-open{opacity:1;transform:translateY(0) scale(1)}
.profile-image-menu.is-closing{opacity:0;transform:translateY(-6px) scale(.94)}
.profile-menu-btn{display:flex;align-items:center;justify-content:flex-start;border:1px solid var(--border);background:var(--surface-soft);padding:var(--space-2) var(--space-3);border-radius:6px;cursor:pointer;color:var(--text)}
.profile-menu-btn:hover{background:var(--surface-strong)}
.profile-title h1{margin:0;font-size:1.3rem}
.profile-title p{margin:2px 0 0;color:var(--text-muted)}
@media (max-width:767px){
  .profile-viewing-badge{top:8px;left:8px;font-size:.74rem;padding:4px 8px}
}
`;
