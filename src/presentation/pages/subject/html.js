export function subjectHtml(subjectId) {
  return `
    <section class="sbj-page" data-subject-id="${Number(subjectId) || 0}">
      <header class="sbj-head">
        <button id="subjectBackBtn" class="sbj-back" type="button">Back to subjects</button>
        <div>
          <h2 id="subjectTitle">Subject #${Number(subjectId) || 0}</h2>
          <p id="subjectSubtitle">Loading subject...</p>
        </div>
      </header>

      <nav id="subjectBreadcrumb" class="sbj-breadcrumb" aria-label="breadcrumb"></nav>

      <section id="subjectDynamicArea" class="sbj-dynamic" aria-live="polite"></section>

      <section id="chapterModal" class="sbj-modal" role="dialog" aria-modal="true" aria-hidden="true" aria-labelledby="chapterModalTitle">
        <div class="sbj-modal-surface">
          <h3 id="chapterModalTitle">Add chapter</h3>
          <form id="chapterForm" class="sbj-form" autocomplete="off">
            <input type="hidden" name="mode" value="create" />
            <input type="hidden" name="nodeId" value="0" />
            <input type="hidden" name="chapterId" value="0" />
            <label>Chapter name
              <input name="name" type="text" maxlength="140" required placeholder="Enter chapter name" />
            </label>
            <label class="sbj-inline-check sbj-switch" id="chapterTopicsToggleWrap">
              <input name="topicsEnabled" type="checkbox" />
              <span class="sbj-switch-track" aria-hidden="true"></span>
              <span class="sbj-switch-label">Enable topics in this chapter</span>
            </label>
            <div class="sbj-modal-media-row">
              <div class="sbj-modal-image-field">
                <span class="sbj-modal-label">Template image (optional)</span>
                <div class="sbj-modal-image-slot-wrap">
                  <button id="chapterModalImageSlot" type="button" class="sbj-image-slot sbj-modal-image-slot" aria-label="Select chapter image">
                    <span id="chapterModalImageIcon" class="sbj-image-icon">
                      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3.5" y="4.5" width="17" height="15" rx="2.5"/>
                        <circle cx="9" cy="10" r="1.6"/>
                        <path d="M20.5 15.2l-4.6-4.3-4.4 4.1-2.3-2.1-5.7 5.2"/>
                      </svg>
                    </span>
                    <img id="chapterModalImagePreview" class="sbj-thumb sbj-thumb-node sbj-modal-image-preview" alt="Chapter image preview" hidden />
                  </button>
                  <input id="chapterModalImageInput" class="sbj-node-image-input" name="image" type="file" accept="image/png,image/jpeg,image/webp" />
                  <button id="chapterModalImageRemove" type="button" class="sbj-image-remove" aria-label="Remove selected chapter image" hidden>x</button>
                </div>
              </div>
            </div>
            <div class="sbj-form-actions">
              <button id="chapterModalCancel" class="sbj-secondary" type="button">Cancel</button>
              <button class="sbj-primary" type="submit">Save</button>
            </div>
          </form>
        </div>
      </section>

      <section id="topicModal" class="sbj-modal" role="dialog" aria-modal="true" aria-hidden="true" aria-labelledby="topicModalTitle">
        <div class="sbj-modal-surface">
          <h3 id="topicModalTitle">Add topic</h3>
          <form id="topicForm" class="sbj-form" autocomplete="off">
            <input type="hidden" name="mode" value="create" />
            <input type="hidden" name="chapterId" value="0" />
            <input type="hidden" name="topicId" value="0" />
            <label>Topic number (optional)
              <input name="topicNumber" type="text" maxlength="24" placeholder="e.g. 1, 1.1, Topic A" />
            </label>
            <label>Topic name
              <input name="name" type="text" maxlength="140" required placeholder="Enter topic name" />
            </label>
            <label>Template image (optional)
              <input name="image" type="file" accept="image/png,image/jpeg,image/webp" />
            </label>
            <label class="sbj-inline-check">
              <input name="clearImage" type="checkbox" /> Remove existing image
            </label>
            <div class="sbj-form-actions">
              <button id="topicModalCancel" class="sbj-secondary" type="button">Cancel</button>
              <button class="sbj-primary" type="submit">Save</button>
            </div>
          </form>
        </div>
      </section>

      <p id="subjectMsg" class="sbj-msg" role="status" aria-live="polite"></p>
    </section>
  `;
}
