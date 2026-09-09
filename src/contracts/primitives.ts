import { z } from 'zod'

/** Text that exists in one or more languages. Never read a branch directly — use resolveText(). */
export const LocalizedText = z.record(z.string(), z.string())
export type LocalizedText = z.infer<typeof LocalizedText>

export const Locale = z.enum(['bn', 'en'])
export type Locale = z.infer<typeof Locale>

export const IsoDate = z.string().min(4)

export const Image = z.object({
  url: z.string(),
  alt: LocalizedText.optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
})
export type Image = z.infer<typeof Image>

export const Attachment = z.object({
  label: LocalizedText,
  url: z.string(),
  sizeBytes: z.number().int().nonnegative().optional(),
  mimeType: z.string().optional(),
})
export type Attachment = z.infer<typeof Attachment>

export const Paginated = <T extends z.ZodTypeAny>(item: T) =>
  z.object({
    items: z.array(item),
    page: z.number().int().positive(),
    pageSize: z.number().int().positive(),
    total: z.number().int().nonnegative(),
  })

export type Paginated<T> = {
  items: T[]
  page: number
  pageSize: number
  total: number
}
