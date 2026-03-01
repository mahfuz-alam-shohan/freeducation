# freeducation platform architecture

This project follows strict modular boundaries:

- `src/app/worker.js`: bootstrap, orchestration, and global error handling only.
- `src/app/routes/`: route matching and HTTP response mapping only.
- `src/features/`: feature-level use-case logic.
- `src/shared/`: shared auth/http/security/validation primitives.
- `src/infrastructure/db/`: D1 repositories and schema lifecycle.
- `src/presentation/`: layout, navigation metadata, and page renderers.
- `src/config/index.js`: app constants and schema definitions.

## User and role model

- Use role-neutral naming (`user`) for shared identity/session flows.
- Roles (`Administrator`, `Teacher`, `Student`) are authorization labels, not separate identity models.
- Keep shared logic centralized: profile, password, avatar, session, and authentication flows must stay role-agnostic.
- Treat `/admin/*` and `/api/admin/*` paths as compatibility namespaces only; core modules should remain role-neutral.

## Page-centric frontend structure

Each page has its own folder with isolated files and optional subfolders:

- `src/presentation/pages/<page>/html.js`
- `src/presentation/pages/<page>/style.js`
- `src/presentation/pages/<page>/script.js`
- `src/presentation/pages/<page>/index.js`
- `src/presentation/pages/<page>/components/*` for HTML section composition
- `src/presentation/pages/<page>/style/*` for segmented CSS blocks
- `src/presentation/pages/<page>/script/*` for segmented client logic blocks

`index.js` composes the page from html/style/script and returns final HTML through layout renderers. `html.js`, `style.js`, and `script.js` should remain thin composition files.

## Layout structure

- `src/presentation/layout/document.js`: base document template.
- `src/presentation/layout/document/boot/*`: split SPA/navigation runtime blocks.
- `src/presentation/layout/appShell/index.js`: app shell renderer.
- `src/presentation/layout/appShell/baseStyle.js`: shell CSS.
- `src/presentation/layout/appShell/clientScript.js`: shell client behavior.
- `src/presentation/layout/appShell/components/*`: header/sidebar/avatar/profile panel fragments.
- `src/presentation/layout/appShell/style/*`: shell CSS segments.
- `src/presentation/layout/appShell/client/*`: shell client behavior segments.
- `src/presentation/layout/appShell/icons.js`: shell icon SVG constants.
- `src/presentation/layout/appShell/navigation.js`: shell nav rendering helpers.
- `src/presentation/config/navigation.js`: menu metadata.

### Layout contract

- `appShell` owns page width and grid behavior.
- Page root containers must not define their own global width constraints (`max-width`, `margin: 0 auto`, `width: min(...)`).
- On desktop, sidebar/content/footer placement is defined in shell media rules; pages should not override shell columns.

## Route orchestration

- `src/app/routes/publicRoutes.js`: public pages and login/social endpoints.
- `src/app/routes/workspaceRoutes.js`: centralized authenticated role routing for Administrator, Teacher, and Student.
- `src/app/routes/workspace/*`: layered workspace route modules (portal detection, shared role routes, admin-only handlers).
- `workspaceRoutes` owns both modern neutral API aliases (`/api/workspace/*`) and legacy compatibility aliases (`/api/admin/*`).

## Navigation behavior contract

- Internal page transitions stay in-app by using helpers from `src/presentation/layout/document.js`.
- For scripted redirects, prefer `window.__appNavigate('/path')` and only fall back to `location.href` if unavailable.
- UI updates should be data-driven (fetch + DOM updates) rather than full reloads.

## Global SPA script safety contract

- All page scripts are executed through `runPageScript` in `src/presentation/layout/document.js`.
- The shared executor isolates page-level declarations and handles errors without breaking shell interactions.
- Page script failures are recoverable: navigation/profile/logout must remain usable.

## Rules for future contributors

1. Never put multiple pages in one file.
2. Never put page-specific CSS into unrelated page folders.
3. Never put DB queries in route files.
4. Keep mobile-first behavior by default and only enhance at larger breakpoints.
5. Keep schema/table changes fully code-driven.
6. For a small page change, edit only that page folder unless a shared layout contract changes.
7. Do not introduce full-page refreshes for internal navigation or routine UI changes.

## SPA regression checklist (required before merge)

- Revisit each workspace page at least twice in the same session (Dashboard -> Users -> Dashboard -> Users).
- Ensure every page script is safely re-runnable in SPA mode (IIFE or equivalent scoping guard).
- Validate profile menu behavior on mobile-width viewports for every role portal.
- For table/data pages, verify loading state, success state, and failure state after in-app navigation.
- If a page fetch fails, render an inline fallback and keep shell interactions responsive.
