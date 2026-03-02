export const TEMPLATE_DETAIL_STYLE = `
.tpld-page{display:grid;gap:var(--space-2);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm);padding:var(--space-2)}
.tpld-head{display:grid;gap:var(--space-2)}
.tpld-back{width:max-content;height:32px;border:1px solid var(--border);border-radius:8px;background:var(--surface-soft);color:var(--text);padding:0 10px;cursor:pointer;font-weight:600}
.tpld-back:hover{border-color:var(--accent)}
.tpld-head h2{margin:0;font-size:1rem}
.tpld-head p{margin:4px 0 0;color:var(--text-muted);font-size:.84rem}
.tpld-table-wrap{overflow:auto;border:1px solid var(--border);border-radius:var(--radius-sm)}
.tpld-table{width:100%;border-collapse:collapse;min-width:720px;font-size:.88rem}
.tpld-table th,.tpld-table td{padding:var(--space-2);border-bottom:1px solid var(--border);text-align:left}
.tpld-table th{background:var(--surface-strong);color:var(--text-muted);font-weight:600;position:sticky;top:0}
.tpld-node{display:inline-flex;align-items:center;gap:8px}
.tpld-dot{width:6px;height:6px;border-radius:999px;background:var(--accent);opacity:.7}
.tpld-yes{color:#2e9f59;font-weight:600}
.tpld-no{color:var(--text-muted)}
.tpld-msg{margin:0;min-height:18px;color:var(--text-muted);font-size:.82rem}
@media (max-width:760px){.tpld-page{padding:var(--space-2)}.tpld-table{min-width:640px}}
`;
