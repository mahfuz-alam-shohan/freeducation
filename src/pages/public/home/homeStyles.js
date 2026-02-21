export const publicHomeStyles = `
.public-home-cover { width: 100%; background: linear-gradient(120deg, #1e3a5f, #2d4f7c 55%, #3c6aa1); color: #f8fafc; min-height: 152px; padding: 10px; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); align-items: center; gap: 10px; border-bottom: 1px solid #d7dee8; }
.public-cover-brand-row { display: flex; align-items: center; gap: 10px; }
.public-cover-logo { width: 62px; height: 62px; display: inline-grid; place-items: center; }
.public-cover-name { margin: 0; font-size: clamp(30px, 6vw, 62px); line-height: 1; text-transform: lowercase; font-family: var(--font-public-brand); }
.public-cover-quote-wrap { justify-self: end; width: min(540px, 100%); display: flex; align-items: center; }
.public-cover-quote { margin: 0; font-size: clamp(14px, 1.5vw, 21px); color: #dbeafe; line-height: 1.4; font-family: var(--font-public-heading); }
.public-class-strip,.public-stack { padding: 8px 6px; }
.public-class-strip-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
.public-class-strip-title,.public-stack-title { margin: 0; font-size: 20px; font-family: var(--font-public-heading); }
.public-class-row { display: grid; grid-auto-flow: column; grid-auto-columns: 136px; gap: 6px; overflow-x: auto; padding-bottom: 2px; }
.public-path-bar { display: flex; align-items: center; gap: 4px; flex-wrap: wrap; padding: 4px 6px 0; font-size: 11px; color: #475569; }
.public-path-bar a { color: #1f3a5f; text-decoration: none; }
.public-path-current { color: #0f172a; font-weight: 600; }
.public-path-sep { color: #94a3b8; }
.public-class-grid,.public-flat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(136px, 1fr)); gap: 8px; }
.class-card { display: grid; gap: 2px; min-width: 0; }
.class-card-poster-wrap { aspect-ratio: 2 / 3; width: 100%; overflow: hidden; background: #e2e8f0; border-radius: 4px; }
.class-card-poster { width: 100%; height: 100%; object-fit: cover; display: block; }
.class-card-poster-empty { display: grid; place-items: center; color: #475569; font-size: 12px; }
.class-card-name { margin: 0; font-size: 15px; font-weight: 600; line-height: 1.25; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-family: var(--font-public-heading); }
.class-card-meta { margin: 0; font-size: 11px; color: #475569; }
.public-class-page { padding-top: 8px; }
.public-stack-subtitle { margin: 2px 0 8px; color: #475569; font-size: 13px; }
.public-card-link { color: inherit; text-decoration: none; display: grid; gap: 3px; }
.public-wide-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 6px; margin-bottom: 8px; }
.public-cta-card { border: 1px solid var(--line); background: #fff; text-decoration: none; color: #0f172a; font-weight: 600; padding: 8px; display: block; border-radius: 4px; }
.public-note-list { margin: 0; padding-left: 18px; }
.public-note-list li { margin-bottom: 6px; }
.public-note-title { margin: 0 0 2px; font-size: 15px; }
.public-note-body :first-child { margin-top: 0; }
.public-note-body :last-child { margin-bottom: 0; }

@media (max-width: 840px) {
  .public-home-cover { grid-template-columns: 1fr; gap: 6px; min-height: 124px; padding: 8px; text-align: center; }
  .public-class-row { grid-auto-columns: 116px; gap: 5px; }
  .public-class-grid,.public-flat-grid { grid-template-columns: repeat(auto-fill, minmax(112px, 1fr)); gap: 6px; }
  .class-card-name { font-size: 13px; }
  .public-path-bar { padding: 4px 6px 2px; }
  .public-cover-brand-row { justify-content: center; gap: 6px; }
  .public-cover-logo { width: 52px; height: 52px; }
  .public-cover-name { font-size: clamp(24px, 10vw, 38px); }
  .public-cover-quote-wrap { justify-self: center; width: min(100%, 620px); }
  .public-cover-quote { font-size: clamp(12px, 3.2vw, 14px); }
}
`;
