# API Modules

Each module owns a feature slice and registers itself through the module registry.

## Module contract

- `id`: stable identifier.
- `match(path)`: declares which request paths the module handles.
- `handle(request, env)`: returns a response or null.

## Adding a module

1. Create a folder with an `index.ts` that exports `createXModule`.
2. Keep auxiliary helpers inside the same folder.
3. Update `modules/index.ts` to register the module.
