export const APP_SHELL_STYLE_MOTION = `
@keyframes avatar-skeleton{0%{background-position:200% 0}100%{background-position:-200% 0}}
@keyframes theme-chip-pulse{0%,100%{transform:translateY(0)}50%{transform:translateY(-1px)}}
@keyframes theme-orb-spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
@keyframes section-in{from{opacity:0}to{opacity:1}}
@keyframes content-float-in{from{opacity:0;transform:translate3d(0,8px,0) scale(.994);filter:blur(1.2px)}to{opacity:1;transform:translate3d(0,0,0) scale(1);filter:blur(0)}}
@keyframes page-out-forward{from{opacity:1;transform:translateX(0) scale(1)}to{opacity:.18;transform:translateX(-3.5%) scale(.99)}}
@keyframes page-in-forward{from{opacity:0;transform:translateX(4.5%) scale(.995)}to{opacity:1;transform:translateX(0) scale(1)}}
@keyframes page-out-back{from{opacity:1;transform:translateX(0) scale(1)}to{opacity:.22;transform:translateX(3%) scale(.992)}}
@keyframes page-in-back{from{opacity:0;transform:translateX(-4%) scale(.995)}to{opacity:1;transform:translateX(0) scale(1)}}
@keyframes menu-item-in{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
@media (prefers-reduced-motion:reduce){.app-menu-toggle,.app-avatar,.app-nav-overlay,.app-sidebar,.app-nav a,.app-profile-pop,.app-content,.app-content > *,.app-shell::before,.app-theme-toggle,.app-theme-orb,.app-theme-orb svg,.app-theme-chip,::view-transition-old(root),::view-transition-new(root){animation:none;transition:none}}
@media (min-width:900px){
  .app-shell{grid-template-columns:var(--layout-sidebar-w) minmax(0,1fr);grid-template-rows:var(--layout-header-h-desktop) minmax(0,1fr) auto}
  .app-header{grid-column:1 / -1;grid-row:1;padding:0 var(--space-2);block-size:var(--layout-header-h-desktop)}
  .app-user-meta{display:block}
  .app-logout{display:inline-flex}
  .app-sidebar{grid-column:1;grid-row:2;z-index:auto}
  .app-content{grid-column:2 / -1;grid-row:2;padding:var(--space-3)}
  .app-footer{grid-column:2 / -1;grid-row:3;padding:var(--space-3)}
  .app-menu-toggle{display:none}
  .app-nav-overlay{display:none}
  .app-sidebar{position:sticky;top:var(--layout-header-offset-desktop);align-self:start;transform:none;height:calc(100vh - var(--layout-header-offset-desktop));height:calc(100dvh - var(--layout-header-offset-desktop));width:var(--layout-sidebar-w);animation:desktop-sidebar-in .45s ease both}
  .app-sidebar .app-nav a{animation:menu-item-in .36s ease both;animation-delay:var(--menu-delay,0ms)}
  @keyframes desktop-sidebar-in{from{opacity:0;transform:translateX(-14px)}to{opacity:1;transform:translateX(0)}}
}
`;
