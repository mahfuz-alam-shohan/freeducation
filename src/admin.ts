import { appConfig, hierarchyLabels, sourceCategories } from "./config";
import { layout, header } from "./templates";

export const renderLogin = (options: { isFirstAdmin: boolean; error?: string }) => {
  const notice = options.isFirstAdmin
    ? "No admin exists yet. Create the first admin to unlock the dashboard."
    : "Admin access only. Log in with your credentials.";
  const buttonLabel = options.isFirstAdmin ? "Create First Admin" : "Login";
  const body = `
    ${header("Admin Access")}
    <main>
      <div class="container">
        <div class="card" style="max-width:420px; margin: 0 auto;">
          <p class="notice">${notice}</p>
          ${options.error ? `<p style="color:#b42318;">${options.error}</p>` : ""}
          <form method="POST" action="/admin/login">
            <label>Email
              <input type="email" name="email" required />
            </label>
            <label>Password
              <input type="password" name="password" minlength="8" required />
            </label>
            <button type="submit">${buttonLabel}</button>
          </form>
        </div>
      </div>
    </main>
  `;

  return layout("Admin Login", body);
};

type DashboardData = {
  hierarchy: {
    classes: Array<{ id: number; name: string; has_groups: number; is_merged: number }>;
    groups: Array<{ id: number; class_id: number; name: string }>;
    subjects: Array<{ id: number; class_id: number; group_id: number | null; name: string }>;
    chapters: Array<{ id: number; subject_id: number; name: string; position: number }>;
    subchapters: Array<{ id: number; chapter_id: number; name: string; position: number }>;
  };
  questionTypes: Array<{ id: number; name: string; chapter_id: number }>;
  sources: {
    categories: Array<{ id: number; name: string }>;
    entities: Array<{ id: number; category_id: number; name: string }>;
  };
  questions: Array<{ id: number; prompt: string; questionType: string; chapter: string; subject: string; sourceEntity: string; sourceYear: string }>;
  learningMaterials: Array<{ id: number; title: string; materialType: string; subchapter: string; chapter: string }>;
};

export const renderDashboard = (data: DashboardData) => {
  const classOptions = data.hierarchy.classes
    .map((item) => `<option value="${item.id}">${item.name}</option>`)
    .join("");
  const groupOptions = data.hierarchy.groups
    .map((item) => `<option value="${item.id}">${item.name}</option>`)
    .join("");
  const subjectOptions = data.hierarchy.subjects
    .map((item) => `<option value="${item.id}">${item.name}</option>`)
    .join("");
  const chapterOptions = data.hierarchy.chapters
    .map((item) => `<option value="${item.id}">${item.name}</option>`)
    .join("");
  const subchapterOptions = data.hierarchy.subchapters
    .map((item) => {
      const chapterName =
        data.hierarchy.chapters.find((chapter) => chapter.id === item.chapter_id)?.name ?? "";
      return `<option value="${item.id}">${chapterName} → ${item.name}</option>`;
    })
    .join("");
  const questionTypeOptions = data.questionTypes
    .map((item) => `<option value="${item.id}">${item.name}</option>`)
    .join("");
  const sourceCategoryOptions = data.sources.categories
    .map((item) => `<option value="${item.id}">${item.name}</option>`)
    .join("");
  const sourceEntityOptions = data.sources.entities
    .map((item) => `<option value="${item.id}">${item.name}</option>`)
    .join("");

  const questionRows = data.questions.length
    ? data.questions
        .map(
          (row) => `
      <tr>
        <td>${row.prompt}</td>
        <td>${row.chapter}</td>
        <td>${row.questionType}</td>
        <td>${row.sourceEntity} ${row.sourceYear}</td>
      </tr>`
        )
        .join("")
    : `<tr><td colspan="4">No questions uploaded yet.</td></tr>`;

  const learningRows = data.learningMaterials.length
    ? data.learningMaterials
        .map(
          (row) => `
      <tr>
        <td>${row.title}</td>
        <td>${row.subchapter}</td>
        <td>${row.materialType}</td>
      </tr>`
        )
        .join("")
    : `<tr><td colspan="3">No learning materials yet.</td></tr>`;

  const body = `
    ${header("Admin Dashboard")}
    <main>
      <div class="container dashboard">
        <div class="notice">Welcome, Admin. Build the hierarchy first, then add learning materials and questions.</div>

        <section class="card">
          <h3>Create ${hierarchyLabels.classLabel}</h3>
          <form method="POST" action="/admin/classes">
            <label>Name
              <input type="text" name="name" required />
            </label>
            <label>Has Groups?
              <select name="hasGroups">
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </label>
            <label>Merged Class?
              <select name="isMerged">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </label>
            <button type="submit">Create Class</button>
          </form>
        </section>

        <section class="card">
          <h3>Create ${hierarchyLabels.groupLabel}</h3>
          <form method="POST" action="/admin/groups">
            <label>Class
              <select name="classId" required>
                ${classOptions}
              </select>
            </label>
            <label>Group Name
              <input type="text" name="name" required />
            </label>
            <button type="submit">Add Group</button>
          </form>
        </section>

        <section class="card">
          <h3>Create ${hierarchyLabels.subjectLabel}</h3>
          <form method="POST" action="/admin/subjects">
            <label>Class
              <select name="classId" required>
                ${classOptions}
              </select>
            </label>
            <label>Group (optional)
              <select name="groupId">
                <option value="">None</option>
                ${groupOptions}
              </select>
            </label>
            <label>Subject Name
              <input type="text" name="name" required />
            </label>
            <button type="submit">Add Subject</button>
          </form>
        </section>

        <section class="card">
          <h3>Create ${hierarchyLabels.chapterLabel}</h3>
          <form method="POST" action="/admin/chapters">
            <label>Subject
              <select name="subjectId" required>
                ${subjectOptions}
              </select>
            </label>
            <label>Chapter Name
              <input type="text" name="name" required />
            </label>
            <label>Position
              <input type="number" name="position" value="1" min="1" required />
            </label>
            <button type="submit">Add Chapter</button>
          </form>
        </section>

        <section class="card">
          <h3>Create ${hierarchyLabels.subChapterLabel}</h3>
          <form method="POST" action="/admin/subchapters">
            <label>Chapter
              <select name="chapterId" required>
                ${chapterOptions}
              </select>
            </label>
            <label>Sub-chapter Name
              <input type="text" name="name" required />
            </label>
            <label>Position
              <input type="number" name="position" value="1" min="1" required />
            </label>
            <button type="submit">Add Sub-chapter</button>
          </form>
        </section>

        <section class="card">
          <h3>Create ${hierarchyLabels.questionTypeLabel}</h3>
          <form method="POST" action="/admin/question-types">
            <label>Chapter
              <select name="chapterId" required>
                ${chapterOptions}
              </select>
            </label>
            <label>Type Name
              <input type="text" name="name" required />
            </label>
            <button type="submit">Add Question Type</button>
          </form>
        </section>

        <section class="card">
          <h3>Add Learning Material</h3>
          <form method="POST" action="/admin/learning-materials">
            <label>Sub-chapter
              <select name="subchapterId" required>
                ${subchapterOptions || "<option value=\"\">Add sub-chapters first</option>"}
              </select>
            </label>
            <label>Title
              <input type="text" name="title" required />
            </label>
            <label>Material Type
              <select name="materialType">
                <option value="Lecture Video">Lecture Video</option>
                <option value="Handwritten Note">Handwritten Note</option>
                <option value="PDF">PDF</option>
              </select>
            </label>
            <label>URL
              <input type="url" name="url" required />
            </label>
            <label>Notes
              <textarea name="notes" rows="2"></textarea>
            </label>
            <button type="submit">Add Learning Material</button>
          </form>
        </section>

        <section class="card">
          <h3>Upload Question</h3>
          <form method="POST" action="/admin/questions">
            <label>Chapter
              <select name="chapterId" required>
                ${chapterOptions}
              </select>
            </label>
            <label>Question Type
              <select name="questionTypeId" required>
                ${questionTypeOptions}
              </select>
            </label>
            <label>Source Category
              <select name="sourceCategoryId" required>
                ${sourceCategoryOptions}
              </select>
            </label>
            <label>Source Entity
              <select name="sourceEntityId" required>
                ${sourceEntityOptions}
              </select>
            </label>
            <label>Source Year
              <input type="text" name="sourceYear" placeholder="2024" required />
            </label>
            <label>Question Prompt
              <textarea name="prompt" rows="3" required></textarea>
            </label>
            <label>Image URL (optional)
              <input type="url" name="imageUrl" />
            </label>
            <button type="submit">Save Question</button>
          </form>
        </section>

        <section class="card">
          <h3>Add Source Entity</h3>
          <p>Global sources keep questions organized by board, university, or institution.</p>
          <form method="POST" action="/admin/source-entities">
            <label>Source Category
              <select name="categoryId" required>
                ${sourceCategoryOptions || sourceCategories.map((item) => `<option value="${item}">${item}</option>`).join("")}
              </select>
            </label>
            <label>Entity Name
              <input type="text" name="name" required />
            </label>
            <button type="submit">Add Entity</button>
          </form>
        </section>

        <section class="card">
          <h3>Latest Questions</h3>
          <table class="table">
            <thead>
              <tr>
                <th>Prompt</th>
                <th>Chapter</th>
                <th>Type</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              ${questionRows}
            </tbody>
          </table>
        </section>

        <section class="card">
          <h3>Latest Learning Materials</h3>
          <table class="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Sub-chapter</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              ${learningRows}
            </tbody>
          </table>
        </section>
      </div>
    </main>
  `;

  return layout("Admin Dashboard", body);
};
