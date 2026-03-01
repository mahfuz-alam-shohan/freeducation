export const APP_SHELL_STYLE_HEADER = `
.app-header{position:sticky;top:0;z-index:var(--z-header);grid-column:1 / -1;grid-row:1;display:flex;align-items:center;justify-content:space-between;gap:var(--space-2);padding:0 var(--space-2);block-size:var(--layout-header-h-mobile);box-sizing:border-box;background:color-mix(in srgb,var(--surface-strong) 92%,transparent);backdrop-filter:blur(8px);border-bottom:var(--layout-border-size) solid var(--border);transition:border-color .25s ease;overflow:visible}
.app-header::after{content:'';position:absolute;inset:auto 0 0;height:1px;background:radial-gradient(circle at var(--pointer-x) 50%,color-mix(in srgb,var(--accent) 70%,transparent),transparent 55%);opacity:.58;pointer-events:none;transition:opacity .28s ease}
.app-header-left{display:flex;align-items:center;gap:var(--space-2);min-width:0;flex:1}
.app-header-center{display:flex;align-items:center;justify-content:center;min-width:0;flex:1}
.app-header-center:empty{display:none}
.app-menu-toggle{display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:8px;border:1px solid var(--border);background:var(--surface);color:var(--text);cursor:pointer;transition:background .25s ease,transform .2s ease}
.app-menu-toggle:hover{background:var(--surface-soft)}
.app-menu-toggle:active{transform:scale(.96)}
body.menu-open .app-menu-toggle{transform:rotate(180deg)}
.app-brand{display:inline-flex;align-items:center;justify-content:center;width:auto;min-width:0;max-width:62vw;height:46px;max-height:50px}
.app-brand.app-brand-signature{position:relative;display:inline-flex;align-items:center;justify-content:center;padding:0;color:var(--accent);user-select:none;border:0;background:none;cursor:pointer}
.app-brand-signature .site-logo{width:clamp(136px,19vw,184px);max-width:100%}
.app-brand-signature .site-logo-svg{filter:drop-shadow(0 3px 9px color-mix(in srgb,var(--accent) 40%,transparent))}
.app-header-right{display:flex;align-items:center;gap:var(--space-2);position:relative;z-index:1}
.app-notify-toggle{display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:999px;border:1px solid var(--border);background:var(--surface);color:var(--text-muted);cursor:pointer;transition:background .2s ease,color .2s ease,border-color .2s ease,transform .2s ease}
.app-notify-toggle .app-icon{width:17px;height:17px}
.app-notify-toggle:hover{background:var(--surface-soft);color:var(--text);border-color:color-mix(in srgb,var(--accent) 30%,var(--border))}
.app-notify-toggle:active{transform:scale(.96)}
body.notifications-open .app-notify-toggle{color:var(--text);border-color:var(--accent);background:color-mix(in srgb,var(--surface-soft) 88%,var(--accent) 12%)}
.app-user-meta{display:none;min-width:0;text-align:right;line-height:1.2}
.app-user-name{display:block;font-size:.78rem;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:190px}
.app-user-email{display:block;font-size:.73rem;color:var(--text-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:190px}
.app-nav-overlay{position:fixed;inset:0;background:transparent;opacity:0;visibility:hidden;transition:visibility .2s step-end;z-index:var(--z-overlay)}
.app-sidebar{position:fixed;z-index:var(--z-sidebar);left:0;top:var(--layout-header-offset-mobile);height:calc(100vh - var(--layout-header-offset-mobile));height:calc(100dvh - var(--layout-header-offset-mobile));width:min(264px,86vw);max-width:100vw;background:var(--surface-strong);border-right:var(--layout-border-size) solid var(--border);padding:var(--space-3);display:grid;grid-template-rows:1fr auto;gap:var(--space-2);transform:translate3d(-102%,0,0);transition:transform .42s var(--motion-spring),border-color .24s ease;will-change:transform;overflow:auto;overscroll-behavior:contain;contain:paint}
.app-sidebar::before{content:'';position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at var(--pointer-x) var(--pointer-y),color-mix(in srgb,var(--accent) 18%,transparent),transparent 60%);opacity:.6;transition:opacity .26s ease}
`;
