import { z } from 'zod'
import catalogue from '../../demos.json' with { type: 'json' }

/**
 * The published demonstrations, and where each one lives.
 *
 * This exists so a visitor evaluating the platform can move between designs without
 * going back to a list — the bar at the top of a demo site is built from it. It is
 * data, not code: adding a demo is an entry here and a deploy, nothing else.
 *
 * Only a school whose config sets `features.demoBar` ever renders it, so a real
 * school's site carries no trace of the showcase.
 */
export const DemoEntry = z.object({
  /** The school config the demo is built from. */
  slug: z.string(),
  /** The design set it shows off. */
  design: z.string(),
  /** How the design is named to a visitor. */
  label: z.string(),
  /** One line on why a school would choose it. */
  note: z.string(),
  url: z.string(),
})
export type DemoEntry = z.infer<typeof DemoEntry>

export const DemoCatalogue = z.object({
  /** Where the index of all demos lives. */
  galleryUrl: z.string(),
  entries: z.array(DemoEntry).min(1),
})
export type DemoCatalogue = z.infer<typeof DemoCatalogue>

export const demos: DemoCatalogue = DemoCatalogue.parse(catalogue)

/** The entry for a school, and the others a visitor can switch to. */
export function demoContext(slug: string): { current: DemoEntry | null; peers: DemoEntry[] } {
  const current = demos.entries.find(entry => entry.slug === slug) ?? null
  return { current, peers: demos.entries.filter(entry => entry.slug !== slug) }
}
