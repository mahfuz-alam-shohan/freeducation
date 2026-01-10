# Database Registry

Database tables and columns are registered close to the feature that owns them.

## Add a new table or column

1. Create or update the schema file beside your feature.
2. Import `registerTableSchema` from `shared/db/schema` and register the table definition.
3. Ensure the feature module imports its schema file so registration runs automatically.

`initDatabase` reads the registry and creates or extends tables without manual edits in a central list.
