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

## Rules for future contributors

1. Never put multiple pages in one file.
2. Never put page-specific CSS into unrelated page folders.
3. Never put DB queries in route files.
4. Keep mobile-first behavior by default and only enhance at larger breakpoints.
5. Keep schema/table changes fully code-driven.
6. For a small page change, edit only that page folder unless a shared layout contract truly changes.
