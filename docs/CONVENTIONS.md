# Conventions

Every rule names what enforces it. A rule with no mechanism is a suggestion, and
suggestions decay — if you add a rule, add its check.

Run `npm run verify` before pushing. CI runs the identical command. It is:
`structure check → lint → typecheck → tests`.

---

## Naming

| Thing | Convention | Example |
|---|---|---|
| Folder | kebab-case | `src/views/notice-list/` |
| Variant file | kebab-case, describes the **design** | `table-dense.astro` |
| Component | PascalCase | `SiteHeader` |
| Type / schema | PascalCase | `Notice`, `NoticeListViewModel` |
| Data key | `entity.action` | `notice.list` |
| Token | `category.role` | `color.primary`, `space.4` |
| i18n key | `page.element` | `notice.empty` |
| School slug | kebab-case, matches filename | `riverside` |
| CSS class | `fe-` prefixed | `fe-cards` |

Variant names describe appearance, never a school. `table-dense` is right;
`rajuk-style` is wrong — the second school that wants it has nowhere to go.

*Enforced by:* `tools/verify` (slug matches filename), review for the rest.

---

## Structure

**S1** Every view folder has `viewModel.ts`, `index.ts` and `variants/` with at least one
variant. → `tools/verify`

**S2** Every variant on disk is registered in `index.ts`, and every registered variant
exists on disk. → `tools/verify`

**S3** `defaultVariant` names a registered variant. → `tools/verify`

**S4** Every view folder appears in `src/views/registry.ts`. → `tools/verify`

**S5** `schools/` contains only `.json`. → `tools/verify`

**S6** No file over 300 lines (400 for `.astro`, whose scoped styles are legitimately
long). → ESLint `max-lines`

---

## Boundaries

**B1** `src/ui` may not import `data`, `config` or `views`. → `import/no-restricted-paths`

**B2** `src/sections` may not import `data` or `views`. → same

**B3** `src/views/*/variants` may not import `data` or `config`. A variant renders its
view-model and nothing else. → same

**B4** `contracts` and `tokens` are leaves — they import nothing from the app. → same

**B5** Nothing imports `src/pages`. → same

**B6** No import cycles. → `import/no-cycle`

---

## Types

**T1** No `any`. → `@typescript-eslint/no-explicit-any`

**T2** Entity types are inferred from Zod schemas, never written twice. → review

**T3** `strict` plus `noUncheckedIndexedAccess`. → `tsconfig.json`, checked by
`astro check`

**T4** Nothing unvalidated leaves `src/data`. → Zod parse in `createClient`

---

## Views and variants

**V1** A variant's props are exactly `{ vm, locale, t }`. No variant-specific prop, no
variant-specific config. → the contract harness

**V2** Variants do not fetch, do not read config, do not read env. → B3

**V3** Every variant renders correctly when the data is typical, empty, or single-locale.
→ the contract harness renders all three for every variant

**V4** An empty state says something. Never a blank page. → asserted by the harness

**V5** Variants are registered as lazy loaders so each is its own chunk. → `tools/verify`
matches the `() => import(...)` form

**V6** A route reaches a controller through `src/views/controllers.ts`, never through a
view's `index.ts`. Importing `index.ts` from a route would pull every variant's CSS into
the page. → review; the build is checked by comparing rendered output between schools

---

## Styling

**C1** No raw colour in a component — use `var(--fe-color-*)`. → `fe/no-raw-color`
(`src/tokens` is the one exemption, since that is where colours are declared)

**C2** Token names live in `src/tokens`. A school override naming an unknown token is
rejected. → Zod `superRefine`, tested

**C3** Mobile first: media queries add complexity upward. → review

**C4** Wide content (tables, routines) scrolls inside its own container; the page body
never scrolls sideways. → review

**C5** **No pill-shaped labels, no highlighted text tablets.** Filled rounded badges
around words — the "chip" look — read as cheap and generic. Signal importance with
weight, colour, letter-spacing, a rule, or position instead. Fully rounded corners belong
to avatars and to real buttons, nothing else. → review, and it is a hard rule: prefer
editorial typography over decoration.

**C6** No gradient text, no glow, no drop shadows on type, no emoji standing in for
icons, no unnecessary animation. This is an institution's website: it should read as
considered and calm, closer to a well-set printed prospectus than to a product landing
page. → review

**C7** Spacing, radius and type sizes come from tokens. → review; `fe/no-raw-color`
covers colour, and a dimension rule is deliberately not enforced because borders and
100% widths make it noisy

---

## Language

**L1** No user-facing string literal in a component, including in `aria-label`, `title`,
`alt` and `placeholder` — use `t('key')`. → `fe/no-bare-string`

**L2** Every i18n key exists in every locale catalogue. → `tools/verify`

**L3** Localised content is read through `resolveText`, never `.bn` / `.en`.
→ `no-restricted-syntax` (the i18n module itself is the one exemption)

**L4** No layout assumes text length — Bangla runs longer than English. → the
single-locale and typical harness states

**L5** Dates and numbers go through the locale formatters in `src/i18n`.
→ `no-restricted-syntax` bans `toLocaleDateString` and friends

---

## Data

**D1** All content access goes through `client.get(key, params)`. → B1–B3

**D2** New content means a new key in `DataKey` plus a schema. Keys are never built from
strings at runtime. → the type system

**D3** `CONTENT_API_KEY` is read only in `src/data` and the route that configures it.
Presentation code cannot touch `import.meta.env` or `process.env` at all.
→ `no-restricted-syntax` and `no-restricted-properties` on `ui`, `sections` and `views`

**D4** Every list key is paginated. → the `DataKey` params schemas

**D5** A malformed payload throws in development and degrades to an empty state in
production. → tested in `src/data/source.test.ts`

---

## Configuration

**G1** Invalid school config throws at boot — no silent defaults. → Zod in `loadSchool`

**G2** Every variant named in a school config exists for that view. → `tools/verify`

**G3** No school-specific branching in code. `if (school.slug === …)` is banned.
→ `no-restricted-syntax`

---

## Git

**W1** Conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`.

**W2** `npm run verify` passes before merge.

---

## Checklists

### Adding a design variant

1. `src/views/<view>/variants/<name>.astro`, props `{ vm, locale, t }`
2. Register the lazy loader in `index.ts`
3. `npm run verify` — the harness renders it in all three states

No data work. No config schema change. No other variant touched.

### Adding a view

1. `src/views/<view>/` with `viewModel.ts`, `index.ts`, `variants/`
2. Schemas in `contracts`, keys in `data/keys.ts` if new content is needed, plus an
   endpoint in `data/adapters/http.ts`, fixture data, and an entry in `emptyFallback`
3. At least one variant; two if the design is likely to vary
4. Register it in `registry.ts`, in `controllers.ts`, and in `ViewType`
5. Add its params to `routeParams` in the harness, and a query to `routeQuery` if the
   view reads the URL
6. `npm run verify`

### Adding a school

1. `schools/<slug>.json` — slug must match the filename
2. `npm run verify`

Note what is absent: **any code at all.**
