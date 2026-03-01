# UI Stability and Backend Compatibility Guide

This project uses HTML page swaps with `window.__appNavigate()` (client-side navigation). Stability depends on strict lifecycle handling.

## 1) Always clean up page listeners and async work

- Every page script must support teardown.
- Register cleanup callbacks with `window.__registerCleanup(() => { ... })`.
- Use one `AbortController` per page script and pass `signal` to:
  - `addEventListener(..., { signal })`
  - `fetch(..., { signal })`
- Never attach global listeners without cleanup (`document`, `window`, `matchMedia`).

Why: page HTML is replaced frequently; without cleanup old handlers keep running and eventually break interactions.

## 2) Required loading behavior (no flicker)

- Keep stable layout heights while data loads.
- Use local loading states (`.is-loading`) for each screen/card/table.
- Prefer skeleton placeholders over abrupt content jumps.
- Avoid large enter animations during navigation.
- During route navigation, rely on `app-navigating` and avoid extra transforms that cause visual flash.

## 2.1) Layout contract (mandatory)

- All page roots must fill shell width. Do not set top-level page wrappers to:
  - `max-width`
  - `margin: 0 auto`
  - `width: min(...)`
- Width is controlled by the shell only (`.app-content` and desktop grid rules).
- If you need smaller visual blocks, constrain inner components, not page roots.
- Run `node tools/layout-contract-check.mjs` before merge; it fails on page-root width rule violations.

## 3) Page script rules

- Wrap each page script in an IIFE.
- Validate required elements first; return early if missing.
- Use defensive JSON handling and network error messages.
- Ignore `AbortError` in catch blocks.

## 4) Backend compatibility rules

There is no manual DB migration path in production. Schema changes must be code-driven.

- Update schema definitions in `src/config/index.js` (`PLATFORM_SCHEMA`).
- Keep `ensureSchema()` and auto-alignment logic as source of truth.
- New columns/tables must be backward-safe:
  - nullable or sensible defaults
  - backfill in `applyColumnBackfill()` when needed
- Do not assume manual SQL changes can be run later.

## 5) Pre-merge checklist for devs

1. Navigate repeatedly between dashboard/users/login on mobile and desktop.
2. Verify profile menu opens/closes after many route changes.
3. Confirm no duplicate actions fire (single click -> single action).
4. Validate loading states show before data resolves.
5. Validate schema updates are included for any new data fields.
6. Confirm cloud deploy can run without manual migration steps.

## 6) UI content style policy

- Keep content flat and readable.
- Avoid unnecessary padding and visual clutter.
- Prioritize clarity and reliability over decorative design.
