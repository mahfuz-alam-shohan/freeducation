import { describe, expect, it } from 'vitest'
import type { ZodType } from 'zod'
import {
  Attachment, ClassRef, ContentBlock, ExamRef, GalleryAlbum, Image, ImageVariant, LocalizedText,
  MenuItem, Notice, Person, ResultRecord, ResultSubject, RichPage, Routine, RoutineCell,
  RoutinePeriod, SchoolEvent, SchoolProfile, SearchHit, Stat, Video, ViewType,
} from './index.js'

/**
 * Generates docs/CONTENT.md — the inventory of what the dashboard has to supply,
 * written from the supplier's side rather than the caller's.
 *
 * Field names, types and whether something is required all come from the schemas
 * themselves, as a snapshot, so the document cannot quietly disagree with the code.
 */

const def = (schema: unknown) => (schema as { def: Record<string, unknown> }).def

const named = new Map<unknown, string>([
  [LocalizedText, 'bilingual text'],
  [Image, 'image'],
  [ImageVariant, 'image size'],
  [Attachment, 'file'],
  [MenuItem, 'menu item'],
  [ClassRef, 'class'],
  [ExamRef, 'examination'],
  [RoutinePeriod, 'period'],
  [RoutineCell, 'lesson'],
  [ResultSubject, 'subject result'],
])

function unwrap(schema: ZodType): { inner: ZodType; optional: boolean } {
  let inner = schema
  let optional = false
  for (let depth = 0; depth < 6; depth++) {
    const type = def(inner).type
    if (type === 'optional' || type === 'default' || type === 'nullable') {
      optional = true
      inner = def(inner).innerType as ZodType
      continue
    }
    break
  }
  return { inner, optional }
}

function label(schema: ZodType): string {
  const { inner } = unwrap(schema)
  const known = named.get(inner)
  if (known) return known

  switch (def(inner).type) {
    case 'string': return 'text'
    case 'number': return 'number'
    case 'boolean': return 'yes / no'
    // Only LocalizedText itself is bilingual text; any other record is a plain map.
    case 'record': return 'map of text to text'
    case 'array': return `list of ${label(def(inner).element as ZodType)}`
    case 'enum': return `one of: ${Object.keys((def(inner).entries ?? {}) as object).join(', ')}`
    case 'union': return 'one of several kinds'
    // Recursive schemas hide behind a getter; resolve it so a list reads as a list.
    case 'lazy': return label((def(inner).getter as () => ZodType)())
    default: return 'value'
  }
}

/** Notes worth saying once, beside the field they apply to. */
const notes: Record<string, string> = {
  'slug': 'Used in the page address. Keep it stable — changing it breaks shared links.',
  'Notice.publishedAt': 'Full ISO timestamp, e.g. `2026-01-05T04:00:00.000Z`.',
  'Notice.category': 'Free text. The menu filters on it — `academic`, `office`, `admission`, `career`.',
  'Notice.pinned': 'Pinned notices are listed first, whatever their date.',
  'Person.group': 'Which list the person belongs to — `teachers`, `governing-body`, `staff`.',
  'Person.order': 'Controls position in the list. Sort before sending; paging relies on it.',
  'SchoolEvent.startsAt': 'Full ISO timestamp. The calendar places it on the school’s local day.',
  'Video.embedUrl': 'A ready-to-embed URL. It is only loaded once a visitor presses play.',
  'Video.watchUrl': 'Where to send someone whose browser cannot embed.',
  'MenuItem.path': 'The address of the page, without a leading slash. Empty means the home page.',
  'MenuItem.view': 'Which kind of page this opens. See the table above.',
  'MenuItem.params': 'Arguments for that page, e.g. `{"category":"academic"}` or `{"group":"teachers"}`.',
  'MenuItem.visible': 'Hidden items stay reachable by address but do not appear in the menu.',
  'MenuItem.highlighted': 'Promoted out of the menu into a call-to-action button.',
  'GalleryAlbum.takenAt': 'Albums are ordered by this, newest first.',
  'Routine.grid': 'A row per day, a cell per period, in the same order as `days` and `periods`. `null` is a free period.',
  'ResultRecord.roll': 'What a visitor types to find the result.',
  'Image.variants': 'Other sizes of the same image. When given, a phone downloads a phone-sized file.',
}

function table(name: string, schema: ZodType): string[] {
  const shape = (def(schema).shape ?? {}) as Record<string, ZodType>
  const rows = Object.entries(shape).map(([field, value]) => {
    const { optional } = unwrap(value)
    const note = notes[`${name}.${field}`] ?? notes[field] ?? ''
    return `| \`${field}\` | ${optional ? 'optional' : '**required**'} | ${label(value)} | ${note} |`
  })
  return ['| Field | | Type | Notes |', '|---|---|---|---|', ...rows, '']
}

interface Entry { name: string; heading: string; schema: ZodType; intro: string }

const entries: Entry[] = [
  { name: 'SchoolProfile', heading: 'The school itself', schema: SchoolProfile,
    intro: 'Sent once and used everywhere: the header, the footer, the contact page, the browser tab icon and the link previews when someone shares a page.' },
  { name: 'MenuItem', heading: 'The menu', schema: MenuItem as unknown as ZodType,
    intro: 'The most important thing you send. The menu is the sitemap: every page the site has exists because a menu item says so, and adding a page is adding an item. Items nest one level for dropdowns.' },
  { name: 'Notice', heading: 'Notices', schema: Notice,
    intro: 'The reason most people open a school website. Shown on the home page, on the notice board, in the ticker, in search and in the RSS feed.' },
  { name: 'Person', heading: 'People', schema: Person,
    intro: 'Teachers, the governing body, officers and staff are all people in a named group. One list per group.' },
  { name: 'RichPage', heading: 'Ordinary pages', schema: RichPage,
    intro: 'About, history, mission, facilities, fees, syllabus — anything that is text a school writes. Built from blocks so a page can mix prose, a table, an image, a set of downloads, or a list of people.' },
  { name: 'SchoolEvent', heading: 'Events', schema: SchoolEvent,
    intro: 'Shown as a list and on a month calendar.' },
  { name: 'GalleryAlbum', heading: 'Photo albums', schema: GalleryAlbum, intro: 'Each album is a cover and its photos.' },
  { name: 'Video', heading: 'Videos', schema: Video,
    intro: 'Shown as a poster with a play button. The video provider is only contacted once a visitor actually presses play.' },
  { name: 'Routine', heading: 'Class routine', schema: Routine, intro: 'One routine per class, drawn as a grid.' },
  { name: 'ResultRecord', heading: 'Examination results', schema: ResultRecord,
    intro: 'Looked up by examination and roll number. Return nothing when there is no match.' },
  { name: 'SearchHit', heading: 'Search results', schema: SearchHit,
    intro: 'Searching is done by you, not by the site: the site sends a query and shows what comes back.' },
  { name: 'Stat', heading: 'At a glance', schema: Stat,
    intro: 'The handful of figures shown on the home page — students, teachers, pass rate, founding year.' },
  { name: 'Image', heading: 'Images', schema: Image, intro: 'Used anywhere a picture appears.' },
  { name: 'Attachment', heading: 'Files', schema: Attachment, intro: 'A downloadable document attached to a notice or listed on a page.' },
]

describe('content documentation', () => {
  it('matches the shapes the site expects', async () => {
    const viewTypes = Object.keys((def(ViewType).entries ?? {}) as object)

    const lines: string[] = [
      '# What the site needs from you',
      '',
      'This site holds no content of its own. Everything on it is sent by the school',
      'system over the API, and this document lists exactly what that is.',
      '',
      'It is generated from the site’s own schemas, so it always matches what the code',
      'accepts. Anything marked **required** must be present or the site will treat the',
      'record as malformed and skip it.',
      '',
      '## Every piece of text is bilingual',
      '',
      'Wherever this document says *bilingual text*, send an object keyed by language:',
      '',
      '```json',
      '{ "bn": "ভর্তি বিজ্ঞপ্তি", "en": "Admission notice" }',
      '```',
      '',
      'Either language may be left out. A visitor reading in Bangla sees the Bangla text',
      'if it is there and the English otherwise, so a school that only writes in one',
      'language still gets a working site.',
      '',
      '## Dates',
      '',
      'Send full ISO timestamps in UTC — `2026-01-05T04:00:00.000Z` — not dates alone.',
      'The site converts them to the school’s own timezone before showing or grouping',
      'them, so an evening event lands on the right day.',
      '',
      '## Kinds of page',
      '',
      'Every menu item names the kind of page it opens:',
      '',
      '| `view` | What it shows |',
      '|---|---|',
      '| `home` | The front page |',
      '| `rich-page` | An ordinary written page |',
      '| `notice-list` | Notices, optionally filtered by category |',
      '| `notice-detail` | One notice — reached automatically under its list |',
      '| `person-list` | Teachers, governing body or staff |',
      '| `event-list` | Upcoming events |',
      '| `event-calendar` | Events on a month grid |',
      '| `event-detail` | One event |',
      '| `gallery-albums` | Photo albums |',
      '| `gallery-album` | One album |',
      '| `video-list` | Videos |',
      '| `routine` | Class routine |',
      '| `result-lookup` | Result search by roll number |',
      '| `admission-form` | The online application form |',
      '| `contact` | Contact details and message form |',
      '| `search` | Site search results |',
      '| `external-link` | Sends the visitor elsewhere |',
      '',
      `_Complete list in the code: ${viewTypes.join(', ')}._`,
      '',
      '## Blocks an ordinary page can contain',
      '',
      '| `type` | Contains |',
      '|---|---|',
      '| `richtext` | `html` — bilingual formatted text |',
      '| `image` | `image`, and an optional `caption` |',
      '| `table` | `rows` — a list of rows, each a list of bilingual cells |',
      '| `files` | `files` — a list of downloads |',
      '| `people` | `group` — inserts that group of people into the page |',
      '',
      `_${(def(ContentBlock).options as unknown[]).length} block kinds are defined._`,
      '',
      '---',
      '',
    ]

    for (const entry of entries) {
      lines.push(`## ${entry.heading}`, '', entry.intro, '', ...table(entry.name, entry.schema))
    }

    lines.push(
      '---',
      '',
      '## What the site sends back to you',
      '',
      'Two things are posted rather than read: a contact message and an admission',
      'application. Both are validated before they are sent. Answer with',
      '`{ "ok": true, "reference": "ADM-4821" }` — the reference is shown to the sender',
      'so they can quote it to the office.',
      '',
      'Field-by-field detail for those is in [API.md](API.md).',
      '',
    )

    await expect(`${lines.join('\n').trimEnd()}\n`).toMatchFileSnapshot('../../docs/CONTENT.md')
  })
})
