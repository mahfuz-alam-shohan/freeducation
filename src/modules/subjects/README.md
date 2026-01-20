# Subject templates

Each subject has its own folder so the structure can vary by subject while content remains managed in the admin UI.

## Folder layout

```
subjects/
  <subject-slug>/
    definition.ts
  registry.ts
  types.ts
```

## Create a new subject template

1. Create a folder: `src/modules/subjects/<subject-slug>/`.
2. Add `definition.ts` that exports a `SubjectTemplate`.
3. Register it in `src/modules/subjects/registry.ts`.

Example template:

```ts
import type { SubjectTemplate } from "../types";

export const exampleTemplate: SubjectTemplate = {
  slug: "example",
  name: "Example",
  structure: {
    hasChapters: true,
    hasTopics: false,
    contentScope: "chapter",
  },
};
```

## Structure rules

- `hasChapters`: set `true` if the subject is split into chapters.
- `hasTopics`: set `false` for subjects that do not use topics (e.g. Bangla).
- `contentScope`:
  - `"chapter"` for chapter-only content (no topics).
  - `"topic"` for chapter + topic content.

The admin UI follows these flags. If `hasTopics` is false, the Topics section is disabled and content is attached directly to chapters.

## Database notes

- Subject templates are stored on `subjects.template_slug` and synced automatically during deploy.
- Chapter-level content uses `content_items.chapter_id` (topic can be null).
- All schema changes must be added in `src/db/schema.ts` so `ensureSchema` can create or update tables automatically.

## Class group mapping

Each subject template defines which class groups it belongs to. Add them on the template under `classGroups`:

```ts
classGroups: [
  { slug: "9-10", stream: "core", isOptional: false },
  { slug: "11-12", stream: "science", isOptional: false },
],
```

These are synced into `class_subjects` during deploy so the admin UI can manage chapters and content without manual setup.
