import { renderAppShellLayout } from "../../layout/appShell/index.js";
import { publicReaderModules } from "../../../shared/modules/contentModules.js";

const ACADEMICS_STYLE = `
.acad-wrap{display:grid;gap:10px;padding:12px var(--space-2) var(--space-2)}
.acad-wrap *{box-sizing:border-box}
.acad-head{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap}
.acad-head h2{margin:0;font-size:1.05rem}
.acad-sub{margin:0;color:var(--text-muted);font-size:.84rem}
.acad-back{height:32px;border:1px solid var(--border);border-radius:999px;padding:0 12px;display:inline-flex;align-items:center;gap:6px;background:var(--surface-soft);color:var(--text);text-decoration:none;font-weight:700}
.acad-back:hover{border-color:color-mix(in srgb,var(--accent) 55%,var(--border))}
.acad-card-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(132px,182px));justify-content:flex-start;gap:10px}
.acad-card-link,.acad-root-card{display:grid;gap:0;text-decoration:none;color:inherit;background:transparent;border:0;padding:0;cursor:pointer;min-width:0;max-width:100%;width:100%}
.acad-root-card{appearance:none;-webkit-appearance:none;text-align:left;font:inherit;line-height:inherit}
.acad-poster{position:relative;aspect-ratio:2/3;border-radius:12px;overflow:hidden;background:linear-gradient(145deg,color-mix(in srgb,var(--surface-strong) 28%,#d8e3f3),color-mix(in srgb,var(--accent) 34%,#8799b6))}
.acad-poster img{display:block;width:100%;height:100%;max-width:100%;object-fit:cover;object-position:center}
.acad-poster-fallback{position:absolute;inset:0;display:grid;place-items:center;font-size:1rem;font-weight:800;letter-spacing:.03em;color:#f4f8ff;background:linear-gradient(145deg,color-mix(in srgb,var(--accent) 38%,#4b658b),color-mix(in srgb,var(--accent) 62%,#233a60))}
.acad-card-name{margin:0;padding:6px 2px 0;font-size:.88rem;line-height:1.15;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.acad-card-meta{margin:0;padding:1px 2px 0;font-size:.74rem;color:var(--text-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.acad-empty{margin:0;padding:14px;border:1px dashed var(--border);border-radius:10px;color:var(--text-muted)}
.acad-root-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(132px,182px));justify-content:flex-start;gap:10px}
.acad-root-card{transition:transform .22s ease,opacity .22s ease,filter .22s ease}
.acad-root-card:hover{transform:translateY(-2px)}
.acad-root-grid.has-selection .acad-root-card{display:none}
.acad-root-grid.has-selection .acad-root-card.is-selected{display:grid}
.acad-child-area{display:grid;gap:10px}
.acad-child-group{display:grid;gap:10px;opacity:0;transform:translateY(-8px);transition:opacity .22s ease,transform .22s ease}
.acad-child-group.is-visible{opacity:1;transform:translateY(0)}
.acad-child-head{display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap}
.acad-child-head h3{margin:0;font-size:.94rem}
.acad-chip{height:28px;border:1px solid var(--border);border-radius:999px;padding:0 10px;background:var(--surface-soft);color:var(--text);font-weight:600;cursor:pointer}
.acad-chip:hover{border-color:color-mix(in srgb,var(--accent) 55%,var(--border))}
.acad-chapter-card .acad-poster{aspect-ratio:4/3}
.acad-notes{display:grid;gap:8px}
.acad-note{display:grid;gap:5px;padding:7px;border:1px solid color-mix(in srgb,var(--border) 84%,transparent);border-radius:8px;background:transparent;min-width:0;overflow:hidden}
.acad-note *{max-width:100%;overflow-wrap:anywhere}
.acad-note img,.acad-note video,.acad-note iframe{max-width:100%;height:auto;border-radius:8px;border:1px solid var(--border)}
.acad-notes-list{display:grid;gap:0}
.acad-note-row{display:grid;grid-template-columns:auto minmax(0,1fr);gap:8px;align-items:start;padding:8px 0;border-bottom:1px solid color-mix(in srgb,var(--border) 90%,transparent)}
.acad-note-row:last-child{border-bottom:0}
.acad-note-index{min-width:20px;font-size:.81rem;line-height:1.45;color:var(--text-muted);font-weight:700;padding-top:1px}
.acad-note-body{min-width:0}
.acad-note-body *{max-width:100%;overflow-wrap:anywhere}
.acad-note-body img,.acad-note-body video,.acad-note-body iframe{max-width:100%;height:auto;border-radius:8px;border:1px solid var(--border)}
.acad-content-columns{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;align-items:start}
.acad-content-col{display:grid;gap:0}
.acad-tabs{display:flex;gap:4px;flex-wrap:wrap;border-bottom:1px solid var(--border);padding-bottom:5px}
.acad-tab-btn{height:28px;border:1px solid transparent;border-radius:8px;background:transparent;color:var(--text-muted);padding:0 9px;font-weight:700;cursor:pointer;font-size:.8rem}
.acad-tab-btn:hover{background:color-mix(in srgb,var(--surface-soft) 80%,transparent);color:var(--text)}
.acad-tab-btn.is-active{background:color-mix(in srgb,var(--accent) 16%,var(--surface));color:var(--text);border-color:color-mix(in srgb,var(--accent) 55%,var(--border))}
.acad-tab-panel{display:none;gap:7px;padding-top:6px}
.acad-tab-panel.is-active{display:grid}
.acad-tab-panel[hidden]{display:none!important}
.acad-mcq{display:grid;gap:5px;padding:7px 0;border:0;border-bottom:1px solid color-mix(in srgb,var(--border) 88%,transparent);border-radius:0}
.acad-content-col .acad-mcq:last-child{border-bottom:0}
.acad-mcq *{max-width:100%;overflow-wrap:anywhere}
.acad-mcq-q{display:grid;grid-template-columns:auto 1fr;gap:6px;align-items:start;margin:0}
.acad-mcq-q-no{color:var(--text-muted);font-weight:700}
.acad-mcq-opts{margin:0;padding:0;list-style:none;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px 12px}
.acad-mcq-opts li{display:grid;grid-template-columns:auto 1fr;gap:6px;align-items:start;min-width:0}
.acad-mcq-opt-key{width:18px;height:18px;border-radius:999px;border:1px solid color-mix(in srgb,var(--accent) 58%,var(--border));display:inline-flex;align-items:center;justify-content:center;font-size:.68rem;font-weight:700;color:color-mix(in srgb,var(--accent) 72%,var(--text));line-height:1;flex:0 0 18px}
.acad-mcq img,.acad-mcq video,.acad-mcq iframe{max-width:100%;height:auto}
.acad-mcq-foot{display:flex;align-items:center;justify-content:flex-start;gap:8px;flex-wrap:wrap;margin-top:1px}
.acad-answer-btn{height:26px;border:1px solid var(--border);border-radius:8px;background:var(--surface-soft);color:var(--text);padding:0 9px;font-size:.76rem;font-weight:700;cursor:pointer}
.acad-answer-btn:hover{border-color:color-mix(in srgb,var(--accent) 55%,var(--border))}
.acad-mcq-answer{margin:0;font-size:.78rem;color:color-mix(in srgb,#2f9a66 74%,var(--text));font-weight:700}
.acad-pager{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-top:4px}
.acad-page-btn{height:29px;min-width:29px;border:1px solid var(--border);border-radius:7px;background:transparent;color:var(--text-muted);padding:0 8px;font-weight:600;cursor:pointer}
.acad-page-btn:hover{border-color:color-mix(in srgb,var(--accent) 55%,var(--border));color:var(--text)}
.acad-page-btn.is-active{background:color-mix(in srgb,var(--accent) 20%,var(--surface));border-color:color-mix(in srgb,var(--accent) 65%,var(--border));color:var(--text)}
.acad-page-btn:disabled{opacity:.52;cursor:not-allowed}
.acad-page-gap{padding:0 2px;color:var(--text-muted)}
.acad-reader-block{display:grid;gap:10px;min-width:0}
.acad-reader-block h3{margin:0;font-size:.92rem}
.acad-exam-fab{position:fixed!important;right:max(14px,env(safe-area-inset-right));bottom:calc(16px + env(safe-area-inset-bottom));left:auto!important;z-index:80;height:44px;padding:0 15px;border-radius:999px;border:1px solid color-mix(in srgb,var(--accent) 72%,var(--border));background:var(--accent);color:var(--accent-contrast);text-decoration:none;display:inline-flex;align-items:center;justify-content:center;font-weight:800;letter-spacing:.01em;box-shadow:0 8px 20px color-mix(in srgb,var(--accent) 30%,transparent);width:auto!important;max-width:max-content!important;min-width:unset!important;margin:0!important;transform:translateZ(0)}
.acad-exam-fab:hover{filter:brightness(1.03)}
@media (max-width:760px){.acad-card-grid{grid-template-columns:repeat(2,minmax(0,1fr));justify-content:stretch;gap:10px}.acad-root-grid{grid-template-columns:repeat(2,minmax(0,1fr));justify-content:stretch;gap:10px}.acad-content-columns{grid-template-columns:1fr}}
@media (max-width:380px){.acad-card-grid,.acad-root-grid{grid-template-columns:1fr}}
`;

const ACADEMICS_SCRIPT = `
(() => {
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

  const rootGrid = document.getElementById('acadRootGrid');
  const childArea = document.getElementById('acadChildArea');
  if (rootGrid && childArea) {
    const rootCards = Array.from(rootGrid.querySelectorAll('[data-root-id]'));
    const groups = Array.from(childArea.querySelectorAll('[data-root-group]'));
    const clearSelection = () => {
      rootGrid.classList.remove('has-selection');
      rootCards.forEach((card) => card.classList.remove('is-selected'));
      groups.forEach((group) => {
        group.hidden = true;
        group.classList.remove('is-visible');
      });
      childArea.hidden = true;
    };
    const selectRoot = (rootId) => {
      rootGrid.classList.add('has-selection');
      rootCards.forEach((card) => {
        card.classList.toggle('is-selected', String(card.getAttribute('data-root-id') || '') === String(rootId));
      });
      let matched = false;
      groups.forEach((group) => {
        const isMatch = String(group.getAttribute('data-root-group') || '') === String(rootId);
        group.hidden = !isMatch;
        group.classList.toggle('is-visible', isMatch);
        if (isMatch) matched = true;
      });
      childArea.hidden = !matched;
    };
    rootGrid.addEventListener('click', (event) => {
      const card = event.target.closest('[data-root-id]');
      if (!card) return;
      selectRoot(card.getAttribute('data-root-id'));
    });
    childArea.addEventListener('click', (event) => {
      const resetBtn = event.target.closest('[data-action="acad-reset-root"]');
      if (!resetBtn) return;
      clearSelection();
    });
    clearSelection();
  }

  const tabsWrap = document.querySelector('[data-acad-tabs]');
  if (tabsWrap) {
    const buttons = Array.from(tabsWrap.querySelectorAll('[data-tab-key]'));
    const readerBlock = tabsWrap.closest('.acad-reader-block');
    const panels = Array.from((readerBlock || document).querySelectorAll('[data-tab-panel]'));
    const activate = (key) => {
      const selected = String(key || '');
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
    };
    tabsWrap.addEventListener('click', (event) => {
      const btn = event.target.closest('[data-tab-key]');
      if (!btn) return;
      activate(btn.getAttribute('data-tab-key'));
    });
    const firstKey = String(buttons[0]?.getAttribute('data-tab-key') || '');
    if (firstKey) activate(firstKey);
  }

  document.addEventListener('click', (event) => {
    const pageBtn = event.target.closest('[data-action="acad-page"]');
    if (pageBtn) {
      const panelKey = String(pageBtn.getAttribute('data-panel-key') || '');
      const page = Number.parseInt(String(pageBtn.getAttribute('data-page') || '1'), 10) || 1;
      const panel = pageBtn.closest('[data-tab-panel]');
      activatePanelPage(panel, panelKey, page);
      return;
    }

    const toggle = event.target.closest('[data-action="acad-toggle-answer"]');
    if (!toggle) return;
    const container = toggle.closest('.acad-mcq');
    const answer = container?.querySelector('[data-mcq-answer]');
    if (!answer) return;
    const show = answer.hidden;
    answer.hidden = !show;
    toggle.setAttribute('aria-expanded', show ? 'true' : 'false');
    toggle.textContent = show ? 'Hide answer' : 'Show answer';
  });
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

function renderShell({ title, user, navItems, homePath, content }) {
  return renderAppShellLayout({
    title,
    activeMenu: "home",
    user,
    navItems,
    homePath,
    pageClass: "page-home page-academics",
    pageStyles: ACADEMICS_STYLE,
    contentClass: "app-content-flush",
    content,
    script: ACADEMICS_SCRIPT,
  });
}

export function classSubjectsPage({ user, navItems, homePath, classItem, subjects = [] } = {}) {
  const className = String(classItem?.name || "").trim() || "Class";
  const rows = Array.isArray(subjects) ? subjects : [];
  const cards = rows.length
    ? `<div class="acad-card-grid">${rows.map((subject) => cardMarkup({
      href: `/subjects/${Number(subject?.id || 0)}`,
      name: subject?.name || "Subject",
      imageUrl: subject?.thumbnailUrl || "",
      meta: subject?.templateCode || subject?.templateName || "",
    })).join("")}</div>`
    : `<p class="acad-empty">No subjects found for this class.</p>`;
  const content = `<section class="acad-wrap"><header class="acad-head"><div><h2>${escapeHtml(className)}</h2><p class="acad-sub">Subjects in this class</p></div><a class="acad-back" href="/classes">Back to classes</a></header>${cards}</section>`;
  return renderShell({
    title: `${className} Subjects`,
    user,
    navItems,
    homePath,
    content,
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

  const content = `<section class="acad-wrap"><header class="acad-head"><div><h2>${escapeHtml(safeSubject?.name || "Subject")}</h2><p class="acad-sub">${escapeHtml(className || "Subject")} | Select a book</p></div><a class="acad-back" href="${escapeHtml(backHref)}">Back to subjects</a></header><div id="acadRootGrid" class="acad-root-grid">${rootCards}</div><div id="acadChildArea" class="acad-child-area" hidden>${childGroups}</div></section>${examFab(safeSubject?.id)}`;
  return renderShell({
    title: String(safeSubject?.name || "Subject"),
    user,
    navItems,
    homePath,
    content,
  });
}

export function publicSectionPage({ user, navItems, homePath, subject, node, chapters = [] } = {}) {
  const safeSubject = subject || {};
  const safeNode = node || {};
  const headingMeta = sectionHeadingMeta(safeNode);
  const isRootNode = !Number(safeNode?.parentNodeId || 0);
  const backLabel = isRootNode ? "Back to subject" : "Back to books";
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
  const content = `<section class="acad-wrap"><header class="acad-head"><div><h2>${escapeHtml(safeSubject?.name || "Subject")}</h2><p class="acad-sub">${escapeHtml(headingMeta.subtitle)}</p></div><a class="acad-back" href="/subjects/${Number(safeSubject?.id || 0)}">${escapeHtml(backLabel)}</a></header>${cards}</section>${examFab(safeSubject?.id, { contextType: "node", contextId: safeNode?.id })}`;
  return renderShell({
    title: headingMeta.title,
    user,
    navItems,
    homePath,
    content,
  });
}

function richItemMarkup(item = {}) {
  const body = String(item?.body || "").trim();
  const imageUrl = String(item?.imageUrl || "").trim();
  if (!body && !imageUrl) return "";
  return `<article class="acad-note">${imageUrl ? `<img src="${escapeHtml(imageUrl)}" alt="Content" loading="lazy" decoding="async" />` : ""}${body}</article>`;
}

function shortNoteItemMarkup(item = {}, index = 0) {
  const body = String(item?.body || "").trim();
  const imageUrl = String(item?.imageUrl || "").trim();
  if (!body && !imageUrl) return "";
  return `<article class="acad-note-row"><span class="acad-note-index">${index + 1}.</span><div class="acad-note-body">${body}${imageUrl ? `<img src="${escapeHtml(imageUrl)}" alt="Short note" loading="lazy" decoding="async" />` : ""}</div></article>`;
}

function mcqItemMarkup(item = {}, index = 0) {
  const options = Array.isArray(item?.options) ? item.options : [];
  const correctOption = String(item?.correctOption || "").trim().toUpperCase();
  return `<article class="acad-mcq"><p class="acad-mcq-q"><span class="acad-mcq-q-no">${index + 1}.</span><span>${String(item?.body || "")}</span></p>${item?.imageUrl ? `<img src="${escapeHtml(item.imageUrl)}" alt="MCQ" loading="lazy" decoding="async" />` : ""}<ul class="acad-mcq-opts">${options.map((option, optionIndex) => `<li><span class="acad-mcq-opt-key">${String.fromCharCode(65 + optionIndex)}</span><span>${String(option || "")}</span></li>`).join("")}</ul><div class="acad-mcq-foot"><button type="button" class="acad-answer-btn" data-action="acad-toggle-answer" aria-expanded="false">Show answer</button><p class="acad-mcq-answer" data-mcq-answer hidden>Answer: ${escapeHtml(correctOption || "Not set")}</p></div></article>`;
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

function pagedColumnsMarkup(panelKey, rows = [], itemRenderer, pagerLabel) {
  const items = Array.isArray(rows) ? rows : [];
  const totalPages = Math.max(1, Math.ceil(items.length / 40));
  let blocks = "";
  for (let page = 1; page <= totalPages; page += 1) {
    const start = (page - 1) * 40;
    const pageItems = items.slice(start, start + 40);
    const leftItems = pageItems.slice(0, 20);
    const rightItems = pageItems.slice(20, 40);
    const left = leftItems.map((item, index) => itemRenderer(item, start + index)).join("");
    const right = rightItems.map((item, index) => itemRenderer(item, start + 20 + index)).join("");
    blocks += `<div class="acad-page-block${page === 1 ? " is-active" : ""}" data-page-block="${escapeHtml(panelKey)}" data-page="${page}"${page === 1 ? "" : " hidden"}><div class="acad-content-columns"><div class="acad-content-col">${left || `<p class="acad-empty">No content added yet.</p>`}</div><div class="acad-content-col">${right}</div></div></div>`;
  }
  return `${blocks}${pagerMarkup(panelKey, totalPages, 1, pagerLabel)}`;
}

function tabPanelMarkup(panelKey, items = [], mode = "rich", active = false) {
  const rows = Array.isArray(items) ? items : [];
  const stateClass = active ? "acad-tab-panel is-active" : "acad-tab-panel";
  const hiddenAttr = active ? "" : " hidden";
  if (!rows.length) {
    return `<section class="${stateClass}" data-tab-panel="${escapeHtml(panelKey)}"${hiddenAttr}><p class="acad-empty">No content added yet.</p></section>`;
  }
  const content = mode === "mcq"
    ? pagedColumnsMarkup(panelKey, rows, (item, index) => mcqItemMarkup(item, index), "MCQ pages")
    : mode === "short"
      ? pagedColumnsMarkup(panelKey, rows, (item, index) => shortNoteItemMarkup(item, index), "Short notes pages")
      : rows.map((item) => richItemMarkup(item)).join("");
  return `<section class="${stateClass}" data-tab-panel="${escapeHtml(panelKey)}"${hiddenAttr}>${content}</section>`;
}

export function publicChapterPage({
  user,
  navItems,
  homePath,
  subject,
  node,
  chapter,
  contentModules = [],
  contentItemsByType = {},
} = {}) {
  const safeSubject = subject || {};
  const safeNode = node || {};
  const safeChapter = chapter || {};
  const mapFromPayload = (contentItemsByType && typeof contentItemsByType === "object") ? contentItemsByType : {};
  const inferredModules = publicReaderModules(Object.keys(mapFromPayload));
  const readerModules = (Array.isArray(contentModules) && contentModules.length ? contentModules : inferredModules)
    .map((item) => ({
      key: String(item?.key || "").trim().toLowerCase(),
      label: String(item?.label || "").trim() || String(item?.key || ""),
      tabKey: String(item?.tabKey || item?.key || "").trim().toLowerCase(),
      panelMode: String(item?.panelMode || "rich").trim().toLowerCase(),
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
  )).join("");
  const readerContent = readerModules.length ? `${tabs}${panels}` : `<p class="acad-empty">No content tabs configured for this chapter.</p>`;

  const content = `<section class="acad-wrap"><header class="acad-head"><div><h2>${escapeHtml(safeChapter?.name || "Chapter")}</h2><p class="acad-sub">${escapeHtml(safeSubject?.name || "Subject")} | ${escapeHtml(safeNode?.displayName || safeNode?.serverName || "Section")}</p></div><a class="acad-back" href="/subjects/${Number(safeSubject?.id || 0)}/sections/${Number(safeNode?.id || 0)}">Back to chapters</a></header><section class="acad-reader-block"><h3>Contents</h3>${readerContent}</section></section>${examFab(safeSubject?.id, { contextType: "chapter", contextId: safeChapter?.id })}`;
  return renderShell({
    title: String(safeChapter?.name || "Chapter"),
    user,
    navItems,
    homePath,
    content,
  });
}
