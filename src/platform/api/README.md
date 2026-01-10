# API Layer

The API layer is built from independent modules that can be mounted without changing other modules.

## Add a new API module

1. Create a new folder in `modules/` with a clear scope name.
2. Export a `createXModule` function that returns an object with `id`, `match`, and `handle`.
3. Add the new module to `modules/index.ts`.
4. Keep module routes and data access inside the module folder.
