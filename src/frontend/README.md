# Frontend Layer

The frontend is assembled from modular bundles grouped by user roles and platform criteria.

## Add a new frontend module

1. Choose `modules/users` or `modules/platforms`.
2. Add a folder with a clear, role-oriented or platform-oriented name.
3. Export script or markup bundles and compose them in `layout.ts` or `app.ts`.
4. Keep reusable UI in `shared`.
