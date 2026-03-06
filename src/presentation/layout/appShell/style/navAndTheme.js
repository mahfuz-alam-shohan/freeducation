export const APP_SHELL_STYLE_NAV_THEME = `
.app-icon{width:17px;height:17px;display:inline-block;flex:0 0 auto}
.app-nav-desktop,.app-nav-mobile{display:block;min-width:0}
.app-nav{display:grid;gap:var(--space-2);align-content:start}
.app-nav-section{display:grid;gap:var(--space-1)}
.app-nav-title{margin:0;padding:0 4px;font-size:.7rem;letter-spacing:.08em;text-transform:uppercase;color:var(--text-muted)}
.app-nav-links{display:grid;gap:var(--space-1)}
.app-nav a{padding:var(--space-2) var(--space-3);border-radius:var(--radius-sm);color:var(--text-muted);display:flex;align-items:center;gap:var(--space-2);transition:background .22s ease,color .22s ease,transform .42s var(--motion-spring),opacity .42s ease,box-shadow .3s ease,border-color .2s ease;opacity:.92;transform:translateX(-3px);border:1px solid transparent}
.app-nav a .app-nav-icon{display:inline-grid;place-items:center;width:24px;height:24px;flex:0 0 24px;border-radius:7px;background:color-mix(in srgb,var(--surface-soft) 86%,transparent);color:var(--nav-icon-color,var(--text-muted))}
.app-nav a .app-nav-icon .app-icon{width:16px;height:16px;display:block;stroke:currentColor}
.app-nav a .app-nav-label{min-width:0}
.app-nav a[data-nav-key='home']{--nav-icon-color:#2d88ff}
.app-nav a[data-nav-key='social']{--nav-icon-color:#1fb774}
.app-nav a[data-nav-key='results']{--nav-icon-color:#f2a531}
.app-nav a[data-nav-key='login']{--nav-icon-color:#2d88ff}
.app-nav a[data-nav-key='dashboard']{--nav-icon-color:#6f7dff}
.app-nav a[data-nav-key='users']{--nav-icon-color:#14a9cf}
.app-nav a[data-nav-key='file-manager']{--nav-icon-color:#f2994a}
.app-nav a[data-nav-key='templates']{--nav-icon-color:#9a63ff}
.app-nav a[data-nav-key='subjects']{--nav-icon-color:#22b476}
.app-nav a[data-nav-key='classes']{--nav-icon-color:#ea5a5a}
.app-nav a.active,.app-nav a:hover{background:var(--surface);color:var(--text);transform:translateX(0);box-shadow:0 5px 14px color-mix(in srgb,var(--accent) 16%,transparent)}
.app-nav a.active .app-nav-icon,.app-nav a:hover .app-nav-icon{background:color-mix(in srgb,var(--nav-icon-color) 18%,var(--surface-soft))}
.app-nav a.app-nav-highlight{color:color-mix(in srgb,var(--accent) 70%,#fff);border-color:color-mix(in srgb,var(--accent) 40%,var(--border));background:color-mix(in srgb,var(--accent) 16%,var(--surface-soft));box-shadow:0 0 0 1px color-mix(in srgb,var(--accent) 18%,transparent)}
.app-nav a.app-nav-highlight.active,.app-nav a.app-nav-highlight:hover{background:color-mix(in srgb,var(--accent) 25%,var(--surface));color:var(--text)}
.app-mobile-nav{position:fixed;left:0;right:0;bottom:0;z-index:var(--z-mobile-nav);display:grid;grid-template-columns:repeat(var(--app-mobile-nav-cols,4),minmax(0,1fr));gap:6px;padding:7px calc(8px + env(safe-area-inset-right,0px)) calc(7px + env(safe-area-inset-bottom,0px)) calc(8px + env(safe-area-inset-left,0px));background:linear-gradient(180deg,color-mix(in srgb,var(--surface-strong) 88%,transparent),var(--surface-strong));border-top:1px solid var(--border);backdrop-filter:blur(14px)}
.app-mobile-nav-link{appearance:none;-webkit-appearance:none;text-decoration:none;color:var(--text-muted);display:grid;justify-items:center;align-content:center;gap:2px;min-height:52px;padding:4px 2px;border-radius:12px;border:1px solid transparent;background:transparent;font-size:.66rem;font-weight:700;line-height:1.1;letter-spacing:.02em;cursor:pointer}
.app-mobile-nav-icon{display:grid;place-items:center;width:24px;height:24px;border-radius:8px;background:color-mix(in srgb,var(--surface-soft) 90%,transparent);color:var(--mobile-nav-color,var(--text-muted))}
.app-mobile-nav-icon .app-icon{width:16px;height:16px;stroke-width:1.9}
.app-mobile-nav-label{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding-inline:2px}
.app-mobile-nav-link[data-nav-key='home']{--mobile-nav-color:#2d88ff}
.app-mobile-nav-link[data-nav-key='social']{--mobile-nav-color:#1fb774}
.app-mobile-nav-link[data-nav-key='results']{--mobile-nav-color:#f2a531}
.app-mobile-nav-link[data-nav-key='menu']{--mobile-nav-color:#6f7dff}
.app-mobile-nav-link.active{color:var(--text);border-color:color-mix(in srgb,var(--mobile-nav-color) 44%,var(--border));background:color-mix(in srgb,var(--mobile-nav-color) 12%,var(--surface-soft))}
.app-mobile-nav-link.active .app-mobile-nav-icon{background:color-mix(in srgb,var(--mobile-nav-color) 20%,var(--surface-soft))}
body.menu-open .app-mobile-nav-menu{color:var(--text);border-color:color-mix(in srgb,var(--mobile-nav-color) 44%,var(--border));background:color-mix(in srgb,var(--mobile-nav-color) 12%,var(--surface-soft))}
body.menu-open .app-mobile-nav-menu .app-mobile-nav-icon{background:color-mix(in srgb,var(--mobile-nav-color) 20%,var(--surface-soft))}
.app-mobile-nav-link:focus-visible{outline:2px solid var(--accent);outline-offset:1px}
.app-mobile-nav-menu{font:inherit}
.app-theme-wrap{border-top:1px solid var(--border);padding-top:var(--space-2)}
.app-theme-toggle{position:relative;isolation:isolate;width:100%;min-height:42px;border:1px solid var(--border);border-radius:var(--radius-md);background:var(--surface);color:var(--text);display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:var(--space-2);padding:var(--space-1) var(--space-2) var(--space-1) var(--space-2);cursor:pointer;font-size:.84rem;font-weight:600;letter-spacing:.02em;transition:background .2s ease,border-color .2s ease,transform .2s var(--motion-swift)}
.app-theme-toggle::before{content:'';position:absolute;inset:0;border-radius:inherit;background:linear-gradient(120deg,color-mix(in srgb,var(--accent) 18%,transparent),transparent 45%);opacity:0;transition:opacity .28s ease;z-index:-1}
.app-theme-toggle:hover{background:var(--surface-soft);border-color:color-mix(in srgb,var(--accent) 45%,var(--border))}
.app-theme-toggle:hover::before,.app-theme-toggle[data-theme-state='switching']::before{opacity:.9}
.app-theme-toggle:active{transform:scale(.985)}
.app-theme-orb{position:relative;display:inline-grid;place-items:center;width:30px;height:30px;border-radius:999px;border:1px solid color-mix(in srgb,var(--accent) 55%,var(--border));background:color-mix(in srgb,var(--surface) 78%,var(--accent) 22%);overflow:hidden;transition:transform .36s var(--motion-smooth),background .28s ease,border-color .22s ease}
.app-theme-orb svg{position:absolute;width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;transition:opacity .3s ease,transform .34s var(--motion-smooth),filter .28s ease}
.app-theme-sun{color:var(--accent);opacity:0;transform:scale(.52) rotate(-38deg);filter:blur(2px)}
.app-theme-moon{color:var(--text);opacity:1;transform:scale(1) rotate(0deg)}
body[data-theme='light'] .app-theme-orb{background:color-mix(in srgb,var(--surface) 74%,var(--accent) 26%)}
body[data-theme='light'] .app-theme-sun{opacity:1;transform:scale(1) rotate(0deg);filter:blur(0)}
body[data-theme='light'] .app-theme-moon{opacity:0;transform:scale(.58) rotate(36deg);filter:blur(2px)}
.app-theme-copy{display:grid;line-height:1.1;text-align:left;gap:2px;min-width:0}
.app-theme-copy > span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.app-theme-label{font-size:.74rem;letter-spacing:.06em;text-transform:uppercase;color:var(--text-muted);font-weight:700}
.app-theme-text{font-size:.86rem;color:var(--text)}
.app-theme-chip{justify-self:end;min-width:62px;padding:4px 8px;border-radius:999px;background:var(--surface-soft);border:1px solid var(--border);color:var(--text-muted);font-size:.68rem;letter-spacing:.08em;text-transform:uppercase;text-align:center;transition:background .22s ease,color .22s ease,border-color .22s ease}
.app-theme-toggle[data-theme-state='switching']{cursor:progress}
.app-theme-toggle[data-theme-state='switching'] .app-theme-chip{color:var(--text);border-color:color-mix(in srgb,var(--accent) 44%,var(--border));background:color-mix(in srgb,var(--accent) 18%,var(--surface-soft));animation:theme-chip-pulse .7s ease-in-out infinite}
.app-theme-toggle[data-theme-state='switching'] .app-theme-orb{animation:theme-orb-spin .9s var(--motion-swift) infinite}
@media (min-width:900px){
  .app-mobile-nav{display:none}
  .app-nav-mobile{display:none}
}
@media (max-width:899px){
  .app-nav-desktop{display:none}
}
`;
