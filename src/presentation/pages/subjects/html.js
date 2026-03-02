export function subjectsHtml() {
  return `
    <section class="sub-page">
      <header class="sub-head">
        <div>
          <h2>Subjects</h2>
          <p>Create subjects from templates, then manage their book structure and contents.</p>
        </div>
        <button id="openSubjectModal" class="sub-primary" type="button">Add subject</button>
      </header>

      <div class="sub-table-wrap">
        <table class="sub-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Subject Name</th>
              <th>Class</th>
              <th>Template</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="subjectRows"></tbody>
        </table>
      </div>

      <section id="subjectModal" class="sub-modal" aria-hidden="true" role="dialog" aria-modal="true" aria-labelledby="subjectModalTitle">
        <div class="sub-modal-surface">
          <header>
            <h3 id="subjectModalTitle">Create subject</h3>
            <p>Choose class and template to auto-build a skeleton.</p>
          </header>

          <form id="createSubjectForm" class="sub-form" autocomplete="off">
            <div class="sub-form-grid">
              <label class="sub-field">
                <span class="sub-field-label">Subject name</span>
                <span class="sub-field-input-wrap">
                  <span class="sub-field-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M4 7.5h16M4 12h16M4 16.5h16"/>
                    </svg>
                  </span>
                  <input name="name" type="text" maxlength="140" required placeholder="e.g. Bangla 1st Paper" />
                </span>
              </label>
              <label class="sub-field">
                <span class="sub-field-label">Class</span>
                <span class="sub-field-input-wrap">
                  <span class="sub-field-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M4 6h16M4 12h16M4 18h16"/>
                    </svg>
                  </span>
                  <select id="subjectClassSelect" name="classId" required>
                    <option value="">Loading classes...</option>
                  </select>
                </span>
              </label>
              <label class="sub-field">
                <span class="sub-field-label">Template</span>
                <span class="sub-field-input-wrap">
                  <span class="sub-field-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M4.5 6.5h15M4.5 12h15M4.5 17.5h15"/>
                    </svg>
                  </span>
                  <select id="subjectTemplateSelect" name="templateId" required>
                    <option value="">Loading templates...</option>
                  </select>
                </span>
              </label>
              <div class="sub-field">
                <span class="sub-field-label">Thumbnail (optional)</span>
                <div class="sub-create-image-slot-wrap">
                  <button id="subjectCreateImageSlot" type="button" class="sub-image-slot sub-create-image-slot" aria-label="Select subject thumbnail">
                    <span id="subjectCreateImageIcon" class="sub-image-icon">
                      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3.5" y="4.5" width="17" height="15" rx="2.5"/>
                        <circle cx="9" cy="10" r="1.6"/>
                        <path d="M20.5 15.2l-4.6-4.3-4.4 4.1-2.3-2.1-5.7 5.2"/>
                      </svg>
                    </span>
                    <img id="subjectCreateImagePreview" class="sub-thumb sub-create-thumb" alt="Subject thumbnail preview" hidden />
                  </button>
                  <input id="subjectCreateImageInput" class="sub-image-input sub-create-image-input" name="image" type="file" accept="image/png,image/jpeg,image/webp" />
                  <button id="subjectCreateImageRemove" type="button" class="sub-image-remove" aria-label="Remove selected image" hidden>x</button>
                </div>
              </div>
            </div>
            <div class="sub-form-actions">
              <button id="cancelSubjectModal" class="sub-secondary" type="button">Cancel</button>
              <button class="sub-primary" type="submit">Create subject</button>
            </div>
          </form>
        </div>
      </section>

      <p id="subjectsMsg" class="sub-msg" role="status" aria-live="polite"></p>
    </section>
  `;
}
