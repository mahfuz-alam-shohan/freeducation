# freeducation admin architecture

This project follows strict modular boundaries:

- `src/worker.js`: bootstrap + orchestration + global error handling only.
- `src/routes/`: route matching and HTTP response mapping only.
- `src/controllers/`: use-case logic only.
- `src/core/`: shared primitives (auth, validation, parsing, errors, responses).
- `src/db/`: D1 data access and schema lifecycle.
- `src/security/`: password and session cryptography.

## Page-centric frontend structure

Each page has its **own folder** with isolated files:

- `src/ui/pages/<page>/html.js`
- `src/ui/pages/<page>/style.js`
- `src/ui/pages/<page>/script.js`
- `src/ui/pages/<page>/index.js`

Current pages:
- `setup`
- `login`
- `dashboard`
- `users`

`index.js` composes the page from html/style/script and returns final HTML through layout renderers.

## Layout structure

- `src/ui/layout/document.js`: base document template.
- `src/ui/layout/adminLayout.js`: admin shell (header/sidebar/footer).
- `src/ui/config/navigation.js`: admin menu metadata.


## Navigation behavior contract

- Internal page transitions must stay in-app (no full document refresh) by using the shared navigation helpers in `src/ui/layout/document.js`.
- For scripted redirects, prefer `window.__appNavigate('/path')` and only fall back to `location.href` when the helper is unavailable.
- UI updates should be data-driven (fetch + DOM update) rather than forcing page reloads.

## Rules for future contributors

1. Never put multiple pages in one file.
2. Never put page-specific CSS into unrelated page folders.
3. Never put DB queries in route files.
4. Keep mobile-first behavior by default and only enhance at larger breakpoints.
5. Keep schema/table changes fully code-driven.
6. For a small page change, edit only that page folder unless a shared layout contract truly changes.
7. Do not introduce full-page refreshes for internal navigation or routine UI changes.


## UX and motion contract

- The admin brand in the header is an explicit dashboard shortcut (`#adminBrandHome`). Keep the text static and animate only its lighting halo for readability and predictable tap behavior on mobile.
- Sidebar menu reveal should remain intentionally staged (slower menu-item transitions) so mobile users can track context when opening navigation.
- Keep SPA page switches animated by the shared navigation layer in `src/ui/layout/document.js` (view transitions when supported, graceful fallback otherwise).
- Async actions must provide user feedback without blocking the shell: keep inline status text (`.users-msg`) and the shared toast helper (`window.__showAppStatus`) in sync for success/error visibility.
- If you add new async CRUD flows, include three states at minimum: in-progress, success, and failure.
