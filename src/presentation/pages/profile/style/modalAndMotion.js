export const PROFILE_STYLE_MOTION = `
.profile-modal{border:none;padding:0;background:transparent;opacity:0;transition:opacity calc(.28s * var(--profile-motion-scale)) ease}
.profile-modal::backdrop{background:var(--overlay)}
.profile-modal-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-md);padding:var(--space-3);min-width:min(92vw,380px);display:grid;gap:var(--space-2);opacity:0;transform:translateY(12px) scale(.94);transition:opacity calc(.3s * var(--profile-motion-scale)) ease,transform calc(.5s * var(--profile-motion-scale)) cubic-bezier(.2,1.08,.3,1)}
.profile-modal.is-open{opacity:1}
.profile-modal.is-open .profile-modal-card{opacity:1;transform:translateY(0) scale(1)}
.profile-modal.is-closing{opacity:0}
.profile-modal.is-closing .profile-modal-card{opacity:0;transform:translateY(8px) scale(.95)}
.profile-modal-large{min-width:min(92vw,720px)}
.profile-big-preview{width:100%;max-height:72vh;object-fit:contain;background:var(--surface-strong);border-radius:8px}
@media (max-width:640px){.profile-cover{height:140px}.profile-loader-shimmer-cover{height:140px}.profile-avatar-wrap{width:94px;height:94px}.profile-head{margin-top:-34px}.profile-loader-about-row{gap:8px;padding:6px 0}.profile-loader-shimmer-label{width:64px}.profile-loader-shimmer-value{width:min(100%,140px)}.profile-row{flex-direction:column;gap:6px;padding:7px 0}.profile-row.is-editing{gap:4px;padding:5px 0}.profile-inline-edit{width:100%;justify-content:flex-start;gap:5px}.profile-inline-edit strong{text-align:left;font-size:.95rem}.profile-edit-trigger{padding:3px;border-radius:6px}.profile-edit-trigger .profile-inline-icon{width:15px;height:15px}.profile-edit-form{justify-content:flex-start;gap:5px;max-width:100%}.profile-edit-form input,.profile-edit-form select{width:min(76vw,220px);padding:4px 6px;font-size:.92rem}.profile-edit-form-compact{max-width:min(86vw,220px)}.profile-edit-form[data-edit-form='name'] input{width:min(70vw,190px)}.profile-edit-form[data-edit-form='gender'] select{width:min(64vw,170px)}.profile-edit-form button{padding:4px 7px;font-size:.82rem}.profile-dob-inputs{grid-template-columns:54px 68px 74px;width:auto;gap:5px}}
@keyframes panelIn{from{opacity:.35;transform:translateY(8px) scale(.994);filter:blur(1px)}to{opacity:1;transform:none;filter:blur(0)}}
@keyframes panelOut{from{opacity:1;transform:none;filter:blur(0)}to{opacity:0;transform:translateY(-5px) scale(.996);filter:blur(1px)}}
@keyframes profileShimmer{100%{transform:translateX(100%)}}
@keyframes profileRise{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
@keyframes profileMediaSweep{100%{transform:translateX(120%)}}
`;
