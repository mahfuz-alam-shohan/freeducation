export const modulesStyles = `
.table-excel { table-layout: auto; width: 100%; }
.flat-card { border-radius: 8px; border-color: var(--line); padding: 6px; background: #fff; }
.flat-grid-table { border-collapse: collapse; width: 100%; }
.flat-grid-table thead th { width: auto; background: #f2f6ff; color: #334155; font-size: 10px; border: 1px solid var(--line); padding: 4px 5px; text-transform: none; white-space: nowrap; line-height: 1.2; vertical-align: middle; }
.flat-grid-table tbody td { width: auto; border: 1px solid var(--line); padding: 3px 5px; font-size: 12px; vertical-align: middle; line-height: 1.25; overflow: hidden; text-overflow: ellipsis; }
.table-action-open-cell { width: 1%; white-space: nowrap; }
.flat-grid-table th.table-action-open-cell,.flat-grid-table td.table-action-open-cell { width: 1%; min-width: 58px; max-width: 78px; }
.file-indicator-cell { display: grid; grid-template-columns: 14px minmax(0, 1fr); gap: 1px 5px; min-width: 140px; }
.file-indicator-status { grid-column: 1 / -1; font-size: 10px; }
.image-slot { position: relative; display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; }
.image-slot-trigger { width: 28px; height: 28px; border: 0; background: transparent; border-radius: 0; padding: 0; display: grid; place-items: center; cursor: pointer; }
.image-slot-trigger img { width: 22px; height: 22px; object-fit: cover; border-radius: 3px; display: block; }
.image-slot-icon { width: 20px; height: 20px; display: inline-grid; place-items: center; color: #64748b; }
.image-slot-icon svg { width: 100%; height: 100%; fill: none; stroke: currentColor; stroke-width: 1.5; }
.image-slot-input { display: none; }
.table-text-cell-button { border: 0; background: transparent; text-align: left; cursor: pointer; padding: 0; font: inherit; color: inherit; }
.table-text-ellipsis { display: block; width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.table-text-full { margin: 0; white-space: pre-wrap; word-break: break-word; font-size: 12px; }
.content-modal { border: 0; padding: 0; background: transparent; max-width: none; width: min(720px, 94vw); }
.content-modal::backdrop { background: rgba(15, 23, 42, 0.5); }
.content-modal[open] { display: grid; place-items: center; }
.content-modal-inner { width: 100%; max-height: min(86vh, 760px); overflow: auto; border-radius: 8px; padding: 10px; display: grid; gap: 8px; background: #fff; box-shadow: var(--shadow-soft); }
.content-modal-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; position: sticky; top: 0; background: inherit; z-index: 1; padding-bottom: 5px; border-bottom: 1px solid var(--line); }
.content-form-shell,.content-form-shell [data-add-form-panel],.content-list { display: grid; gap: 6px; }
.floating-back-btn { position: fixed; top: calc(env(safe-area-inset-top, 0px) + 62px); left: 10px; z-index: 80; width: 34px; height: 34px; border: 1px solid var(--line); border-radius: 999px; background: #fff; color: #0f172a; display: inline-grid; place-items: center; text-decoration: none; font-size: 18px; box-shadow: var(--shadow-soft); }
.floating-back-btn:hover { background: #f8fafc; }
.content-kinds-table { width: auto; max-width: 100%; }
.content-kinds-table th,.content-kinds-table td { white-space: nowrap; }
.content-kinds-table .content-kind-col { width: clamp(110px, 40vw, 180px); max-width: 180px; }
.content-kinds-table .content-kind-col .table-text-ellipsis,.content-kinds-table td.content-kind-col { overflow: hidden; text-overflow: ellipsis; }
.subject-flow-card-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 320px)); gap: 8px; justify-content: start; }
.subject-flow-card { width: min(100%, 320px); padding: 8px; display: grid; gap: 6px; }
.subject-flow-card-main { display: grid; grid-template-columns: 56px minmax(0, 1fr); gap: 8px; align-items: start; }
.subject-flow-card-media { width: 56px; min-height: 56px; border: 1px solid var(--line); border-radius: 6px; display: grid; place-items: center; background: #f8fafc; }
.subject-flow-card-media .image-slot,.subject-flow-card-media .image-slot-trigger { width: 46px; height: 46px; }
.subject-flow-card-media .image-slot-trigger img { width: 44px; height: 44px; border-radius: 5px; }
.subject-flow-card-body { display: grid; gap: 6px; min-width: 0; }
.chapter-flow-card-grid { margin-top: 6px; }
.plain-entry { border: 0; border-bottom: 1px solid var(--line); border-radius: 0; padding: 6px 0; background: transparent; margin-bottom: 0; display: grid; gap: 5px; }
.chapter-flow-card { padding: 7px; }
.subject-flow-card-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }
.subject-flow-card-head .card-title { margin: 0; font-size: 14px; }
.subject-flow-card-head .card-title a { color: inherit; text-decoration: none; }
.subject-flow-card-head p { margin: 2px 0 0; font-size: 11px; }
.subject-flow-edit-row { display: grid; grid-template-columns: minmax(160px, 1fr) auto; align-items: center; gap: 6px; }
.subject-flow-edit-row .input { height: 30px; }
.chapter-flow-edit-row { display: grid; grid-template-columns: minmax(220px, 1fr) auto auto auto; align-items: center; gap: 6px; }
.chapter-flow-edit-row .input { height: 30px; }
.plain-two-column { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
.mcq-options-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 2px 8px; margin-left: 16px; }
.subject-node-actions-row { display: grid; grid-template-columns: auto minmax(120px, 1fr) minmax(150px, 1fr) auto auto; gap: 5px; align-items: center; }
.flat-grid-table .input,.flat-grid-table .select { height: 28px; font-size: 12px; padding: 0 6px; }
.flat-grid-table .btn { min-height: 28px; padding: 0 7px; font-size: 11px; }
.plain-line-wrap { display: flex; align-items: flex-start; justify-content: space-between; gap: 6px; }
.note-content,.mcq-question { font-size: 13px; line-height: 1.4; color: #0f172a; word-break: break-word; }
.mcq-question { font-weight: 600; }
.note-content { display: flex; gap: 5px; align-items: flex-start; }
.note-index { flex: 0 0 auto; min-width: 2ch; font-weight: 600; }
.note-actions-inline,.mcq-actions-inline { display: inline-flex; align-items: center; gap: 4px; }
.btn-icon { min-height: 28px; min-width: 28px; width: 28px; height: 28px; padding: 0; border-radius: 6px; display: inline-grid; place-items: center; }
.btn-icon svg { width: 14px; height: 14px; }
.btn-icon-danger { color: #b91c1c; }
.plain-textarea { min-height: 88px; padding: 6px 8px; resize: vertical; line-height: 1.4; }
.mcq-option { margin: 0; padding: 6px 8px; border: 1px solid var(--line); border-radius: 6px; background: #fff; }
.mcq-option-correct { background: #ecfdf5; border-color: #86efac; }
.entry-shell { display: grid; gap: 6px; }
.entry-shell-head { display: grid; gap: 1px; }
.entry-shell-head .card-title { margin: 0; font-size: 14px; }
.entry-form-grid { display: grid; grid-template-columns: minmax(180px, 1.4fr) minmax(140px, 1fr) auto; gap: 6px; align-items: end; }
.inline-image-picker { display: grid; gap: 4px; align-content: start; }
.inline-image-input { display: none; }
.inline-image-preview { position: relative; width: fit-content; }
.inline-image-preview img { width: 76px; height: 76px; object-fit: cover; border: 1px solid var(--line); border-radius: 6px; display: block; }
.inline-image-remove-btn { position: absolute; top: -8px; right: -8px; }
.chapter-image-picker { min-height: 34px; align-items: center; }
.chapter-image-upload-btn { min-height: 30px; padding: 0 12px; border: 1px dashed #94a3b8; border-radius: 8px; background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%); color: #0f172a; font-size: 12px; font-weight: 600; display: inline-flex; align-items: center; cursor: pointer; }
.chapter-image-upload-btn:hover { border-color: #64748b; background: #f8fafc; }
.chapter-image-preview img { width: 84px; height: 84px; border-radius: 8px; }
.field-label { display: block; margin-bottom: 3px; font-size: 11px; color: #475569; }
.inline-check { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; color: #0f172a; min-height: 28px; }
.section-summary-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 5px 8px; }
.section-summary-row p { margin: 0; font-size: 12px; }
.content-tab-panel { display: grid; gap: 8px; margin-bottom: 8px; }
.content-tab-nav { display: flex; flex-wrap: nowrap; align-items: flex-end; gap: 0; border-bottom: 1px solid var(--line); padding-bottom: 0; overflow-x: auto; overflow-y: hidden; touch-action: pan-x; overscroll-behavior-x: contain; }
.content-tab-link { border: 1px solid var(--line); border-bottom: 0; border-radius: 6px 6px 0 0; padding: 6px 10px; text-decoration: none; color: #334155; font-size: 12px; font-weight: 600; background: #f8fafc; white-space: nowrap; margin-bottom: -1px; }
.content-tab-link:hover { background: #f1f5f9; color: #0f172a; }
.content-tab-link.is-active { background: #fff; border-color: #94a3b8; color: #0f172a; box-shadow: none; }
.content-tab-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.content-tab-head p { margin: 0; }
.content-tab-head-actions { display: inline-flex; gap: 6px; flex-wrap: wrap; }
.content-tab-preview-list { display: grid; gap: 6px; margin: 0; }

@media (max-width: 840px) {
  .floating-back-btn { top: calc(env(safe-area-inset-top, 0px) + 58px); left: 8px; }
  .subject-flow-card-grid { grid-template-columns: 1fr; }
  .subject-flow-card { width: 100%; }
  .plain-two-column { grid-template-columns: 1fr; }
  .subject-node-actions-row { grid-template-columns: 1fr; align-items: stretch; }
  .entry-form-grid { grid-template-columns: 1fr; }
  .section-summary-row { flex-direction: column; align-items: flex-start; }
  .table-wrap { overflow-x: auto; }
  .content-kinds-table .content-kind-col { width: 132px; max-width: 132px; }
  .content-tab-head { flex-direction: column; align-items: flex-start; }
  .subject-flow-edit-row { grid-template-columns: 1fr; align-items: flex-start; }
  .chapter-flow-edit-row { grid-template-columns: 1fr; align-items: flex-start; }
  .subject-flow-card-main { grid-template-columns: 52px minmax(0, 1fr); }
  .subject-flow-card-media { width: 52px; min-height: 52px; justify-content: center; padding: 2px; }
  .subject-flow-card-media .image-slot,.subject-flow-card-media .image-slot-trigger { width: 42px; height: 42px; }
  .subject-flow-card-media .image-slot-trigger img { width: 40px; height: 40px; }
  .plain-line-wrap { flex-direction: column; align-items: stretch; }
  .note-actions-inline,.mcq-actions-inline { justify-content: flex-end; }
  .mcq-options-grid { grid-template-columns: 1fr; margin-left: 0; }
}

`;
