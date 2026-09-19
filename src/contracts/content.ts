import { z } from 'zod'
import { Attachment, Image, IsoDate, LocalizedText } from './primitives.js'

/**
 * One frame of the homepage slideshow.
 *
 * Every institutional site in Bangladesh opens on a rotating set of photographs —
 * the building, a prize day, a new laboratory — usually with a line of text over it
 * and somewhere to go. This is that, as content the school supplies rather than
 * decoration the design invents.
 */
export const Slide = z.object({
  image: Image,
  title: LocalizedText.optional(),
  caption: LocalizedText.optional(),
  /** Where the frame leads, if anywhere. Site-relative, no leading slash. */
  href: z.string().optional(),
})
export type Slide = z.infer<typeof Slide>

export const SchoolProfile = z.object({
  name: LocalizedText,
  shortName: LocalizedText.optional(),
  tagline: LocalizedText.optional(),
  eiin: z.string().optional(),
  established: z.string().optional(),
  logo: Image.optional(),
  /** A wide photograph for designs that open with one. */
  cover: Image.optional(),
  /** The homepage slideshow. Designs that open on one still fall back to `cover`. */
  slides: z.array(Slide).default([]),
  address: LocalizedText.optional(),
  phones: z.array(z.string()).default([]),
  emails: z.array(z.string()).default([]),
  social: z.record(z.string(), z.string()).default({}),
  mapEmbedUrl: z.string().optional(),
})
export type SchoolProfile = z.infer<typeof SchoolProfile>

export const Notice = z.object({
  id: z.string(),
  slug: z.string(),
  title: LocalizedText,
  summary: LocalizedText.optional(),
  body: LocalizedText.optional(),
  category: z.string().default('general'),
  publishedAt: IsoDate,
  pinned: z.boolean().default(false),
  attachments: z.array(Attachment).default([]),
})
export type Notice = z.infer<typeof Notice>

/** Teachers, governing body, officers and staff are all people in a named group. */
export const Person = z.object({
  id: z.string(),
  name: LocalizedText,
  designation: LocalizedText.optional(),
  group: z.string(),
  department: LocalizedText.optional(),
  photo: Image.optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  bio: LocalizedText.optional(),
  order: z.number().int().default(0),
})
export type Person = z.infer<typeof Person>

/** Editable free-form pages: About, History, Mission, Facilities, and anything a school invents. */
export const ContentBlock = z.discriminatedUnion('type', [
  z.object({ type: z.literal('richtext'), html: LocalizedText }),
  z.object({ type: z.literal('image'), image: Image, caption: LocalizedText.optional() }),
  z.object({ type: z.literal('table'), rows: z.array(z.array(LocalizedText)), header: z.boolean().default(true) }),
  z.object({ type: z.literal('files'), files: z.array(Attachment) }),
  z.object({ type: z.literal('people'), group: z.string() }),
])
export type ContentBlock = z.infer<typeof ContentBlock>

export const RichPage = z.object({
  slug: z.string(),
  title: LocalizedText,
  updatedAt: IsoDate.optional(),
  blocks: z.array(ContentBlock).default([]),
})
export type RichPage = z.infer<typeof RichPage>

export const SchoolEvent = z.object({
  id: z.string(),
  slug: z.string(),
  title: LocalizedText,
  description: LocalizedText.optional(),
  startsAt: IsoDate,
  endsAt: IsoDate.optional(),
  location: LocalizedText.optional(),
  cover: Image.optional(),
})
export type SchoolEvent = z.infer<typeof SchoolEvent>

export const GalleryAlbum = z.object({
  id: z.string(),
  slug: z.string(),
  title: LocalizedText,
  cover: Image.optional(),
  photos: z.array(Image).default([]),
  takenAt: IsoDate.optional(),
})
export type GalleryAlbum = z.infer<typeof GalleryAlbum>

/**
 * A video the school has published. The backend supplies an embed URL and a poster
 * rather than a watch link, so the frontend never has to know about providers.
 */
export const Video = z.object({
  id: z.string(),
  slug: z.string(),
  title: LocalizedText,
  description: LocalizedText.optional(),
  /** Loaded only when a visitor asks for it, so no third party is contacted on page load. */
  embedUrl: z.string(),
  /** Where the video can be watched if embedding is blocked or scripting is off. */
  watchUrl: z.string().optional(),
  poster: Image.optional(),
  publishedAt: IsoDate.optional(),
  durationSeconds: z.number().int().positive().optional(),
})
export type Video = z.infer<typeof Video>

export const Stat = z.object({
  label: LocalizedText,
  value: z.string(),
})
export type Stat = z.infer<typeof Stat>

/** A class or section a routine can be shown for. */
export const ClassRef = z.object({ id: z.string(), label: LocalizedText })
export type ClassRef = z.infer<typeof ClassRef>

export const RoutinePeriod = z.object({
  label: LocalizedText,
  startsAt: z.string().optional(),
  endsAt: z.string().optional(),
})
export type RoutinePeriod = z.infer<typeof RoutinePeriod>

export const RoutineCell = z.object({
  subject: LocalizedText,
  teacher: LocalizedText.optional(),
  room: z.string().optional(),
}).nullable()
export type RoutineCell = z.infer<typeof RoutineCell>

export const Routine = z.object({
  classRef: ClassRef,
  days: z.array(LocalizedText),
  periods: z.array(RoutinePeriod),
  /** grid[dayIndex][periodIndex]; null is a free period. */
  grid: z.array(z.array(RoutineCell)),
  updatedAt: IsoDate.optional(),
})
export type Routine = z.infer<typeof Routine>

export const ExamRef = z.object({ id: z.string(), label: LocalizedText })
export type ExamRef = z.infer<typeof ExamRef>

export const ResultSubject = z.object({
  name: LocalizedText,
  grade: z.string(),
  points: z.number().optional(),
})
export type ResultSubject = z.infer<typeof ResultSubject>

export const ResultRecord = z.object({
  roll: z.string(),
  studentName: LocalizedText,
  className: LocalizedText,
  exam: LocalizedText,
  gpa: z.string().optional(),
  subjects: z.array(ResultSubject).default([]),
  publishedAt: IsoDate.optional(),
})
export type ResultRecord = z.infer<typeof ResultRecord>

export const SearchHit = z.object({
  title: LocalizedText,
  path: z.string(),
  kind: z.enum(['notice', 'page', 'person', 'event']),
  snippet: LocalizedText.optional(),
  date: IsoDate.optional(),
})
export type SearchHit = z.infer<typeof SearchHit>
