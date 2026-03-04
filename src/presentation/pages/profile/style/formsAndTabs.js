import { SOCIAL_POST_SHARED_STYLE } from "../../../modules/posts/style.js";

export const PROFILE_STYLE_FORMS = `
.profile-tabs-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-md);padding:var(--space-3);animation:fadeUp .46s cubic-bezier(.22,.61,.36,1);overflow-x:hidden}
.profile-tabs{position:relative;display:flex;gap:2px;border-bottom:1px solid var(--border);padding-bottom:0;margin-bottom:var(--space-2)}
.profile-tab{position:relative;z-index:2;border:none;background:transparent;color:var(--text-muted);padding:var(--space-2) var(--space-3) var(--space-2);border-radius:0;cursor:pointer;font-weight:600;transition:color calc(.18s * var(--profile-motion-scale)) ease,transform calc(.28s * var(--profile-motion-scale)) cubic-bezier(.22,.82,.31,1)}
.profile-tab:hover{color:var(--text);transform:translateY(-1px)}
.profile-tab.is-active{color:var(--text)}
.profile-tab-indicator{position:absolute;left:0;bottom:-1px;height:2px;width:0;background:var(--accent);border-radius:999px;transform:translateX(0);transition:transform calc(.22s * var(--profile-motion-scale)) cubic-bezier(.22,.61,.36,1),width calc(.22s * var(--profile-motion-scale)) cubic-bezier(.22,.61,.36,1)}
.profile-page[data-read-only='1'] #tabSecurity,.profile-page[data-read-only='1'] #panelSecurity,.profile-page[data-read-only='1'] .profile-edit-trigger,.profile-page[data-read-only='1'] .profile-edit-form,.profile-page[data-read-only='1'] .profile-open-password,.profile-page[data-read-only='1'] .profile-password-form{display:none!important}
.profile-panel{display:none;animation:panelIn calc(.42s * var(--profile-motion-scale)) cubic-bezier(.22,.61,.36,1);overflow-x:hidden}
.profile-panel.is-active{display:block}
.profile-panel[hidden]{display:none!important}
.profile-panel.is-leaving{display:block;animation:panelOut calc(.16s * var(--profile-motion-scale)) ease forwards}
.profile-row{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-2);padding:var(--space-2) 0;border-bottom:1px solid var(--border);min-width:0;animation:profileRise calc(.4s * var(--profile-motion-scale)) cubic-bezier(.22,.61,.36,1) both}
.profile-row:last-child{border-bottom:0}
.profile-row:nth-child(2){animation-delay:.02s}.profile-row:nth-child(3){animation-delay:.04s}.profile-row:nth-child(4){animation-delay:.06s}.profile-row:nth-child(5){animation-delay:.08s}
.profile-row span{color:var(--text-muted);flex:0 0 auto}
.profile-inline-edit{display:flex;align-items:center;gap:var(--space-1);justify-content:flex-end;flex:1;min-width:0;flex-wrap:wrap}
.profile-inline-edit strong{font-weight:600;max-width:100%;overflow-wrap:anywhere;text-align:right;transition:opacity calc(.3s * var(--profile-motion-scale)) ease,transform calc(.32s * var(--profile-motion-scale)) cubic-bezier(.22,.61,.36,1)}
.profile-edit-trigger{border:1px solid var(--border);background:var(--surface-soft);padding:4px;border-radius:8px;cursor:pointer;display:grid;place-items:center;color:var(--text);transition:transform calc(.28s * var(--profile-motion-scale)) cubic-bezier(.22,.82,.31,1),opacity calc(.24s * var(--profile-motion-scale)) ease,background calc(.24s * var(--profile-motion-scale)) ease,border-color calc(.24s * var(--profile-motion-scale)) ease,box-shadow calc(.3s * var(--profile-motion-scale)) ease}
.profile-edit-trigger:hover{transform:translateY(-1px);background:var(--surface-strong);box-shadow:0 5px 14px color-mix(in srgb,var(--accent) 16%,transparent)}
.profile-edit-form{display:flex;align-items:center;gap:var(--space-1);opacity:0;transform:translateY(-6px) scale(.97);transition:opacity calc(.34s * var(--profile-motion-scale)) ease,transform calc(.34s * var(--profile-motion-scale)) cubic-bezier(.22,.61,.36,1);flex:0 1 auto;min-width:0;max-width:min(100%,420px);flex-wrap:wrap;justify-content:flex-end}
.profile-edit-form[hidden]{display:none!important}
.profile-edit-form.is-visible{opacity:1;transform:translateY(0) scale(1)}
.profile-edit-form input,.profile-edit-form select{background:var(--surface-strong);border:1px solid var(--border);border-radius:6px;padding:5px 6px;color:var(--text);min-width:0;max-width:100%;width:min(100%,220px)}
.profile-edit-form-compact{max-width:min(100%,270px)}
.profile-edit-form[data-edit-form='name'] input{width:min(100%,180px)}
.profile-edit-form[data-edit-form='gender'] select{width:min(100%,170px)}
.profile-dob-inputs{display:grid;grid-template-columns:56px 72px 76px;gap:var(--space-1);width:auto;max-width:100%}
.profile-dob-inputs input,.profile-dob-inputs select{width:100%;min-width:0}
.profile-edit-form button{border:1px solid var(--border);background:var(--surface-soft);padding:5px 8px;border-radius:6px;color:var(--text);cursor:pointer;transition:background calc(.24s * var(--profile-motion-scale)) ease,transform calc(.24s * var(--profile-motion-scale)) ease}
.profile-row.is-editing strong{opacity:0;transform:translateY(-2px);pointer-events:none;display:none}
.profile-row.is-editing{padding-top:5px;padding-bottom:5px}
.profile-row.is-editing .profile-inline-edit{gap:var(--space-1)}
.profile-row.is-editing .profile-edit-form input,.profile-row.is-editing .profile-edit-form select{padding:4px 6px;font-size:.93rem}
.profile-row.is-editing .profile-edit-form button{padding:4px 7px;font-size:.84rem}
.profile-open-password{border:1px solid var(--border);background:var(--surface-soft);padding:var(--space-2) var(--space-3);border-radius:6px;cursor:pointer}
.profile-password-form{display:grid;gap:var(--space-2);max-width:360px;width:min(100%,var(--page-form-max,560px));margin-top:var(--space-2);animation:fadeUp calc(.24s * var(--profile-motion-scale)) ease}
.profile-password-form[hidden]{display:none!important}
.profile-password-form label{display:grid;gap:4px;font-size:.92rem}
.profile-password-form input{background:var(--surface-strong);border:1px solid var(--border);border-radius:6px;padding:7px 8px;color:var(--text)}
.profile-security-actions{display:grid;gap:6px;margin-top:var(--space-2)}
.profile-logout-action{justify-self:start;border:1px solid color-mix(in srgb,#e24f56 55%,var(--border));background:color-mix(in srgb,#e24f56 16%,var(--surface-soft));padding:7px 12px;border-radius:8px;color:var(--text);cursor:pointer;font-weight:650}
.profile-logout-action:disabled{opacity:.62;cursor:not-allowed}
.profile-security-note{margin:0;color:var(--text-muted);font-size:.82rem;line-height:1.35}
.profile-password-form button,.profile-modal-card button{border:1px solid var(--border);background:var(--surface-soft);padding:7px 10px;border-radius:6px;color:var(--text);cursor:pointer}
.profile-msg{min-height:1.2em;color:var(--text-muted);margin:var(--space-2) 0 0}
.profile-posts-list{width:100%}
.profile-posts-status{margin:var(--space-2) 0 0;min-height:1.1rem;color:var(--text-muted);font-size:.86rem}
.profile-posts-status.is-error{color:#ff9ca1}
.profile-posts-actions{display:flex;justify-content:center;padding-top:var(--space-2)}
.profile-posts-load-more{border:1px solid var(--border);background:var(--surface-soft);padding:7px 12px;border-radius:8px;color:var(--text);cursor:pointer}
.profile-posts-load-more:disabled{opacity:.65;cursor:not-allowed}
.profile-posts-empty{margin:0;border:1px dashed var(--border);border-radius:var(--radius-md);padding:var(--space-3);color:var(--text-muted);text-align:center}
${SOCIAL_POST_SHARED_STYLE}
@media (max-width:899px){
  #panelPosts{margin-inline:calc(-1 * var(--space-3))}
  .profile-posts-status,.profile-posts-actions{padding-inline:var(--space-2)}
}
`;
