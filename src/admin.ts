import { appConfig, hierarchyLabels, sourceCategories } from "./config";
import { layout, header } from "./templates";

export const renderLogin = (options: { isFirstAdmin: boolean; error?: string }) => {
  const title = options.isFirstAdmin ? "Welcome to Freeducation" : "Admin Login";
  const subtitle = options.isFirstAdmin
    ? "Create the master admin account to initialize the system."
    : "Enter your credentials to access the dashboard.";
  const buttonLabel = options.isFirstAdmin ? "Create Owner Account" : "Sign In";

  // Using a dedicated auth layout wrapper instead of the standard header
  const body = `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <div class="auth-logo">🎓</div>
          <h1 class="auth-title">${title}</h1>
          <p class="auth-subtitle">${subtitle}</p>
        </div>

        ${
          options.error
            ? `<div class="alert alert-error">⚠️ ${options.error}</div>`
            : ""
        }

        <form method="POST" action="/admin/login">
          <div>
            <label for="email">Email Address</label>
            <input type="email" id="email" name="email" placeholder="admin@example.com" required autofocus />
          </div>
          <div>
            <label for="password">Password</label>
            <input type="password" id="password" name="password" placeholder="••••••••" minlength="8" required />
            ${options.isFirstAdmin ? '<p style="font-size:0.8em; margin-top:0.25rem;">Must be at least 8 characters.</p>' : ''}
          </div>
          <button type="submit">${buttonLabel}</button>
        </form>

        <div style="text-align:center; margin-top:1.5rem; font-size:0.85rem; color:var(--text-light);">
          &larr; <a href="/" style="text-decoration:underline;">Back to Student Home</a>
        </div>
      </div>
    </div>
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
  questions: Array<{ id: number; prompt: string; questionType: string; chapter: string; subject: string; sourceEntity: string; sourceYear: string; imageUrl: string | null }>;
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
    
  // Robust Fallback for Dropdowns
  const sourceCategoryOptions = data.sources.categories.length 
    ? data.sources.categories.map((item) => `<option value="${item.id}">${item.name}</option>`).join("")
    : `<option value="" disabled selected>No categories (DB sync needed)</option>`;

  const sourceEntityOptions = data.sources.entities.length
    ? data.sources.entities.map((item) => `<option value="${item.id}">${item.name}</option>`).join("")
    : `<option value="" disabled selected>No entities found</option>`;

  const questionRows = data.questions.length
    ? data.questions
        .map(
          (row) => `
      <tr>
        <td>
          <div style="font-weight:500;">${row.prompt.substring(0, 80)}${row.prompt.length > 80 ? '...' : ''}</div>
          ${row.imageUrl ? `<a href="${row.imageUrl}" target="_blank" style="font-size:0.75rem; color:var(--primary); display:inline-flex; align-items:center; gap:4px; margin-top:4px;">📷 View Image</a>` : ''}
        </td>
        <td>${row.chapter}</td>
        <td><span class="badge" style="background:#f3f4f6; color:#374151;">${row.questionType}</span></td>
        <td>${row.sourceEntity} <span style="color:var(--text-light); font-size:0.9em;">'${row.sourceYear}</span></td>
      </tr>`
        )
        .join("")
    : `<tr><td colspan="4" style="text-align:center; padding:2rem; color:var(--text-light);">No questions uploaded yet. Start by adding some above!</td></tr>`;

  const learningRows = data.learningMaterials.length
    ? data.learningMaterials
        .map(
          (row) => `
      <tr>
        <td style="font-weight:500;">${row.title}</td>
        <td>${row.subchapter}</td>
        <td><span class="badge">${row.materialType}</span></td>
      </tr>`
        )
        .join("")
    : `<tr><td colspan="3" style="text-align:center; padding:2rem; color:var(--text-light);">No learning materials found.</td></tr>`;

  const body = `
    ${header("Admin Dashboard")}
    <main>
      <div class="container dashboard">
        
        <div class="alert alert-info" style="display:flex; justify-content:space-between; align-items:center;">
          <span>👋 <strong>Welcome, Admin.</strong> Manage your curriculum hierarchy and content here.</span>
          <form action="/admin/logout" method="POST" style="margin:0; width:auto; display:inline;">
             <button type="submit" class="secondary" style="padding:0.4rem 0.8rem; font-size:0.85rem;">Logout</button>
          </form>
        </div>

        <section class="card">
          <h2>1. Hierarchy Setup</h2>
          <p>Build the structure from top to bottom.</p>
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap:1.5rem;">
            
            <form method="POST" action="/admin/classes">
              <h4>New ${hierarchyLabels.classLabel}</h4>
              <label>Name
                <input type="text" name="name" placeholder="e.g. Class 11" required />
              </label>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem;">
                <label style="font-size:0.8rem;">Has Groups
                  <select name="hasGroups"><option value="true">Yes</option><option value="false">No</option></select>
                </label>
                <label style="font-size:0.8rem;">Merged
                  <select name="isMerged"><option value="false">No</option><option value="true">Yes</option></select>
                </label>
              </div>
              <button type="submit" class="secondary">Add Class</button>
            </form>

            <form method="POST" action="/admin/groups">
              <h4>New ${hierarchyLabels.groupLabel}</h4>
              <label>Class
                <select name="classId" required>${classOptions}</select>
              </label>
              <label>Name
                <input type="text" name="name" placeholder="e.g. Science" required />
              </label>
              <button type="submit" class="secondary">Add Group</button>
            </form>

            <form method="POST" action="/admin/subjects">
              <h4>New ${hierarchyLabels.subjectLabel}</h4>
              <label>Class
                <select name="classId" required>${classOptions}</select>
              </label>
              <label>Group
                <select name="groupId"><option value="">None (Common)</option>${groupOptions}</select>
              </label>
              <label>Name
                <input type="text" name="name" placeholder="e.g. Physics 1st Paper" required />
              </label>
              <button type="submit" class="secondary">Add Subject</button>
            </form>

          </div>
        </section>

        <section class="card">
          <h2>2. Chapter Management</h2>
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap:1.5rem;">
            
            <form method="POST" action="/admin/chapters">
              <h4>New ${hierarchyLabels.chapterLabel}</h4>
              <label>Subject
                <select name="subjectId" required>${subjectOptions}</select>
              </label>
              <div style="display:grid; grid-template-columns:3fr 1fr; gap:0.5rem;">
                <label>Name <input type="text" name="name" required /></label>
                <label>Pos <input type="number" name="position" value="1" required /></label>
              </div>
              <button type="submit" class="secondary">Add Chapter</button>
            </form>

            <form method="POST" action="/admin/subchapters">
              <h4>New ${hierarchyLabels.subChapterLabel}</h4>
              <label>Chapter
                <select name="chapterId" required>${chapterOptions}</select>
              </label>
              <div style="display:grid; grid-template-columns:3fr 1fr; gap:0.5rem;">
                <label>Name <input type="text" name="name" required /></label>
                <label>Pos <input type="number" name="position" value="1" required /></label>
              </div>
              <button type="submit" class="secondary">Add Sub-chapter</button>
            </form>

             <form method="POST" action="/admin/question-types">
              <h4>New Question Type</h4>
              <label>Chapter
                <select name="chapterId" required>${chapterOptions}</select>
              </label>
              <label>Type Name (e.g., MCQ, Creative)
                <input type="text" name="name" required />
              </label>
              <button type="submit" class="secondary">Add Type</button>
            </form>

          </div>
        </section>

        <section class="card" style="border-left: 4px solid var(--accent);">
          <h2>3. Content Upload</h2>
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap:2rem;">
            
            <div>
              <h3>Add Learning Material</h3>
              <form method="POST" action="/admin/learning-materials">
                <label>Sub-chapter
                  <select name="subchapterId" required>${subchapterOptions || "<option value=\"\">Create sub-chapters first</option>"}</select>
                </label>
                <label>Title
                  <input type="text" name="title" required />
                </label>
                <label>Type & URL
                  <div style="display:grid; grid-template-columns:1fr 2fr; gap:0.5rem;">
                    <select name="materialType">
                      <option value="Lecture Video">Video</option>
                      <option value="Handwritten Note">Note</option>
                      <option value="PDF">PDF</option>
                    </select>
                    <input type="url" name="url" placeholder="https://..." required />
                  </div>
                </label>
                <label>Notes (Optional)
                  <textarea name="notes" rows="1"></textarea>
                </label>
                <button type="submit">Upload Material</button>
              </form>
            </div>

            <div>
              <h3>Add Question</h3>
              <form method="POST" action="/admin/questions">
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem;">
                   <label>Chapter
                    <select name="chapterId" required>${chapterOptions}</select>
                  </label>
                  <label>Type
                    <select name="questionTypeId" required>${questionTypeOptions}</select>
                  </label>
                </div>
                
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem;">
                  <label>Source
                    <select name="sourceEntityId" required>${sourceEntityOptions}</select>
                  </label>
                  <label>Year
                    <input type="text" name="sourceYear" placeholder="2023" required />
                  </label>
                </div>

                <label>Question Prompt
                  <textarea name="prompt" rows="2" required></textarea>
                </label>
                <label>Image URL (Optional)
                  <input type="url" name="imageUrl" placeholder="https://..." />
                </label>
                <button type="submit">Save Question</button>
              </form>
            </div>

          </div>
        </section>

        <section class="card">
          <h3>Source Management</h3>
          <form method="POST" action="/admin/source-entities" style="max-width:500px;">
            <div style="display:flex; gap:0.5rem; align-items:flex-end;">
              <label style="flex:1;">Category
                <select name="categoryId" required>${sourceCategoryOptions}</select>
              </label>
              <label style="flex:2;">New Entity Name
                <input type="text" name="name" placeholder="e.g. Dhaka Board" required />
              </label>
              <button type="submit" class="secondary" style="width:auto; margin-bottom:1px;">Add</button>
            </div>
          </form>
        </section>

        <section class="card">
          <h3>Recent Questions</h3>
          <div class="table-container">
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
          </div>
        </section>

        <section class="card">
          <h3>Recent Materials</h3>
          <div class="table-container">
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
          </div>
        </section>

      </div>
    </main>
  `;

  return layout("Admin Dashboard", body);
};


