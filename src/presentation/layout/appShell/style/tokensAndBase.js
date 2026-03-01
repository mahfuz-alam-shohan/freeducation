export const APP_SHELL_STYLE_TOKENS = `
:root{color-scheme:dark;--bg:#0d1218;--surface:#151d27;--surface-soft:#121923;--surface-strong:#0f161f;--text:#edf2f8;--text-muted:#9eacbf;--border:#2a3748;--accent:#be7f42;--accent-ink:#1a1208;--overlay:rgba(6,8,12,.64);--motion-spring:cubic-bezier(.22,.82,.31,1);--motion-swift:cubic-bezier(.3,.7,.2,1);--motion-smooth:cubic-bezier(.22,.61,.36,1);--pointer-x:50%;--pointer-y:12%;--space-1:4px;--space-2:6px;--space-3:8px;--space-4:10px;--radius-sm:8px;--radius-md:10px;--layout-border-size:1px;--layout-header-h-mobile:56px;--layout-header-h-desktop:60px;--layout-header-offset-mobile:var(--layout-header-h-mobile);--layout-header-offset-desktop:var(--layout-header-h-desktop);--layout-sidebar-w:236px;--z-overlay:40;--z-sidebar:45;--z-header:50;--z-notifications:58;--z-toast:70;--page-content-max:1100px;--page-form-max:560px}
body[data-theme='light']{color-scheme:light;--bg:#f4f0e9;--surface:#fffdf9;--surface-soft:#f5f1ea;--surface-strong:#ece6dd;--text:#1f2022;--text-muted:#69727d;--border:#d5cec2;--accent:#93653a;--accent-ink:#fff8ef;--overlay:rgba(50,43,33,.2)}
html{font-size:15px}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--text);font:400 1rem/1.5 Inter,system-ui,sans-serif;transition:background .25s ease,color .25s ease;overflow-x:hidden}
button,input,select,textarea{font:inherit}
a{text-decoration:none;color:inherit}
::view-transition-old(root),::view-transition-new(root){animation-duration:.34s;animation-timing-function:cubic-bezier(.22,.61,.36,1)}
::view-transition-old(root){animation-name:page-out-forward}
::view-transition-new(root){animation-name:page-in-forward}
html[data-nav-motion='back']::view-transition-old(root){animation-name:page-out-back}
html[data-nav-motion='back']::view-transition-new(root){animation-name:page-in-back}
.app-shell{min-height:100vh;min-height:100dvh;display:grid;grid-template-columns:minmax(0,1fr);grid-template-rows:var(--layout-header-h-mobile) minmax(0,1fr) auto;position:relative;isolation:isolate;overflow-x:clip}
.app-shell::before{content:'';position:fixed;inset:0;pointer-events:none;opacity:0;background:radial-gradient(circle at 50% 0%,color-mix(in srgb,var(--accent) 20%,transparent),transparent 50%);transition:opacity .4s ease;z-index:20}
body.app-navigating .app-shell::before{opacity:.42}
`;
