# Backend Modules

Modules are grouped by user types and education platforms, then registered in the module registry.

## Module contract

- `id`: stable identifier.
- `match(path)`: declares which request paths the module handles.
- `handle(request, env)`: returns a response or null.

## Adding a module

1. Create a folder with an `index.ts` that exports `createXModule`.
2. Keep auxiliary helpers inside the same folder.
3. Register the module in `modules/index.ts`.
