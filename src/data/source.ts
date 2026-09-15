import { dataKeys, type DataKey, type ParamsOf, type ResultOf } from './keys.js'
import { formKeys, type FormKey, type InputOf, type ReceiptOf } from './forms.js'

/** A backend. Implementations return raw unknown payloads; validation happens here, once. */
export interface DataSource {
  readonly name: string
  fetch(key: DataKey, params: Record<string, unknown>): Promise<unknown>
  /** Sends something a visitor submitted. Absent on sources that are read-only. */
  submit?(key: FormKey, payload: Record<string, unknown>): Promise<unknown>
}

export class DataError extends Error {
  constructor(readonly key: DataKey, readonly cause: unknown) {
    super(`data.get('${key}') failed: ${cause instanceof Error ? cause.message : String(cause)}`)
    this.name = 'DataError'
  }
}

export interface Client {
  get<K extends DataKey>(key: K, params?: ParamsOf<K>): Promise<ResultOf<K>>
  submit<K extends FormKey>(key: K, payload: InputOf<K>): Promise<ReceiptOf<K>>
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

    async submit(key, payload) {
      const spec = formKeys[key]
      // The payload is validated before it leaves us; the caller has already reported
      // any field errors to the visitor by this point.
      const parsed = spec.input.parse(payload)

      if (!source.submit) throw new DataError(key as never, new Error(`source '${source.name}' cannot accept submissions`))

      let raw: unknown
      try {
        raw = await source.submit(key, parsed as Record<string, unknown>)
      } catch (cause) {
        throw new DataError(key as never, cause)
      }

      const result = spec.result.safeParse(raw)
      if (result.success) return result.data as never
      throw new DataError(key as never, result.error)
    },
  }
}

/** A shape-correct empty value so a page renders its empty state instead of crashing. */
function emptyFallback(key: DataKey): unknown {
  switch (key) {
    case 'site.navigation': return { primary: [], utility: [], footer: [] }
    case 'site.profile': return { name: {}, phones: [], emails: [], social: {} }
    case 'site.stats':
    case 'routine.classes':
    case 'result.exams': return []
    case 'gallery.album':
    case 'routine.byClass':
    case 'result.lookup': return null
    default:
      return key.endsWith('.bySlug') ? null : { items: [], page: 1, pageSize: 0, total: 0 }
  }
}
