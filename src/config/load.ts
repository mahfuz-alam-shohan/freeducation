import { SchoolConfig } from './schema.js'
import { resolveVariants } from '../designs/index.js'

/** Every schools/*.json is picked up automatically — adding a school is never a code change. */
const files = import.meta.glob<{ default: unknown }>('../../schools/*.json', { eager: true })

const registry: Record<string, unknown> = Object.fromEntries(
  Object.entries(files).map(([path, module]) => [
    path.split('/').pop()!.replace(/\.json$/, ''),
    module.default ?? module,
  ]),
)

export const knownSchools = (): string[] => Object.keys(registry).sort()

/**
 * Resolves the active school.
 * Invalid config is a hard failure — a half-configured site is worse than none.
 *
 * The config that comes back is resolved, not raw: `variants` holds the variant for
 * every view, taken from the school's design set and then from its own exceptions.
 * Nothing downstream has to know a design set exists, and nothing can forget to apply
 * one — there is a single place where the two are combined, and this is it.
 */
export function loadSchool(slug = import.meta.env?.PUBLIC_SCHOOL ?? 'demo'): SchoolConfig {
  const raw = registry[slug]
  if (!raw) {
    throw new Error(`No school config found for '${slug}'. Known: ${knownSchools().join(', ') || '(none)'}.`)
  }

  const parsed = SchoolConfig.safeParse(raw)
  if (!parsed.success) {
    const detail = parsed.error.issues.map(i => `  - ${i.path.join('.') || '(root)'}: ${i.message}`).join('\n')
    throw new Error(`schools/${slug}.json is invalid:\n${detail}`)
  }
  return {
    ...parsed.data,
    variants: resolveVariants(parsed.data.design, parsed.data.variants),
  }
}
