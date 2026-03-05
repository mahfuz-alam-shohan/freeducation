export const APP_SHELL_STYLE_MOTION = `
@keyframes avatar-skeleton{0%{background-position:200% 0}100%{background-position:-200% 0}}
@keyframes theme-chip-pulse{0%,100%{transform:translateY(0)}50%{transform:translateY(-1px)}}
@keyframes theme-orb-spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
@keyframes section-in{from{opacity:0}to{opacity:1}}
@keyframes content-float-in{from{opacity:.02;transform:translate3d(0,6px,0) scale(.998)}to{opacity:1;transform:translate3d(0,0,0) scale(1)}}
@keyframes page-out-forward{from{opacity:1}to{opacity:.96}}
@keyframes page-in-forward{from{opacity:.97}to{opacity:1}}
@keyframes page-out-back{from{opacity:1}to{opacity:.96}}
@keyframes page-in-back{from{opacity:.97}to{opacity:1}}
@keyframes public-shell-out-forward{from{opacity:1;transform:translate3d(0,0,0)}to{opacity:.72;transform:translate3d(-16px,0,0)}}
@keyframes public-shell-in-forward{from{opacity:.55;transform:translate3d(20px,0,0)}to{opacity:1;transform:translate3d(0,0,0)}}
@keyframes public-shell-out-back{from{opacity:1;transform:translate3d(0,0,0)}to{opacity:.72;transform:translate3d(16px,0,0)}}
@keyframes public-shell-in-back{from{opacity:.55;transform:translate3d(-20px,0,0)}to{opacity:1;transform:translate3d(0,0,0)}}
::view-transition{background:var(--bg)}
::view-transition-image-pair(root){isolation:isolate}
::view-transition-group(root){animation-duration:.3s;animation-timing-function:var(--motion-smooth)}
::view-transition-old(root),::view-transition-new(root){backface-visibility:hidden;will-change:transform,opacity;contain:paint}
::view-transition-old(root){mix-blend-mode:normal}
::view-transition-new(root){mix-blend-mode:normal}
html[data-nav-motion='forward']::view-transition-old(root){animation:page-out-forward .22s var(--motion-swift) both}
html[data-nav-motion='forward']::view-transition-new(root){animation:page-in-forward .32s var(--motion-spring) both}
html[data-nav-motion='back']::view-transition-old(root){animation:page-out-back .2s var(--motion-swift) both}
html[data-nav-motion='back']::view-transition-new(root){animation:page-in-back .3s var(--motion-spring) both}
html[data-nav-scope='public-shell'] .app-shell[data-shell-scope='public'] .app-content{view-transition-name:public-shell-content}
html[data-nav-scope='public-shell']::view-transition-old(root),
html[data-nav-scope='public-shell']::view-transition-new(root){animation:none;opacity:1}
::view-transition-image-pair(public-shell-content){isolation:isolate}
::view-transition-group(public-shell-content){animation-duration:.32s;animation-timing-function:var(--motion-smooth)}
::view-transition-old(public-shell-content),::view-transition-new(public-shell-content){backface-visibility:hidden;will-change:transform,opacity;contain:paint}
html[data-nav-scope='public-shell'][data-nav-motion='forward']::view-transition-old(public-shell-content){animation:public-shell-out-forward .2s var(--motion-swift) both}
html[data-nav-scope='public-shell'][data-nav-motion='forward']::view-transition-new(public-shell-content){animation:public-shell-in-forward .32s var(--motion-spring) both}
html[data-nav-scope='public-shell'][data-nav-motion='back']::view-transition-old(public-shell-content){animation:public-shell-out-back .2s var(--motion-swift) both}
html[data-nav-scope='public-shell'][data-nav-motion='back']::view-transition-new(public-shell-content){animation:public-shell-in-back .32s var(--motion-spring) both}
@keyframes menu-item-in{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
@media (prefers-reduced-motion:reduce){.app-menu-toggle,.app-avatar,.app-nav-overlay,.app-sidebar,.app-nav a,.app-profile-pop,.app-content,.app-content > *,.app-shell::before,.app-theme-toggle,.app-theme-orb,.app-theme-orb svg,.app-theme-chip,::view-transition-old(root),::view-transition-new(root),::view-transition-old(public-shell-content),::view-transition-new(public-shell-content){animation:none;transition:none}}
@media (min-width:900px){
  .app-shell{grid-template-columns:var(--layout-sidebar-w) minmax(0,1fr);grid-template-rows:var(--layout-header-h-desktop) minmax(0,1fr) auto}
  .app-header{grid-column:1 / -1;grid-row:1;padding:0 14px;block-size:var(--layout-header-h-desktop)}
  .app-user-meta{display:block}
  .app-logout{display:inline-flex}
  .app-sidebar{grid-column:1;grid-row:2;z-index:auto}
  .app-content{grid-column:2 / -1;grid-row:2;padding:var(--space-3)}
  .app-footer{grid-column:2 / -1;grid-row:3;padding:var(--space-3)}
  .app-menu-toggle{display:none}
  .app-nav-overlay{display:none}
  .app-sidebar{position:sticky;left:auto;right:auto;bottom:auto;top:var(--layout-header-offset-desktop);align-self:start;transform:none;height:calc(100vh - var(--layout-header-offset-desktop));height:calc(100dvh - var(--layout-header-offset-desktop));width:var(--layout-sidebar-w);border-top:0;border-right:var(--layout-border-size) solid var(--border);border-radius:0;box-shadow:none;padding:var(--space-3)}
}
`;
