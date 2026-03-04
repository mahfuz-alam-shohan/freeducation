import { renderDocument } from "../../layout/document.js";
import { renderAppShellLayout } from "../../layout/appShell/index.js";

const EXAM_SETUP_STYLE = `
.exam-setup{display:grid;gap:14px;padding:14px var(--space-2) var(--space-2)}
.exam-setup-head{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap}
.exam-setup-head h2{margin:0;font-size:1.08rem}
.exam-setup-head p{margin:0;color:var(--text-muted);font-size:.85rem}
.exam-back{height:32px;border:1px solid var(--border);border-radius:999px;padding:0 12px;display:inline-flex;align-items:center;text-decoration:none;color:var(--text);font-weight:700;background:var(--surface-soft)}
.exam-back:hover{border-color:color-mix(in srgb,var(--accent) 50%,var(--border))}
.exam-card{border:1px solid var(--border);border-radius:12px;background:var(--surface);padding:12px;display:grid;gap:10px}
.exam-grid{display:grid;gap:10px;grid-template-columns:repeat(2,minmax(0,1fr))}
.exam-field{display:grid;gap:6px}
.exam-field label{font-weight:700;font-size:.84rem;color:var(--text-muted)}
.exam-field select,.exam-field input{height:36px;border:1px solid var(--border);border-radius:10px;padding:0 10px;background:var(--surface-soft);color:var(--text)}
.exam-field select:focus,.exam-field input:focus{outline:none;border-color:color-mix(in srgb,var(--accent) 58%,var(--border))}
.exam-toggle{display:flex;align-items:center;gap:10px}
.exam-toggle input{width:16px;height:16px;margin:0}
.exam-actions{display:flex;justify-content:flex-end;gap:8px}
.exam-btn{height:34px;border:1px solid var(--border);border-radius:10px;padding:0 12px;font-weight:700;cursor:pointer;background:var(--surface-soft);color:var(--text)}
.exam-btn.primary{background:var(--accent);color:var(--accent-contrast);border-color:color-mix(in srgb,var(--accent) 70%,var(--border))}
.exam-btn:disabled{opacity:.55;cursor:not-allowed}
.exam-msg{margin:0;font-size:.8rem;color:var(--text-muted)}
.exam-hint{margin:0;padding:8px 10px;border:1px solid color-mix(in srgb,var(--accent) 38%,var(--border));border-radius:10px;background:color-mix(in srgb,var(--accent) 10%,var(--surface));font-size:.8rem;color:color-mix(in srgb,var(--accent) 62%,var(--text));font-weight:600}
.exam-resume{display:grid;gap:8px}
.exam-resume a{justify-self:start;text-decoration:none}
@media (max-width:760px){.exam-grid{grid-template-columns:1fr}}
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
.exam-runtime{margin:0;background:#edf3fb;color:#16243a;font-family:"Segoe UI",system-ui,sans-serif}
.exam-shell{min-height:100vh;display:grid;grid-template-rows:auto 1fr}
.exam-top{position:sticky;top:0;z-index:20;background:#fff;border-bottom:1px solid #c8d7ea;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 14px}
.exam-top h1{margin:0;font-size:1rem}
.exam-meta{display:flex;align-items:center;gap:10px;flex-wrap:wrap;font-size:.82rem;color:#5f7392}
.exam-timer{padding:5px 10px;border-radius:999px;border:1px solid #8fb7eb;background:#eaf3ff;color:#194f99;font-weight:800;min-width:110px;text-align:center}
.exam-progress{font-weight:700;color:#2c5f9e}
.exam-actions{display:flex;gap:8px}
.exam-btn{height:34px;border-radius:9px;border:1px solid #b8cae2;padding:0 11px;background:#f7faff;cursor:pointer;font-weight:700;color:#163052}
.exam-btn.submit{background:#1f6fd8;border-color:#1558ae;color:#fff}
.exam-main{padding:14px;display:grid;gap:10px}
.exam-q{padding:10px 0;border-bottom:1px solid #d5e1f0;display:grid;gap:8px}
.exam-q-head{display:grid;grid-template-columns:auto 1fr auto;gap:8px;align-items:flex-start}
.exam-q-no{font-weight:800;color:#677d9d}
.exam-q-body *{max-width:100%;overflow-wrap:anywhere}
.exam-q img,.exam-q video,.exam-q iframe{max-width:100%;height:auto;border-radius:8px;border:1px solid #c7d6e8}
.exam-q-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px 12px}
.exam-opt{display:grid;grid-template-columns:auto auto 1fr;gap:6px;align-items:start;cursor:pointer}
.exam-opt-key{display:inline-flex;width:19px;height:19px;border-radius:999px;border:1px solid #91a8c7;align-items:center;justify-content:center;font-size:.72rem;font-weight:700;color:#476487;line-height:1;margin-top:1px}
.exam-opt-input{margin-top:2px}
.exam-empty{padding:16px;text-align:center;color:#5d708d}
@media (prefers-color-scheme:dark){
  .exam-runtime{background:#0c1728;color:#e5edf8}
  .exam-top{background:#101d31;border-bottom-color:#2b3d58}
  .exam-meta{color:#99aecb}
  .exam-timer{border-color:#3a6ba8;background:#132945;color:#9ac7ff}
  .exam-progress{color:#8bbdff}
  .exam-btn{border-color:#314661;background:#17263d;color:#deebfb}
  .exam-btn.submit{background:#2f8cff;border-color:#2a75ce;color:#f4f9ff}
  .exam-q{border-bottom-color:#273953}
  .exam-q-no{color:#a8bad4}
  .exam-q img,.exam-q video,.exam-q iframe{border-color:#304763}
  .exam-opt-key{border-color:#5b769a;color:#adc6e9}
  .exam-empty{color:#9bb1cd}
}
@media (max-width:760px){.exam-top{flex-wrap:wrap}.exam-q-options{grid-template-columns:1fr}}
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

  const active = String(attempt?.status || '') === 'active';
  const attemptId = Number(attempt?.id || 0);
  const storageKey = attemptId > 0 ? ('freeducation:exam-attempt:' + attemptId) : '';
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
        const remaining = Date.parse(expiresAt) - Date.now();
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

export function examSetupPage({ user, navItems, homePath, subject, setupPayload } = {}) {
  const safeSubject = subject || setupPayload?.subject || {};
  const subjectId = Number(safeSubject?.id || 0);
  const activeAttempt = setupPayload?.activeAttempt || null;
  const recommendationHint = String(setupPayload?.options?.recommendation?.message || "").trim();

  const activeCard = activeAttempt
    ? `<section class="exam-card exam-resume"><h3>Active exam found</h3><p class="exam-msg">You already have an active exam attempt. Resume it now.</p><a class="exam-btn primary" href="${escapeHtml(String(activeAttempt.redirectUrl || '/'))}">Resume Exam</a></section>`
    : `<form id="examSetupForm" class="exam-card" action="/api/public/subjects/${subjectId}/exams/start" method="post"><div class="exam-grid"><div class="exam-field"><label for="examScope">Exam scope</label><select id="examScope" name="scopeType"></select></div><div id="examNodeWrap" class="exam-field" hidden><label id="examNodeLabel" for="examNode">Select book</label><select id="examNode"></select></div><div id="examChapterWrap" class="exam-field" hidden><label for="examChapter">Select chapter</label><select id="examChapter" name="chapterId"></select></div><div id="examTopicChapterWrap" class="exam-field" hidden><label for="examTopicChapter">Select chapter</label><select id="examTopicChapter"></select></div><div id="examTopicWrap" class="exam-field" hidden><label for="examTopic">Select topic</label><select id="examTopic" name="topicId"></select></div><div class="exam-field exam-toggle"><input id="examTimed" type="checkbox" name="timed" value="1" /><label for="examTimed">Limited time exam</label></div><div id="examDurationWrap" class="exam-field" hidden><label for="examDuration">Duration</label><select id="examDuration" name="durationMinutes">${(setupPayload?.options?.durations || [5, 10, 15, 20, 30]).map((value) => `<option value="${Number(value)}">${Number(value)} minutes</option>`).join("")}</select></div><div class="exam-field"><label for="examQuestionCount">Questions</label><select id="examQuestionCount" name="questionCount"></select></div></div><p id="examSetupMsg" class="exam-msg" role="status" aria-live="polite"></p><div class="exam-actions"><button id="examStartBtn" class="exam-btn primary" type="submit">Start Exam</button></div></form>`;

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
    content,
    script: EXAM_SETUP_SCRIPT,
  });
}

export function examSessionPage(payload = {}) {
  const attempt = payload?.attempt || {};
  const subject = payload?.subject || {};
  const questions = Array.isArray(payload?.questions) ? payload.questions : [];
  const rows = questions.length
    ? questions.map((question, index) => `<article class="exam-q"><header class="exam-q-head"><span class="exam-q-no">${index + 1}.</span><div class="exam-q-body">${String(question?.body || "")}</div></header>${question?.imageUrl ? `<img src="${escapeHtml(question.imageUrl)}" alt="Question image" loading="lazy" decoding="async" />` : ""}<section class="exam-q-options">${(Array.isArray(question?.options) ? question.options : []).map((option, optionIndex) => {
      const key = optionCircleLabel(optionIndex);
      const checked = String(question?.selectedOption || "").toUpperCase() === key ? " checked" : "";
      return `<label class="exam-opt"><input class="exam-opt-input" type="radio" name="q-${Number(question?.sessionQuestionId || 0)}" value="${key}" data-question-id="${Number(question?.sessionQuestionId || 0)}"${checked} /><span class="exam-opt-key">${key}</span><span>${String(option || "")}</span></label>`;
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
