# Backend Layer

The backend layer is organized by user modules and platform modules.

## Add a new backend module

1. Choose the correct tree in `modules/` (`users/` or `education/`).
2. Create a folder with a clear scope name.
3. Export a `createXModule` function that returns `id`, `match`, and `handle`.
4. Register the module in `modules/index.ts`.
