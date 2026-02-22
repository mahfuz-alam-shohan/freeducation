export const publicHomeStyles = `
.public-home-cover {
  width: 100%;
  background: linear-gradient(130deg, #253b87 0%, #3d57cc 45%, #1fa36b 100%);
  color: #f8fafc;
  min-height: 220px;
  padding: 14px 10px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  align-items: end;
  gap: 12px;
  border-bottom: 1px solid #b8c6eb;
}
.public-cover-brand-row { display: flex; align-items: center; gap: 10px; }
.public-cover-logo { width: 56px; height: 56px; display: inline-grid; place-items: center; }
.public-cover-name { margin: 0; font-size: clamp(30px, 6vw, 58px); line-height: 1; text-transform: lowercase; font-family: var(--font-public-brand); letter-spacing: 0.03em; }
.public-cover-quote-wrap { justify-self: end; width: min(620px, 100%); border-left: 2px solid rgba(226, 232, 240, 0.45); padding-left: 10px; }
.public-cover-quote { margin: 0; font-size: clamp(13px, 1.5vw, 19px); color: #eff5ff; line-height: 1.35; font-family: var(--font-public-heading); }

.public-class-strip,.public-stack { padding: 10px 6px; }
.public-class-strip-head { display: flex; align-items: end; justify-content: space-between; margin-bottom: 8px; border-bottom: 1px solid var(--line); padding-bottom: 6px; }
.public-class-strip-title,.public-stack-title { margin: 0; font-size: clamp(18px, 3.6vw, 24px); font-family: var(--font-public-heading); color: #1a2a52; }
.public-class-see-all { font-size: 12px; color: var(--primary); text-decoration: none; font-weight: 600; }
.public-class-row { display: grid; grid-auto-flow: column; grid-auto-columns: 160px; gap: 8px; overflow-x: auto; padding-bottom: 3px; }

.public-path-bar { display: flex; align-items: center; gap: 5px; flex-wrap: wrap; padding: 8px 6px 2px; font-size: 11px; color: #475569; }
.public-path-bar a { color: var(--primary); text-decoration: none; font-weight: 600; }
.public-path-current { color: #0f172a; font-weight: 600; }
.public-path-sep { color: #94a3b8; }

.public-class-grid,.public-flat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(155px, 1fr)); gap: 10px; }
.class-card { min-width: 0; border: 1px solid var(--line); border-radius: 8px; overflow: hidden; background: #fff; box-shadow: 0 6px 20px rgba(33, 56, 118, 0.08); }
.class-card-poster-wrap { aspect-ratio: 2 / 3; width: 100%; overflow: hidden; background: #e2e8f0; }
.class-card-poster { width: 100%; height: 100%; object-fit: cover; display: block; }
.class-card-poster-empty { display: grid; place-items: center; color: #475569; font-size: 12px; }
.class-card-name { margin: 0; font-size: 14px; font-weight: 700; line-height: 1.25; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-family: var(--font-public-heading); color: #1f2f56; }
.class-card-meta { margin: 0; font-size: 11px; color: #4f6287; }
.public-card-link { color: inherit; text-decoration: none; display: grid; gap: 4px; padding: 6px; }

.public-class-page { padding-top: 8px; }
.public-stack-subtitle { margin: 2px 0 8px; color: #475569; font-size: 13px; }
.public-wide-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 8px; margin-bottom: 8px; }
.public-cta-card { border: 1px solid var(--line); background: linear-gradient(90deg, #fff 0%, #f5f8ff 100%); text-decoration: none; color: #0f172a; font-weight: 600; padding: 10px 8px; display: block; border-radius: 8px; }
.public-note-list { margin: 0; padding-left: 18px; }
.public-note-list li { margin-bottom: 10px; }
.public-note-title { margin: 0 0 2px; font-size: 15px; color: #1f2f56; }
.public-note-body :first-child { margin-top: 0; }
.public-note-body :last-child { margin-bottom: 0; }
.public-mcq-options { margin: 6px 0 0; padding: 0; list-style: none; display: grid; gap: 3px; }
.public-mcq-answer-text { margin: 6px 0 0; font-size: 12px; color: #166534; }

@media (max-width: 840px) {
  .public-home-cover { grid-template-columns: 1fr; gap: 8px; min-height: 150px; padding: 10px 8px; }
  .public-class-row { grid-auto-columns: 132px; gap: 6px; }
  .public-class-grid,.public-flat-grid { grid-template-columns: repeat(auto-fill, minmax(124px, 1fr)); gap: 8px; }
  .class-card-name { font-size: 13px; }
  .public-cover-logo { width: 50px; height: 50px; }
  .public-cover-name { font-size: clamp(23px, 10vw, 36px); }
  .public-cover-quote-wrap { justify-self: start; width: 100%; border-left: 0; padding-left: 0; border-top: 1px solid rgba(226, 232, 240, 0.35); padding-top: 6px; }
  .public-cover-quote { font-size: clamp(12px, 3.2vw, 14px); }
}
`;
