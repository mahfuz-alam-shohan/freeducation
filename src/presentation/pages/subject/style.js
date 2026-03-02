export const SUBJECT_STYLE = `
.sbj-page{display:grid;gap:var(--space-2);padding:0}
.sbj-head{display:grid;gap:var(--space-2)}
.sbj-back{width:max-content;height:32px;border:1px solid var(--border);border-radius:8px;background:var(--surface-soft);color:var(--text);padding:0 10px;cursor:pointer;font-weight:600}
.sbj-back:hover{border-color:var(--accent)}
.sbj-head h2{margin:0;font-size:1rem}
.sbj-head p{margin:4px 0 0;color:var(--text-muted);font-size:.84rem}
.sbj-breadcrumb{display:flex;flex-wrap:wrap;gap:8px;font-size:.8rem;color:var(--text-muted)}
.sbj-breadcrumb button{border:0;background:none;color:inherit;padding:0;cursor:pointer;text-decoration:underline;text-underline-offset:2px}
.sbj-card{display:grid;gap:10px;border:0;border-radius:0;padding:0;background:transparent}
.sbj-toolbar{display:flex;justify-content:space-between;gap:var(--space-2);flex-wrap:wrap;align-items:center}
.sbj-toolbar h3{margin:0;font-size:.95rem}
.sbj-primary,.sbj-secondary,.sbj-ghost,.sbj-danger{height:32px;border-radius:8px;border:1px solid var(--border);padding:0 10px;font-weight:600;cursor:pointer}
.sbj-primary{background:var(--accent);color:var(--accent-ink)}
.sbj-secondary{background:var(--surface);color:var(--text)}
.sbj-ghost{background:var(--surface-soft);color:var(--text)}
.sbj-danger{background:color-mix(in srgb,#c7484e 80%,var(--surface));color:#fff7f7;border-color:color-mix(in srgb,#c7484e 50%,var(--border))}
.sbj-primary:hover,.sbj-secondary:hover,.sbj-ghost:hover,.sbj-danger:hover{filter:brightness(1.03)}
.sbj-table-wrap{overflow:auto;border:0;border-radius:0;background:transparent}
.sbj-table{width:100%;border-collapse:collapse;min-width:620px;font-size:.86rem}
.sbj-table.sbj-chapter-table{min-width:740px}
.sbj-table th,.sbj-table td{padding:8px 10px;border-bottom:1px solid color-mix(in srgb,var(--border) 88%,transparent);text-align:left;vertical-align:middle}
.sbj-table th{position:sticky;top:0;background:var(--surface-strong);color:var(--text-muted);font-weight:600}
.sbj-hierarchy-table{table-layout:fixed}
.sbj-hierarchy-table th:nth-child(1),.sbj-hierarchy-table td:nth-child(1){width:31%}
.sbj-hierarchy-table th:nth-child(2),.sbj-hierarchy-table td:nth-child(2){width:auto}
.sbj-hierarchy-table th:nth-child(3),.sbj-hierarchy-table td:nth-child(3){width:94px}
.sbj-row-open-cell{cursor:pointer}
.sbj-row-open-cell:hover{color:color-mix(in srgb,var(--accent) 75%,var(--text))}
.sbj-node-parent .sbj-row-open-cell{display:flex;align-items:center;gap:8px}
.sbj-node-title{display:inline-flex;align-items:center;gap:8px;min-width:0}
.sbj-node-type{margin-left:6px;display:inline-flex;align-items:center;height:18px;padding:0 6px;border-radius:999px;background:color-mix(in srgb,var(--accent) 12%,var(--surface));color:color-mix(in srgb,var(--accent) 72%,var(--text));font-size:.66rem;font-weight:700;letter-spacing:.02em;text-transform:uppercase}
.sbj-node-depth-1 .sbj-row-open-cell{padding-left:20px;position:relative}
.sbj-node-depth-1 .sbj-row-open-cell::before{content:"";position:absolute;left:8px;top:0;bottom:0;width:1px;background:color-mix(in srgb,var(--border) 92%,transparent)}
.sbj-node-depth-1 .sbj-row-open-cell::after{content:"";position:absolute;left:8px;top:50%;width:9px;height:1px;background:color-mix(in srgb,var(--border) 92%,transparent)}
.sbj-expand-caret{display:inline-flex;transition:transform .2s ease;color:var(--text-muted);font-size:1rem;line-height:1}
.sbj-node-parent.is-expanded .sbj-expand-caret{transform:rotate(90deg);color:var(--text)}
.sbj-inline-row td{padding:0;border-bottom:0}
.sbj-inline-panel{max-height:0;opacity:0;overflow:hidden;transform:translateY(-4px);transition:max-height .26s ease,opacity .22s ease,transform .22s ease;background:transparent;border-left:2px solid color-mix(in srgb,var(--accent) 24%,var(--border));margin:4px 0 6px 14px;padding-left:10px}
.sbj-inline-panel.is-open{max-height:520px;opacity:1;transform:translateY(0)}
.sbj-inline-head{padding:4px 0 6px;font-size:.76rem;color:var(--text-muted);border:0;letter-spacing:.01em}
.sbj-inline-loading{padding:4px 0 8px;font-size:.78rem;color:var(--text-muted)}
.sbj-subtable{min-width:0}
.sbj-subtable td,.sbj-subtable th{padding:7px 8px}
.sbj-subtable .sbj-row-open-cell{font-size:.85rem}
.sbj-actions{display:flex;gap:6px;flex-wrap:wrap}
.sbj-rank-cell{display:inline-flex;align-items:center;gap:6px}
.sbj-rank-value{min-width:18px;font-weight:700;color:var(--text-muted);font-size:.8rem}
.sbj-rank-controls{display:inline-flex;align-items:center;gap:2px}
.sbj-rank-btn{width:20px;height:20px;border:0;background:transparent;color:var(--text-muted);padding:0;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;border-radius:6px}
.sbj-rank-btn svg{width:14px;height:14px}
.sbj-rank-btn:hover{background:color-mix(in srgb,var(--surface-soft) 78%,transparent);color:var(--text)}
.sbj-rank-btn:disabled{opacity:.35;cursor:not-allowed}
.sbj-input{height:33px;min-width:0;max-width:280px;width:100%;border:1px solid var(--border);border-radius:8px;background:var(--surface-soft);color:var(--text);padding:0 10px}
.sbj-number-input{max-width:120px}
.sbj-topic-name{max-width:360px}
.sbj-input.is-syncing{border-color:color-mix(in srgb,var(--accent) 65%,var(--border));background:color-mix(in srgb,var(--accent) 8%,var(--surface-soft))}
.sbj-file{max-width:220px;font-size:.8rem}
.sbj-thumb{width:42px;height:42px;border-radius:8px;object-fit:cover;border:1px solid var(--border);background:var(--surface)}
.sbj-subject-meta-grid{display:grid;grid-template-columns:minmax(220px,1fr) auto;gap:var(--space-2);align-items:end}
.sbj-subject-meta-grid label{display:grid;gap:4px;font-size:.82rem;color:var(--text-muted)}
.sbj-subject-thumb-wrap{position:relative;display:inline-flex;align-items:center;justify-content:center;min-width:34px;min-height:34px}
.sbj-image-slot-wrap{position:relative;display:inline-flex;align-items:center;justify-content:center;min-width:34px;min-height:34px}
.sbj-image-slot{display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border:0;background:transparent;color:var(--text-muted);cursor:pointer;padding:0;overflow:visible}
.sbj-image-slot:hover{color:var(--text)}
.sbj-image-slot:disabled{opacity:.58;cursor:not-allowed}
.sbj-image-icon{width:24px;height:24px;display:inline-flex}
.sbj-image-icon svg{width:100%;height:100%}
.sbj-thumb.sbj-thumb-node{width:34px;height:34px;border:1px solid var(--border);border-radius:8px}
.sbj-image-remove{position:absolute;top:-7px;right:-7px;width:16px;height:16px;border-radius:999px;border:1px solid color-mix(in srgb,#cc4a52 60%,var(--border));background:color-mix(in srgb,#cc4a52 88%,var(--surface));color:#fff;font-size:.68rem;line-height:1;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;padding:0}
.sbj-image-remove:hover{filter:brightness(1.06)}
.sbj-image-remove[hidden]{display:none!important}
.sbj-node-image-input{position:absolute;inset:0;opacity:0;pointer-events:none;width:0;height:0}
.sbj-inline-check{display:inline-flex;align-items:center;gap:6px;font-size:.78rem;color:var(--text-muted)}
.sbj-switch{min-height:38px;padding:0 10px;border:1px solid var(--border);border-radius:8px;background:var(--surface-soft);color:var(--text);font-size:.82rem}
.sbj-switch input{position:absolute;opacity:0;pointer-events:none}
.sbj-switch-track{position:relative;display:inline-flex;width:34px;height:18px;border-radius:999px;background:color-mix(in srgb,var(--border) 90%,var(--surface));transition:background .2s ease;flex:0 0 auto}
.sbj-switch-track::after{content:"";position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:999px;background:var(--surface);box-shadow:0 1px 3px color-mix(in srgb,#000 22%,transparent);transition:transform .2s ease}
.sbj-switch input:checked + .sbj-switch-track{background:color-mix(in srgb,var(--accent) 70%,var(--surface))}
.sbj-switch input:checked + .sbj-switch-track::after{transform:translateX(16px)}
.sbj-switch-label{font-weight:600;line-height:1.2}
.sbj-modal-media-row{display:flex;align-items:flex-end;justify-content:space-between;gap:10px;flex-wrap:wrap}
.sbj-modal-image-field{display:grid;gap:4px}
.sbj-modal-label{font-size:.84rem;color:var(--text-muted)}
.sbj-modal-image-slot-wrap{position:relative;display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px}
.sbj-modal-image-slot{width:38px;height:38px;border-radius:8px}
.sbj-modal-image-slot.has-image{color:transparent}
.sbj-modal-image-preview{width:38px;height:38px}
.sbj-empty{padding:var(--space-2);color:var(--text-muted)}
.sbj-content-grid{display:grid;gap:10px}
.sbj-content-item{border:1px solid color-mix(in srgb,var(--border) 86%,transparent);background:transparent;border-radius:8px;padding:10px;display:grid;gap:6px}
.sbj-notes-list{display:grid;gap:0}
.sbj-note-row{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:8px;align-items:start;padding:8px 0;border-bottom:1px solid color-mix(in srgb,var(--border) 90%,transparent)}
.sbj-note-row:last-child{border-bottom:0}
.sbj-note-index{min-width:20px;font-size:.82rem;line-height:1.4;color:var(--text-muted);font-weight:700;padding-top:2px}
.sbj-note-main{min-width:0;display:grid;gap:6px}
.sbj-note-body{min-width:0}
.sbj-note-body *{max-width:100%;overflow-wrap:anywhere}
.sbj-note-image{width:min(220px,100%);height:auto;max-height:160px;object-fit:contain;border:1px solid var(--border);border-radius:8px;background:color-mix(in srgb,var(--surface-soft) 72%,transparent)}
.sbj-note-actions{display:inline-flex;align-items:center;gap:3px}
.sbj-icon-btn{width:24px;height:24px;border:0;background:transparent;color:var(--text-muted);padding:0;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;border-radius:6px}
.sbj-icon-btn:hover{background:color-mix(in srgb,var(--surface-soft) 78%,transparent);color:var(--text)}
.sbj-icon-btn svg{width:15px;height:15px}
.sbj-icon-btn-delete{color:color-mix(in srgb,#c7484e 84%,var(--text-muted))}
.sbj-icon-btn-delete:hover{color:color-mix(in srgb,#c7484e 94%,var(--text))}
.sbj-content-columns{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;align-items:start}
.sbj-content-column{display:grid;gap:0}
.sbj-summary-single{display:grid;gap:10px}
.sbj-tabs{position:relative;display:flex;gap:2px;border-bottom:1px solid var(--border);margin-bottom:8px}
.sbj-tab{position:relative;z-index:2;height:34px;border:0;background:transparent;color:var(--text-muted);padding:0 12px;font-weight:600;cursor:pointer;border-radius:0}
.sbj-tab:hover{color:var(--text)}
.sbj-tab.is-active{color:var(--text)}
.sbj-tab-indicator{position:absolute;left:0;bottom:-1px;height:2px;width:0;background:var(--accent);border-radius:999px;transform:translateX(0);transition:transform .22s cubic-bezier(.22,.61,.36,1),width .22s cubic-bezier(.22,.61,.36,1)}
.sbj-tab-panel{display:grid;gap:10px}
.sbj-editor-toolbar{display:flex;align-items:center;flex-wrap:wrap;gap:4px;padding:4px;border:1px solid color-mix(in srgb,var(--border) 88%,transparent);border-radius:8px;background:transparent}
.sbj-tool-btn{height:28px;min-width:28px;padding:0 8px;border:1px solid transparent;border-radius:6px;background:transparent;color:var(--text-muted);cursor:pointer;font-weight:600;display:inline-flex;align-items:center;justify-content:center;gap:4px}
.sbj-tool-btn:hover{background:color-mix(in srgb,var(--surface-soft) 78%,transparent);color:var(--text);border-color:color-mix(in srgb,var(--border) 90%,transparent)}
.sbj-tool-btn.is-active{background:color-mix(in srgb,var(--accent) 17%,var(--surface));color:var(--text);border-color:color-mix(in srgb,var(--accent) 65%,var(--border))}
.sbj-tool-divider{width:1px;height:18px;background:color-mix(in srgb,var(--border) 88%,transparent);margin:0 2px}
.sbj-tool-image-btn{padding:0}
.sbj-editor{min-height:132px;border:1px solid var(--border);border-radius:8px;background:transparent;padding:10px;overflow:auto}
.sbj-editor:focus{outline:2px solid color-mix(in srgb,var(--accent) 35%,transparent);outline-offset:0}
.sbj-toolbar-light{align-items:flex-end}
.sbj-mcq-head-tools{display:inline-flex;align-items:center;gap:8px}
.sbj-mcq-count{font-size:.78rem;color:var(--text-muted);font-weight:600}
.sbj-collapsible{max-height:0;opacity:0;overflow:hidden;transform:translateY(-6px);transition:max-height .24s ease,opacity .2s ease,transform .2s ease}
.sbj-collapsible.is-open{max-height:940px;opacity:1;transform:translateY(0)}
.sbj-form-flat{border-top:1px dashed color-mix(in srgb,var(--border) 90%,transparent);padding-top:8px}
.sbj-mcq-form{display:grid;gap:10px}
.sbj-mcq-compose-head{display:grid;gap:8px}
.sbj-mcq-image-picker{min-width:34px;min-height:34px}
.sbj-mcq-image-preview{width:34px;height:34px;border-radius:8px;object-fit:cover;border:1px solid var(--border)}
.sbj-mcq-image-preview[hidden]{display:none!important}
.sbj-editor-lite{min-height:122px}
.sbj-mcq-options-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
.sbj-mcq-options-grid label{display:grid;gap:4px;font-size:.8rem;color:var(--text-muted)}
.sbj-mcq-options-grid label span{font-weight:700;color:var(--text-muted)}
.sbj-input.sbj-input-textarea{height:auto;min-height:58px;max-width:none;padding:7px 9px;resize:vertical}
.sbj-mcq-form-foot{display:flex;justify-content:space-between;align-items:flex-end;gap:8px;flex-wrap:wrap}
.sbj-mcq-correct{display:grid;gap:4px;font-size:.8rem;color:var(--text-muted)}
.sbj-mcq-correct select{height:32px;border:1px solid var(--border);border-radius:8px;background:var(--surface-soft);color:var(--text);padding:0 10px}
.sbj-mcq-columns{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;align-items:start}
.sbj-mcq-column{display:grid;gap:8px}
.sbj-mcq-item{display:grid;gap:5px;padding:7px 0;border:0;border-bottom:1px solid color-mix(in srgb,var(--border) 88%,transparent);border-radius:0;background:transparent}
.sbj-mcq-column .sbj-mcq-item:last-child{border-bottom:0}
.sbj-mcq-headline{display:flex;justify-content:space-between;align-items:flex-start;gap:8px}
.sbj-mcq-question{display:grid;grid-template-columns:auto 1fr;gap:6px;align-items:start;min-width:0}
.sbj-mcq-q-no{color:var(--text-muted);font-weight:700}
.sbj-mcq-item-image{width:100%;max-height:140px;object-fit:contain;border-radius:8px;border:1px solid var(--border);background:color-mix(in srgb,var(--surface-soft) 75%,transparent)}
.sbj-mcq-options{margin:0;padding:0;list-style:none;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px 12px}
.sbj-mcq-options li{display:grid;grid-template-columns:auto 1fr;gap:6px;align-items:start;min-width:0}
.sbj-mcq-opt-key{width:18px;height:18px;border-radius:999px;border:1px solid color-mix(in srgb,var(--accent) 58%,var(--border));display:inline-flex;align-items:center;justify-content:center;font-size:.68rem;font-weight:700;color:color-mix(in srgb,var(--accent) 72%,var(--text));line-height:1;flex:0 0 18px}
.sbj-mcq-foot{display:flex;justify-content:flex-start;align-items:center;gap:8px;flex-wrap:wrap}
.sbj-answer-btn{height:26px;border:1px solid var(--border);border-radius:8px;background:var(--surface-soft);color:var(--text);padding:0 9px;font-size:.76rem;font-weight:700;cursor:pointer}
.sbj-answer-btn:hover{border-color:color-mix(in srgb,var(--accent) 55%,var(--border))}
.sbj-mcq-answer{font-size:.78rem;color:color-mix(in srgb,#2f9a66 74%,var(--text));font-weight:700}
.sbj-mcq-answer[hidden]{display:none!important}
.sbj-mcq-divider{height:1px;background:color-mix(in srgb,var(--border) 88%,transparent);margin:2px 0 0}
.sbj-mcq-pager{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-top:4px}
.sbj-page-btn{height:30px;min-width:30px;border:1px solid var(--border);border-radius:7px;background:transparent;color:var(--text-muted);padding:0 8px;font-weight:600;cursor:pointer}
.sbj-page-btn:hover{border-color:color-mix(in srgb,var(--accent) 55%,var(--border));color:var(--text)}
.sbj-page-btn.is-active{background:color-mix(in srgb,var(--accent) 20%,var(--surface));border-color:color-mix(in srgb,var(--accent) 65%,var(--border));color:var(--text)}
.sbj-page-btn:disabled{opacity:.52;cursor:not-allowed}
.sbj-page-gap{padding:0 2px;color:var(--text-muted)}
.sbj-modal{position:fixed;inset:0;background:transparent;display:grid;place-items:center;padding:var(--space-2);opacity:0;visibility:hidden;transition:opacity .2s ease,visibility .2s step-end;z-index:95}
.sbj-modal.is-open{opacity:1;visibility:visible;transition:opacity .2s ease}
.sbj-modal-surface{width:min(520px,100%);background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:var(--space-3);display:grid;gap:var(--space-2)}
.sbj-modal-surface h3{margin:0;font-size:1rem}
.sbj-form{display:grid;gap:var(--space-2)}
.sbj-form label{display:grid;gap:4px;color:var(--text-muted);font-size:.84rem}
.sbj-form input[type="text"],.sbj-form input[type="file"],.sbj-form select{height:38px;border:1px solid var(--border);border-radius:8px;background:var(--surface-soft);color:var(--text);padding:0 10px}
.sbj-form-actions{display:flex;justify-content:flex-end;gap:var(--space-2);flex-wrap:wrap}
.sbj-msg{margin:0;min-height:19px;color:var(--text-muted);font-size:.82rem}
.sbj-toast-stack{position:fixed;top:82px;right:16px;display:grid;gap:8px;z-index:140;pointer-events:none}
.sbj-toast{min-width:170px;max-width:300px;padding:10px 12px;border-radius:10px;border:1px solid var(--border);background:var(--surface);color:var(--text);box-shadow:0 8px 20px color-mix(in srgb,#000 18%,transparent);opacity:0;transform:translateY(-8px);transition:opacity .2s ease,transform .2s ease}
.sbj-toast.is-visible{opacity:1;transform:translateY(0)}
.sbj-toast-success{border-color:color-mix(in srgb,#2f9a66 50%,var(--border));background:color-mix(in srgb,#2f9a66 13%,var(--surface))}
.sbj-toast-error{border-color:color-mix(in srgb,#cc4a52 55%,var(--border));background:color-mix(in srgb,#cc4a52 12%,var(--surface))}
@media (max-width:860px){.sbj-table{min-width:560px}.sbj-hierarchy-table th:nth-child(1),.sbj-hierarchy-table td:nth-child(1){width:38%}.sbj-hierarchy-table th:nth-child(3),.sbj-hierarchy-table td:nth-child(3){width:84px}.sbj-mcq-columns,.sbj-content-columns{grid-template-columns:1fr}}
@media (max-width:640px){.sbj-modal{place-items:end center}.sbj-editor{min-height:120px}.sbj-tab{padding:0 10px;font-size:.82rem}.sbj-mcq-options-grid{grid-template-columns:1fr}.sbj-modal-media-row{align-items:flex-start}}
`;
