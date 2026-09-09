import { dataKeys, type DataKey, type ParamsOf, type ResultOf } from './keys.js'

/** A backend. Implementations return raw unknown payloads; validation happens here, once. */
export interface DataSource {
  readonly name: string
  fetch(key: DataKey, params: Record<string, unknown>): Promise<unknown>
}

export class DataError extends Error {
  constructor(readonly key: DataKey, readonly cause: unknown) {
    super(`data.get('${key}') failed: ${cause instanceof Error ? cause.message : String(cause)}`)
    this.name = 'DataError'
  }
}

export interface Client {
  get<K extends DataKey>(key: K, params?: ParamsOf<K>): Promise<ResultOf<K>>
}

/**
 * Wraps a source with parameter and result validation.
 * Nothing unvalidated leaves this module — that is the whole contract of the data layer.
 */
export function createClient(source: DataSource, opts: { strict?: boolean } = {}): Client {
  const strict = opts.strict ?? import.meta.env?.DEV ?? false

  return {
    async get(key, params) {
      const spec = dataKeys[key]
      const parsedParams = spec.params.parse(params ?? {})

      let raw: unknown
      try {
        raw = await source.fetch(key, parsedParams as Record<string, unknown>)
      } catch (cause) {
        throw new DataError(key, cause)
      }

      const result = spec.result.safeParse(raw)
      if (result.success) return result.data as never

      // Malformed upstream data is a bug. Shout in development; never break a live page.
      if (strict) throw new DataError(key, result.error)
      console.error(`[data] '${key}' returned data that does not match its contract`, result.error.issues)
      return emptyFallback(key) as never
    },
  }
}

/** A shape-correct empty value so a page renders its empty state instead of crashing. */
function emptyFallback(key: DataKey): unknown {
  if (key.endsWith('.bySlug') || key === 'gallery.album') return null
  if (key === 'site.navigation') return { primary: [], utility: [], footer: [] }
  if (key === 'site.stats') return []
  if (key === 'site.profile') return { name: {}, phones: [], emails: [], social: {} }
  return { items: [], page: 1, pageSize: 0, total: 0 }
}
