import { z } from 'zod'
import sets from './sets.json' with { type: 'json' }

/**
 * A design set is one complete look: a variant for every view the site can render.
 *
 * A school chooses a set, not a page-by-page list, so its notice board, teacher list
 * and routine cannot end up in three different designs. The per-view `variants` map in
 * a school's config is an override on top of the set — a deliberate exception, not the
 * normal way to dress a site.
 *
 * Because a set must name every view, adding a view to the platform forces every set to
 * answer for it. tools/verify checks exactly that, so the two can never drift apart.
 */
export const DesignSet = z.object({
  /** Shown wherever a human picks a design. */
  label: z.string().min(1),
  /** Why a school would choose this one over the others. */
  note: z.string().min(1),
  /** view id -> variant id, complete. */
  views: z.record(z.string(), z.string()),
})
export type DesignSet = z.infer<typeof DesignSet>

export const designs: Record<string, DesignSet> = z.record(z.string(), DesignSet).parse(sets)

export const designNames = Object.keys(designs)

export const isDesignName = (name: string): boolean => name in designs

/**
 * The variant every view will render for this school: the set, then any overrides.
 *
 * Overrides for views the set does not know are ignored here rather than merged in —
 * tools/verify rejects them at source, and silently inventing a view would hide that.
 */
export function resolveVariants(
  design: string,
  overrides: Record<string, string> = {},
): Record<string, string> {
  const set = designs[design]
  if (!set) {
    throw new Error(`Unknown design '${design}'. Available: ${designNames.join(', ')}`)
  }

  const resolved: Record<string, string> = { ...set.views }
  for (const [view, variant] of Object.entries(overrides)) {
    if (view in resolved) resolved[view] = variant
  }
  return resolved
}
