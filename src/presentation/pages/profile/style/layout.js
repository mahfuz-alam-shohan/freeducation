export const PROFILE_STYLE_LAYOUT = `
.profile-page{--profile-motion-scale:1.7;--social-post-max-w:560px;position:relative;display:grid;gap:var(--space-2);overflow-x:hidden}
.profile-page.is-loading{pointer-events:none}
.profile-page-loader{position:absolute;inset:0;z-index:5;display:grid;align-content:start;gap:var(--space-2);padding:0;opacity:0;pointer-events:none;transition:opacity calc(.2s * var(--profile-motion-scale)) ease}
.profile-page.is-loading .profile-page-loader{opacity:1;pointer-events:auto}
.profile-loader-shimmer{position:relative;overflow:hidden;background:color-mix(in srgb,var(--surface-soft) 74%,var(--surface));border:1px solid var(--border);border-radius:10px}
.profile-loader-shimmer::after{content:'';position:absolute;inset:0;transform:translateX(-100%);background:linear-gradient(90deg,transparent,color-mix(in srgb,#fff 22%,transparent),transparent);animation:profileShimmer 1s linear infinite}
.profile-loader-block{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-md);padding:var(--space-3)}
.profile-loader-block-hero{padding:0;overflow:hidden}
.profile-loader-shimmer-cover{height:170px;border:none;border-radius:0}
.profile-loader-head{display:flex;align-items:flex-end;gap:var(--space-3);padding:0 var(--space-3) var(--space-3);margin-top:-42px}
.profile-loader-shimmer-avatar{width:108px;height:108px;border-radius:50%}
.profile-loader-lines{display:grid;gap:var(--space-2);padding-bottom:var(--space-2);flex:1}
.profile-loader-shimmer-line{height:14px;border-radius:6px}
.profile-loader-shimmer-line-title{max-width:170px}
.profile-loader-shimmer-line-subtitle{max-width:120px}
.profile-loader-block-tabs{display:grid;gap:var(--space-2)}
.profile-loader-tabs-row{display:flex;gap:var(--space-2);padding-bottom:var(--space-2);border-bottom:1px solid var(--border)}
.profile-loader-shimmer-tab{height:30px;width:94px;border-radius:8px}
.profile-loader-shimmer-row{height:34px;border-radius:8px}
.profile-loader-shimmer-row-short{width:min(100%,170px)}
.profile-loader-about-rows{display:grid;gap:var(--space-2);padding-top:2px}
.profile-loader-about-row{display:flex;align-items:center;justify-content:space-between;gap:var(--space-2);padding:var(--space-2) 0;border-bottom:1px solid var(--border)}
.profile-loader-about-row:last-child{border-bottom:0}
.profile-loader-shimmer-label{height:12px;width:74px;border-radius:6px}
.profile-loader-shimmer-value{height:15px;width:min(100%,180px);border-radius:6px}
.profile-loader-security{display:grid;gap:var(--space-2);padding-top:var(--space-2);border-top:1px solid var(--border)}
`;
