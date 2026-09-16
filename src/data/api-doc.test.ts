import { describe, expect, it } from 'vitest'
import type { ZodType } from 'zod'
import { createClient, dataKeys, endpoints, fixtureSource, formEndpoints, formKeys } from './index.js'
import type { DataKey, FormKey } from './index.js'

/**
 * Generates docs/API.md from the contracts themselves.
 *
 * The file is a snapshot, so the document cannot drift from what the site actually
 * requests: change a key, a parameter or a shape, and this test fails until the
 * document is regenerated with `npx vitest -u`.
 */

/** Unwraps .default()/.optional() so the underlying object shape can be read. */
function shapeOf(schema: ZodType): Record<string, ZodType> {
  let current: unknown = schema
  for (let depth = 0; depth < 5; depth++) {
    const def = (current as { def?: { type?: string; innerType?: unknown; shape?: unknown } }).def
    if (!def) break
    if (def.shape) return def.shape as Record<string, ZodType>
    if (def.innerType) { current = def.innerType; continue }
    break
  }
  return {}
}

function describeParams(schema: ZodType): string {
  const shape = shapeOf(schema)
  const names = Object.keys(shape)
  if (names.length === 0) return '_none_'

  return names.map(name => {
    const field = shape[name]
    const optional = field ? field.safeParse(undefined).success : false
    return optional ? `\`${name}\` _(optional)_` : `\`${name}\` **(required)**`
  }).join(', ')
}

/** Keeps examples readable: two items is enough to show the shape of a list. */
function trim(value: unknown): unknown {
  if (Array.isArray(value)) return value.slice(0, 2).map(trim)
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, inner]) => [key, trim(inner)]))
  }
  return value
}

const exampleParams: Partial<Record<DataKey, Record<string, unknown>>> = {
  'notice.bySlug': { slug: 'admission-2026' },
  'page.bySlug': { slug: 'about' },
  'person.list': { group: 'teachers' },
  'event.bySlug': { slug: 'annual-sports-2026' },
  'gallery.album': { slug: 'annual-sports-2026' },
  'routine.byClass': { class: 'nine' },
  'result.lookup': { exam: 'half-yearly-2026', roll: '101' },
  'site.search': { q: 'admission' },
}

describe('API documentation', () => {
  it('matches the contracts the site actually calls', async () => {
    const client = createClient(fixtureSource(), { strict: true })
    const lines: string[] = [
      '# The content API',
      '',
      'Everything this site shows comes from one API. This document is generated from the',
      'site\'s own contracts, so it is always what the code really requests — if it says a',
      'field exists, the site reads that field.',
      '',
      '## How it is called',
      '',
      'Every request carries:',
      '',
      '| Header | Value |',
      '|---|---|',
      '| `accept` | `application/json` |',
      '| `x-api-key` | the school\'s key, from `CONTENT_API_KEY` |',
      '| `x-tenant` | the school identifier, when one is configured |',
      '',
      'Paths below are relative to the configured base URL. A `404` is read as "this does',
      'not exist" and renders an empty state; any other non-2xx is an error. Requests time',
      'out after 8 seconds.',
      '',
      'Lists are always paginated and must answer with',
      '`{ items, page, pageSize, total }`.',
      '',
      '## Reading content',
      '',
    ]

    for (const key of Object.keys(dataKeys) as DataKey[]) {
      const params = exampleParams[key] ?? {}
      const example = await client.get(key, params as never)

      lines.push(
        `### \`${key}\``,
        '',
        `\`GET ${endpoints[key]}\``,
        '',
        `Parameters: ${describeParams(dataKeys[key].params as ZodType)}`,
        '',
        'Example response:',
        '',
        '```json',
        JSON.stringify(trim(example), null, 2),
        '```',
        '',
      )
    }

    lines.push('## Receiving submissions', '')

    for (const key of Object.keys(formKeys) as FormKey[]) {
      lines.push(
        `### \`${key}\``,
        '',
        `\`POST ${formEndpoints[key]}\` with a JSON body`,
        '',
        `Fields: ${describeParams(formKeys[key].input as ZodType)}`,
        '',
        'Answer with `{ "ok": true, "reference": "ADM-4821" }`. The reference is shown to',
        'the sender so they can quote it to the office.',
        '',
      )
    }

    await expect(`${lines.join('\n').trimEnd()}\n`).toMatchFileSnapshot('../../docs/API.md')
  })
})
