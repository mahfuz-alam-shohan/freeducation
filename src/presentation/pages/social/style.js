import { SOCIAL_POST_SHARED_STYLE } from "../../modules/posts/style.js";

export const SOCIAL_STYLE = `
.page-social{
  --social-sidebar-w:440px;
  --social-feed-max:600px;
  --social-card-radius:14px;
  --social-post-max-w:560px;
}
.page-social .app-header{overflow:visible;justify-content:flex-start}
.page-social .app-header-left{order:1;flex:0 0 auto;margin-right:var(--space-1);gap:6px}
.page-social .app-header-center{order:2;display:flex;justify-content:flex-start;align-items:center;min-width:0;flex:0 0 auto;margin-right:auto;overflow-x:clip}
.page-social .app-header-center:empty{display:none}
.page-social .app-header-right{order:3;margin-left:var(--space-1);display:flex;align-items:center;gap:var(--space-2);flex:0 0 auto}
.page-social .app-notify-toggle{order:0}
.page-social .app-brand{display:none}
.page-social .app-menu-toggle{margin-left:0}
.page-social .app-avatar{order:2}
.page-social .app-user-meta{order:1;text-align:left}
.page-social .app-user-name,.page-social .app-user-email{text-align:left}
.page-social .app-logout{display:none!important}
.page-social .app-profile-pop{left:0;right:auto}
.page-social .app-footer{display:none!important}
.social-header-search{--social-search-panel-w:min(560px,60vw);position:relative;display:flex;align-items:center;gap:8px;z-index:calc(var(--z-header) + 1);min-width:0}
.social-header-search-toggle{display:inline-flex;align-items:center;justify-content:center;width:42px;height:42px;border-radius:12px;border:2px solid #1a67c8;background:#2f8cff;color:#f4f9ff;cursor:pointer;transition:background .24s var(--motion-smooth),color .24s var(--motion-smooth),border-color .24s var(--motion-smooth),transform .3s var(--motion-spring);box-shadow:0 8px 18px color-mix(in srgb,#2f8cff 35%,transparent)}
.social-header-search-toggle .app-icon{width:20px;height:20px;stroke-width:2}
.social-header-search-toggle:hover{color:#fff;border-color:#175fb8;background:#4a99ff}
.social-header-search.is-open .social-header-search-toggle{color:#fff;border-color:#175ab0;transform:scale(1.03)}
.social-header-search-panel{position:relative;width:0;max-width:var(--social-search-panel-w);opacity:0;transform:translateX(-8px) scale(.985);pointer-events:none;transition:width .34s var(--motion-spring),opacity .24s var(--motion-smooth),transform .3s var(--motion-spring);overflow:hidden;min-width:0}
.social-header-search.is-open .social-header-search-panel{width:var(--social-search-panel-w);opacity:1;transform:translateX(0) scale(1);pointer-events:auto;overflow:visible}
.social-header-search-form{width:100%;display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:9px;height:42px;padding:0 12px;border:2px solid #1b67c8;border-radius:12px;background:#f6faff;box-shadow:0 8px 18px rgba(30,86,164,.18);transition:border-color .24s var(--motion-smooth),box-shadow .24s var(--motion-smooth),transform .28s var(--motion-spring)}
.social-header-search-form:focus-within{border-color:#1457af;box-shadow:0 12px 24px color-mix(in srgb,#2f8cff 32%,transparent);transform:translateY(-.5px)}
.social-header-search-icon{display:inline-flex;align-items:center;justify-content:center;color:#1f63bf}
.social-header-search-icon .app-icon{width:18px;height:18px;stroke-width:2}
.social-header-search-form input{width:100%;min-width:0;height:100%;border:none;outline:none;background:transparent;color:#163052;font-size:.92rem}
.social-header-search-form input[type="search"]{-webkit-appearance:none;appearance:none}
.social-header-search-form input[type="search"]::-webkit-search-decoration,
.social-header-search-form input[type="search"]::-webkit-search-cancel-button,
.social-header-search-form input[type="search"]::-webkit-search-results-button,
.social-header-search-form input[type="search"]::-webkit-search-results-decoration{display:none}
.social-header-search-form input::placeholder{color:#7290b5}
.social-header-search-clear{display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;border:none;background:transparent;color:#5278ab;border-radius:999px;cursor:pointer;font-size:1rem;line-height:1}
.social-header-search-clear:hover{background:#dceaff;color:#214f93}
.social-header-search-dropdown{position:absolute;top:calc(100% + 8px);left:0;right:0;max-height:min(60vh,380px);overflow:auto;border:1px solid color-mix(in srgb,var(--border) 70%,var(--accent) 30%);border-radius:12px;background:linear-gradient(180deg,color-mix(in srgb,var(--surface-strong) 97%,#fff 3%),var(--surface));box-shadow:0 18px 30px rgba(0,0,0,.28);padding:6px;display:grid;gap:2px}
.social-header-search-dropdown[hidden]{display:none!important}
.social-profile-search-list{display:grid;gap:2px}
.social-profile-search-item{display:grid;grid-template-columns:40px minmax(0,1fr);align-items:center;gap:10px;padding:8px 9px;border:1px solid transparent;border-radius:10px;text-decoration:none;color:var(--text);background:transparent;transition:background .2s ease,border-color .2s ease,transform .2s ease}
.social-profile-search-item:hover,.social-profile-search-item:focus-visible{background:var(--surface-soft);border-color:color-mix(in srgb,var(--accent) 28%,var(--border));transform:translateY(-1px)}
.social-profile-search-item-compact{grid-template-columns:34px minmax(0,1fr);gap:8px;padding:7px 8px}
.social-profile-search-avatar{display:grid;align-items:center;justify-items:center}
.social-profile-search-avatar .avatar{display:grid;width:40px;height:40px;min-width:40px;min-height:40px;border-radius:999px;overflow:hidden;background:var(--surface-soft);border:1px solid color-mix(in srgb,var(--border) 72%,var(--accent) 28%);place-items:center;color:var(--text-muted);font-size:.8rem;font-weight:700}
.social-profile-search-item-compact .social-profile-search-avatar .avatar{width:34px;height:34px;min-width:34px;min-height:34px}
.social-profile-search-avatar .avatar img{display:block;width:100%;height:100%;object-fit:cover}
.social-profile-search-text{display:grid;gap:2px;min-width:0}
.social-profile-search-name{font-size:.9rem;font-weight:700;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.social-profile-search-subtitle{font-size:.78rem;color:var(--text-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.social-profile-search-empty{margin:0;padding:10px 12px;font-size:.84rem;color:var(--text-muted)}
.social-search-page-card{width:min(100%,720px);border:1px solid var(--border);background:linear-gradient(180deg,color-mix(in srgb,var(--surface) 96%,#fff 4%),var(--surface));border-radius:var(--radius-md);padding:var(--space-2);display:grid;gap:var(--space-2)}
.social-search-heading{margin:0;font-size:1rem}
.social-search-results{display:grid;gap:4px}

.social-page{position:relative;display:grid;gap:var(--space-2);min-width:0;overflow-x:hidden;padding-inline:clamp(2px,.9vw,10px)}
.social-page-post{--social-feed-max:100%;height:100%;padding-inline:0}
.social-page::before,.social-page::after{content:'';position:fixed;z-index:-1;pointer-events:none;border-radius:999px;filter:blur(42px);opacity:.42}
.social-page::before{width:260px;height:260px;top:88px;left:10px;background:color-mix(in srgb,var(--accent) 42%,transparent)}
.social-page::after{width:300px;height:300px;right:14px;bottom:100px;background:color-mix(in srgb,var(--text-muted) 18%,transparent)}
.social-main{display:grid;gap:var(--space-2);min-width:0;justify-items:center}
.social-main > :not(.social-post-modal):not(.social-detail-back-fab){width:min(100%,var(--social-feed-max))}
.social-main-post{align-content:start}
.social-post-focus{width:min(100%,var(--social-feed-max));display:grid;gap:var(--space-2)}
body.social-post-page .app-content{overflow:hidden;padding:0}
body.social-post-page .app-content > *{height:100%}
body.social-post-page .social-page-post .social-main > :not(.social-post-modal):not(.social-detail-back-fab){width:100%}
body.social-post-page .social-main-post{height:100%;grid-template-rows:auto minmax(0,1fr);overflow:hidden}
body.social-post-page .social-post-focus{height:100%;min-height:0;gap:0;overflow:hidden}
body.social-post-page .social-status{padding-inline:var(--space-2);min-height:0;line-height:1}
.social-detail-back-fab{position:fixed!important;top:calc(var(--layout-header-offset-mobile) + env(safe-area-inset-top,0px) + 8px);left:10px;z-index:10000;width:34px!important;height:34px!important;min-width:34px!important;max-width:34px!important;border-radius:999px;border:1px solid color-mix(in srgb,var(--border) 68%,#fff 32%);background:color-mix(in srgb,var(--surface) 88%,#000 12%);color:var(--text);display:grid!important;place-items:center;text-decoration:none;font-size:1rem;line-height:1;backdrop-filter:blur(6px);box-shadow:0 8px 18px rgba(0,0,0,.28)}
.social-detail-back-fab:hover{border-color:var(--accent);background:var(--surface-soft)}
.social-card{border:1px solid var(--border);background:var(--surface);border-radius:var(--radius-md);padding:var(--space-2);min-width:0}
.social-intro-card h2{margin:0;font-size:1rem}
.social-note{margin:4px 0 0;color:var(--text-muted);font-size:.88rem}
.social-status{min-height:20px;color:var(--text-muted);font-size:.86rem;justify-self:stretch;padding:0 var(--space-1)}
.social-status:empty{display:none}
${SOCIAL_POST_SHARED_STYLE}

.social-right-sidebar{display:grid;position:fixed;z-index:var(--z-sidebar);right:0;top:var(--layout-header-offset-mobile);height:calc(100vh - var(--layout-header-offset-mobile));height:calc(100dvh - var(--layout-header-offset-mobile));width:min(var(--social-sidebar-w),92vw);max-width:100vw;background:linear-gradient(180deg,color-mix(in srgb,var(--surface-strong) 95%,#fff 5%),var(--surface-strong));border-left:var(--layout-border-size) solid var(--border);padding:var(--space-3);gap:var(--space-2);align-content:start;overflow:auto;overscroll-behavior:contain;transform:translateX(104%);transition:transform .36s var(--motion-spring)}
body.page-social.menu-open .social-right-sidebar{transform:translateX(0)}
body.page-social.notifications-open .social-right-sidebar{visibility:hidden;pointer-events:none}
.social-detail-sidebar{gap:var(--space-2);align-content:start}
.social-detail-desktop-only{display:grid}
.social-right-head{display:flex;align-items:center;justify-content:space-between;gap:var(--space-2);padding-bottom:var(--space-1);border-bottom:1px solid var(--border)}
.social-right-title{margin:0;font-size:.7rem;letter-spacing:.08em;text-transform:uppercase;color:var(--text-muted)}
.social-menu-close{display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border:1px solid var(--border);background:var(--surface);color:var(--text);border-radius:999px;cursor:pointer;font-size:1.2rem;line-height:1}
.social-menu-close:hover{border-color:var(--accent);background:var(--surface-soft)}
.social-detail-right-head{padding-bottom:10px}
.social-detail-back{display:inline-flex;align-items:center;gap:8px;color:var(--text);text-decoration:none;font-weight:700;padding:8px 10px;border:1px solid transparent;border-radius:999px}
.social-detail-back:hover{border-color:color-mix(in srgb,var(--accent) 35%,var(--border));background:var(--surface-soft)}
.social-detail-back .app-icon{width:18px;height:18px}
.social-detail-post-meta{display:grid;gap:10px;padding-bottom:10px;border-bottom:1px solid var(--border)}
.social-detail-author-row{display:grid;grid-template-columns:38px minmax(0,1fr);gap:10px;align-items:center}
.social-detail-author-row .post-author-link-avatar{display:grid;width:38px;height:38px;min-width:38px;min-height:38px;text-decoration:none}
.social-detail-author-row .avatar{width:100%;height:100%;min-width:38px;min-height:38px;border-radius:999px;overflow:hidden;background:var(--surface-soft);border:1px solid color-mix(in srgb,var(--border) 72%,var(--accent) 28%);display:grid;place-items:center;color:var(--text-muted);font-size:.78rem;font-weight:700}
.social-detail-author-row .avatar img{display:block;width:100%;height:100%;object-fit:cover}
.social-detail-author-meta{display:grid;gap:2px;min-width:0}
.social-detail-author-name{font-size:.92rem;font-weight:700;color:var(--text);text-decoration:none;overflow-wrap:anywhere}
.social-detail-author-name:hover{text-decoration:underline}
.social-detail-time{color:var(--text-muted);font-size:.78rem}
.social-detail-body{margin:0;font-size:.92rem;line-height:1.42;white-space:pre-wrap;overflow-wrap:anywhere;max-height:160px;overflow:auto}
.social-detail-reaction{display:grid;gap:9px;padding:2px 0 10px;border-bottom:1px solid var(--border)}
.social-detail-like{width:100%;height:36px;display:inline-flex;align-items:center;justify-content:center;gap:6px;border:1px solid color-mix(in srgb,var(--border) 70%,var(--accent) 30%);background:var(--surface);color:var(--text-muted);border-radius:10px;padding:7px var(--space-2);cursor:pointer;font-weight:600;transition:background .2s ease,color .2s ease,border-color .2s ease}
.social-detail-like:hover{background:var(--surface-soft);color:var(--text);border-color:color-mix(in srgb,var(--accent) 35%,var(--border))}
.social-detail-like .post-like-icon{width:17px;height:17px;flex:0 0 17px}
.social-detail-like.is-liked{color:#f02849}
.social-detail-like.is-liked .post-like-icon{filter:drop-shadow(0 0 8px rgba(240,40,73,.28))}
.social-detail-meta{margin:0;color:var(--text-muted);font-size:.84rem}
.social-detail-comments-wrap{display:grid;gap:var(--space-2);align-content:start;min-height:0}
.social-detail-comments-title{margin:0;font-size:.83rem;letter-spacing:.06em;text-transform:uppercase;color:var(--text-muted)}
.social-detail-comments{display:grid;gap:var(--space-1);align-content:start;max-height:52dvh;overflow:auto;padding-right:2px}
.social-detail-comment-item{--comment-depth:0;display:grid;grid-template-columns:38px minmax(0,1fr) auto;gap:10px;align-items:start;margin-left:calc(var(--comment-depth) * 14px)}
.social-detail-comment-item.is-reply{grid-template-columns:32px minmax(0,1fr) auto}
.social-detail-comment-avatar{position:relative;width:38px;height:38px;min-width:38px;min-height:38px;border-radius:999px;overflow:hidden;background:var(--surface-soft);border:1px solid color-mix(in srgb,var(--border) 72%,var(--accent) 28%);display:grid;place-items:center;color:var(--text-muted);font-size:.78rem;font-weight:700;box-shadow:0 2px 8px rgba(0,0,0,.14)}
.social-detail-comment-item.is-reply .social-detail-comment-avatar{width:32px;height:32px;min-width:32px;min-height:32px}
.social-detail-comment-avatar::after{content:attr(data-initial);display:grid;place-items:center;width:100%;height:100%;font-size:.78rem;font-weight:700;color:var(--text-muted)}
.social-detail-comment-avatar.has-image::after{display:none}
.social-detail-comment-avatar img{display:block;width:100%;height:100%;object-fit:cover}
.social-detail-comment-main{display:grid;gap:4px;min-width:0}
.social-detail-comment-bubble{background:color-mix(in srgb,var(--surface) 96%,#fff 4%);border:1px solid var(--border);border-radius:18px;padding:9px 12px;display:grid;gap:3px}
.social-detail-comment-author{font-weight:700;font-size:.84rem;line-height:1.2}
.social-detail-comment-body{font-size:.9rem;line-height:1.36;overflow-wrap:anywhere}
.social-detail-comment-actions{display:flex;align-items:center;gap:8px;padding:0 10px}
.social-detail-comment-time-inline{color:var(--text-muted);font-size:.75rem;margin-right:auto}
.social-detail-comment-react-rail{display:grid;justify-items:center;align-content:start;gap:2px;padding-top:2px}
.social-detail-comment-react{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;padding:0;border:none;background:transparent;color:var(--text-muted);border-radius:999px;cursor:pointer;transition:background .2s ease,color .2s ease,transform .2s ease}
.social-detail-comment-react:hover{background:var(--surface-soft);color:var(--text)}
.social-detail-comment-react .post-like-icon{width:17px;height:17px}
.social-detail-comment-react .post-like-icon path{fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.social-detail-comment-react.is-liked{color:#f02849}
.social-detail-comment-react.is-liked .post-like-icon path{fill:currentColor;stroke:currentColor}
.social-detail-comment-react.is-liked .post-like-icon{filter:drop-shadow(0 0 8px rgba(240,40,73,.28))}
.social-detail-comment-react-count{min-width:10px;text-align:center;font-size:.74rem;line-height:1;color:var(--text-muted);font-weight:600}
.social-detail-comment-reply-toggle{border:none;background:none;color:var(--text-muted);font-size:.78rem;font-weight:600;padding:0;cursor:pointer}
.social-detail-comment-reply-toggle:hover{color:var(--text);text-decoration:underline}
.social-detail-comment-reply-form{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;align-items:center;padding:0 10px}
.social-detail-comment-reply-form input{width:100%;min-width:0;border:1px solid var(--border);background:var(--surface);color:var(--text);border-radius:10px;padding:8px 10px;font:inherit}
.social-detail-comment-reply-form button{height:34px;padding:0 12px;border:1px solid color-mix(in srgb,var(--border) 70%,var(--accent) 30%);background:var(--surface);color:var(--text);border-radius:10px;cursor:pointer;font-weight:700}
.social-detail-comment-replies{display:grid;gap:6px}
.social-detail-comment-form{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;align-items:center}
.social-detail-comment-form input{width:100%;min-width:0;border:1px solid var(--border);background:var(--surface);color:var(--text);border-radius:10px;padding:8px 10px;font:inherit}
.social-detail-comment-form button{height:34px;padding:0 var(--space-2);border:1px solid color-mix(in srgb,var(--border) 70%,var(--accent) 30%);background:var(--surface);color:var(--text);border-radius:10px;cursor:pointer;font-weight:700}
.social-detail-comment-form button:hover{border-color:var(--accent)}
.social-menu-stack{display:grid;gap:var(--space-1);align-content:start}
.social-menu-link{padding:var(--space-2) var(--space-3);border-radius:var(--radius-sm);color:var(--text-muted);display:flex;align-items:center;gap:var(--space-2);text-decoration:none;transition:background .22s ease,color .22s ease,transform .28s var(--motion-spring),box-shadow .22s ease,border-color .2s ease;opacity:.96;transform:translateX(-3px);border:1px solid transparent}
.social-menu-link:hover,.social-menu-link.active{background:var(--surface);color:var(--text);transform:translateX(0);border-color:color-mix(in srgb,var(--accent) 26%,var(--border));box-shadow:0 8px 18px color-mix(in srgb,var(--accent) 14%,transparent)}

.social-compose-menu{border:1px solid transparent;border-radius:var(--radius-md);background:linear-gradient(180deg,color-mix(in srgb,var(--surface-soft) 94%,#fff 6%),var(--surface-soft));padding:var(--space-2);display:grid;gap:var(--space-1);transition:border-color .2s ease,background .2s ease,box-shadow .2s ease}
.social-compose-menu:hover,.social-compose-menu:focus-within,.social-page.is-compose-expanded .social-compose-menu{border-color:color-mix(in srgb,var(--accent) 38%,var(--border));background:var(--surface)}
.social-compose-head{display:flex;align-items:center;gap:var(--space-1);font-size:.82rem;font-weight:700;letter-spacing:.03em;color:var(--text-muted);text-transform:uppercase}
.social-compose-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:var(--space-1);align-items:start}
.social-compose-actions{display:flex;align-items:center;gap:var(--space-1)}
.social-compose-input{width:100%;min-height:36px;max-height:36px;resize:none;overflow:hidden;border:1px solid color-mix(in srgb,var(--border) 72%,var(--accent) 28%);background:var(--surface);color:var(--text);border-radius:12px;padding:8px 11px;font:inherit;line-height:1.35;transition:max-height .24s var(--motion-spring),min-height .24s var(--motion-spring),border-color .2s ease,box-shadow .2s ease}
.social-compose-menu:hover .social-compose-input,.social-compose-menu:focus-within .social-compose-input,.social-page.is-compose-expanded .social-compose-input,.social-compose-menu[data-has-images="1"] .social-compose-input{min-height:110px;max-height:220px}
.social-compose-submit{height:36px;padding:0 var(--space-3);border:1px solid color-mix(in srgb,var(--border) 70%,var(--accent) 30%);background:var(--surface);color:var(--text);border-radius:12px;cursor:pointer;font-weight:700;font-size:.82rem}
.social-compose-submit:hover{border-color:var(--accent)}
.social-compose-extra{display:grid;gap:var(--space-1);max-height:0;opacity:0;overflow:hidden;transform:translateY(-4px);transition:max-height .28s var(--motion-spring),opacity .2s ease,transform .22s var(--motion-spring)}
.social-compose-menu:hover .social-compose-extra,.social-compose-menu:focus-within .social-compose-extra,.social-page.is-compose-expanded .social-compose-extra,.social-compose-menu[data-has-images="1"] .social-compose-extra{max-height:420px;opacity:1;transform:translateY(0)}
.social-label{font-size:.8rem;color:var(--text-muted)}
.social-image-picker-trigger{display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border:1px solid color-mix(in srgb,var(--border) 70%,var(--accent) 30%);background:var(--surface);color:var(--text);border-radius:12px;padding:0;cursor:pointer;transition:border-color .2s ease,background .2s ease,transform .2s ease}
.social-image-picker-trigger .app-icon{width:18px;height:18px}
.social-image-picker-trigger:hover{border-color:var(--accent);background:var(--surface-soft);transform:translateY(-1px)}
.social-readonly{margin:0;border:1px solid var(--border);background:var(--surface);border-radius:var(--radius-sm);padding:var(--space-2) var(--space-3);color:var(--text-muted);font-size:.86rem}
.social-mobile-pages{display:grid;gap:var(--space-1);padding-top:var(--space-1);border-top:1px solid var(--border)}
.social-menu-caption{margin:0;font-size:.72rem;letter-spacing:.07em;text-transform:uppercase;color:var(--text-muted)}
.social-mobile-pages .app-nav{gap:var(--space-1)}
.social-mobile-pages .app-nav-section{gap:var(--space-1)}
.social-mobile-pages .app-nav-title{font-size:.68rem}
.image-preview-wrap{display:block;width:100%;padding-top:4px}
.image-preview-wrap[hidden]{display:none!important}
.image-preview-list{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;width:100%;max-width:100%}
.image-preview-thumb{position:relative;margin:0;min-width:0;width:100%;min-height:88px;border:1px solid color-mix(in srgb,var(--border) 76%,var(--accent) 24%);border-radius:10px;overflow:hidden;background:var(--surface-soft);aspect-ratio:1/1}
.image-preview-thumb img{display:block;width:100%;height:100%;object-fit:cover}
.image-preview-fallback{width:100%;height:100%;display:grid;place-items:center;font-size:1.1rem;font-weight:700;color:var(--text-muted);background:linear-gradient(180deg,color-mix(in srgb,var(--surface-soft) 92%,#fff 8%),var(--surface-soft))}
.image-preview-remove{position:absolute;top:4px;right:4px;width:22px;height:22px;border-radius:999px;font-size:.82rem;line-height:1;padding:0;border:1px solid color-mix(in srgb,var(--border) 70%,#fff 30%);background:rgba(12,12,14,.72);color:#fff;cursor:pointer;display:grid;place-items:center}
.image-preview-remove:hover{background:rgba(12,12,14,.86)}
.upload-progress-wrap{display:grid;gap:5px}
.upload-progress-wrap[hidden]{display:none!important}
.upload-progress-head{display:flex;justify-content:space-between;color:var(--text-muted);font-size:.8rem}
.upload-progress-wrap progress{width:100%;height:8px;appearance:none}
.upload-progress-wrap progress::-webkit-progress-bar{background:var(--surface-soft);border-radius:999px}
.upload-progress-wrap progress::-webkit-progress-value{background:linear-gradient(90deg,var(--accent),color-mix(in srgb,var(--accent) 28%,#fff));border-radius:999px}
.upload-progress-wrap progress::-moz-progress-bar{background:linear-gradient(90deg,var(--accent),color-mix(in srgb,var(--accent) 28%,#fff));border-radius:999px}

.social-feed-tail{width:min(100%,var(--social-feed-max));min-height:18px;text-align:center;color:var(--text-muted);font-size:.82rem;line-height:1.35}
.social-feed-sentinel{width:min(100%,var(--social-feed-max));height:1px;pointer-events:none}

.post-media-detail{gap:0;height:100%;min-height:0}
.post-media-item-detail{position:relative;display:grid;place-items:center;width:100%;height:100%;min-height:0;background:color-mix(in srgb,var(--surface-soft) 88%,#000 12%);overflow:hidden;line-height:0}
.post-media-item-detail::before{
  content:'';
  position:absolute;
  inset:0;
  z-index:0;
  pointer-events:none;
  background-image:var(--detail-bg-image);
  background-size:cover;
  background-position:center center;
  background-repeat:no-repeat;
  filter:blur(22px) saturate(1.08);
  transform:scale(1.08);
  opacity:.72;
}
.post-media-item-detail .post-image,
.post-media-item-detail .post-image-detail{
  position:relative;
  z-index:1;
  display:block;
  width:100%!important;
  height:100%!important;
  max-width:none!important;
  max-height:none!important;
  object-fit:contain!important;
  object-position:center center!important;
  margin:auto;
  background:color-mix(in srgb,var(--surface-soft) 88%,#000 12%);
}
body.social-post-page .post-media-item-detail > .post-image,
body.social-post-page .post-media-item-detail > .post-image-detail{
  position:relative!important;
  inset:auto!important;
  display:block!important;
  width:100%!important;
  height:100%!important;
  max-width:none!important;
  max-height:none!important;
  object-fit:contain!important;
  object-position:center center!important;
  margin:auto!important;
}
.post-media-item-detail > .post-image-detail.is-switching{
  will-change:transform,opacity;
  animation-duration:.28s!important;
  animation-timing-function:cubic-bezier(.22,.61,.36,1)!important;
  animation-fill-mode:both!important;
}
.post-media-item-detail > .post-image-detail.is-switching.is-switching-next{animation-name:social-detail-image-enter-next!important}
.post-media-item-detail > .post-image-detail.is-switching.is-switching-prev{animation-name:social-detail-image-enter-prev!important}
.post-media-nav{position:absolute;top:50%;transform:translateY(-50%);z-index:2;width:42px;height:42px;border-radius:999px;border:1px solid rgba(255,255,255,.25);background:rgba(18,20,27,.62);color:#fff;display:grid;place-items:center;cursor:pointer;font-size:1.45rem;line-height:1;padding:0}
.post-media-nav-prev{left:10px}
.post-media-nav-next{right:10px}
.post-media-counter{position:absolute;right:12px;bottom:12px;z-index:2;background:rgba(14,16,22,.72);color:#fff;border:1px solid rgba(255,255,255,.2);padding:4px 8px;border-radius:999px;font-size:.75rem;font-weight:700}

@keyframes social-detail-image-enter-next{
  from{opacity:.55;transform:translate3d(18px,0,0) scale(1.012)}
  to{opacity:1;transform:translate3d(0,0,0) scale(1)}
}
@keyframes social-detail-image-enter-prev{
  from{opacity:.55;transform:translate3d(-18px,0,0) scale(1.012)}
  to{opacity:1;transform:translate3d(0,0,0) scale(1)}
}
.social-page-post .post-card{padding:var(--space-2) var(--space-2) var(--space-3)}
.social-page-post .post-card:hover{transform:none}
.social-page-post .social-post-focus .post-card{width:100%;max-width:100%}
.social-page-post .social-post-focus .post-card-detail-media{height:100%;padding:0;border:none;border-radius:0;background:color-mix(in srgb,var(--surface-soft) 88%,#000 12%);box-shadow:none;overflow:hidden}
.social-page-post .social-post-focus .post-card-detail-media .post-media-detail{height:100%;min-height:0;overflow:hidden}
.social-page-post .social-post-focus .post-card-detail-media .post-media-item-detail{height:100%;min-height:0;max-height:none}
.social-detail-inline{display:none}
.empty-feed{border:1px dashed var(--border);border-radius:var(--radius-md);padding:var(--space-3);color:var(--text-muted);font-size:.9rem}
button[disabled]{opacity:.58;cursor:not-allowed}

@media (min-width:900px){
  .social-detail-back-fab{display:none!important}
  body.social-post-page{overflow:hidden}
  body.social-post-page .app-shell{
    min-height:100vh;
    min-height:100dvh;
    grid-template-rows:var(--layout-header-h-desktop) minmax(0,1fr)!important;
  }
  body.social-post-page .app-footer{display:none!important}
  body.social-post-page .app-content{
    overflow:hidden!important;
    padding:0!important;
    grid-row:2!important;
    align-content:stretch;
  }
  body.social-post-page .social-page-post{height:100%;padding:0}
  body.social-post-page .social-page-post .social-main{height:100%;gap:0;align-content:stretch;justify-items:stretch}
  body.social-post-page .social-main-post{
    height:100%;
    min-height:0;
    grid-template-rows:minmax(0,1fr)!important;
    gap:0;
    overflow:hidden;
    align-content:stretch;
    justify-items:stretch;
  }
  body.social-post-page .social-status{display:none!important}
  body.social-post-page .social-post-focus{
    height:100%;
    min-height:0;
    overflow:hidden;
    gap:0;
    align-content:stretch;
    justify-items:stretch;
  }
  body.social-post-page .social-post-focus .post-card-detail-media{
    height:calc(100vh - var(--layout-header-offset-desktop));
    height:calc(100dvh - var(--layout-header-offset-desktop));
    min-height:0;
    margin:0;
    border:none;
    border-radius:0;
    box-shadow:none;
  }
  body.social-post-page .social-post-focus .post-card-detail-media .post-media-detail{
    height:100%;
    width:100%;
    overflow:hidden;
    display:grid;
    place-items:center;
  }
  body.social-post-page .social-post-focus .post-card-detail-media .post-media-item-detail{
    height:100%;
    min-height:0;
    max-height:none;
  }
  body.social-post-page .social-post-focus .post-card-detail-media .post-media-item-detail > .post-image{
    width:100%!important;
    height:100%!important;
    max-width:none!important;
    max-height:none!important;
    object-fit:contain!important;
    object-position:center center!important;
  }
  .page-social{--social-left-collapsed-w:68px;--social-left-expanded-w:312px}
  .page-social.social-compose-expanded{--social-sidebar-w:620px}
  .page-social .app-shell{grid-template-columns:var(--social-left-collapsed-w) minmax(0,1fr) var(--social-sidebar-w,440px);overflow:visible;transition:grid-template-columns .26s var(--motion-spring)}
  .page-social .app-sidebar{
    display:grid!important;
    grid-column:1;
    grid-row:2;
    z-index:calc(var(--z-sidebar) + 1);
    width:var(--social-left-collapsed-w);
    max-width:none;
    padding-top:var(--space-1);
    overflow-x:hidden;
    overflow-y:auto;
    border-right:var(--layout-border-size) solid var(--border);
    transition:width .26s var(--motion-spring),box-shadow .22s ease,border-color .2s ease;
  }
  .page-social .app-sidebar .app-nav{gap:var(--space-1)}
  .page-social .app-sidebar .app-nav-title{
    margin:0;
    padding:0;
    max-height:0;
    opacity:0;
    overflow:hidden;
    transition:max-height .2s ease,opacity .2s ease,padding .2s ease;
  }
  .page-social .app-sidebar .app-nav a{
    justify-content:center;
    gap:0;
    padding:var(--space-2);
    font-size:0;
    transform:none;
  }
  .page-social .app-sidebar .app-theme-wrap{display:none}
  .page-social .app-sidebar:hover,
  .page-social .app-sidebar:focus-within{
    width:var(--social-left-expanded-w);
    box-shadow:0 14px 28px rgba(0,0,0,.18);
    border-color:color-mix(in srgb,var(--accent) 28%,var(--border));
  }
  .page-social .app-sidebar:hover .app-nav-title,
  .page-social .app-sidebar:focus-within .app-nav-title{
    padding:0 4px;
    max-height:20px;
    opacity:1;
  }
  .page-social .app-sidebar:hover .app-nav a,
  .page-social .app-sidebar:focus-within .app-nav a{
    justify-content:flex-start;
    gap:var(--space-2);
    padding:var(--space-2) var(--space-3);
    font-size:.9rem;
    transform:translateX(-3px);
  }
  .page-social .app-sidebar:hover .app-theme-wrap,
  .page-social .app-sidebar:focus-within .app-theme-wrap{display:block}

  .page-social .app-content{grid-column:2;grid-row:2}
  .page-social .app-footer{grid-column:2;grid-row:3}

  .social-right-sidebar{grid-column:3;grid-row:2;position:sticky;top:var(--layout-header-offset-desktop);height:calc(100vh - var(--layout-header-offset-desktop));height:calc(100dvh - var(--layout-header-offset-desktop));width:var(--social-sidebar-w,440px);max-width:var(--social-sidebar-w,620px);transform:none;animation:social-right-in .32s var(--motion-spring) both;transition:width .26s var(--motion-spring),max-width .26s var(--motion-spring)}
  .page-social .app-notifications-panel{top:var(--layout-header-offset-desktop);height:calc(100vh - var(--layout-header-offset-desktop));height:calc(100dvh - var(--layout-header-offset-desktop));width:min(var(--social-sidebar-w,440px),100vw)}
  .social-menu-close{display:none}
  .social-mobile-pages{display:none}
  .page-social.social-compose-expanded .social-compose-submit{width:140px}
}

@media (max-width:899px){
  .page-social .app-header{
    display:grid;
    grid-template-columns:auto minmax(0,1fr) auto;
    align-items:center;
    column-gap:8px;
    justify-content:stretch;
  }
  .page-social .app-content{padding:0!important}
  .social-page{padding-inline:0}
  .social-main > :not(.social-post-modal):not(.social-detail-back-fab){width:100%}
  .page-social .app-sidebar{display:none!important}
  .page-social .app-brand{display:none!important}
  .page-social .app-header-left{grid-column:1;display:flex;align-items:center;gap:6px;margin-right:0;min-width:0}
  .page-social .app-header-center{grid-column:2;padding-inline:0;min-width:0;width:100%;display:flex;justify-content:flex-start}
  .page-social .app-header-right{grid-column:3;margin-left:0;display:flex;align-items:center;gap:6px;justify-self:end}
  .social-header-search{
    --social-search-toggle-w:40px;
    --social-search-gap:6px;
    --social-search-panel-w:max(0px,calc(100% - var(--social-search-toggle-w) - var(--social-search-gap)));
    width:100%;
    max-width:100%;
    gap:var(--social-search-gap);
  }
  .social-header-search-toggle{width:40px;height:40px}
  .social-header-search-form{height:40px;padding:0 10px}
  .social-header-search-form input{font-size:.88rem}
  .social-header-search-dropdown{top:calc(100% + 6px);max-height:min(52vh,320px)}
  .social-search-page-card{border-left:none;border-right:none;border-radius:0}
  .page-social .app-user-meta{display:none}
  .social-right-sidebar{box-shadow:-18px 0 36px rgba(0,0,0,.24)}
  .social-compose-menu{order:2}
  .social-mobile-pages{order:3}
  .social-detail-back{display:none}
  .social-detail-desktop-only{display:none!important}
  .social-detail-back-fab{
    width:32px;
    height:32px;
    top:calc(var(--layout-header-offset-mobile) + env(safe-area-inset-top,0px) + 6px);
    left:8px;
    font-size:.96rem;
  }
  body.social-post-page .app-content{overflow:auto}
  body.social-post-page .social-main-post{height:auto;min-height:0;overflow:visible;grid-template-rows:auto auto}
  body.social-post-page .social-post-focus{height:auto;min-height:0;overflow:visible}
  body.social-post-page .social-status{display:none}
  .social-page-post .social-post-focus .post-card-detail-media{height:auto;min-height:0}
  .social-page-post .social-post-focus .post-card-detail-media .post-media-detail{height:auto}
  .social-page-post .social-post-focus .post-card-detail-media .post-media-item-detail{
    height:auto;
    min-height:min(82vw,320px);
    max-height:min(86dvh,520px);
    aspect-ratio:auto;
  }
  .social-page-post .social-post-focus .post-card-detail-media .post-media-item-detail > .post-image{
    width:100%!important;
    height:100%!important;
    object-fit:contain!important;
    object-position:center center!important;
  }
  .social-detail-inline{display:grid;gap:var(--space-2);padding:var(--space-2);background:var(--surface);border-top:1px solid var(--border)}
  .social-detail-inline .social-detail-post-meta{border-bottom:1px solid var(--border);padding-bottom:10px}
  .social-detail-inline .social-detail-comments{max-height:none;overflow:visible}
  .social-detail-inline .social-detail-comment-item{grid-template-columns:30px minmax(0,1fr) auto;gap:8px;margin-left:calc(var(--comment-depth) * 10px)}
  .social-detail-inline .social-detail-comment-item.is-reply{grid-template-columns:26px minmax(0,1fr) auto}
  .social-detail-inline .social-detail-comment-avatar{width:30px;height:30px;min-width:30px;min-height:30px}
  .social-detail-inline .social-detail-comment-item.is-reply .social-detail-comment-avatar{width:26px;height:26px;min-width:26px;min-height:26px}
  .social-detail-inline .social-detail-comment-bubble{padding:7px 10px;border-radius:14px}
  .social-detail-inline .social-detail-comment-author{font-size:.8rem}
  .social-detail-inline .social-detail-comment-body{font-size:.84rem;line-height:1.3}
  .social-detail-inline .social-detail-comment-actions{gap:6px;padding:0 6px}
  .social-detail-inline .social-detail-comment-time-inline{font-size:.68rem}
  .social-detail-inline .social-detail-comment-reply-toggle{font-size:.72rem}
  .social-detail-inline .social-detail-comment-react{width:22px;height:22px}
  .social-detail-inline .social-detail-comment-react .post-like-icon{width:14px;height:14px}
  .social-detail-inline .social-detail-comment-react-count{font-size:.66rem}
  .social-detail-inline .social-detail-comment-replies{gap:4px}
  .social-detail-inline .social-detail-comment-reply-form{padding:0 6px}
  .social-detail-inline .social-detail-comment-reply-form input{padding:7px 9px;font-size:.84rem}
  .social-detail-inline .social-detail-comment-reply-form button{height:30px;padding:0 10px;font-size:.8rem}
}

@keyframes social-right-in{from{opacity:0;transform:translateX(22px)}to{opacity:1;transform:translateX(0)}}
`;
