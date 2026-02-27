export function fileManagerHtml() {
  return `
    <section class="fm-wrap">
      <header class="fm-header">
        <div>
          <h2>File manager</h2>
          <p>Browse all uploaded images, videos and documents in gallery view.</p>
        </div>
        <div class="fm-chip" id="fileCountChip">0 files</div>
      </header>

      <section class="fm-filters" aria-label="File filters">
        <label>Type
          <select id="fileTypeFilter">
            <option value="">All files</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="pdf">PDF</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label>Usage
          <select id="fileUsageFilter">
            <option value="">Any usage</option>
            <option value="profile-pic">Profile pic</option>
            <option value="cover-pic">Cover pic</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label>Search
          <input id="fileSearch" type="search" placeholder="Search key/path" autocomplete="off" />
        </label>
      </section>

      <section id="fileGrid" class="fm-grid" aria-live="polite"></section>
      <button id="loadMoreFiles" class="fm-load-more" type="button" hidden>Load more</button>
      <p id="fileManagerMsg" class="fm-msg" role="status" aria-live="polite"></p>
    </section>
  `;
}
