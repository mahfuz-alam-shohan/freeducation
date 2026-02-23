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

export function mediaManagerPage(user, payload) {
  const { rows, filters, totals } = payload;

  const typeOptions = [
    { value: "all", label: "All" },
    { value: "image", label: "Images" },
    { value: "video", label: "Videos" },
    { value: "other", label: "Other" },
  ];

  const sourceOptions = [{ value: "all", label: "All" }, ...payload.availableSources.map((source) => ({ value: source, label: source }))];

  const rowMarkup = rows.length
    ? rows
        .map(
          (item) => `<tr>
      <td><span class="media-type media-type-${h(item.mediaType)}">${h(item.mediaType)}</span></td>
      <td class="media-key-cell"><a href="/media/${encodeURIComponent(item.key)}" target="_blank" rel="noreferrer">${h(item.key)}</a></td>
      <td>${h(item.source)}</td>
      <td>${h(item.ext || "-")}</td>
      <td>${formatBytes(item.size)}</td>
      <td>${formatDate(item.uploaded)}</td>
    </tr>`,
        )
        .join("")
    : '<tr><td colspan="6" class="table-empty">No files found for this filter.</td></tr>';

  const progressPercent = totals.allSizeBytes > 0 ? Math.min(100, Math.round((totals.filteredSizeBytes / totals.allSizeBytes) * 100)) : 0;

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
        <label>Source
          <select name="source">
            ${sourceOptions
              .map((option) => `<option value="${h(option.value)}" ${filters.source === option.value ? "selected" : ""}>${h(option.label)}</option>`)
              .join("")}
          </select>
        </label>
        <label>Search key
          <input name="search" value="${h(filters.search)}" placeholder="folder/file" />
        </label>
        <button type="submit" class="btn btn-secondary">Filter</button>
      </form>

      <div class="media-stats-grid">
        <div class="media-stat-card"><span>Total files</span><strong>${totals.filteredCount}</strong></div>
        <div class="media-stat-card"><span>Filtered size</span><strong>${formatBytes(totals.filteredSizeBytes)}</strong></div>
        <div class="media-stat-card"><span>All files size</span><strong>${formatBytes(totals.allSizeBytes)}</strong></div>
      </div>

      <div class="media-size-bar" aria-label="Total size coverage">
        <div class="media-size-bar-fill" style="width:${progressPercent}%"></div>
      </div>
      <p class="media-size-caption">Filtered data covers ${progressPercent}% of all stored file size.</p>

      <div class="table-wrap">
        <table class="table media-table">
          <thead><tr><th>Type</th><th>File key</th><th>Source</th><th>Ext</th><th>Size</th><th>Uploaded</th></tr></thead>
          <tbody>${rowMarkup}</tbody>
        </table>
      </div>
    </section>`;

  return appShell("file-manager", user, "File manager", "All uploaded images and videos with sizes.", content, { pageStyles: mediaManagerStyles });
}

export const mediaManagerStyles = `
.media-manager-card,.media-manager-title { margin: 0; }
.media-manager-card { display: grid; gap: 8px; }
.media-filters { display: grid; grid-template-columns: repeat(4, minmax(120px, 1fr)) auto; gap: 6px; align-items: end; }
.media-filters label { display: grid; gap: 4px; font-size: 12px; color: var(--text); }
.media-filters input,.media-filters select { height: 32px; border: 1px solid var(--line); border-radius: 6px; padding: 0 8px; font-size: 12px; }
.media-stats-grid { display: grid; grid-template-columns: repeat(3, minmax(120px, 1fr)); gap: 6px; }
.media-stat-card { border: 1px solid var(--line); border-radius: 6px; padding: 6px; display: grid; gap: 2px; }
.media-stat-card span { font-size: 11px; color: var(--muted); }
.media-stat-card strong { font-size: 13px; }
.media-size-bar { width: 100%; height: 10px; border: 1px solid var(--line); border-radius: 999px; background: #f8fafc; overflow: hidden; }
.media-size-bar-fill { height: 100%; background: linear-gradient(90deg, #6366f1, #14b8a6); }
.media-size-caption { margin: 0; font-size: 11px; color: var(--muted); }
.media-table { width: 100%; border-collapse: collapse; }
.media-table thead th { background: #f2f6ff; color: #334155; font-size: 10px; border: 1px solid var(--line); padding: 4px 5px; text-transform: none; white-space: nowrap; }
.media-table tbody td { border: 1px solid var(--line); padding: 3px 5px; font-size: 12px; vertical-align: middle; }
.media-key-cell a { color: var(--link); text-decoration: none; }
.media-key-cell a:hover { text-decoration: underline; }
.media-type { display: inline-flex; border: 1px solid var(--line); border-radius: 999px; padding: 0 7px; font-size: 10px; line-height: 18px; text-transform: capitalize; }
.media-type-image { background: #eefbf3; border-color: #b4ebc8; color: #136f3b; }
.media-type-video { background: #eef5ff; border-color: #bdd6ff; color: #1e4cb8; }
.media-type-other { background: #f8fafc; border-color: #e2e8f0; color: #475569; }
@media (max-width: 900px) {
  .media-filters { grid-template-columns: 1fr 1fr; }
  .media-stats-grid { grid-template-columns: 1fr; }
}
`;
