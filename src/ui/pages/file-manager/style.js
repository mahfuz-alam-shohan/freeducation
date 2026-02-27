export const FILE_MANAGER_STYLE = `
.fm-wrap{display:grid;gap:10px;max-width:1200px;animation:fm-page-in .36s var(--motion-spring)}
.fm-header{display:flex;justify-content:space-between;align-items:flex-start;gap:8px;flex-wrap:wrap}
.fm-header h2{margin:0;font-size:1rem}
.fm-header p{margin:3px 0 0;color:var(--text-muted);font-size:.84rem}
.fm-chip{border:1px solid var(--border);padding:4px 8px;border-radius:999px;font-size:.78rem;background:var(--surface-soft);transition:transform .28s var(--motion-spring),background .25s ease}
.fm-filters{display:grid;grid-template-columns:repeat(3,minmax(180px,1fr));gap:8px;border:1px solid var(--border);background:var(--surface);padding:8px;border-radius:9px;animation:fm-rise .42s var(--motion-spring)}
.fm-filters label{display:grid;gap:4px;font-size:.8rem;color:var(--text-muted)}
.fm-filters select,.fm-filters input{height:34px;border:1px solid var(--border);background:var(--surface-soft);color:var(--text);border-radius:8px;padding:0 9px;font-size:.92rem;transition:border-color .2s ease,box-shadow .2s ease,transform .25s var(--motion-spring)}
.fm-filters select:focus,.fm-filters input:focus{outline:none;border-color:var(--accent);box-shadow:0 0 0 2px color-mix(in srgb,var(--accent) 20%,transparent);transform:translateY(-1px)}
.fm-filters select:disabled{opacity:.68;cursor:not-allowed}
.fm-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(164px,1fr));gap:6px}
.fm-item{border:1px solid var(--border);background:var(--surface);border-radius:9px;overflow:hidden;display:grid;grid-template-rows:auto 1fr;min-height:192px;opacity:0;transform:translateY(10px) scale(.98);animation:fm-card-in .44s var(--motion-spring) forwards;animation-delay:calc(var(--item-index,0) * 22ms)}
.fm-meta{padding:6px;border-bottom:1px solid var(--border);display:grid;gap:2px;background:var(--surface-soft);position:relative}
.fm-delete{position:absolute;top:5px;right:5px;display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:6px;border:1px solid var(--border);background:color-mix(in srgb,var(--surface) 90%,transparent);color:#ef9ea3;cursor:pointer;padding:0}
.fm-delete svg{width:14px;height:14px}
.fm-delete:hover{background:color-mix(in srgb,#ef9ea3 18%,var(--surface));border-color:color-mix(in srgb,#ef9ea3 42%,var(--border))}
.fm-delete:disabled{opacity:.58;cursor:wait}
.fm-name{font-size:.72rem;line-height:1.25;word-break:break-word;padding-right:26px}
.fm-detail{font-size:.69rem;color:var(--text-muted);display:flex;justify-content:space-between;gap:4px}
.fm-thumb{position:relative;min-height:124px;background:var(--surface-strong);display:grid;place-items:center;overflow:hidden}
.fm-thumb img,.fm-thumb video{width:100%;height:100%;object-fit:cover;display:block;transition:transform .55s var(--motion-smooth),filter .3s ease}
.fm-item:hover .fm-thumb img,.fm-item:hover .fm-thumb video{transform:scale(1.04);filter:saturate(1.08)}
.fm-pdf-icon{width:52px;height:52px;opacity:.86}
.fm-type-badge{position:absolute;right:6px;bottom:6px;font-size:.64rem;padding:2px 6px;border-radius:999px;background:color-mix(in srgb,var(--surface) 75%,transparent);border:1px solid var(--border)}
.fm-load-more{height:34px;justify-self:center;padding:0 14px;border:1px solid var(--border);background:var(--surface-soft);color:var(--text);border-radius:8px;cursor:pointer;transition:transform .25s var(--motion-spring),filter .2s ease}
.fm-load-more:hover{transform:translateY(-1px);filter:brightness(1.05)}
.fm-msg{margin:0;min-height:19px;color:var(--text-muted);font-size:.8rem}
@media (max-width:820px){.fm-filters{grid-template-columns:1fr}.fm-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:4px}.fm-item{border-radius:8px;min-height:184px}}
@media (max-width:620px){.fm-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.fm-meta{padding:5px}}
@keyframes fm-page-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes fm-rise{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
@keyframes fm-card-in{to{opacity:1;transform:translateY(0) scale(1)}}
`;
