export const publicHomeStyles = `
.public-home-cover { width: 100%; background: linear-gradient(120deg, #0f3ea8, #2563eb 52%, #3b82f6); color: #eff6ff; min-height: 184px; padding: 16px; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); align-items: center; gap: 14px; }
.public-cover-brand-row { display: flex; align-items: center; gap: 12px; }
.public-cover-logo { width: 74px; height: 74px; display: inline-grid; place-items: center; }
.public-cover-name { margin: 0; font-size: clamp(34px, 6.7vw, 72px); line-height: 1; text-transform: lowercase; font-family: var(--font-public-brand); }
.public-cover-quote-wrap { justify-self: end; width: min(560px, 100%); display: flex; align-items: center; }
.public-cover-quote { margin: 0; font-size: clamp(15px, 1.7vw, 24px); color: #dbeafe; line-height: 1.35; font-family: var(--font-public-heading); }
.public-class-strip { padding: 10px 8px 12px; }
.public-class-strip-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
.public-class-strip-title { margin: 0; font-size: 20px; font-family: var(--font-public-heading); }
.public-class-row { display: grid; grid-auto-flow: column; grid-auto-columns: 148px; gap: 8px; overflow-x: auto; padding-bottom: 4px; }
.public-class-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(148px, 1fr)); gap: 10px; }
.class-card { display: grid; gap: 3px; min-width: 0; color: inherit; text-decoration: none; }
.class-card-poster-wrap { aspect-ratio: 2 / 3; width: 100%; overflow: hidden; background: #e2e8f0; }
.class-card-poster { width: 100%; height: 100%; object-fit: cover; display: block; }
.class-card-poster-empty { display: grid; place-items: center; color: #475569; font-size: 12px; }
.class-card-name { margin: 0; font-size: 16px; font-weight: 600; line-height: 1.25; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-family: var(--font-public-heading); }
.class-card-meta { margin: 0; font-size: 12px; color: #475569; }
.public-class-page { padding-top: 12px; }
.public-node-heading { margin: 8px 0; }
.public-flat-table th, .public-flat-table td { text-align: left; }
.public-big-actions { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 8px; margin-top: 10px; }
.public-big-action { display: block; border: 1px solid #cbd5e1; padding: 14px 10px; text-align: center; text-decoration: none; color: #0f172a; background: #fff; font-weight: 600; }
.public-note-list { display: grid; gap: 8px; }
.public-note-item h3 { margin: 0 0 4px; font-size: 16px; }
.public-note-item p { margin: 0 0 4px; }

@media (max-width: 840px) {
  .public-home-cover { grid-template-columns: 1fr; gap: 8px; min-height: 148px; padding: 12px 10px; text-align: center; }
  .public-cover-brand-row { justify-content: center; gap: 8px; }
  .public-cover-logo { width: 56px; height: 56px; }
  .public-cover-name { font-size: clamp(28px, 11vw, 40px); }
  .public-cover-quote-wrap { justify-self: center; width: min(100%, 620px); }
  .public-cover-quote { font-size: clamp(12px, 3.4vw, 15px); }
}
`;
