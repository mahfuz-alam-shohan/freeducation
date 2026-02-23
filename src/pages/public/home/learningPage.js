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

export function publicChapterContentPage(user, subject, node, chapter, shortNotes = [], contentNodes = [], topicId = null) {
  const actions = contentNodes
    .filter((item) => item.content_kind !== "Short Notes")
    .map((item) => `<a class="public-cta-card" href="/learn/subjects/${subject.id}/nodes/${node.id}/chapters/${chapter.id}/content/${encodeURIComponent(item.content_kind || "")}${topicId ? `?topic=${encodeURIComponent(topicId)}` : ""}">${h(item.display_name)}</a>`)
    .join("");

  const notes = shortNotes
    .map(
      (entry) => `<li>
      ${renderEntryImage(entry.image_key, `${chapter.name} short note image`)}
      <div class="public-note-body">${h(entry.content_html)}</div>
    </li>`,
    )
    .join("");

  return publicShell(
    "home",
    user,
    `${chapter.name} · ${node.display_name}`,
    renderFlatPage({
      title: chapter.name,
      subtitle: node.display_name,
      content: `<div class="public-wide-grid">${actions || '<p class="muted">No extra sections yet.</p>'}</div>
      <ol class="public-note-list">${notes || "<li>No short notes yet.</li>"}</ol>`,
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
      content: `<ol class="public-note-list">${list || "<li>No content yet.</li>"}</ol>`,
    }),
    "",
    learningPageStyles,
  );
}

export function publicMcqEntriesPage(user, subject, chapter, mcqs = []) {
  const resolveOption = (item) => {
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
  };

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
      <p class="public-mcq-answer-text"><strong>Ans:</strong> ${resolveOption(item) || "N/A"}</p>
    </li>`,
    )
    .join("");

  return publicShell(
    "home",
    user,
    `${chapter.name} · MCQ Bank`,
    renderFlatPage({
      title: "MCQ Bank",
      subtitle: `${subject.name} · ${chapter.name}`,
      content: `<ol class="public-note-list">${list || "<li>No MCQs yet.</li>"}</ol>`,
    }),
    "",
    learningPageStyles,
  );
}
