export const publicHomeStyles = `
.public-home-cover {
  position: relative;
  width: 100%;
  background:
    radial-gradient(circle at 6% 12%, rgba(255, 242, 167, 0.56), transparent 30%),
    radial-gradient(circle at 88% 6%, rgba(176, 249, 255, 0.5), transparent 28%),
    radial-gradient(circle at 82% 84%, rgba(195, 176, 255, 0.45), transparent 33%),
    linear-gradient(140deg, #54c948 0%, #3eb93f 36%, #2ba84c 58%, #1f965f 100%);
  color: #f8fbff;
  min-height: 170px;
  padding: 10px 12px;
  display: grid;
  grid-template-columns: auto minmax(0, 1.2fr) minmax(0, 1fr);
  align-items: center;
  gap: 14px;
  border-bottom: 1px solid #9db6ef;
  overflow: hidden;
}
.public-cover-brand-block { display: grid; gap: 6px; }
.public-cover-brand-row { display: flex; align-items: center; gap: 10px; }
.public-cover-logo {
  width: 50px;
  height: 50px;
  display: inline-grid;
  place-items: center;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.24);
  box-shadow: 0 14px 34px rgba(16, 28, 73, 0.33);
  backdrop-filter: blur(5px);
}
.public-cover-name { margin: 0; font-size: clamp(28px, 4vw, 52px); line-height: 1; text-transform: lowercase; font-family: var(--font-public-brand); letter-spacing: 0.02em; }
.public-cover-subtitle { margin: 0; max-width: 54ch; font-size: clamp(12px, 1.1vw, 15px); line-height: 1.35; color: #e6efff; }
.public-cover-motion { display: grid; justify-items: center; gap: 8px; align-self: end; margin-bottom: 2px; position: relative; z-index: 1; }
.public-mascot-shell {
  position: relative;
  width: 82px;
  aspect-ratio: 1;
  border-radius: 24px 24px 32px 32px;
  background: linear-gradient(180deg, #88ef62 0%, #67d84e 68%, #4cbc3d 100%);
  border: 2px solid #d7ffd2;
  box-shadow: 0 12px 0 rgba(14, 117, 40, 0.24), 0 16px 26px rgba(6, 56, 21, 0.3);
  animation: mascotBounce 2.8s ease-in-out infinite;
}
.public-mascot-eye { position: absolute; top: 25px; width: 14px; height: 16px; border-radius: 99px; background: #fff; }
.public-mascot-eye::after { content: ""; position: absolute; left: 4px; top: 4px; width: 6px; height: 8px; border-radius: 99px; background: #1f2937; }
.public-mascot-eye-left { left: 20px; }
.public-mascot-eye-right { right: 20px; }
.public-mascot-wing { position: absolute; top: 31px; width: 16px; height: 22px; border-radius: 99px; background: rgba(208, 253, 198, 0.88); }
.public-mascot-wing-left { left: -8px; transform: rotate(-26deg); }
.public-mascot-wing-right { right: -8px; transform: rotate(26deg); }
.public-progress-path { display: flex; align-items: center; gap: 5px; }
.public-progress-node {
  width: 11px;
  height: 11px;
  border-radius: 999px;
  background: rgba(226, 255, 230, 0.62);
  border: 1px solid rgba(255, 255, 255, 0.65);
}
.public-progress-node.is-active {
  background: #fff;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.28);
  animation: mascotPulse 1.8s ease-in-out infinite;
}
.public-cover-quote-wrap {
  justify-self: end;
  width: min(560px, 100%);
  border-left: 2px solid rgba(226, 232, 240, 0.5);
  padding-left: 10px;
  display: grid;
  gap: 4px;
  position: relative;
  z-index: 1;
}
.public-cover-quote-label { font-size: 10px; font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase; color: #d9e7ff; }
.public-cover-quote { margin: 0; font-size: clamp(12px, 1.3vw, 18px); color: #f4f8ff; line-height: 1.35; font-family: var(--font-public-heading); opacity: 0; transform: translateY(6px); transition: opacity 190ms ease, transform 190ms ease; }
.public-cover-quote.is-visible { opacity: 1; transform: translateY(0); }

.public-cover-orb {
  position: absolute;
  border-radius: 999px;
  pointer-events: none;
  z-index: 0;
  filter: blur(1px);
}
.public-cover-orb-left { width: min(190px, 37vw); aspect-ratio: 1; left: -54px; top: -60px; background: radial-gradient(circle, rgba(255, 246, 203, 0.8) 0%, rgba(255, 246, 203, 0) 72%); animation: publicFloatGlow 8s ease-in-out infinite; }
.public-cover-orb-right { width: min(220px, 45vw); aspect-ratio: 1; right: -72px; bottom: -100px; background: radial-gradient(circle, rgba(171, 255, 250, 0.66) 0%, rgba(171, 255, 250, 0) 74%); animation: publicFloatGlow 10s ease-in-out infinite reverse; }

.public-cover-brand-block,
.public-cover-brand-row,
.public-class-strip-head,
.public-class-row,
.public-class-grid,
.public-flat-grid { position: relative; z-index: 1; }

.public-class-strip,.public-stack { padding: 8px 5px; }
.public-stack-flat { padding-top: 10px; }
.public-stack-head,.public-class-strip-head { margin-bottom: 8px; border-bottom: 1px solid #c7d7fb; padding-bottom: 6px; }
.public-class-strip-head { display: flex; align-items: end; justify-content: space-between; }
.public-class-strip-title,.public-stack-title { margin: 0; font-size: clamp(18px, 3.6vw, 24px); font-family: var(--font-public-heading); color: #3c8f34; }
.public-class-see-all { font-size: 12px; color: #4558dc; text-decoration: none; font-weight: 700; }
.public-class-row { display: grid; grid-auto-flow: column; grid-auto-columns: 152px; gap: 7px; overflow-x: auto; padding-bottom: 3px; }

.public-class-grid,.public-flat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(138px, 1fr)); gap: 7px; }
.class-card {
  min-width: 0;
  border: 1px solid #d4efcd;
  border-radius: 12px;
  overflow: hidden;
  background: linear-gradient(180deg, #ffffff 0%, #f9fff5 100%);
  box-shadow: 0 8px 0 #d8eccf, 0 13px 20px rgba(62, 126, 43, 0.14);
  transition: transform 210ms ease, box-shadow 220ms ease, border-color 200ms ease;
}
.public-card-link:hover .class-card,
.public-card-link:focus-visible .class-card { transform: translateY(-3px); box-shadow: 0 10px 0 #c4e6b8, 0 20px 26px rgba(54, 120, 42, 0.18); border-color: #9fd18f; }
.class-card-poster-wrap { aspect-ratio: 4 / 5; width: 100%; overflow: hidden; background: #dde6f8; }
.class-card-poster { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 270ms ease; }
.public-card-link:hover .class-card-poster,.public-card-link:focus-visible .class-card-poster { transform: scale(1.04); }
.class-card-poster-empty { display: grid; place-items: center; color: #475569; font-size: 11px; }
.class-card-name { margin: 0; font-size: 13px; font-weight: 700; line-height: 1.25; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-family: var(--font-public-heading); color: #1f2f56; }
.class-card-meta { margin: 0; font-size: 11px; color: #476147; }
.public-card-link { color: inherit; text-decoration: none; display: grid; gap: 3px; padding: 5px; }

.public-class-page { padding-top: 8px; }
.public-stack-subtitle { margin: 2px 0 0; color: #4a608d; font-size: 12px; }
.public-wide-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 6px; margin-bottom: 8px; }
.public-cta-card { border: 1px solid #c7d8ff; background: linear-gradient(120deg, #f1f4ff 0%, #f3fff9 100%); text-decoration: none; color: #1b2a54; font-weight: 700; padding: 8px 6px; display: block; border-radius: 8px; }
.public-tab-row { display: flex; flex-wrap: nowrap; gap: 0; border-bottom: 1px solid #c7d7fb; padding-bottom: 0; margin-bottom: 0; overflow-x: auto; overflow-y: hidden; touch-action: pan-x; overscroll-behavior-x: contain; }
.public-tab { border: 1px solid #c7d7fb; border-bottom: 0; background: #edf3ff; text-decoration: none; color: #334a8f; font-size: 12px; padding: 6px 10px; border-radius: 8px 8px 0 0; white-space: nowrap; margin-bottom: -1px; font-weight: 700; }
.public-tab:hover { background: #e7f0ff; }
.public-tab.is-active { background: #fff; color: #1f3474; border-color: #a8c0f2; }
.public-content-panel { border: 1px solid #c7d7fb; border-top: 0; padding: 4px 0 0; background: #fff; }
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
  .public-home-cover { grid-template-columns: 1fr; gap: 8px; min-height: 152px; padding: 9px 7px; }
  .public-cover-motion { justify-items: start; margin-bottom: 0; }
  .public-mascot-shell { width: 64px; border-radius: 20px 20px 25px 25px; }
  .public-mascot-eye { top: 18px; }
  .public-mascot-wing { top: 23px; }
  .public-class-row { grid-auto-columns: 114px; gap: 6px; }
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

@keyframes publicFloatGlow {
  0%,
  100% { transform: translate3d(0, 0, 0) scale(1); }
  50% { transform: translate3d(0, 8px, 0) scale(1.07); }
}

@keyframes mascotBounce {
  0%,
  100% { transform: translateY(0) scale(1); }
  40% { transform: translateY(-5px) scale(1.02); }
  70% { transform: translateY(-2px) scale(1); }
}

@keyframes mascotPulse {
  0%,
  100% { transform: scale(1); }
  50% { transform: scale(1.12); }
}

@media (prefers-reduced-motion: reduce) {
  .public-cover-orb-left,
  .public-cover-orb-right,
  .public-mascot-shell,
  .public-progress-node.is-active,
  .class-card,
  .class-card-poster,
  .public-cover-quote { animation: none !important; transition: none !important; }
}
`;
