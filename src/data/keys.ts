import { z } from 'zod'
import {
  ClassRef, ExamRef, GalleryAlbum, Navigation, Notice, Paginated, Person, ResultRecord, RichPage,
  Routine, SchoolEvent, SchoolProfile, SearchHit, Stat,
} from '../contracts/index.js'

/**
 * The closed set of things the frontend may ask for.
 * A new kind of content means a new key here plus a schema — never an ad-hoc fetch.
 */
export const dataKeys = {
  'site.profile':    { params: z.object({}).default({}),                              result: SchoolProfile },
  'site.navigation': { params: z.object({}).default({}),                              result: Navigation },
  'site.stats':      { params: z.object({}).default({}),                              result: z.array(Stat) },

  'notice.list':     { params: z.object({ category: z.string().optional(), page: z.number().int().positive().default(1), pageSize: z.number().int().positive().default(20) }), result: Paginated(Notice) },
  'notice.bySlug':   { params: z.object({ slug: z.string() }),                        result: Notice.nullable() },

  'page.bySlug':     { params: z.object({ slug: z.string() }),                        result: RichPage.nullable() },

  'person.list':     { params: z.object({ group: z.string().optional(), page: z.number().int().positive().default(1), pageSize: z.number().int().positive().default(50) }), result: Paginated(Person) },

  'event.list':      { params: z.object({ upcoming: z.boolean().optional(), page: z.number().int().positive().default(1), pageSize: z.number().int().positive().default(20) }), result: Paginated(SchoolEvent) },
  'event.bySlug':    { params: z.object({ slug: z.string() }),                        result: SchoolEvent.nullable() },

  'gallery.albums':  { params: z.object({ page: z.number().int().positive().default(1), pageSize: z.number().int().positive().default(24) }), result: Paginated(GalleryAlbum) },
  'gallery.album':   { params: z.object({ slug: z.string() }),                        result: GalleryAlbum.nullable() },

  'routine.classes': { params: z.object({}).default({}),                              result: z.array(ClassRef) },
  'routine.byClass': { params: z.object({ class: z.string().optional() }),            result: Routine.nullable() },

  'result.exams':    { params: z.object({}).default({}),                              result: z.array(ExamRef) },
  'result.lookup':   { params: z.object({ exam: z.string(), roll: z.string() }),      result: ResultRecord.nullable() },

  'site.search':     { params: z.object({ q: z.string(), page: z.number().int().positive().default(1), pageSize: z.number().int().positive().default(20) }), result: Paginated(SearchHit) },
} as const

export type DataKey = keyof typeof dataKeys
export type ParamsOf<K extends DataKey> = z.input<(typeof dataKeys)[K]['params']>
export type ResultOf<K extends DataKey> = z.output<(typeof dataKeys)[K]['result']>
