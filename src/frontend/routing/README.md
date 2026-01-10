# Frontend Routing Registry

Routing is organized by user roles and public views to keep each dashboard easy to extend.

## Structure

- `entries/public/` contains public-facing routes like landing pages and subject browse flows.
- `entries/users/admin.ts` contains admin dashboard and admin subject management routes.
- `entries/users/student.ts` contains student-only dashboard routes.
- `entries/users/teacher.ts` contains teacher-only dashboard routes.
- `entries/users/admin-aliases.ts` contains admin-only alias routes.
- `routes.ts` composes the registry and exposes matching helpers.

## Add a new user role

1. Create a new file in `entries/users/` (for example `guardian.ts`).
2. Export a route list named `<role>Routes`.
3. Register the new list in `routes.ts` so matching and view-to-path mapping stay consistent.
4. Add the role dashboard UI module under `modules/users/<role>/` and wire it into `layout.ts`.

## Add a new subject route

1. Add subject routes to the relevant role list (`admin.ts`, `student.ts`, or `teacher.ts`).
2. Keep view names aligned with the dashboard components that will render the subject views.
3. Use the same view names in the dashboard modules so role dashboards can navigate to the subject.
