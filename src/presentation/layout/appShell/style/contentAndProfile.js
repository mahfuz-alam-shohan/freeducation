export const APP_SHELL_STYLE_CONTENT = `
.app-avatar{display:inline-flex;align-items:center;justify-content:center;width:42px;height:42px;border-radius:12px;border:2px solid #1b67c8;background:#2f8cff;color:#f7fbff;font-size:.8rem;font-weight:700;cursor:pointer;letter-spacing:.02em;transition:transform .2s ease,background .2s ease,border-color .2s ease;overflow:hidden;padding:0;position:relative;box-shadow:0 8px 18px color-mix(in srgb,#2f8cff 35%,transparent)}
.app-avatar [hidden]{display:none!important}
.app-avatar-image{width:100%;height:100%;object-fit:cover;display:block}
.app-avatar-fallback{display:inline-flex;align-items:center;justify-content:center;width:100%;height:100%}
.app-avatar-loader{position:absolute;inset:0;border-radius:inherit;pointer-events:none;opacity:0;transition:opacity .2s ease;background:linear-gradient(90deg,var(--surface-soft),color-mix(in srgb,var(--accent) 22%,var(--surface-soft)),var(--surface-soft));background-size:220% 100%}
.app-avatar.is-loading .app-avatar-loader{opacity:1;animation:avatar-skeleton 1s linear infinite}
.app-avatar:hover{background:#4b9bff;border-color:#1559b0}
.app-avatar:active{transform:scale(.96)}
.app-logout{display:none;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--surface);color:var(--text);padding:5px var(--space-3);cursor:pointer;white-space:nowrap;align-items:center;gap:var(--space-2);font-size:.84rem;transition:background .2s ease}
.app-logout:hover{background:var(--surface-soft)}
.app-profile-pop{position:absolute;right:0;top:calc(100% + var(--space-3));width:min(280px,86vw);padding:var(--space-3);border-radius:var(--radius-md);border:1px solid var(--border);background:var(--surface-strong);box-shadow:0 14px 38px rgba(0,0,0,.24);display:grid;gap:var(--space-2);opacity:0;transform:translateY(-8px);pointer-events:none;transition:opacity .22s ease,transform .24s ease;z-index:60}
.app-profile-name{margin:0;font-weight:650;font-size:.9rem;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.app-profile-email{margin:0;font-size:.78rem;color:var(--text-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.app-profile-divider{height:1px;background:var(--border)}
.app-profile-logout,.app-profile-login{height:32px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--surface);color:var(--text);display:inline-flex;align-items:center;justify-content:center;gap:var(--space-2);cursor:pointer;font-size:.84rem}
.app-profile-logout:hover,.app-profile-login:hover{background:var(--surface-soft)}
.app-profile-help{margin:0;font-size:.78rem;color:var(--text-muted);line-height:1.35}
body.profile-open .app-profile-pop{opacity:1;transform:translateY(0);pointer-events:auto}
.app-content{padding:var(--space-2);padding-bottom:calc(var(--space-2) + var(--layout-mobile-nav-offset));display:grid;gap:var(--space-2);align-content:start;transition:opacity .2s ease;min-height:200px;min-width:0;overflow-x:clip}
.app-content > *{transform-origin:50% 0;width:100%!important;max-width:none!important;margin-left:0!important;margin-right:0!important;min-width:0}
.app-content > *:nth-child(1){--content-seq:1}.app-content > *:nth-child(2){--content-seq:2}.app-content > *:nth-child(3){--content-seq:3}.app-content > *:nth-child(4){--content-seq:4}.app-content > *:nth-child(5){--content-seq:5}.app-content > *:nth-child(n+6){--content-seq:6}
html.app-view-transitioning .app-content,
html.app-view-transitioning .app-content > *{
  animation:none !important;
  transform:none !important;
  filter:none !important;
}
body.app-navigating .app-content,
body.app-navigating .app-content > *{
  animation:none !important;
  transform:none !important;
}
.app-content.app-content-flush{padding:0;gap:0}
.app-footer{padding:var(--space-2) var(--space-2) calc(var(--space-2) + var(--layout-mobile-nav-offset));border-top:1px solid var(--border);color:var(--text-muted);background:var(--surface-strong);font-size:.8rem;min-width:0}
.app-status-toast{position:fixed;left:50%;bottom:calc(16px + var(--layout-mobile-nav-offset));transform:translate(-50%,20px);min-width:min(320px,88vw);max-width:min(440px,92vw);padding:10px 12px;border-radius:10px;border:1px solid var(--border);background:color-mix(in srgb,var(--surface) 92%,transparent);color:var(--text);opacity:0;pointer-events:none;transition:opacity .3s ease,transform .3s ease;z-index:var(--z-toast);box-shadow:0 12px 30px rgba(0,0,0,.2)}
.app-status-toast.is-visible{opacity:1;transform:translate(-50%,0)}
.app-status-toast[data-status='error']{border-color:#c76167;color:#ffd8dc}
.app-status-toast[data-status='success']{border-color:color-mix(in srgb,var(--accent) 55%,var(--border))}
.app-notifications-overlay{position:fixed;inset:0;background:var(--overlay);opacity:0;visibility:hidden;pointer-events:none;transition:opacity .22s ease,visibility .22s step-end;z-index:calc(var(--z-notifications) - 1)}
.app-notifications-panel{position:fixed;right:0;top:var(--layout-header-offset-mobile);height:calc(100vh - var(--layout-header-offset-mobile));height:calc(100dvh - var(--layout-header-offset-mobile));width:min(400px,100vw);max-width:100vw;border-left:1px solid var(--border);background:linear-gradient(180deg,color-mix(in srgb,var(--surface-strong) 96%,#fff 4%),var(--surface-strong));padding:var(--space-3);display:grid;grid-template-rows:auto auto minmax(0,1fr);gap:var(--space-2);transform:translateX(104%);transition:transform .32s var(--motion-spring);z-index:var(--z-notifications)}
.app-notifications-head{display:flex;align-items:center;justify-content:space-between;gap:var(--space-2);padding-bottom:var(--space-1);border-bottom:1px solid var(--border)}
.app-notifications-head h2{margin:0;font-size:1rem;font-weight:700}
.app-notifications-close{display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:999px;border:1px solid var(--border);background:var(--surface);color:var(--text);cursor:pointer}
.app-notifications-close .app-icon{width:14px;height:14px}
.app-notifications-close:hover{background:var(--surface-soft);border-color:color-mix(in srgb,var(--accent) 30%,var(--border))}
.app-notifications-loading,.app-notifications-empty,.app-notifications-error{margin:0;color:var(--text-muted);font-size:.84rem}
.app-notifications-list{display:grid;align-content:start;gap:7px;min-height:0;overflow:auto;padding-right:2px}
.app-notification-item{position:relative;display:grid;grid-template-columns:38px minmax(0,1fr) auto;gap:10px;align-items:start;padding:10px;border:1px solid var(--border);border-radius:12px;text-decoration:none;color:var(--text);background:var(--surface);transition:background .16s ease,border-color .16s ease}
.app-notification-item:hover,.app-notification-item:focus-visible{background:color-mix(in srgb,var(--surface-soft) 82%,var(--surface));border-color:color-mix(in srgb,var(--accent) 18%,var(--border))}
.app-notification-item.is-unread{background:color-mix(in srgb,var(--accent) 9%,var(--surface));border-color:color-mix(in srgb,var(--accent) 40%,var(--border))}
.app-notification-item.is-unread::before{content:'';position:absolute;left:0;top:10px;bottom:10px;width:3px;border-radius:999px;background:var(--accent)}
.app-notification-item.is-read{opacity:.94}
.app-notification-avatar{width:38px;height:38px;min-width:38px;min-height:38px;border-radius:999px;overflow:hidden;border:1px solid color-mix(in srgb,var(--border) 70%,var(--accent) 30%);display:grid;place-items:center;background:var(--surface-soft);color:var(--text-muted);font-size:.8rem;font-weight:700}
.app-notification-avatar img{display:block;width:100%;height:100%;object-fit:cover}
.app-notification-body{display:grid;gap:2px;min-width:0}
.app-notification-text{font-size:.86rem;line-height:1.34;overflow-wrap:anywhere}
.app-notification-item.is-unread .app-notification-text{font-weight:700}
.app-notification-item.is-read .app-notification-text{font-weight:600}
.app-notification-preview{font-size:.78rem;color:var(--text-muted);line-height:1.25;overflow-wrap:anywhere}
.app-notification-time{font-size:.74rem;color:var(--text-muted);letter-spacing:.01em}
.app-notification-unread-dot{display:inline-flex;align-self:center;justify-self:end;width:9px;height:9px;border-radius:999px;background:var(--accent)}
body.notifications-open .app-notifications-overlay{opacity:1;visibility:visible;pointer-events:auto;transition:opacity .22s ease,visibility .22s step-start}
body.notifications-open .app-notifications-panel{transform:translateX(0)}
body.menu-open{overflow:hidden}
body.notifications-open{overflow:hidden}
body.menu-open .app-nav-overlay{opacity:1;visibility:visible;pointer-events:auto;transition:opacity .2s ease,visibility .2s step-start}
body.menu-open .app-sidebar{transform:translate3d(0,0,0)}
body.menu-open .app-nav a{animation:menu-item-in .56s cubic-bezier(.18,.75,.25,1) both}
body.app-navigating .app-content{opacity:1}
.app-logout:focus-visible,.app-nav a:focus-visible,.app-menu-toggle:focus-visible,.app-avatar:focus-visible,.app-profile-logout:focus-visible,.app-theme-toggle:focus-visible,.app-notify-toggle:focus-visible,.app-notifications-close:focus-visible{outline:2px solid var(--accent);outline-offset:1px}
@media (min-width:900px){
  .app-content{padding-bottom:var(--space-3)}
  .app-footer{padding-bottom:var(--space-3)}
  .app-status-toast{bottom:16px}
  .app-notifications-panel{top:var(--layout-header-offset-desktop);height:calc(100vh - var(--layout-header-offset-desktop));height:calc(100dvh - var(--layout-header-offset-desktop))}
  .app-notifications-overlay{inset:var(--layout-header-offset-desktop) 0 0 0}
}
`;
