export const TEMPLATES_STYLE = `
.mod-page{display:grid;gap:var(--space-2);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm);padding:var(--space-2)}
.mod-head{display:flex;justify-content:space-between;align-items:center;gap:var(--space-2);flex-wrap:wrap}
.mod-head h2{margin:0;font-size:1rem}
.mod-head p{margin:4px 0 0;color:var(--text-muted);font-size:.84rem;line-height:1.35}
.mod-table-wrap{border:1px solid var(--border);border-radius:var(--radius-sm);overflow:auto}
.mod-table{width:100%;border-collapse:collapse;min-width:680px;font-size:.88rem}
.mod-table th,.mod-table td{padding:var(--space-2);border-bottom:1px solid var(--border);text-align:left;vertical-align:middle}
.mod-table th{background:var(--surface-strong);color:var(--text-muted);font-weight:600;position:sticky;top:0}
.mod-row-open{cursor:pointer}
.mod-row-open:hover td{background:color-mix(in srgb,var(--accent) 7%,var(--surface))}
.mod-empty{color:var(--text-muted)}
.mod-msg{margin:0;min-height:18px;color:var(--text-muted);font-size:.82rem}
@media (max-width:740px){.mod-page{padding:var(--space-2)}.mod-table{min-width:560px}}
`;
