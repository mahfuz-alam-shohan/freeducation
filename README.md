# Freeducation

## Database updates

The application manages the Cloudflare D1 schema automatically at runtime. Do not create tables or columns manually.

When you deploy updates (for example by merging to GitHub and allowing Cloudflare to auto-deploy), the app will:

- Create any missing tables and columns.
- Remove unused tables or columns that are no longer defined by the code.

If something is missing, update the schema definitions in `src/admin/db.ts` and redeploy. The app will reconcile the
schema on the next request.
