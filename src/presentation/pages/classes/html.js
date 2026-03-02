export function classesHtml() {
  return `
    <section class="cls-page">
      <header class="cls-head">
        <div>
          <h2>Classes</h2>
          <p>Manage class cards for public homepage and subject creation.</p>
        </div>
        <button id="toggleClassCreateForm" class="cls-primary" type="button" aria-expanded="false">Add class</button>
      </header>

      <section id="classCreatePanel" class="cls-create-panel" aria-hidden="true">
        <form id="createClassForm" class="cls-form" autocomplete="off">
          <div class="cls-form-top-row">
            <label class="cls-field">
              <span class="cls-field-label">Class name</span>
              <span class="cls-field-input-wrap">
                <span class="cls-field-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 7.5h16M4 12h16M4 16.5h16"/>
                  </svg>
                </span>
                <input name="name" type="text" maxlength="120" required placeholder="e.g. Class 1" />
              </span>
            </label>
            <div class="cls-field">
              <span class="cls-field-label">Thumbnail (optional)</span>
              <div class="cls-create-image-slot-wrap">
                <button id="classCreateImageSlot" type="button" class="cls-image-slot cls-create-image-slot" aria-label="Select class thumbnail">
                  <span id="classCreateImageIcon" class="cls-image-icon">
                    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="3.5" y="4.5" width="17" height="15" rx="2.5"/>
                      <circle cx="9" cy="10" r="1.6"/>
                      <path d="M20.5 15.2l-4.6-4.3-4.4 4.1-2.3-2.1-5.7 5.2"/>
                    </svg>
                  </span>
                  <img id="classCreateImagePreview" class="cls-thumb cls-create-thumb" alt="Class thumbnail preview" hidden />
                </button>
                <input id="classCreateImageInput" class="cls-image-input cls-create-image-input" name="image" type="file" accept="image/png,image/jpeg,image/webp" />
                <button id="classCreateImageRemove" type="button" class="cls-image-remove" aria-label="Remove selected image" hidden>x</button>
              </div>
            </div>
            <label class="cls-inline-check cls-create-inline-check">
              <input name="showInHome" type="checkbox" />
              <span>Show on homepage card rail</span>
            </label>
          </div>
          <div class="cls-form-actions">
            <button id="cancelClassCreateForm" class="cls-secondary" type="button">Cancel</button>
            <button class="cls-primary" type="submit">Create class</button>
          </div>
        </form>
      </section>

      <div class="cls-table-wrap">
        <table class="cls-table">
          <thead>
            <tr>
              <th>Home</th>
              <th>Image</th>
              <th>Class Name</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody id="classRows"></tbody>
        </table>
      </div>

      <p id="classesMsg" class="cls-msg" role="status" aria-live="polite"></p>
    </section>
  `;
}
