import { z } from 'zod'
import { LocalizedText } from './primitives.js'

/**
 * What a menu item renders when opened.
 * Adding a school page means adding a menu item — never a route file.
 */
export const ViewType = z.enum([
  'home',
  'rich-page',
  'notice-list',
  'notice-detail',
  'person-list',
  'event-list',
  'event-detail',
  'gallery-albums',
  'gallery-album',
  'contact',
  'external-link',
])
export type ViewType = z.infer<typeof ViewType>

const MenuItemBase = z.object({
  id: z.string(),
  label: LocalizedText,
  /** Site-relative path, no leading slash. Empty string is the home page. */
  path: z.string(),
  view: ViewType,
  /** View-specific arguments, e.g. { category: 'academic' } or { group: 'governing-body' } */
  params: z.record(z.string(), z.string()).default({}),
  /** Design variant id. Falls back to the school default when absent. */
  variant: z.string().optional(),
  visible: z.boolean().default(true),
  /** Promoted out of the dropdown into a call-to-action button. */
  highlighted: z.boolean().default(false),
  externalUrl: z.string().optional(),
})

export type MenuItem = z.infer<typeof MenuItemBase> & { children: MenuItem[] }

export const MenuItem: z.ZodType<MenuItem> = MenuItemBase.extend({
  children: z.lazy(() => z.array(MenuItem)).default([]),
})

export const Navigation = z.object({
  primary: z.array(MenuItem).default([]),
  utility: z.array(MenuItem).default([]),
  footer: z.array(MenuItem).default([]),
})
export type Navigation = z.infer<typeof Navigation>
