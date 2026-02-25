export const publicHomeStyles = `
.public-home-cover {
  position: relative;
  width: 100%;
  background:
    radial-gradient(circle at 8% 10%, rgba(128, 206, 255, 0.24), transparent 28%),
    radial-gradient(circle at 86% 80%, rgba(127, 244, 207, 0.18), transparent 32%),
    linear-gradient(145deg, #111a3a 0%, #1b2d63 48%, #1c5672 100%);
  color: #f4f8ff;
  min-height: 182px;
  padding: 12px;
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid #cedaf8;
  overflow: hidden;
}

.public-cover-brand-block { display: grid; gap: 7px; }
.public-cover-brand-row { display: flex; align-items: center; gap: 10px; }
.public-cover-logo {
  width: 46px;
  height: 46px;
  display: inline-grid;
  place-items: center;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(221, 237, 255, 0.35);
}
.public-cover-name {
  margin: 0;
  font-size: clamp(28px, 4vw, 48px);
  line-height: 1;
  text-transform: lowercase;
  font-family: var(--font-public-brand);
  letter-spacing: 0.02em;
}
.public-cover-subtitle {
  margin: 0;
  max-width: 58ch;
  font-size: clamp(12px, 1.15vw, 15px);
  line-height: 1.35;
  color: #d8e6ff;
}
.public-cover-pill-row { display: flex; flex-wrap: wrap; gap: 6px; }
.public-cover-pill {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  border: 1px solid rgba(204, 225, 255, 0.38);
  background: rgba(8, 17, 42, 0.38);
  color: #deeeff;
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 700;
}
.public-cover-action-row { display: flex; flex-wrap: wrap; gap: 6px; }
.public-cover-action {
  text-decoration: none;
  color: #eaf2ff;
  border: 1px solid rgba(206, 228, 255, 0.36);
  border-radius: 8px;
  padding: 4px 9px;
  font-size: 12px;
  font-weight: 700;
  background: rgba(9, 20, 49, 0.4);
}
.public-cover-action:hover,
.public-cover-action:focus-visible { border-color: rgba(222, 238, 255, 0.66); background: rgba(12, 31, 74, 0.65); }
.public-cover-action-primary {
  background: linear-gradient(120deg, #4f69ff 0%, #2d8cb2 100%);
  border-color: #7ca5ff;
  color: #fff;
}

.public-cover-side-column { display: grid; gap: 8px; }
.public-cover-quote-wrap {
  width: min(560px, 100%);
  border: 1px solid rgba(194, 217, 255, 0.36);
  border-radius: 10px;
  padding: 8px;
  background: rgba(8, 18, 44, 0.36);
  display: grid;
  gap: 4px;
  position: relative;
  z-index: 1;
}
.public-cover-quote-label { font-size: 10px; font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase; color: #c9dcff; }
.public-cover-quote { margin: 0; font-size: clamp(12px, 1.25vw, 17px); color: #f4f8ff; line-height: 1.35; font-family: var(--font-public-heading); opacity: 0; transform: translateY(6px); transition: opacity 190ms ease, transform 190ms ease; }
.public-cover-quote.is-visible { opacity: 1; transform: translateY(0); }

.public-cover-metric-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px; }
.public-cover-metric-card {
  border-radius: 9px;
  border: 1px solid rgba(198, 222, 255, 0.35);
  background: rgba(8, 18, 43, 0.4);
  padding: 7px;
}
.public-cover-metric-value {
  margin: 0;
  font-size: clamp(17px, 2.2vw, 23px);
  color: #fff;
  font-weight: 700;
  letter-spacing: 0.01em;
}
.public-cover-metric-label { margin: 2px 0 0; font-size: 11px; color: #c7ddff; }

.public-cover-orb {
  position: absolute;
  border-radius: 999px;
  pointer-events: none;
  z-index: 0;
}
.public-cover-orb-left { width: min(190px, 37vw); aspect-ratio: 1; left: -54px; top: -60px; background: radial-gradient(circle, rgba(126, 206, 255, 0.26) 0%, rgba(126, 206, 255, 0) 72%); animation: publicFloatGlow 8s ease-in-out infinite; }
.public-cover-orb-right { width: min(220px, 45vw); aspect-ratio: 1; right: -72px; bottom: -100px; background: radial-gradient(circle, rgba(171, 255, 250, 0.28) 0%, rgba(171, 255, 250, 0) 74%); animation: publicFloatGlow 10s ease-in-out infinite reverse; }

.public-cover-brand-block,
.public-cover-brand-row,
.public-class-strip-head,
.public-class-row,
.public-class-grid,
.public-flat-grid,
.public-cover-side-column { position: relative; z-index: 1; }

.public-class-strip,.public-stack { padding: 8px 5px; }
.public-stack-flat { padding-top: 10px; }
.public-stack-head,.public-class-strip-head { margin-bottom: 8px; border-bottom: 1px solid #d1dbf6; padding-bottom: 6px; }
.public-class-strip-head { display: flex; align-items: end; justify-content: space-between; }
.public-class-strip-title,.public-stack-title { margin: 0; font-size: clamp(18px, 3.6vw, 24px); font-family: var(--font-public-heading); color: #1a2f6d; }
.public-class-see-all { font-size: 12px; color: #2f4ecc; text-decoration: none; font-weight: 700; }
.public-class-row { display: grid; grid-auto-flow: column; grid-auto-columns: 152px; gap: 7px; overflow-x: auto; padding-bottom: 3px; }

.public-class-grid,.public-flat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(138px, 1fr)); gap: 7px; }
.class-card {
  min-width: 0;
  border: 1px solid #d6e2ff;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 8px 20px rgba(24, 44, 101, 0.08);
  transition: transform 210ms ease, box-shadow 220ms ease, border-color 200ms ease;
}
.public-card-link:hover .class-card,
.public-card-link:focus-visible .class-card { transform: translateY(-2px); box-shadow: 0 12px 24px rgba(24, 44, 101, 0.14); border-color: #aac3fa; }
.class-card-poster-wrap { aspect-ratio: 4 / 5; width: 100%; overflow: hidden; background: #e6edf9; }
.class-card-poster { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 270ms ease; }
.public-card-link:hover .class-card-poster,.public-card-link:focus-visible .class-card-poster { transform: scale(1.03); }
.class-card-poster-empty { display: grid; place-items: center; color: #475569; font-size: 11px; }
.class-card-name { margin: 0; font-size: 13px; font-weight: 700; line-height: 1.25; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-family: var(--font-public-heading); color: #1f2f56; }
.class-card-meta { margin: 0; font-size: 11px; color: #4f6287; }
.public-card-link { color: inherit; text-decoration: none; display: grid; gap: 3px; padding: 5px; }

.public-class-page { padding-top: 8px; }
.public-stack-subtitle { margin: 2px 0 0; color: #4a608d; font-size: 12px; }
.public-wide-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 6px; margin-bottom: 8px; }
.public-cta-card { border: 1px solid #d3e1ff; background: #f7f9ff; text-decoration: none; color: #1b2a54; font-weight: 700; padding: 8px 6px; display: block; border-radius: 8px; }
.public-tab-row { display: flex; flex-wrap: nowrap; gap: 0; border-bottom: 1px solid #cfdaf5; padding-bottom: 0; margin-bottom: 0; overflow-x: auto; overflow-y: hidden; touch-action: pan-x; overscroll-behavior-x: contain; }
.public-tab { border: 1px solid #cfdaf5; border-bottom: 0; background: #eef3ff; text-decoration: none; color: #334a8f; font-size: 12px; padding: 6px 10px; border-radius: 8px 8px 0 0; white-space: nowrap; margin-bottom: -1px; font-weight: 700; }
.public-tab:hover { background: #e7f0ff; }
.public-tab.is-active { background: #fff; color: #1f3474; border-color: #a8c0f2; }
.public-content-panel { border: 1px solid #cfdaf5; border-top: 0; padding: 4px 0 0; background: #fff; }
.public-note-list { margin: 0; padding-left: 8px; list-style-position: inside; }
.public-note-list li { margin-bottom: 0; padding: 6px 0; border-bottom: 1px solid #e1e9fb; }
.public-note-list li:last-child { border-bottom: 0; }
.public-note-list li.public-note-empty { list-style: none; padding-left: 0; }
.public-note-list.is-plain { list-style: none; padding-left: 0; }
.public-note-title { margin: 0 0 2px; font-size: 14px; color: #203882; }
.public-note-body :first-child { margin-top: 0; }
.public-note-body :last-child { margin-bottom: 0; }
.public-entry-image-frame { margin: 0 0 6px; width: min(280px, 100%); aspect-ratio: 4 / 3; border: 1px solid #c8d8f8; border-radius: 8px; overflow: hidden; background: #e2e8f0; }
.public-entry-image { width: 100%; height: 100%; object-fit: cover; display: block; }
.public-mcq-options { margin: 6px 0 0; padding: 0; list-style: none; display: grid; gap: 2px; }
.public-mcq-answer-text { margin: 6px 0 0; font-size: 12px; color: #0b8d67; }
.public-admin-panel { border: 1px solid #c9d9f8; border-radius: 8px; background: #fff; padding: 6px; margin-bottom: 8px; }
.public-admin-panel h3 { margin: 0 0 4px; font-size: 13px; color: #1f2f56; }
.public-admin-inline-form { display: grid; gap: 4px; }
.public-admin-inline-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin-top: 6px; }
.public-admin-inline-card { border: 1px solid #d3e0fc; border-radius: 8px; padding: 4px 6px; background: #f9fbff; }
.public-admin-inline-card summary { cursor: pointer; font-size: 12px; color: #324ebb; }
.public-admin-inline-card[open] summary { margin-bottom: 4px; }

@media (max-width: 840px) {
  .public-home-cover { grid-template-columns: 1fr; gap: 8px; min-height: 164px; padding: 9px 7px; }
  .public-class-row { grid-auto-columns: 114px; gap: 6px; }
  .public-class-grid,.public-flat-grid { grid-template-columns: repeat(auto-fill, minmax(104px, 1fr)); gap: 6px; }
  .class-card-name { font-size: 12px; }
  .class-card-meta { font-size: 10px; }
  .public-cover-logo { width: 42px; height: 42px; }
  .public-cover-name { font-size: clamp(23px, 10vw, 36px); }
  .public-cover-subtitle { font-size: 12px; max-width: none; }
  .public-cover-action { padding: 4px 8px; }
  .public-cover-quote-wrap { width: 100%; }
  .public-cover-quote-label { font-size: 9px; }
  .public-cover-quote { font-size: clamp(12px, 3.2vw, 14px); }
  .public-card-link { padding: 4px; }
}

@keyframes publicFloatGlow {
  0%,
  100% { transform: translate3d(0, 0, 0) scale(1); }
  50% { transform: translate3d(0, 8px, 0) scale(1.07); }
}

@media (prefers-reduced-motion: reduce) {
  .public-cover-orb-left,
  .public-cover-orb-right,
  .class-card,
  .class-card-poster,
  .public-cover-quote { animation: none !important; transition: none !important; }
}
`;
