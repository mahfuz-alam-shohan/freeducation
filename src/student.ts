import { SITE_NAME } from "./config";
import { baseStyles } from "./styles";
import {
  Env,
  listChaptersBySubject,
  listClasses,
  listGroupsByClass,
  listQuestionTypesByChapter,
  listSources,
  listSubChaptersByChapter,
  listSubjectsByClass,
  listSubjectsByGroup,
  listQuestions,
} from "./db";

function layout(title: string, body: string) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title} · ${SITE_NAME}</title>
  <style>${baseStyles}</style>
</head>
<body>
<header>
  <div class="brand">${SITE_NAME}</div>
</header>
<main>
${body}
</main>
<footer>
  Built for Bangladeshi students · Structured Learning Engine
</footer>
</body>
</html>`;
}

export async function renderHome(env: Env) {
  const classes = await listClasses(env);
  return layout(
    "Home",
    `
<section class="hero">
  <div>
    <span class="badge">Structured Learning Engine</span>
    <h1>Your academic operating system for Classes 9-12.</h1>
    <p>Browse by class, explore chapters, learn concepts, and practice exam patterns.</p>
    <a class="button" href="#classes">Browse Classes</a>
  </div>
  <div class="card">
    <h3>Student-first landing</h3>
    <p>Learning topics and exam questions live at a precise address: Class → Subject → Chapter.</p>
    <ul>
      <li>Learning layer: videos + notes per sub-chapter</li>
      <li>Exam layer: question types + sources</li>
      <li>Metadata: board, year, institution</li>
    </ul>
  </div>
</section>

<h2 id="classes" class="section-title">Choose your class</h2>
<div class="grid">
  ${classes
    .map(
      (item) => `
    <a class="card" href="/class/${item.id}">
      <h3>${item.name}</h3>
      <p>${item.merged_label ?? ""}</p>
      <span class="badge">${item.has_groups ? "Group-based" : "General"}</span>
    </a>
  `
    )
    .join("")}
</div>
`
  );
}

export async function renderClass(env: Env, classId: number) {
  const classes = await listClasses(env);
  const current = classes.find((item) => Number(item.id) === classId);
  if (!current) {
    return layout("Not found", `<p>Class not found.</p>`);
  }
  const groups = await listGroupsByClass(env, classId);
  const subjects = await listSubjectsByClass(env, classId);

  const groupMarkup = await Promise.all(
    groups.map(async (group) => {
      const groupSubjects = await listSubjectsByGroup(env, Number(group.id));
      return `
      <section class="card">
        <h3>${group.name}</h3>
        <div class="list">
          ${groupSubjects
            .map(
              (subject) => `
            <div class="list-item">
              <span>${subject.name}</span>
              <a class="button secondary" href="/subject/${subject.id}">Open</a>
            </div>
          `
            )
            .join("")}
        </div>
      </section>
    `;
    })
  );

  return layout(
    current.name,
    `
<section class="hero">
  <div>
    <span class="badge">${current.merged_label ?? ""}</span>
    <h1>${current.name}</h1>
    <p>Select a subject to continue.</p>
  </div>
</section>

${current.has_groups ? "<h2 class=\"section-title\">Groups</h2>" : ""}
<div class="grid">
  ${current.has_groups ? groupMarkup.join("") : ""}
</div>

${!current.has_groups ? "<h2 class=\"section-title\">Subjects</h2>" : ""}
<div class="grid">
  ${subjects
    .map(
      (subject) => `
    <a class="card" href="/subject/${subject.id}">
      <h3>${subject.name}</h3>
      <p>Explore chapters and question patterns.</p>
    </a>
  `
    )
    .join("")}
</div>
`
  );
}

export async function renderSubject(env: Env, subjectId: number) {
  const chapters = await listChaptersBySubject(env, subjectId);
  return layout(
    "Subject",
    `
<section class="hero">
  <div>
    <h1>Subject Chapters</h1>
    <p>Pick a chapter to learn concepts or practice exam patterns.</p>
  </div>
</section>

<div class="grid">
  ${chapters
    .map(
      (chapter) => `
    <a class="card" href="/chapter/${chapter.id}">
      <h3>${chapter.name}</h3>
      <p>Learning + exam layers</p>
    </a>
  `
    )
    .join("")}
</div>
`
  );
}

export async function renderChapter(env: Env, chapterId: number) {
  const subChapters = await listSubChaptersByChapter(env, chapterId);
  const questionTypes = await listQuestionTypesByChapter(env, chapterId);
  const sources = await listSources(env);

  return layout(
    "Chapter",
    `
<section class="hero">
  <div>
    <h1>Chapter</h1>
    <p>Choose a learning topic or jump straight to exam practice.</p>
  </div>
</section>

<h2 class="section-title">Learning Topics</h2>
<div class="grid">
  ${subChapters
    .map(
      (item) => `
    <div class="card">
      <h3>${item.name}</h3>
      <p>Lecture video or handwritten notes go here.</p>
    </div>
  `
    )
    .join("")}
</div>

<h2 class="section-title">Exam Practice</h2>
<section class="card">
  <form method="get" action="/questions">
    <input type="hidden" name="chapter_id" value="${chapterId}" />
    <label>Question Type
      <select name="type_id">
        <option value="">All Types</option>
        ${questionTypes
          .map(
            (type) => `<option value="${type.id}">${type.name}</option>`
          )
          .join("")}
      </select>
    </label>
    <label>Source
      <select name="source_id">
        <option value="">All Sources</option>
        ${sources
          .map(
            (source) =>
              `<option value="${source.id}">${source.category} · ${source.entity} · ${source.year}</option>`
          )
          .join("")}
      </select>
    </label>
    <button class="button" type="submit">Search Questions</button>
  </form>
</section>
`
  );
}

export async function renderQuestions(
  env: Env,
  chapterId: number,
  typeId: number | null,
  sourceId: number | null
) {
  const questions = await listQuestions(env, chapterId, typeId, sourceId);
  return layout(
    "Questions",
    `
<section class="hero">
  <div>
    <h1>Question Bank</h1>
    <p>Filtered practice questions by type and source.</p>
  </div>
</section>

<div class="grid">
  ${questions
    .map(
      (question) => `
    <div class="card">
      <img src="${question.image_url}" alt="Question" style="width:100%; border-radius:12px; border:1px solid var(--border);" />
      <p>${question.description ?? ""}</p>
      <span class="badge">${question.type_name ?? "General"}</span>
      <p>${question.category ?? ""} ${question.entity ?? ""} ${question.year ?? ""}</p>
    </div>
  `
    )
    .join("")}
</div>
`
  );
}
