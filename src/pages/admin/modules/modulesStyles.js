export const modulesStyles = `
.table-excel { table-layout: fixed; min-width: 860px; }
.flat-card { border-radius: 0; border-color: #d5dde7; padding: 6px; }
.flat-grid-table { border-collapse: collapse; min-width: 860px; }
.flat-grid-table thead th { background: #fff; color: #334155; font-size: 11px; border: 1px solid #d5dde7; padding: 5px 6px; text-transform: none; white-space: nowrap; line-height: 1.2; vertical-align: middle; }
.flat-grid-table tbody td { border: 1px solid #d5dde7; padding: 3px 6px; font-size: 12px; vertical-align: middle; line-height: 1.25; overflow: hidden; text-overflow: ellipsis; }
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
.content-modal { border: 0; padding: 0; background: transparent; max-width: 900px; width: min(900px, 96vw); }
.content-modal-inner { max-height: 88vh; overflow: auto; border-radius: 10px; padding: 12px; }
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
@media (max-width: 840px) {
  .plain-two-column { grid-template-columns: 1fr; }
  .subject-node-actions-row { grid-template-columns: 1fr; align-items: stretch; }
  .table-excel { min-width: 700px; }
}
`;
