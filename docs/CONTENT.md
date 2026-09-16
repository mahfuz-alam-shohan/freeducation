# What the site needs from you

This site holds no content of its own. Everything on it is sent by the school
system over the API, and this document lists exactly what that is.

It is generated from the site’s own schemas, so it always matches what the code
accepts. Anything marked **required** must be present or the site will treat the
record as malformed and skip it.

## Every piece of text is bilingual

Wherever this document says *bilingual text*, send an object keyed by language:

```json
{ "bn": "ভর্তি বিজ্ঞপ্তি", "en": "Admission notice" }
```

Either language may be left out. A visitor reading in Bangla sees the Bangla text
if it is there and the English otherwise, so a school that only writes in one
language still gets a working site.

## Dates

Send full ISO timestamps in UTC — `2026-01-05T04:00:00.000Z` — not dates alone.
The site converts them to the school’s own timezone before showing or grouping
them, so an evening event lands on the right day.

## Kinds of page

Every menu item names the kind of page it opens:

| `view` | What it shows |
|---|---|
| `home` | The front page |
| `rich-page` | An ordinary written page |
| `notice-list` | Notices, optionally filtered by category |
| `notice-detail` | One notice — reached automatically under its list |
| `person-list` | Teachers, governing body or staff |
| `event-list` | Upcoming events |
| `event-calendar` | Events on a month grid |
| `event-detail` | One event |
| `gallery-albums` | Photo albums |
| `gallery-album` | One album |
| `video-list` | Videos |
| `routine` | Class routine |
| `result-lookup` | Result search by roll number |
| `admission-form` | The online application form |
| `contact` | Contact details and message form |
| `search` | Site search results |
| `external-link` | Sends the visitor elsewhere |

_Complete list in the code: home, rich-page, notice-list, notice-detail, person-list, event-list, event-detail, event-calendar, gallery-albums, gallery-album, video-list, contact, routine, result-lookup, admission-form, search, external-link._

## Blocks an ordinary page can contain

| `type` | Contains |
|---|---|
| `richtext` | `html` — bilingual formatted text |
| `image` | `image`, and an optional `caption` |
| `table` | `rows` — a list of rows, each a list of bilingual cells |
| `files` | `files` — a list of downloads |
| `people` | `group` — inserts that group of people into the page |

_5 block kinds are defined._

---

## The school itself

Sent once and used everywhere: the header, the footer, the contact page, the browser tab icon and the link previews when someone shares a page.

| Field | | Type | Notes |
|---|---|---|---|
| `name` | **required** | bilingual text |  |
| `shortName` | optional | bilingual text |  |
| `tagline` | optional | bilingual text |  |
| `eiin` | optional | text |  |
| `established` | optional | text |  |
| `logo` | optional | image |  |
| `address` | optional | bilingual text |  |
| `phones` | optional | list of text |  |
| `emails` | optional | list of text |  |
| `social` | optional | map of text to text |  |
| `mapEmbedUrl` | optional | text |  |

## The menu

The most important thing you send. The menu is the sitemap: every page the site has exists because a menu item says so, and adding a page is adding an item. Items nest one level for dropdowns.

| Field | | Type | Notes |
|---|---|---|---|
| `id` | **required** | text |  |
| `label` | **required** | bilingual text |  |
| `path` | **required** | text | The address of the page, without a leading slash. Empty means the home page. |
| `view` | **required** | one of: home, rich-page, notice-list, notice-detail, person-list, event-list, event-detail, event-calendar, gallery-albums, gallery-album, video-list, contact, routine, result-lookup, admission-form, search, external-link | Which kind of page this opens. See the table above. |
| `params` | optional | map of text to text | Arguments for that page, e.g. `{"category":"academic"}` or `{"group":"teachers"}`. |
| `visible` | optional | yes / no | Hidden items stay reachable by address but do not appear in the menu. |
| `highlighted` | optional | yes / no | Promoted out of the menu into a call-to-action button. |
| `externalUrl` | optional | text |  |
| `children` | optional | list of menu item |  |

## Notices

The reason most people open a school website. Shown on the home page, on the notice board, in the ticker, in search and in the RSS feed.

| Field | | Type | Notes |
|---|---|---|---|
| `id` | **required** | text |  |
| `slug` | **required** | text | Used in the page address. Keep it stable — changing it breaks shared links. |
| `title` | **required** | bilingual text |  |
| `summary` | optional | bilingual text |  |
| `body` | optional | bilingual text |  |
| `category` | optional | text | Free text. The menu filters on it — `academic`, `office`, `admission`, `career`. |
| `publishedAt` | **required** | text | Full ISO timestamp, e.g. `2026-01-05T04:00:00.000Z`. |
| `pinned` | optional | yes / no | Pinned notices are listed first, whatever their date. |
| `attachments` | optional | list of file |  |

## People

Teachers, the governing body, officers and staff are all people in a named group. One list per group.

| Field | | Type | Notes |
|---|---|---|---|
| `id` | **required** | text |  |
| `name` | **required** | bilingual text |  |
| `designation` | optional | bilingual text |  |
| `group` | **required** | text | Which list the person belongs to — `teachers`, `governing-body`, `staff`. |
| `department` | optional | bilingual text |  |
| `photo` | optional | image |  |
| `email` | optional | text |  |
| `phone` | optional | text |  |
| `bio` | optional | bilingual text |  |
| `order` | optional | number | Controls position in the list. Sort before sending; paging relies on it. |

## Ordinary pages

About, history, mission, facilities, fees, syllabus — anything that is text a school writes. Built from blocks so a page can mix prose, a table, an image, a set of downloads, or a list of people.

| Field | | Type | Notes |
|---|---|---|---|
| `slug` | **required** | text | Used in the page address. Keep it stable — changing it breaks shared links. |
| `title` | **required** | bilingual text |  |
| `updatedAt` | optional | text |  |
| `blocks` | optional | list of one of several kinds |  |

## Events

Shown as a list and on a month calendar.

| Field | | Type | Notes |
|---|---|---|---|
| `id` | **required** | text |  |
| `slug` | **required** | text | Used in the page address. Keep it stable — changing it breaks shared links. |
| `title` | **required** | bilingual text |  |
| `description` | optional | bilingual text |  |
| `startsAt` | **required** | text | Full ISO timestamp. The calendar places it on the school’s local day. |
| `endsAt` | optional | text |  |
| `location` | optional | bilingual text |  |
| `cover` | optional | image |  |

## Photo albums

Each album is a cover and its photos.

| Field | | Type | Notes |
|---|---|---|---|
| `id` | **required** | text |  |
| `slug` | **required** | text | Used in the page address. Keep it stable — changing it breaks shared links. |
| `title` | **required** | bilingual text |  |
| `cover` | optional | image |  |
| `photos` | optional | list of image |  |
| `takenAt` | optional | text | Albums are ordered by this, newest first. |

## Videos

Shown as a poster with a play button. The video provider is only contacted once a visitor actually presses play.

| Field | | Type | Notes |
|---|---|---|---|
| `id` | **required** | text |  |
| `slug` | **required** | text | Used in the page address. Keep it stable — changing it breaks shared links. |
| `title` | **required** | bilingual text |  |
| `description` | optional | bilingual text |  |
| `embedUrl` | **required** | text | A ready-to-embed URL. It is only loaded once a visitor presses play. |
| `watchUrl` | optional | text | Where to send someone whose browser cannot embed. |
| `poster` | optional | image |  |
| `publishedAt` | optional | text |  |
| `durationSeconds` | optional | number |  |

## Class routine

One routine per class, drawn as a grid.

| Field | | Type | Notes |
|---|---|---|---|
| `classRef` | **required** | class |  |
| `days` | **required** | list of bilingual text |  |
| `periods` | **required** | list of period |  |
| `grid` | **required** | list of list of value | A row per day, a cell per period, in the same order as `days` and `periods`. `null` is a free period. |
| `updatedAt` | optional | text |  |

## Examination results

Looked up by examination and roll number. Return nothing when there is no match.

| Field | | Type | Notes |
|---|---|---|---|
| `roll` | **required** | text | What a visitor types to find the result. |
| `studentName` | **required** | bilingual text |  |
| `className` | **required** | bilingual text |  |
| `exam` | **required** | bilingual text |  |
| `gpa` | optional | text |  |
| `subjects` | optional | list of subject result |  |
| `publishedAt` | optional | text |  |

## Search results

Searching is done by you, not by the site: the site sends a query and shows what comes back.

| Field | | Type | Notes |
|---|---|---|---|
| `title` | **required** | bilingual text |  |
| `path` | **required** | text |  |
| `kind` | **required** | one of: notice, page, person, event |  |
| `snippet` | optional | bilingual text |  |
| `date` | optional | text |  |

## At a glance

The handful of figures shown on the home page — students, teachers, pass rate, founding year.

| Field | | Type | Notes |
|---|---|---|---|
| `label` | **required** | bilingual text |  |
| `value` | **required** | text |  |

## Images

Used anywhere a picture appears.

| Field | | Type | Notes |
|---|---|---|---|
| `url` | **required** | text |  |
| `alt` | optional | bilingual text |  |
| `width` | optional | number |  |
| `height` | optional | number |  |
| `variants` | optional | list of image size | Other sizes of the same image. When given, a phone downloads a phone-sized file. |

## Files

A downloadable document attached to a notice or listed on a page.

| Field | | Type | Notes |
|---|---|---|---|
| `label` | **required** | bilingual text |  |
| `url` | **required** | text |  |
| `sizeBytes` | optional | number |  |
| `mimeType` | optional | text |  |

---

## What the site sends back to you

Two things are posted rather than read: a contact message and an admission
application. Both are validated before they are sent. Answer with
`{ "ok": true, "reference": "ADM-4821" }` — the reference is shown to the sender
so they can quote it to the office.

Field-by-field detail for those is in [API.md](API.md).
