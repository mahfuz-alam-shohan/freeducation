import { renderAppShellLayout } from "../../layout/appShell/index.js";
import { isEditableContentType, publicReaderModules } from "../../../shared/modules/contentModules.js";

const ACADEMICS_STYLE = `
.page-academics .app-content{
  position:relative;
  padding:10px var(--space-2) calc(var(--layout-mobile-nav-offset) + var(--space-2) + 4px);
  scroll-padding-bottom:calc(var(--layout-mobile-nav-offset) + 14px);
  background:var(--page-bg);
}
.acad-wrap{
  display:grid;
  gap:12px;
  padding:0;
  max-width:1140px;
  margin:0 auto 8px;
  border:0;
  border-radius:0;
  background:transparent;
  overflow:visible;
}
.acad-wrap::before{display:none}
.acad-wrap *{box-sizing:border-box}
.acad-head{
  position:relative;
  display:grid;
  grid-template-columns:minmax(0,1fr);
  justify-items:center;
  align-items:center;
  gap:4px;
  padding-bottom:2px;
}
.acad-head > div{text-align:center}
.acad-head h2{margin:0;font-size:1.14rem;line-height:1.22;text-align:center}
.acad-sub{margin:0;color:var(--text-muted);font-size:.84rem;text-align:center}
.acad-float-back{
  position:sticky;
  top:8px;
  left:0;
  z-index:12;
  width:34px;
  height:34px;
  min-width:34px;
  max-width:34px;
  min-height:34px;
  max-height:34px;
  margin:0 0 6px;
  padding:0;
  border-radius:999px;
  border:1px solid var(--border);
  background:color-mix(in srgb,var(--surface) 92%,var(--page-bg) 8%);
  color:var(--text);
  display:grid;
  place-items:center;
  text-decoration:none;
  cursor:pointer;
  font-size:1rem;
  line-height:1;
  box-sizing:border-box;
}
.app-content > .acad-float-back{
  position:absolute!important;
  top:8px;
  left:8px;
  width:34px!important;
  max-width:34px!important;
  min-width:34px!important;
  height:34px!important;
  max-height:34px!important;
  min-height:34px!important;
  justify-self:start!important;
  align-self:start!important;
  margin:0!important;
  z-index:20;
}
.acad-float-back:hover{border-color:color-mix(in srgb,var(--accent) 55%,var(--border));background:color-mix(in srgb,var(--surface-soft) 82%,var(--surface) 18%)}
.acad-float-back:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
@keyframes acad-card-in{
  from{opacity:0;transform:translate3d(0,10px,0) scale(.985)}
  to{opacity:1;transform:translate3d(0,0,0) scale(1)}
}
.acad-card-grid,
.acad-root-grid{
  --acad-card-width:172px;
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(var(--acad-card-width),var(--acad-card-width)));
  justify-content:center;
  align-content:start;
  gap:11px;
}
.acad-card-grid > *,
.acad-root-grid > *{
  animation:acad-card-in .36s cubic-bezier(.22,.61,.36,1) both;
}
.acad-card-grid > :nth-child(2),
.acad-root-grid > :nth-child(2){animation-delay:.03s}
.acad-card-grid > :nth-child(3),
.acad-root-grid > :nth-child(3){animation-delay:.06s}
.acad-card-grid > :nth-child(4),
.acad-root-grid > :nth-child(4){animation-delay:.09s}
.acad-card-grid > :nth-child(5),
.acad-root-grid > :nth-child(5){animation-delay:.12s}
.acad-card-link,
.acad-root-card{
  display:grid;
  gap:0;
  text-decoration:none;
  color:inherit;
  border:0;
  border-radius:0;
  padding:0;
  background:transparent;
  cursor:pointer;
  min-width:0;
  max-width:100%;
  width:100%;
  transition:none;
}
.acad-root-card{appearance:none;-webkit-appearance:none;text-align:left;font:inherit;line-height:inherit}
.acad-card-link:hover,
.acad-root-card:hover{
  transform:none;
  border-color:transparent;
  background:transparent;
}
.acad-poster{
  position:relative;
  aspect-ratio:2/3;
  border-radius:12px;
  overflow:hidden;
  border:1px solid var(--border);
  background:
    linear-gradient(165deg,color-mix(in srgb,var(--surface-strong) 84%,var(--surface-soft) 16%),color-mix(in srgb,var(--accent) 18%,var(--surface-soft) 82%));
}
.acad-poster::after{
  content:'';
  position:absolute;
  inset:0;
  pointer-events:none;
  background:
    linear-gradient(180deg,transparent 58%,color-mix(in srgb,var(--text) 14%,transparent) 100%);
}
.acad-poster img{display:block;width:100%;height:100%;max-width:100%;object-fit:cover;object-position:center}
.acad-poster-fallback{
  position:absolute;
  inset:0;
  display:grid;
  place-items:center;
  font-size:1rem;
  font-weight:800;
  letter-spacing:.03em;
  color:var(--accent-contrast);
  background:linear-gradient(145deg,color-mix(in srgb,var(--accent) 70%,var(--surface) 30%),color-mix(in srgb,var(--accent) 48%,var(--surface-strong) 52%));
}
.acad-card-name{
  margin:0;
  padding:7px 2px 0;
  font-size:.86rem;
  line-height:1.25;
  color:var(--text);
  white-space:normal;
  overflow:hidden;
  display:-webkit-box;
  -webkit-line-clamp:2;
  -webkit-box-orient:vertical;
  min-height:2.5em;
}
.acad-card-meta{margin:0;padding:1px 2px 0;font-size:.73rem;color:var(--text-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.acad-empty{margin:0;padding:13px;border:1px dashed color-mix(in srgb,var(--border) 82%,transparent);border-radius:10px;color:var(--text-muted);background:color-mix(in srgb,var(--surface-soft) 56%,transparent)}
.acad-root-grid{
  max-height:2000px;
  transition:opacity .3s cubic-bezier(.22,.61,.36,1),transform .3s cubic-bezier(.22,.61,.36,1),max-height .34s cubic-bezier(.22,.61,.36,1),margin .34s cubic-bezier(.22,.61,.36,1);
}
.acad-root-grid.is-collapsing{opacity:0;transform:translateY(-10px);pointer-events:none}
.acad-root-grid.is-collapsed{opacity:0;transform:translateY(-10px);max-height:0;margin:0;overflow:hidden;pointer-events:none}
.acad-child-area{display:grid;gap:12px}
.acad-child-area[hidden]{display:none!important}
.acad-child-group{
  display:grid;
  gap:10px;
  opacity:0;
  transform:translateY(-10px);
  transition:opacity .28s cubic-bezier(.22,.61,.36,1),transform .28s cubic-bezier(.22,.61,.36,1);
  border:0;
  border-radius:0;
  padding:0;
  background:transparent;
}
.acad-child-group.is-visible{opacity:1;transform:translateY(0)}
.acad-child-head{display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap}
.acad-child-head h3{margin:0;font-size:.95rem}
.acad-chip{height:29px;border:1px solid var(--border);border-radius:999px;padding:0 11px;background:var(--surface-soft);color:var(--text);font-weight:700;cursor:pointer}
.acad-chip:hover{border-color:color-mix(in srgb,var(--accent) 55%,var(--border))}
.acad-chapter-card .acad-poster{aspect-ratio:4/3}
.acad-notes{display:grid;gap:8px}
.acad-note{display:grid;gap:5px;padding:8px;border:1px solid color-mix(in srgb,var(--border) 84%,transparent);border-radius:10px;background:color-mix(in srgb,var(--surface-soft) 52%,transparent);min-width:0;overflow:hidden}
.acad-note *{max-width:100%;overflow-wrap:anywhere}
.acad-note img,.acad-note video,.acad-note iframe{max-width:100%;height:auto;border-radius:8px;border:1px solid var(--border)}
.acad-notes-list{display:grid;gap:0}
.acad-note-row{display:grid;grid-template-columns:auto minmax(0,1fr);gap:8px;align-items:start;padding:9px 0;border-bottom:1px solid color-mix(in srgb,var(--border) 88%,transparent)}
.acad-note-row:last-child{border-bottom:0}
.acad-note-index{min-width:20px;font-size:.81rem;line-height:1.45;color:var(--text-muted);font-weight:700;padding-top:1px}
.acad-note-body{min-width:0}
.acad-note-body *{max-width:100%;overflow-wrap:anywhere}
.acad-note-body img,.acad-note-body video,.acad-note-body iframe{max-width:100%;height:auto;border-radius:8px;border:1px solid var(--border)}
.acad-content-columns{position:relative;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;align-items:start}
.acad-content-columns::before{
  content:'';
  position:absolute;
  top:0;
  bottom:0;
  left:50%;
  width:2px;
  transform:translateX(-50%);
  background:color-mix(in srgb,var(--border) 78%,var(--accent) 22%);
  pointer-events:none;
}
.acad-content-col{display:grid;gap:0}
.acad-tabs{display:flex;gap:5px;flex-wrap:nowrap;justify-content:center;overflow-x:auto;overflow-y:hidden;border-bottom:1px solid color-mix(in srgb,var(--border) 82%,transparent);padding-bottom:6px;scrollbar-width:thin;-webkit-overflow-scrolling:touch}
.acad-tab-btn{height:30px;flex:0 0 auto;white-space:nowrap;border:1px solid transparent;border-radius:999px;background:transparent;color:var(--text-muted);padding:0 11px;font-weight:700;cursor:pointer;font-size:.8rem}
.acad-tab-btn:hover{background:color-mix(in srgb,var(--surface-soft) 82%,transparent);color:var(--text)}
.acad-tab-btn.is-active{background:color-mix(in srgb,var(--accent) 14%,var(--surface));color:var(--text);border-color:color-mix(in srgb,var(--accent) 55%,var(--border))}
.acad-tab-panel{display:none;gap:7px;padding-top:7px;padding-bottom:8px}
.acad-tab-panel.is-active{display:grid}
.acad-tab-panel[hidden]{display:none!important}
.acad-mcq{display:grid;gap:5px;padding:8px 0;border:0;border-bottom:1px solid color-mix(in srgb,var(--border) 86%,transparent);border-radius:0}
.acad-content-col .acad-mcq:last-child{border-bottom:0}
.acad-mcq *{max-width:100%;overflow-wrap:anywhere}
.acad-mcq-q{display:grid;grid-template-columns:auto 1fr;gap:6px;align-items:start;margin:0}
.acad-mcq-q-no{color:var(--text-muted);font-weight:700}
.acad-mcq-opts{margin:0;padding:0;list-style:none;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px 12px}
.acad-mcq-opts li{display:grid;grid-template-columns:auto 1fr;gap:6px;align-items:start;min-width:0}
.acad-mcq-opt-key{width:18px;height:18px;border-radius:999px;border:1px solid color-mix(in srgb,var(--accent) 58%,var(--border));display:inline-flex;align-items:center;justify-content:center;font-size:.68rem;font-weight:700;color:color-mix(in srgb,var(--accent) 72%,var(--text));line-height:1;flex:0 0 18px}
.acad-mcq img,.acad-mcq video,.acad-mcq iframe{max-width:100%;height:auto}
.acad-mcq-foot{display:flex;align-items:center;justify-content:flex-start;gap:8px;flex-wrap:wrap;margin-top:1px}
.acad-answer-btn{height:27px;border:1px solid var(--border);border-radius:999px;background:var(--surface-soft);color:var(--text);padding:0 10px;font-size:.75rem;font-weight:700;cursor:pointer}
.acad-answer-btn:hover{border-color:color-mix(in srgb,var(--accent) 55%,var(--border))}
.acad-mcq-answer{margin:0;font-size:.78rem;color:color-mix(in srgb,#2f9a66 74%,var(--text));font-weight:700}
.acad-pager{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-top:4px}
.acad-page-btn{height:30px;min-width:30px;border:1px solid var(--border);border-radius:999px;background:transparent;color:var(--text-muted);padding:0 9px;font-weight:700;cursor:pointer}
.acad-page-btn:hover{border-color:color-mix(in srgb,var(--accent) 55%,var(--border));color:var(--text)}
.acad-page-btn.is-active{background:color-mix(in srgb,var(--accent) 20%,var(--surface));border-color:color-mix(in srgb,var(--accent) 65%,var(--border));color:var(--text)}
.acad-page-btn:disabled{opacity:.52;cursor:not-allowed}
.acad-page-gap{padding:0 2px;color:var(--text-muted)}
.acad-reader-block{display:grid;gap:10px;min-width:0;padding:0;border:0;border-radius:0;background:transparent}
.acad-reader-block h3{margin:0;font-size:.93rem;text-align:center}
.acad-admin-panelbar{display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;padding:8px;border:1px dashed color-mix(in srgb,var(--accent) 36%,var(--border));border-radius:8px;background:color-mix(in srgb,var(--accent) 8%,var(--surface))}
.acad-admin-badge{font-size:.72rem;font-weight:800;letter-spacing:.03em;color:color-mix(in srgb,var(--accent) 74%,var(--text))}
.acad-admin-tools{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.acad-admin-btn{height:28px;border:1px solid var(--border);border-radius:7px;background:var(--surface-soft);color:var(--text);padding:0 9px;font-size:.74rem;font-weight:700;cursor:pointer}
.acad-admin-btn:hover{border-color:color-mix(in srgb,var(--accent) 60%,var(--border))}
.acad-admin-btn-danger{border-color:color-mix(in srgb,#cc4a52 60%,var(--border));color:color-mix(in srgb,#cc4a52 82%,var(--text));background:color-mix(in srgb,#cc4a52 8%,var(--surface))}
.acad-admin-item-tools{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-top:6px}
.acad-admin-modal{position:fixed;inset:0;z-index:150;display:grid;place-items:center;padding:14px;background:color-mix(in srgb,var(--overlay) 86%,transparent)}
.acad-admin-modal[hidden]{display:none!important}
.acad-admin-modal-surface{width:min(760px,100%);max-height:86vh;overflow:auto;background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:12px;display:grid;gap:10px}
.acad-admin-modal-head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.acad-admin-modal-head h3{margin:0;font-size:1rem}
.acad-admin-close{height:30px;min-width:30px;border:1px solid var(--border);border-radius:8px;background:var(--surface-soft);color:var(--text);font-size:1rem;line-height:1;cursor:pointer}
.acad-admin-form{display:grid;gap:8px}
.acad-admin-field{display:grid;gap:4px}
.acad-admin-field label{font-size:.78rem;color:var(--text-muted);font-weight:700}
.acad-admin-field textarea,.acad-admin-field select{width:100%;border:1px solid var(--border);border-radius:8px;background:var(--surface-soft);color:var(--text);padding:8px}
.acad-admin-field textarea{min-height:88px;resize:vertical}
.acad-admin-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
.acad-admin-grid[hidden]{display:none!important}
.acad-admin-actions{display:flex;justify-content:flex-end;gap:8px;flex-wrap:wrap}
.acad-admin-msg{margin:0;min-height:18px;font-size:.78rem;color:var(--text-muted)}
.acad-side-section{display:grid;gap:8px}
.acad-side-title{margin:0;font-size:.84rem;letter-spacing:.05em;text-transform:uppercase;color:var(--text-muted)}
.acad-side-list{display:grid;gap:5px}
.acad-side-link{
  display:block;
  padding:5px 2px 5px 10px;
  border:0;
  border-left:2px solid transparent;
  border-radius:0;
  background:none;
  color:var(--text);
  text-decoration:none;
  min-height:28px;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
}
.acad-side-link:hover{
  border-left-color:color-mix(in srgb,var(--accent) 46%,var(--border));
  background:none;
}
.acad-side-link.is-active{
  border-left-color:color-mix(in srgb,var(--accent) 66%,var(--border));
  background:none;
}
.acad-side-link-name{font-size:.84rem;font-weight:700;line-height:1.3;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.acad-side-link-meta{display:none}
.acad-exam-fab{
  position:fixed!important;
  top:calc(var(--layout-header-offset-mobile) + env(safe-area-inset-top,0px) + 8px);
  right:max(10px,env(safe-area-inset-right,0px));
  bottom:auto;
  left:auto!important;
  z-index:91;
  height:34px;
  padding:0 13px;
  border-radius:999px;
  border:1px solid color-mix(in srgb,var(--accent) 70%,var(--border));
  background:color-mix(in srgb,var(--accent) 90%,var(--accent-contrast) 10%);
  color:var(--accent-contrast);
  text-decoration:none;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  font-weight:800;
  letter-spacing:.01em;
  width:auto!important;
  max-width:max-content!important;
  min-width:unset!important;
  margin:0!important;
  transform:translateZ(0);
  box-sizing:border-box;
}
.acad-exam-fab:hover{filter:brightness(1.03)}
@media (max-width:760px){
  .page-academics .app-content{padding:8px var(--space-2) calc(var(--layout-mobile-nav-offset) + var(--space-2) + 2px)}
  .acad-wrap{padding:0;border-radius:0}
  .acad-head{gap:7px}
  .acad-card-grid,.acad-root-grid{--acad-card-width:120px;gap:8px}
  .acad-card-link,.acad-root-card{padding:0;border-radius:0}
  .acad-card-name{font-size:.79rem;padding-top:5px;min-height:2.35em}
  .acad-card-meta{font-size:.66rem}
  .acad-poster{border-radius:9px}
  .acad-content-columns{grid-template-columns:1fr}
  .acad-content-columns::before{display:none}
  .acad-admin-grid{grid-template-columns:1fr}
}
@media (min-width:900px){
  .page-academics .app-content{
    padding:0 var(--space-2) calc(var(--layout-desktop-status-h) + var(--space-3) + 12px);
    scroll-padding-bottom:calc(var(--layout-desktop-status-h) + 24px);
  }
  .app-content > .acad-float-back{
    top:6px;
    left:6px;
  }
}
@media (min-width:900px){.acad-exam-fab{top:calc(var(--layout-header-offset-desktop) + env(safe-area-inset-top,0px) + 8px)!important}}
@media (max-width:460px){.acad-card-grid,.acad-root-grid{--acad-card-width:108px}}
@media (max-width:760px) and (orientation:portrait){
  .acad-subject-grid,.acad-book-grid{--acad-card-width:112px;gap:6px}
  .acad-subject-grid .acad-poster,.acad-book-grid .acad-poster{border-radius:8px}
  .acad-subject-grid .acad-card-name,.acad-book-grid .acad-card-name{font-size:.73rem;padding-top:4px}
  .acad-subject-grid .acad-card-meta,.acad-book-grid .acad-card-meta{font-size:.63rem}
}
@media (prefers-reduced-motion:reduce){
  .acad-card-grid > *,
  .acad-root-grid > *,
  .acad-root-grid,
  .acad-card-link,
  .acad-root-card,
  .acad-child-group{
    animation:none!important;
    transition:none!important;
    transform:none!important;
  }
}
`;

const ACADEMICS_SCRIPT = `
(() => {
  const previousController = window.__acadPublicController;
  if (previousController && typeof previousController.abort === 'function') {
    previousController.abort();
  }
  const listenerController = new AbortController();
  window.__acadPublicController = listenerController;
  const { signal } = listenerController;
  if (typeof window.__registerCleanup === 'function') {
    window.__registerCleanup(() => {
      if (window.__acadPublicController === listenerController) {
        window.__acadPublicController = null;
      }
      listenerController.abort();
    });
  }

  const buildPageTokens = (totalPages, currentPage) => {
    const total = Math.max(1, Number(totalPages || 1));
    const current = Math.min(Math.max(1, Number(currentPage || 1)), total);
    const tokens = [];
    if (total <= 9) {
      for (let p = 1; p <= total; p += 1) tokens.push(p);
      return tokens;
    }
    tokens.push(1);
    if (current > 4) tokens.push('...');
    for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p += 1) {
      tokens.push(p);
    }
    if (current < total - 3) tokens.push('...');
    tokens.push(total);
    return tokens;
  };

  const activatePanelPage = (panel, panelKey, page) => {
    if (!panel || !panelKey) return;
    const blocks = Array.from(panel.querySelectorAll('[data-page-block="' + panelKey + '"]'));
    if (!blocks.length) return;
    const total = blocks.length;
    const parsed = Number.parseInt(String(page || '1'), 10);
    const target = Number.isInteger(parsed) && parsed > 0 ? Math.min(parsed, total) : 1;
    blocks.forEach((block) => {
      const blockPage = Number.parseInt(String(block.getAttribute('data-page') || '1'), 10) || 1;
      const active = blockPage === target;
      block.hidden = !active;
      block.classList.toggle('is-active', active);
    });

    const pager = panel.querySelector('[data-pager="' + panelKey + '"]');
    if (!pager) return;
    const tokensWrap = pager.querySelector('[data-page-tokens]');
    if (tokensWrap) {
      tokensWrap.innerHTML = buildPageTokens(total, target).map((token) => {
        if (token === '...') return '<span class="acad-page-gap">...</span>';
        const pageNumber = Number(token);
        const active = pageNumber === target;
        return '<button type="button" class="acad-page-btn ' + (active ? 'is-active' : '') + '" data-action="acad-page" data-panel-key="' + panelKey + '" data-page="' + pageNumber + '"' + (active ? ' aria-current="page"' : '') + '>' + pageNumber + '</button>';
      }).join('');
    }

    const prev = pager.querySelector('[data-nav="prev"]');
    if (prev) {
      const prevPage = Math.max(1, target - 1);
      prev.setAttribute('data-page', String(prevPage));
      prev.disabled = target <= 1;
    }
    const next = pager.querySelector('[data-nav="next"]');
    if (next) {
      const nextPage = Math.min(total, target + 1);
      next.setAttribute('data-page', String(nextPage));
      next.disabled = target >= total;
    }
  };

  const adminModal = document.getElementById('acadAdminEditor');
  const adminForm = document.getElementById('acadAdminForm');
  const adminMsg = document.getElementById('acadAdminMsg');
  const adminBodyInput = document.getElementById('acadAdminBody');
  const adminBodyLabel = adminForm?.querySelector('label[for="acadAdminBody"]') || null;
  const adminMcqFields = document.getElementById('acadAdminMcqFields');
  const adminOptA = document.getElementById('acadAdminOptA');
  const adminOptB = document.getElementById('acadAdminOptB');
  const adminOptC = document.getElementById('acadAdminOptC');
  const adminOptD = document.getElementById('acadAdminOptD');
  const adminCorrect = document.getElementById('acadAdminCorrect');
  const adminEnabled = Boolean(adminModal && adminForm);

  const setAdminMsg = (text) => {
    if (!adminMsg) return;
    adminMsg.textContent = String(text || '');
  };

  const adminBodyMetaForType = (contentType) => {
    const normalized = String(contentType || '').trim().toLowerCase();
    if (normalized === 'mcq_bank') {
      return { label: 'Question', placeholder: 'Write question...' };
    }
    if (normalized === 'summary') {
      return { label: 'Summary', placeholder: 'Write summary...' };
    }
    if (normalized === 'short_notes') {
      return { label: 'Short note', placeholder: 'Write short note...' };
    }
    return { label: 'Body', placeholder: 'Write content...' };
  };

  const reloadCurrentPage = () => {
    const href = window.location.pathname + window.location.search + window.location.hash;
    if (typeof window.__appNavigate === 'function') {
      window.__appNavigate(href, { push: false, motion: 'forward' });
      return;
    }
    window.location.href = href;
  };

  const adminApiRequest = async (path, options = {}) => {
    const response = await fetch('/api/workspace' + String(path || ''), {
      ...options,
      signal,
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload?.error || 'Request failed');
    return payload;
  };

  const readAdminContext = (actionEl) => {
    const panel = actionEl?.closest?.('[data-admin-content-type]');
    if (!panel) return null;
    const subjectId = Number.parseInt(String(panel.getAttribute('data-admin-subject-id') || '0'), 10);
    const contextType = String(panel.getAttribute('data-admin-context-type') || '').trim().toLowerCase();
    const contextId = Number.parseInt(String(panel.getAttribute('data-admin-context-id') || '0'), 10);
    const contentType = String(panel.getAttribute('data-admin-content-type') || '').trim().toLowerCase();
    const contentLabel = String(panel.getAttribute('data-admin-content-label') || contentType || 'Content').trim();
    const panelMode = String(panel.getAttribute('data-admin-panel-mode') || 'rich').trim().toLowerCase();
    if (!subjectId || !contextId || !contextType || !contentType) return null;
    return { panel, subjectId, contextType, contextId, contentType, contentLabel, panelMode };
  };

  const closeAdminModal = () => {
    if (!adminModal || !adminForm) return;
    adminModal.hidden = true;
    adminModal.setAttribute('aria-hidden', 'true');
    adminForm.reset();
    if (adminBodyLabel) adminBodyLabel.textContent = 'Body';
    if (adminBodyInput) adminBodyInput.placeholder = 'Write content...';
    setAdminMsg('');
  };

  const openAdminModal = (state = {}) => {
    if (!adminModal || !adminForm) return;
    adminForm.elements.subjectId.value = String(Number(state?.subjectId || 0));
    adminForm.elements.contextType.value = String(state?.contextType || '');
    adminForm.elements.contextId.value = String(Number(state?.contextId || 0));
    adminForm.elements.contentType.value = String(state?.contentType || '');
    adminForm.elements.panelMode.value = String(state?.panelMode || 'rich');
    adminForm.elements.itemId.value = String(Number(state?.itemId || 0));
    if (adminBodyInput) adminBodyInput.value = String(state?.body || '');
    const bodyMeta = adminBodyMetaForType(state?.contentType);
    if (adminBodyLabel) adminBodyLabel.textContent = bodyMeta.label;
    if (adminBodyInput) adminBodyInput.placeholder = bodyMeta.placeholder;
    if (adminOptA) adminOptA.value = String(state?.optA || '');
    if (adminOptB) adminOptB.value = String(state?.optB || '');
    if (adminOptC) adminOptC.value = String(state?.optC || '');
    if (adminOptD) adminOptD.value = String(state?.optD || '');
    if (adminCorrect) adminCorrect.value = String(state?.correctOption || 'A').toUpperCase();

    const titleEl = document.getElementById('acadAdminTitle');
    if (titleEl) {
      const modeText = Number(state?.itemId || 0) > 0 ? 'Edit' : 'Add';
      titleEl.textContent = modeText + ' ' + String(state?.contentLabel || 'content');
    }

    const showMcq = String(state?.contentType || '').trim().toLowerCase() === 'mcq_bank';
    if (adminMcqFields) adminMcqFields.hidden = !showMcq;
    if (!showMcq) {
      if (adminOptA) adminOptA.value = '';
      if (adminOptB) adminOptB.value = '';
      if (adminOptC) adminOptC.value = '';
      if (adminOptD) adminOptD.value = '';
      if (adminCorrect) adminCorrect.value = 'A';
    }
    adminModal.hidden = false;
    adminModal.setAttribute('aria-hidden', 'false');
    setAdminMsg('');
  };

  const findItemForEdit = async (ctx, itemId) => {
    const path = '/subjects/' + ctx.subjectId
      + '/content-items?contextType=' + encodeURIComponent(ctx.contextType)
      + '&contextId=' + encodeURIComponent(String(ctx.contextId))
      + '&contentType=' + encodeURIComponent(ctx.contentType);
    const payload = await adminApiRequest(path);
    const items = Array.isArray(payload?.items) ? payload.items : [];
    const requestedId = Number(itemId || 0);
    if (requestedId > 0) {
      return items.find((item) => Number(item?.id || 0) === requestedId) || null;
    }
    return items[0] || null;
  };

  const rootGrid = document.getElementById('acadRootGrid');
  const childArea = document.getElementById('acadChildArea');
  if (rootGrid && childArea) {
    const rootCards = Array.from(rootGrid.querySelectorAll('[data-root-id]'));
    const groups = Array.from(childArea.querySelectorAll('[data-root-group]'));
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let collapseTimer = 0;

    const hideGroups = () => {
      groups.forEach((group) => {
        group.hidden = true;
        group.classList.remove('is-visible');
      });
      childArea.hidden = true;
    };

    const revealGroup = (rootId) => {
      let matched = false;
      groups.forEach((group) => {
        const isMatch = String(group.getAttribute('data-root-group') || '') === String(rootId);
        group.hidden = !isMatch;
        if (isMatch) matched = true;
      });
      childArea.hidden = !matched;
      if (!matched) return;

      const show = () => {
        groups.forEach((group) => {
          const isMatch = String(group.getAttribute('data-root-group') || '') === String(rootId);
          group.classList.toggle('is-visible', isMatch);
        });
      };
      if (reduceMotion) {
        show();
      } else {
        window.requestAnimationFrame(show);
      }
    };

    const clearSelection = () => {
      if (collapseTimer) {
        window.clearTimeout(collapseTimer);
        collapseTimer = 0;
      }
      rootGrid.classList.remove('has-selection', 'is-collapsing', 'is-collapsed');
      rootCards.forEach((card) => card.classList.remove('is-selected'));
      hideGroups();
    };

    const selectRoot = (rootId) => {
      if (!rootId) return;
      if (collapseTimer) {
        window.clearTimeout(collapseTimer);
        collapseTimer = 0;
      }
      rootGrid.classList.add('has-selection');
      rootCards.forEach((card) => {
        card.classList.toggle('is-selected', String(card.getAttribute('data-root-id') || '') === String(rootId));
      });
      hideGroups();

      if (reduceMotion) {
        rootGrid.classList.add('is-collapsed');
        revealGroup(rootId);
        return;
      }

      rootGrid.classList.remove('is-collapsed');
      rootGrid.classList.add('is-collapsing');
      collapseTimer = window.setTimeout(() => {
        collapseTimer = 0;
        rootGrid.classList.remove('is-collapsing');
        rootGrid.classList.add('is-collapsed');
        revealGroup(rootId);
      }, 210);
    };

    rootGrid.addEventListener('click', (event) => {
      const card = event.target.closest('[data-root-id]');
      if (!card) return;
      selectRoot(card.getAttribute('data-root-id'));
    }, { signal });
    childArea.addEventListener('click', (event) => {
      const resetBtn = event.target.closest('[data-action="acad-reset-root"]');
      if (!resetBtn) return;
      clearSelection();
    }, { signal });

    if (typeof window.__registerCleanup === 'function') {
      window.__registerCleanup(() => {
        if (collapseTimer) {
          window.clearTimeout(collapseTimer);
          collapseTimer = 0;
        }
      });
    }

    clearSelection();
  }

  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    const backBtn = event.target.closest('[data-action="acad-history-back"]');
    if (!backBtn) return;
    event.preventDefault();
    const fallbackHref = String(backBtn.getAttribute('data-fallback-href') || '/');
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    if (typeof window.__appNavigate === 'function') {
      window.__appNavigate(fallbackHref);
      return;
    }
    window.location.href = fallbackHref;
  }, { signal });

  if (adminEnabled) {
    const adminCloseBtn = document.getElementById('acadAdminClose');
    const adminCancelBtn = document.getElementById('acadAdminCancel');
    adminCloseBtn?.addEventListener('click', closeAdminModal, { signal });
    adminCancelBtn?.addEventListener('click', closeAdminModal, { signal });
    adminModal?.addEventListener('click', (event) => {
      if (event.target === adminModal) closeAdminModal();
    }, { signal });

    adminForm?.addEventListener('submit', async (event) => {
      event.preventDefault();
      const subjectId = Number.parseInt(String(adminForm.elements.subjectId.value || '0'), 10);
      const contextType = String(adminForm.elements.contextType.value || '').trim().toLowerCase();
      const contextId = Number.parseInt(String(adminForm.elements.contextId.value || '0'), 10);
      const contentType = String(adminForm.elements.contentType.value || '').trim().toLowerCase();
      const panelMode = String(adminForm.elements.panelMode.value || 'rich').trim().toLowerCase();
      const itemId = Number.parseInt(String(adminForm.elements.itemId.value || '0'), 10);
      if (!subjectId || !contextType || !contextId || !contentType) return;

      const bodyValue = String(adminBodyInput?.value || '').trim();
      if (!bodyValue) {
        setAdminMsg('Body is required.');
        return;
      }

      const payload = {
        contentType,
        contextType,
        contextId,
        body: bodyValue,
      };
      if (contentType === 'mcq_bank') {
        payload.options = [
          String(adminOptA?.value || '').trim(),
          String(adminOptB?.value || '').trim(),
          String(adminOptC?.value || '').trim(),
          String(adminOptD?.value || '').trim(),
        ];
        payload.correctOption = String(adminCorrect?.value || 'A').trim().toUpperCase();
        const hasMissing = payload.options.some((option) => !option);
        if (hasMissing) {
          setAdminMsg('All MCQ options are required.');
          return;
        }
      }

      try {
        setAdminMsg(itemId > 0 ? 'Updating content...' : 'Adding content...');
        if (itemId > 0) {
          await adminApiRequest('/subjects/' + subjectId + '/content-items/' + itemId, {
            method: 'PATCH',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(payload),
          });
        } else {
          await adminApiRequest('/subjects/' + subjectId + '/content-items', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(payload),
          });
        }
        closeAdminModal();
        reloadCurrentPage();
      } catch (error) {
        if (error?.name === 'AbortError') return;
        setAdminMsg(error?.message || 'Unable to save content.');
      }
    }, { signal });
  }

  const tabsWrap = document.querySelector('[data-acad-tabs]');
  if (tabsWrap) {
    const buttons = Array.from(tabsWrap.querySelectorAll('[data-tab-key]'));
    const readerBlock = tabsWrap.closest('.acad-reader-block');
    const panels = Array.from((readerBlock || document).querySelectorAll('[data-tab-panel]'));
    const tabQueryKey = 'tab';
    const tabKeys = buttons
      .map((btn) => String(btn.getAttribute('data-tab-key') || '').trim())
      .filter(Boolean);
    let activeTabKey = '';
    const isValidTabKey = (key) => tabKeys.includes(String(key || '').trim());
    const readTabFromUrl = () => {
      try {
        const url = new URL(window.location.href);
        return String(url.searchParams.get(tabQueryKey) || '').trim();
      } catch {
        return '';
      }
    };
    const writeTabToUrl = (key, mode = 'replace') => {
      const selected = String(key || '').trim();
      if (!isValidTabKey(selected)) return;
      if (!window.history || typeof window.history.pushState !== 'function') return;
      try {
        const url = new URL(window.location.href);
        url.searchParams.set(tabQueryKey, selected);
        const nextHref = url.pathname + url.search + url.hash;
        const currentHref = window.location.pathname + window.location.search + window.location.hash;
        if (nextHref === currentHref) return;
        if (mode === 'push') {
          window.history.pushState({ acadTab: selected }, '', nextHref);
        } else {
          window.history.replaceState({ acadTab: selected }, '', nextHref);
        }
      } catch {
        // Ignore URL update failures; tab switching remains functional.
      }
    };
    const activate = (key, options = {}) => {
      const selected = isValidTabKey(key) ? String(key).trim() : '';
      if (!selected) return;
      const pushUrl = Boolean(options?.pushUrl);
      const syncUrl = options?.syncUrl !== false;
      if (activeTabKey === selected && !syncUrl) return;
      activeTabKey = selected;
      buttons.forEach((btn) => {
        const active = String(btn.getAttribute('data-tab-key') || '') === selected;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      panels.forEach((panel) => {
        const isMatch = String(panel.getAttribute('data-tab-panel') || '') === selected;
        panel.hidden = !isMatch;
        panel.classList.toggle('is-active', isMatch);
      });
      if (syncUrl) {
        writeTabToUrl(selected, pushUrl ? 'push' : 'replace');
      }
    };
    tabsWrap.addEventListener('click', (event) => {
      const btn = event.target.closest('[data-tab-key]');
      if (!btn) return;
      activate(btn.getAttribute('data-tab-key'), { syncUrl: true, pushUrl: true });
    }, { signal });
    const firstKey = String(buttons[0]?.getAttribute('data-tab-key') || '');
    const urlTab = readTabFromUrl();
    const initialKey = isValidTabKey(urlTab) ? urlTab : firstKey;
    if (initialKey) activate(initialKey, { syncUrl: true, pushUrl: false });
    window.addEventListener('popstate', () => {
      const nextKey = readTabFromUrl();
      if (isValidTabKey(nextKey)) {
        activate(nextKey, { syncUrl: false });
        return;
      }
      if (firstKey) activate(firstKey, { syncUrl: false });
    }, { signal });
  }

  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;

    if (adminEnabled) {
      const addBtn = event.target.closest('[data-action="acad-admin-add-item"]');
      if (addBtn) {
        event.preventDefault();
        if (typeof event.stopImmediatePropagation === 'function') event.stopImmediatePropagation();
        else event.stopPropagation();
        const ctx = readAdminContext(addBtn);
        if (!ctx) return;
        const itemCount = Number.parseInt(String(ctx.panel?.getAttribute('data-admin-item-count') || '0'), 10) || 0;
        if (ctx.contentType === 'summary' && itemCount > 0) {
          const firstItemId = Number(ctx.panel?.getAttribute('data-admin-first-item-id') || 0);
          openAdminModal({
            ...ctx,
            itemId: firstItemId,
            body: '',
            correctOption: 'A',
          });
          setAdminMsg('Loading summary...');
          findItemForEdit(ctx, firstItemId).then((item) => {
            if (!item) {
              setAdminMsg('Summary not found.');
              return;
            }
            openAdminModal({
              ...ctx,
              itemId: Number(item?.id || 0),
              body: String(item?.body || ''),
              correctOption: 'A',
            });
          }).catch((error) => {
            if (error?.name === 'AbortError') return;
            setAdminMsg(error?.message || 'Unable to load summary.');
          });
          return;
        }
        openAdminModal({
          ...ctx,
          itemId: 0,
          body: '',
          optA: '',
          optB: '',
          optC: '',
          optD: '',
          correctOption: 'A',
        });
        return;
      }

      const editBtn = event.target.closest('[data-action="acad-admin-edit-item"]');
      if (editBtn) {
        event.preventDefault();
        if (typeof event.stopImmediatePropagation === 'function') event.stopImmediatePropagation();
        else event.stopPropagation();
        const ctx = readAdminContext(editBtn);
        const itemId = Number.parseInt(String(editBtn.getAttribute('data-item-id') || '0'), 10);
        if (!ctx || !itemId) return;
        openAdminModal({
          ...ctx,
          itemId,
          body: '',
          optA: '',
          optB: '',
          optC: '',
          optD: '',
          correctOption: 'A',
        });
        setAdminMsg('Loading content...');
        findItemForEdit(ctx, itemId).then((item) => {
          if (!item) {
            setAdminMsg('Content not found.');
            return;
          }
          openAdminModal({
            ...ctx,
            itemId,
            body: String(item?.body || ''),
            optA: String(item?.options?.[0] || ''),
            optB: String(item?.options?.[1] || ''),
            optC: String(item?.options?.[2] || ''),
            optD: String(item?.options?.[3] || ''),
            correctOption: String(item?.correctOption || 'A'),
          });
        }).catch((error) => {
          if (error?.name === 'AbortError') return;
          setAdminMsg(error?.message || 'Unable to load content.');
        });
        return;
      }

      const deleteBtn = event.target.closest('[data-action="acad-admin-delete-item"]');
      if (deleteBtn) {
        event.preventDefault();
        if (typeof event.stopImmediatePropagation === 'function') event.stopImmediatePropagation();
        else event.stopPropagation();
        const ctx = readAdminContext(deleteBtn);
        const itemId = Number.parseInt(String(deleteBtn.getAttribute('data-item-id') || '0'), 10);
        if (!ctx || !itemId) return;
        if (!window.confirm('Delete this content item?')) return;
        adminApiRequest('/subjects/' + ctx.subjectId + '/content-items/' + itemId, {
          method: 'DELETE',
        }).then(() => {
          reloadCurrentPage();
        }).catch((error) => {
          if (error?.name === 'AbortError') return;
          if (typeof window.__showAppStatus === 'function') {
            window.__showAppStatus(error?.message || 'Unable to delete content.', 'error', 2200);
          }
        });
        return;
      }
    }

    const pageBtn = event.target.closest('[data-action="acad-page"]');
    if (pageBtn) {
      event.preventDefault();
      if (typeof event.stopImmediatePropagation === 'function') event.stopImmediatePropagation();
      else event.stopPropagation();
      const panelKey = String(pageBtn.getAttribute('data-panel-key') || '');
      const page = Number.parseInt(String(pageBtn.getAttribute('data-page') || '1'), 10) || 1;
      const panel = pageBtn.closest('[data-tab-panel]');
      activatePanelPage(panel, panelKey, page);
      return;
    }

    const toggle = event.target.closest('[data-action="acad-toggle-answer"]');
    if (!toggle) return;
    event.preventDefault();
    if (typeof event.stopImmediatePropagation === 'function') event.stopImmediatePropagation();
    else event.stopPropagation();
    const container = toggle.closest('.acad-mcq');
    const answer = container?.querySelector('[data-mcq-answer]');
    if (!answer) return;
    const show = answer.hidden;
    answer.hidden = !show;
    toggle.setAttribute('aria-expanded', show ? 'true' : 'false');
    toggle.textContent = show ? 'Hide answer' : 'Show answer';
  }, { signal, capture: true });
})();
`;

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function initialsFromName(name) {
  const safeName = String(name || "").trim();
  return safeName.split(/\s+/).map((part) => part.slice(0, 1).toUpperCase()).join("").slice(0, 3) || "NA";
}

function sectionHeadingMeta(node = {}) {
  const label = String(node?.displayName || node?.serverName || "Section").trim() || "Section";
  const normalized = label.toLowerCase();
  const chapterLike = normalized === "chapter" || normalized === "chapters";
  if (chapterLike) {
    return {
      subtitle: "Chapters",
      title: "Chapters",
    };
  }
  return {
    subtitle: `${label} | Chapters`,
    title: `${label} Chapters`,
  };
}

function cardMarkup({ href = "", name = "", imageUrl = "", meta = "", cardClass = "" } = {}) {
  const title = String(name || "").trim() || "Untitled";
  const safeHref = String(href || "").trim();
  const poster = String(imageUrl || "").trim()
    ? `<div class="acad-poster"><img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(title)}" loading="lazy" decoding="async" /></div>`
    : `<div class="acad-poster"><span class="acad-poster-fallback">${escapeHtml(initialsFromName(title))}</span></div>`;
  const body = `${poster}<p class="acad-card-name">${escapeHtml(title)}</p>${meta ? `<p class="acad-card-meta">${escapeHtml(meta)}</p>` : ""}`;
  if (safeHref) {
    return `<a class="acad-card-link ${escapeHtml(cardClass)}" href="${escapeHtml(safeHref)}">${body}</a>`;
  }
  return `<div class="acad-card-link ${escapeHtml(cardClass)}">${body}</div>`;
}

function examFab(subjectId, options = {}) {
  const id = Number(subjectId || 0);
  if (!id) return "";
  const contextType = String(options?.contextType || "").trim().toLowerCase();
  const contextId = Number.parseInt(String(options?.contextId || ""), 10);
  const params = new URLSearchParams();
  if (contextType && Number.isInteger(contextId) && contextId > 0) {
    params.set("contextType", contextType);
    params.set("contextId", String(contextId));
  }
  const query = params.toString();
  const href = query ? `/subjects/${id}/exam?${query}` : `/subjects/${id}/exam`;
  return `<a class="acad-exam-fab" href="${escapeHtml(href)}">Exam</a>`;
}

function hasRichInlineMarkup(value) {
  const text = String(value || "").trim();
  if (!text) return false;
  if (/<[a-z][\s\S]*>/i.test(text)) return true;
  return false;
}

function normalizeInlineBlockWrappers(value) {
  const raw = String(value || "").trim();
  if (!raw || (!/<div\b/i.test(raw) && !/<p\b/i.test(raw))) return raw;
  const compactRaw = raw.replace(/\s+/g, "");
  const blocks = raw.match(/<(?:div|p)\b[^>]*>[\s\S]*?<\/(?:div|p)>/gi);
  if (!Array.isArray(blocks) || !blocks.length) return raw;
  const compactBlocks = blocks.join("").replace(/\s+/g, "");
  if (compactBlocks !== compactRaw) return raw;
  return blocks
    .map((block) => block
      .replace(/^<(?:div|p)\b[^>]*>/i, "")
      .replace(/<\/(?:div|p)>$/i, "")
      .trim())
    .filter(Boolean)
    .join(" ");
}

function richDisplayValue(value) {
  const raw = String(value || "");
  if (!raw) return "";
  if (hasRichInlineMarkup(raw)) {
    return normalizeInlineBlockWrappers(raw);
  }
  return escapeHtml(raw)
    .replaceAll("\r\n", "\n")
    .replaceAll("\r", "\n")
    .replaceAll("\n", "<br>");
}

function floatingBackButton(fallbackHref = "/") {
  return `<button type="button" class="acad-float-back" data-action="acad-history-back" data-fallback-href="${escapeHtml(fallbackHref)}" aria-label="Go back" title="Go back">&larr;</button>`;
}

function renderShell({ title, user, navItems, homePath, content, rightSidebar = "" }) {
  return renderAppShellLayout({
    title,
    activeMenu: "home",
    user,
    navItems,
    homePath,
    pageClass: "page-home page-academics",
    pageStyles: ACADEMICS_STYLE,
    contentClass: "app-content-flush",
    shellScope: "public",
    content,
    rightSidebar,
    script: ACADEMICS_SCRIPT,
  });
}

function isAdminUser(user) {
  return String(user?.user_type || "").trim().toLowerCase() === "administrator";
}

function adminEditorModalMarkup(enabled = false) {
  if (!enabled) return "";
  return `<section id="acadAdminEditor" class="acad-admin-modal" role="dialog" aria-modal="true" aria-hidden="true" hidden><div class="acad-admin-modal-surface"><header class="acad-admin-modal-head"><h3 id="acadAdminTitle">Edit content</h3><button id="acadAdminClose" class="acad-admin-close" type="button" aria-label="Close editor">x</button></header><form id="acadAdminForm" class="acad-admin-form" autocomplete="off"><input type="hidden" name="subjectId" value="0" /><input type="hidden" name="contextType" value="" /><input type="hidden" name="contextId" value="0" /><input type="hidden" name="contentType" value="" /><input type="hidden" name="panelMode" value="rich" /><input type="hidden" name="itemId" value="0" /><div class="acad-admin-field"><label for="acadAdminBody">Body</label><textarea id="acadAdminBody" name="body" placeholder="Write content..."></textarea></div><div id="acadAdminMcqFields" class="acad-admin-grid" hidden><div class="acad-admin-field"><label for="acadAdminOptA">Option A</label><textarea id="acadAdminOptA" name="optA"></textarea></div><div class="acad-admin-field"><label for="acadAdminOptB">Option B</label><textarea id="acadAdminOptB" name="optB"></textarea></div><div class="acad-admin-field"><label for="acadAdminOptC">Option C</label><textarea id="acadAdminOptC" name="optC"></textarea></div><div class="acad-admin-field"><label for="acadAdminOptD">Option D</label><textarea id="acadAdminOptD" name="optD"></textarea></div><div class="acad-admin-field"><label for="acadAdminCorrect">Correct option</label><select id="acadAdminCorrect" name="correctOption"><option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option></select></div></div><p id="acadAdminMsg" class="acad-admin-msg" role="status" aria-live="polite"></p><div class="acad-admin-actions"><button id="acadAdminCancel" class="acad-admin-btn" type="button">Cancel</button><button class="acad-admin-btn" type="submit">Save</button></div></form></div></section>`;
}

function sidebarSectionMarkup(title, items = []) {
  const rows = (Array.isArray(items) ? items : [])
    .map((item) => ({
      href: String(item?.href || "").trim(),
      name: String(item?.name || "").trim(),
      meta: String(item?.meta || "").trim(),
      active: Boolean(item?.active),
    }))
    .filter((item) => item.href && item.name);
  if (!rows.length) return "";
  return `<article class="app-right-card acad-side-section"><h3 class="acad-side-title">${escapeHtml(title)}</h3><nav class="acad-side-list">${rows.map((item) => `<a class="acad-side-link${item.active ? " is-active" : ""}" href="${escapeHtml(item.href)}"${item.active ? ` aria-current="page"` : ""}><span class="acad-side-link-name">${escapeHtml(item.name)}</span></a>`).join("")}</nav></article>`;
}

function subjectFlowRightSidebar({ subjectName = "", sections = [] } = {}) {
  const blocks = (Array.isArray(sections) ? sections : [])
    .map((section) => sidebarSectionMarkup(section?.title || "Items", section?.items || []))
    .filter(Boolean);
  const heading = String(subjectName || "").trim() || "Subject";
  const emptyState = `<article class="app-right-card"><p>No linked items yet.</p></article>`;
  return `<aside id="appRightSidebar" class="app-right-sidebar" aria-label="Subject navigation"><section class="app-right-rail"><article class="app-right-card"><p class="app-right-eyebrow">Quick Navigation</p><h2>${escapeHtml(heading)}</h2><p>Jump directly to other parts from this subject flow.</p></article>${blocks.length ? blocks.join("") : emptyState}</section></aside>`;
}

export function classSubjectsPage({ user, navItems, homePath, classItem, subjects = [] } = {}) {
  const className = String(classItem?.name || "").trim() || "Class";
  const rows = Array.isArray(subjects) ? subjects : [];
  const cards = rows.length
    ? `<div class="acad-card-grid acad-subject-grid">${rows.map((subject) => cardMarkup({
      href: `/subjects/${Number(subject?.id || 0)}`,
      name: subject?.name || "Subject",
      imageUrl: subject?.thumbnailUrl || "",
    })).join("")}</div>`
    : `<p class="acad-empty">No subjects found for this class.</p>`;
  const rightSidebar = subjectFlowRightSidebar({
    subjectName: className,
    sections: [
      {
        title: "Subjects",
        items: rows.map((subject) => ({
          href: `/subjects/${Number(subject?.id || 0)}`,
          name: subject?.name || "Subject",
        })),
      },
    ],
  });
  const content = `${floatingBackButton("/classes")}<section class="acad-wrap"><header class="acad-head"><div><h2>${escapeHtml(className)}</h2><p class="acad-sub">Subjects in this class</p></div></header>${cards}</section>`;
  return renderShell({
    title: `${className} Subjects`,
    user,
    navItems,
    homePath,
    content,
    rightSidebar,
  });
}

export function publicSubjectPage({ user, navItems, homePath, subject, roots = [], childrenByRoot = [] } = {}) {
  const safeSubject = subject || {};
  const className = String(safeSubject?.className || "").trim();
  const classId = Number(safeSubject?.classId || 0);
  const backHref = classId > 0 ? `/classes/${classId}` : "/classes";
  const rootCards = roots.length
    ? roots.map((root) => `<button type="button" class="acad-root-card" data-root-id="${Number(root?.id || 0)}">${cardMarkup({
      name: root?.displayName || root?.serverName || "Book",
      imageUrl: root?.imageUrl || "",
    })}</button>`).join("")
    : `<p class="acad-empty">No books found for this subject.</p>`;

  const groupMap = new Map((Array.isArray(childrenByRoot) ? childrenByRoot : []).map((group) => [Number(group?.rootId || 0), Array.isArray(group?.items) ? group.items : []]));
  const childGroups = roots.map((root) => {
    const children = groupMap.get(Number(root?.id || 0)) || [];
    const cards = children.length
      ? `<div class="acad-card-grid">${children.map((child) => cardMarkup({
        href: `/subjects/${Number(safeSubject?.id || 0)}/sections/${Number(child?.id || 0)}`,
        name: child?.displayName || child?.serverName || "Section",
        imageUrl: child?.imageUrl || "",
      })).join("")}</div>`
      : `<p class="acad-empty">No sections available under this book.</p>`;
    return `<section class="acad-child-group" data-root-group="${Number(root?.id || 0)}" hidden><header class="acad-child-head"><h3>${escapeHtml(root?.displayName || root?.serverName || "Book")}</h3><button type="button" class="acad-chip" data-action="acad-reset-root">Back to books</button></header>${cards}</section>`;
  }).join("");

  const sectionItems = (Array.isArray(childrenByRoot) ? childrenByRoot : [])
    .flatMap((group) => (Array.isArray(group?.items) ? group.items : []))
    .map((child) => ({
      href: `/subjects/${Number(safeSubject?.id || 0)}/sections/${Number(child?.id || 0)}`,
      name: child?.displayName || child?.serverName || "Section",
    }));
  const rightSidebar = subjectFlowRightSidebar({
    subjectName: safeSubject?.name || "Subject",
    sections: [
      {
        title: "Sections",
        items: sectionItems,
      },
    ],
  });

  const content = `${floatingBackButton(backHref)}<section class="acad-wrap"><header class="acad-head"><div><h2>${escapeHtml(safeSubject?.name || "Subject")}</h2><p class="acad-sub">${escapeHtml(className || "Subject")} | Select a book</p></div></header><div id="acadRootGrid" class="acad-root-grid acad-book-grid">${rootCards}</div><div id="acadChildArea" class="acad-child-area" hidden>${childGroups}</div></section>${examFab(safeSubject?.id)}`;
  return renderShell({
    title: String(safeSubject?.name || "Subject"),
    user,
    navItems,
    homePath,
    content,
    rightSidebar,
  });
}

export function publicSectionPage({ user, navItems, homePath, subject, node, chapters = [] } = {}) {
  const safeSubject = subject || {};
  const safeNode = node || {};
  const headingMeta = sectionHeadingMeta(safeNode);
  const backHref = `/subjects/${Number(safeSubject?.id || 0)}`;
  const rows = Array.isArray(chapters) ? chapters : [];
  const cards = rows.length
    ? `<div class="acad-card-grid">${rows.map((chapter) => cardMarkup({
      href: `/subjects/${Number(safeSubject?.id || 0)}/chapters/${Number(chapter?.id || 0)}`,
      name: chapter?.name || "Chapter",
      imageUrl: chapter?.imageUrl || "",
      meta: chapter?.chapterNumber ? `Chapter ${chapter.chapterNumber}` : "Chapter",
      cardClass: "acad-chapter-card",
    })).join("")}</div>`
    : `<p class="acad-empty">No chapters added yet.</p>`;
  const rightSidebar = subjectFlowRightSidebar({
    subjectName: safeSubject?.name || "Subject",
    sections: [
      {
        title: "Chapters",
        items: rows.map((chapter) => ({
          href: `/subjects/${Number(safeSubject?.id || 0)}/chapters/${Number(chapter?.id || 0)}`,
          name: chapter?.name || "Chapter",
          meta: chapter?.chapterNumber ? `Chapter ${chapter.chapterNumber}` : "",
        })),
      },
    ],
  });
  const content = `${floatingBackButton(backHref)}<section class="acad-wrap"><header class="acad-head"><div><h2>${escapeHtml(safeSubject?.name || "Subject")}</h2><p class="acad-sub">${escapeHtml(headingMeta.subtitle)}</p></div></header>${cards}</section>${examFab(safeSubject?.id, { contextType: "node", contextId: safeNode?.id })}`;
  return renderShell({
    title: headingMeta.title,
    user,
    navItems,
    homePath,
    content,
    rightSidebar,
  });
}

function adminItemToolsMarkup(item = {}, options = {}) {
  const isAdmin = Boolean(options?.isAdmin);
  const editable = Boolean(options?.editable);
  if (!isAdmin || !editable) return "";
  const itemId = Number(item?.id || 0);
  if (!itemId) return "";
  return `<div class="acad-admin-item-tools"><button type="button" class="acad-admin-btn" data-action="acad-admin-edit-item" data-item-id="${itemId}">Edit</button><button type="button" class="acad-admin-btn acad-admin-btn-danger" data-action="acad-admin-delete-item" data-item-id="${itemId}">Delete</button></div>`;
}

function richItemMarkup(item = {}, options = {}) {
  const body = String(item?.body || "").trim();
  const imageUrl = String(item?.imageUrl || "").trim();
  if (!body && !imageUrl) return "";
  return `<article class="acad-note">${imageUrl ? `<img src="${escapeHtml(imageUrl)}" alt="Content" loading="lazy" decoding="async" />` : ""}${richDisplayValue(body)}${adminItemToolsMarkup(item, options)}</article>`;
}

function shortNoteItemMarkup(item = {}, index = 0, options = {}) {
  const body = String(item?.body || "").trim();
  const imageUrl = String(item?.imageUrl || "").trim();
  if (!body && !imageUrl) return "";
  return `<article class="acad-note-row"><span class="acad-note-index">${index + 1}.</span><div class="acad-note-body">${richDisplayValue(body)}${imageUrl ? `<img src="${escapeHtml(imageUrl)}" alt="Short note" loading="lazy" decoding="async" />` : ""}${adminItemToolsMarkup(item, options)}</div></article>`;
}

function mcqItemMarkup(item = {}, index = 0, options = {}) {
  const itemOptions = Array.isArray(item?.options) ? item.options : [];
  const correctOption = String(item?.correctOption || "").trim().toUpperCase();
  return `<article class="acad-mcq"><p class="acad-mcq-q"><span class="acad-mcq-q-no">${index + 1}.</span><span>${richDisplayValue(item?.body || "")}</span></p>${item?.imageUrl ? `<img src="${escapeHtml(item.imageUrl)}" alt="MCQ" loading="lazy" decoding="async" />` : ""}<ul class="acad-mcq-opts">${itemOptions.map((option, optionIndex) => `<li><span class="acad-mcq-opt-key">${String.fromCharCode(65 + optionIndex)}</span><span>${richDisplayValue(option || "")}</span></li>`).join("")}</ul><div class="acad-mcq-foot"><button type="button" class="acad-answer-btn" data-action="acad-toggle-answer" aria-expanded="false">Show answer</button><p class="acad-mcq-answer" data-mcq-answer hidden>Answer: ${escapeHtml(correctOption || "Not set")}</p>${adminItemToolsMarkup(item, options)}</div></article>`;
}

function buildPageTokens(totalPages, currentPage) {
  const total = Math.max(1, Number(totalPages || 1));
  const current = Math.min(Math.max(1, Number(currentPage || 1)), total);
  const tokens = [];
  if (total <= 9) {
    for (let p = 1; p <= total; p += 1) tokens.push(p);
    return tokens;
  }
  tokens.push(1);
  if (current > 4) tokens.push("...");
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p += 1) {
    tokens.push(p);
  }
  if (current < total - 3) tokens.push("...");
  tokens.push(total);
  return tokens;
}

function pagerMarkup(panelKey, totalPages, currentPage = 1, label = "Pages") {
  if (totalPages <= 1) return "";
  const safeCurrent = Math.min(Math.max(1, Number(currentPage || 1)), totalPages);
  const tokens = buildPageTokens(totalPages, safeCurrent);
  return `<nav class="acad-pager" data-pager="${escapeHtml(panelKey)}" aria-label="${escapeHtml(label)}"><button type="button" class="acad-page-btn" data-action="acad-page" data-nav="prev" data-panel-key="${escapeHtml(panelKey)}" data-page="${Math.max(1, safeCurrent - 1)}"${safeCurrent === 1 ? " disabled" : ""}>Prev</button><span data-page-tokens>${tokens.map((token) => {
    if (token === "...") return `<span class="acad-page-gap">...</span>`;
    const page = Number(token);
    const active = page === safeCurrent;
    return `<button type="button" class="acad-page-btn ${active ? "is-active" : ""}" data-action="acad-page" data-panel-key="${escapeHtml(panelKey)}" data-page="${page}"${active ? " aria-current=\"page\"" : ""}>${page}</button>`;
  }).join("")}</span><button type="button" class="acad-page-btn" data-action="acad-page" data-nav="next" data-panel-key="${escapeHtml(panelKey)}" data-page="${Math.min(totalPages, safeCurrent + 1)}"${safeCurrent >= totalPages ? " disabled" : ""}>Next</button></nav>`;
}

function pagedColumnsMarkup(panelKey, rows = [], itemRenderer, pagerLabel, renderOptions = {}) {
  const items = Array.isArray(rows) ? rows : [];
  const totalPages = Math.max(1, Math.ceil(items.length / 40));
  let blocks = "";
  for (let page = 1; page <= totalPages; page += 1) {
    const start = (page - 1) * 40;
    const pageItems = items.slice(start, start + 40);
    const leftItems = pageItems.slice(0, 20);
    const rightItems = pageItems.slice(20, 40);
    const left = leftItems.map((item, index) => itemRenderer(item, start + index, renderOptions)).join("");
    const right = rightItems.map((item, index) => itemRenderer(item, start + 20 + index, renderOptions)).join("");
    blocks += `<div class="acad-page-block${page === 1 ? " is-active" : ""}" data-page-block="${escapeHtml(panelKey)}" data-page="${page}"${page === 1 ? "" : " hidden"}><div class="acad-content-columns"><div class="acad-content-col">${left || `<p class="acad-empty">No content added yet.</p>`}</div><div class="acad-content-col">${right}</div></div></div>`;
  }
  return `${blocks}${pagerMarkup(panelKey, totalPages, 1, pagerLabel)}`;
}

function tabPanelMarkup(panelKey, items = [], mode = "rich", active = false, options = {}) {
  const rows = Array.isArray(items) ? items : [];
  const stateClass = active ? "acad-tab-panel is-active" : "acad-tab-panel";
  const hiddenAttr = active ? "" : " hidden";
  const subjectId = Number(options?.subjectId || 0);
  const contextType = String(options?.contextType || "").trim().toLowerCase();
  const contextId = Number(options?.contextId || 0);
  const contentType = String(options?.contentType || "").trim().toLowerCase();
  const contentLabel = String(options?.contentLabel || contentType || "Content").trim();
  const panelMode = String(options?.panelMode || mode || "rich").trim().toLowerCase();
  const firstItemId = Number(rows[0]?.id || 0);
  const panelAttrs = ` data-admin-subject-id="${subjectId}" data-admin-context-type="${escapeHtml(contextType)}" data-admin-context-id="${contextId}" data-admin-content-type="${escapeHtml(contentType)}" data-admin-content-label="${escapeHtml(contentLabel)}" data-admin-panel-mode="${escapeHtml(panelMode)}" data-admin-item-count="${rows.length}" data-admin-first-item-id="${firstItemId}"`;
  const addButtonLabel = contentType === "summary" && rows.length > 0
    ? "Edit Summary"
    : ("Add " + contentLabel);
  const adminBar = options?.isAdmin && options?.editable
    ? `<div class="acad-admin-panelbar"><span class="acad-admin-badge">ADMIN QUICK EDIT</span><div class="acad-admin-tools"><button type="button" class="acad-admin-btn" data-action="acad-admin-add-item">${escapeHtml(addButtonLabel)}</button></div></div>`
    : "";
  if (!rows.length) {
    return `<section class="${stateClass}" data-tab-panel="${escapeHtml(panelKey)}"${hiddenAttr}${panelAttrs}>${adminBar}<p class="acad-empty">No content added yet.</p></section>`;
  }
  const content = mode === "mcq"
    ? pagedColumnsMarkup(panelKey, rows, (item, index, renderOptions) => mcqItemMarkup(item, index, renderOptions), "MCQ pages", options)
    : mode === "short"
      ? pagedColumnsMarkup(panelKey, rows, (item, index, renderOptions) => shortNoteItemMarkup(item, index, renderOptions), "Short notes pages", options)
      : rows.map((item) => richItemMarkup(item, options)).join("");
  return `<section class="${stateClass}" data-tab-panel="${escapeHtml(panelKey)}"${hiddenAttr}${panelAttrs}>${adminBar}${content}</section>`;
}

export function publicChapterPage({
  user,
  navItems,
  homePath,
  subject,
  node,
  chapter,
  chapters = [],
  topics = [],
  contentModules = [],
  contentItemsByType = {},
} = {}) {
  const adminMode = isAdminUser(user);
  const safeSubject = subject || {};
  const safeNode = node || {};
  const safeChapter = chapter || {};
  const chapterTopics = Array.isArray(topics) ? topics : [];
  const chapterSiblings = Array.isArray(chapters) ? chapters : [];
  const mapFromPayload = (contentItemsByType && typeof contentItemsByType === "object") ? contentItemsByType : {};
  const inferredModules = publicReaderModules(Object.keys(mapFromPayload));
  const readerModules = (Array.isArray(contentModules) && contentModules.length ? contentModules : inferredModules)
    .map((item) => ({
      key: String(item?.key || "").trim().toLowerCase(),
      label: String(item?.label || "").trim() || String(item?.key || ""),
      tabKey: String(item?.tabKey || item?.key || "").trim().toLowerCase(),
      panelMode: String(item?.panelMode || "rich").trim().toLowerCase(),
      editable: isEditableContentType(item?.key),
    }))
    .filter((item, index, list) => item.key && item.tabKey && list.findIndex((entry) => entry.tabKey === item.tabKey) === index);

  const getItemsForType = (type) => {
    const key = String(type || "").trim().toLowerCase();
    const direct = mapFromPayload?.[key];
    if (Array.isArray(direct)) return direct;
    return [];
  };

  const tabs = readerModules.length
    ? `<div class="acad-tabs" data-acad-tabs>${readerModules.map((moduleItem, index) => `<button type="button" class="acad-tab-btn${index === 0 ? " is-active" : ""}" data-tab-key="${escapeHtml(moduleItem.tabKey)}" aria-selected="${index === 0 ? "true" : "false"}">${escapeHtml(moduleItem.label)}</button>`).join("")}</div>`
    : "";
  const panels = readerModules.map((moduleItem, index) => tabPanelMarkup(
    moduleItem.tabKey,
    getItemsForType(moduleItem.key),
    moduleItem.panelMode,
    index === 0,
    {
      isAdmin: adminMode,
      editable: Boolean(moduleItem?.editable),
      subjectId: Number(safeSubject?.id || 0),
      contextType: "chapter",
      contextId: Number(safeChapter?.id || 0),
      contentType: moduleItem.key,
      contentLabel: moduleItem.label,
      panelMode: moduleItem.panelMode,
    },
  )).join("");
  const readerContent = readerModules.length
    ? `${tabs}${panels}`
    : `<p class="acad-empty">No content tabs configured for this chapter.</p>`;
  const topicCards = chapterTopics.length
    ? `<div class="acad-card-grid">${chapterTopics.map((topic) => cardMarkup({
      href: `/subjects/${Number(safeSubject?.id || 0)}/topics/${Number(topic?.id || 0)}`,
      name: topic?.name || "Topic",
      imageUrl: topic?.imageUrl || "",
      meta: topic?.topicNumber ? `Topic ${topic.topicNumber}` : "Topic",
      cardClass: "acad-chapter-card",
    })).join("")}</div>`
    : `<p class="acad-empty">No topics added yet.</p>`;
  const chapterBody = safeChapter?.topicsEnabled
    ? `<section class="acad-reader-block"><h3>Topics</h3>${topicCards}</section>`
    : `<section class="acad-reader-block">${readerContent}</section>`;
  const rightSidebar = subjectFlowRightSidebar({
    subjectName: safeSubject?.name || "Subject",
    sections: [
      {
        title: "Chapters",
        items: chapterSiblings.map((entry) => ({
          href: `/subjects/${Number(safeSubject?.id || 0)}/chapters/${Number(entry?.id || 0)}`,
          name: entry?.name || "Chapter",
          meta: entry?.chapterNumber ? `Chapter ${entry.chapterNumber}` : "",
          active: Number(entry?.id || 0) === Number(safeChapter?.id || 0),
        })),
      },
      {
        title: "Topics",
        items: chapterTopics.map((entry) => ({
          href: `/subjects/${Number(safeSubject?.id || 0)}/topics/${Number(entry?.id || 0)}`,
          name: entry?.name || "Topic",
          meta: entry?.topicNumber ? `Topic ${entry.topicNumber}` : "",
        })),
      },
    ],
  });

  const content = `${floatingBackButton(`/subjects/${Number(safeSubject?.id || 0)}/sections/${Number(safeNode?.id || 0)}`)}<section class="acad-wrap"><header class="acad-head"><div><h2>${escapeHtml(safeChapter?.name || "Chapter")}</h2><p class="acad-sub">${escapeHtml(safeSubject?.name || "Subject")} | ${escapeHtml(safeNode?.displayName || safeNode?.serverName || "Section")}</p></div></header>${chapterBody}</section>${adminEditorModalMarkup(adminMode)}${examFab(safeSubject?.id, { contextType: "chapter", contextId: safeChapter?.id })}`;
  return renderShell({
    title: String(safeChapter?.name || "Chapter"),
    user,
    navItems,
    homePath,
    content,
    rightSidebar,
  });
}

export function publicTopicPage({
  user,
  navItems,
  homePath,
  subject,
  node,
  chapter,
  topic,
  chapters = [],
  topics = [],
  contentModules = [],
  contentItemsByType = {},
} = {}) {
  const adminMode = isAdminUser(user);
  const safeSubject = subject || {};
  const safeNode = node || {};
  const safeChapter = chapter || {};
  const safeTopic = topic || {};
  const chapterSiblings = Array.isArray(chapters) ? chapters : [];
  const topicSiblings = Array.isArray(topics) ? topics : [];
  const mapFromPayload = (contentItemsByType && typeof contentItemsByType === "object") ? contentItemsByType : {};
  const inferredModules = publicReaderModules(Object.keys(mapFromPayload));
  const readerModules = (Array.isArray(contentModules) && contentModules.length ? contentModules : inferredModules)
    .map((item) => ({
      key: String(item?.key || "").trim().toLowerCase(),
      label: String(item?.label || "").trim() || String(item?.key || ""),
      tabKey: String(item?.tabKey || item?.key || "").trim().toLowerCase(),
      panelMode: String(item?.panelMode || "rich").trim().toLowerCase(),
      editable: isEditableContentType(item?.key),
    }))
    .filter((item, index, list) => item.key && item.tabKey && list.findIndex((entry) => entry.tabKey === item.tabKey) === index);

  const getItemsForType = (type) => {
    const key = String(type || "").trim().toLowerCase();
    const direct = mapFromPayload?.[key];
    if (Array.isArray(direct)) return direct;
    return [];
  };

  const tabs = readerModules.length
    ? `<div class="acad-tabs" data-acad-tabs>${readerModules.map((moduleItem, index) => `<button type="button" class="acad-tab-btn${index === 0 ? " is-active" : ""}" data-tab-key="${escapeHtml(moduleItem.tabKey)}" aria-selected="${index === 0 ? "true" : "false"}">${escapeHtml(moduleItem.label)}</button>`).join("")}</div>`
    : "";
  const panels = readerModules.map((moduleItem, index) => tabPanelMarkup(
    moduleItem.tabKey,
    getItemsForType(moduleItem.key),
    moduleItem.panelMode,
    index === 0,
    {
      isAdmin: adminMode,
      editable: Boolean(moduleItem?.editable),
      subjectId: Number(safeSubject?.id || 0),
      contextType: "topic",
      contextId: Number(safeTopic?.id || 0),
      contentType: moduleItem.key,
      contentLabel: moduleItem.label,
      panelMode: moduleItem.panelMode,
    },
  )).join("");
  const readerContent = readerModules.length
    ? `${tabs}${panels}`
    : `<p class="acad-empty">No content tabs configured for this topic.</p>`;
  const rightSidebar = subjectFlowRightSidebar({
    subjectName: safeSubject?.name || "Subject",
    sections: [
      {
        title: "Chapters",
        items: chapterSiblings.map((entry) => ({
          href: `/subjects/${Number(safeSubject?.id || 0)}/chapters/${Number(entry?.id || 0)}`,
          name: entry?.name || "Chapter",
          meta: entry?.chapterNumber ? `Chapter ${entry.chapterNumber}` : "",
          active: Number(entry?.id || 0) === Number(safeChapter?.id || 0),
        })),
      },
      {
        title: "Topics",
        items: topicSiblings.map((entry) => ({
          href: `/subjects/${Number(safeSubject?.id || 0)}/topics/${Number(entry?.id || 0)}`,
          name: entry?.name || "Topic",
          meta: entry?.topicNumber ? `Topic ${entry.topicNumber}` : "",
          active: Number(entry?.id || 0) === Number(safeTopic?.id || 0),
        })),
      },
    ],
  });

  const content = `${floatingBackButton(`/subjects/${Number(safeSubject?.id || 0)}/chapters/${Number(safeChapter?.id || 0)}`)}<section class="acad-wrap"><header class="acad-head"><div><h2>${escapeHtml(safeTopic?.name || "Topic")}</h2><p class="acad-sub">${escapeHtml(safeSubject?.name || "Subject")} | ${escapeHtml(safeNode?.displayName || safeNode?.serverName || "Section")} | ${escapeHtml(safeChapter?.name || "Chapter")}</p></div></header><section class="acad-reader-block">${readerContent}</section></section>${adminEditorModalMarkup(adminMode)}${examFab(safeSubject?.id, { contextType: "topic", contextId: safeTopic?.id })}`;
  return renderShell({
    title: String(safeTopic?.name || "Topic"),
    user,
    navItems,
    homePath,
    content,
    rightSidebar,
  });
}
