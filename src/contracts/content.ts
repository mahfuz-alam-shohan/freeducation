import { z } from 'zod'
import { Attachment, Image, IsoDate, LocalizedText } from './primitives.js'

export const SchoolProfile = z.object({
  name: LocalizedText,
  shortName: LocalizedText.optional(),
  tagline: LocalizedText.optional(),
  eiin: z.string().optional(),
  established: z.string().optional(),
  logo: Image.optional(),
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

export const Stat = z.object({
  label: LocalizedText,
  value: z.string(),
})
export type Stat = z.infer<typeof Stat>
