# Platform Structure

The platform is split into frontend, backend, and shared layers with a single worker entry.

- `entry.ts` wires the request lifecycle.
- `frontend/` serves the HTML payloads and client modules.
- `backend/` handles API routing and server-side modules.
- `shared/` hosts cross-layer utilities and types.

## Add a new module

1. Choose the layer (`frontend/modules` or `backend/modules`).
2. Place the module inside the correct tree (user module or platform module).
3. Export a module entry point and register it in the nearest module registry.
4. Keep the module self-contained and pull shared logic from `shared/`.
