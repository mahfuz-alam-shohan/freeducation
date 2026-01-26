# FreeEducation Backend

This backend runs on Cloudflare Workers with D1.

## Quick start

- Dev: `npm run dev`
- Deploy: `npm run deploy`

## Admin setup

Create the first admin (once):

```
POST /api/v1/admin/bootstrap
Body: { "email": "...", "password": "...", "firstName": "...", "lastName": "..." }
```

Then sign in:

```
POST /api/v1/admin/login
```

The admin dashboard is served at:

```
GET /admin
```

Bootstrap availability:

```
GET /api/v1/admin/bootstrap/status
```

## User management endpoints

- `GET /api/v1/users`
- `POST /api/v1/users`
- `GET /api/v1/users/:id`
- `PATCH /api/v1/users/:id`

## Maintenance

Reconcile schema (drops unknown tables, adds missing columns, rebuilds conflicting tables):

```
POST /api/v1/admin/maintenance/reconcile
```
