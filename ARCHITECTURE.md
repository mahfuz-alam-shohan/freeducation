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

### Governance & Safety
- **Edge rate limiting (Workers)**:
  - **Buckets**: per-IP, per-user, and per-org limits enforced at the edge for every request; limits are additive and the strictest bucket wins.
  - **Anonymous vs authenticated**: anonymous traffic is constrained to lower per-IP thresholds and reduced burst capacity; authenticated traffic uses per-user + per-org buckets with higher steady-state limits.
  - **Exam-window bursts**: during configured exam windows, read endpoints allow a larger short-term burst (e.g., 2–3x token bucket size) while write endpoints keep normal limits to protect D1.
  - **Abuse controls**: repeated 429s trigger short-lived edge bans (per-IP) and can flag accounts/orgs for moderation review.
- **Moderation workflow (content submissions)**:
  - **Automated checks on ingestion**: file type/size, malware scan, metadata completeness, curriculum release validity, and duplicate detection (hash + title/grade) before `content_submissions.status = submitted`.
  - **Human review triggers**: automated failures, policy keywords, high-risk file types, repeat submitter offenses, or user reports create `content_reviews` entries with `flag_reason` and move items to `in_review`.
  - **Escalation**: reviewers can escalate to a safety queue for suspected copyright, harassment, or exam integrity issues; escalations block publishing until resolved.
  - **Outcomes**: `approved`, `changes_requested`, or `rejected` decisions are persisted with reviewer notes and timestamps for audit.
- **Abuse reporting flow**:
  - **Entry point**: `POST /abuse/report` accepts content id, reporter id (optional), category, free-text, and evidence URLs.
  - **Storage**: reports persist in D1 (`abuse_reports`) with status (`new`, `triaged`, `actioned`, `dismissed`), links to `content_items`/`content_submissions`, and reviewer notes.
  - **Triage ownership**: Trust & Safety owns intake and assigns to content reviewers or legal/compliance as needed; actioned reports can lock content from publishing.
- **Data retention**:
  - **User submissions**: accepted submissions and published versions are retained for the lifetime of the curriculum release; rejected or withdrawn submissions are retained for 180 days, then hard-deleted from R2 and D1.
  - **Moderation artifacts**: `content_reviews`, flags, and abuse reports are retained for 2 years for auditability; escalations retain linked evidence for the same window.
  - **Logs**: request logs and rate-limit events retained for 30 days; security/audit logs retained for 180 days.
  - **Deletion policy**: deletes cascade to related objects (e.g., `content_submissions` → R2 keys, review artifacts); curriculum releases follow the retention rules defined in `schema/curriculum.sql` (no destructive deletes for active/archived releases).

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
- Submission intake, review workflow, and publishing lifecycle

**Data ownership**:
- **D1 tables**: `content_items`, `content_tags`, `content_categories`, `content_versions`, `content_submissions`, `content_reviews`
- **R2 buckets**: `content-assets` (source files and published binaries)

**Interfaces**:
- `GET /content` (list)
- `GET /content/:id` (metadata)
- `GET /content/:id/download` (signed URL)
- `POST /content/submit` (teacher/coordinator upload)
- `GET /content/review/queue` (reviewer queue)
- `POST /content/:id/publish` (promote reviewed submission)

### Content Submission & Review Workflow
**Submission flow (teacher/coordinator upload)**:
1. **Upload initiation**: Teacher/coordinator calls `POST /content/submit` with metadata (title, subject, grade, tags, curriculum release) and file info.
2. **File storage**: Worker issues a signed R2 upload URL; client uploads the file to `content-assets` with a `submission/{submission_id}/original` key.
3. **Metadata persistence**: Worker creates a `content_submissions` record in D1 with `status = submitted`, `submitted_by`, `r2_key`, and metadata snapshot.
4. **Acknowledgement**: API returns submission id and review queue status.

**Review queues**:
- **Queues by status** in D1 (`submitted`, `in_review`, `changes_requested`, `approved`, `rejected`, `published`).
- Reviewers query `GET /content/review/queue?status=submitted` to pull the next items.
- Review actions write to `content_reviews` with reviewer id, decision, notes, and timestamps.
- Queue transitions are performed atomically in D1 to avoid double-claiming (e.g., `submitted` → `in_review` with a reviewer lock).

**Content validation**:
- **Automated checks** on ingestion: file type/size, virus scan hook, required metadata, curriculum alignment, and duplicate detection (hash + title/grade).
- **Schema validation**: Metadata is validated against required fields and enums before a submission is accepted.
- **Manual checks** in review: formatting quality, correctness, copyright/licensing, and pedagogical alignment.
- Validation failures update `content_submissions.status = changes_requested` with reviewer notes.

**Version history & publishing**:
- Approved submissions create a new row in `content_versions`, linked to `content_items`.
- Publishing promotes the latest approved version to `content_items.current_version_id`.
- Each version stores `r2_key`, checksum, and `published_at` timestamp.
- Older versions remain addressable for rollback or audit, and versioned download URLs are supported.

**Storage**:
- **R2** stores binaries for both submissions and published versions (versioned keys).
- **D1** stores all metadata, review history, and version lineage.

### Curriculum Data Model
**Core entities**:
- **Grade** → **Subject** → **Chapter** → **Outcome** (learning outcome).
- Each entity is attached to a **curriculum release** so content and exams can target a stable version.

**Custom override layer**:
- Admin edits are stored as non-destructive overrides keyed by entity + release.
- Read paths merge overrides on top of baseline entities, preserving the original structure and history.

**Versioned releases**:
- Releases can be `draft`, `active`, or `archived`.
- Content items and assessments reference a release id to lock to a stable curriculum version.
- New releases can be created by cloning baseline entities and applying new overrides.

**Release Quality Gates**:
- Before promoting a release from `draft` to `active`, the platform must complete:
  - **Content completeness** checks (required chapters/outcomes populated, minimum content coverage met).
  - **Alignment validation** (content aligned to outcomes for the targeted grade/subject).
  - **Assessment difficulty distribution** validation (expected mix of easy/medium/hard).
  - **Plagiarism/duplication** checks across content and assessments.
  - **Metadata validation** (required tags, grade/subject, version lineage, release linkage).
- **Sign-off requirements**: promotions require approvals from the curriculum lead, QA, and moderation.
- **Rollback policy**: if critical issues appear post-release, revert the release to `archived` and re-activate the prior stable release; content and assessments should continue to reference the prior release id while fixes are applied.
- **Schema mapping**: these gates align with the curriculum release entity in `schema/curriculum.sql` (release table + status fields). Future lifecycle markers (e.g., `release_status`, `promoted_at`, `rolled_back_at`, and approval audit tables) will track gate completion and sign-off.

**Schema reference**:
- See `schema/curriculum.sql` for D1 table definitions and indexes.

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
