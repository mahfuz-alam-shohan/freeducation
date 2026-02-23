export const publicHomeStyles = `
.public-home-cover {
  width: 100%;
  background: linear-gradient(120deg, #1f3379 0%, #324eb4 52%, #24885f 100%);
  color: #f8fafc;
  min-height: 165px;
  padding: 10px 12px;
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
  align-items: center;
  gap: 14px;
  border-bottom: 1px solid #b8c6eb;
}
.public-cover-brand-block { display: grid; gap: 6px; }
.public-cover-brand-row { display: flex; align-items: center; gap: 10px; }
.public-cover-logo { width: 48px; height: 48px; display: inline-grid; place-items: center; }
.public-cover-name { margin: 0; font-size: clamp(28px, 4vw, 50px); line-height: 1; text-transform: lowercase; font-family: var(--font-public-brand); letter-spacing: 0.02em; }
.public-cover-subtitle { margin: 0; max-width: 54ch; font-size: clamp(12px, 1.1vw, 15px); line-height: 1.35; color: #dbe8ff; }
.public-cover-quote-wrap { justify-self: end; width: min(560px, 100%); border-left: 2px solid rgba(226, 232, 240, 0.42); padding-left: 10px; display: grid; gap: 4px; }
.public-cover-quote-label { font-size: 10px; font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase; color: #d5e2fa; }
.public-cover-quote { margin: 0; font-size: clamp(12px, 1.3vw, 18px); color: #eff5ff; line-height: 1.35; font-family: var(--font-public-heading); }

.public-class-strip,.public-stack { padding: 8px 5px; }
.public-stack-flat { padding-top: 10px; }
.public-stack-head { margin-bottom: 8px; border-bottom: 1px solid var(--line); padding-bottom: 6px; }
.public-class-strip-head { display: flex; align-items: end; justify-content: space-between; margin-bottom: 8px; border-bottom: 1px solid var(--line); padding-bottom: 6px; }
.public-class-strip-title,.public-stack-title { margin: 0; font-size: clamp(18px, 3.6vw, 24px); font-family: var(--font-public-heading); color: #1a2a52; }
.public-class-see-all { font-size: 12px; color: var(--primary); text-decoration: none; font-weight: 600; }
.public-class-row { display: grid; grid-auto-flow: column; grid-auto-columns: 148px; gap: 7px; overflow-x: auto; padding-bottom: 3px; }

.public-class-grid,.public-flat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(138px, 1fr)); gap: 7px; }
.class-card { min-width: 0; border: 1px solid var(--line); border-radius: 6px; overflow: hidden; background: #fff; box-shadow: none; }
.class-card-poster-wrap { aspect-ratio: 4 / 5; width: 100%; overflow: hidden; background: #e2e8f0; }
.class-card-poster { width: 100%; height: 100%; object-fit: cover; display: block; }
.class-card-poster-empty { display: grid; place-items: center; color: #475569; font-size: 11px; }
.class-card-name { margin: 0; font-size: 13px; font-weight: 700; line-height: 1.25; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-family: var(--font-public-heading); color: #1f2f56; }
.class-card-meta { margin: 0; font-size: 11px; color: #4f6287; }
.public-card-link { color: inherit; text-decoration: none; display: grid; gap: 3px; padding: 5px; }

.public-class-page { padding-top: 8px; }
.public-stack-subtitle { margin: 2px 0 0; color: #475569; font-size: 12px; }
.public-wide-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 6px; margin-bottom: 8px; }
.public-cta-card { border: 1px solid var(--line); background: #fff; text-decoration: none; color: #0f172a; font-weight: 600; padding: 8px 6px; display: block; border-radius: 6px; }
.public-tab-row {
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
  border-bottom: 1px solid #cbd5e1;
  padding-bottom: 0;
  margin-bottom: 0;
}
.public-tab {
  border: 1px solid #cbd5e1;
  border-bottom: 0;
  background: #f8fafc;
  text-decoration: none;
  color: #334155;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 6px 6px 0 0;
  position: relative;
  top: 1px;
}
.public-tab:hover { background: #f1f5f9; }
.public-tab.is-active {
  background: #fff;
  color: #0f172a;
  border-color: #94a3b8;
  font-weight: 600;
}
.public-content-panel {
  border: 1px solid #cbd5e1;
  border-top: 0;
  padding: 6px 6px 0;
  background: #fff;
}
.public-note-list { margin: 0; padding-left: 16px; }
.public-note-list li { margin-bottom: 8px; }
.public-note-title { margin: 0 0 2px; font-size: 14px; color: #1f2f56; }
.public-note-body :first-child { margin-top: 0; }
.public-note-body :last-child { margin-bottom: 0; }
.public-entry-image-frame { margin: 0 0 6px; width: min(280px, 100%); aspect-ratio: 4 / 3; border: 1px solid var(--line); border-radius: 6px; overflow: hidden; background: #e2e8f0; }
.public-entry-image { width: 100%; height: 100%; object-fit: cover; display: block; }
.public-mcq-options { margin: 6px 0 0; padding: 0; list-style: none; display: grid; gap: 2px; }
.public-mcq-answer-text { margin: 6px 0 0; font-size: 12px; color: #166534; }
.public-admin-panel { border: 1px solid var(--line); border-radius: 6px; background: #fff; padding: 6px; margin-bottom: 8px; }
.public-admin-panel h3 { margin: 0 0 4px; font-size: 13px; color: #1f2f56; }
.public-admin-inline-form { display: grid; gap: 4px; }
.public-admin-inline-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin-top: 6px; }
.public-admin-inline-card { border: 1px solid var(--line); border-radius: 6px; padding: 4px 6px; background: #fff; }
.public-admin-inline-card summary { cursor: pointer; font-size: 12px; color: #1d4ed8; }
.public-admin-inline-card[open] summary { margin-bottom: 4px; }

@media (max-width: 840px) {
  .public-home-cover { grid-template-columns: 1fr; gap: 8px; min-height: 150px; padding: 9px 7px; }
  .public-class-row { grid-auto-columns: 112px; gap: 6px; }
  .public-class-grid,.public-flat-grid { grid-template-columns: repeat(auto-fill, minmax(104px, 1fr)); gap: 6px; }
  .class-card-name { font-size: 12px; }
  .class-card-meta { font-size: 10px; }
  .public-cover-logo { width: 44px; height: 44px; }
  .public-cover-name { font-size: clamp(23px, 10vw, 36px); }
  .public-cover-subtitle { font-size: 12px; max-width: none; }
  .public-cover-quote-wrap { justify-self: start; width: 100%; border-left: 0; padding-left: 0; border-top: 1px solid rgba(226, 232, 240, 0.35); padding-top: 6px; }
  .public-cover-quote-label { font-size: 9px; }
  .public-cover-quote { font-size: clamp(12px, 3.2vw, 14px); }
  .public-card-link { padding: 4px; }
}
`;
