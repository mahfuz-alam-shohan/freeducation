export const CLASSES_STYLE = `
.cls-page{display:grid;gap:var(--space-2);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm);padding:var(--space-2)}
.cls-head{display:flex;justify-content:space-between;align-items:center;gap:var(--space-2);flex-wrap:wrap}
.cls-head h2{margin:0;font-size:1rem}
.cls-head p{margin:4px 0 0;color:var(--text-muted);font-size:.84rem}
.cls-primary,.cls-secondary{height:34px;border-radius:8px;border:1px solid var(--border);padding:0 12px;font-weight:600;cursor:pointer}
.cls-primary{background:var(--accent);color:var(--accent-ink)}
.cls-secondary{background:var(--surface-soft);color:var(--text)}
.cls-primary:hover,.cls-secondary:hover{filter:brightness(1.03)}
.cls-create-panel{max-height:0;opacity:0;overflow:hidden;transform:translateY(-6px);transition:max-height .24s ease,opacity .2s ease,transform .2s ease;border-top:1px dashed color-mix(in srgb,var(--border) 90%,transparent)}
.cls-create-panel.is-open{max-height:320px;opacity:1;transform:translateY(0)}
.cls-form{display:grid;gap:12px;padding-top:12px}
.cls-form-top-row{display:grid;grid-template-columns:minmax(0,1fr) auto auto;gap:10px;align-items:end}
.cls-field{display:grid;gap:6px;font-size:.82rem;color:var(--text-muted)}
.cls-field-label{font-weight:600;letter-spacing:.01em}
.cls-field-input-wrap{display:flex;align-items:center;gap:8px;height:38px;border:1px solid var(--border);border-radius:8px;background:var(--surface-soft);padding:0 10px}
.cls-field-icon{width:16px;height:16px;display:inline-flex;color:var(--text-muted);flex:0 0 auto}
.cls-field-icon svg{width:100%;height:100%}
.cls-field input[type="text"]{height:100%;width:100%;border:0;background:transparent;color:var(--text);padding:0;min-width:0}
.cls-field input[type="text"]:focus{outline:0}
.cls-field-input-wrap:focus-within{border-color:color-mix(in srgb,var(--accent) 62%,var(--border))}
.cls-create-image-slot-wrap{position:relative;display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px}
.cls-create-image-slot{width:38px;height:38px;border-radius:8px}
.cls-create-image-slot.has-image{color:transparent}
.cls-create-thumb{width:38px;height:38px}
.cls-create-image-input{position:absolute;inset:0;opacity:0;pointer-events:none;width:0;height:0}
.cls-form-actions{display:flex;justify-content:flex-end;gap:var(--space-2);flex-wrap:wrap}
.cls-inline-check{display:inline-flex;align-items:center;gap:8px}
.cls-create-inline-check{height:38px;align-self:end;padding:0 10px;border:1px solid var(--border);border-radius:8px;background:var(--surface-soft);font-size:.82rem;color:var(--text)}
.cls-create-inline-check input{width:16px;height:16px;accent-color:var(--accent)}
.cls-table-wrap{overflow:auto;border:1px solid var(--border);border-radius:var(--radius-sm)}
.cls-table{width:100%;border-collapse:collapse;min-width:680px;font-size:.88rem}
.cls-table th,.cls-table td{padding:var(--space-2);border-bottom:1px solid var(--border);text-align:left;vertical-align:middle;white-space:nowrap}
.cls-table th{background:var(--surface-strong);color:var(--text-muted);font-weight:600;position:sticky;top:0}
.cls-home-check{width:16px;height:16px;accent-color:var(--accent)}
.cls-input{height:34px;min-width:180px;max-width:260px;border:1px solid var(--border);border-radius:8px;background:var(--surface-soft);color:var(--text);padding:0 10px}
.cls-input.is-syncing{border-color:color-mix(in srgb,var(--accent) 65%,var(--border));background:color-mix(in srgb,var(--accent) 8%,var(--surface-soft))}
.cls-image-slot-wrap{position:relative;display:inline-flex;align-items:center;justify-content:center;min-width:34px;min-height:34px}
.cls-image-slot{display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border:0;background:transparent;color:var(--text-muted);cursor:pointer;padding:0}
.cls-image-slot:hover{color:var(--text)}
.cls-image-icon{width:24px;height:24px;display:inline-flex}
.cls-image-icon svg{width:100%;height:100%}
.cls-image-input{position:absolute;inset:0;opacity:0;pointer-events:none;width:0;height:0}
.cls-thumb{width:34px;height:34px;border-radius:8px;object-fit:cover;border:1px solid var(--border)}
.cls-image-remove{position:absolute;top:-7px;right:-7px;width:16px;height:16px;border-radius:999px;border:1px solid color-mix(in srgb,#cc4a52 60%,var(--border));background:color-mix(in srgb,#cc4a52 88%,var(--surface));color:#fff;font-size:.68rem;line-height:1;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;padding:0}
.cls-image-remove:hover{filter:brightness(1.06)}
.cls-image-remove[hidden]{display:none!important}
.cls-danger{height:30px;border-radius:8px;border:1px solid color-mix(in srgb,#cc4a52 62%,var(--border));background:color-mix(in srgb,#cc4a52 10%,var(--surface));color:color-mix(in srgb,#cc4a52 80%,var(--text));font-weight:600;font-size:.78rem;line-height:1;padding:0 10px;cursor:pointer}
.cls-danger:hover{filter:brightness(1.03)}
.cls-empty{color:var(--text-muted)}
.cls-msg{margin:0;min-height:18px;color:var(--text-muted);font-size:.82rem}
.cls-toast-stack{position:fixed;top:82px;right:16px;display:grid;gap:8px;z-index:140;pointer-events:none}
.cls-toast{min-width:170px;max-width:300px;padding:10px 12px;border-radius:10px;border:1px solid var(--border);background:var(--surface);color:var(--text);box-shadow:0 8px 20px color-mix(in srgb,#000 18%,transparent);opacity:0;transform:translateY(-8px);transition:opacity .2s ease,transform .2s ease}
.cls-toast.is-visible{opacity:1;transform:translateY(0)}
.cls-toast-success{border-color:color-mix(in srgb,#2f9a66 50%,var(--border));background:color-mix(in srgb,#2f9a66 13%,var(--surface))}
.cls-toast-error{border-color:color-mix(in srgb,#cc4a52 55%,var(--border));background:color-mix(in srgb,#cc4a52 12%,var(--surface))}
@media (max-width:980px){.cls-form-top-row{grid-template-columns:minmax(0,1fr) auto}.cls-create-inline-check{grid-column:1 / -1}}
@media (max-width:640px){.cls-form-top-row{grid-template-columns:1fr}.cls-create-image-slot-wrap{justify-self:start}.cls-create-inline-check{height:auto;min-height:38px}}
@media (max-width:780px){.cls-page{padding:var(--space-2)}.cls-table{min-width:620px}}
`;
