import { SITE_NAME } from "./config";
import { baseStyles } from "./styles";
import {
  Env,
  listChaptersBySubject,
  listClasses,
  listGroupsByClass,
  listQuestionTypesByChapter,
  listSources,
  listSubjectsByClass,
  listSubjectsByGroup,
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
  <div class="brand">${SITE_NAME} Admin</div>
</header>
<main>
${body}
</main>
</body>
</html>`;
}

export async function renderLoginPage(hasAdmin: boolean, error?: string) {
  const headline = hasAdmin ? "Admin Login" : "Create the First Admin";
  const helper = hasAdmin
    ? "Log in to manage the learning hierarchy."
    : "Create the first admin account to unlock the dashboard.";
  const action = hasAdmin ? "Login" : "Create Admin";
  return layout(
    headline,
    `
<section class="card">
  <h1>${headline}</h1>
  <p>${helper}</p>
  ${error ? `<p class="badge">${error}</p>` : ""}
  <form method="post" action="/login">
    <label>Username
      <input name="username" required autocomplete="username" />
    </label>
    <label>Password
      <input type="password" name="password" required autocomplete="current-password" />
    </label>
    <button class="button" type="submit">${action}</button>
  </form>
</section>
`
  );
}

export async function renderDashboard(env: Env, username: string) {
  const classes = await listClasses(env);
  const sources = await listSources(env);

  const classOptions = classes
    .map(
      (item) =>
        `<option value="${item.id}">${item.name}</option>`
    )
    .join("");

  const groupOptions = await Promise.all(
    classes.map(async (item) => {
      const groups = await listGroupsByClass(env, Number(item.id));
      return groups
        .map(
          (group) =>
            `<option value="${group.id}">${item.name} · ${group.name}</option>`
        )
        .join("");
    })
  );

  const subjectOptions = await Promise.all(
    classes.map(async (item) => {
      const subjects = await listSubjectsByClass(env, Number(item.id));
      const fromGroups = await listGroupsByClass(env, Number(item.id));
      const nestedSubjects = await Promise.all(
        fromGroups.map(async (group) => {
          const groupSubjects = await listSubjectsByGroup(env, Number(group.id));
          return groupSubjects
            .map(
              (subject) =>
                `<option value="${subject.id}">${item.name} · ${group.name} · ${subject.name}</option>`
            )
            .join("");
        })
      );
      return [
        ...subjects.map(
          (subject) =>
            `<option value="${subject.id}">${item.name} · ${subject.name}</option>`
        ),
        ...nestedSubjects,
      ].join("");
    })
  );

  const chapterOptions = await Promise.all(
    classes.map(async (item) => {
      const subjects = await listSubjectsByClass(env, Number(item.id));
      const groups = await listGroupsByClass(env, Number(item.id));
      const subjectsFromGroups = (
        await Promise.all(
          groups.map(async (group) =>
            listSubjectsByGroup(env, Number(group.id))
          )
        )
      ).flat();
      const allSubjects = [...subjects, ...subjectsFromGroups];
      const chapterList = await Promise.all(
        allSubjects.map(async (subject) => {
          const chapters = await listChaptersBySubject(env, Number(subject.id));
          return chapters
            .map(
              (chapter) =>
                `<option value="${chapter.id}">${subject.name} · ${chapter.name}</option>`
            )
            .join("");
        })
      );
      return chapterList.join("");
    })
  );

  const typeOptions = await Promise.all(
    classes.map(async (item) => {
      const subjects = await listSubjectsByClass(env, Number(item.id));
      const groups = await listGroupsByClass(env, Number(item.id));
      const subjectsFromGroups = (
        await Promise.all(
          groups.map(async (group) =>
            listSubjectsByGroup(env, Number(group.id))
          )
        )
      ).flat();
      const allSubjects = [...subjects, ...subjectsFromGroups];
      const chapterList = await Promise.all(
        allSubjects.map(async (subject) => {
          const chapters = await listChaptersBySubject(env, Number(subject.id));
          const questionTypes = await Promise.all(
            chapters.map(async (chapter) =>
              listQuestionTypesByChapter(env, Number(chapter.id))
            )
          );
          return questionTypes
            .flat()
            .map(
              (type) =>
                `<option value="${type.id}">${subject.name} · ${type.name}</option>`
            )
            .join("");
        })
      );
      return chapterList.join("");
    })
  );

  const sourceOptions = sources
    .map(
      (source) =>
        `<option value="${source.id}">${source.category} · ${source.entity} · ${source.year}</option>`
    )
    .join("");

  return layout(
    "Dashboard",
    `
<section class="hero">
  <div>
    <h1>Welcome, ${username}</h1>
    <p>Build the learning hierarchy and map questions to their exact home address.</p>
  </div>
  <form method="post" action="/logout">
    <button class="button secondary" type="submit">Logout</button>
  </form>
</section>

<h2 class="section-title">Hierarchy Builder</h2>
<div class="grid">
  <section class="card">
    <h3>Create Class</h3>
    <form method="post" action="/admin/class">
      <label>Class Name
        <input name="name" required placeholder="Class 9-10 (SSC)" />
      </label>
      <label>Has Groups?
        <select name="has_groups">
          <option value="false">No</option>
          <option value="true">Yes</option>
        </select>
      </label>
      <label>Sort Order
        <input name="sort_order" type="number" placeholder="1" />
      </label>
      <label>Merged Label
        <input name="merged_label" placeholder="SSC" />
      </label>
      <button class="button" type="submit">Save Class</button>
    </form>
  </section>

  <section class="card">
    <h3>Create Group</h3>
    <form method="post" action="/admin/group">
      <label>Class
        <select name="class_id" required>
          ${classOptions}
        </select>
      </label>
      <label>Group Name
        <input name="name" required placeholder="Science" />
      </label>
      <label>Sort Order
        <input name="sort_order" type="number" />
      </label>
      <button class="button" type="submit">Save Group</button>
    </form>
  </section>

  <section class="card">
    <h3>Create Subject</h3>
    <form method="post" action="/admin/subject">
      <label>Class
        <select name="class_id" required>
          ${classOptions}
        </select>
      </label>
      <label>Optional Group
        <select name="group_id">
          <option value="">No group</option>
          ${groupOptions.join("")}
        </select>
      </label>
      <label>Subject Name
        <input name="name" required placeholder="Physics" />
      </label>
      <label>Sort Order
        <input name="sort_order" type="number" />
      </label>
      <button class="button" type="submit">Save Subject</button>
    </form>
  </section>

  <section class="card">
    <h3>Create Chapter</h3>
    <form method="post" action="/admin/chapter">
      <label>Subject
        <select name="subject_id" required>
          ${subjectOptions.join("")}
        </select>
      </label>
      <label>Chapter Name
        <input name="name" required placeholder="Motion" />
      </label>
      <label>Sort Order
        <input name="sort_order" type="number" />
      </label>
      <button class="button" type="submit">Save Chapter</button>
    </form>
  </section>

  <section class="card">
    <h3>Create Sub-Chapter</h3>
    <form method="post" action="/admin/sub-chapter">
      <label>Chapter
        <select name="chapter_id" required>
          ${chapterOptions.join("")}
        </select>
      </label>
      <label>Sub-Chapter Name
        <input name="name" required placeholder="Equations of Motion" />
      </label>
      <label>Sort Order
        <input name="sort_order" type="number" />
      </label>
      <button class="button" type="submit">Save Sub-Chapter</button>
    </form>
  </section>

  <section class="card">
    <h3>Create Question Type</h3>
    <form method="post" action="/admin/question-type">
      <label>Chapter
        <select name="chapter_id" required>
          ${chapterOptions.join("")}
        </select>
      </label>
      <label>Question Type Name
        <input name="name" required placeholder="Graph Analysis" />
      </label>
      <label>Sort Order
        <input name="sort_order" type="number" />
      </label>
      <button class="button" type="submit">Save Type</button>
    </form>
  </section>
</div>

<h2 class="section-title">Source & Question Bank</h2>
<div class="grid">
  <section class="card">
    <h3>Create Source</h3>
    <form method="post" action="/admin/source">
      <label>Category
        <input name="category" required placeholder="Board Exam" />
      </label>
      <label>Entity
        <input name="entity" required placeholder="Dhaka Board" />
      </label>
      <label>Year
        <input name="year" required placeholder="2024" />
      </label>
      <button class="button" type="submit">Save Source</button>
    </form>
  </section>

  <section class="card">
    <h3>Upload Question</h3>
    <form method="post" action="/admin/question">
      <label>Chapter
        <select name="chapter_id" required>
          ${chapterOptions.join("")}
        </select>
      </label>
      <label>Question Type
        <select name="question_type_id">
          <option value="">None</option>
          ${typeOptions.join("")}
        </select>
      </label>
      <label>Source
        <select name="source_id">
          <option value="">Unknown</option>
          ${sourceOptions}
        </select>
      </label>
      <label>Image URL
        <input name="image_url" required placeholder="https://..." />
      </label>
      <label>Description
        <textarea name="description" placeholder="Optional notes for this question"></textarea>
      </label>
      <button class="button" type="submit">Save Question</button>
    </form>
  </section>
</div>
`
  );
}
