export const SOCIAL_STYLE = `
.social-page{display:grid;gap:8px;max-width:860px;margin:0 auto;inline-size:min(100%,860px);min-width:0;overflow-x:hidden}
.social-card{border:1px solid var(--border);background:var(--surface);border-radius:10px;padding:8px;min-width:0}
.social-create-cta h2,.social-create-page h2{margin:0;font-size:1rem}
.social-note{margin:4px 0 0;color:var(--text-muted);font-size:.88rem}
.social-readonly{margin:8px 0 0;border:1px solid var(--border);background:var(--surface-soft);border-radius:8px;padding:6px 8px;color:var(--text-muted);font-size:.9rem}
.social-create-button,.social-back-link{display:inline-block;border:1px solid var(--border);background:var(--surface-soft);color:var(--text);border-radius:8px;padding:5px 9px;text-decoration:none;font-size:.9rem}
.social-create-button{margin-top:8px}
.social-create-button:hover,.social-back-link:hover{border-color:var(--accent)}
.social-create-topbar{display:flex;align-items:center;justify-content:space-between;gap:8px}
.social-form{margin-top:8px;display:grid;gap:6px}
.social-label{font-size:.86rem;color:var(--text-muted)}
.social-form textarea,.social-comment-form input,.social-form input[type='file']{width:100%;max-width:100%;box-sizing:border-box;border:1px solid var(--border);background:var(--surface-soft);color:var(--text);border-radius:8px;padding:6px 8px;font:inherit}
.social-form button,.social-comment-form button,.social-like{border:1px solid var(--border);background:var(--surface-soft);color:var(--text);border-radius:8px;padding:5px 9px;cursor:pointer}
.social-form button:hover,.social-comment-form button:hover,.social-like:hover{border-color:var(--accent)}
.image-preview-wrap{position:relative;border:1px solid var(--border);border-radius:8px;overflow:hidden;max-width:420px;background:var(--surface-soft)}
.image-preview{display:block;max-width:100%;max-height:280px;object-fit:contain}
.clear-image-button{position:absolute;top:6px;right:6px;width:26px;height:26px;border-radius:50%;font-size:1rem;line-height:1;padding:0}
.upload-progress-wrap{display:grid;gap:3px}
.upload-progress-head{display:flex;justify-content:space-between;color:var(--text-muted);font-size:.85rem}
.upload-progress-wrap progress{width:100%;height:12px}
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
