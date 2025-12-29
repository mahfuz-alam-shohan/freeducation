# Target Architecture & Service Boundaries

## Overview
The target platform is a Cloudflare-first architecture optimized for read-heavy, peak-exam traffic. The primary execution runtime is **Cloudflare Workers**, backed by **Cloudflare D1** for relational data, **Cloudflare R2** for binary assets (PDFs, ebooks, notes), and edge caching via **Cache API** and **CDN cache rules**.

Key goals:
- Serve static and semi-static educational content at the edge with minimal origin hits.
- Keep assessment and user data consistent and low-latency for authenticated experiences.
- Isolate analytics ingestion from user-facing latency paths.

## Runtime & Infrastructure

### Cloudflare Workers
- **API Gateway & Composition**: Workers will route and compose requests across services (content, assessment, user, analytics).
- **Edge Auth**: JWT validation, session lookups, and rate limiting performed at the edge.
- **Cache API**: Used for aggressive caching of read-heavy endpoints.

### D1 (SQLite)
- **Structured data**: Users, assessments, metadata, access control, and content catalog.
- **Transactional integrity** for assessment submissions and user preferences.
- **Partitioning by service** via logical schemas and separate D1 databases if required by scale or access isolation.

### R2
- **Binary assets**: PDFs, ebooks, notes, attachments, and static exports.
- **Public access via signed URLs** for restricted materials.
- **Origin for Workers** with cache layering at Cloudflare edge.

### Cache Strategy
- **Edge-first**: Cache at Cloudflare edge for public content, category pages, and content metadata.
- **Stale-while-revalidate** for high traffic endpoints to reduce origin load during peak traffic.
- **Tiered cache**: Cache API at Worker level + CDN cache for static assets.
- **Cache busting**: Use versioned paths or query param invalidation for updated assets.

## Performance Goals

### Peak Exam Traffic
- **Target concurrency**: Handle bursty peak loads (e.g., 50–100x baseline traffic) without degradation.
- **Latency objectives**:
  - **Public content pages**: p95 < 150ms at edge (cached).
  - **Authenticated reads**: p95 < 250ms (edge + D1).
  - **Assessment submissions**: p95 < 400ms (D1 write path).
- **Availability**: 99.9% during exam windows.

### Read-heavy Endpoints
- **Cache hit rate**: >90% for content and metadata endpoints.
- **R2 hot object latency**: p95 < 100ms at edge for cached assets.
- **D1 read efficiency**: Target <5ms average query time for catalog lookups and metadata.

## Service Boundaries & Data Ownership

### 1) Content Service
**Responsibilities**:
- Catalog of resources (titles, subjects, grades, tags)
- Content discovery, search, and metadata
- Delivery of PDFs/ebooks/notes via R2

**Data ownership**:
- **D1 tables**: `content_items`, `content_tags`, `content_categories`, `content_versions`
- **R2 buckets**: `content-assets`

**Interfaces**:
- `GET /content` (list)
- `GET /content/:id` (metadata)
- `GET /content/:id/download` (signed URL)

### 2) Assessment Service
**Responsibilities**:
- Exam preparation quizzes, practice tests
- Question banks and answer keys
- Submission grading and feedback

**Data ownership**:
- **D1 tables**: `assessments`, `questions`, `choices`, `submissions`, `submission_answers`

**Interfaces**:
- `GET /assessments` (list)
- `GET /assessments/:id` (details)
- `POST /assessments/:id/submit` (grading)

### 3) User Service
**Responsibilities**:
- Accounts, roles, access control
- Saved content, progress tracking
- Subscription or entitlement checks (if applicable)

**Data ownership**:
- **D1 tables**: `users`, `sessions`, `user_roles`, `user_content_saves`, `user_progress`

**Interfaces**:
- `POST /auth/login`
- `POST /auth/logout`
- `GET /users/me`
- `GET /users/me/saved`

### 4) Analytics Service
**Responsibilities**:
- Event ingestion (views, downloads, assessment starts/completions)
- Aggregated reporting and dashboards
- Usage and performance monitoring

**Data ownership**:
- **D1 tables**: `events`, `aggregates_daily`
- **R2**: raw event exports (optional)

**Interfaces**:
- `POST /analytics/event` (fire-and-forget, batched)
- `GET /analytics/summary` (admin only)

## Data Access & Isolation
- **Content & Assessment** services are read-heavy and optimized for caching.
- **User** service is privacy-sensitive and requires strict access control at the edge.
- **Analytics** uses asynchronous ingestion to avoid impacting user-facing latency.

## Request Flow (High Level)
1. Client requests content/assessment endpoint.
2. Worker checks edge cache / Cache API.
3. On cache miss, Worker queries D1 or fetches from R2.
4. Response stored in cache with SWR headers.
5. Analytics events sent asynchronously to avoid blocking responses.

## Operational Notes
- **Rate limiting** applied at edge to protect D1 and R2.
- **Observability** via Cloudflare logs + custom analytics events.
- **Backup/Recovery**: Scheduled D1 exports to R2.

