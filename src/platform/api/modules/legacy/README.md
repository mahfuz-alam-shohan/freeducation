# Legacy API Module

This module keeps existing routes grouped together until they are migrated into new modules.

## Extending legacy routes

1. Add a new route file in this folder.
2. Export a single handler function from the new file.
3. Add the file to the module list in `index.ts`.
