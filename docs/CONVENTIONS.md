# Freeducation — Conventions

The rulebook. Every rule states **what** and **how it is enforced**.

A rule with no enforcement mechanism is a suggestion, and suggestions decay. If you add
a rule here, add its check. If a rule cannot be checked, either find a way or do not
make it a rule.

Run `pnpm verify` before pushing. CI runs the identical command.

---

## 1. Naming

| Thing | Convention | Example |
|---|---|---|
| Package | `kebab-case`, scoped | `@fe/contracts` |
| Folder | `kebab-case` | `packages/pages/notice-detail/` |
| React component file | `index.tsx` inside a named folder | `variants/table-dense/index.tsx` |
| Component | `PascalCase` | `NoticeTable` |
| Hook | `useCamelCase` | `useLocale` |
| Type / schema | `PascalCase` | `Notice`, `NoticeViewModel` |
| Constant | `SCREAMING_SNAKE_CASE` | `DEFAULT_PAGE_SIZE` |
| Data key | `dot.case`, `entity.action` | `notice.list` |
| Token | `dot.case`, `category.role` | `color.primary`, `space.4` |
| i18n key | `dot.case`, `page.element` | `notice.emptyState` |
| Variant id | `kebab-case`, describes the design | `table-dense`, `hero-split` |
| School slug | `kebab-case` | `rajuk-uttara-model-college` |

**Enforced by:** `tools/verify` checks folder and file names against these patterns;
ESLint `@typescript-eslint/naming-convention` covers identifiers.

Variant ids describe **appearance**, never a school. `table-dense` is right;
`rajuk-style` is wrong — the second school to want it will have nowhere to go.

---

## 2. Files and folders

**R2.1** Every page package contains exactly: `viewModel.ts`, `viewModel.types.ts`,
`index.ts`, `variants/`, `__tests__/contract.test.tsx`.
*Enforced by `tools/verify`.*

**R2.2** Every variant folder contains exactly `index.tsx` and `meta.ts`.
*Enforced by `tools/verify`.*

**R2.3** Every variant on disk is registered in its page's `index.ts`, and every
registered variant exists on disk.
*Enforced by `tools/verify`.*

**R2.4** No file exceeds 300 lines. A longer file is a module that has not been split.
*Enforced by ESLint `max-lines`.*

**R2.5** One exported component per file.
*Enforced by lint.*

**R2.6** `schools/` contains only `.json`. No logic, ever.
*Enforced by `tools/verify`.*

---

## 3. Imports and boundaries

**R3.1** Dependency direction follows the layer graph in ARCHITECTURE §3. Illegal
imports fail lint.
*Enforced by `eslint-plugin-boundaries`.*

**R3.2** `packages/ui` and `packages/sections` may not import `packages/data`, nor call
`fetch`, nor read `process.env`.
*Enforced by import bans + `fe/no-fetch-in-view`.*

**R3.3** Cross-package imports use the package entry point only. No deep paths.
`import { Button } from '@fe/ui'` — not `'@fe/ui/src/button/index.tsx'`.
*Enforced by the `exports` field in `package.json` + `import/no-internal-modules`.*

**R3.4** No circular dependencies.
*Enforced by `import/no-cycle`.*

**R3.5** Nothing imports from `apps/`.
*Enforced by `eslint-plugin-boundaries`.*

---

## 4. Types

**R4.1** `any` is banned. Use `unknown` and narrow.
*Enforced by `@typescript-eslint/no-explicit-any`.*

**R4.2** Type assertions (`as`) are banned outside `packages/data` adapters, where they
must be immediately followed by a Zod parse.
*Enforced by lint rule with a path allow-list.*

**R4.3** Entity types are inferred from Zod schemas, never hand-written in parallel.
*Enforced by `fe/no-duplicate-entity-type`.*

**R4.4** Strict mode everywhere: `strict`, `noUncheckedIndexedAccess`,
`exactOptionalPropertyTypes`.
*Enforced by the shared `tsconfig.base.json`; overriding it in a package fails verify.*

**R4.5** External data is parsed before use. An unparsed API response may not leave
`packages/data`.
*Enforced by review + the adapter test harness.*

---

## 5. Rendering and variants

**R5.1** A variant's props are exactly `{ vm: <Page>ViewModel }`. No extra props.
*Enforced by the contract harness type test.*

**R5.2** Variants do not fetch, do not read config, do not read env, and do not import
other variants.
*Enforced by import bans.*

**R5.3** Every variant renders correctly for every fixture state: empty, minimal,
typical, overflow, single-locale.
*Enforced by the contract harness.*

**R5.4** Every variant passes automated accessibility checks: landmarks, heading order,
labelled controls, contrast.
*Enforced by the contract harness.*

**R5.5** Loading and error states are provided by the page shell, not reinvented per
variant.
*Enforced by review; the shell owns the boundaries.*

---

## 6. Styling

**R6.1** No raw colour values in any component — no hex, `rgb()`, `hsl()`, or named
colours. Use `var(--color-*)`.
*Enforced by `fe/no-raw-color`.*

**R6.2** Spacing, radius, shadow and font size come from tokens.
*Enforced by `fe/no-raw-dimension` (a small allow-list exists for `0`, `1px` borders,
and `100%`).*

**R6.3** Token names are declared in `packages/tokens`. Unknown tokens in a school
override are rejected.
*Enforced by Zod validation of the config against the generated token union.*

**R6.4** Every colour pair meets WCAG AA in both light and dark themes.
*Enforced by a contrast test over the token set.*

**R6.5** Mobile-first. Media queries add complexity upward, never downward.
*Enforced by `fe/no-max-width-query`.*

---

## 7. Language

**R7.1** No user-facing string literal in a component. Use `t('key')`.
*Enforced by `fe/no-bare-string`.*

**R7.2** i18n keys must exist in every supported locale catalogue.
*Enforced by `tools/verify` — a missing translation fails the build.*

**R7.3** Localised content fields are read through `resolveText`, never by property
access.
*Enforced by `fe/use-resolve-text`.*

**R7.4** No layout may assume text length. Bangla runs longer than English and wraps
differently.
*Enforced by the overflow fixture in the contract harness.*

**R7.5** Dates, numbers and currency go through the locale formatter. No manual
formatting.
*Enforced by `fe/no-manual-date-format`.*

---

## 8. Data

**R8.1** All content access goes through `data.get(key, params)`. No direct `fetch` to
the content API outside `packages/data`.
*Enforced by import ban + `fe/no-fetch-in-view`.*

**R8.2** New data needs a new key in the `DataKey` union and a contract schema. Keys are
never constructed dynamically from strings.
*Enforced by the type system.*

**R8.3** API credentials are read only in `packages/data`, only from env, and never
reach the client bundle.
*Enforced by an env-access lint rule + a bundle scan in CI.*

**R8.4** Every list key supports pagination. Unbounded lists are banned.
*Enforced by the `DataSource` interface signature.*

**R8.5** A failed fetch degrades to an empty state with a logged error. It never crashes
a page or shows a stack trace to a parent.
*Enforced by error-boundary tests.*

---

## 9. Configuration

**R9.1** School config is validated at boot. Invalid config refuses to start — no
partial rendering, no silent defaults.
*Enforced by Zod parse in the config loader.*

**R9.2** Every `pageKey` in a menu must exist in the page registry.
*Enforced by `tools/verify`.*

**R9.3** Every variant named in config must be registered for that page.
*Enforced by `tools/verify`.*

**R9.4** Feature flags gate both the route and the menu entry. A disabled feature leaves
no reachable URL.
*Enforced by a routing test.*

**R9.5** No school-specific branching in core. `if (school.slug === ...)` is banned.
*Enforced by `fe/no-tenant-branching`.*

---

## 10. Testing

**R10.1** Every page has a contract test. Adding a page without one fails verify.
*Enforced by `tools/verify`.*

**R10.2** Fixtures live in `packages/testing` and are shared. No inline mock data in
tests.
*Enforced by lint.*

**R10.3** Every contract schema has a parse test against a real captured payload.
*Enforced by `tools/verify`.*

**R10.4** Tests assert behaviour and output, never implementation details.
*Enforced by review.*

---

## 11. Performance

**R11.1** Route JavaScript budget: 100 KB gzipped. Exceeding it fails CI.
**R11.2** Images go through the image pipeline — correct sizes, modern formats, lazy
below the fold.
**R11.3** No blocking third-party script on any public page.
**R11.4** Fonts self-hosted with `font-display: swap` and a Bangla subset.

*Enforced by CI size budgets and a Lighthouse run on representative routes.*

---

## 12. Git

**R12.1** Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`.
*Enforced by commitlint.*

**R12.2** Any change to `packages/contracts` requires a changeset.
*Enforced by CI.*

**R12.3** A breaking contract change requires a major bump and a migration note.
*Enforced by changeset review.*

**R12.4** `pnpm verify` passes before merge. No exceptions, no `--no-verify`.
*Enforced by branch protection.*

---

## 13. Adding things — the checklists

### A new page

1. `packages/pages/<page>/` with the six required files
2. Entity schemas in `contracts`, data keys in `data`
3. `viewModel.ts` — the only fetching code
4. At least two variants, so the variant model stays honest
5. Fixtures for all five states
6. Register the page; add its `pageKey` to the menu vocabulary
7. `pnpm verify`

### A new variant

1. `variants/<variant-id>/` with `index.tsx` and `meta.ts`
2. Props are `{ vm }` and nothing else
3. Register it in the page's `index.ts`
4. Confirm it renders all five fixture states
5. `pnpm verify`

Note what is absent: no data work, no config schema change, no touching other variants.
That is the architecture working.

### A new school

1. `schools/<slug>.json`
2. Identity, locales, theme preset and overrides, variant choices, features, menu
3. `pnpm verify`

Note what is absent: **any code at all.**
