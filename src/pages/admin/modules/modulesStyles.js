export const modulesStyles = `
.table-excel { table-layout: auto; width: 100%; }
.flat-card { border-radius: 0; border-color: #d5dde7; padding: 6px; }
.flat-grid-table { border-collapse: collapse; width: 100%; }
.flat-grid-table thead th { width: auto; background: #fff; color: #334155; font-size: 11px; border: 1px solid #d5dde7; padding: 5px 6px; text-transform: none; white-space: nowrap; line-height: 1.2; vertical-align: middle; }
.flat-grid-table tbody td { width: auto; border: 1px solid #d5dde7; padding: 3px 6px; font-size: 12px; vertical-align: middle; line-height: 1.25; overflow: hidden; text-overflow: ellipsis; }
.table-action-open-cell { width: 1%; white-space: nowrap; }
.file-indicator-cell { display: grid; grid-template-columns: 14px minmax(0, 1fr); gap: 2px 6px; min-width: 156px; }
.file-indicator-status { grid-column: 1 / -1; font-size: 11px; }
.image-slot { position: relative; display: inline-flex; align-items: center; justify-content: center; width: 30px; height: 30px; }
.image-slot-trigger { width: 30px; height: 30px; border: 0; background: transparent; border-radius: 0; padding: 0; display: grid; place-items: center; cursor: pointer; }
.image-slot-trigger img { width: 24px; height: 24px; object-fit: cover; border-radius: 4px; display: block; }
.image-slot-icon { width: 22px; height: 22px; display: inline-grid; place-items: center; color: #64748b; }
.image-slot-icon svg { width: 100%; height: 100%; fill: none; stroke: currentColor; stroke-width: 1.5; }
.image-slot-input { display: none; }
.table-text-cell-button { border: 0; background: transparent; text-align: left; cursor: pointer; padding: 0; font: inherit; color: inherit; }
.table-text-ellipsis { display: block; width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.table-text-full { margin: 0; white-space: pre-wrap; word-break: break-word; font-size: 13px; }
.content-modal { border: 0; padding: 0; background: transparent; max-width: none; width: min(720px, 94vw); }
.content-modal::backdrop { background: rgba(15, 23, 42, 0.5); backdrop-filter: blur(2px); }
.content-modal[open] { display: grid; place-items: center; }
.content-modal-inner { width: 100%; max-height: min(86vh, 760px); overflow: auto; border-radius: 12px; padding: 14px; display: grid; gap: 10px; }
.content-modal-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; position: sticky; top: 0; background: inherit; z-index: 1; padding-bottom: 6px; border-bottom: 1px solid #e2e8f0; }
.image-slot-preview-large { width: min(260px, 100%); max-height: 260px; object-fit: contain; display: block; margin: 0 auto; }
.content-form-shell,.content-form-shell [data-add-form-panel],.content-list { display: grid; gap: 8px; }
.plain-two-column { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
.plain-entry { display: grid; gap: 5px; }
.mcq-options-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 2px 10px; margin-left: 18px; }
.template-tree-row { display: flex; align-items: center; min-height: 28px; gap: 6px; }
.template-guide { width: 16px; border-left: 1px solid #cbd5e1; }
.subject-node-actions-row { display: grid; grid-template-columns: auto minmax(140px, 1fr) minmax(180px, 1fr) auto auto; gap: 6px; align-items: center; }
.subject-node-actions-cell { width: 1%; white-space: nowrap; }
.flat-grid-table .input,.flat-grid-table .select { height: 30px; font-size: 13px; padding: 0 8px; }
.flat-grid-table .btn { min-height: 30px; padding: 0 8px; font-size: 12px; }
.flat-grid-table .badge { padding: 2px 8px; font-size: 11px; }

.plain-line-wrap { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }
.note-content,.mcq-question { font-size: 14px; line-height: 1.45; color: #0f172a; word-break: break-word; }
.note-content { display: flex; gap: 6px; align-items: flex-start; }
.note-index { font-weight: 600; color: #475569; min-width: 20px; }
.note-actions-inline,.mcq-actions-inline { display: inline-flex; align-items: center; gap: 4px; }
.entry-media.plain-media { margin: 0; }
.entry-media.plain-media img { max-width: 100%; border-radius: 8px; border: 1px solid #cbd5e1; }
.content-form-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.notes-form { display: grid; gap: 10px; }
.note-form-editor .rich-editor-input { min-height: 52px; max-height: 120px; overflow-y: auto; }
.rich-editor { border: 1px solid #cbd5e1; border-radius: 8px; background: #fff; overflow: hidden; }
.editor-header { display: flex; align-items: center; justify-content: space-between; padding: 8px 10px 0; }
.editor-mode-tabs { display: inline-flex; gap: 4px; }
.editor-mode-tab { border: 1px solid #cbd5e1; background: #f8fafc; color: #334155; border-radius: 6px; padding: 4px 8px; font-size: 12px; cursor: pointer; }
.editor-mode-tab.active { background: #e2e8f0; color: #0f172a; }
.editor-tools { display: flex; flex-wrap: wrap; gap: 5px; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; padding: 8px; }
.editor-tools .btn { min-height: 28px; padding: 0 8px; font-size: 12px; }
.editor-tools .btn.active { background: #dbeafe; border-color: #93c5fd; color: #1d4ed8; }
.rich-editor-input,.rich-editor-preview { min-height: 150px; padding: 10px; font-size: 14px; line-height: 1.5; }
.rich-editor-input { outline: none; }
.rich-editor-input:empty::before { content: attr(data-editor-placeholder); color: #94a3b8; }
.rich-editor-preview { background: #f8fafc; border-top: 1px dashed #cbd5e1; }
.rich-editor-input img,.rich-editor-preview img { max-width: 100%; height: auto; }
.mcq-option { margin: 0; padding: 6px 8px; border: 1px solid #cbd5e1; border-radius: 6px; background: #fff; }
.mcq-option-correct { background: #ecfdf5; border-color: #86efac; }
.mcq-option-label { font-weight: 700; margin-right: 4px; }

@media (max-width: 840px) {
  .plain-two-column { grid-template-columns: 1fr; }
  .subject-node-actions-row { grid-template-columns: 1fr; align-items: stretch; }
  .table-wrap { overflow-x: auto; }
}
`;
