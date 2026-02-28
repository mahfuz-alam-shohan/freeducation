export const SOCIAL_STYLE = `
.social-page{display:grid;gap:8px;max-width:860px;margin:0 auto;inline-size:min(100%,860px);min-width:0;overflow-x:hidden}
.social-card{border:1px solid var(--border);background:var(--surface);border-radius:10px;padding:8px;min-width:0}
.social-create h2{margin:0;font-size:1rem}
.social-note{margin:4px 0 0;color:var(--text-muted);font-size:.88rem}
.social-readonly{margin:8px 0 0;border:1px solid var(--border);background:var(--surface-soft);border-radius:8px;padding:6px 8px;color:var(--text-muted);font-size:.9rem}
.social-form{margin-top:8px;display:grid;gap:6px}
.social-form textarea,.social-comment-form input{width:100%;max-width:100%;box-sizing:border-box;border:1px solid var(--border);background:var(--surface-soft);color:var(--text);border-radius:8px;padding:6px 8px;font:inherit}
.social-form button,.social-comment-form button,.social-like{border:1px solid var(--border);background:var(--surface-soft);color:var(--text);border-radius:8px;padding:5px 9px;cursor:pointer}
.social-form button:hover,.social-comment-form button:hover,.social-like:hover{border-color:var(--accent)}
.social-status{min-height:20px;color:var(--text-muted);font-size:.86rem}
.social-feed{display:grid;gap:8px;min-width:0}
.post-card{border:1px solid var(--border);background:var(--surface);border-radius:10px;padding:8px;display:grid;gap:7px;min-width:0}
.post-head{display:flex;gap:7px;align-items:center;min-width:0}
.avatar{width:34px;height:34px;border-radius:50%;border:1px solid var(--border);background:var(--surface-soft);display:grid;place-items:center;font-size:.78rem;color:var(--text-muted);overflow:hidden}
.avatar img{width:100%;height:100%;object-fit:cover}
.post-meta{display:grid;line-height:1.2;min-width:0}
.post-author{font-size:.92rem;font-weight:600;overflow-wrap:anywhere}
.post-time{font-size:.78rem;color:var(--text-muted)}
.post-body{white-space:pre-wrap;word-break:break-word;overflow-wrap:anywhere;font-size:.93rem}
.post-image{max-width:100%;border-radius:8px;border:1px solid var(--border)}
.post-actions{display:flex;gap:6px;align-items:center;flex-wrap:wrap}
.social-like.is-liked{border-color:var(--accent);color:var(--accent)}
.comment-list{display:grid;gap:5px}
.comment-item{border:1px solid var(--border);border-radius:8px;background:var(--surface-soft);padding:5px 7px;font-size:.88rem;overflow-wrap:anywhere}
.comment-author{font-weight:600;font-size:.85rem}
.social-comment-form{display:flex;gap:6px;align-items:center;min-width:0}
.social-comment-form input{flex:1 1 auto;width:auto;min-width:0}
.empty-feed{border:1px dashed var(--border);border-radius:10px;padding:10px;color:var(--text-muted);font-size:.9rem}
`;
