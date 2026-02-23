import { appShell } from "../../templates/shell.js";

function h(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatBytes(bytes) {
  const size = Number(bytes) || 0;
  if (size < 1024) return `${size} B`;
  if (size < 1024 ** 2) return `${(size / 1024).toFixed(1)} KB`;
  if (size < 1024 ** 3) return `${(size / 1024 ** 2).toFixed(2)} MB`;
  return `${(size / 1024 ** 3).toFixed(2)} GB`;
}

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
}

function mediaPreview(item) {
  const mediaUrl = `/media/${encodeURIComponent(item.key)}`;
  if (item.mediaType === "image") {
    return `<img src="${mediaUrl}" alt="${h(item.key)}" loading="lazy" decoding="async" />`;
  }
  if (item.mediaType === "video") {
    return `<video src="${mediaUrl}" preload="metadata" controls></video>`;
  }
  return `<div class="media-preview-fallback">${h(item.ext || "file")}</div>`;
}

export function mediaManagerPage(user, payload) {
  const { rows, filters, loadedCount, pageSize, nextCursor } = payload;

  const typeOptions = [
    { value: "all", label: "All" },
    { value: "image", label: "Images" },
    { value: "video", label: "Videos" },
    { value: "other", label: "Other" },
  ];

  const filterQuery = new URLSearchParams({
    type: filters.type || "all",
    source: filters.source || "all",
    search: filters.search || "",
  });

  const cardsMarkup = rows.length
    ? rows
        .map((item) => {
          const mediaUrl = `/media/${encodeURIComponent(item.key)}`;
          return `<article class="media-card">
            <div class="media-card-actions">
              <span class="media-type media-type-${h(item.mediaType)}">${h(item.mediaType)}</span>
              <div class="media-card-buttons">
                <a class="btn btn-secondary" href="${mediaUrl}" target="_blank" rel="noreferrer">Open</a>
                <form method="post" action="/api/media/delete" onsubmit="return confirm('Delete this file? This action cannot be undone.');">
                  <input type="hidden" name="key" value="${h(item.key)}" />
                  <input type="hidden" name="redirect" value="/admin/file-manager?${h(filterQuery.toString())}" />
                  <button class="btn btn-danger" type="submit">Delete</button>
                </form>
              </div>
            </div>
            <a class="media-card-preview" href="${mediaUrl}" target="_blank" rel="noreferrer">
              ${mediaPreview(item)}
            </a>
            <div class="media-card-meta">
              <p class="media-key" title="${h(item.key)}">${h(item.key)}</p>
              <p>${h(item.source)} · ${h(item.ext || "-")} · ${formatBytes(item.size)}</p>
              <p>${formatDate(item.uploaded)}</p>
            </div>
          </article>`;
        })
        .join("")
    : '<div class="table-empty">No files found for this filter on this page.</div>';

  const loadMoreHref = nextCursor ? `/admin/file-manager?${h(new URLSearchParams({ ...Object.fromEntries(filterQuery.entries()), cursor: nextCursor }).toString())}` : "";

  const content = `<section class="card media-manager-card">
      <h3 class="media-manager-title">File manager</h3>
      <form method="get" action="/admin/file-manager" class="media-filters" autocomplete="off">
        <label>Type
          <select name="type">
            ${typeOptions
              .map((option) => `<option value="${h(option.value)}" ${filters.type === option.value ? "selected" : ""}>${h(option.label)}</option>`)
              .join("")}
          </select>
        </label>
        <label>Source (folder)
          <input name="source" value="${h(filters.source || "all")}" placeholder="all or folder" />
        </label>
        <label>Search key
          <input name="search" value="${h(filters.search)}" placeholder="folder/file" />
        </label>
        <button type="submit" class="btn btn-secondary">Apply</button>
      </form>

      <div class="media-stats-grid">
        <div class="media-stat-card"><span>Visible cards</span><strong>${loadedCount}</strong></div>
        <div class="media-stat-card"><span>Fetched this page</span><strong>${pageSize}</strong></div>
        <div class="media-stat-card"><span>Loading mode</span><strong>Paginated</strong></div>
      </div>

      <div class="media-cards-grid">${cardsMarkup}</div>

      ${
        nextCursor
          ? `<div class="media-load-more"><a href="${loadMoreHref}" class="btn btn-primary">Load more</a><p>Loads next page only. Keeps server load lower.</p></div>`
          : '<p class="media-end-note">You are at the end of the current file list.</p>'
      }
    </section>`;

  return appShell("file-manager", user, "File manager", "Browse files as cards, preview quickly, and delete directly.", content, { pageStyles: mediaManagerStyles });
}

export const mediaManagerStyles = `
.media-manager-card,.media-manager-title { margin: 0; }
.media-manager-card { display: grid; gap: 8px; }
.media-filters { display: grid; grid-template-columns: repeat(4, minmax(120px, 1fr)); gap: 6px; align-items: end; }
.media-filters label { display: grid; gap: 4px; font-size: 12px; color: var(--text); }
.media-filters input,.media-filters select { height: 32px; border: 1px solid var(--line); border-radius: 4px; padding: 0 8px; font-size: 12px; }
.media-stats-grid { display: grid; grid-template-columns: repeat(3, minmax(120px, 1fr)); gap: 6px; }
.media-stat-card { border: 1px solid var(--line); border-radius: 4px; padding: 6px; display: grid; gap: 2px; }
.media-stat-card span { font-size: 11px; color: var(--muted); }
.media-stat-card strong { font-size: 13px; }
.media-cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 8px; }
.media-card { border: 1px solid var(--line); border-radius: 6px; background: #fff; display: grid; gap: 6px; padding: 6px; }
.media-card-actions { display: flex; justify-content: space-between; align-items: center; gap: 6px; }
.media-card-buttons { display: flex; gap: 4px; }
.media-card-buttons form { margin: 0; }
.media-card-preview { display: block; border: 1px solid var(--line); border-radius: 4px; overflow: hidden; background: #f8fafc; aspect-ratio: 4 / 3; }
.media-card-preview img,.media-card-preview video { width: 100%; height: 100%; object-fit: cover; display: block; }
.media-preview-fallback { width: 100%; height: 100%; display: grid; place-items: center; color: var(--muted); font-size: 12px; text-transform: uppercase; }
.media-card-meta { display: grid; gap: 2px; }
.media-card-meta p { margin: 0; font-size: 11px; color: #475569; }
.media-key { font-size: 12px !important; color: #0f172a !important; word-break: break-all; }
.media-type { display: inline-flex; border: 1px solid var(--line); border-radius: 999px; padding: 0 7px; font-size: 10px; line-height: 18px; text-transform: capitalize; }
.media-type-image { background: #eefbf3; border-color: #b4ebc8; color: #136f3b; }
.media-type-video { background: #eef5ff; border-color: #bdd6ff; color: #1e4cb8; }
.media-type-other { background: #f8fafc; border-color: #e2e8f0; color: #475569; }
.media-load-more { display: grid; gap: 4px; justify-items: start; }
.media-load-more p,.media-end-note { margin: 0; font-size: 11px; color: var(--muted); }
@media (max-width: 900px) {
  .media-filters { grid-template-columns: 1fr 1fr; }
  .media-stats-grid { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .media-manager-card { gap: 6px; }
  .media-cards-grid { grid-template-columns: 1fr; gap: 6px; }
  .media-card {
    grid-template-columns: 82px minmax(0, 1fr);
    grid-template-areas:
      "preview actions"
      "preview meta";
    gap: 4px 6px;
    padding: 5px;
    border-radius: 5px;
  }
  .media-card-preview {
    grid-area: preview;
    aspect-ratio: 1 / 1;
    border-radius: 4px;
  }
  .media-card-actions {
    grid-area: actions;
    align-items: flex-start;
    gap: 4px;
  }
  .media-card-buttons { gap: 3px; }
  .media-card-buttons .btn {
    min-height: 24px;
    padding: 0 7px;
    font-size: 11px;
  }
  .media-card-meta {
    grid-area: meta;
    gap: 1px;
  }
  .media-card-meta p { font-size: 10px; line-height: 1.2; }
  .media-key { font-size: 11px !important; }
  .media-type { padding: 0 6px; font-size: 9px; line-height: 16px; }
}
`;
