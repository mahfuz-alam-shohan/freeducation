import { publicShell } from "../../templates/publicShell.js";
import { imageUrlFromKey } from "../../imageUrl.js";
import { learningPageStyles } from "./learningPageStyles.js";
import { h, renderCardGrid, renderFlatPage } from "./publicUi.js";

function renderEntryImage(imageKey, altText) {
  if (!imageKey) return "";
  const src = imageUrlFromKey(imageKey);
  if (!src) return "";
  return `<figure class="public-entry-image-frame"><img class="public-entry-image" src="${h(src)}" alt="${h(altText)}" loading="lazy" decoding="async" /></figure>`;
}

function resolveMcqAnswerLetter(item) {
  const normalized = String(item?.correct_option || "")
    .trim()
    .toUpperCase();
  const exactMatch = {
    A: "A",
    B: "B",
    C: "C",
    D: "D",
    1: "A",
    2: "B",
    3: "C",
    4: "D",
    OPTION_A: "A",
    OPTION_B: "B",
    OPTION_C: "C",
    OPTION_D: "D",
  }[normalized];
  if (exactMatch) return exactMatch;

  const inlineMatch = normalized.match(/[ABCD]/);
  if (inlineMatch) return inlineMatch[0];

  const optionTextByLetter = {
    A: String(item?.option_a || "")
      .trim()
      .toLowerCase(),
    B: String(item?.option_b || "")
      .trim()
      .toLowerCase(),
    C: String(item?.option_c || "")
      .trim()
      .toLowerCase(),
    D: String(item?.option_d || "")
      .trim()
      .toLowerCase(),
  };
  const textAnswer = String(item?.correct_option || "")
    .trim()
    .toLowerCase();
  return Object.entries(optionTextByLetter).find(([, optionText]) => optionText && optionText === textAnswer)?.[0] || "";
}

function renderMcqAnswer(item) {
  const letter = resolveMcqAnswerLetter(item);
  if (!letter) return "N/A";
  const textByLetter = {
    A: item?.option_a,
    B: item?.option_b,
    C: item?.option_c,
    D: item?.option_d,
  };
  const optionText = String(textByLetter[letter] || "").trim();
  return optionText ? `${letter}. ${h(optionText)}` : letter;
}

export function publicSubjectNodePage(user, subject, title, subtitle, items, hrefBuilder) {
  return publicShell(
    "home",
    user,
    `${subject.name} · ${title}`,
    renderFlatPage({
      title,
      subtitle,
      content: `<div class="public-flat-grid">${renderCardGrid(items, hrefBuilder)}</div>`,
    }),
    "",
    learningPageStyles,
  );
}

export function publicChapterContentPage(user, subject, node, chapter, tabState = {}, contentNodes = [], topicId = null) {
  const isAdmin = user?.role === "admin";
  const selectedTab = tabState?.selectedTab || "Short Notes";
  const tabItems = tabState?.items || [];
  const adminMetaInputs = `
    <input type="hidden" name="subjectId" value="${h(subject.id)}" />
    <input type="hidden" name="subjectNodeId" value="${h(node.id)}" />
    <input type="hidden" name="chapterId" value="${h(chapter.id || "")}" />
    <input type="hidden" name="topicId" value="${h(topicId || "")}" />
    <input type="hidden" name="redirect" value="${h(`/learn/subjects/${subject.id}/nodes/${node.id}/chapters/${chapter.id}${topicId ? `/topics/${topicId}` : ""}`)}" />
  `;
  const tabs = Array.from(new Set(["Short Notes", "MCQ Bank", "Summary", "CQ Bank", ...contentNodes.map((item) => item.content_kind || item.display_name)])).filter(Boolean);
  const tabPath = `/learn/subjects/${subject.id}/nodes/${node.id}/chapters/${chapter.id}${topicId ? `/topics/${topicId}` : ""}`;
  const actions = `<div class="public-tab-row">${tabs
    .map((tab) => `<a class="public-tab ${tab === selectedTab ? "is-active" : ""}" href="${tabPath}?tab=${encodeURIComponent(tab)}" ${tab === selectedTab ? 'aria-current="page"' : ""}>${h(tab)}</a>`)
    .join("")}</div>`;

  const isShortNotesTab = selectedTab === "Short Notes";
  const isMcqTab = selectedTab === "MCQ Bank";
  const isSummaryTab = selectedTab === "Summary";

  const notes = tabItems
    .map((entry) => {
      const entryBody = isMcqTab ? h(entry.question_html) : h(entry.content_html || entry.title || "");
      const adminActions = !isAdmin
        ? ""
        : isShortNotesTab
          ? `<div class="public-admin-inline-actions">
          <details class="public-admin-inline-card">
            <summary>Edit short note</summary>
            <form method="post" action="/api/notes" class="public-admin-inline-form">
              ${adminMetaInputs}
              <input type="hidden" name="id" value="${h(entry.id)}" />
              <textarea class="input" name="contentHtml" rows="4" required>${h(entry.content_html || "")}</textarea>
              <button class="btn" type="submit">Save note</button>
            </form>
          </details>
          <form method="post" action="/api/notes/delete">
            ${adminMetaInputs}
            <input type="hidden" name="id" value="${h(entry.id)}" />
            <button class="btn btn-danger" type="submit">Delete note</button>
          </form>
        </div>`
          : isMcqTab
            ? `<div class="public-admin-inline-actions">
          <details class="public-admin-inline-card">
            <summary>Edit MCQ</summary>
            <form method="post" action="/api/mcqs" class="public-admin-inline-form">
              ${adminMetaInputs}
              <input type="hidden" name="id" value="${h(entry.id)}" />
              <textarea class="input" name="questionHtml" rows="3" required>${h(entry.question_html || "")}</textarea>
              <input class="input" name="optionA" value="${h(entry.option_a || "")}" required />
              <input class="input" name="optionB" value="${h(entry.option_b || "")}" required />
              <input class="input" name="optionC" value="${h(entry.option_c || "")}" required />
              <input class="input" name="optionD" value="${h(entry.option_d || "")}" required />
              <select class="input" name="correctOption" required>
                ${["A", "B", "C", "D"].map((v) => `<option value="${v}" ${String(entry.correct_option || "").toUpperCase() === v ? "selected" : ""}>Correct: ${v}</option>`).join("")}
              </select>
              <button class="btn" type="submit">Save MCQ</button>
            </form>
          </details>
          <form method="post" action="/api/mcqs/delete">
            ${adminMetaInputs}
            <input type="hidden" name="id" value="${h(entry.id)}" />
            <button class="btn btn-danger" type="submit">Delete MCQ</button>
          </form>
        </div>`
            : `<div class="public-admin-inline-actions">
          <details class="public-admin-inline-card">
            <summary>Edit ${h(selectedTab)}</summary>
            <form method="post" action="/api/content-entries" class="public-admin-inline-form">
              ${adminMetaInputs}
              <input type="hidden" name="id" value="${h(entry.id)}" />
              <input type="hidden" name="contentKind" value="${h(selectedTab)}" />
              <input type="hidden" name="title" value="${h(entry.title || selectedTab)}" />
              <textarea class="input" name="contentHtml" rows="4" required>${h(entry.content_html || "")}</textarea>
              <button class="btn" type="submit">Save ${h(selectedTab)}</button>
            </form>
          </details>
          ${isSummaryTab ? "" : `<form method="post" action="/api/content-entries/delete">
            ${adminMetaInputs}
            <input type="hidden" name="id" value="${h(entry.id)}" />
            <input type="hidden" name="kind" value="${h(selectedTab)}" />
            <button class="btn btn-danger" type="submit">Delete ${h(selectedTab)}</button>
          </form>`}
        </div>`;

      return `<li>
      ${renderEntryImage(entry.image_key, `${chapter.name} ${selectedTab} image`)}
      <div class="public-note-body">${entryBody}</div>
      ${
        isMcqTab
          ? `<ul class="public-mcq-options"><li><strong>A.</strong> ${h(entry.option_a || "-")}</li><li><strong>B.</strong> ${h(entry.option_b || "-")}</li><li><strong>C.</strong> ${h(entry.option_c || "-")}</li><li><strong>D.</strong> ${h(entry.option_d || "-")}</li></ul><p class="public-mcq-answer-text"><strong>Answer:</strong> ${renderMcqAnswer(entry)}</p>`
          : ""
      }
      ${adminActions}
    </li>`;
    })
    .join("");

  const adminQuickAdd = !isAdmin
    ? ""
    : isShortNotesTab
      ? `<section class="public-admin-panel">
      <h3>Admin quick add: Short note</h3>
      <form method="post" action="/api/notes" class="public-admin-inline-form">
        ${adminMetaInputs}
        <textarea class="input" name="contentHtml" rows="4" placeholder="Write a short note" required></textarea>
        <button class="btn" type="submit">Add note</button>
      </form>
    </section>`
      : isMcqTab
        ? `<section class="public-admin-panel">
      <h3>Admin quick add: MCQ</h3>
      <form method="post" action="/api/mcqs" class="public-admin-inline-form">
        ${adminMetaInputs}
        <textarea class="input" name="questionHtml" rows="3" placeholder="Question" required></textarea>
        <input class="input" name="optionA" placeholder="Option A" required />
        <input class="input" name="optionB" placeholder="Option B" required />
        <input class="input" name="optionC" placeholder="Option C" required />
        <input class="input" name="optionD" placeholder="Option D" required />
        <select class="input" name="correctOption" required>
          <option value="A">Correct: A</option><option value="B">Correct: B</option><option value="C">Correct: C</option><option value="D">Correct: D</option>
        </select>
        <button class="btn" type="submit">Add MCQ</button>
      </form>
    </section>`
        : `<section class="public-admin-panel">
      <h3>Admin quick add: ${h(selectedTab)}</h3>
      <form method="post" action="/api/content-entries" class="public-admin-inline-form">
        ${adminMetaInputs}
        <input type="hidden" name="contentKind" value="${h(selectedTab)}" />
        <input type="hidden" name="title" value="${h(selectedTab)}" />
        <textarea class="input" name="contentHtml" rows="4" placeholder="Write ${h(selectedTab)}" required></textarea>
        <button class="btn" type="submit">${isSummaryTab ? "Save Summary" : `Add ${h(selectedTab)}`}</button>
      </form>
    </section>`;

  return publicShell(
    "home",
    user,
    `${chapter.name} · ${node.display_name}`,
    renderFlatPage({
      title: chapter.name,
      subtitle: node.display_name,
      content: `<div class="public-wide-grid">${actions || '<p class="muted">No extra sections yet.</p>'}</div>
      <section class="public-content-panel">
      ${adminQuickAdd}
      ${isShortNotesTab || isMcqTab ? `<ol class="public-note-list">${notes || `<li class="public-note-empty">No ${h(selectedTab)} yet.</li>`}</ol>` : `<ul class="public-note-list is-plain">${notes || `<li class="public-note-empty">No ${h(selectedTab)} yet.</li>`}</ul>`}
      </section>`,
    }),
    "",
    learningPageStyles,
  );
}

export function publicContentEntriesPage(user, subject, chapter, kind, entries = []) {
  const list = entries
    .map(
      (entry, index) => `<li>
      ${renderEntryImage(entry.image_key, `${kind} image ${index + 1}`)}
      <h3 class="public-note-title">${index + 1}. ${h(entry.title || kind)}</h3>
      <div class="public-note-body">${entry.content_html}</div>
    </li>`,
    )
    .join("");

  return publicShell(
    "home",
    user,
    `${chapter.name} · ${kind}`,
    renderFlatPage({
      title: kind,
      subtitle: `${subject.name} · ${chapter.name}`,
      content: `<ol class="public-note-list">${list || "<li class='public-note-empty'>No content yet.</li>"}</ol>`,
    }),
    "",
    learningPageStyles,
  );
}

export function publicMcqEntriesPage(user, subject, node, chapter, topicId, mcqs = []) {
  const isAdmin = user?.role === "admin";
  const adminMetaInputs = `
    <input type="hidden" name="subjectId" value="${h(subject.id)}" />
    <input type="hidden" name="subjectNodeId" value="${h(node.id)}" />
    <input type="hidden" name="chapterId" value="${h(chapter.id)}" />
    <input type="hidden" name="topicId" value="${h(topicId || "")}" />
    <input type="hidden" name="redirect" value="${h(`/learn/subjects/${subject.id}/nodes/${node.id}/chapters/${chapter.id}/content/${encodeURIComponent("MCQ Bank")}${topicId ? `?topic=${encodeURIComponent(topicId)}` : ""}`)}" />
  `;
  const list = mcqs
    .map(
      (item) => `<li class="public-mcq-item">
      ${renderEntryImage(item.image_key, `MCQ image`)}
      <div class="public-note-body">${h(item.question_html)}</div>
      <ul class="public-mcq-options">
        <li data-option="A"><strong>A.</strong> ${h(item.option_a)}</li>
        <li data-option="B"><strong>B.</strong> ${h(item.option_b)}</li>
        <li data-option="C"><strong>C.</strong> ${h(item.option_c)}</li>
        <li data-option="D"><strong>D.</strong> ${h(item.option_d)}</li>
      </ul>
      <p class="public-mcq-answer-text"><strong>Answer:</strong> ${renderMcqAnswer(item)}</p>
      ${
        isAdmin
          ? `<div class="public-admin-inline-actions">
          <details class="public-admin-inline-card">
            <summary>Edit MCQ</summary>
            <form method="post" action="/api/mcqs" class="public-admin-inline-form">
              ${adminMetaInputs}
              <input type="hidden" name="id" value="${h(item.id)}" />
              <textarea class="input" name="questionHtml" rows="3" placeholder="Question" required>${h(item.question_html || "")}</textarea>
              <input class="input" name="optionA" value="${h(item.option_a || "")}" required />
              <input class="input" name="optionB" value="${h(item.option_b || "")}" required />
              <input class="input" name="optionC" value="${h(item.option_c || "")}" required />
              <input class="input" name="optionD" value="${h(item.option_d || "")}" required />
              <select class="input" name="correctOption">
                ${["A", "B", "C", "D"].map((v) => `<option value="${v}" ${resolveMcqAnswerLetter(item) === v ? "selected" : ""}>Correct: ${v}</option>`).join("")}
              </select>
              <button class="btn" type="submit">Save</button>
            </form>
          </details>
          <form method="post" action="/api/mcqs/delete">
            ${adminMetaInputs}
            <input type="hidden" name="id" value="${h(item.id)}" />
            <button class="btn btn-danger" type="submit">Delete</button>
          </form>
        </div>`
          : ""
      }
    </li>`,
    )
    .join("");

  const adminQuickAdd = isAdmin
    ? `<section class="public-admin-panel">
      <h3>Admin quick add: MCQ</h3>
      <form method="post" action="/api/mcqs" class="public-admin-inline-form">
        ${adminMetaInputs}
        <textarea class="input" name="questionHtml" rows="3" placeholder="Question" required></textarea>
        <input class="input" name="optionA" placeholder="Option A" required />
        <input class="input" name="optionB" placeholder="Option B" required />
        <input class="input" name="optionC" placeholder="Option C" required />
        <input class="input" name="optionD" placeholder="Option D" required />
        <select class="input" name="correctOption">
          <option value="A">Correct: A</option>
          <option value="B">Correct: B</option>
          <option value="C">Correct: C</option>
          <option value="D">Correct: D</option>
        </select>
        <button class="btn" type="submit">Add MCQ</button>
      </form>
    </section>`
    : "";

  return publicShell(
    "home",
    user,
    `${chapter.name} · MCQ Bank`,
    renderFlatPage({
      title: "MCQ Bank",
      subtitle: `${subject.name} · ${chapter.name}`,
      content: `${adminQuickAdd}<ol class="public-note-list">${list || "<li class='public-note-empty'>No MCQs yet.</li>"}</ol>`,
    }),
    "",
    learningPageStyles,
  );
}
