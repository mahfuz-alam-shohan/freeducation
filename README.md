# Freeducation LMS

Freeducation is a lightweight Learning Management System (LMS) built on a Cloudflare Worker. The project serves two audiences:

- **Public (Student) side**: Landing and student-facing experience.
- **Admin side**: Authentication and administration workflows.

This repository keeps the server logic and UI templates together for a fast, server-rendered experience while keeping the front-end split cleanly between public and admin areas.

## Bangla 1st Paper Admin Flow

- Navigate to SSC/HSC groups, open **বাংলা ১ম পত্র** to access Bangla-first-paper topic lists.
- Topics include **বাংলা সাহিত্য** (গদ্য/পদ্য lists with add modal), **সহপাঠ** (নাটক/উপন্যাস name entry), and a placeholder for **নাট্যাংশ**.
- Selecting any গদ্য বা পদ্য item opens the auto-generated **সৃজনশীল** and **বহুনির্বাচনী** views.

## Project Goals

- Keep the repository clean and easy to navigate.
- Maintain clear separation between public and admin experiences.
- Follow security best practices for authentication, headers, and secrets.
- Provide a minimal, fast LMS scaffold for further feature development.
- Offer a settings area with maintenance actions like a reset option.

## Structure

```
src/
  api.ts                 # API routes (auth, classes, fonts)
  auth.ts                # Token + password hashing helpers
  db.ts                  # Database setup helpers
  index.ts               # Worker entrypoint and HTML response
  types.ts               # Cloudflare environment types
  frontend/
    pages.ts             # Front-end route map
    layout.ts            # HTML shell + component injection
    app.ts               # Client-side routing + app state
    admin/               # Admin-only UI modules
      dashboard.ts
      settings.ts
    public/              # Student-facing UI modules
      landing.ts
      auth.ts
    components/
      layout/            # Shared layout primitives (nav, sidebars)
      shared/            # Shared UI primitives
```

## Security Notes

- **JWT secret is required** (`JWT_SECRET`) and must be set in the Cloudflare environment.
- Responses include hardened headers (`X-Content-Type-Options`, `X-Frame-Options`, etc.).
- Passwords are salted + hashed using PBKDF2.

## Local Development

1. Install dependencies (if not already present).
2. Run with Cloudflare Wrangler.

```bash
wrangler dev
```

## Environment Variables

- `JWT_SECRET` (required): Signing key for auth tokens.
- `DB` (required): Cloudflare D1 binding.
- `BUCKET` (required): Cloudflare R2 binding.

## Notes

This repo is intentionally minimal. Build on top of the public/admin separation as the product grows.
The public landing highlights the first 8 subjects for SSC and HSC in the horizontal rows (see `src/frontend/public/landing.ts`).
