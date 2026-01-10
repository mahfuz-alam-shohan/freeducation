# Teacher Users Module

Teacher-facing dashboards and tools live here.

## Add a new teacher dashboard feature

1. Create a feature module in this folder.
2. Export the module string and compose it in `dashboard.ts`.
3. Register teacher-only routes in `routing/entries/users/teacher.ts`.

## Add a new subject for teachers

1. Add the subject routes to `routing/entries/users/teacher.ts`.
2. Add the subject UI module under `modules/users/teacher/`.
3. Make sure the view names match the teacher dashboard navigation targets.
