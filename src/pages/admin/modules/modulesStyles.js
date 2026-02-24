export const modulesStyles = `
.flow-head { display: flex; justify-content: space-between; align-items: end; gap: 10px; border-bottom: 1px solid var(--line); padding-bottom: 8px; margin-bottom: 10px; }
.flow-head h1 { margin: 0; font-size: 22px; line-height: 1.2; }
.flow-head p { margin: 2px 0 0; color: #64748b; font-size: 13px; }
.flow-back { display: inline-block; margin-bottom: 8px; font-size: 13px; text-decoration: none; color: #334155; }
.flow-back:hover { text-decoration: underline; }

.panel-form,.flow-inline-form { display: grid; gap: 8px; border: 1px solid var(--line); background: #fff; border-radius: 8px; padding: 10px; margin-bottom: 10px; }
.stack-xs { display: grid; gap: 6px; }
.inline-row { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
.inline-check { display: inline-flex; align-items: center; gap: 6px; color: #475569; font-size: 12px; }

.manage-grid,.flow-list { display: grid; gap: 10px; }
.manage-card,.flow-item { border: 1px solid var(--line); border-radius: 10px; background: #fff; padding: 10px; display: grid; gap: 8px; }
.manage-card { grid-template-columns: 96px minmax(0,1fr) auto; align-items: start; }
.manage-cover { width: 96px; height: 96px; border: 1px solid var(--line); border-radius: 8px; overflow: hidden; display: grid; place-items: center; color: #94a3b8; font-size: 11px; }
.manage-cover img { width: 100%; height: 100%; object-fit: cover; }
.cover-empty { padding: 4px; text-align: center; }
.manage-content h3 { margin: 0 0 4px; font-size: 16px; }
.manage-content p { margin: 0; }
.flow-item-main h3 { margin: 0 0 4px; font-size: 16px; }
.flow-item-main p { margin: 0; color: #64748b; font-size: 13px; }
.flow-item-meta { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; color: #64748b; font-size: 12px; }
.chip-row { display: flex; flex-wrap: wrap; gap: 8px; }
.chip { border: 1px solid var(--line); border-radius: 999px; padding: 6px 10px; text-decoration: none; color: #334155; font-size: 12px; }
.chip.is-active { background: #0f172a; color: #fff; border-color: #0f172a; }
.textarea { width: 100%; min-height: 96px; resize: vertical; }

@media (max-width: 900px) {
  .manage-card { grid-template-columns: 1fr; }
  .manage-cover { width: 100%; max-width: 180px; height: 120px; }
  .flow-head { align-items: start; }
}
`;
