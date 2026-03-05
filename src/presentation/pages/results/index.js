import { renderAppShellLayout } from "../../layout/appShell/index.js";

const RESULTS_STYLE = `
.results-wrap{display:grid;gap:12px;padding:12px var(--space-2) var(--space-2)}
.results-head{display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap}
.results-head h2{margin:0;font-size:1.06rem}
.results-head p{margin:0;color:var(--text-muted);font-size:.84rem}
.results-card{border:1px solid var(--border);border-radius:12px;background:var(--surface);padding:10px;display:grid;gap:8px}
.results-list{display:grid;gap:8px}
.results-row{display:grid;grid-template-columns:minmax(180px,1.1fr) minmax(120px,.8fr) minmax(100px,.55fr) minmax(100px,.55fr) auto;gap:8px;align-items:center;padding:8px;border:1px solid color-mix(in srgb,var(--border) 80%,transparent);border-radius:10px}
.results-row strong{font-size:.9rem}
.results-meta{font-size:.78rem;color:var(--text-muted)}
.results-score{font-weight:800}
.results-btn{height:30px;border:1px solid var(--border);border-radius:8px;padding:0 10px;background:var(--surface-soft);color:var(--text);text-decoration:none;font-weight:700;display:inline-flex;align-items:center}
.results-btn:hover{border-color:color-mix(in srgb,var(--accent) 55%,var(--border))}
.results-empty{padding:12px;border:1px dashed var(--border);border-radius:10px;color:var(--text-muted)}
.result-attempts{display:flex;gap:6px;flex-wrap:wrap}
.result-chip{height:30px;border-radius:999px;border:1px solid var(--border);padding:0 10px;background:var(--surface-soft);font-weight:700;color:var(--text);text-decoration:none;display:inline-flex;align-items:center}
.result-chip.active{background:color-mix(in srgb,var(--accent) 18%,var(--surface));border-color:color-mix(in srgb,var(--accent) 60%,var(--border))}
.result-bars{display:grid;gap:6px}
.result-bar-row{display:grid;grid-template-columns:68px minmax(0,1fr) 50px;align-items:center;gap:8px}
.result-bar{height:8px;border-radius:999px;background:color-mix(in srgb,var(--border) 65%,transparent);overflow:hidden}
.result-bar > span{display:block;height:100%;background:color-mix(in srgb,var(--accent) 70%,#71b07a)}
.result-questions{display:grid;gap:8px}
.result-q{padding:8px 0;border-bottom:1px solid color-mix(in srgb,var(--border) 88%,transparent);display:grid;gap:6px}
.result-q-head{display:grid;grid-template-columns:auto minmax(0,1fr);gap:6px;align-items:start}
.result-q-no{font-weight:800;color:var(--text-muted)}
.result-q img,.result-q video,.result-q iframe{max-width:100%;height:auto;border-radius:8px;border:1px solid var(--border)}
.result-opts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:5px 10px}
.result-opt{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:8px;align-items:start;min-width:0;padding:7px 8px;border:1px solid color-mix(in srgb,var(--border) 85%,transparent);border-radius:10px;background:color-mix(in srgb,var(--surface-soft) 65%,transparent)}
.result-opt-key{width:18px;height:18px;border-radius:999px;border:1px solid var(--border);display:inline-flex;align-items:center;justify-content:center;font-size:.7rem;font-weight:700;color:var(--text-muted);line-height:1}
.result-opt-label{min-width:0;overflow-wrap:anywhere}
.result-opt-tag{display:inline-flex;align-items:center;height:20px;padding:0 7px;border-radius:999px;font-size:.66rem;font-weight:800;letter-spacing:.01em;border:1px solid transparent}
.result-opt.is-correct{border-color:color-mix(in srgb,#2f9a66 55%,var(--border));background:color-mix(in srgb,#2f9a66 14%,var(--surface));color:color-mix(in srgb,#2f9a66 80%,var(--text))}
.result-opt.is-correct .result-opt-key{border-color:#2f9a66;color:#1f7a4e;background:color-mix(in srgb,#2f9a66 18%,transparent)}
.result-opt.is-correct .result-opt-tag{border-color:color-mix(in srgb,#2f9a66 70%,var(--border));background:color-mix(in srgb,#2f9a66 20%,var(--surface));color:#18593a}
.result-opt.is-selected{border-color:color-mix(in srgb,var(--accent) 48%,var(--border))}
.result-opt.is-selected .result-opt-key{border-color:color-mix(in srgb,var(--accent) 62%,var(--border));color:color-mix(in srgb,var(--accent) 76%,var(--text))}
.result-opt.is-selected .result-opt-tag{border-color:color-mix(in srgb,var(--accent) 54%,var(--border));background:color-mix(in srgb,var(--accent) 18%,var(--surface));color:color-mix(in srgb,var(--accent) 80%,var(--text))}
.result-opt.is-wrong-selected{border-color:color-mix(in srgb,#d84b4b 68%,var(--border));background:color-mix(in srgb,#d84b4b 12%,var(--surface));color:color-mix(in srgb,#d84b4b 80%,var(--text))}
.result-opt.is-wrong-selected .result-opt-key{border-color:#d84b4b;color:#b12a2a;background:color-mix(in srgb,#d84b4b 18%,transparent)}
.result-opt.is-wrong-selected .result-opt-tag{border-color:color-mix(in srgb,#d84b4b 70%,var(--border));background:color-mix(in srgb,#d84b4b 18%,var(--surface));color:#8d1f1f}
.results-actions{display:flex;justify-content:flex-end;gap:8px;flex-wrap:wrap}
@media (max-width:900px){.results-row{grid-template-columns:1fr}.result-opts{grid-template-columns:1fr}}
`;

const RESULTS_SCRIPT = `
(() => {
  const retakeBtn = document.getElementById('retakeExamBtn');
  if (!retakeBtn) return;
  const msg = document.getElementById('resultsMsg');
  retakeBtn.addEventListener('click', async () => {
    const sessionId = Number(retakeBtn.getAttribute('data-session-id') || 0);
    if (!sessionId) return;
    retakeBtn.disabled = true;
    if (msg) msg.textContent = 'Starting retake...';
    try {
      const response = await fetch('/api/public/exams/sessions/' + sessionId + '/retake', { method: 'POST' });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result?.error || 'Unable to start retake');
      window.location.href = String(result?.redirectUrl || '/results');
    } catch (error) {
      if (msg) msg.textContent = String(error?.message || 'Unable to start retake');
      retakeBtn.disabled = false;
    }
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

function optionKey(index) {
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

function toDateLabel(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw;
  return date.toLocaleString();
}

export function examResultsPage({ user, navItems, homePath, sessions = [] } = {}) {
  const rows = Array.isArray(sessions) ? sessions : [];
  const content = `<section class="results-wrap"><header class="results-head"><div><h2>Exam Results</h2><p>History of your completed and exited exams.</p></div></header><section class="results-card">${rows.length
      ? `<div class="results-list">${rows.map((row) => `<article class="results-row"><div><strong>${escapeHtml(row?.subjectName || "Subject")}</strong><div class="results-meta">${escapeHtml(row?.scopeLabel || "Full Subject")}</div><div class="results-meta">${escapeHtml(toDateLabel(row?.createdAt))}</div></div><div><div class="results-meta">Latest</div><div class="results-score">${Number(row?.latestScore || 0)}%</div></div><div><div class="results-meta">Best</div><div class="results-score">${Number(row?.bestScore || 0)}%</div></div><div><div class="results-meta">Attempts</div><div class="results-score">${Number(row?.attemptsCount || 0)}</div></div><a class="results-btn" href="/results/${Number(row?.sessionId || 0)}">Details</a></article>`).join("")}</div>`
      : `<p class="results-empty">No exam history yet.</p>`}</section></section>`;

  return renderAppShellLayout({
    title: "Results",
    activeMenu: "results",
    user,
    navItems,
    homePath,
    pageClass: "page-results",
    contentClass: "app-content-flush",
    pageStyles: RESULTS_STYLE,
    shellScope: "public",
    content,
  });
}

export function examResultDetailPage({ user, navItems, homePath, detail } = {}) {
  const selected = detail?.selectedAttempt || {};
  const attempts = Array.isArray(detail?.attempts) ? detail.attempts : [];
  const progressSeries = Array.isArray(detail?.progressSeries) ? detail.progressSeries : [];
  const activeAttemptId = Number(selected?.id || 0);
  const subjectId = Number(detail?.subject?.id || 0);
  const subjectAction = subjectId > 0 ? `<a class="results-btn" href="/subjects/${subjectId}">Back to subject</a>` : "";

  const questionMarkup = (selected?.questions || []).map((question, index) => {
    const options = Array.isArray(question?.options) ? question.options : [];
    return `<article class="result-q"><header class="result-q-head"><span class="result-q-no">${index + 1}.</span><div>${richDisplayValue(question?.body || "")}</div></header>${question?.imageUrl ? `<img src="${escapeHtml(question.imageUrl)}" alt="Question image" loading="lazy" decoding="async" />` : ""}<section class="result-opts">${options.map((option, optionIndex) => {
      const key = optionKey(optionIndex);
      const isSelected = String(question?.selectedOption || "").toUpperCase() === key;
      const isCorrect = String(question?.correctOption || "").toUpperCase() === key;
      const wrongSelected = isSelected && !isCorrect;
      const classes = [
        "result-opt",
        isSelected ? "is-selected" : "",
        isCorrect ? "is-correct" : "",
        wrongSelected ? "is-wrong-selected" : "",
      ].filter(Boolean).join(" ");
      const tag = isCorrect
        ? (isSelected ? "Your correct answer" : "Correct answer")
        : (wrongSelected ? "Your answer" : "");
      return `<div class="${classes}"><span class="result-opt-key">${key}</span><span class="result-opt-label">${richDisplayValue(option || "")}</span>${tag ? `<span class="result-opt-tag">${escapeHtml(tag)}</span>` : ""}</div>`;
    }).join("")}</section></article>`;
  }).join("");

  const content = `<section class="results-wrap"><header class="results-head"><div><h2>${escapeHtml(detail?.subject?.name || "Result")}</h2><p>${escapeHtml(detail?.scopeLabel || "Full Subject")}</p></div><a class="results-btn" href="/results">Back to list</a></header><section class="results-card"><div class="result-attempts">${attempts.map((attempt) => `<a class="result-chip${Number(attempt?.id || 0) === activeAttemptId ? " active" : ""}" href="/results/${Number(detail?.session?.id || 0)}?attempt=${Number(attempt?.id || 0)}">Attempt ${Number(attempt?.attemptIndex || 0)}</a>`).join("")}</div><div class="results-meta">Score: ${Number(selected?.score || 0)}% | Correct: ${Number(selected?.correctCount || 0)} / ${Number(selected?.totalQuestions || 0)} | Answered: ${Number(selected?.answeredCount || 0)}</div><div class="result-bars">${progressSeries.map((item) => `<div class="result-bar-row"><span>Try ${Number(item?.attemptIndex || 0)}</span><div class="result-bar"><span style="width:${Math.max(0, Math.min(100, Number(item?.score || 0)))}%"></span></div><span>${Number(item?.score || 0)}%</span></div>`).join("")}</div><div class="results-actions"><button id="retakeExamBtn" data-session-id="${Number(detail?.session?.id || 0)}" class="results-btn" type="button">Retake Exam</button>${subjectAction}<a class="results-btn" href="/">Home</a></div><p id="resultsMsg" class="results-meta" role="status" aria-live="polite"></p></section><section class="results-card"><h3>Result Sheet</h3><div class="result-questions">${questionMarkup || '<p class="results-empty">No questions found.</p>'}</div></section></section>`;

  return renderAppShellLayout({
    title: "Result Detail",
    activeMenu: "results",
    user,
    navItems,
    homePath,
    pageClass: "page-results-detail",
    contentClass: "app-content-flush",
    pageStyles: RESULTS_STYLE,
    shellScope: "public",
    content,
    script: RESULTS_SCRIPT,
  });
}
