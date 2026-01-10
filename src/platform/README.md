# Platform Structure

This directory contains the worker entry, API modules, frontend modules, and shared services.

## Add a new module

1. Create a folder inside `api/modules` or `frontend/modules` that matches the feature scope.
2. Export a module entry point (`index.ts` for API modules, component bundles for frontend).
3. Register the module in the nearest module registry file.
4. Keep the module self-contained and only use shared utilities from `shared`.
