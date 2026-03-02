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
  const chapterWrap = document.getElementById('examChapterWrap');
  const chapterSelect = document.getElementById('examChapter');
  const topicWrap = document.getElementById('examTopicWrap');
  const topicSelect = document.getElementById('examTopic');
  const timedCheck = document.getElementById('examTimed');
  const durationWrap = document.getElementById('examDurationWrap');
  const durationSelect = document.getElementById('examDuration');
  const countSelect = document.getElementById('examQuestionCount');
  const submitBtn = document.getElementById('examStartBtn');
  const msg = document.getElementById('examSetupMsg');

  const options = payload?.options || {};
  const chapterPools = Array.isArray(options?.chapters) ? options.chapters : [];
  const topicPools = Array.isArray(options?.topics) ? options.topics : [];

  const byNode = chapterPools.reduce((acc, item) => {
    const key = String(item?.nodeId || 0);
    if (!acc[key]) acc[key] = { nodeId: Number(item?.nodeId || 0), nodeName: String(item?.nodeName || 'Section'), chapters: [] };
    acc[key].chapters.push(item);
    return acc;
  }, {});

  const scopeChoices = [];
  if (Number(options?.full?.count || 0) >= 5) scopeChoices.push({ key: 'full', label: 'Full Subject' });
  if (chapterPools.some((item) => Number(item?.count || 0) >= 5)) scopeChoices.push({ key: 'chapter', label: 'Chapter Wise' });
  if (topicPools.some((item) => Number(item?.count || 0) >= 5)) scopeChoices.push({ key: 'topic', label: 'Topic Wise' });

  if (!scopeChoices.length) {
    if (msg) msg.textContent = 'At least 5 MCQs are required to start an exam.';
    submitBtn.disabled = true;
    return;
  }

  scopeSelect.innerHTML = scopeChoices.map((scope) => '<option value="' + scope.key + '">' + scope.label + '</option>').join('');

  const fillChapterOptions = () => {
    const allChapters = chapterPools.filter((item) => Number(item?.count || 0) >= 5);
    chapterSelect.innerHTML = allChapters.map((item) => {
      const label = (item?.chapterNumber ? ('Chapter ' + item.chapterNumber + ' - ') : '') + item.chapterName + ' (' + item.count + ' MCQ)';
      return '<option value="' + item.chapterId + '">' + label + '</option>';
    }).join('');
  };

  const fillTopicOptions = () => {
    const allTopics = topicPools.filter((item) => Number(item?.count || 0) >= 5);
    topicSelect.innerHTML = allTopics.map((item) => {
      const label = item.chapterName + ' / ' + item.topicName + ' (' + item.count + ' MCQ)';
      return '<option value="' + item.topicId + '">' + label + '</option>';
    }).join('');
  };

  const buildQuestionCount = () => {
    let allowed = [];
    const scope = String(scopeSelect.value || 'full');
    if (scope === 'full') {
      allowed = Array.isArray(options?.full?.questionCountOptions) ? options.full.questionCountOptions : [];
    } else if (scope === 'chapter') {
      const chapterId = Number(chapterSelect.value || 0);
      const selected = chapterPools.find((item) => Number(item?.chapterId || 0) === chapterId);
      allowed = Array.isArray(selected?.questionCountOptions) ? selected.questionCountOptions : [];
    } else {
      const topicId = Number(topicSelect.value || 0);
      const selected = topicPools.find((item) => Number(item?.topicId || 0) === topicId);
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

  const syncVisibility = () => {
    const scope = String(scopeSelect.value || 'full');
    chapterWrap.hidden = scope !== 'chapter';
    topicWrap.hidden = scope !== 'topic';
    durationWrap.hidden = !timedCheck.checked;
    buildQuestionCount();
  };

  fillChapterOptions();
  fillTopicOptions();
  syncVisibility();

  scopeSelect.addEventListener('change', syncVisibility);
  chapterSelect.addEventListener('change', buildQuestionCount);
  topicSelect.addEventListener('change', buildQuestionCount);
  timedCheck.addEventListener('change', syncVisibility);

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
.exam-runtime{margin:0;background:#f5f1e8;color:#202024;font-family:"Segoe UI",system-ui,sans-serif}
.exam-shell{min-height:100vh;display:grid;grid-template-rows:auto 1fr}
.exam-top{position:sticky;top:0;z-index:20;background:#fff;border-bottom:1px solid #d8d2c4;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 14px}
.exam-top h1{margin:0;font-size:1rem}
.exam-meta{display:flex;align-items:center;gap:10px;flex-wrap:wrap;font-size:.82rem;color:#6f6a60}
.exam-timer{padding:5px 10px;border-radius:999px;border:1px solid #c7b992;background:#fff7dc;color:#4f3f1b;font-weight:800;min-width:110px;text-align:center}
.exam-progress{font-weight:700;color:#4f5d78}
.exam-actions{display:flex;gap:8px}
.exam-btn{height:34px;border-radius:9px;border:1px solid #c9c1af;padding:0 11px;background:#fff;cursor:pointer;font-weight:700}
.exam-btn.submit{background:#b3833b;border-color:#8d6b38;color:#fff}
.exam-main{padding:14px;display:grid;gap:10px}
.exam-q{padding:10px 0;border-bottom:1px solid #ddd6c7;display:grid;gap:8px}
.exam-q-head{display:grid;grid-template-columns:auto 1fr auto;gap:8px;align-items:flex-start}
.exam-q-no{font-weight:800;color:#7d7568}
.exam-q-body *{max-width:100%;overflow-wrap:anywhere}
.exam-q img,.exam-q video,.exam-q iframe{max-width:100%;height:auto;border-radius:8px;border:1px solid #d4cdbd}
.exam-q-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px 12px}
.exam-opt{display:grid;grid-template-columns:auto auto 1fr;gap:6px;align-items:start;cursor:pointer}
.exam-opt-key{display:inline-flex;width:19px;height:19px;border-radius:999px;border:1px solid #91897a;align-items:center;justify-content:center;font-size:.72rem;font-weight:700;color:#5c5448;line-height:1;margin-top:1px}
.exam-opt-input{margin-top:2px}
.exam-empty{padding:16px;text-align:center;color:#665f55}
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
  if (!active) {
    if (submitBtn) submitBtn.hidden = true;
    if (exitBtn) exitBtn.hidden = true;
  }

  const totalQuestions = Number(stats?.totalQuestions || 0);
  const updateProgress = () => {
    const answered = host.querySelectorAll('input[type="radio"]:checked').length;
    if (progressEl) progressEl.textContent = answered + ' / ' + totalQuestions + ' answered';
  };
  updateProgress();

  let saveTimer = null;
  const queueSave = (questionId, selectedOption) => {
    if (!active) return;
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(async () => {
      try {
        await fetch('/api/public/exams/attempts/' + attempt.id + '/answer', {
          method: 'PATCH',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ sessionQuestionId: questionId, selectedOption }),
        });
      } catch {
        // Keep local selection for resilience; next change retries.
      }
    }, 120);
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

  const exitAttempt = async () => {
    if (!active) return;
    if (!window.confirm('Exit exam now? Your attempt will be closed.')) return;
    exitBtn.disabled = true;
    submitBtn.disabled = true;
    try {
      const response = await fetch('/api/public/exams/attempts/' + attempt.id + '/exit', { method: 'POST' });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result?.error || 'Unable to exit exam');
      window.location.href = String(result?.redirectUrl || '/results');
    } catch (error) {
      alert(String(error?.message || 'Unable to exit exam'));
      exitBtn.disabled = false;
      submitBtn.disabled = false;
    }
  };

  const submitAttempt = async () => {
    if (!active) return;
    if (!window.confirm('Submit exam now? You can submit with incomplete answers.')) return;
    exitBtn.disabled = true;
    submitBtn.disabled = true;
    try {
      const response = await fetch('/api/public/exams/attempts/' + attempt.id + '/submit', { method: 'POST' });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result?.error || 'Unable to submit exam');
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
      const updateTimer = async () => {
        const remaining = Date.parse(expiresAt) - Date.now();
        if (remaining <= 0) {
          timerEl.textContent = 'Time over';
          await submitAttempt();
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

  const activeCard = activeAttempt
    ? `<section class="exam-card exam-resume"><h3>Active exam found</h3><p class="exam-msg">You already have an active exam attempt. Resume it now.</p><a class="exam-btn primary" href="${escapeHtml(String(activeAttempt.redirectUrl || '/'))}">Resume Exam</a></section>`
    : `<form id="examSetupForm" class="exam-card" action="/api/public/subjects/${subjectId}/exams/start" method="post"><div class="exam-grid"><div class="exam-field"><label for="examScope">Exam scope</label><select id="examScope" name="scopeType"></select></div><div id="examChapterWrap" class="exam-field" hidden><label for="examChapter">Select chapter</label><select id="examChapter" name="chapterId"></select></div><div id="examTopicWrap" class="exam-field" hidden><label for="examTopic">Select topic</label><select id="examTopic" name="topicId"></select></div><div class="exam-field exam-toggle"><input id="examTimed" type="checkbox" name="timed" value="1" /><label for="examTimed">Limited time exam</label></div><div id="examDurationWrap" class="exam-field" hidden><label for="examDuration">Duration</label><select id="examDuration" name="durationMinutes">${(setupPayload?.options?.durations || [5, 10, 15, 20, 30]).map((value) => `<option value="${Number(value)}">${Number(value)} minutes</option>`).join("")}</select></div><div class="exam-field"><label for="examQuestionCount">Questions</label><select id="examQuestionCount" name="questionCount"></select></div></div><p id="examSetupMsg" class="exam-msg" role="status" aria-live="polite"></p><div class="exam-actions"><button id="examStartBtn" class="exam-btn primary" type="submit">Start Exam</button></div></form>`;

  const content = `<section class="exam-setup"><header class="exam-setup-head"><div><h2>${escapeHtml(safeSubject?.name || "Subject")}</h2><p>Configure your exam scope, question count, and time mode.</p></div><a class="exam-back" href="/subjects/${subjectId}">Back to subject</a></header>${activeCard}<script type="application/json" id="examSetupData">${stringifyData(setupPayload || {})}</script></section>`;

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
