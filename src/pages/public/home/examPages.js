import { basePage } from "../../templates/base.js";
import { publicShell } from "../../templates/publicShell.js";
import { h } from "./publicUi.js";
import { imageUrlFromKey } from "../../imageUrl.js";

const examStyles = `
.exam-float-btn { position: fixed; right: max(10px, env(safe-area-inset-right)); bottom: max(12px, env(safe-area-inset-bottom)); z-index: 40; background: #1d4ed8; color: #fff; border-radius: 999px; padding: 10px 14px; font-weight: 700; text-decoration: none; box-shadow: 0 10px 24px rgba(30, 64, 175, .34); }
.exam-float-btn:hover { background: #1e40af; }
.exam-setup { display: grid; gap: 8px; border: 1px solid #c7d7fb; padding: 8px; background: #fff; }
.exam-grid { display: grid; gap: 6px; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
.exam-sheet { max-width: 960px; margin: 0 auto; padding: 10px; }
.exam-toolbar { position: sticky; top: 0; background: #fff; border-bottom: 1px solid #dbe4ff; padding: 8px 0; display: flex; justify-content: space-between; gap: 8px; z-index: 5; }
.exam-question { border: 1px solid #dbe4ff; margin-bottom: 8px; padding: 8px; }
.exam-question h3 { margin: 0 0 6px; font-size: 14px; }
.exam-options { display: grid; gap: 4px; margin: 6px 0 0; }
.exam-result-correct { border-color: #16a34a; background: #f0fdf4; }
.exam-result-wrong { border-color: #ef4444; background: #fef2f2; }
.exam-progress { height: 8px; background: #e2e8f0; border-radius: 999px; overflow: hidden; }
.exam-progress > span { display: block; height: 100%; background: #2563eb; }
`;

function scopeLabel(exam) {
  if (exam.exam_scope === "subject") return "Full Subject";
  if (exam.exam_scope === "topic") return `Topic: ${exam.topic_name || ""}`;
  return `Chapter: ${exam.chapter_name || ""}`;
}

export function withFloatingExamButton(content, examHref) {
  return `${content}<a class="exam-float-btn" href="${h(examHref)}">Exam</a>`;
}

export function examSetupPage(user, context) {
  const subject = context.subject;
  const books = context.books || [];
  const chapters = context.chapters || [];
  const topics = context.topics || [];
  const counts = context.counts || { subject: 0, chapter: 0, topic: 0 };

  const questionOptions = context.questionOptions.map((value) => `<option value="${value}">${value}</option>`).join("");
  const topicVisible = topics.length > 0;

  const script = `
  (() => {
    const form = document.querySelector('[data-exam-setup-form]');
    if (!form) return;
    const scope = form.querySelector('[name="scope"]');
    const topicWrap = form.querySelector('[data-topic-wrap]');
    const limitType = form.querySelector('[name="timeMode"]');
    const limitMinutes = form.querySelector('[name="timeLimitMinutes"]');
    const toggle = () => {
      topicWrap.hidden = scope.value !== 'topic';
      limitMinutes.disabled = limitType.value !== 'limited';
    };
    form.addEventListener('change', toggle);
    toggle();
  })();`;

  return publicShell(
    "home",
    user,
    `${subject.name} Exam Setup`,
    `<section class="public-stack public-stack-flat">
      <header class="public-stack-head">
        <h1 class="public-stack-title">Exam setup</h1>
        <p class="public-stack-subtitle">${h(subject.name)} · Choose scope, time and question count.</p>
      </header>
      <form method="post" action="/api/exams/start" class="exam-setup" data-exam-setup-form>
        <input type="hidden" name="subjectId" value="${h(subject.id)}"/>
        <div class="exam-grid">
          <label>Scope
            <select class="input" name="scope" required>
              <option value="subject">Full Subject (${counts.subject} MCQs)</option>
              <option value="chapter">Chapter wise (${counts.chapter} MCQs)</option>
              ${topicVisible ? `<option value="topic">Topic wise (${counts.topic} MCQs)</option>` : ""}
            </select>
          </label>
          <label>Book / Node
            <select class="input" name="subjectNodeId" required>
              ${books.map((book) => `<option value="${h(book.id)}">${h(book.display_name)}</option>`).join("")}
            </select>
          </label>
          <label>Chapter
            <select class="input" name="chapterId">
              <option value="">All Chapters</option>
              ${chapters.map((chapter) => `<option value="${h(chapter.id)}">${h(chapter.name)}</option>`).join("")}
            </select>
          </label>
          <label data-topic-wrap ${topicVisible ? "" : "hidden"}>Topic
            <select class="input" name="topicId">
              <option value="">Select Topic</option>
              ${topics.map((topic) => `<option value="${h(topic.id)}">${h(topic.name)}</option>`).join("")}
            </select>
          </label>
          <label>Question count
            <select class="input" name="questionCount" required>${questionOptions}</select>
          </label>
          <label>Time mode
            <select class="input" name="timeMode">
              <option value="unlimited">Unlimited</option>
              <option value="limited">Limited</option>
            </select>
          </label>
          <label>Time limit (minutes)
            <input class="input" type="number" min="1" max="180" name="timeLimitMinutes" value="20" />
          </label>
        </div>
        <button class="btn" type="submit">Start Exam</button>
      </form>
    </section>`,
    script,
    examStyles,
  );
}

export function examTakePage(user, exam, questions) {
  const questionMarkup = questions
    .map((q) => {
      const image = q.image_key ? `<img src="${h(imageUrlFromKey(q.image_key))}" alt="Question image" loading="lazy" />` : "";
      const options = ["A", "B", "C", "D"]
        .map((letter) => `<label><input type="radio" name="q_${q.question_order}" value="${letter}" ${q.selected_option === letter ? "checked" : ""}/> ${letter}. ${h(q[`option_${letter.toLowerCase()}`] || "")}</label>`)
        .join("");
      return `<article class="exam-question" data-question="${q.question_order}">
        <h3>${q.question_order}. ${q.question_html}</h3>
        ${image}
        <div class="exam-options">${options}</div>
      </article>`;
    })
    .join("");

  const script = `
  (() => {
    const form = document.querySelector('[data-exam-form]');
    const timeEl = document.querySelector('[data-time-left]');
    const expiresAt = Number(form?.dataset.expiresAt || 0);
    const examId = form?.dataset.examId;
    if (!form || !examId) return;

    const saveChoice = async (questionOrder, selectedOption) => {
      localStorage.setItem('exam-' + examId + '-q-' + questionOrder, selectedOption || '');
      const payload = new FormData();
      payload.set('questionOrder', String(questionOrder));
      payload.set('selectedOption', selectedOption || '');
      await fetch('/api/exams/' + examId + '/answer', { method: 'POST', body: payload, credentials: 'include' });
    };

    form.addEventListener('change', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement) || target.type !== 'radio') return;
      const questionOrder = Number(target.name.replace('q_', ''));
      saveChoice(questionOrder, target.value);
    });

    const updateTimer = () => {
      if (!expiresAt || !timeEl) { if (timeEl) timeEl.textContent = 'Unlimited'; return; }
      const remain = Math.max(0, expiresAt - Date.now());
      const min = String(Math.floor(remain / 60000)).padStart(2, '0');
      const sec = String(Math.floor((remain % 60000) / 1000)).padStart(2, '0');
      timeEl.textContent = min + ':' + sec;
      if (remain <= 0) form.submit();
    };
    updateTimer();
    setInterval(updateTimer, 1000);
  })();`;

  return basePage(
    `${exam.subject_name} Exam`,
    `<main class="exam-sheet">
      <form method="post" action="/api/exams/${h(exam.id)}/submit" data-exam-form data-exam-id="${h(exam.id)}" data-expires-at="${Number(exam.expires_at || 0)}">
        <div class="exam-toolbar">
          <div><strong>${h(exam.subject_name)}</strong><div>${h(scopeLabel(exam))}</div></div>
          <div>Time: <strong data-time-left>--:--</strong></div>
          <div style="display:flex;gap:6px;"><a class="btn btn-danger" href="/api/exams/${h(exam.id)}/exit">Exit</a><button class="btn" type="submit">Submit</button></div>
        </div>
        ${questionMarkup}
      </form>
    </main>`,
    script,
    examStyles,
  );
}

export function examResultPage(user, exam, questions, attempts = []) {
  const answered = questions.filter((q) => q.selected_option).length;
  const pct = Number(exam.score_percent || 0);
  const sheet = questions
    .map((q) => {
      const stateClass = !q.selected_option ? "" : q.selected_option === q.correct_option ? "exam-result-correct" : "exam-result-wrong";
      return `<article class="exam-question ${stateClass}">
        <h3>${q.question_order}. ${q.question_html}</h3>
        <p>Your answer: <strong>${h(q.selected_option || "Not answered")}</strong> · Correct: <strong>${h(q.correct_option || "-")}</strong></p>
      </article>`;
    })
    .join("");

  return publicShell(
    "home",
    user,
    "Exam Result",
    `<section class="public-stack public-stack-flat">
      <header class="public-stack-head">
        <h1 class="public-stack-title">Exam Result</h1>
        <p class="public-stack-subtitle">${h(exam.subject_name)} · ${h(scopeLabel(exam))}</p>
      </header>
      <p><strong>Score:</strong> ${h(exam.score_correct || 0)} / ${h(exam.score_total || 0)} (${pct}%) · Answered ${answered}/${questions.length}</p>
      <div class="exam-progress"><span style="width:${pct}%"></span></div>
      <p style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px;"><a class="btn" href="/results">All Results</a><a class="btn" href="/api/exams/${h(exam.id)}/retake">Retake (shuffle)</a></p>
      <h3>Retake history</h3>
      <ul>${attempts.map((a) => `<li><a href="/results/${h(a.id)}">Attempt ${h(a.created_at)}</a> · ${h(a.score_correct || 0)}/${h(a.score_total || 0)}</li>`).join("") || "<li>No retakes yet.</li>"}</ul>
      ${sheet}
    </section>`,
    "",
    examStyles,
  );
}

export function resultsListPage(user, rows = []) {
  return publicShell(
    "home",
    user,
    "Results",
    `<section class="public-stack public-stack-flat">
      <header class="public-stack-head"><h1 class="public-stack-title">Results</h1></header>
      <ul class="public-note-list is-plain">
      ${rows
        .map(
          (row) => `<li><a href="/results/${h(row.root_exam_id)}"><strong>${h(row.subject_name)}</strong> · ${h(row.scope_label)}</a><br/>Attempts: ${h(row.attempts)} · Best: ${h(Number(row.best_score_percent || 0).toFixed(2))}%</li>`,
        )
        .join("") || "<li>No exam results yet.</li>"}
      </ul>
    </section>`,
    "",
    examStyles,
  );
}
