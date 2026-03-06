import { renderDocument } from "../../layout/document.js";
import { renderAppShellLayout } from "../../layout/appShell/index.js";

const EXAM_SETUP_STYLE = `
.page-exam-setup .app-content{
  padding:0;
  background:
    radial-gradient(860px 460px at 10% -12%,color-mix(in srgb,var(--accent) 14%,transparent),transparent 60%),
    radial-gradient(760px 440px at 92% -16%,color-mix(in srgb,var(--accent) 10%,transparent),transparent 62%),
    repeating-linear-gradient(0deg,color-mix(in srgb,var(--surface-soft) 24%,transparent) 0 1px,transparent 1px 28px),
    linear-gradient(180deg,var(--page-bg),color-mix(in srgb,var(--page-bg) 84%,var(--surface) 16%));
}
.exam-setup{
  display:grid;
  gap:12px;
  padding:14px 12px calc(20px + env(safe-area-inset-bottom,0px));
  max-width:1040px;
  margin:0 auto;
}
.exam-setup,.exam-setup *{min-width:0}
.exam-setup-head{
  display:grid;
  grid-template-columns:minmax(0,1fr) auto;
  align-items:center;
  gap:10px;
  padding:2px 2px 0;
}
.exam-setup-head > div{min-width:0}
.exam-setup-head h2{margin:0;font-size:1.24rem;line-height:1.22}
.exam-setup-head p{margin:0;color:var(--text-muted);font-size:.91rem;line-height:1.4}
.exam-back{
  height:36px;
  border:1px solid var(--border);
  border-radius:999px;
  padding:0 13px;
  display:inline-flex;
  align-items:center;
  text-decoration:none;
  color:var(--text);
  font-weight:700;
  background:color-mix(in srgb,var(--surface) 92%,var(--page-bg) 8%);
}
.exam-back:hover{
  border-color:color-mix(in srgb,var(--accent) 52%,var(--border));
  background:color-mix(in srgb,var(--surface-soft) 78%,var(--surface) 22%);
}
.exam-card{
  position:relative;
  border:1px solid var(--border);
  border-radius:18px;
  background:
    repeating-linear-gradient(90deg,color-mix(in srgb,var(--surface-soft) 16%,transparent) 0 1px,transparent 1px 20px),
    linear-gradient(180deg,color-mix(in srgb,var(--surface) 92%,var(--page-bg) 8%),color-mix(in srgb,var(--surface-soft) 84%,var(--page-bg) 16%));
  padding:14px;
  display:grid;
  gap:12px;
  overflow:hidden;
}
.exam-card::before{
  content:'';
  position:absolute;
  inset:0;
  pointer-events:none;
  opacity:.13;
  background:
    radial-gradient(circle at 15% 22%,color-mix(in srgb,var(--accent) 34%,transparent) 0 2px,transparent 2px),
    radial-gradient(circle at 78% 17%,color-mix(in srgb,var(--accent) 34%,transparent) 0 2px,transparent 2px),
    radial-gradient(circle at 88% 70%,color-mix(in srgb,var(--accent) 34%,transparent) 0 2px,transparent 2px);
}
.exam-grid{
  position:relative;
  z-index:1;
  display:grid;
  gap:10px;
  grid-template-columns:repeat(12,minmax(0,1fr));
}
.exam-field{
  display:grid;
  gap:6px;
  grid-column:span 6;
}
.exam-field-full{grid-column:1 / -1}
.exam-field label{font-weight:700;font-size:.86rem;color:var(--text-muted)}
.exam-field select,.exam-field input:not([type="checkbox"]){
  display:block;
  width:100%;
  max-width:100%;
  height:44px;
  border:1px solid var(--border);
  border-radius:12px;
  padding:0 12px;
  background:color-mix(in srgb,var(--surface-soft) 92%,var(--surface) 8%);
  color:var(--text);
  font-size:.95rem;
}
.exam-field select:focus,.exam-field input:not([type="checkbox"]):focus{
  outline:none;
  border-color:color-mix(in srgb,var(--accent) 64%,var(--border));
  background:color-mix(in srgb,var(--surface-soft) 76%,var(--surface) 24%);
}
.exam-toggle{
  display:flex;
  align-items:center;
  gap:10px;
  padding:10px 12px;
  border:1px solid color-mix(in srgb,var(--border) 70%,var(--accent) 30%);
  border-radius:12px;
  background:color-mix(in srgb,var(--surface-soft) 84%,var(--accent) 16%);
}
.exam-toggle input{
  width:18px;
  height:18px;
  margin:0;
  accent-color:var(--accent);
  flex:0 0 18px;
}
.exam-toggle label{
  margin:0;
  color:var(--text);
  font-size:.89rem;
}
.exam-actions{
  position:relative;
  z-index:1;
  display:flex;
  justify-content:flex-end;
  gap:8px;
  padding-top:2px;
}
.exam-btn{
  height:42px;
  border:1px solid var(--border);
  border-radius:12px;
  padding:0 14px;
  font-weight:700;
  cursor:pointer;
  background:color-mix(in srgb,var(--surface-soft) 90%,var(--surface) 10%);
  color:var(--text);
  font-size:.93rem;
}
.exam-btn.primary{background:var(--accent);color:var(--accent-contrast);border-color:color-mix(in srgb,var(--accent) 70%,var(--border))}
.exam-btn:disabled{opacity:.55;cursor:not-allowed}
.exam-msg{
  position:relative;
  z-index:1;
  margin:0;
  font-size:.83rem;
  color:var(--text-muted);
  min-height:1.2em;
  overflow-wrap:anywhere;
}
.exam-hint{
  margin:0;
  padding:10px 12px;
  border:1px solid color-mix(in srgb,var(--accent) 38%,var(--border));
  border-radius:12px;
  background:color-mix(in srgb,var(--accent) 12%,var(--surface));
  font-size:.83rem;
  color:color-mix(in srgb,var(--accent) 62%,var(--text));
  font-weight:600;
  overflow-wrap:anywhere;
}
.exam-resume{display:grid;gap:8px}
.exam-resume a{justify-self:start;text-decoration:none}
@media (max-width:760px){
  .exam-setup{
    width:100%;
    max-width:100%;
    padding:10px 8px calc(18px + env(safe-area-inset-bottom,0px));
    gap:10px;
    overflow-x:clip;
  }
  .exam-setup-head{
    grid-template-columns:1fr;
    align-items:flex-start;
    gap:8px;
  }
  .exam-setup-head h2{font-size:1.1rem}
  .exam-setup-head p{font-size:.84rem}
  .exam-back{height:34px;padding:0 13px}
  .exam-card{padding:10px;border-radius:14px;gap:10px;max-width:100%;overflow-x:clip}
  .exam-grid{grid-template-columns:1fr;gap:8px}
  .exam-field,.exam-field-full{grid-column:1 / -1}
  .exam-field select,.exam-field input{height:46px;font-size:1rem}
  .exam-toggle{padding:10px 12px}
  .exam-actions{
    position:sticky;
    bottom:max(8px,env(safe-area-inset-bottom,0px));
    background:linear-gradient(180deg,transparent,color-mix(in srgb,var(--surface) 88%,transparent));
    padding-top:8px;
  }
  .exam-actions .exam-btn{
    width:100%;
    height:46px;
    font-size:1rem;
  }
}
@media (min-width:761px) and (max-width:1020px){
  .exam-field{grid-column:span 12}
}
`;

const EXAM_SETUP_SCRIPT = `
(() => {
  const dataEl = document.getElementById('examSetupData');
  if (!dataEl) return;
  const payload = JSON.parse(dataEl.textContent || '{}');
  const form = document.getElementById('examSetupForm');
  if (!form) return;

  const scopeSelect = document.getElementById('examScope');
  const nodeWrap = document.getElementById('examNodeWrap');
  const nodeSelect = document.getElementById('examNode');
  const chapterWrap = document.getElementById('examChapterWrap');
  const chapterSelect = document.getElementById('examChapter');
  const topicChapterWrap = document.getElementById('examTopicChapterWrap');
  const topicChapterSelect = document.getElementById('examTopicChapter');
  const topicWrap = document.getElementById('examTopicWrap');
  const topicSelect = document.getElementById('examTopic');
  const nodeLabelEl = document.getElementById('examNodeLabel');
  const timedCheck = document.getElementById('examTimed');
  const durationWrap = document.getElementById('examDurationWrap');
  const durationSelect = document.getElementById('examDuration');
  const countSelect = document.getElementById('examQuestionCount');
  const submitBtn = document.getElementById('examStartBtn');
  const msg = document.getElementById('examSetupMsg');

  const options = payload?.options || {};
  const recommendation = options?.recommendation || {};
  const ui = options?.ui || {};
  const hasMultipleBooks = Boolean(ui?.hasMultipleBooks);
  const nodeLabelText = String(ui?.nodeLabel || (hasMultipleBooks ? 'Book' : 'Section')).trim();
  const chapterPools = Array.isArray(options?.chapters) ? options.chapters : [];
  const topicPools = Array.isArray(options?.topics) ? options.topics : [];
  const chapterChoices = chapterPools.filter((item) => Number(item?.count || 0) >= 5);
  const topicChoices = topicPools.filter((item) => Number(item?.count || 0) >= 5);
  if (nodeLabelEl && nodeLabelText) {
    nodeLabelEl.textContent = 'Select ' + nodeLabelText.toLowerCase();
  }

  const setSelectOptions = (select, rows, getValue, getLabel) => {
    const prev = String(select.value || '');
    select.innerHTML = rows.map((row) => '<option value="' + getValue(row) + '">' + getLabel(row) + '</option>').join('');
    if (prev && rows.some((row) => String(getValue(row)) === prev)) {
      select.value = prev;
    }
  };

  const setSelectValue = (select, value) => {
    if (!select) return false;
    const expected = String(value || '');
    if (!expected) return false;
    const option = Array.from(select.options || []).find((row) => String(row.value || '') === expected);
    if (!option) return false;
    select.value = expected;
    return true;
  };

  const setFieldVisibility = (field, visible) => {
    if (!field) return;
    const show = Boolean(visible);
    field.hidden = !show;
    field.setAttribute('aria-hidden', show ? 'false' : 'true');
    field.style.display = show ? '' : 'none';
  };

  const nodesForScope = (scope) => {
    if (!hasMultipleBooks) return [];
    const source = scope === 'topic' ? topicChoices : chapterChoices;
    const map = new Map();
    source.forEach((item) => {
      const nodeId = Number(item?.rootId || item?.nodeId || 0);
      if (nodeId <= 0) return;
      if (!map.has(nodeId)) {
        map.set(nodeId, {
          nodeId,
          nodeName: String(item?.rootName || item?.nodeName || 'Book'),
        });
      }
    });
    return Array.from(map.values());
  };

  const scopeChoices = [];
  if (Number(options?.full?.count || 0) >= 5) scopeChoices.push({ key: 'full', label: 'Full Subject' });
  if (chapterChoices.length) scopeChoices.push({ key: 'chapter', label: 'Chapter Wise' });
  if (topicChoices.length) scopeChoices.push({ key: 'topic', label: 'Topic Wise' });

  if (!scopeChoices.length) {
    if (msg) msg.textContent = 'At least 5 MCQs are required to start an exam.';
    submitBtn.disabled = true;
    return;
  }

  scopeSelect.innerHTML = scopeChoices.map((scope) => '<option value="' + scope.key + '">' + scope.label + '</option>').join('');

  const selectedScope = () => String(scopeSelect.value || 'full');

  const selectedNodeId = () => {
    if (!hasMultipleBooks) return 0;
    const scope = selectedScope();
    const nodes = nodesForScope(scope);
    if (nodes.length <= 1) return Number(nodes[0]?.nodeId || 0);
    return Number(nodeSelect.value || 0);
  };

  const fillNodeOptions = () => {
    const scope = selectedScope();
    const nodes = nodesForScope(scope);
    const showNode = hasMultipleBooks && (scope === 'chapter' || scope === 'topic') && nodes.length > 1;
    setFieldVisibility(nodeWrap, showNode);
    if (!showNode) return;
    setSelectOptions(
      nodeSelect,
      nodes,
      (row) => String(row.nodeId),
      (row) => row.nodeName,
    );
  };

  const chapterRowsForChapterScope = () => {
    const nodeId = selectedNodeId();
    return chapterChoices.filter((item) => !nodeId || Number(item?.rootId || item?.nodeId || 0) === nodeId);
  };

  const topicChapterRows = () => {
    const nodeId = selectedNodeId();
    const chapterMap = new Map();
    topicChoices.forEach((item) => {
      const chapterId = Number(item?.chapterId || 0);
      if (!chapterId) return;
      if (nodeId && Number(item?.rootId || item?.nodeId || 0) !== nodeId) return;
      if (!chapterMap.has(chapterId)) {
        chapterMap.set(chapterId, {
          chapterId,
          chapterName: String(item?.chapterName || 'Chapter'),
          nodeId: Number(item?.nodeId || 0),
        });
      }
    });
    return Array.from(chapterMap.values());
  };

  const fillChapterOptions = () => {
    const rows = chapterRowsForChapterScope();
    setSelectOptions(chapterSelect, rows, (row) => String(row.chapterId), (item) => {
      const sectionPart = hasMultipleBooks && String(item?.sectionName || '').trim()
        ? (String(item.sectionName).trim() + ' / ')
        : '';
      const label = sectionPart + (item?.chapterNumber ? ('Chapter ' + item.chapterNumber + ' - ') : '') + item.chapterName + ' (' + item.count + ' MCQ)';
      return label;
    });
    return rows.length;
  };

  const fillTopicChapterOptions = () => {
    const rows = topicChapterRows();
    setSelectOptions(
      topicChapterSelect,
      rows,
      (row) => String(row.chapterId),
      (row) => row.chapterName,
    );
    return rows.length;
  };

  const fillTopicOptions = () => {
    const chapterId = Number(topicChapterSelect.value || 0);
    const nodeId = selectedNodeId();
    const rows = topicChoices.filter((item) => {
      if (chapterId && Number(item?.chapterId || 0) !== chapterId) return false;
      if (nodeId && Number(item?.rootId || item?.nodeId || 0) !== nodeId) return false;
      return true;
    });
    setSelectOptions(topicSelect, rows, (row) => String(row.topicId), (item) => {
      const sectionPart = hasMultipleBooks && String(item?.sectionName || '').trim()
        ? (String(item.sectionName).trim() + ' / ')
        : '';
      const label = sectionPart + item.chapterName + ' / ' + item.topicName + ' (' + item.count + ' MCQ)';
      return label;
    });
    return rows.length;
  };

  const buildQuestionCount = () => {
    let allowed = [];
    const scope = String(scopeSelect.value || 'full');
    if (scope === 'full') {
      allowed = Array.isArray(options?.full?.questionCountOptions) ? options.full.questionCountOptions : [];
    } else if (scope === 'chapter') {
      const chapterId = Number(chapterSelect.value || 0);
      const selected = chapterChoices.find((item) => Number(item?.chapterId || 0) === chapterId);
      allowed = Array.isArray(selected?.questionCountOptions) ? selected.questionCountOptions : [];
    } else {
      const topicId = Number(topicSelect.value || 0);
      const selected = topicChoices.find((item) => Number(item?.topicId || 0) === topicId);
      allowed = Array.isArray(selected?.questionCountOptions) ? selected.questionCountOptions : [];
    }

    countSelect.innerHTML = allowed.map((count) => '<option value="' + count + '">' + count + ' Questions</option>').join('');
    submitBtn.disabled = !allowed.length;
    if (!allowed.length && msg) {
      msg.textContent = 'Not enough MCQs for this scope (minimum 5 required).';
    } else if (msg) {
      msg.textContent = '';
    }
  };

  const syncScope = () => {
    const scope = selectedScope();
    fillNodeOptions();

    setFieldVisibility(chapterWrap, scope === 'chapter');
    setFieldVisibility(topicChapterWrap, scope === 'topic');
    setFieldVisibility(topicWrap, scope === 'topic');

    if (scope === 'chapter') {
      const chapterCount = fillChapterOptions();
      setFieldVisibility(chapterWrap, chapterCount > 1);
      setFieldVisibility(topicChapterWrap, false);
      setFieldVisibility(topicWrap, false);
    } else if (scope === 'topic') {
      const topicChapterCount = fillTopicChapterOptions();
      setFieldVisibility(topicChapterWrap, topicChapterCount > 1);
      const topicCount = fillTopicOptions();
      setFieldVisibility(topicWrap, topicCount > 1);
      setFieldVisibility(chapterWrap, false);
    } else {
      setFieldVisibility(chapterWrap, false);
      setFieldVisibility(topicChapterWrap, false);
      setFieldVisibility(topicWrap, false);
    }

    durationWrap.hidden = !timedCheck.checked;
    buildQuestionCount();
  };

  const applyRecommendation = () => {
    const recommendedScope = String(recommendation?.scopeType || '').toLowerCase();
    if (recommendedScope && scopeChoices.some((scope) => scope.key === recommendedScope)) {
      scopeSelect.value = recommendedScope;
    }

    syncScope();

    const scope = selectedScope();
    const nodeId = Number(recommendation?.rootId || recommendation?.nodeId || 0);
    const chapterId = Number(recommendation?.chapterId || 0);
    const topicId = Number(recommendation?.topicId || 0);
    const questionCount = Number(recommendation?.questionCount || 0);
    const durationMinutes = Number(recommendation?.durationMinutes || 0);

    if ((scope === 'chapter' || scope === 'topic') && !nodeWrap.hidden && nodeId > 0) {
      if (setSelectValue(nodeSelect, nodeId)) {
        if (scope === 'chapter') {
          fillChapterOptions();
        } else {
          fillTopicChapterOptions();
          fillTopicOptions();
        }
      }
    }

    if (scope === 'chapter' && chapterId > 0) {
      setSelectValue(chapterSelect, chapterId);
    }

    if (scope === 'topic') {
      if (chapterId > 0 && setSelectValue(topicChapterSelect, chapterId)) {
        fillTopicOptions();
      }
      if (topicId > 0) {
        setSelectValue(topicSelect, topicId);
      }
    }

    buildQuestionCount();
    if (questionCount > 0) {
      setSelectValue(countSelect, questionCount);
    }

    if (typeof recommendation?.timed === 'boolean') {
      timedCheck.checked = recommendation.timed;
    }
    if (timedCheck.checked && durationMinutes > 0) {
      setSelectValue(durationSelect, durationMinutes);
    }
    durationWrap.hidden = !timedCheck.checked;

    const recommendationMessage = String(recommendation?.message || '').trim();
    if (msg && recommendationMessage) {
      msg.textContent = recommendationMessage;
    }
  };

  applyRecommendation();

  scopeSelect.addEventListener('change', syncScope);
  nodeSelect.addEventListener('change', () => {
    const scope = selectedScope();
    if (scope === 'chapter') {
      fillChapterOptions();
    } else if (scope === 'topic') {
      fillTopicChapterOptions();
      fillTopicOptions();
    }
    buildQuestionCount();
  });
  chapterSelect.addEventListener('change', buildQuestionCount);
  topicChapterSelect.addEventListener('change', () => {
    fillTopicOptions();
    buildQuestionCount();
  });
  topicSelect.addEventListener('change', buildQuestionCount);
  timedCheck.addEventListener('change', () => {
    durationWrap.hidden = !timedCheck.checked;
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    submitBtn.disabled = true;
    if (msg) msg.textContent = 'Starting exam...';

    try {
      const body = {
        scopeType: scopeSelect.value,
        chapterId: chapterSelect.value,
        topicId: topicSelect.value,
        timed: timedCheck.checked,
        durationMinutes: durationSelect.value,
        questionCount: countSelect.value,
      };
      const response = await fetch(form.getAttribute('action'), {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result?.error || 'Unable to start exam');
      const redirectUrl = String(result?.redirectUrl || '');
      if (!redirectUrl) throw new Error('Exam did not return redirect url');
      window.location.href = redirectUrl;
    } catch (error) {
      if (msg) msg.textContent = String(error?.message || 'Unable to start exam');
      submitBtn.disabled = false;
    }
  });
})();
`;

const EXAM_SESSION_STYLE = `
.exam-runtime{
  --exam-accent:var(--accent);
  --exam-accent-ink:var(--accent-contrast);
  --exam-bg:var(--page-bg);
  --exam-bg-soft:color-mix(in srgb,var(--page-bg) 82%,var(--surface) 18%);
  --exam-surface:var(--surface);
  --exam-surface-soft:color-mix(in srgb,var(--surface-soft) 88%,var(--surface) 12%);
  --exam-surface-glass:color-mix(in srgb,var(--surface) 86%,transparent);
  --exam-border:var(--border);
  --exam-text:var(--text);
  --exam-text-muted:var(--text-muted);
  --exam-timer-bg:color-mix(in srgb,var(--surface-soft) 82%,var(--accent) 18%);
  --exam-timer-border:color-mix(in srgb,var(--accent) 42%,var(--border));
  margin:0;
  min-height:100vh;
  background:
    radial-gradient(1200px 620px at 8% -8%, color-mix(in srgb,var(--exam-accent) 34%,transparent), transparent 58%),
    radial-gradient(960px 540px at 100% 0, color-mix(in srgb,var(--exam-accent) 20%,transparent), transparent 66%),
    linear-gradient(160deg,var(--exam-bg),var(--exam-bg-soft) 62%,var(--exam-bg));
  color:var(--exam-text);
  font:500 16px/1.55 var(--font-body);
  overflow-x:clip;
}
.exam-runtime,.exam-runtime *,.exam-runtime *::before,.exam-runtime *::after{box-sizing:border-box;min-width:0}
.exam-runtime[data-theme='light']{
  --exam-bg:var(--page-bg);
  --exam-bg-soft:color-mix(in srgb,var(--page-bg) 84%,var(--surface) 16%);
  --exam-surface:var(--surface);
  --exam-surface-soft:color-mix(in srgb,var(--surface-soft) 90%,var(--surface) 10%);
  --exam-surface-glass:color-mix(in srgb,var(--surface) 88%,transparent);
  --exam-border:var(--border);
  --exam-text:var(--text);
  --exam-text-muted:var(--text-muted);
  --exam-timer-bg:color-mix(in srgb,var(--surface-soft) 80%,var(--accent) 20%);
  --exam-timer-border:color-mix(in srgb,var(--accent) 40%,var(--border));
  background:
    radial-gradient(1000px 560px at -4% -8%, color-mix(in srgb,var(--exam-accent) 16%,transparent), transparent 62%),
    radial-gradient(860px 560px at 100% -2%, color-mix(in srgb,var(--exam-accent) 14%,transparent), transparent 70%),
    linear-gradient(165deg,var(--exam-bg),var(--exam-bg-soft) 58%,var(--exam-bg));
}
.exam-runtime::before,
.exam-runtime::after{content:"";position:fixed;inset:auto auto 10% -8%;width:220px;height:220px;border-radius:999px;pointer-events:none;opacity:.24;background:radial-gradient(circle at 30% 30%,color-mix(in srgb,var(--exam-accent) 28%,transparent),transparent 70%);z-index:0}
.exam-runtime::after{inset:auto -9% -2% auto;width:260px;height:260px;opacity:.2}
.exam-shell{position:relative;z-index:1;min-height:100vh;display:grid;grid-template-rows:auto 1fr;max-width:100%;overflow-x:clip}
.exam-top{position:sticky;top:0;z-index:20;background:var(--exam-surface-glass);backdrop-filter:blur(8px);border-bottom:1px solid var(--exam-border);display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 14px}
.exam-top > div{min-width:0}
.exam-top h1{margin:0;font-size:1.08rem;line-height:1.25}
.exam-meta{display:flex;align-items:center;gap:10px;flex-wrap:wrap;font-size:.84rem;color:var(--exam-text-muted)}
.exam-timer{padding:6px 11px;border-radius:999px;border:1px solid var(--exam-timer-border);background:var(--exam-timer-bg);color:color-mix(in srgb,var(--exam-accent) 72%,var(--exam-text));font-weight:800;min-width:118px;text-align:center;letter-spacing:.02em}
.exam-progress{font-weight:700;color:color-mix(in srgb,var(--exam-accent) 66%,var(--exam-text))}
.exam-actions{display:flex;gap:8px;align-items:center}
.exam-btn{height:36px;border-radius:10px;border:1px solid var(--exam-border);padding:0 12px;background:var(--exam-surface-soft);cursor:pointer;font-weight:700;color:var(--exam-text);font-size:.88rem}
.exam-btn.submit{background:var(--exam-accent);border-color:color-mix(in srgb,var(--exam-accent) 68%,var(--exam-border));color:var(--exam-accent-ink)}
.exam-main{width:min(1060px,100%);max-width:100%;margin:14px auto 20px;padding:14px;display:grid;gap:10px;border:1px solid var(--exam-border);border-radius:16px;background:linear-gradient(180deg,color-mix(in srgb,var(--exam-surface) 92%,transparent),var(--exam-surface));overflow-x:clip}
.exam-q{padding:14px 0;border-bottom:1px solid color-mix(in srgb,var(--exam-border) 80%,transparent);display:grid;gap:10px}
.exam-q:last-child{border-bottom:0;padding-bottom:4px}
.exam-q-head{display:grid;grid-template-columns:auto 1fr auto;gap:9px;align-items:flex-start}
.exam-q-no{font-weight:800;color:var(--exam-text-muted);font-size:.95rem;line-height:1.4}
.exam-q-body,.exam-q-body p,.exam-q-body span{font-size:.98rem;line-height:1.6}
.exam-q-body *{max-width:100%;overflow-wrap:anywhere}
.exam-q-body pre,.exam-q-body code{white-space:pre-wrap;word-break:break-word}
.exam-q-body table{display:block;max-width:100%!important;overflow:auto}
.exam-q img,.exam-q video,.exam-q iframe{max-width:100%;height:auto;border-radius:10px;border:1px solid var(--exam-border);background:color-mix(in srgb,var(--exam-surface-soft) 90%,transparent)}
.exam-q-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px 12px}
.exam-opt{position:relative;display:grid;grid-template-columns:auto 1fr;gap:10px;align-items:flex-start;cursor:pointer;padding:10px 12px;border:1px solid var(--exam-border);border-radius:12px;background:var(--exam-surface-soft)}
.exam-opt-input{position:absolute;inset:0;opacity:0;appearance:none;margin:0;cursor:pointer}
.exam-opt-key{display:inline-flex;width:28px;height:28px;border-radius:999px;border:2px solid color-mix(in srgb,var(--exam-border) 72%,var(--exam-text-muted));align-items:center;justify-content:center;font-size:.84rem;font-weight:800;color:var(--exam-text-muted);line-height:1;margin-top:1px;background:transparent}
.exam-opt-text{font-size:.92rem;line-height:1.45;color:var(--exam-text)}
.exam-opt-input:checked + .exam-opt-key{background:var(--exam-accent);color:var(--exam-accent-ink);border-color:color-mix(in srgb,var(--exam-accent) 72%,var(--exam-border))}
.exam-opt-input:checked + .exam-opt-key + .exam-opt-text{color:var(--exam-text);font-weight:700}
.exam-opt:has(.exam-opt-input:checked){border-color:color-mix(in srgb,var(--exam-accent) 72%,var(--exam-border));background:color-mix(in srgb,var(--exam-accent) 16%,var(--exam-surface-soft))}
.exam-opt:has(.exam-opt-input:checked) .exam-opt-key{background:var(--exam-accent);color:var(--exam-accent-ink);border-color:color-mix(in srgb,var(--exam-accent) 72%,var(--exam-border))}
.exam-opt:has(.exam-opt-input:checked) .exam-opt-text{color:var(--exam-text);font-weight:700}
.exam-opt:has(.exam-opt-input:focus-visible){outline:2px solid color-mix(in srgb,var(--exam-accent) 70%,var(--exam-border));outline-offset:1px}
.exam-empty{padding:18px;text-align:center;color:var(--exam-text-muted)}
@media (max-width:760px){
  .exam-top{flex-wrap:wrap;align-items:flex-start;padding:10px 10px 9px}
  .exam-top h1{font-size:1rem}
  .exam-meta{font-size:.8rem;gap:8px}
  .exam-actions{width:100%;display:grid;grid-template-columns:1fr 1fr;gap:8px}
  .exam-timer{grid-column:1 / -1;justify-self:start;min-width:0}
  .exam-btn{height:39px}
  .exam-main{width:100%;margin:8px 0 12px;padding:10px;border-radius:13px}
  .exam-q{padding:10px 0}
  .exam-q-body,.exam-q-body p,.exam-q-body span{font-size:.95rem}
  .exam-q-options{grid-template-columns:1fr;gap:8px}
  .exam-opt{padding:10px}
  .exam-opt-key{width:26px;height:26px;font-size:.8rem}
}
`;

const EXAM_SESSION_SCRIPT = `
(() => {
  const dataEl = document.getElementById('examSessionData');
  if (!dataEl) return;
  const payload = JSON.parse(dataEl.textContent || '{}');
  const attempt = payload?.attempt || {};
  const stats = payload?.stats || {};
  const timerEl = document.getElementById('examTimer');
  const progressEl = document.getElementById('examProgress');
  const submitBtn = document.getElementById('examSubmitBtn');
  const exitBtn = document.getElementById('examExitBtn');
  const host = document.getElementById('examQuestionHost');
  if (!host) return;

  const savedTheme = String(window.localStorage.getItem('freeducation-theme') || '').trim().toLowerCase();
  const fallbackTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  const resolvedTheme = savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : fallbackTheme;
  document.body.setAttribute('data-theme', resolvedTheme);

  const active = String(attempt?.status || '') === 'active';
  const attemptId = Number(attempt?.id || 0);
  const storageKey = attemptId > 0 ? ('freeducation:exam-attempt:' + attemptId) : '';
  const serverNowMs = Date.parse(String(payload?.serverNow || ''));
  const clientNowMs = Date.now();
  const serverClockOffsetMs = Number.isFinite(serverNowMs) ? (clientNowMs - serverNowMs) : 0;
  const nowByServerClock = () => Date.now() - serverClockOffsetMs;
  if (!active) {
    if (submitBtn) submitBtn.hidden = true;
    if (exitBtn) exitBtn.hidden = true;
  }

  const readCachedAnswers = () => {
    if (!storageKey) return {};
    try {
      const raw = window.localStorage.getItem(storageKey);
      const parsed = raw ? JSON.parse(raw) : {};
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
      return parsed;
    } catch {
      return {};
    }
  };

  const writeCachedAnswers = (cache) => {
    if (!storageKey) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(cache || {}));
    } catch {
      // Ignore storage failures; server sync remains the source of truth.
    }
  };

  const clearCachedAnswers = () => {
    if (!storageKey) return;
    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      // Ignore storage failures.
    }
  };

  if (!active) clearCachedAnswers();
  const cachedAnswers = active ? readCachedAnswers() : {};
  Object.entries(cachedAnswers).forEach(([questionId, option]) => {
    const input = host.querySelector('input[type="radio"][data-question-id="' + String(questionId) + '"][value="' + String(option || '') + '"]');
    if (input) input.checked = true;
  });

  const totalQuestions = Number(stats?.totalQuestions || 0);
  const updateProgress = () => {
    const answered = host.querySelectorAll('input[type="radio"]:checked').length;
    if (progressEl) progressEl.textContent = answered + ' / ' + totalQuestions + ' answered';
  };
  updateProgress();

  const pendingSaves = new Map();
  let flushInFlight = false;
  let saveTimer = null;
  const flushPendingSaves = async () => {
    if (!active || flushInFlight || !pendingSaves.size) return;
    flushInFlight = true;
    const entries = Array.from(pendingSaves.entries());
    for (const [questionId, selectedOption] of entries) {
      try {
        const response = await fetch('/api/public/exams/attempts/' + attempt.id + '/answer', {
          method: 'PATCH',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ sessionQuestionId: questionId, selectedOption }),
        });
        if (response.ok) {
          pendingSaves.delete(questionId);
        }
      } catch {
        // Keep pending and retry.
      }
    }
    flushInFlight = false;
    if (pendingSaves.size) {
      if (saveTimer) clearTimeout(saveTimer);
      saveTimer = setTimeout(flushPendingSaves, 1200);
    }
  };

  const queueSave = (questionId, selectedOption) => {
    if (!active || !questionId || !selectedOption) return;
    pendingSaves.set(questionId, selectedOption);
    cachedAnswers[String(questionId)] = selectedOption;
    writeCachedAnswers(cachedAnswers);
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(flushPendingSaves, 140);
  };

  host.addEventListener('change', (event) => {
    const input = event.target.closest('input[type="radio"][data-question-id]');
    if (!input) return;
    const questionId = Number(input.getAttribute('data-question-id') || 0);
    const selectedOption = String(input.value || '');
    if (!questionId || !selectedOption) return;
    updateProgress();
    queueSave(questionId, selectedOption);
  });

  window.addEventListener('online', () => {
    flushPendingSaves();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') flushPendingSaves();
  });

  const exitAttempt = async () => {
    if (!active) return;
    if (!window.confirm('Exit exam now? Your attempt will be closed.')) return;
    exitBtn.disabled = true;
    submitBtn.disabled = true;
    try {
      await flushPendingSaves();
      const response = await fetch('/api/public/exams/attempts/' + attempt.id + '/exit', { method: 'POST' });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result?.error || 'Unable to exit exam');
      clearCachedAnswers();
      window.location.href = String(result?.redirectUrl || '/results');
    } catch (error) {
      alert(String(error?.message || 'Unable to exit exam'));
      exitBtn.disabled = false;
      submitBtn.disabled = false;
    }
  };

  const submitAttempt = async (force = false) => {
    if (!active) return;
    if (!force && !window.confirm('Submit exam now? You can submit with incomplete answers.')) return;
    exitBtn.disabled = true;
    submitBtn.disabled = true;
    try {
      await flushPendingSaves();
      const response = await fetch('/api/public/exams/attempts/' + attempt.id + '/submit', { method: 'POST' });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result?.error || 'Unable to submit exam');
      clearCachedAnswers();
      window.location.href = String(result?.redirectUrl || '/results');
    } catch (error) {
      alert(String(error?.message || 'Unable to submit exam'));
      exitBtn.disabled = false;
      submitBtn.disabled = false;
    }
  };

  if (exitBtn) exitBtn.addEventListener('click', exitAttempt);
  if (submitBtn) submitBtn.addEventListener('click', submitAttempt);

  if (active && timerEl) {
    const timed = Boolean(attempt?.timed);
    const expiresAt = String(attempt?.expiresAt || '');
    if (!timed || !expiresAt) {
      timerEl.textContent = 'Unlimited time';
    } else {
      let autoSubmitting = false;
      const updateTimer = async () => {
        const remaining = Date.parse(expiresAt) - nowByServerClock();
        if (remaining <= 0) {
          timerEl.textContent = 'Time over';
          if (!autoSubmitting) {
            autoSubmitting = true;
            await submitAttempt(true);
          }
          return;
        }
        const totalSeconds = Math.floor(remaining / 1000);
        const mm = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
        const ss = String(totalSeconds % 60).padStart(2, '0');
        timerEl.textContent = mm + ':' + ss;
      };
      updateTimer();
      setInterval(updateTimer, 1000);
    }
  }
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

function stringifyData(value) {
  return JSON.stringify(value || {}).replace(/</g, "\\u003c");
}

function optionCircleLabel(index) {
  return String.fromCharCode(65 + index);
}

function hasRichInlineMarkup(value) {
  const text = String(value || "").trim();
  if (!text) return false;
  if (/<[a-z][\s\S]*>/i.test(text)) return true;
  return false;
}

function richDisplayValue(value) {
  const raw = String(value || "");
  if (!raw) return "";
  if (hasRichInlineMarkup(raw)) return raw;
  return escapeHtml(raw).replaceAll("\n", "<br>");
}

export function examSetupPage({ user, navItems, homePath, subject, setupPayload } = {}) {
  const safeSubject = subject || setupPayload?.subject || {};
  const subjectId = Number(safeSubject?.id || 0);
  const activeAttempt = setupPayload?.activeAttempt || null;
  const recommendationHint = String(setupPayload?.options?.recommendation?.message || "").trim();

  const activeCard = activeAttempt
    ? `<section class="exam-card exam-resume"><h3>Active exam found</h3><p class="exam-msg">You already have an active exam attempt. Resume it now.</p><a class="exam-btn primary" href="${escapeHtml(String(activeAttempt.redirectUrl || '/'))}">Resume Exam</a></section>`
    : `<form id="examSetupForm" class="exam-card" action="/api/public/subjects/${subjectId}/exams/start" method="post">
      <div class="exam-grid">
        <div class="exam-field">
          <label for="examScope">Exam scope</label>
          <select id="examScope" name="scopeType"></select>
        </div>
        <div id="examNodeWrap" class="exam-field" hidden>
          <label id="examNodeLabel" for="examNode">Select book</label>
          <select id="examNode"></select>
        </div>
        <div id="examChapterWrap" class="exam-field" hidden>
          <label for="examChapter">Select chapter</label>
          <select id="examChapter" name="chapterId"></select>
        </div>
        <div id="examTopicChapterWrap" class="exam-field" hidden>
          <label for="examTopicChapter">Select chapter</label>
          <select id="examTopicChapter"></select>
        </div>
        <div id="examTopicWrap" class="exam-field" hidden>
          <label for="examTopic">Select topic</label>
          <select id="examTopic" name="topicId"></select>
        </div>
        <div class="exam-field exam-field-full exam-toggle">
          <input id="examTimed" type="checkbox" name="timed" value="1" />
          <label for="examTimed">Limited time exam</label>
        </div>
        <div id="examDurationWrap" class="exam-field" hidden>
          <label for="examDuration">Duration</label>
          <select id="examDuration" name="durationMinutes">${(setupPayload?.options?.durations || [5, 10, 15, 20, 30]).map((value) => `<option value="${Number(value)}">${Number(value)} minutes</option>`).join("")}</select>
        </div>
        <div class="exam-field">
          <label for="examQuestionCount">Questions</label>
          <select id="examQuestionCount" name="questionCount"></select>
        </div>
      </div>
      <p id="examSetupMsg" class="exam-msg" role="status" aria-live="polite"></p>
      <div class="exam-actions">
        <button id="examStartBtn" class="exam-btn primary" type="submit">Start Exam</button>
      </div>
    </form>`;

  const content = `<section class="exam-setup"><header class="exam-setup-head"><div><h2>${escapeHtml(safeSubject?.name || "Subject")}</h2><p>Configure your exam scope, question count, and time mode.</p></div><a class="exam-back" href="/subjects/${subjectId}">Back to subject</a></header>${recommendationHint && !activeAttempt ? `<p class="exam-hint">${escapeHtml(recommendationHint)}</p>` : ""}${activeCard}<script type="application/json" id="examSetupData">${stringifyData(setupPayload || {})}</script></section>`;

  return renderAppShellLayout({
    title: "Exam Setup",
    activeMenu: "results",
    user,
    navItems,
    homePath,
    pageClass: "page-exam-setup",
    contentClass: "app-content-flush",
    pageStyles: EXAM_SETUP_STYLE,
    shellScope: "public",
    content,
    script: EXAM_SETUP_SCRIPT,
  });
}

export function examSessionPage(payload = {}) {
  const attempt = payload?.attempt || {};
  const subject = payload?.subject || {};
  const questions = Array.isArray(payload?.questions) ? payload.questions : [];
  const rows = questions.length
    ? questions.map((question, index) => `<article class="exam-q"><header class="exam-q-head"><span class="exam-q-no">${index + 1}.</span><div class="exam-q-body">${richDisplayValue(question?.body || "")}</div></header>${question?.imageUrl ? `<img src="${escapeHtml(question.imageUrl)}" alt="Question image" loading="lazy" decoding="async" />` : ""}<section class="exam-q-options">${(Array.isArray(question?.options) ? question.options : []).map((option, optionIndex) => {
      const key = optionCircleLabel(optionIndex);
      const checked = String(question?.selectedOption || "").toUpperCase() === key ? " checked" : "";
      return `<label class="exam-opt"><input class="exam-opt-input" type="radio" name="q-${Number(question?.sessionQuestionId || 0)}" value="${key}" data-question-id="${Number(question?.sessionQuestionId || 0)}"${checked} /><span class="exam-opt-key">${key}</span><span class="exam-opt-text">${richDisplayValue(option || "")}</span></label>`;
    }).join("")}</section></article>`).join("")
    : `<p class="exam-empty">No questions found in this attempt.</p>`;

  const body = `<div class="exam-shell"><header class="exam-top"><div><h1>${escapeHtml(subject?.name || "Exam")}</h1><div class="exam-meta"><span>${escapeHtml(payload?.scopeLabel || "")}</span><span id="examProgress" class="exam-progress">0 / 0 answered</span></div></div><div class="exam-actions"><span id="examTimer" class="exam-timer">--:--</span><button id="examExitBtn" type="button" class="exam-btn">Exit</button><button id="examSubmitBtn" type="button" class="exam-btn submit">Submit</button></div></header><main id="examQuestionHost" class="exam-main">${rows}</main><script type="application/json" id="examSessionData">${stringifyData(payload)}</script></div>`;

  return renderDocument({
    title: "Exam",
    bodyClass: "exam-runtime",
    pageStyles: EXAM_SESSION_STYLE,
    body,
    script: EXAM_SESSION_SCRIPT,
  });
}
