export const modulesStyles = `
.table-excel { table-layout: fixed; min-width: 980px; }
.flat-card { border-radius: 0; border-color: #d5dde7; padding: 6px; }
.flat-grid-table { border-collapse: collapse; min-width: 920px; }
.flat-grid-table thead th { background: #fff; color: #334155; font-size: 11px; border: 1px solid #d5dde7; padding: 6px; text-transform: none; }
.flat-grid-table tbody td { border: 1px solid #d5dde7; padding: 3px 5px; font-size: 12px; }
.file-indicator-cell { display: grid; grid-template-columns: 14px minmax(0, 1fr); gap: 2px 6px; min-width: 156px; }
.file-indicator-status { grid-column: 1 / -1; font-size: 11px; }
.image-slot { position: relative; display: inline-flex; }
.image-slot-trigger { width: 28px; height: 28px; border: 1px solid #c7d2e4; background: #fff; border-radius: 4px; padding: 0; display: grid; place-items: center; cursor: pointer; }
.image-slot-input { display: none; }
.table-text-cell-button { border: 0; background: transparent; text-align: left; cursor: pointer; padding: 0; font: inherit; color: inherit; }
.table-text-ellipsis { display: block; width: 100%; overflow: hidden; text-overflow: ellipsis; }
.table-text-full { margin: 0; white-space: pre-wrap; word-break: break-word; font-size: 13px; }
.content-modal { border: 0; padding: 0; background: transparent; max-width: 900px; width: min(900px, 96vw); }
.content-modal-inner { max-height: 88vh; overflow: auto; border-radius: 10px; padding: 12px; }
.content-form-shell,.content-form-shell [data-add-form-panel],.content-list { display: grid; gap: 8px; }
.plain-two-column { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
.plain-entry { display: grid; gap: 5px; }
.mcq-options-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 2px 10px; margin-left: 18px; }
.template-tree-row { display: flex; align-items: center; min-height: 28px; gap: 6px; }
.template-guide { width: 16px; border-left: 1px solid #cbd5e1; }
.subject-node-actions-row { display: grid; grid-template-columns: auto minmax(140px, 1fr) minmax(180px, 1fr) auto auto; gap: 6px; align-items: center; }
.subject-node-actions-cell { width: 1%; white-space: nowrap; }
@media (max-width: 840px) {
  .plain-two-column { grid-template-columns: 1fr; }
  .subject-node-actions-row { grid-template-columns: 1fr; align-items: stretch; }
  .table-excel { min-width: 760px; }
}
`;
