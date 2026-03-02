export const CLASS_SUBJECTS_STYLE = `
.cls-sub-page{display:grid;gap:var(--space-2);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm);padding:var(--space-2)}
.cls-sub-head{display:flex;align-items:center;justify-content:space-between;gap:var(--space-2);flex-wrap:wrap}
.cls-sub-head h2{margin:0;font-size:1rem}
.cls-sub-head p{margin:4px 0 0;color:var(--text-muted);font-size:.84rem}
.cls-sub-back{height:32px;border:1px solid var(--border);border-radius:999px;padding:0 12px;display:inline-flex;align-items:center;background:var(--surface-soft);color:var(--text);text-decoration:none;font-weight:600}
.cls-sub-back:hover{border-color:color-mix(in srgb,var(--accent) 55%,var(--border))}
.cls-sub-table-wrap{overflow:auto;border:1px solid var(--border);border-radius:var(--radius-sm)}
.cls-sub-table{width:100%;border-collapse:collapse;min-width:640px;font-size:.88rem}
.cls-sub-table th,.cls-sub-table td{padding:8px 10px;border-bottom:1px solid var(--border);text-align:left;vertical-align:middle}
.cls-sub-table th{background:var(--surface-strong);color:var(--text-muted);font-weight:600;position:sticky;top:0}
.cls-sub-row{cursor:pointer}
.cls-sub-row:hover td{background:color-mix(in srgb,var(--accent) 7%,var(--surface))}
.cls-sub-empty{color:var(--text-muted)}
.cls-sub-msg{margin:0;min-height:18px;color:var(--text-muted);font-size:.82rem}
@media (max-width:780px){.cls-sub-page{padding:var(--space-2)}.cls-sub-table{min-width:560px}}
`;

