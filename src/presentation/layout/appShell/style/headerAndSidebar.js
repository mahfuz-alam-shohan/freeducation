export const APP_SHELL_STYLE_HEADER = `
.app-header{position:sticky;top:0;z-index:var(--z-header);grid-column:1 / -1;grid-row:1;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:0 12px;block-size:var(--layout-header-h-mobile);box-sizing:border-box;background:var(--surface-strong);backdrop-filter:none;border-bottom:var(--layout-border-size) solid var(--border);border-radius:0 0 14px 14px;box-shadow:none;transition:border-color .25s ease;overflow:visible}
.app-header-left{display:flex;align-items:center;gap:var(--space-2);min-width:0;flex:1}
.app-header-center{display:flex;align-items:center;justify-content:center;min-width:0;flex:1}
.app-header-center:empty{display:none}
.app-menu-toggle{display:inline-flex;align-items:center;justify-content:center;width:42px;height:42px;border-radius:12px;border:2px solid #1664c2;background:#1f6fd8;color:#f7fbff;cursor:pointer;transition:background .25s ease,transform .2s ease,border-color .2s ease}
.app-menu-toggle .app-icon{width:20px;height:20px;stroke-width:2}
.app-menu-toggle:hover{background:#2b7fe9;border-color:#1a6bcb}
.app-menu-toggle:active{transform:scale(.96)}
body.menu-open .app-menu-toggle{transform:rotate(180deg)}
.app-brand{display:inline-flex;align-items:center;justify-content:center;width:auto;min-width:0;max-width:62vw;height:52px;max-height:52px}
.app-brand.app-brand-signature{position:relative;display:inline-flex;align-items:center;justify-content:center;padding:0;color:var(--accent);user-select:none;border:0;background:none;cursor:pointer}
.app-brand-signature .site-logo{width:clamp(108px,14vw,150px);max-width:100%}
.app-brand-signature .site-logo-svg{filter:drop-shadow(0 3px 9px color-mix(in srgb,var(--accent) 40%,transparent))}
.app-header-right{display:flex;align-items:center;gap:var(--space-2);position:relative;z-index:1}
.app-notify-toggle{display:inline-flex;align-items:center;justify-content:center;width:42px;height:42px;border-radius:12px;border:2px solid #d58a17;background:#ffb23f;color:#1a2432;cursor:pointer;transition:background .2s ease,color .2s ease,border-color .2s ease,transform .2s ease;position:relative;box-shadow:0 6px 14px rgba(255,178,63,.28)}
.app-notify-toggle .app-icon{width:20px;height:20px;stroke-width:2}
.app-notify-toggle:hover{background:#ffc05f;color:#132033;border-color:#c87f10}
.app-notify-toggle:active{transform:scale(.96)}
.app-notify-toggle.has-unread::after{content:attr(data-unread-label);position:absolute;top:-7px;right:-7px;min-width:18px;height:18px;padding:0 5px;border-radius:999px;background:#e41e3f;color:#fff;border:2px solid var(--surface-strong);display:inline-flex;align-items:center;justify-content:center;font-size:.63rem;font-weight:800;line-height:1;letter-spacing:.01em}
.app-notify-toggle.has-unseen::before{content:'';position:absolute;top:3px;right:3px;width:7px;height:7px;border-radius:999px;background:#ffffff;opacity:.92}
body.notifications-open .app-notify-toggle{color:#132033;border-color:#b8750f;background:#ffc86d}
.app-user-meta{display:none;min-width:0;text-align:right;line-height:1.2}
.app-user-name{display:block;font-size:.78rem;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:190px}
.app-user-email{display:block;font-size:.73rem;color:var(--text-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:190px}
.app-nav-overlay{position:fixed;inset:0;background:transparent;opacity:0;visibility:hidden;transition:visibility .2s step-end;z-index:var(--z-overlay)}
.app-sidebar{position:fixed;z-index:var(--z-sidebar);left:0;top:var(--layout-header-offset-mobile);height:calc(100vh - var(--layout-header-offset-mobile));height:calc(100dvh - var(--layout-header-offset-mobile));width:min(264px,86vw);max-width:100vw;background:var(--surface-strong);border-right:var(--layout-border-size) solid var(--border);padding:var(--space-3);display:grid;grid-template-rows:1fr auto;gap:var(--space-2);transform:translate3d(-102%,0,0);transition:transform .42s var(--motion-spring),border-color .24s ease;will-change:transform;overflow:auto;overscroll-behavior:contain;contain:paint}
.app-sidebar::before{content:'';position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at var(--pointer-x) var(--pointer-y),color-mix(in srgb,var(--accent) 18%,transparent),transparent 60%);opacity:.6;transition:opacity .26s ease}
@media (max-width:899px){
  .app-brand{height:52px;max-height:52px}
  .app-brand-signature .site-logo{width:clamp(124px,40vw,176px)}
}
`;
