import type { ChapterItem, ContentItem, SubjectClassGroup, SubjectDetail, TopicItem } from "../../../features/admin/modules";
import type { SubjectTemplate } from "../../../modules/subjects/types";

const escapeValue = (value: string): string =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

type SubjectDetailContentProps = {
  subject: SubjectDetail;
  template: SubjectTemplate | null;
  classGroups: SubjectClassGroup[];
  selectedClassSubjectId?: number;
  chapters: ChapterItem[];
  selectedChapterId?: number;
  topics: TopicItem[];
  selectedTopicId?: number;
  contentItems: ContentItem[];
  successMessage?: string;
  errorMessage?: string;
};

const renderClassGroupLinks = (subjectId: number, classGroups: SubjectClassGroup[], selected?: number): string => {
  if (!classGroups.length) {
    return "<p class=\"helper-text\">No class groups assigned to this subject.</p>";
  }

  return `
    <div class="page-actions">
      ${classGroups
        .map((group) => {
          const active = group.classSubjectId === selected;
          return `
            <a class="button-link ${active ? "button-link--primary" : ""}" href="/admin/modules/subjects/${subjectId}?classSubjectId=${group.classSubjectId}">
              ${escapeValue(group.classGroupName)} (${escapeValue(group.classGroupSlug)})
            </a>`;
        })
        .join("")}
    </div>`;
};

const renderChapterRows = (subjectId: number, classSubjectId: number, chapters: ChapterItem[]): string => {
  if (!chapters.length) {
    return `
      <tr>
        <td colspan="5">No chapters yet.</td>
      </tr>`;
  }

  return chapters
    .map(
      (chapter) => `
      <tr>
        <td>${escapeValue(chapter.title)}</td>
        <td>${escapeValue(chapter.slug)}</td>
        <td>${chapter.position}</td>
        <td>${escapeValue(chapter.summary ?? "")}</td>
        <td>
          <a class="button-link" href="/admin/modules/subjects/${subjectId}?classSubjectId=${classSubjectId}&chapterId=${chapter.id}">Topics</a>
          <form method="post" action="/admin/modules/subjects/${subjectId}/chapters/delete" style="display:inline">
            <input type="hidden" name="classSubjectId" value="${classSubjectId}" />
            <input type="hidden" name="chapterId" value="${chapter.id}" />
            <button type="submit" class="button-link button-link--danger">Delete</button>
          </form>
        </td>
      </tr>`,
    )
    .join("");
};

const renderTopicRows = (subjectId: number, classSubjectId: number, chapterId: number, topics: TopicItem[]): string => {
  if (!topics.length) {
    return `
      <tr>
        <td colspan="4">No topics yet.</td>
      </tr>`;
  }

  return topics
    .map(
      (topic) => `
      <tr>
        <td>${escapeValue(topic.title)}</td>
        <td>${escapeValue(topic.slug)}</td>
        <td>${topic.position}</td>
        <td>
          <a class="button-link" href="/admin/modules/subjects/${subjectId}?classSubjectId=${classSubjectId}&chapterId=${chapterId}&topicId=${topic.id}">Content</a>
          <form method="post" action="/admin/modules/subjects/${subjectId}/topics/delete" style="display:inline">
            <input type="hidden" name="classSubjectId" value="${classSubjectId}" />
            <input type="hidden" name="chapterId" value="${chapterId}" />
            <input type="hidden" name="topicId" value="${topic.id}" />
            <button type="submit" class="button-link button-link--danger">Delete</button>
          </form>
        </td>
      </tr>`,
    )
    .join("");
};

const renderContentRows = (
  subjectId: number,
  classSubjectId: number,
  chapterId: number,
  topicId?: number,
  contentItems: ContentItem[],
): string => {
  if (!contentItems.length) {
    return `
      <tr>
        <td colspan="5">No content items yet.</td>
      </tr>`;
  }

  return contentItems
    .map(
      (item) => `
      <tr>
        <td>${escapeValue(item.contentType)}</td>
        <td>${escapeValue(item.title)}</td>
        <td>${escapeValue(item.body ?? "")}</td>
        <td>${escapeValue(item.resourceUrl ?? "")}</td>
        <td>
          <form method="post" action="/admin/modules/subjects/content/delete" style="display:inline">
            <input type="hidden" name="contentItemId" value="${item.id}" />
            <input type="hidden" name="subjectId" value="${subjectId}" />
            <input type="hidden" name="classSubjectId" value="${classSubjectId}" />
            <input type="hidden" name="chapterId" value="${chapterId}" />
            ${topicId ? `<input type="hidden" name="topicId" value="${topicId}" />` : ""}
            <button type="submit" class="button-link button-link--danger">Delete</button>
          </form>
        </td>
      </tr>`,
    )
    .join("");
};

export const renderSubjectDetailContent = ({
  subject,
  template,
  classGroups,
  selectedClassSubjectId,
  chapters,
  selectedChapterId,
  topics,
  selectedTopicId,
  contentItems,
  successMessage,
  errorMessage,
}: SubjectDetailContentProps): string => `
  <section class="page">
    <header class="page-header">
      <h1 class="page-title">${escapeValue(subject.name)}</h1>
      <p class="page-subtitle">Manage chapters, topics, and content for this subject.</p>
      ${template ? `<p class="helper-text">Template: ${escapeValue(template.name)} (${escapeValue(template.slug)})</p>` : ""}
      <div class="page-actions">
        <a class="button-link" href="/admin/modules/subjects">Back to subjects</a>
        <form method="post" action="/admin/modules/subjects/${subject.id}/delete" style="display:inline">
          <button type="submit" class="button-link button-link--danger">Delete subject</button>
        </form>
      </div>
    </header>
    ${successMessage ? `<div class="alert">${escapeValue(successMessage)}</div>` : ""}
    ${errorMessage ? `<div class="alert alert--error">${escapeValue(errorMessage)}</div>` : ""}
    <section class="page-section">
      <h2 class="section-title">Class groups</h2>
      ${renderClassGroupLinks(subject.id, classGroups, selectedClassSubjectId)}
    </section>
    <section class="page-section">
      <h2 class="section-title">Chapters</h2>
      ${
        selectedClassSubjectId
          ? `
        <div class="table-scroll">
          <table class="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Slug</th>
                <th>Order</th>
                <th>Summary</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${renderChapterRows(subject.id, selectedClassSubjectId, chapters)}
            </tbody>
          </table>
        </div>
        <div class="form-card">
          <h3 class="section-title">Add chapter</h3>
          <form class="form-grid" method="post" action="/admin/modules/subjects/${subject.id}/chapters">
            <input type="hidden" name="classSubjectId" value="${selectedClassSubjectId}" />
            <label class="form-field">
              <span>Title</span>
              <input name="title" required />
            </label>
            <label class="form-field">
              <span>Slug</span>
              <input name="slug" required placeholder="chapter-01" />
            </label>
            <label class="form-field">
              <span>Position</span>
              <input type="number" name="position" value="1" min="0" />
            </label>
            <label class="form-field">
              <span>Summary</span>
              <input name="summary" />
            </label>
            <div class="form-actions">
              <button type="submit" class="button-link">Add chapter</button>
            </div>
          </form>
        </div>`
          : `<p class="helper-text">Select a class group to manage chapters.</p>`
      }
    </section>
    <section class="page-section">
      <h2 class="section-title">Topics</h2>
      ${
        template?.structure.hasTopics && selectedClassSubjectId && selectedChapterId
          ? `
        <div class="table-scroll">
          <table class="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Slug</th>
                <th>Order</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${renderTopicRows(subject.id, selectedClassSubjectId, selectedChapterId, topics)}
            </tbody>
          </table>
        </div>
        <div class="form-card">
          <h3 class="section-title">Add topic</h3>
          <form class="form-grid" method="post" action="/admin/modules/subjects/${subject.id}/topics">
            <input type="hidden" name="classSubjectId" value="${selectedClassSubjectId}" />
            <input type="hidden" name="chapterId" value="${selectedChapterId}" />
            <label class="form-field">
              <span>Title</span>
              <input name="title" required />
            </label>
            <label class="form-field">
              <span>Slug</span>
              <input name="slug" required placeholder="topic-01" />
            </label>
            <label class="form-field">
              <span>Position</span>
              <input type="number" name="position" value="1" min="0" />
            </label>
            <div class="form-actions">
              <button type="submit" class="button-link">Add topic</button>
            </div>
          </form>
        </div>`
          : template?.structure.hasTopics
            ? `<p class="helper-text">Select a chapter to manage topics.</p>`
            : `<p class="helper-text">This subject does not use topics.</p>`
      }
    </section>
    <section class="page-section">
      <h2 class="section-title">Content items</h2>
      ${
        template?.structure.hasTopics
          ? selectedClassSubjectId && selectedChapterId && selectedTopicId
            ? `
        <div class="table-scroll">
          <table class="data-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Title</th>
                <th>Body</th>
                <th>Resource URL</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${renderContentRows(subject.id, selectedClassSubjectId, selectedChapterId, selectedTopicId, contentItems)}
            </tbody>
          </table>
        </div>
        <div class="form-card">
          <h3 class="section-title">Add content</h3>
          <form class="form-grid" method="post" action="/admin/modules/subjects/${subject.id}/content">
            <input type="hidden" name="classSubjectId" value="${selectedClassSubjectId}" />
            <input type="hidden" name="chapterId" value="${selectedChapterId}" />
            <label class="form-field">
              <span>Type</span>
              <select name="contentType">
                <option value="notes">Notes</option>
                <option value="summary">Summary</option>
                <option value="video">Video</option>
                <option value="pdf">PDF</option>
                <option value="resource">Resource</option>
              </select>
            </label>
            <label class="form-field">
              <span>Title</span>
              <input name="title" required />
            </label>
            <label class="form-field">
              <span>Body</span>
              <textarea name="body" rows="4"></textarea>
            </label>
            <label class="form-field">
              <span>Resource URL</span>
              <input name="resourceUrl" />
            </label>
            <label class="form-field">
              <span>Position</span>
              <input type="number" name="position" value="1" min="0" />
            </label>
            <div class="form-actions">
              <button type="submit" class="button-link">Add content</button>
            </div>
          </form>
        </div>`
            : `<p class="helper-text">Select a topic to manage content items.</p>`
          : selectedClassSubjectId && selectedChapterId
          ? `
        <div class="table-scroll">
          <table class="data-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Title</th>
                <th>Body</th>
                <th>Resource URL</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${renderContentRows(subject.id, selectedClassSubjectId, selectedChapterId, undefined, contentItems)}
            </tbody>
          </table>
        </div>
        <div class="form-card">
          <h3 class="section-title">Add content</h3>
          <form class="form-grid" method="post" action="/admin/modules/subjects/${subject.id}/content">
            <input type="hidden" name="classSubjectId" value="${selectedClassSubjectId}" />
            <input type="hidden" name="chapterId" value="${selectedChapterId}" />
            <label class="form-field">
              <span>Type</span>
              <select name="contentType">
                <option value="notes">Notes</option>
                <option value="summary">Summary</option>
                <option value="video">Video</option>
                <option value="pdf">PDF</option>
                <option value="resource">Resource</option>
              </select>
            </label>
            <label class="form-field">
              <span>Title</span>
              <input name="title" required />
            </label>
            <label class="form-field">
              <span>Body</span>
              <textarea name="body" rows="4"></textarea>
            </label>
            <label class="form-field">
              <span>Resource URL</span>
              <input name="resourceUrl" />
            </label>
            <label class="form-field">
              <span>Position</span>
              <input type="number" name="position" value="1" min="0" />
            </label>
            <div class="form-actions">
              <button type="submit" class="button-link">Add content</button>
            </div>
          </form>
        </div>`
          : `<p class="helper-text">Select a chapter to manage content items.</p>`
      }
    </section>
  </section>
`;
