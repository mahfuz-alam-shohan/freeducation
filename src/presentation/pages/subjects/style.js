export const SUBJECTS_STYLE = `
.sub-page{display:grid;gap:var(--space-2);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm);padding:var(--space-2)}
.sub-head{display:flex;justify-content:space-between;align-items:center;gap:var(--space-2);flex-wrap:wrap}
.sub-head h2{margin:0;font-size:1rem}
.sub-head p{margin:4px 0 0;color:var(--text-muted);font-size:.84rem}
.sub-primary,.sub-secondary{height:34px;border-radius:8px;border:1px solid var(--border);padding:0 12px;font-weight:600;cursor:pointer}
.sub-primary{background:var(--accent);color:var(--accent-ink)}
.sub-secondary{background:var(--surface-soft);color:var(--text)}
.sub-primary:hover,.sub-secondary:hover{filter:brightness(1.03)}
.sub-table-wrap{overflow:auto;border:1px solid var(--border);border-radius:var(--radius-sm)}
.sub-table{width:100%;border-collapse:collapse;min-width:940px;font-size:.88rem}
.sub-table th,.sub-table td{padding:var(--space-2);border-bottom:1px solid var(--border);text-align:left;vertical-align:middle}
.sub-table th{background:var(--surface-strong);color:var(--text-muted);font-weight:600;position:sticky;top:0}
.sub-row-open{cursor:pointer}
.sub-row-open:hover td{background:color-mix(in srgb,var(--accent) 7%,var(--surface))}
.sub-input{height:34px;min-width:180px;border:1px solid var(--border);border-radius:8px;background:var(--surface-soft);color:var(--text);padding:0 10px}
.sub-select{height:34px;min-width:160px;border:1px solid var(--border);border-radius:8px;background:var(--surface-soft);color:var(--text);padding:0 10px}
.sub-input.is-syncing{border-color:color-mix(in srgb,var(--accent) 65%,var(--border));background:color-mix(in srgb,var(--accent) 8%,var(--surface-soft))}
.sub-select.is-syncing{border-color:color-mix(in srgb,var(--accent) 65%,var(--border));background:color-mix(in srgb,var(--accent) 8%,var(--surface-soft))}
.sub-image-slot-wrap{position:relative;display:inline-flex;align-items:center;justify-content:center;min-width:34px;min-height:34px}
.sub-image-slot{display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border:0;background:transparent;color:var(--text-muted);cursor:pointer;padding:0;overflow:visible}
.sub-image-slot:hover{color:var(--text)}
.sub-image-icon{width:24px;height:24px;display:inline-flex}
.sub-image-icon svg{width:100%;height:100%}
.sub-image-input{position:absolute;inset:0;opacity:0;pointer-events:none;width:0;height:0}
.sub-thumb{width:34px;height:34px;border-radius:8px;object-fit:cover;border:1px solid var(--border);display:inline-flex;align-items:center;justify-content:center;background:var(--surface-soft);color:var(--text-muted);font-size:.75rem;font-weight:700}
.sub-image-remove{position:absolute;top:-7px;right:-7px;width:16px;height:16px;border-radius:999px;border:1px solid color-mix(in srgb,#cc4a52 60%,var(--border));background:color-mix(in srgb,#cc4a52 88%,var(--surface));color:#fff;font-size:.68rem;line-height:1;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;padding:0}
.sub-image-remove:hover{filter:brightness(1.06)}
.sub-image-remove[hidden]{display:none!important}
.sub-danger{height:30px;border-radius:8px;border:1px solid color-mix(in srgb,#cc4a52 62%,var(--border));background:color-mix(in srgb,#cc4a52 10%,var(--surface));color:color-mix(in srgb,#cc4a52 80%,var(--text));font-weight:600;font-size:.78rem;line-height:1;padding:0 10px;cursor:pointer}
.sub-danger:hover{filter:brightness(1.03)}
.sub-empty{color:var(--text-muted)}
.sub-msg{margin:0;min-height:18px;color:var(--text-muted);font-size:.82rem}
.sub-toast-stack{position:fixed;top:82px;right:16px;display:grid;gap:8px;z-index:140;pointer-events:none}
.sub-toast{min-width:170px;max-width:300px;padding:10px 12px;border-radius:10px;border:1px solid var(--border);background:var(--surface);color:var(--text);box-shadow:0 8px 20px color-mix(in srgb,#000 18%,transparent);opacity:0;transform:translateY(-8px);transition:opacity .2s ease,transform .2s ease}
.sub-toast.is-visible{opacity:1;transform:translateY(0)}
.sub-toast-success{border-color:color-mix(in srgb,#2f9a66 50%,var(--border));background:color-mix(in srgb,#2f9a66 13%,var(--surface))}
.sub-toast-error{border-color:color-mix(in srgb,#cc4a52 55%,var(--border));background:color-mix(in srgb,#cc4a52 12%,var(--surface))}
.sub-modal{position:fixed;inset:0;display:grid;place-items:center;padding:var(--space-2);background:color-mix(in srgb,var(--overlay) 90%,transparent);opacity:0;visibility:hidden;transition:opacity .2s ease,visibility .2s step-end;z-index:90}
.sub-modal.is-open{opacity:1;visibility:visible;transition:opacity .2s ease}
.sub-modal-surface{width:min(520px,100%);background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:var(--space-3);display:grid;gap:var(--space-2)}
.sub-modal-surface h3{margin:0;font-size:1rem}
.sub-modal-surface p{margin:4px 0 0;color:var(--text-muted);font-size:.84rem}
.sub-form{display:grid;gap:var(--space-2)}
.sub-form-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.sub-field{display:grid;gap:4px;font-size:.84rem;color:var(--text-muted)}
.sub-field-label{font-weight:600}
.sub-field-input-wrap{display:flex;align-items:center;gap:8px;height:38px;border:1px solid var(--border);border-radius:8px;background:var(--surface-soft);padding:0 10px}
.sub-field-icon{width:16px;height:16px;display:inline-flex;color:var(--text-muted);flex:0 0 auto}
.sub-field-icon svg{width:100%;height:100%}
.sub-field input,.sub-field select{height:100%;width:100%;border:0;background:transparent;color:var(--text);padding:0;min-width:0}
.sub-field input:focus,.sub-field select:focus{outline:0}
.sub-field-input-wrap:focus-within{border-color:color-mix(in srgb,var(--accent) 62%,var(--border))}
.sub-create-image-slot-wrap{position:relative;display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px}
.sub-create-image-slot{width:38px;height:38px;border-radius:8px}
.sub-create-image-slot.has-image{color:transparent}
.sub-create-thumb{width:38px;height:38px}
.sub-create-image-input{position:absolute;inset:0;opacity:0;pointer-events:none;width:0;height:0}
.sub-form-actions{display:flex;justify-content:flex-end;gap:var(--space-2);flex-wrap:wrap}
@media (max-width:780px){.sub-page{padding:var(--space-2)}.sub-table{min-width:700px}.sub-modal{place-items:end center}.sub-form-grid{grid-template-columns:1fr}}
`;
