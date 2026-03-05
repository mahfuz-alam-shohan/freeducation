export const APP_SHELL_STYLE_TOKENS = `
:root{color-scheme:dark;--bg:#18191a;--surface:#242526;--surface-soft:#2f3031;--surface-strong:#242526;--text:#e4e6eb;--text-muted:#b0b3b8;--border:#3a3b3c;--accent:#2d88ff;--accent-ink:#e7f3ff;--accent-contrast:#ffffff;--overlay:rgba(0,0,0,.6);--motion-spring:cubic-bezier(.22,.82,.31,1);--motion-swift:cubic-bezier(.3,.7,.2,1);--motion-smooth:cubic-bezier(.22,.61,.36,1);--pointer-x:50%;--pointer-y:12%;--space-1:4px;--space-2:6px;--space-3:8px;--space-4:10px;--radius-sm:8px;--radius-md:10px;--layout-border-size:1px;--layout-header-h-mobile:60px;--layout-header-h-desktop:66px;--layout-header-offset-mobile:var(--layout-header-h-mobile);--layout-header-offset-desktop:var(--layout-header-h-desktop);--layout-sidebar-w:236px;--layout-mobile-nav-h:66px;--layout-mobile-nav-offset:calc(var(--layout-mobile-nav-h) + env(safe-area-inset-bottom,0px));--z-overlay:40;--z-header:50;--z-mobile-nav:52;--z-sidebar:55;--z-notifications:58;--z-toast:70;--page-content-max:1100px;--page-form-max:560px}
body[data-theme='light']{color-scheme:light;--bg:#f0f2f5;--surface:#ffffff;--surface-soft:#f2f3f5;--surface-strong:#ffffff;--text:#050505;--text-muted:#65676b;--border:#ced0d4;--accent:#1877f2;--accent-ink:#e7f3ff;--accent-contrast:#ffffff;--overlay:rgba(0,0,0,.2)}
html{font-size:15px;background:var(--bg);color:var(--text)}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--text);font:400 1rem/1.5 Inter,system-ui,sans-serif;overflow-x:hidden}
button,input,select,textarea{font:inherit}
a{text-decoration:none;color:inherit}
.app-shell{min-height:100vh;min-height:100dvh;display:grid;grid-template-columns:minmax(0,1fr);grid-template-rows:var(--layout-header-h-mobile) minmax(0,1fr) auto;position:relative;isolation:isolate;overflow-x:clip}
.app-shell::before{display:none}
body.app-navigating .app-shell::before{opacity:0}
`;
