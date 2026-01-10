# Student Users Module

Student-facing dashboards and learning flows live here.

## Add a new student dashboard feature

1. Create a feature module in this folder.
2. Export the module string and compose it in `dashboard.ts`.
3. Register student-only routes in `routing/entries/users/student.ts`.

## Add a new subject for students

1. Add student subject routes to `routing/entries/users/student.ts`.
2. Add the subject UI module under `modules/users/student/`.
3. Align view names with student dashboard navigation targets.
