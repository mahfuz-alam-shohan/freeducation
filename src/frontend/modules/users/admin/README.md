# Admin Users Module

Admin dashboards and admin-only management flows live here.

## Add a new admin dashboard feature

1. Create a feature file under `dashboard-parts/`.
2. Export a module string and compose it in `dashboard.ts`.
3. Add its view name to `routing/entries/users/admin.ts`.

## Add a new subject for admins

1. Add admin subject routes to `routing/entries/users/admin.ts`.
2. Add the subject UI in `dashboard-parts/` so the admin dashboard can navigate to it.
3. Ensure the view name matches the dashboard component entry.
