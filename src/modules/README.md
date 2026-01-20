# Modules

This folder contains pluggable modules that define subject structure and admin UI behavior. Modules are auto-synced into the database on deploy, so admins do not create them manually.

## Add a new subject module

1. Create a folder for the subject under `src/modules/subjects/<subject-slug>/`.
2. Add a `definition.ts` file that exports a `SubjectTemplate`.
3. Register the template in `src/modules/subjects/registry.ts`.
4. The subject will appear automatically in the admin UI after deploy.

## Database changes

All schema changes are centralized in `src/db/schema.ts` and created automatically by `ensureSchema` in `src/db/manager.ts`.

- **New tables**: add them to `expectedSchema`.
- **New columns**: add columns to the table schema.
- **Migrations**: `ensureSchema` will create missing tables and add missing columns on deploy.

If a column is added or removed, update the matching table schema so Cloudflare deploys can apply it automatically.
