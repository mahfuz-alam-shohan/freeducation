export const FILE_MANAGER_STYLE = `
.fm-wrap{display:grid;gap:var(--space-2);animation:fm-page-in .36s var(--motion-spring);--fm-radius:12px;--fm-shadow:0 12px 30px rgba(0,0,0,.16);--fm-shadow-hover:0 16px 34px rgba(0,0,0,.22)}
.fm-header{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-2);flex-wrap:wrap}
.fm-header h2{margin:0;font-size:1.05rem;font-weight:700;letter-spacing:.01em}
.fm-header p{margin:3px 0 0;color:var(--text-muted);font-size:.84rem}
.fm-chip{border:1px solid color-mix(in srgb,var(--accent) 25%,var(--border));padding:var(--space-1) var(--space-3);border-radius:999px;font-size:.76rem;font-weight:600;letter-spacing:.04em;text-transform:uppercase;background:linear-gradient(135deg,color-mix(in srgb,var(--accent) 16%,var(--surface-soft)),var(--surface-soft));box-shadow:inset 0 1px 0 rgba(255,255,255,.16);transition:transform .28s var(--motion-spring),background .25s ease}
.fm-filters{display:grid;grid-template-columns:repeat(3,minmax(180px,1fr));gap:var(--space-2);border:1px solid color-mix(in srgb,var(--border) 88%,var(--accent));background:linear-gradient(180deg,color-mix(in srgb,var(--surface) 92%,transparent),color-mix(in srgb,var(--surface-soft) 96%,transparent));padding:var(--space-2);border-radius:var(--fm-radius);animation:fm-rise .42s var(--motion-spring);box-shadow:var(--fm-shadow);backdrop-filter:blur(8px)}
.fm-filters label{display:grid;gap:4px;font-size:.74rem;color:var(--text-muted);letter-spacing:.04em;text-transform:uppercase}
.fm-filters select,.fm-filters input{height:35px;border:1px solid color-mix(in srgb,var(--border) 85%,var(--accent));background:color-mix(in srgb,var(--surface-soft) 94%,transparent);color:var(--text);border-radius:9px;padding:0 10px;font-size:.89rem;transition:border-color .2s ease,box-shadow .2s ease,transform .25s var(--motion-spring),background .2s ease;box-shadow:inset 0 1px 0 rgba(255,255,255,.08)}
.fm-filters select:focus,.fm-filters input:focus{outline:none;border-color:color-mix(in srgb,var(--accent) 68%,var(--border));box-shadow:0 0 0 2px color-mix(in srgb,var(--accent) 22%,transparent),inset 0 1px 0 rgba(255,255,255,.12);transform:translateY(-1px);background:color-mix(in srgb,var(--surface) 92%,transparent)}
.fm-filters select:disabled{opacity:.68;cursor:not-allowed}
.fm-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:var(--space-2)}
.fm-item{position:relative;aspect-ratio:1 / 1;border:1px solid color-mix(in srgb,var(--border) 86%,var(--accent));background:var(--surface);border-radius:var(--fm-radius);overflow:hidden;opacity:0;transform:translateY(10px) scale(.98);animation:fm-card-in .44s var(--motion-spring) forwards;animation-delay:calc(var(--item-index,0) * 22ms);isolation:isolate;box-shadow:var(--fm-shadow);transition:transform .28s var(--motion-spring),box-shadow .28s ease,border-color .24s ease}
.fm-item::before{content:'';position:absolute;inset:0;border-radius:inherit;border:1px solid color-mix(in srgb,var(--accent) 28%,transparent);opacity:0;transition:opacity .26s ease;pointer-events:none;z-index:4}
.fm-item::after{content:'';position:absolute;inset:-24% -14% auto;height:56%;background:radial-gradient(circle at 50% 50%,color-mix(in srgb,var(--accent) 16%,transparent),transparent 66%);opacity:.32;pointer-events:none;z-index:1}
.fm-item:hover{transform:translateY(-2px) scale(1.01);box-shadow:var(--fm-shadow-hover);border-color:color-mix(in srgb,var(--accent) 30%,var(--border))}
.fm-item:hover::before{opacity:1}
.fm-meta{position:absolute;left:0;right:0;bottom:0;z-index:2;padding:var(--space-2);display:grid;gap:3px;background:linear-gradient(180deg,rgba(7,11,17,0) 0%,rgba(7,11,17,.55) 38%,rgba(7,11,17,.94) 100%);backdrop-filter:blur(2px)}
.fm-delete{position:absolute;top:7px;right:7px;z-index:3;display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:8px;border:1px solid color-mix(in srgb,var(--border) 74%,rgba(255,255,255,.55));background:rgba(10,13,20,.54);color:#ffd0d4;cursor:pointer;padding:0;backdrop-filter:blur(4px);box-shadow:0 4px 10px rgba(0,0,0,.22);transition:transform .2s ease,background .2s ease,border-color .2s ease}
.fm-delete svg{width:14px;height:14px}
.fm-delete:hover{transform:translateY(-1px);background:color-mix(in srgb,#ef9ea3 20%,rgba(10,13,20,.6));border-color:color-mix(in srgb,#ef9ea3 45%,var(--border))}
.fm-delete:disabled{opacity:.58;cursor:wait}
.fm-name{font-size:.74rem;line-height:1.28;font-weight:650;word-break:break-word;color:#f8fbff;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;padding-right:36px;text-shadow:0 1px 2px rgba(0,0,0,.44)}
.fm-detail{font-size:.66rem;color:rgba(246,250,255,.86);display:flex;justify-content:space-between;gap:var(--space-1);text-shadow:0 1px 2px rgba(0,0,0,.34)}
.fm-thumb{position:absolute;inset:0;background:var(--surface-strong);display:grid;place-items:center;overflow:hidden}
.fm-thumb img,.fm-thumb video{width:100%;height:100%;object-fit:cover;display:block;transition:transform .55s var(--motion-smooth),filter .3s ease}
.fm-thumb::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(10,12,16,.2) 0%,rgba(10,12,16,.06) 26%,rgba(10,12,16,.4) 100%);z-index:1;pointer-events:none}
.fm-item:hover .fm-thumb img,.fm-item:hover .fm-thumb video{transform:scale(1.04);filter:saturate(1.08)}
.fm-pdf-icon{position:relative;z-index:2;width:52px;height:52px;opacity:.86}
.fm-type-badge{position:absolute;left:7px;top:7px;z-index:3;font-size:.62rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase;padding:3px var(--space-2);border-radius:999px;background:rgba(10,13,20,.5);border:1px solid color-mix(in srgb,var(--border) 74%,rgba(255,255,255,.45));color:#eef3ff;backdrop-filter:blur(4px);box-shadow:0 4px 10px rgba(0,0,0,.2)}
.fm-empty-card{aspect-ratio:auto;min-height:132px;display:grid;place-items:center;padding:var(--space-3);text-align:center;background:linear-gradient(145deg,var(--surface),color-mix(in srgb,var(--surface-soft) 94%,transparent));color:var(--text-muted)}
.fm-empty-card strong{color:var(--text);font-size:.86rem}
.fm-load-more{height:35px;justify-self:center;padding:0 14px;border:1px solid color-mix(in srgb,var(--accent) 26%,var(--border));background:linear-gradient(145deg,color-mix(in srgb,var(--surface-soft) 80%,var(--accent)),var(--surface-soft));color:var(--text);border-radius:9px;cursor:pointer;font-weight:600;letter-spacing:.01em;transition:transform .25s var(--motion-spring),filter .2s ease,border-color .22s ease;box-shadow:0 8px 20px rgba(0,0,0,.14),inset 0 1px 0 rgba(255,255,255,.14)}
.fm-load-more:hover{transform:translateY(-1px);filter:brightness(1.06);border-color:color-mix(in srgb,var(--accent) 42%,var(--border))}
.fm-msg{margin:0;min-height:19px;color:var(--text-muted);font-size:.8rem}
@media (max-width:820px){.fm-filters{grid-template-columns:1fr}.fm-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:var(--space-1)}.fm-item{border-radius:8px}}
@media (max-width:620px){.fm-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.fm-meta{padding:var(--space-1)}}
@keyframes fm-page-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes fm-rise{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
@keyframes fm-card-in{to{opacity:1;transform:translateY(0) scale(1)}}
`;
